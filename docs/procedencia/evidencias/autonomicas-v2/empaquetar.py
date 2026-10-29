"""Manifiesto y patch de altas; no lee ni modifica índices."""
import difflib
import hashlib
import json
import subprocess
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
BASE = 'eaed990c620b5fc4d3ff2e74dc68e0c8481c43db'


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def write(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


tracked = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', BASE], cwd=ROOT).decode().splitlines()
absent = [p for p in tracked if not (ROOT / p).exists() and not (ROOT / p).is_symlink()]
symlinks = []
for name in tracked:
    path = ROOT / name
    if path.is_symlink():
        target = str(path.readlink())
        expected = subprocess.check_output(['git', 'show', f'{BASE}:{name}'], cwd=ROOT).decode()
        assert target == expected
        symlinks.append({'path': name, 'target': target, 'targetExists': path.exists(), 'matchesBase': True})
assert not absent
write(OUT / 'preflight.json', {'base': BASE, 'trackedEntriesPresent': len(tracked), 'absent': absent, 'deleted': [], 'symlinks': symlinks,
                             'ownership': 'docs/procedencia/evidencias/autonomicas-v2/', 'mutatingVcsOperations': 0})
files = []
patch: list[str] = []
for path in sorted(OUT.rglob('*')):
    if not path.is_file() or 'scratch' in path.relative_to(OUT).parts or '__pycache__' in path.parts:
        continue
    if path.name in ('manifiesto.json', 'entrega.patch', 'entrega-hashes.json'):
        continue
    name = str(path.relative_to(ROOT))
    raw = path.read_bytes()
    assert name not in tracked, name
    files.append({'path': name, 'sha256': digest(raw), 'size': len(raw), 'baseSha256': None})
    if 'cas/sha256' not in name:
        patch.extend(difflib.unified_diff([], raw.decode().splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + name))
(OUT / 'entrega.patch').write_text(''.join(patch))
write(OUT / 'manifiesto.json', {'base': BASE, 'files': files, 'deleted': [], 'excludes': ['scratch', '__pycache__', 'manifiesto.json', 'entrega.patch', 'entrega-hashes.json']})
write(OUT / 'entrega-hashes.json', {p: {'sha256': digest((OUT / p).read_bytes()), 'size': (OUT / p).stat().st_size} for p in ('manifiesto.json', 'entrega.patch')})
print(json.dumps({'files': len(files), 'baseFiles': len(tracked), 'deleted': 0}))
