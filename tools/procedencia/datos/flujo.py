"""Censo y extracción reproducibles. Ninguna coincidencia acepta reglas fiscales."""
from __future__ import annotations

import argparse
from collections import Counter
from decimal import Decimal
import hashlib
import importlib.metadata
import platform
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from cas import ordinary_path  # noqa: E402
from descargar import DEFAULT_HOSTS, check_url  # noqa: E402
from corpus import extract, geometry, selectors  # noqa: E402
import pymupdf  # noqa: E402

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
    if re.fullmatch(r'[+-] [0-9].*', literal):
        literal = literal[0] + literal[2:]
    if not re.fullmatch(r'[+-]?(?:[0-9]{1,3}(?:\.[0-9]{3})+|[0-9]+)(?:,[0-9]+)?', literal):
        raise ValueError('Número/signo/separadores ambiguos: ' + literal)
    return str(Decimal(literal.replace('.', '').replace(',', '.')))


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
            normalized = number(literal, spec['unit'])
            cells.append({**spec, 'quote': quote, 'literal': literal, 'normalized': normalized,
                          'words': [list(w[:5]) for w in selected],
                          'normalization': 'fully-contained-words; es-grouping-dot-decimal-comma; open-sentinel',
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
    return number(cell['literal'], cell['unit'])


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
               'cells': [{k: c.get(k) for k in ('row', 'column', 'bbox', 'unit', 'numberFormat')} for c in t['cells']]}
              for t in tables]
    expected = [{**{k: t.get(k) for k in fields},
                 'cells': [{k: c.get(k) for k in ('row', 'column', 'bbox', 'unit', 'numberFormat')} for c in t['cells']]}
                for t in obligations]
    if actual != expected:
        raise ValueError('Obligaciones revisadas omitidas o alteradas')


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
        box = pymupdf.Rect(proof['bbox'])
        literal = ' '.join(w[4] for w in page.get_text('words', flags=0, sort=True) if box.contains(pymupdf.Rect(w[:4])))
    if literal != proof['literal'] or proof['unit'] != obligation['unit']:
        raise ValueError('Cabecera de unidad no reproducible')
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


def expression_unit(expression: dict, semantics: dict, repo: Path) -> str | None:
    if 'binding' in expression:
        binding = expression['binding']
        proof = semantics.get(encode(binding).decode().strip())
        if proof is None:
            return None
        source = repo / binding['file']
        if digest(source.read_bytes()) != proof['sourceSha256'] or proof['quote'] not in source.read_text():
            raise ValueError('Semántica del campo sin fuente reproducible')
        return proof['unit']
    units = [expression_unit(child, semantics, repo) for child in expression['args']]
    if expression['op'] == 'percent' and units == ['proportion']:
        return 'percent'
    if expression['op'] == 'subtract' and units == ['EUR', 'EUR']:
        return 'EUR'
    if expression['op'] == 'sum' and units and all(unit == 'EUR' for unit in units):
        return 'EUR'
    return None


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
            for key in ('unit', 'bbox', 'expression', 'numberFormat'):
                if cell.get(key) != spec.get(key):
                    raise ValueError('Celda alterada: ' + key)
            if cell['year'] != table['year'] or cell['territory'] != table['territory']:
                raise ValueError('Ámbito alterado')
            if cell['document'] != table['document'] or cell['page'] != table.get('page'):
                raise ValueError('Documento o página alterados')
            source_unit = evidence_unit(store, table, obligation)
            if normalized_cell(cell) != cell['normalized']:
                raise ValueError('Normalización alterada')
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


def run(repo: Path, cas: Path, roots: list[Path], work: Path, mapping: Path, base: str) -> dict:
    if re.fullmatch(r'[0-9a-f]{40}', base) is None:
        raise ValueError('Base debe ser SHA completo declarado')
    if cas.is_relative_to(repo) or work.is_relative_to(repo):
        raise ValueError('CAS y temporales deben ser externos')
    cas.mkdir(parents=True, exist_ok=True)
    work.mkdir(parents=True, exist_ok=True)
    store = Store([cas, *roots])
    folder = Path(tempfile.mkdtemp(prefix='censo-', dir=work))
    subprocess.run(['bun', str(repo / 'tools/procedencia/datos/censo.mjs'), str(repo), str(folder)], check=True)
    summary = json.loads((folder / 'inventario.json').read_bytes())
    items = [item for page in summary['pages'] for item in json.loads((folder / page['file']).read_bytes())]
    tables = json.loads(mapping.read_bytes())
    cells = [cell for table in tables for cell in (ine_table(store, table) if table.get('format') == 'ine-json' else pdf_table(store, table))]
    registry_path = repo / 'docs/procedencia/datos-2012-2026/obligaciones.json'
    registry_raw = registry_path.read_bytes()
    if digest(registry_raw) != OBLIGATIONS_SHA256:
        raise ValueError('Registro de obligaciones cambió: requiere revisión explícita')
    registry = json.loads(registry_raw)
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
    return {'version':2, 'base':base,
            'artifacts':artifacts, 'inventoryCounts':summary['counts'], 'censusCounts':dict(Counter(c['classification'] for c in censo['leaves'])),
            'files':len(censo['modules']), 'cells':dict(counts), 'sources':dict(Counter(s['availability'] for s in sources)),
            'codeInputs':software_inputs(repo),
            'runtime':runtime_inputs(),
            'acceptance':'pending', 'coverage':'pilot; bloque A abierto'}


def software_inputs(repo: Path) -> dict:
    paths = [*(repo / 'tools/procedencia/datos').glob('*.*'),
             *(repo / 'tools/procedencia').glob('*.py'),
             *(repo / 'scripts/procedencia').glob('*.mjs'),
             repo / 'tools/procedencia/pyproject.toml', repo / 'tools/procedencia/uv.lock',
             repo / 'package.json', repo / 'bun.lock']
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
    parser.add_argument('--mapping', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--verify', type=Path)
    args = parser.parse_args()
    if args.verify:
        old = json.loads(args.verify.read_bytes())
        storage = Store([args.cas.resolve(), *args.read_root])
        for ref in old['artifacts'].values():
            storage.read(ref)
    result = run(args.repo.resolve(), args.cas.resolve(), args.read_root, args.work.resolve(), args.mapping, args.base)
    if args.verify and encode(result) != encode(json.loads(args.verify.read_bytes())):
        raise ValueError('Reconstrucción distinta: fuente, cita, motor o artefacto cambió')
    args.output.write_bytes(encode(result))
    print(json.dumps({k:v for k,v in result.items() if k != 'artifacts'}, ensure_ascii=False))


if __name__ == '__main__':
    main()
