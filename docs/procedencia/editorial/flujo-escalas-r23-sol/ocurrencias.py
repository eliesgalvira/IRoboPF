"""Identidad por fuente/hash/rango exactos: nunca por igualdad de número."""
from __future__ import annotations
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any

OUT = Path(__file__).resolve().parent


def key(source: dict[str, Any]) -> tuple[str, str, int, int]:
    return source['file'], source['sha256'], source['start'], source['end']


def main() -> None:
    with gzip.open(OUT/'rutas-datos.json.gz', 'rt') as stream:
        routes = json.load(stream)
    wanted: dict[tuple[str, str, int, int], dict[str, Any]] = {}

    def visit(node: Any) -> None:
        if isinstance(node, dict):
            if node.get('terminal') == 'literal':
                wanted[key(node['source'])] = node['source']
            for child in node.values():
                visit(child)
        elif isinstance(node, list):
            for child in node:
                visit(child)

    visit(routes)
    path = Path('docs/procedencia/inventario-datos.json.gz')
    assert hashlib.sha256(path.read_bytes()).hexdigest() == '59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7'
    with gzip.open(path, 'rt') as stream:
        packed = json.load(stream)
    matches: dict[tuple[str, str, int, int], list[dict[str, Any]]] = {}
    for name, content in packed:
        if not name.startswith('inventario-pagina-'):
            continue
        data = json.loads(content)
        for row in data if isinstance(data, list) else data.get('items', []):
            source = row.get('source', {})
            if not all(field in source for field in ('file','sha256','start','end')):
                continue
            identity = key(source)
            if identity in wanted:
                matches.setdefault(identity, []).append(row)
    result = {'meaning':'Identidades técnicas por rango exacto del token; no se infiere influencia ni aceptación por coincidencia numérica o contención. Los IDs efectivos de celdas y Madrid se conservan además en sus contratos propios.', 'artifactSha256':hashlib.sha256(path.read_bytes()).hexdigest(), 'tokens':[{'source':source,'occurrences':matches.get(identity,[]),'status':'exact-source-match' if identity in matches else 'no-exact-token-occurrence-in-current-inventory'} for identity,source in wanted.items()]}
    (OUT/'ocurrencias.json.gz').write_bytes(gzip.compress((json.dumps(result,ensure_ascii=False,indent=2)+'\n').encode(),mtime=0))
    print(len(wanted),'tokens de rutas contrastados por fuente y rango exactos;',len(matches),'con ocurrencia técnica exacta. No son reglas aceptadas.')
    print('Sin ocurrencia exacta:', json.dumps([source for identity,source in wanted.items() if identity not in matches],ensure_ascii=False))


if __name__=='__main__':
    main()
