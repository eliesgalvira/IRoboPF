"""Entrega acotada de archivos nuevos y patch textual; sin mutación VCS."""
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
BASE = '6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9'
EXCLUDED = {'MANIFIESTO.json', 'entrega.patch.gz', 'binarios.json'}
rows = []
binaries = []
patches: list[str] = []
for path in sorted(OUT.rglob('*')):
    if not path.is_file() or path.name in EXCLUDED:
        continue
    assert not path.is_symlink()
    relative = path.relative_to(ROOT).as_posix()
    data = path.read_bytes()
    base = subprocess.run(['git', 'cat-file', '-e', f'{BASE}:{relative}'], capture_output=True)
    assert base.returncode != 0, relative
    row = {'path': relative, 'sha256': hashlib.sha256(data).hexdigest(), 'size': len(data), 'baseSha256': None}
    rows.append(row)
    try:
        text = data.decode('utf-8')
    except UnicodeDecodeError:
        binaries.append(row)
    else:
        patches.extend(difflib.unified_diff([], text.splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + relative))
(OUT / 'entrega.patch.gz').write_bytes(gzip.compress(''.join(patches).encode(), mtime=0))
(OUT / 'binarios.json').write_text(json.dumps(binaries, indent=2) + '\n')
for name in ('entrega.patch.gz', 'binarios.json'):
    data = (OUT / name).read_bytes()
    rows.append({'path': (OUT / name).relative_to(ROOT).as_posix(), 'sha256': hashlib.sha256(data).hexdigest(), 'size': len(data), 'baseSha256': None})
(OUT / 'MANIFIESTO.json').write_text(json.dumps({'head': BASE, 'physicalStart': 'fisico-inicio.json.gz', 'physicalEnd': 'fisico-final.json.gz', 'files': rows, 'selfExcluded': True, 'scope': OUT.relative_to(ROOT).as_posix()}, indent=2) + '\n')
print('Manifiesto, patch textual gzip y binarios por ruta/hash preparados.')
