"""Manifiesto por contenido y patch textual, sin escribir metadatos VCS."""
import difflib
import hashlib
import json
import subprocess
from pathlib import Path

base = 'eaed990c620b5fc4d3ff2e74dc68e0c8481c43db'
folder = Path('docs/procedencia/implementaciones/comparativa-inflacion')
paths = [Path('lib/dominio/compatibilidad-legacy/progresividad-frio.ts'), Path('lib/dominio/compatibilidad-legacy/comparativa-tabular.ts'), Path('tests/comparativa-inflacion-tabular.test.ts')]
paths += sorted(p for p in folder.iterdir() if p.is_file() and p.name not in {'MANIFIESTO.json', 'implementacion.patch'})
manifest = []
patch = []
for path in paths:
    result = subprocess.run(['git', 'show', f'{base}:{path}'], capture_output=True, check=False)
    original = result.stdout if result.returncode == 0 else None
    data = path.read_bytes()
    manifest.append({'path': str(path), 'sha256': hashlib.sha256(data).hexdigest(), 'size': len(data), 'baseSha256': hashlib.sha256(original).hexdigest() if original is not None else None})
    if original is None and not data:
        patch.append(f'diff --git a/{path} b/{path}\nnew file mode 100644\nindex 0000000..e69de29\n')
    patch.extend(difflib.unified_diff((original or b'').decode().splitlines(True), data.decode().splitlines(True), fromfile=f'a/{path}' if original is not None else '/dev/null', tofile=f'b/{path}'))
tracked = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', base]).decode().splitlines()
missing = [p for p in tracked if not Path(p).exists()]
assert not missing, missing
patch_data = ''.join(patch).encode()
(folder / 'implementacion.patch').write_bytes(patch_data)
(folder / 'MANIFIESTO.json').write_text(json.dumps({'base': base, 'archivosBase': len(tracked), 'borrados': missing, 'archivos': manifest, 'patchSha256': hashlib.sha256(patch_data).hexdigest(), 'exclusiones': ['MANIFIESTO.json (evita autorreferencia)', 'implementacion.patch (digest separado)', 'node_modules (enlace de lectura)', '.cache/comparativa-inflacion (scratch propio)']}, indent=2) + '\n')
