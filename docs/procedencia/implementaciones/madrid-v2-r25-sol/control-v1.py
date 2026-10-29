"""Cambia únicamente el registro del scratch explícito a los bytes históricos v1."""
import hashlib
import json
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[4]
scratch = root / '.cache/madrid-v2-r25-sol/ensayo'
prefix = 'docs/procedencia/implementaciones/madrid-v2-r25-sol/'
relative = 'docs/procedencia/enlaces/madrid-2020-limite.json' if '--v1' in sys.argv else prefix + 'payload-v2.json'
raw = (root / relative).read_bytes()
registry = {'schemaVersion': 1, 'entries': [{'payload': {'path': relative, 'sha256': hashlib.sha256(raw).hexdigest()}, 'attestation': None}]}
(scratch / 'docs/procedencia/enlaces/registro.json').write_text(json.dumps(registry) + '\n')
print('Solo scratch:', relative, 'attestation=null')
