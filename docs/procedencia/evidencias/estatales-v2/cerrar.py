"""Sobre de integración por archivo, sin operaciones VCS mutantes."""
import difflib
import hashlib
import json
import os
import subprocess
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
BASE = 'eaed990c620b5fc4d3ff2e74dc68e0c8481c43db'


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def save(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


paths = [p for p in subprocess.check_output(['git', 'ls-tree', '-r', '-z', '--name-only', BASE], cwd=ROOT).decode().split('\0') if p]
missing = [p for p in paths if not ((ROOT / p).is_file() or (ROOT / p).is_symlink())]
links = []
for name in paths:
    path = ROOT / name
    if path.is_symlink():
        expected = subprocess.check_output(['git', 'show', BASE + ':' + name], cwd=ROOT)
        actual = os.readlink(path).encode()
        assert actual == expected
        links.append({'path': name, 'targetSha256': sha(actual), 'baseTargetSha256': sha(expected)})
save('control-base.json', {'base': BASE, 'trackedEntriesPresent': len(paths) - len(missing), 'symlinksVerifiedWithoutFollowing': links, 'missing': missing, 'deletionsProposed': [], 'vcsMutations': False})
assert not missing, missing
excluded = {'manifiesto.json', 'entrega.patch', 'cierre.json'}
files = [p for p in sorted(OUT.rglob('*')) if p.is_file() and p.name not in excluded and '__pycache__' not in p.parts]
entries = []
patch: list[str] = []
for path in files:
    relative = str(path.relative_to(ROOT))
    assert relative not in paths, relative
    raw = path.read_bytes()
    binary = path.parent.name == 'sha256'
    entries.append({'path': relative, 'sha256': sha(raw), 'size': len(raw), 'baseSha256': None, 'binary': binary})
    if not binary:
        patch.extend(difflib.unified_diff([], raw.decode().splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + relative))
(OUT / 'entrega.patch').write_text(''.join(patch))
p = OUT / 'entrega.patch'
entries.append({'path': str(p.relative_to(ROOT)), 'sha256': sha(p.read_bytes()), 'size': p.stat().st_size, 'baseSha256': None, 'binary': False})
save('manifiesto.json', {'base': BASE, 'files': entries, 'deletions': [], 'excludedEnvelopes': ['manifiesto.json', 'cierre.json']})
p = OUT / 'manifiesto.json'
save('cierre.json', {'base': BASE, 'manifest': {'path': str(p.relative_to(ROOT)), 'sha256': sha(p.read_bytes()), 'size': p.stat().st_size, 'baseSha256': None}, 'files': len(entries), 'deletions': [], 'note': 'El sobre no contiene su propio hash; se comunica en la entrega al padre.'})
print(json.dumps({'files': len(entries), 'baseFilesPresent': len(paths), 'manifestSha256': sha(p.read_bytes()), 'closureSha256': sha((OUT / 'cierre.json').read_bytes())}))
