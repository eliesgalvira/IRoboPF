"""Cotejo físico final contra cada blob base y entrega sin operaciones VCS mutantes."""
import difflib
import gzip
import hashlib
import os
import stat
import subprocess

import edicion as e


def main():
    head = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip()
    if head != e.BASE:
        raise ValueError('HEAD inesperado')
    rows = []
    for entry in subprocess.check_output(['git', 'ls-tree', '-rz', e.BASE]).split(b'\0'):
        if not entry:
            continue
        meta, raw = entry.split(b'\t', 1)
        mode, _, oid = meta.split()
        path = e.ROOT / os.fsdecode(raw)
        info = path.lstat()
        original = subprocess.check_output(['git', 'cat-file', 'blob', oid.decode()])
        linked = mode == b'120000'
        if not (stat.S_ISLNK(info.st_mode) if linked else stat.S_ISREG(info.st_mode)):
            raise ValueError('Tipo físico distinto')
        actual = os.fsencode(os.readlink(path)) if linked else path.read_bytes()
        if actual != original:
            raise ValueError('Bytes base alterados: ' + str(path.relative_to(e.ROOT)))
        rows.append({'path': path.relative_to(e.ROOT).as_posix(), 'mode': mode.decode(), 'sha256': hashlib.sha256(actual).hexdigest(), 'size': len(actual), 'readlink': os.readlink(path) if linked else None})
    if len(rows) != 14537:
        raise ValueError('Recuento base distinto')
    diff = subprocess.check_output(['git', 'diff', e.BASE, '--']).decode()
    if diff:
        raise ValueError('Cambios versionados ajenos')
    with (e.HERE / 'arbol-cierre.json.gz').open('wb') as stream:
        stream.write(gzip.compress(e.p.encoded({'base': e.BASE, 'head': head, 'entries': rows, 'diff': diff, 'deletions': [], 'physicalBytesEqual': True}), mtime=0))
    excluded = {'MANIFIESTO.json', 'entrega.patch.gz', 'binarios.json'}
    text_patch: list[str] = []
    binaries = []
    for path in sorted(e.HERE.rglob('*')):
        if not path.is_file() or path.name in excluded:
            continue
        relative = path.relative_to(e.ROOT).as_posix()
        data = path.read_bytes()
        try:
            if b'\0' in data:
                raise UnicodeError('binario')
            content = data.decode('utf8')
        except UnicodeError:
            binaries.append({'path': relative, **e.p.fingerprint(path)})
            continue
        text_patch.extend(difflib.unified_diff([], content.splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + relative))
    (e.HERE / 'entrega.patch.gz').write_bytes(gzip.compress(''.join(text_patch).encode(), mtime=0))
    e.save(e.HERE / 'binarios.json', binaries)
    manifest = []
    for path in sorted(e.HERE.rglob('*')):
        if path.is_file() and path.name != 'MANIFIESTO.json':
            manifest.append({'path': path.relative_to(e.ROOT).as_posix(), **e.p.fingerprint(path), 'baseSha256': None})
    e.save(e.HERE / 'MANIFIESTO.json', {'base': e.BASE, 'head': head, 'entriesChecked': len(rows), 'deletions': [], 'files': manifest, 'selfExcluded': True, 'patchExcludes': sorted(excluded), 'cacheExcluded': True})
    print({'files': len(manifest), 'baseEntries': len(rows), 'deletions': 0})


if __name__ == '__main__':
    main()
