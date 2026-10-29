"""Anclas exactas de los consumidores examinados; no cambia su contrato."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
paths = ['tools/procedencia/enlaces.py', 'scripts/procedencia/verificar-enlaces.mjs',
         'scripts/procedencia/ambito-publicado.mjs', 'schemas/procedencia/executable-cell-scope.schema.json',
         'schemas/procedencia/binding-payload.schema.json', '.oxlintrc.json']
rows = []
for path in paths:
    raw = (ROOT / path).read_bytes()
    rows.append({'path': path, 'sha256': hashlib.sha256(raw).hexdigest(),
                 'sha512': hashlib.sha512(raw).hexdigest(), 'size': len(raw)})
rules = json.loads((ROOT / '.oxlintrc.json').read_bytes())['rules']
assert len(rules) == 16 and set(rules.values()) == {'error'}
(OUT / 'contrato-examinado.json').write_text(json.dumps({'files': rows, 'rules': rules,
    'changesToConsumers': False, 'scope': 'Inspección de Python y consumidor de publicación Node, sin publicación nueva.'}, ensure_ascii=False, indent=2) + '\n')
print('Consumidores anclados; 16 reglas a error, sin modificaciones.')
