"""Revisión independiente, sin modificar candidatos ni originales."""
import gzip
import hashlib
import json
import re
import subprocess
from decimal import Decimal
from pathlib import Path

import pymupdf

ROOT = Path('/home/elies/.t3/worktrees/IRoboPF/t3-e739d2c4')
OUT = Path(__file__).resolve().parent
E = ROOT / 'docs/procedencia/evidencias/estatales'
CAS = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256')
HIST = 'ed6a43fd750de05609abc3710dabdc2f8261020c'


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path):
    return json.loads(path.read_bytes())


def write(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


def ref(r):
    raw = (ROOT / r['path']).read_bytes()
    assert sha(raw) == r['sha256']
    return json.loads(raw)


cov = read(E / 'cobertura.json')
objects = ROOT / 'docs/procedencia/implementaciones/contenidos/datos/objetos'
for h in cov['inventory'].values():
    assert sha((objects / h).read_bytes()) == h
files = dict(json.loads(gzip.decompress((objects / cov['inventory']['artifactSha256']).read_bytes())))
items = {i['id']: i for n, content in files.items() if n.startswith('inventario-pagina-') for i in json.loads(content)}
index = read(E / 'citas-indice.json')
documents = {}
for path in sorted((E / 'documentos').glob('*.json')):
    d = read(path)
    raw = (CAS / d['sha256']).read_bytes()
    assert sha(raw) == d['sha256'] and len(raw) == d['size']
    assert hashlib.sha512(raw).hexdigest() == d['sha512']
    documents[d['sha256']] = d
write('originales.json', list(documents.values()))
results = []
pages = {}
paths = list(sorted((E / 'citas').glob('*.json'))) + [ROOT / r['path'] for r in read(E / 'contextos.json')]
for path in paths:
    c = read(path)
    d = documents[c['documentSha256']]
    key = (c['documentSha256'], c['page'])
    with pymupdf.open(CAS / d['sha256']) as pdf:
        page = pdf[c['page'] - 1]
        box = pymupdf.Rect(c['bbox'])
        assert page.rect.contains(box)
        assert list(page.mediabox) == c['geometry']['mediaBox']
        assert list(page.cropbox) == c['geometry']['cropBox']
        assert page.rotation == c['geometry']['rotation']
        text = page.get_text('text', clip=box, flags=0, sort=False)
        assert text == c['quote'], path.name
        if key not in pages:
            png = page.get_pixmap(dpi=144, clip=box, colorspace=pymupdf.csRGB, alpha=False, annots=False).tobytes('png')
            assert sha(png) == c['facsimile']['sha256']
            stored = E / 'recortes' / (sha(png) + '.png')
            assert stored.read_bytes() == png
            pages[key] = {'document': d['officialIdentifier'], 'page': c['page'], 'png': str(stored), 'sha256': sha(png), 'text': text}
        r = {'citation': path.name, 'sha256': sha(path.read_bytes()), 'documentSha256': d['sha256'], 'page': c['page'], 'integridad': 'comprobada', 'autenticidad': 'no-validada'}
        if c.get('engineBinding'):
            b = c['engineBinding']
            for selector in ('number', 'unit'):
                s = b[selector]
                assert text[s['start']:s['end']] == s['literal']
            literal = b['number']['literal']
            assert Decimal(literal.replace('.', '').replace(',', '.')) == Decimal(b['value'])
            entry = index[path.stem]
            words = page.get_text('words', flags=0, sort=False)
            selected = [w for w in words if list(w[:4]) == entry['cellBBox']]
            assert len(selected) == 1 and selected[0][4] == literal
            r.update(value=b['value'], unit=b['unitCode'], cellBBox=entry['cellBBox'], anchor=entry['anchor'], fragment=text[max(0,b['number']['start']-180):b['number']['end']+180])
        results.append(r)
write('citas-reextraidas.json', results)
write('pasajes.json', list(pages.values()))
source_cache = {}
decisions = []
for path in sorted((E / 'payloads').glob('*.json')):
    p = read(path)
    i = items[p['itemId']]
    assert i['layer'] == 'effective'
    assert p['inventory'] == cov['inventory']
    assert p['source']['file'] == i['source']['file']
    assert p['source']['sha256'] == i['source']['sha256']
    assert p['source']['symbol'] == i['symbol']
    assert p['source']['tablePath'] == json.loads(i['path'])
    f = p['source']['file']
    if f not in source_cache:
        source_cache[f] = subprocess.check_output(['git','show',HIST+':'+f], cwd=ROOT)
    assert sha(source_cache[f]) == p['source']['sha256']
    c, d = ref(p['citation']), ref(p['document'])
    assert c['documentSha256'] == d['sha256']
    assert Decimal(i['value']) == Decimal(c['engineBinding']['value'])
    assert p['scope']['unit'] == c['engineBinding']['unitCode'] and p['conversion'] == 'identity'
    ds = ref(p['legalReview']['decisions'])
    dec = next(x for x in ds if x['id'] == p['legalReview']['decisionId'])
    gate = any(x['path'] == f for x in dec.get('engineLocations', []))
    reason = 'Cuantía nominal histórica concordante; el alcance previo no acepta este enlace ni elegibilidad.'
    if dec['id'] == 'MIN-013':
        reason += ' La reforma no acredita automáticamente continuidad anual de todos los aliases.'
    if dec['id'].startswith('TDE'):
        reason += ' Hoja legacy: no sustituye identidad ni consumo del helper canónico.'
    decisions.append({'id': p['id'], 'payloadSha256': sha(path.read_bytes()), 'itemId': p['itemId'], 'source': p['source'], 'year': p['scope']['year'], 'unit': p['scope']['unit'], 'value': i['value'], 'citation': p['citation'], 'integridad': 'comprobada-historica', 'autenticidad': 'no-validada', 'exactitud': 'igualdad-decimal-historica-comprobada', 'interpretacion': 'solo-cuantia-nominal', 'decisionPrevia': dec, 'puertaArchivo': gate, 'decisionCita': 'texto-y-numero-reextraidos', 'decisionEnlace': 'bloqueado', 'aceptacionFiscal': False, 'motivo': reason, 'pendiente': ['CAS/coordinador y revisión del payload exacto', 'vigencia y condiciones del ejercicio'] + ([] if gate else ['alcance de decisión no cubre archivo']), 'objecion': 'Una decisión aceptada sobre un defecto o texto legal no acepta cada correspondencia.', 'coste': 'Mantener candidato separado y revisar alcance e identidad antes de registrar.'})
write('decisiones-319.json', decisions)
scales = []
source = subprocess.check_output(['git','show',HIST+':lib/dominio/irpf/cuotas/escalas-publicadas.ts'], cwd=ROOT).decode()
for component in ('ORDINARIA', 'COMPLEMENTARIA'):
    block = source.split('export const ESTATAL_'+component+'_2012_2014 = filas([')[1].split('])')[0]
    rows = re.findall(r'\["([0-9.]+)", "([0-9.]+)", "([0-9.]+)"\]', block)
    for n, values in enumerate(rows):
        for col, v in zip(('baseInferior', 'cuota'), values[:2]):
            name = f'escala-{component.lower()}-{n}-{col}'
            assert Decimal(index[name]['value']) == Decimal(v)
            scales.append({'id':name,'value':v,'decision':'coincidencia-sintactica; enlace bloqueado sin exposición efectiva','citation':index[name]})
assert not any(i.get('layer') == 'effective' and i['source']['file'].endswith('/escalas-publicadas.ts') for i in items.values())
write('celdas-26.json', scales)
write('cobertura-revisada.json', cov)
print(json.dumps({'payloads':len(decisions),'citas':len(results),'png':len(pages),'originales':len(documents),'celdas':len(scales),'puertaArchivo':sum(d['puertaArchivo'] for d in decisions),'version':pymupdf.VersionBind}))
