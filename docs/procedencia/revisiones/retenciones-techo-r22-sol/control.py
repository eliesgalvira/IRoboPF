import gzip
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

BASE = 'e6869301240add8a0bd3c8727998c83a214abd43'
OUT = Path('docs/procedencia/revisiones/retenciones-techo-r22-sol')

def main():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
    rows = []
    failures = []
    entries = subprocess.check_output(['git', 'ls-tree', '-rz', '--full-tree', BASE]).split(b'\0')
    for entry in entries:
        if not entry:
            continue
        info, name = entry.split(b'\t', 1)
        mode, kind, oid = info.decode().split()
        path = Path(os.fsdecode(name))
        blob = subprocess.check_output(['git', 'cat-file', 'blob', oid])
        row = {'path': str(path), 'mode': mode, 'baseSha256': hashlib.sha256(blob).hexdigest(), 'baseSize': len(blob)}
        try:
            st = path.lstat()
            target = os.readlink(path) if stat.S_ISLNK(st.st_mode) else None
            actual = os.fsencode(target) if target is not None else path.read_bytes()
            row.update(size=len(actual), sha256=hashlib.sha256(actual).hexdigest(), lstatMode=oct(st.st_mode), readlink=target)
            row['ok'] = actual == blob and (stat.S_ISLNK(st.st_mode) if mode == '120000' else stat.S_ISREG(st.st_mode)) and (mode != '100755' or bool(st.st_mode & 0o111))
        except OSError as exc:
            row.update(ok=False, error=str(exc))
        if not row['ok']:
            failures.append(str(path))
        rows.append(row)
    result = {'head': BASE, 'count': len(rows), 'failures': failures, 'entries': rows,
              'diff': subprocess.check_output(['git', 'diff', '--name-status', BASE]).decode()}
    with gzip.open(OUT / ('control-' + sys.argv[1] + '.json.gz'), 'wt') as stream:
        json.dump(result, stream, ensure_ascii=False)
    print(json.dumps({'count': len(rows), 'failures': failures, 'diff': result['diff']}))
    assert len(rows) == 14596 and not failures

if __name__ == '__main__':
    main()
