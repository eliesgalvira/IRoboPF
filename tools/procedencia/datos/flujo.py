"""Censo y extracción reproducibles. Ninguna coincidencia acepta reglas fiscales."""
from __future__ import annotations

import argparse
from collections import Counter
from decimal import Decimal
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from cas import ordinary_path  # noqa: E402
from descargar import DEFAULT_HOSTS, check_url  # noqa: E402
from corpus import extract, geometry, selectors  # noqa: E402
import pymupdf  # noqa: E402

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
    if literal in ('', '—', '–', '-', '----'):
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
                if word[4] in ('+', '-', '−', '–', '—') and selected and abs(word[1] - selected[-1][1]) < 2 and 0 <= selected[-1][0] - word[2] < 12 and word not in selected:
                    raise ValueError('Signo próximo fuera de la celda')
            normalized = number(literal, spec['unit'])
            cells.append({**spec, 'quote': quote, 'literal': literal, 'normalized': normalized,
                          'words': [list(w[:5]) for w in selected],
                          'normalization': 'fully-contained-words; es-grouping-dot-decimal-comma; open-sentinel',
                          'document': table['document'], 'page': table['page'],
                          'table': table['code'], 'year': table['year'], 'territory': table['territory'],
                          'geometry': geometry(page), 'selectors': selectors(table['page'], spec['bbox'], quote)})
    return cells


def ine_table(store: Store, table: dict) -> list[dict]:
    raw = store.read(table['document'])
    text = raw.decode('utf-8')
    data = json.loads(text, parse_float=Decimal)
    if data['COD'] != table['series'] or data['FK_Unidad'] != 133 or data['FK_Escala'] != 1 or len(data['Data']) != table['rows']:
        raise ValueError('Serie/unidad/escala/cobertura INE distinta')
    tokens = list(re.finditer(r'"Valor"\s*:\s*(-?[0-9]+(?:\.[0-9]+)?)', text))
    if len(tokens) != len(data['Data']):
        raise ValueError('Cobertura de tokens INE distinta')
    cells = []
    for spec, row, token in zip(table['cells'], data['Data'], tokens, strict=True):
        literal = token.group(1)
        if Decimal(literal) != row['Valor'] or row['Secreto'] or row['FK_TipoDato'] != 1:
            raise ValueError('Valor secreto o tipo INE no admitido')
        cells.append({**spec, 'table':table['code'], 'year':table['year'], 'territory':table['territory'],
                      'dataYear':row['Anyo'], 'period':row['FK_Periodo'], 'page':None,
                      'quote':literal, 'literal':literal, 'normalized':str(Decimal(literal)),
                      'normalization':'decimal-identity', 'document':table['document'],
                      'selectors':[{'type':'JsonPointer', 'value':'/Data/' + spec['row'] + '/Valor'},
                                   {'type':'TextPositionSelector', 'start':token.start(1), 'end':token.end(1)}]})
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


def compare(tables: list[dict], cells: list[dict], items: list[dict]) -> list[dict]:
    expected = [(t['code'], c['row'], c['column']) for t in tables for c in t['cells']]
    actual = [(c['table'], c['row'], c['column']) for c in cells]
    if Counter(expected) != Counter(actual) or any(n != 1 for n in Counter(actual).values()):
        raise ValueError('Cobertura incompleta/sobrante/duplicada')
    results = []
    lookup = {(c['table'], c['row'], c['column']): c for c in cells}
    for table in tables:
        for spec in table['cells']:
            cell = lookup[table['code'], spec['row'], spec['column']]
            for key in ('unit', 'bbox', 'expression'):
                if cell.get(key) != spec.get(key):
                    raise ValueError('Celda alterada: ' + key)
            if cell['year'] != table['year'] or cell['territory'] != table['territory']:
                raise ValueError('Ámbito alterado')
            if normalized_cell(cell) != cell['normalized']:
                raise ValueError('Normalización alterada')
            observed = None
            if spec.get('expression') is not None:
                observed = str(evaluate(items, spec['expression']))
            status = 'extraction-absent' if cell['normalized'] == 'absent' else 'not-verifiable' if observed is None else 'match' if Decimal(observed) == Decimal(cell['normalized']) else 'difference'
            results.append({'code':table['code'], 'year':cell.get('dataYear', table['year']), 'period':cell.get('period'), 'territory':table['territory'],
                            'row':spec['row'], 'column':spec['column'], 'expected':cell['normalized'],
                            'observed':observed, 'unit':cell['unit'], 'status':status,
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


def run(repo: Path, cas: Path, roots: list[Path], work: Path, mapping: Path) -> dict:
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
    results = compare(tables, cells, items)
    censo = json.loads((folder / 'censo-completo.json').read_bytes())
    artifacts = {p.name:put(cas, p.read_bytes()) for p in sorted(folder.iterdir())}
    artifacts['extraction'] = put(cas, encode(cells))
    artifacts['comparison'] = put(cas, encode(results))
    artifacts['queue'] = put(cas, encode([r for r in results if r['status'] != 'match']))
    sources = catalog(repo, store)
    artifacts['catalog'] = put(cas, encode(sources))
    artifacts['mapping'] = put(cas, mapping.read_bytes())
    counts = Counter(r['status'] for r in results)
    return {'version':1, 'base':subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip(),
            'artifacts':artifacts, 'inventoryCounts':summary['counts'], 'censusCounts':dict(Counter(c['classification'] for c in censo['leaves'])),
            'files':len(censo['modules']), 'cells':dict(counts), 'sources':dict(Counter(s['availability'] for s in sources)),
            'codeInputs':{str(p.relative_to(repo)):digest(p.read_bytes()) for p in sorted((repo / 'tools/procedencia/datos').glob('*.*'))},
            'acceptance':'pending', 'coverage':'pilot; bloque A abierto'}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
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
    result = run(args.repo.resolve(), args.cas.resolve(), args.read_root, args.work.resolve(), args.mapping)
    if args.verify and encode(result) != encode(json.loads(args.verify.read_bytes())):
        raise ValueError('Reconstrucción distinta: fuente, cita, motor o artefacto cambió')
    args.output.write_bytes(encode(result))
    print(json.dumps({k:v for k,v in result.items() if k != 'artifacts'}, ensure_ascii=False))


if __name__ == '__main__':
    main()
