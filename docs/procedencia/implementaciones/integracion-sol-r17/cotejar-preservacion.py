"""Cotejo de corte documental; solo lee los paquetes recibidos."""
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
spec = importlib.util.spec_from_file_location('recolector', ROOT / 'docs/procedencia/preservacion-v3/recolector.py')
assert spec is not None and spec.loader is not None
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
receipts = {}
for name in ['paquete-v3', 'restauracion-v3']:
    receipt = module.verify(Path('/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion') / name)
    receipts[name] = {'objects': len(receipt['objects']), 'bytes': receipt['bytes']}
manifest = json.loads((ROOT / 'docs/procedencia/preservacion-v3/manifest.json').read_bytes())
transport = json.loads((ROOT / 'docs/procedencia/preservacion-v3/transporte-v2.json').read_bytes())

def hashes(value):
    result = set()
    if isinstance(value, dict):
        if 'sha256' in value:
            result.add(value['sha256'])
        for child in value.values():
            result.update(hashes(child))
    elif isinstance(value, list):
        for child in value:
            result.update(hashes(child))
    return result

preserved = hashes(manifest['annex']) | hashes(transport['blobs'])
rows = []
for source in ['docs/procedencia/correcciones/derechos-familiares-r15/fuentes.json',
               'docs/procedencia/auditorias/tgss-etapas-operativas/binarios.json']:
    raw = (ROOT / source).read_bytes()
    for obj in json.loads(raw):
        rows.append({'source': source, 'sourceSha256': hashlib.sha256(raw).hexdigest(),
                     'sha256': obj['sha256'], 'sha512': obj['sha512'], 'size': obj['size'],
                     'includedInV3': obj['sha256'] in preserved,
                     'reference': obj.get('manifest', obj.get('path'))})
for crop in sorted((ROOT / 'docs/procedencia/auditorias/tgss-etapas-operativas/crops').glob('*.png')):
    raw = crop.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    rows.append({'source': str(crop.relative_to(ROOT)), 'sha256': digest,
                 'sha512': hashlib.sha512(raw).hexdigest(), 'size': len(raw),
                 'class': 'facsimil', 'includedInV3': digest in preserved,
                 'reference': str(crop.relative_to(ROOT))})
result = {'copiesReadOnlyVerified': receipts, 'coverage': rows,
          'missing': [r for r in rows if not r['includedInV3']],
          'completeCurrentCorpusCoverage': False, 'fiscalAcceptance': False}
(HERE / 'corte-preservacion.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False))
