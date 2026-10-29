"""Control de estructura, evidencia física y transporte del grafo candidato."""
from __future__ import annotations
import gzip
import copy
import hashlib
import json
from pathlib import Path
from typing import Any
import jsonschema

OUT = Path(__file__).resolve().parent


def read(name: str) -> Any:
    path = OUT / name
    if name.endswith('.gz'):
        with gzip.open(path, 'rt') as stream:
            return json.load(stream)
    return json.loads(path.read_text())


def check(value: Any) -> int:
    count = 0
    if isinstance(value, dict):
        if all(k in value for k in ('file', 'sha256', 'start', 'end', 'offsetEncoding')):
            data = Path(value['file']).read_bytes()
            assert hashlib.sha256(data).hexdigest() == value['sha256'], value['file']
            assert value['offsetEncoding'] == 'utf16'
            fragment = data.decode().encode('utf-16-le')[value['start']*2:value['end']*2].decode('utf-16-le')
            if 'expression' in value:
                assert fragment == value['expression']
            count += 1
        if 'source' in value and isinstance(value['source'], dict) and 'expression' in value and ('rangeKind' in value or 'siteId' in value):
            src = value['source']
            if 'start' in src:
                data = Path(src['file']).read_text().encode('utf-16-le')
                assert data[src['start']*2:src['end']*2].decode('utf-16-le') == value['expression']
        for child in value.values():
            count += check(child)
    elif isinstance(value, list):
        for child in value:
            count += check(child)
    return count


def main() -> None:
    graph = read('grafo.json.gz')
    schema = read('grafo.schema.json')
    jsonschema.validate(graph, schema)
    for field, bad in [('wiringAllowed', True), ('globalClosure', True), ('version', 1)]:
        mutant = copy.deepcopy(graph)
        mutant[field] = bad
        try:
            jsonschema.validate(mutant, schema)
        except jsonschema.ValidationError:
            pass
        else:
            raise AssertionError(field)
    assert graph['wiringAllowed'] is False and graph['globalClosure'] is False
    assert len({s['siteId'] for s in graph['sites']}) == 28
    assert all(s['edges'] for s in graph['sites']), [s['siteId'] for s in graph['sites'] if not s['edges']]
    assert len({e['id'] for e in graph['edges']}) == len(graph['edges'])
    routes = read('rutas-datos.json.gz')
    assert not routes['errors'], routes['errors'][:5]
    cells = read('celdas.json.gz')
    assert len(cells) == 264 and len({c['occurrenceId'] for c in cells}) == 102
    for cell in cells:
        assert hashlib.sha256(Path(cell['payload']['path']).read_bytes()).hexdigest() == cell['payload']['sha256']
        assert cell['conditions']['completeRule'] is False
    total = sum(check(read(name)) for name in ['grafo.json.gz','celdas.json.gz','rutas-datos.json.gz','fronteras.json','madrid.json','ocurrencias.json.gz'])
    assert all(e['review'] == 'pending-independent' for e in graph['edges'])
    print(total, 'referencias comprobadas contra bytes/rangosUTF16; JSONSchema y contratos pendientes conservados')


if __name__ == '__main__':
    main()
