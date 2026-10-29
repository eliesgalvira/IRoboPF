"""Cotejo propio, sin promociones ni escrituras fuera de la entrega."""
import hashlib
import gzip
import importlib
import json
import os
from pathlib import Path
import sys

ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
enlaces = importlib.import_module("enlaces")

OUT = ROOT / 'docs/procedencia/revisiones/contratos-publicacion-r19-sol'


def fingerprint(path):
    info = os.lstat(path)
    raw = path.read_bytes()
    return {'path': str(path), 'size': info.st_size,
            'sha256': hashlib.sha256(raw).hexdigest(),
            'sha512': hashlib.sha512(raw).hexdigest()}


sources = []
for row in json.loads((ROOT / 'docs/procedencia/correcciones/integracion-r19/cas-retenciones.json').read_bytes())['objects']:
    result = fingerprint(Path(row['preservedPath']))
    for key in ('sha256', 'sha512', 'size'):
        assert row[key] == result[key], (key, row)
    sources.append(result)
manifest = json.loads((ROOT / 'docs/procedencia/corpus/madrid-2018-norma.manifest.json').read_bytes())
citation = json.loads((ROOT / 'docs/procedencia/corpus/madrid-2020-limite.citation.json').read_bytes())
for digest in (manifest['sha256'], citation['facsimile']['sha256']):
    result = fingerprint(ROOT / 'docs/procedencia/corpus/fixtures/sha256' / digest)
    assert result['sha256'] == digest
    sources.append(result)
reader = enlaces.DocumentaryReadSet(ROOT)
rows = json.loads((ROOT / 'docs/procedencia/correcciones/integracion-r19/candidatos/correspondencias.json').read_bytes())['rows']
assert len(rows) == 264
wanted = {row["itemId"] for row in rows}
items = {}
archive = ROOT / "docs/procedencia/inventario-datos.json.gz"
assert hashlib.sha256(archive.read_bytes()).hexdigest() == "59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7"
for name, content in json.loads(gzip.decompress(archive.read_bytes())):
    if name.startswith("inventario-pagina-"):
        for item in json.loads(content):
            if item["id"] in wanted:
                assert item["id"] not in items
                items[item["id"]] = item
assert len(items) == len(wanted)
for row in rows:
    assert row['status'] == 'pending'
    payload = reader.read_ref(row['candidate'])
    scope = reader.read_ref(payload['executableScope'])
    item = items[payload['itemId']]
    assert item['layer'] == 'effective'
    assert item['source']['file'] == payload['source']['file']
    assert item['source']['sha256'] == payload['source']['sha256']
    assert item['symbol'] == payload['source']['symbol']
    assert json.loads(item['path']) == payload['source']['tablePath']
    assert item['unit'] == payload['scope']['unit']
    assert payload['scope']['year'] in item['years']
    assert payload['scope']['territory'] in item['territories']
    enlaces.verify_executable_scope(reader, payload, item)
deps = reader.finish()
# Contraste Python del mismo conflicto que el adverso nuevo de Node.
try:
    enlaces.select_decision([{'id': 'synthetic', 'status': 'accepted', 'decision': 'rejected',
                             'engineLocations': [{'path': 'lib/synthetic.ts'}]}], 'synthetic')
except ValueError as error:
    print('Python rechaza status/decision simultáneos:', error)
else:
    raise AssertionError('Python admitió decisión contradictoria')
# No se afirma aplicación cuando el dato solo tiene alcance nominal estatal.
scope = {'year': 2022, 'territory': 'estatal-comun', 'component': 'estatal',
         'taxBase': 'general', 'period': 'nominal-only', 'predicate': 'nominal-cell',
         'externalConditions': ['residence-unverified', 'eligibility-unverified']}
context = {k: scope[k] for k in ('year', 'territory', 'component', 'taxBase', 'externalConditions')}
context.update(periodStart='2022-01-01', accrual='2022-12-31', death=None)
try:
    enlaces.evaluate_scope(scope, context)
except ValueError as error:
    print('Nominal estatal no autoriza selección temporal:', error)
else:
    raise AssertionError('Se aceptó selección temporal nominal')
(OUT / 'fuentes.json').write_text(json.dumps({'objects': sources, 'manifest': manifest,
                                           'citation': citation, 'dependencies': deps}, indent=2, ensure_ascii=False))
print('CAS R19:11, Madrid:2, ámbitos candidatos:264; pendientes, sin promoción')
