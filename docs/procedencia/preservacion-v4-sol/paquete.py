"""Exporta/restaura una colección fijada y coteja bytes con hashlib independiente."""
import gzip
import hashlib
import os
from pathlib import Path
import shutil

import edicion as e


def facts(path):
    a, b, size = hashlib.sha256(), hashlib.sha512(), 0
    with path.open('rb') as stream:
        for data in iter(lambda: stream.read(1024 * 1024), b''):
            a.update(data)
            b.update(data)
            size += len(data)
    return {'sha256': a.hexdigest(), 'sha512': b.hexdigest(), 'size': size}


def main():
    receipt = e.p.strict_json((e.HERE / 'coleccion.json').read_bytes())
    source = Path(receipt['source'])
    external = e.HERE / 'manifest-cierre.json.gz'
    raw = (source / 'manifest.json').read_bytes()
    with external.open('xb') as stream:
        stream.write(gzip.compress(raw, mtime=0))
    pin = facts(source / 'manifest.json')
    # Pin sobre bytes JSON sin comprimir; la compresión solo sirve al transporte editorial.
    pinned = e.CACHE / 'manifest-cierre.json'
    with pinned.open('xb') as stream:
        stream.write(gzip.decompress(external.read_bytes()))
    e.save(e.HERE / 'PIN-CIERRE.json', {'manifest': pin, 'compressed': facts(external), 'base': e.BASE, 'trust': 'candidato; entregar pin por canal editorial externo; requiere revisión independiente'})
    target, restored = e.CACHE / 'paquete-v4-final', e.CACHE / 'restauracion-v4-final'
    e.save(e.HERE / 'espacio.json', {'free': shutil.disk_usage(e.CACHE).free, 'paths': [str(source), str(target), str(restored)]})
    export = e.transfer(source, target, pin['sha256'], pinned)
    e.save(e.HERE / 'exportacion-final.json', export)
    restore = e.transfer(target, restored, pin['sha256'], pinned)
    e.save(e.HERE / 'restauracion-final.json', restore)
    rows = []
    for path in sorted(target.rglob('*')):
        if path.is_dir():
            continue
        relative = path.relative_to(target)
        other = restored / relative
        if path.is_symlink() or other.is_symlink():
            raise ValueError('Enlace inesperado')
        first, second = facts(path), facts(other)
        if first != second or os.stat(path).st_ino == os.stat(other).st_ino:
            raise ValueError('Copia desigual o hardlink')
        rows.append({'path': relative.as_posix(), **first})
    if {r['path'] for r in rows} != {p.relative_to(restored).as_posix() for p in restored.rglob('*') if p.is_file()}:
        raise ValueError('Entradas extra')
    e.save(e.HERE / 'copias-finales.json', {'manifest': pin, 'files': rows, 'count': len(rows), 'bytesEach': sum(r['size'] for r in rows), 'equal': True, 'hardlinks': False})
    print({'export': export, 'restore': restore, 'files': len(rows)})


if __name__ == '__main__':
    main()
