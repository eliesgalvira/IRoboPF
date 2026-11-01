#!/usr/bin/env python3
"""Reextrae citas propias. No emite conformidad jurídica. --cas admite varios almacenes."""
import argparse
import hashlib
import json
from pathlib import Path
import pymupdf
from bs4 import BeautifulSoup
p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--cas', action='append', type=Path, required=True)
a = p.parse_args()
folder = Path(__file__).resolve().parent
read = lambda name: json.loads(name.read_text())
sources = read(folder.parents[1] / 'lotes/d/fuentes.json')['documentos']
sources += read(folder.parents[1] / 'lotes/d/fuentes-adicionales.json')['documentos']
sources += read(folder / 'fuentes-complementarias.json')['documentos']
objects = {}
for s in sources:
    paths = [r / sub / s['sha256'] for r in a.cas for sub in ('', 'sha256')]
    path = next((x for x in paths if x.is_file()), None)
    assert path is not None, s['id']
    b = path.read_bytes()
    assert hashlib.sha256(b).hexdigest() == s['sha256'], s['id']
    assert hashlib.sha512(b).hexdigest() == s['sha512'], s['id']
    assert len(b) == s['bytes'], s['id']
    objects[s['id']] = (pymupdf.open(stream=b, filetype='pdf') if s['mimeType'] == 'application/pdf' else BeautifulSoup(b, 'html.parser'))
citations = read(folder / 'citas-refinadas.json')['citas']
for c in citations:
    loc = c['localizador']; doc = objects[c['documentoId']]
    if loc['tipo'] == 'pdf':
        actual = doc[loc['paginaFisica']-1].get_text(clip=pymupdf.Rect(loc['bbox']), sort=False)
    else:
        actual = doc.select_one(loc['selector']).get_text(' ', strip=True)[loc['inicio']:loc['fin']]
    assert actual == c['textoLiteral'], c['id']
rows = read(folder / 'decisiones.json')['deducciones']
census = read(folder.parents[1] / 'censo.json')['fichas']
assert {r['codigo'] for r in rows} == {r['codigo'] for r in census if r['lote']=='d'}
assert len(rows) == len({r['codigo'] for r in rows}) == 63
for r in rows:
    assert len(r['alcance']) == 10
    assert r['decisionCalculoAutomatico'] == 'no_verificable'
print(f"63 decisiones; {len(sources)} documentos íntegros; {len(citations)} citas propias reextraídas")
