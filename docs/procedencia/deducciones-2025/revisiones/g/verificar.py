"""Reextrae evidencia complementaria; no decide conformidad jurídica."""
import argparse
import hashlib
import json
from pathlib import Path

import fitz
from bs4 import BeautifulSoup

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--cas', type=Path, action='append', required=True)
args = parser.parse_args()
folder = Path(__file__).resolve().parent
load = lambda file: json.loads(file.read_text())
sources = load(folder.parents[1] / 'lotes/g/fuentes.json')['documentos']
sources += load(folder / 'fuentes-complementarias.json')['documentos']
by_id = {d['id']: d for d in sources}
contents = {}
for d in sources:
    candidates = [root / sub / d['sha256'] for root in args.cas for sub in ['', 'sha256']]
    path = next((p for p in candidates if p.is_file()), None)
    assert path is not None, d['id']
    b = path.read_bytes()
    assert hashlib.sha256(b).hexdigest() == d['sha256'], d['id']
    assert hashlib.sha512(b).hexdigest() == d['sha512'], d['id']
    assert len(b) == d['bytes'], d['id']
    contents[d['id']] = b
citations = load(folder / 'citas-refinadas.json')
count = 0
for c in citations['citas'] + citations['manualIndividual']:
    l = c['localizador']
    data = contents[c['documentoId']]
    if l['tipo'] == 'html':
        tags = BeautifulSoup(data, 'html.parser').select(l['selector'])
        tag = tags[l.get('indiceSeleccion', 0)]
        text = tag.get_text(' ', strip=True)[l['inicio']:l['fin']]
    else:
        with fitz.open(stream=data, filetype='pdf') as pdf:
            text = pdf[l['paginaFisica'] - 1].get_textbox(fitz.Rect(l['bbox']))
    assert text == c['textoLiteral'], c['id']
    count += 1
decisions = load(folder / 'decisiones.json')['decisiones']
expected = {d['codigo'] for d in load(folder.parents[1] / 'censo.json')['fichas'] if d['lote'] == 'g'}
assert len(decisions) == 40 and {d['codigo'] for d in decisions} == expected
assert all(d['decisionCalculoCompleto'] == 'no_verificable' for d in decisions)
print(f'40 decisiones individuales; {len(sources)} adquisiciones íntegras; {count} citas complementarias exactas.')
print('Los pasajes de escaneados requieren lectura visual; no se cuentan como reextracción textual.')
