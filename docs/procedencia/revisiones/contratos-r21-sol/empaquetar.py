"""Transporte de la carpeta exclusiva, sin índices ni operaciones VCS mutantes."""
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
BASE = '960773f909d4ecff290edfa3d7a7b2699a8445d3'


def main() -> None:
    excluded = {'manifiesto.json', 'entrega.patch.gz', 'binarios.json'}
    files = [p for p in sorted(OUT.rglob('*')) if p.is_file()
             and 'binarios' not in p.relative_to(OUT).parts and p.name not in excluded]
    binaries = []
    patch: list[str] = []
    rows = []
    (OUT / 'binarios').mkdir(exist_ok=True)
    for p in files:
        path = p.relative_to(ROOT).as_posix()
        raw = p.read_bytes()
        h = hashlib.sha256(raw).hexdigest()
        # Todas las rutas entregadas son nuevas; se verifica contra el árbol, no índice.
        exists = subprocess.run(['git', 'cat-file', '-e', f'{BASE}:{path}'], capture_output=True)
        assert exists.returncode != 0, path
        rows.append({'path': path, 'sha256': h, 'size': len(raw), 'baseSha256': None})
        if p.suffix == '.gz':
            target = OUT / 'binarios' / h
            target.write_bytes(raw)
            binaries.append({'path': path, 'sha256': h, 'size': len(raw),
                             'transport': target.relative_to(ROOT).as_posix()})
        else:
            patch.extend(difflib.unified_diff([], raw.decode().splitlines(keepends=True),
                                            fromfile='/dev/null', tofile='b/' + path))
    (OUT / 'binarios.json').write_text(json.dumps(binaries, indent=2) + '\n')
    compressed = gzip.compress(''.join(patch).encode(), mtime=0)
    (OUT / 'entrega.patch.gz').write_bytes(compressed)
    for name in ('binarios.json', 'entrega.patch.gz'):
        p = OUT / name
        raw = p.read_bytes()
        rows.append({'path': p.relative_to(ROOT).as_posix(), 'sha256': hashlib.sha256(raw).hexdigest(),
                     'size': len(raw), 'baseSha256': None})
    for b in binaries:
        rows.append({'path': b['transport'], 'sha256': b['sha256'], 'size': b['size'], 'baseSha256': None})
    (OUT / 'manifiesto.json').write_text(json.dumps({'base': BASE, 'head': BASE,
        'deletions': [], 'files': rows, 'excludes': ['manifiesto.json']}, indent=2) + '\n')
    print(json.dumps({'files': len(rows), 'bytes': sum(r['size'] for r in rows), 'deletions': []}))


if __name__ == '__main__':
    main()
