"""Cotejo físico de todas las entradas base, un blob cada vez."""
import gzip
import hashlib
import json
import os
import stat
import subprocess
import sys
from pathlib import Path

BASE = '5e69c68077ffd18be20457160595adb3f0ff52e4'
SCOPE = 'docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/'


def main():
    root = Path.cwd()
    rows = []
    entries = subprocess.check_output(['git', 'ls-tree', '-rz', '--full-tree', BASE]).split(b'\0')
    process = subprocess.Popen(['git', 'cat-file', '--batch'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    assert process.stdin is not None and process.stdout is not None
    for entry in entries:
        if not entry:
            continue
        meta, path_bytes = entry.split(b'\t', 1)
        mode, _kind, oid = meta.split()
        path = os.fsdecode(path_bytes)
        process.stdin.write(oid + b'\n')
        process.stdin.flush()
        size = int(process.stdout.readline().split()[2])
        blob = process.stdout.read(size)
        assert process.stdout.read(1) == b'\n'
        try:
            status = os.lstat(root / path)
            link = stat.S_ISLNK(status.st_mode)
            actual = os.fsencode(os.readlink(root / path)) if link else (root / path).read_bytes()
            physical_mode = b'120000' if link else (b'100755' if status.st_mode & 0o111 else b'100644')
            same = actual == blob and physical_mode == mode and (link or stat.S_ISREG(status.st_mode))
            rows.append({'path': path, 'baseSha256': hashlib.sha256(blob).hexdigest(), 'sha256': hashlib.sha256(actual).hexdigest(), 'size': len(actual), 'mode': physical_mode.decode(), 'same': same})
        except FileNotFoundError:
            rows.append({'path': path, 'deleted': True, 'same': False})
    process.stdin.close()
    process.wait()
    known = {row['path'] for row in rows}
    extra = []
    extra_paths: list[str] = []
    for directory, dirs, files in os.walk(root, followlinks=False):
        dirs[:] = [d for d in dirs if d not in ('.git', '.cache', 'node_modules')]
        for name in files:
            physical_path = Path(directory) / name
            relative = str(physical_path.relative_to(root))
            if relative not in known and relative != '.git':
                status = physical_path.lstat()
                content = os.fsencode(os.readlink(physical_path)) if stat.S_ISLNK(status.st_mode) else physical_path.read_bytes()
                extra_paths.append(relative)
                extra.append({'path': relative, 'baseSha256': None, 'sha256': hashlib.sha256(content).hexdigest(), 'size': len(content), 'mode': oct(status.st_mode)})
    result = {'head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(), 'entries': len(rows), 'differences': [r for r in rows if not r['same']], 'extra': extra, 'rows': rows, 'diff': subprocess.check_output(['git', 'diff', '--stat'], text=True), 'cachedDiff': subprocess.check_output(['git', 'diff', '--cached', '--stat'], text=True)}
    data = (json.dumps(result, ensure_ascii=False, indent=2) + '\n').encode()
    target = Path(sys.argv[1])
    target.write_bytes(gzip.compress(data, mtime=0) if target.suffix == '.gz' else data)
    assert result['head'] == BASE and len(rows) == 15914 and not result['differences']
    assert all(path.startswith(SCOPE) for path in extra_paths)
    print(json.dumps({k: v for k, v in result.items() if k not in ('rows', 'extra')}))


if __name__ == '__main__':
    main()
