"""Entrega textual y binaria sin mutar VCS; manifiesto relativo con base física cotejada."""
import difflib
import gzip
import json
import subprocess
from fisico import BASE, OUT, ROOT
from revisar import facts


def main():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
    assert not subprocess.check_output(['git', 'diff', BASE, '--'])
    final = json.loads(gzip.decompress((OUT / 'fisico-final.json.gz').read_bytes()))
    assert final['entries'] == 15029 and not final['physicalDifferences']
    excluded = {'MANIFIESTO.json', 'binarios.json', 'entrega.patch.gz'}
    patch: list[str] = []
    binaries = []
    for path in sorted(OUT.iterdir()):
        if not path.is_file() or path.name in excluded:
            continue
        data = path.read_bytes()
        assert len(data) <= 1000000 or path.suffix == '.gz', path
        relative = path.relative_to(ROOT).as_posix()
        try:
            if b'\0' in data:
                raise UnicodeError('binario')
            text = data.decode()
        except UnicodeError:
            binaries.append(dict(path=relative, **facts(path)))
            continue
        patch.extend(difflib.unified_diff([], text.splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + relative))
    (OUT / 'entrega.patch.gz').write_bytes(gzip.compress(''.join(patch).encode(), mtime=0))
    (OUT / 'binarios.json').write_text(json.dumps(binaries, indent=2) + '\n')
    rows = [dict(path=p.relative_to(ROOT).as_posix(), **facts(p), baseSha256=None) for p in sorted(OUT.iterdir()) if p.is_file() and p.name != 'MANIFIESTO.json']
    manifest = dict(base=BASE, head=BASE, physicalEntriesChecked=15029, physicalDifferences=[], deletions=[], files=rows, selfExcluded=True, patchExcludes=sorted(excluded), cacheExcluded=True)
    (OUT / 'MANIFIESTO.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(dict(files=len(rows), binaries=len(binaries), manifest=facts(OUT / 'MANIFIESTO.json'), patch=facts(OUT / 'entrega.patch.gz')))

if __name__ == '__main__':
    main()
