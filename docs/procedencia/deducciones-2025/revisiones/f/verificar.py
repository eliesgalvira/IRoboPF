"""Valida los bytes y las citas de revisión. Raíces CAS externas por argumento.

uv run --no-project --python python3 --no-managed-python --with pymupdf==1.26.7 \
  --with beautifulsoup4==4.14.3 python verificar.py CAS_ROOT LEGACY_CAS
No descarga ni modifica originales; no emite conformidad fiscal.
"""
import argparse
import hashlib
import json
from pathlib import Path

import pymupdf
from bs4 import BeautifulSoup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('roots', nargs='+', type=Path)
    args = parser.parse_args()
    here = Path(__file__).resolve().parent
    lote = here.parents[1] / 'lotes' / 'f'
    sources = json.loads((lote / 'fuentes.json').read_text())['documentos']
    sources += json.loads((here / 'fuentes-complementarias.json').read_text())['documentos']
    docs = {}
    for d in sources:
        paths = [p for root in args.roots for p in (root/d['sha256'], root/'sha256'/d['sha256']) if p.is_file()]
        assert paths, d['id']
        b = paths[0].read_bytes()
        assert len(b) == d['bytes'], d['id']
        for alg in ['sha256', 'sha512']:
            assert hashlib.new(alg, b).hexdigest() == d[alg], d['id']
        docs[d['id']] = pymupdf.open(stream=b, filetype='pdf') if d['mimeType'] == 'application/pdf' else BeautifulSoup(b, 'html.parser')
    cites = json.loads((here/'citas-refinadas.json').read_text())['citas']
    assert len({c['id'] for c in cites}) == len(cites)
    for c in cites:
        loc = c['localizador']
        if loc['tipo'] == 'pdf':
            text = docs[c['documentoId']][loc['paginaFisica']-1].get_text(clip=pymupdf.Rect(loc['bbox'])).strip()
        else:
            text = docs[c['documentoId']].select_one(loc['selector']).get_text(' ', strip=True)[loc['inicio']:loc['fin']]
        assert text == c['textoLiteral'], c['id']
    rows = json.loads((here/'decisiones.json').read_text())['deducciones']
    author = json.loads((lote/'dictamenes.json').read_text())['deducciones']
    codes = {r['codigo'] for r in rows}
    assert len(rows) == len(codes) == 51
    assert codes == {r['codigo'] for r in author}
    assert all(any(c['id'] == code+'-original' for c in cites) and any(c['id'] == code+'-manual' for c in cites) for code in codes)
    assert all(not r['liquidacionCompletaValidada'] for r in rows)
    print(f'{len(rows)} decisiones; {len(cites)} citas literales; {len(sources)} documentos íntegros. Sin aceptación fiscal global.')


if __name__ == '__main__':
    main()
