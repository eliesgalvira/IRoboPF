"""Clasifica diferencias de política sin imprimir valores de metadatos reales."""
import gzip
import hashlib
import importlib
import json
from pathlib import Path
import sys

ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / 'docs/procedencia/preservacion-v4-sol'))
e = importlib.import_module('edicion')
store = Path('/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v4-938f230888d2')
raw = (store / 'manifest-externo.json').read_bytes()
assert hashlib.sha256(raw).hexdigest() == e.HISTORICAL_PIN
rows = []
for dep in json.loads(raw)['dependencies']:
    if dep['historical'] or not dep['path'].endswith(('.json', '.json.gz')):
        continue
    path = store / 'paquete/dependencies' / dep['sha256']
    data = path.read_bytes()
    if dep['path'].endswith('.gz'):
        data = gzip.decompress(data)
    value = e.p.strict_json(data)
    if e.clean(value) == value:
        continue
    categories: dict[str, int] = {}
    def walk(node):
        if isinstance(node, dict):
            for child in node.values():
                walk(child)
        elif isinstance(node, list):
            for child in node:
                walk(child)
        elif isinstance(node, str) and e.clean(node) != node:
            category = 'localizador-explicito' if node.startswith(('/home/', '/tmp/', '/var/tmp/', '/run/user/', '/Users/', 'file://')) else 'URL-privada-o-malformada'
            categories[category] = categories.get(category, 0) + 1
    walk(value)
    rows.append(dict(path=dep['path'], sha256=dep['sha256'], categories=categories))
(Path(__file__).resolve().parent / 'exposicion-real.json').write_text(json.dumps({'policyDifferences': rows, 'valuesOmitted': True, 'credentialsProven': False, 'absenceOfSecretsCertified': False}, indent=2) + '\n')
