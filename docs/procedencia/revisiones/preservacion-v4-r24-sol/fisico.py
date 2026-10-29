"""Cotejo físico completo, un blob por vez, sin mutaciones VCS."""
import gzip
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

ROOT = Path.cwd()
BASE = '59bb4c8e8dc239823008c02213ea78b59b51d249'
OUT = ROOT / 'docs/procedencia/revisiones/preservacion-v4-r24-sol'

def main():
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
        data = os.fsencode(os.readlink(path)) if mode == b'120000' else path.read_bytes()
        assert stat.S_ISLNK(info.st_mode) if mode == b'120000' else stat.S_ISREG(info.st_mode)
        if mode != b'120000':
            assert bool(info.st_mode & stat.S_IXUSR) == (mode == b'100755'), os.fsdecode(name)
        assert blob == data, os.fsdecode(name)
        rows.append({'path': os.fsdecode(name), 'sha256': hashlib.sha256(data).hexdigest(), 'size': len(data), 'mode': mode.decode()})
    assert len(rows) == 15029, len(rows)
    result = {'head': BASE, 'entries': len(rows), 'physicalDifferences': [], 'rows': rows,
              'diff': subprocess.check_output(['git', 'diff', BASE, '--stat']).decode(),
              'status': subprocess.check_output(['git', 'status', '--porcelain']).decode()}
    with gzip.open(OUT / ('fisico-' + sys.argv[1] + '.json.gz'), 'wt') as stream:
        json.dump(result, stream, ensure_ascii=False)
    print({'entries': len(rows), 'physicalDifferences': 0})

if __name__ == '__main__':
    main()
