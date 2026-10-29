"""Cotejo completo contra la base, sin confiar en el índice."""
import gzip
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

ROOT = Path.cwd()
BASE = '6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9'
OUT = ROOT / 'docs/procedencia/revisiones/preservacion-v4-r26-sol'
assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
rows = []
for entry in subprocess.check_output(['git', 'ls-tree', '-rz', BASE]).split(b'\0'):
    if not entry:
        continue
    meta, name = entry.split(b'\t', 1)
    mode, kind, oid = meta.split()
    path = ROOT / os.fsdecode(name)
    info = path.lstat()
    blob = subprocess.check_output(['git', 'cat-file', 'blob', oid.decode()])
    if mode == b'120000':
        assert stat.S_ISLNK(info.st_mode), name
        data = os.fsencode(os.readlink(path))
    else:
        assert stat.S_ISREG(info.st_mode), name
        assert bool(info.st_mode & stat.S_IXUSR) == (mode == b'100755'), name
        data = path.read_bytes()
    assert blob == data, name
    rows.append({'path': os.fsdecode(name), 'sha256': hashlib.sha256(data).hexdigest(), 'size': len(data), 'mode': mode.decode()})
assert len(rows) == 15456
with gzip.open(OUT / ('fisico-' + sys.argv[1] + '.json.gz'), 'wt') as stream:
    json.dump({'head': BASE, 'entries': len(rows), 'physicalDifferences': [], 'rows': rows,
               'diff': subprocess.check_output(['git', 'diff', BASE, '--stat']).decode(),
               'status': subprocess.check_output(['git', 'status', '--porcelain']).decode()}, stream)
print('HEAD correcto; 15456 entradas físicas idénticas; cero borrados o cambios de modo.')
