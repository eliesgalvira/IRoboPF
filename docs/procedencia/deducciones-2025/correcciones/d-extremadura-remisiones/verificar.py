"""Verificación pública sin CAS; --cas añade integridad y reextracción opcional.

La reextracción PDF/HTML requiere pymupdf==2.0 y beautifulsoup4==4.15.0.
No descarga fuentes ni acepta una interpretación fiscal.
"""
import argparse
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET


def verificar(folder, roots=()):
    evidence = json.loads((folder / 'evidencia.json').read_text())
    matrix = json.loads((folder / 'matriz.json').read_text())['deducciones']
    sources = {s['id']: s for s in evidence['documentos']}
    versions = {v['id']: v for v in evidence['versiones']}
    assert len(matrix) == len({r['codigo'] for r in matrix}) == 19
    assert all(r['codigo'].startswith('extremadura_') for r in matrix)
    assert all(set(r['versionesAplicables']) <= versions.keys() for r in matrix)
    assert all(len(r['campos']) == 7 for r in matrix)
    citations = {c['id'] for c in evidence['citas']}
    for row in matrix:
        for field in row['campos']:
            for comparison in field['contrasteManual']:
                assert set(comparison['citas']) <= citations
    if roots:
        from bs4 import BeautifulSoup
        import pymupdf
        documents = {}
        for sid, source in sources.items():
            path = next((p for r in roots for p in (r / source['sha256'], r / 'sha256' / source['sha256']) if p.is_file()), None)
            assert path is not None, sid
            data = path.read_bytes()
            assert len(data) == source['bytes'], sid
            for algorithm in ('sha256', 'sha512'):
                assert hashlib.new(algorithm, data).hexdigest() == source[algorithm], sid
            if source['mimeType'] == 'application/pdf':
                documents[sid] = pymupdf.open(stream=data, filetype='pdf')
            elif source['mimeType'] == 'application/xml':
                documents[sid] = ET.fromstring(data)
            else:
                documents[sid] = BeautifulSoup(data, 'html.parser')
        for version in versions.values():
            for passage in version['pasajes']:
                node = documents[version['documentoId']].find(passage['xpath'])
                assert node is not None, passage['xpath']
                assert ''.join(node.itertext()) == passage['textoLiteral'], (version['id'], passage['xpath'])
        for citation in evidence['citas']:
            loc = citation['localizador']
            doc = documents[citation['documentoId']]
            if loc['tipo'] == 'pdf':
                actual = doc[loc['paginaFisica'] - 1].get_text(clip=pymupdf.Rect(loc['bbox']), sort=False)
            else:
                actual = doc.select_one(loc['selector']).get_text(' ', strip=True)[loc['inicio']:loc['fin']]
            assert actual == citation['textoLiteral'], citation['id']
    return {'codigos': len(matrix), 'versiones': len(versions), 'citas': len(citations), 'originalesCotejados': bool(roots)}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cas', type=Path, action='append', default=[])
    args = parser.parse_args()
    print(json.dumps(verificar(Path(__file__).resolve().parent, args.cas)))
