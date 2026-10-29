"""Transporte de archivos propios, sin operaciones VCS mutantes."""
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
BASE = 'e6869301240add8a0bd3c8727998c83a214abd43'
META = {'manifiesto.json', 'binarios.json', 'entrega.patch.gz', 'entrega.json'}


def record(path, data):
    return dict(path=str(path.relative_to(ROOT)), sha256=hashlib.sha256(data).hexdigest(), size=len(data), baseSha256=None)


def main():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
    assert not subprocess.check_output(['git', 'diff', '--name-status', BASE])
    for phase in ['inicial', 'final']:
        control = json.loads(gzip.decompress((OUT / f'control-{phase}.json.gz').read_bytes()))
        assert control['head'] == BASE and control['count'] == 14596
        assert control['failures'] == [] and control['diff'] == ''
    other = subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard', '-z']).split(b'\0')
    assert all(not p or p.decode().startswith(str(OUT.relative_to(ROOT)) + '/') for p in other)
    manifests, binary = [], []
    patches: list[str] = []
    for path in sorted(OUT.iterdir()):
        if path.name in META:
            continue
        assert path.is_file() and not path.is_symlink()
        data = path.read_bytes()
        manifests.append(record(path, data))
        if path.suffix == '.gz':
            binary.append(record(path, data))
        else:
            text = data.decode('utf-8')
            patches.extend(difflib.unified_diff([], text.splitlines(keepends=True),
                           fromfile='/dev/null', tofile='b/' + str(path.relative_to(ROOT))))
    patch = ''.join(patches).encode()
    (OUT / 'entrega.patch.gz').write_bytes(gzip.compress(patch, mtime=0))
    (OUT / 'manifiesto.json').write_text(json.dumps(dict(base=BASE, files=manifests, deletions=[], excludedSelfMetadata=sorted(META)), ensure_ascii=False, indent=2) + '\n')
    (OUT / 'binarios.json').write_text(json.dumps(binary, ensure_ascii=False, indent=2) + '\n')
    result = dict(head=BASE, baseEntries=14596, deletions=[], files=len(manifests), size=sum(r['size'] for r in manifests),
                  metadata=[record(OUT / name, (OUT / name).read_bytes()) for name in sorted(META - {'entrega.json'})])
    (OUT / 'entrega.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    for row in manifests:
        data = (ROOT / row['path']).read_bytes()
        assert len(data) == row['size'] and hashlib.sha256(data).hexdigest() == row['sha256']
    assert gzip.decompress((OUT / 'entrega.patch.gz').read_bytes()) == patch
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
