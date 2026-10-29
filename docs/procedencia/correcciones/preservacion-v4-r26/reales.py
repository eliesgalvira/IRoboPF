"""Carga y cotejo de las dos copias v4, sin reexportar ni modificar sus bytes."""
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'docs/procedencia/preservacion-v4-sol'))
import edicion as e  # noqa: E402

PIN = '938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2'
STORE = ROOT / '.cache/orquestador-preservacion/v4-938f230888d2'
external = STORE / 'manifest-externo.json'
assert hashlib.sha256(external.read_bytes()).hexdigest() == PIN
results = []
for name in ('paquete', 'restauracion'):
    receipt = e.verify(STORE / name, PIN, external)
    assert receipt['objects'] == 1443 and receipt['dependencies'] == 6816
    assert receipt['acquisitionObservations'] == 33 and receipt['distinctAcquisitionRecords'] == 23
    assert receipt['metadataPolicy'] == 'v4-historica-fijada'
    results.append({'copy': name, 'receipt': receipt})
    print(name, 'verificado, pin y bytes conservados', flush=True)
sources = ['docs/procedencia/preservacion-v4-sol/edicion.py',
           'docs/procedencia/preservacion-v4-sol/schema.json',
           'docs/procedencia/preservacion-v3/recolector.py',
           'tools/procedencia/preservacion.py']
(OUT / 'copias-reales.json').write_text(json.dumps({
    'pin': PIN, 'copies': results,
    'software': [{'path': path, 'sha256': hashlib.sha256((ROOT / path).read_bytes()).hexdigest()} for path in sources],
    'newRestoration': False, 'newPublication': False, 'completeRuleAcceptance': False,
    'limits': 'Verificación con consumidor actual; paquete y política histórica fijados, sin certificación universal de privacidad ni nueva restauración.'}, indent=2) + '\n')
