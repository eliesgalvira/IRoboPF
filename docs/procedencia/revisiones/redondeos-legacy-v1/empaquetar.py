"""Manifiesto y patch de la entrega; excluye copia de validación no integrable."""
import difflib
import hashlib
import json
from pathlib import Path

out = Path(__file__).parent
base = 'eaed990c620b5fc4d3ff2e74dc68e0c8481c43db'
prefix = 'docs/procedencia/revisiones/redondeos-legacy-v1/'
files = sorted(p for p in out.iterdir() if p.is_file() and p.name not in ('MANIFIESTO.json', 'entrega.patch'))
patch = []
for path in files:
    patch.extend(difflib.unified_diff([], path.read_text().splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + prefix + path.name))
(out / 'entrega.patch').write_text(''.join(patch))
files.append(out / 'entrega.patch')
manifest = {'base': base, 'borrados': [], 'excluidos': ['validacion/: copia de validación, no integrar; enlaces de lectura node_modules/docs'], 'files': [{'path': prefix + p.name, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'size': p.stat().st_size, 'baseSha256': None} for p in files]}
(out / 'MANIFIESTO.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
