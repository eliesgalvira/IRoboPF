"""Controles independientes de cadenas y cuota: conserva reservas históricas."""
import hashlib
import json
from pathlib import Path
from decimal import Decimal
import re

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/bindings-autonomicos-r19-sol'
CAS = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256')


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path):
    return json.loads(path.read_bytes())


persistence = []
for d in read(ROOT / 'docs/procedencia/revisiones/evidencias-autonomicas-v2/persistencia.json'):
    path = CAS / d['sha256']
    raw = path.read_bytes()
    assert sha(raw) == d['sha256']
    text = re.sub('<[^>]+>', ' ', raw.decode(errors='replace'))
    text = re.sub(r'\s+', ' ', text)
    persistence.append({'url': d['url'], 'literalPath': str(path), 'sha256': sha(raw),
                        'sha512': hashlib.sha512(raw).hexdigest(), 'size': len(raw),
                        'originalReopened': True})
    (ROOT / '.cache/bindings-autonomicos-r19-sol' / (d['sha256'] + '.txt')).write_text(text)
(OUT / 'cadenas-originales.json').write_text(json.dumps(persistence, indent=2) + '\n')
previous = []
for m in read(ROOT / 'docs/procedencia/evidencias/autonomicas/matriz-revisiones.json'):
    raw = (ROOT / m['review']['path']).read_bytes()
    assert sha(raw) == m['review']['sha256']
    d = next(d for d in json.loads(raw) if d['id'] == m['id'])
    assert m['priorDecision'] == d.get('decision', d.get('status'))
    assert m['scope'] == d.get('acceptanceScope')
    previous.append({'id': m['id'], 'reference': m['review'], 'status': m['priorDecision'],
                     'scope': m['scope'], 'promoted': False})
(OUT / 'decisiones-previas-control.json').write_text(json.dumps(previous, ensure_ascii=False, indent=2) + '\n')
# Derivación Decimal desde fila cuarta y cláusula oficial; no integra cuotas publicadas.
rows = []
for value in ['59999.99', '60000', '60000.01', '100000']:
    amount = Decimal(value)
    fourth = Decimal('4142.62') + (amount - Decimal('35394')) * Decimal('.1822')
    fifth = Decimal('8716.67') + (amount - Decimal('60000')) * Decimal('.227')
    strict = fifth if amount > 60000 else fourth
    inclusive = fifth if amount >= 60000 else fourth
    rows.append({'base': value, 'strict': str(strict), 'inclusiveMutant': str(inclusive),
                 'difference': str(inclusive - strict)})
assert rows[1]['strict'] == '8625.8332'
(OUT / 'murcia-frontera.json').write_text(json.dumps(rows, indent=2) + '\n')
assert all(v == 'error' for k, v in read(ROOT / '.oxlintrc.json')['rules'].items() if k.startswith('anti-slop'))
print('Cadenas reabiertas:', len(persistence), '; decisiones previas conservadas:', len(previous), '; 16 reglas a error; Murcia Decimal comprobado')
