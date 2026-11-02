"""Integridad documental; no evalúa cuota ni sustituye revisión jurídica."""
import argparse
import hashlib
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cas', type=Path)
    args = parser.parse_args()
    root = Path(__file__).parent
    def read(name):
        return json.loads((root / name).read_text())
    sources = {s['id']: s for s in read('fuentes.json')['documentos']}
    citations = read('citas.json')['citas']
    by_id = {c['id']: c for c in citations}
    assert len(by_id) == len(citations)
    for c in citations:
        assert c['fuente'] in sources
        assert c['sha256'] == sources[c['fuente']]['sha256']
        assert c['fin'] - c['inicio'] == len(c['literal'])
        assert c['literal'] and c['inicio'] >= 0
    chains = read('cadenas.json')
    chain_ids = {r['id'] for r in chains}
    for r in chains:
        assert r['norma'] and r['efecto'] and r['regla'] and r['citas']
        assert all(c in by_id for c in r['citas'])
    proposals = read('propuestas.json')
    assert len(proposals) == 3
    codes = {p['codigo'] for p in proposals}
    for p in proposals:
        raw = p['preimagen'].encode()
        assert hashlib.sha256(raw).hexdigest() == p['preimagenSha256']
        assert hashlib.sha512(raw).hexdigest() == p['preimagenSha512']
        assert p['estado'] == 'candidato_revision_independiente'
        assert p['codigo'] in p['preimagen']
        assert {op['campo'] for op in p['operaciones']} == {'requisitos', 'entradaNecesaria'}
    for d in read('dictamenes.json'):
        assert d['codigo'] in codes and set(d['cadenas']) <= chain_ids
        assert d['estado'] == 'candidato_revision_independiente'
    cases = read('fronteras.json')
    assert len({c['id'] for c in cases}) == len(cases)
    for c in cases:
        assert c['codigo'] in codes and c['resultadoJuridicoEsperado']
        assert c['tipo'] == 'especificacion_documental_no_test_de_motor'
    for f in root.iterdir():
        if f.suffix in {'.md', '.json', '.py'}:
            assert ('/' + 'home' + '/') not in f.read_text(), f.name
    if args.cas:
        import fitz
        from bs4 import BeautifulSoup
        assert fitz.VersionBind == '1.26.7'
        texts = {}
        for s in sources.values():
            b = (args.cas / s['sha256']).read_bytes()
            assert len(b) == s['bytes']
            assert hashlib.sha256(b).hexdigest() == s['sha256']
            assert hashlib.sha512(b).hexdigest() == s['sha512']
            if s['mimeType'] == 'application/pdf':
                doc = fitz.open(stream=b, filetype='pdf')
                t = '\n'.join(f'\nPÁGINA {i+1}\n' + page.get_text() for i, page in enumerate(doc))
            else:
                t = BeautifulSoup(b, 'html.parser').get_text(' ', strip=True)
            texts[s['id']] = t
        for c in citations:
            assert texts[c['fuente']][c['inicio']:c['fin']] == c['literal'], c['id']
        print(f'Originales y {len(citations)} citas reextraídos correctamente.')
    print(f'Integridad correcta: {len(chains)} cadenas, {len(proposals)} propuestas, {len(cases)} fronteras documentales. Sin aceptación jurídica automática.')


if __name__ == '__main__':
    main()
