"""Censo y extracción reproducibles. Ninguna coincidencia acepta reglas fiscales."""
from __future__ import annotations

import argparse
from collections import Counter
from decimal import Decimal
import hashlib
from functools import lru_cache
import importlib.metadata
import platform
import os
import json
from pathlib import Path
import re
import shutil
import shlex
import subprocess
import sys
import tempfile
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from cas import ordinary_path  # noqa: E402
from descargar import DEFAULT_HOSTS, check_url  # noqa: E402
from corpus import extract, geometry, selectors  # noqa: E402
import pymupdf  # noqa: E402
import jsonschema  # noqa: E402

PILOT_MAPPING_SHA256 = "35955e153054f6e1f520227208fa7a0b0088c6f95830cbb55df337af4e911e3a"

OBLIGATIONS_SHA256 = "8b63636058d79ebff248f7f083baf857d2c6fa6a6962a95a6b42f0012cea847b"

Json = Any


def encode(value: Json) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False) + '\n').encode()


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def put(root: Path, raw: bytes, media: str = 'application/json') -> dict:
    target = root / digest(raw)
    if target.exists():
        if target.read_bytes() != raw:
            raise ValueError('CAS corrupto')
    else:
        with target.open('xb') as stream:
            stream.write(raw)
    return {'sha256': digest(raw), 'size': len(raw), 'mediaType': media}


class Store:
    """Raíces de objetos planas, incluida la forma sha256/ del corpus."""
    def __init__(self, roots: list[Path]):
        self.roots = [ordinary_path(p) for p in roots]

    def read(self, ref: dict) -> bytes:
        for root in self.roots:
            path = ordinary_path(root / ref['sha256'])
            if path.exists():
                raw = path.read_bytes()
                if digest(raw) != ref['sha256'] or len(raw) != ref['size']:
                    raise ValueError('Objeto corrupto')
                return raw
        raise ValueError('Objeto ausente: ' + ref['sha256'])


def number(literal: str, unit: str) -> str:
    if unit not in ('EUR', 'percent', 'index', 'proportion'):
        raise ValueError('Unidad desconocida')
    if literal == '':
        raise ValueError('Caja vacía: no acredita ausencia explícita')
    if literal in ('—', '–', '-', '----'):
        return 'absent'
    if literal == 'En adelante':
        if unit != 'EUR':
            raise ValueError('Centinela con unidad incompatible')
        return 'Infinity'
    if not re.fullmatch(r'[+-]?(?:[0-9]{1,3}(?:\.[0-9]{3})+|[0-9]+)(?:,[0-9]+)?', literal):
        raise ValueError('Número/signo/separadores ambiguos: ' + literal)
    return str(Decimal(literal.replace('.', '').replace(',', '.')))


def declared_number(literal: str, spec: dict) -> str:
    variant = spec.get('literalVariant')
    if variant is None:
        return number(literal, spec['unit'])
    if literal != variant['literal']:
        raise ValueError('Variante literal distinta')
    if variant['kind'] == 'open' and spec['unit'] == 'EUR' and literal in ('En adelante', 'en adelante', 'En adelante.'):
        return 'Infinity'
    if variant['kind'] == 'percent-suffix' and spec['unit'] == 'percent' and literal.endswith('%'):
        return number(literal[:-1], 'percent')
    raise ValueError('Variante de número no admitida')


def physical_number(literal: str, spec: dict, words: list) -> str:
    # Two separately emitted PDF tokens, both wholly inside the selected cell.
    # Keep the original literal and boxes; never repair an interior number space.
    if len(words) == 2 and words[0][4] in ('+', '-') and literal == words[0][4] + ' ' + words[1][4]:
        box = pymupdf.Rect(spec['bbox'])
        if all(box.contains(pymupdf.Rect(w[:4])) for w in words):
            return declared_number(words[0][4] + words[1][4], spec)
    return declared_number(literal, spec)


def pdf_table(store: Store, table: dict) -> list[dict]:
    raw = store.read(table['document'])
    cells = []
    with pymupdf.open(stream=raw, filetype='pdf') as document:
        page = document[table['page'] - 1]
        for spec in table['cells']:
            quote = extract(page, spec['bbox'])
            box = pymupdf.Rect(spec['bbox'])
            selected = [w for w in page.get_text('words', flags=0, sort=True) if box.contains(pymupdf.Rect(w[:4]))]
            literal = ' '.join(w[4] for w in selected)
            for word in page.get_text('words', flags=0):
                if word[4] not in ('+', '-', '−', '–', '—') or word in selected:
                    continue
                for chosen in selected:
                    overlap = min(word[3], chosen[3]) - max(word[1], chosen[1])
                    height = min(word[3] - word[1], chosen[3] - chosen[1])
                    gap = max(chosen[0] - word[2], word[0] - chosen[2], 0)
                    # Geometric ambiguity guard, independent of font size and PDF text blocks.
                    if height > 0 and overlap >= height / 2 and gap < 12:
                        raise ValueError('Signo próximo fuera de la celda')
            normalized = physical_number(literal, spec, selected)
            cells.append({**spec, 'quote': quote, 'literal': literal, 'normalized': normalized,
                          'words': [list(w[:5]) for w in selected],
                          'normalization': 'fully-contained-words; explicit-contained-sign-token; es-grouping-dot-decimal-comma; declared-variant',
                          'document': table['document'], 'page': table['page'],
                          'table': table['code'], 'year': table['year'], 'territory': table['territory'],
                          'geometry': geometry(page), 'selectors': selectors(table['page'], spec['bbox'], quote)})
    return cells


def json_positions(text: str) -> dict[str, tuple[int, int]]:
    """Parse JSON tokens structurally; duplicated keys cannot identify a pointer."""
    decoder = json.JSONDecoder(parse_float=Decimal)
    positions: dict[str, tuple[int, int]] = {}

    def whitespace(index: int) -> int:
        while index < len(text) and text[index].isspace():
            index += 1
        return index

    def visit(index: int, pointer: str) -> int:
        index = whitespace(index)
        start = index
        char = text[index]
        if char in '{[':
            closing = '}' if char == '{' else ']'
            index = whitespace(index + 1)
            count = 0
            keys: set[str] = set()
            while text[index] != closing:
                if count:
                    if text[index] != ',':
                        raise ValueError('Separador JSON inválido')
                    index = whitespace(index + 1)
                if char == '{':
                    key, index = decoder.raw_decode(text, index)
                    if not isinstance(key, str) or key in keys:
                        raise ValueError('Clave JSON duplicada/inválida')
                    keys.add(key)
                    index = whitespace(index)
                    if text[index] != ':':
                        raise ValueError('Clave JSON sin valor')
                    index += 1
                    key = key.replace('~', '~0').replace('/', '~1')
                else:
                    key = str(count)
                index = whitespace(visit(index, pointer + '/' + key))
                count += 1
            index += 1
        else:
            _, index = decoder.raw_decode(text, index)
        positions[pointer] = (start, index)
        return index

    if whitespace(visit(0, '')) != len(text):
        raise ValueError('JSON con contenido sobrante')
    return positions


def ine_table(store: Store, table: dict) -> list[dict]:
    raw = store.read(table['document'])
    text = raw.decode('utf-8')
    data = json.loads(text, parse_float=Decimal)
    if data['COD'] != table['series'] or data['FK_Unidad'] != 133 or data['FK_Escala'] != 1 or len(data['Data']) != table['rows']:
        raise ValueError('Serie/unidad/escala/cobertura INE distinta')
    positions = json_positions(text)
    cells = []
    for index, (spec, row) in enumerate(zip(table['cells'], data['Data'], strict=True)):
        if spec['row'] != str(index):
            raise ValueError('Fila INE distinta del índice JSON Pointer')
        start, end = positions['/Data/' + str(index) + '/Valor']
        literal = text[start:end]
        if not re.fullmatch(r'-?[0-9]+(?:\.[0-9]+)?', literal):
            raise ValueError('Literal INE no numérico decimal')
        if Decimal(literal) != row['Valor'] or row['Secreto'] or row['FK_TipoDato'] != 1:
            raise ValueError('Valor secreto o tipo INE no admitido')
        cells.append({**spec, 'table':table['code'], 'year':table['year'], 'territory':table['territory'],
                      'dataYear':row['Anyo'], 'period':row['FK_Periodo'], 'page':None,
                      'quote':literal, 'literal':literal, 'normalized':str(Decimal(literal)),
                      'normalization':'decimal-identity', 'document':table['document'],
                      'selectors':[{'type':'JsonPointer', 'value':'/Data/' + spec['row'] + '/Valor'},
                                   {'type':'TextPositionSelector', 'start':start, 'end':end}]})
    return cells


def normalized_cell(cell: dict) -> str:
    if cell.get('numberFormat') == 'decimal':
        if not re.fullmatch(r'-?[0-9]+(?:\.[0-9]+)?', cell['literal']) or cell['unit'] != 'index':
            raise ValueError('Formato/unidad JSON alterados')
        return str(Decimal(cell['literal']))
    return physical_number(cell['literal'], cell, cell.get('words', []))


def engine_value(items: list[dict], binding: dict) -> Decimal:
    matches = [i for i in items if i['layer'] == 'effective' and i['source']['file'] == binding['file']
               and i['symbol'] == binding['symbol'] and json.loads(i['path']) == binding['path']]
    if len(matches) != 1:
        raise ValueError('Binding ausente o duplicado')
    return Decimal(matches[0]['value'])


def evaluate(items: list[dict], expression: dict) -> Decimal:
    if 'binding' in expression:
        return engine_value(items, expression['binding'])
    args = [evaluate(items, child) for child in expression['args']]
    if expression['op'] == 'subtract' and len(args) == 2:
        return args[0] - args[1]
    if expression['op'] == 'sum':
        return sum(args, Decimal(0))
    if expression['op'] == 'percent' and len(args) == 1:
        return args[0] * 100
    raise ValueError('Operación no admitida')


def validate_obligations(tables: list[dict], obligations: list[dict]) -> None:
    """Registro revisado separado del mapping; no se deriva de la extracción."""
    fields = ('code', 'year', 'territory', 'document', 'page', 'format', 'series', 'rows')
    actual = [{**{k: t.get(k) for k in fields},
               'cells': [{k: c.get(k) for k in ('row', 'column', 'bbox', 'unit', 'numberFormat', 'literalVariant')} for c in t['cells']]}
              for t in tables]
    expected = [{**{k: t.get(k) for k in fields},
                 'cells': [{k: c.get(k) for k in ('row', 'column', 'bbox', 'unit', 'numberFormat', 'literalVariant')} for c in t['cells']]}
                for t in obligations]
    if actual != expected:
        raise ValueError('Obligaciones revisadas omitidas o alteradas')


def load_registry(repo: Path, path: Path | None, expected_sha256: str | None) -> tuple[dict, bytes, dict]:
    """La selección técnica no es una revisión de las obligaciones recibidas."""
    if (path is None) != (expected_sha256 is None):
        raise ValueError('Registro y SHA256 esperado deben declararse juntos')
    pilot_path = repo / 'docs/procedencia/datos-2012-2026/obligaciones.json'
    pilot_raw = pilot_path.read_bytes()
    if digest(pilot_raw) != OBLIGATIONS_SHA256:
        raise ValueError('Registro piloto cambió: requiere revisión explícita')
    expected = OBLIGATIONS_SHA256 if path is None else expected_sha256
    if not isinstance(expected, str) or re.fullmatch(r'[0-9a-f]{64}', expected) is None:
        raise ValueError('SHA256 esperado inválido')
    raw = pilot_raw if path is None else path.read_bytes()
    if digest(raw) != expected:
        raise ValueError('Registro distinto del SHA256 esperado declarado')
    json_positions(raw.decode('utf-8'))  # También rechaza claves duplicadas.
    registry = json.loads(raw)
    schema_path = 'unidades-y-enlaces/schema-v2.json' if registry.get('version') == 2 else 'contrato-obligaciones-lotes/schema.json'
    schema = json.loads((repo / 'docs/procedencia/datos-2012-2026' / schema_path).read_bytes())
    jsonschema.Draft202012Validator(schema).validate(registry)
    codes = set()
    for table in registry['tables']:
        if table['code'] in codes:
            raise ValueError('Tabla de obligaciones duplicada')
        codes.add(table['code'])
        keys = [(c['row'], c['column']) for c in table['cells']]
        if len(set(keys)) != len(keys):
            raise ValueError('Celda de obligaciones duplicada')
        is_json = table.get('format') == 'ine-json'
        if is_json:
            if 'page' in table or not all(k in table for k in ('series', 'rows')):
                raise ValueError('Selectores INE incompletos')
            if table['rows'] != len(keys) or [c['row'] for c in table['cells']] != [str(i) for i in range(table['rows'])]:
                raise ValueError('Cobertura INE incompleta')
        elif 'page' not in table or any(k in table for k in ('series', 'rows')):
            raise ValueError('Posición física PDF incompleta')
        for cell in table['cells']:
            boxes = [cell['bbox']]
            proof = cell['unitEvidence']
            if is_json:
                if cell['bbox'] is not None or cell.get('numberFormat') != 'decimal' or cell['unit'] != 'index':
                    raise ValueError('Celda INE inválida')
                if proof is not None and proof != {'FK_Unidad':133, 'FK_Escala':1}:
                    raise ValueError('Prueba de unidad INE inválida')
            else:
                if cell['bbox'] is None or 'numberFormat' in cell:
                    raise ValueError('Caja PDF inválida')
                if proof is not None:
                    if 'bbox' not in proof or proof['unit'] != cell['unit']:
                        raise ValueError('Enlace de unidad PDF inválido')
                    boxes.append(proof['bbox'])
            for box in boxes:
                if box is not None and not (box[0] < box[2] and box[1] < box[3]):
                    raise ValueError('Geometría de obligación inválida')
    if registry['version'] == 2:
        validate_links(registry, repo)
    # Un registro recibido no puede inventar acreditaciones de unidades del motor.
    reviewed = json.loads(pilot_raw)['semantics']
    for binding, proof in registry['semantics'].items():
        if registry['version'] == 1 and reviewed.get(binding) != proof:
            raise ValueError('Semántica nueva requiere revisión separada')
        if registry['version'] == 2:
            expression_unit({'binding':json.loads(binding)}, registry['semantics'], repo)
    if registry['version'] == 1 and registry['semantics']:
        pilot = json.loads(pilot_raw)
        mapping_raw = (repo / 'docs/procedencia/datos-2012-2026/tablas.json').read_bytes()
        if digest(mapping_raw) != PILOT_MAPPING_SHA256:
            raise ValueError('Mapping histórico piloto alterado')
        pilot_mapping = json.loads(mapping_raw)
        for table in registry['tables']:
            if table not in pilot['tables']:
                raise ValueError('Semántica legacy fuera del ámbito piloto; use contrato v2')
            original = next(t for t in pilot_mapping if t['code'] == table['code'])
            for cell, spec in zip(table['cells'], original['cells'], strict=True):
                cell['engineExpression'] = spec.get('expression')
    return registry, raw, {'expectedSha256':expected,
                           'selection':'pilot' if path is None else 'explicit',
                           'validation':'structure-coverage-evidence-checked',
                           'review':'pilot-pinned-scope' if path is None else 'pending',
                           'legalAcceptance':'pending'}


def validate_links(registry: dict, repo: Path) -> None:
    used = set()
    for retired in registry.get('retirements', []):
        key = encode(retired['previousBinding']).decode().strip()
        if registry['semantics'].get(key, {}).get('sourceSha256') == retired['previousSourceSha256']:
            raise ValueError('Binding retirado reutilizado como evidencia viva')
    for table in registry['tables']:
        for cell in table['cells']:
            scope = {k:table[k] for k in ('code', 'year', 'territory')}
            scope.update({k:cell[k] for k in ('row', 'column', 'subject', 'conditions')})
            def walk(expression):
                if expression is None:
                    return
                if set(expression) == {'binding'}:
                    binding = expression['binding']
                    if set(binding) != {'file', 'symbol', 'path'} or not isinstance(binding['path'], list):
                        raise ValueError('Binding inválido')
                    file = Path(binding['file'])
                    if file.is_absolute() or '..' in file.parts or not (repo / file).resolve().is_relative_to(repo.resolve()):
                        raise ValueError('Fuente fuera del repositorio')
                    key = encode(binding).decode().strip()
                    proof = registry['semantics'].get(key)
                    if proof is None or scope not in proof['targets']:
                        raise ValueError('Binding trasplantado o ámbito sin declarar')
                    used.add(key)
                elif set(expression) == {'op', 'args'} and expression['op'] in ('sum', 'subtract', 'percent'):
                    args = expression['args']
                    if not isinstance(args, list) or not args or (expression['op'] == 'percent' and len(args) != 1) or (expression['op'] == 'subtract' and len(args) != 2):
                        raise ValueError('Aridad inválida')
                    for child in args:
                        walk(child)
                else:
                    raise ValueError('Expresión de unidad inventada')
            walk(cell['engineExpression'])
    if used != set(registry['semantics']):
        raise ValueError('Semántica sin correspondencia')


def evidence_unit(store: Store, table: dict, obligation: dict) -> bool:
    proof = obligation.get('unitEvidence')
    if proof is None:
        return False
    if table.get('format') == 'ine-json':
        data = json.loads(store.read(table['document']))
        if proof != {'FK_Unidad': 133, 'FK_Escala': 1} or obligation['unit'] != 'index':
            raise ValueError('Prueba de unidad INE inválida')
        return data['FK_Unidad'] == 133 and data['FK_Escala'] == 1
    with pymupdf.open(stream=store.read(table['document']), filetype='pdf') as document:
        page = document[table['page'] - 1]
        if not page.rect.contains(pymupdf.Rect(proof['bbox'])):
            raise ValueError('Cabecera fuera de página')
        box = pymupdf.Rect(proof['bbox'])
        words = [w for w in page.get_text('words', flags=0, sort=True) if box.contains(pymupdf.Rect(w[:4]))]
        literal = ' '.join(w[4] for w in words)
    if literal != proof['literal'] or proof['unit'] != obligation['unit']:
        raise ValueError('Cabecera de unidad no reproducible')
    if 'relation' in proof:
        tokens = {'EUR': r'(?<!\w)(?:euros|Euros|EUR)(?!\w)|€',
                  'percent': r'%|(?<!\w)(?:Porcentaje|porcentaje)(?!\w)',
                  'proportion': r'(?<!\w)(?:proporción|fracción|por uno)(?!\w)',
                  'index': r'(?<!\w)(?:Índice|índice|Index|index)(?!\w)'}
        if re.search(tokens[proof['unit']], literal) is None:
            raise ValueError('Expresión literal de unidad sin acreditar')
        if not words:
            raise ValueError('Cabecera sin palabras')
        # La caja declarada selecciona texto; no acredita su posición efectiva.
        header = pymupdf.Rect(min(w[0] for w in words), min(w[1] for w in words),
                             max(w[2] for w in words), max(w[3] for w in words))
        cell = pymupdf.Rect(obligation['bbox'])
        relation = proof['relation']
        if relation == 'column':
            valid = header.y1 <= cell.y0 and min(header.x1, cell.x1) > max(header.x0, cell.x0)
            valid = valid and any(min(w[2], cell.x1) > max(w[0], cell.x0) for w in words)
        else:
            overlap = min(header.y1, cell.y1) - max(header.y0, cell.y0)
            valid = relation == 'adjacent' and overlap > 0 and 0 <= header.x0 - cell.x1 <= 24
        if relation == 'column':
            for other in table['cells']:
                if other['row'] == obligation['row'] and other['column'] != obligation['column']:
                    foreign = pymupdf.Rect(other['bbox'])
                    if header.x0 <= (foreign.x0 + foreign.x1) / 2 <= header.x1:
                        valid = False
        if not valid:
            raise ValueError('Cabecera ajena a columna/celda')
        return True
    # Cabeceras del piloto: no se infiere una unidad de cualquier texto arbitrario.
    if (proof['unit'], literal) not in (('EUR', 'Base liquidable hasta euros'),
                                        ('EUR', 'Cuota íntegra euros'),
                                        ('EUR', 'Resto base liquidable hasta euros'),
                                        ('percent', 'Tipo aplicable Porcentaje'),
                                        ('EUR', 'Base liquidable - Hasta euros'),
                                        ('EUR', 'Incremento en cuota íntegra estatal euros'),
                                        ('EUR', 'Resto base liquidable - Hasta euros'),
                                        ('percent', 'Tipo aplicable - Porcentaje')):
        raise ValueError('Relación semántica de cabecera sin acreditar')
    return True


@lru_cache(maxsize=4096)
def binding_position(repo: str, source: str, symbol: str, path: str, source_hash: str, resolver_hash: str) -> dict:
    # Both preimages are part of the key; edits cannot reuse a cached position.
    return json.loads(subprocess.check_output(['bun', '--no-install', str(Path(repo) / 'tools/procedencia/datos/binding-position.mjs'), source, symbol, path], text=True))


def expression_unit(expression: dict, semantics: dict, repo: Path) -> str | None:
    if 'binding' in expression:
        binding = expression['binding']
        proof = semantics.get(encode(binding).decode().strip())
        if proof is None:
            return None
        source = repo / binding['file']
        if digest(source.read_bytes()) != proof['sourceSha256'] or proof['quote'] not in source.read_text():
            raise ValueError('Semántica del campo sin fuente reproducible')
        if 'position' in proof:
            position = binding_position(str(repo), str(source), binding['symbol'], json.dumps(binding['path']), digest(source.read_bytes()), digest((repo / 'tools/procedencia/datos/binding-position.mjs').read_bytes()))
            if position != {**proof['position'], 'quote':proof['quote'], **({'adapter':proof['adapter']} if 'adapter' in proof else {})}:
                raise ValueError('Posición/propiedad del binding distinta')
        return proof['unit']
    units = [expression_unit(child, semantics, repo) for child in expression['args']]
    if expression['op'] == 'percent' and units == ['proportion']:
        return 'percent'
    if expression['op'] == 'subtract' and units == ['EUR', 'EUR']:
        return 'EUR'
    if expression['op'] == 'sum' and units and all(unit == 'EUR' for unit in units):
        return 'EUR'
    return None


def validate_engine_scope(expression: dict | None, items: list[dict], table: dict, semantics: dict) -> None:
    if expression is None:
        return
    if 'binding' not in expression:
        for child in expression['args']:
            validate_engine_scope(child, items, table, semantics)
        return
    binding = expression['binding']
    matches = [i for i in items if i['layer'] == 'effective' and i['source']['file'] == binding['file']
               and i['symbol'] == binding['symbol'] and json.loads(i['path']) == binding['path']]
    if len(matches) != 1:
        raise ValueError('Binding ausente o duplicado')
    item = matches[0]
    if item.get('years') and table['year'] not in item['years']:
        raise ValueError('Anualidad del código distinta del lote')
    if item.get('territories') and table['territory'] not in item['territories']:
        raise ValueError('Territorio del código distinto del lote')
    known = {'EUR':'EUR', 'EUR (mínimo anual del código)':'EUR',
             'EUR (límite de base; periodicidad pendiente)':'EUR',
             'proporción por uno':'proportion', 'porcentaje por cien':'percent'}
    inferred = known.get(item.get('unit'))
    proof = semantics[encode(binding).decode().strip()]
    if inferred is not None and proof['unit'] != inferred:
        raise ValueError('Unidad declarada contradice propiedad del código')


def compare(tables: list[dict], cells: list[dict], items: list[dict], *,
            obligations: list[dict] | None = None, store: Store | None = None,
            semantics: dict | None = None, repo: Path | None = None) -> list[dict]:
    """Cotejo numérico. No autentica extracción: usar run/--verify para ello."""
    if obligations is None or store is None:
        raise ValueError('Se requieren obligaciones independientes y originales')
    validate_obligations(tables, obligations)
    expected = [(t['code'], c['row'], c['column']) for t in tables for c in t['cells']]
    actual = [(c['table'], c['row'], c['column']) for c in cells]
    if Counter(expected) != Counter(actual) or any(n != 1 for n in Counter(actual).values()):
        raise ValueError('Cobertura incompleta/sobrante/duplicada')
    results = []
    lookup = {(c['table'], c['row'], c['column']): c for c in cells}
    for table, obligation_table in zip(tables, obligations, strict=True):
        for spec, obligation in zip(table['cells'], obligation_table['cells'], strict=True):
            cell = lookup[table['code'], spec['row'], spec['column']]
            if 'subject' in obligation and any(spec.get(k) != obligation[k] for k in ('subject','conditions')):
                raise ValueError('Sujeto/condiciones distintos')
            if 'engineExpression' in obligation and spec.get('expression') != obligation['engineExpression']:
                raise ValueError('Correspondencia distinta de obligación independiente')
            for key in ('unit', 'bbox', 'expression', 'numberFormat', 'literalVariant', 'subject', 'conditions'):
                if cell.get(key) != spec.get(key):
                    raise ValueError('Celda alterada: ' + key)
            if cell['year'] != table['year'] or cell['territory'] != table['territory']:
                raise ValueError('Ámbito alterado')
            if cell['document'] != table['document'] or cell['page'] != table.get('page'):
                raise ValueError('Documento o página alterados')
            source_unit = evidence_unit(store, table, obligation)
            if normalized_cell(cell) != cell['normalized']:
                raise ValueError('Normalización alterada')
            if 'subject' in obligation:
                validate_engine_scope(spec.get('expression'), items, table, semantics or {})
            observed = None
            if spec.get('expression') is not None:
                observed = str(evaluate(items, spec['expression']))
            motor_unit = expression_unit(spec['expression'], semantics or {}, repo) if spec.get('expression') is not None and repo is not None else None
            reason = 'source-unit-unproven' if not source_unit else 'no-binding-in-reviewed-inventory' if observed is None else 'engine-field-or-operation-unit-unproven' if motor_unit is None else 'unit-mismatch' if motor_unit != cell['unit'] else None
            status = 'extraction-absent' if cell['normalized'] == 'absent' else 'not-verifiable' if reason is not None or observed is None else 'match' if Decimal(observed) == Decimal(cell['normalized']) else 'difference'
            results.append({'code':table['code'], 'year':cell.get('dataYear', table['year']), 'period':cell.get('period'), 'territory':table['territory'],
                            'row':spec['row'], 'column':spec['column'], 'expected':cell['normalized'],
                            'observed':observed, 'unit':cell['unit'], 'status':status, 'reason':reason,
                            'authentication':'numeric-only; use run/--verify',
                            'document':cell['document'], 'page':cell['page'], 'bbox':cell['bbox']})
    return results


def catalog(repo: Path, store: Store) -> list[dict]:
    found: dict[str, dict] = {}
    def walk(value: Json, source: str) -> None:
        if isinstance(value, dict):
            if all(k in value for k in ('sha256', 'size', 'canonicalUrl')):
                if value['sha256'] in found:
                    return
                url = value['canonicalUrl']
                try:
                    check_url(url, DEFAULT_HOSTS)
                except ValueError:
                    return
                ref = {k:value[k] for k in ('sha256', 'size')}
                try:
                    store.read(ref)
                    availability = 'bytes-verified'
                except ValueError as error:
                    availability = 'absent' if str(error).startswith('Objeto ausente') else 'corrupt'
                found[value['sha256']] = {**ref, 'url':url, 'mediaType':value.get('mimeType'),
                    'availability':availability, 'audit':source, 'publication':value.get('publicationDate'),
                    'dataPeriod':None, 'validity':None, 'editorialYear':None}
            else:
                for child in value.values():
                    walk(child, source)
        elif isinstance(value, list):
            for child in value:
                walk(child, source)
    for directory in ('escalas-estatales-ahorro', 'minimos', 'retenciones-2020-2026', 'seguridad-social', 'ipc-redondeos', 'cadena-autonomica-a', 'cadena-autonomica-b', 'cadena-autonomica-c'):
        for path in sorted((repo / 'docs/procedencia/auditorias' / directory).glob('*.json')):
            walk(json.loads(path.read_bytes()), str(path.relative_to(repo)))
    return sorted(found.values(), key=lambda x: x['sha256'])


def run(repo: Path, cas: Path, roots: list[Path], work: Path, mapping: Path, base: str, *,
        obligations: Path | None = None, obligations_sha256: str | None = None) -> dict:
    if re.fullmatch(r'[0-9a-f]{40}', base) is None:
        raise ValueError('Base debe ser SHA completo declarado')
    if cas.is_relative_to(repo) or work.is_relative_to(repo):
        raise ValueError('CAS y temporales deben ser externos')
    cas.mkdir(parents=True, exist_ok=True)
    work.mkdir(parents=True, exist_ok=True)
    store = Store([cas, *roots])
    registry, registry_raw, selection = load_registry(repo, obligations, obligations_sha256)
    tables = json.loads(mapping.read_bytes())
    validate_obligations(tables, registry['tables'])
    for table in registry['tables']:
        store.read(table['document'])
        for cell in table['cells']:
            evidence_unit(store, table, cell)
    folder = Path(tempfile.mkdtemp(prefix='censo-', dir=work))
    runtime_args = ['--no-install']
    runtime_root = os.environ.get('DATOS_RUNTIME_ROOT')
    if runtime_root is not None:
        config = Path(tempfile.mkdtemp(prefix='runtime-', dir=work)) / 'tsconfig.json'
        config.write_bytes(subprocess.check_output(['bun', '--no-install', str(repo / 'tools/procedencia/datos/runtime-resolver.mjs'), runtime_root]))
        runtime_args += ['--tsconfig-override', str(config)]
    subprocess.run(['bun', *runtime_args, str(repo / 'tools/procedencia/datos/censo.mjs'), str(repo), str(folder)], check=True,
                   env={**os.environ, 'BUN_OPTIONS':shlex.join(runtime_args), 'BUN_RUNTIME_TRANSPILER_CACHE_PATH':'0'})
    summary = json.loads((folder / 'inventario.json').read_bytes())
    items = [item for page in summary['pages'] for item in json.loads((folder / page['file']).read_bytes())]
    cells = [cell for table in tables for cell in (ine_table(store, table) if table.get('format') == 'ine-json' else pdf_table(store, table))]
    results = compare(tables, cells, items, obligations=registry['tables'], store=store, semantics=registry['semantics'], repo=repo)
    censo = json.loads((folder / 'censo-completo.json').read_bytes())
    artifacts = {p.name:put(cas, p.read_bytes()) for p in sorted(folder.iterdir())}
    artifacts['extraction'] = put(cas, encode(cells))
    artifacts['comparison'] = put(cas, encode(results))
    artifacts['queue'] = put(cas, encode([r for r in results if r['status'] != 'match']))
    sources = catalog(repo, store)
    artifacts['catalog'] = put(cas, encode(sources))
    artifacts['mapping'] = put(cas, mapping.read_bytes())
    artifacts['obligations'] = put(cas, registry_raw)
    counts = Counter(r['status'] for r in results)
    return {'version':3, 'base':base, 'obligationsSelection':selection,
            'artifacts':artifacts, 'inventoryCounts':summary['counts'], 'censusCounts':dict(Counter(c['classification'] for c in censo['leaves'])),
            'files':len(censo['modules']), 'cells':dict(counts), 'sources':dict(Counter(s['availability'] for s in sources)),
            'codeInputs':software_inputs(repo),
            'runtime':runtime_inputs(),
            'acceptance':'pending', 'coverage':'selected obligations only; bloque A abierto'}


def software_inputs(repo: Path) -> dict:
    paths = [*(repo / 'tools/procedencia/datos').glob('*.*'),
             *(repo / 'tools/procedencia').glob('*.py'),
             *(repo / 'scripts/procedencia').glob('*.mjs'),
             repo / 'tools/procedencia/pyproject.toml', repo / 'tools/procedencia/uv.lock',
             repo / 'package.json', repo / 'bun.lock',
             repo / 'docs/procedencia/datos-2012-2026/contrato-obligaciones-lotes/schema.json',
             repo / 'docs/procedencia/datos-2012-2026/unidades-y-enlaces/schema-v2.json']
    return {str(p.relative_to(repo)): digest(p.read_bytes()) for p in sorted(paths)}


def runtime_inputs() -> dict:
    loaded = {}
    for name, module in sorted(sys.modules.items()):
        filename = getattr(module, '__file__', None)
        if filename is not None and Path(filename).is_file():
            loaded[name] = digest(Path(filename).read_bytes())
    native_package = importlib.metadata.distribution('PyMuPDF')
    package_files = {str(path): digest(native_package.locate_file(path).read_bytes())
                     for path in native_package.files or []
                     if '..' not in path.parts and path.suffix != '.pyc' and path.name != 'RECORD'
                     and Path(str(native_package.locate_file(path))).is_file()}
    executables = {'python': digest(Path(sys.executable).read_bytes())}
    for name in ('bun', 'node'):
        executable = shutil.which(name)
        if executable is None:
            raise ValueError('Runtime ausente: ' + name)
        executables[name] = digest(Path(executable).read_bytes())
    return {'executables': executables, 'pymupdfFiles': package_files, 'loadedModules': loaded, ** {'python': platform.python_version(), 'implementation': platform.python_implementation(),
            'pymupdf': pymupdf.VersionBind, 'mupdf': pymupdf.VersionFitz,
            'packages': {d.metadata['Name']: d.version for d in sorted(importlib.metadata.distributions(), key=lambda d: d.metadata['Name'])},
            'bun': subprocess.check_output(['bun', '--version'], text=True).strip(),
            'node': subprocess.check_output(['node', '--version'], text=True).strip(),
            'platform': sys.platform, 'machine': platform.machine()}}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', required=True, help='SHA de base declarado; el código candidato se fija por hashes')
    parser.add_argument('--repo', type=Path, default=Path.cwd())
    parser.add_argument('--cas', type=Path, required=True)
    parser.add_argument('--read-root', type=Path, action='append', default=[])
    parser.add_argument('--work', type=Path, required=True)
    parser.add_argument('--mapping', type=Path)
    parser.add_argument('--obligations', type=Path)
    parser.add_argument('--obligations-sha256')
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--verify', type=Path)
    args = parser.parse_args()
    if args.cas.resolve().is_relative_to(args.repo.resolve()) or args.work.resolve().is_relative_to(args.repo.resolve()):
        parser.error('CAS y temporales deben ser externos')
    if args.verify:
        old = json.loads(args.verify.read_bytes())
        if old['codeInputs'] != software_inputs(args.repo.resolve()):
            raise ValueError('Preimagen de código distinta')
        storage = Store([args.cas.resolve(), *args.read_root])
        for ref in old['artifacts'].values():
            storage.read(ref)
        args.work.mkdir(parents=True, exist_ok=True)
        if args.mapping is None:
            args.mapping = args.work / 'replay-mapping.json'
            args.mapping.write_bytes(storage.read(old['artifacts']['mapping']))
        if args.obligations is None and args.obligations_sha256 is None:
            selection = old['obligationsSelection']
            if selection['selection'] == 'explicit':
                args.obligations = args.work / 'replay-obligations.json'
                args.obligations.write_bytes(storage.read(old['artifacts']['obligations']))
                args.obligations_sha256 = selection['expectedSha256']
    if args.mapping is None:
        parser.error('--mapping es obligatorio salvo reconstrucción --verify')
    result = run(args.repo.resolve(), args.cas.resolve(), args.read_root, args.work.resolve(), args.mapping, args.base,
                 obligations=args.obligations, obligations_sha256=args.obligations_sha256)
    if args.verify and encode(result) != encode(json.loads(args.verify.read_bytes())):
        raise ValueError('Reconstrucción distinta: fuente, cita, motor o artefacto cambió')
    args.output.write_bytes(encode(result))
    print(json.dumps({k:v for k,v in result.items() if k != 'artifacts'}, ensure_ascii=False))


if __name__ == '__main__':
    main()
