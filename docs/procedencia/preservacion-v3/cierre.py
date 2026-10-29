"""Recibos independientes de las copias y selección final de entrega."""
import difflib
import hashlib
import os

import recolector as r


def independent(path):
    sha256, sha512, size = hashlib.sha256(), hashlib.sha512(), 0
    with path.open('rb') as stream:
        while chunk := stream.read(1024 * 1024):
            sha256.update(chunk)
            sha512.update(chunk)
            size += len(chunk)
    return {'sha256': sha256.hexdigest(), 'sha512': sha512.hexdigest(), 'size': size}


def receipts():
    result = []
    for name in ('paquete-v3', 'restauracion-v3'):
        root = r.PARENT / '.cache/orquestador-preservacion' / name
        rows = []
        for directory in (root, root / 'sha256', root / 'dependencies'):
            for path in sorted(directory.iterdir()):
                if path.is_symlink():
                    raise ValueError('Enlace inesperado')
                if path.is_file():
                    rows.append({'path': path.relative_to(root).as_posix(), **independent(path)})
        result.append({'root': str(root), 'files': rows, 'bytes': sum(row['size'] for row in rows)})
    if result[0]['files'] != result[1]['files']:
        raise ValueError('Copias diferentes')
    r.save(r.HERE / 'copias.json', result)
    source = 'docs/procedencia/auditorias/correcciones-x-2051956145145712916/manifiesto.json'
    data = r.p.strict_json((r.ROOT / source).read_bytes())
    rows = [{'sha256': row['sha256'], 'size': row['size'], 'path': row['path'],
             'class': 'evidencia-publica-no-oficial', 'status': 'excluido-del-paquete-documental'}
            for row in data['files'] if '/cas-x-no-oficial/' in row['path']]
    r.save(r.HERE / 'exclusiones-publicas.json', {'source': source, 'fingerprint': independent(r.ROOT / source), 'rows': rows})
    fixture = r.ROOT / 'docs/procedencia/corpus/fixtures/sha256/2d0dd390471ad35e96377f925eed42ec8babc55943aa775a7da24c02fe9576eb'
    r.save(r.HERE / 'cierre.json', {'pins': {name: independent(r.HERE / name) for name in ('manifest.json', 'transporte-v2.json')},
                                   'copies': [{'root': row['root'], 'bytes': row['bytes'], 'files': len(row['files'])} for row in result],
                                   'excludedFixture': {'path': fixture.relative_to(r.ROOT).as_posix(), **independent(fixture)},
                                   'v2UnchangedManifest': independent(r.PARENT / '.cache/orquestador-preservacion/paquete-v2/manifest.json')})
    print({'copies': len(result), 'filesEach': len(result[0]['files']), 'bytesEach': result[0]['bytes']})


def deliver():
    files = sorted(path for path in r.HERE.iterdir() if path.is_file() and path.name not in {'entrega.patch', 'MANIFIESTO.json'})
    with (r.HERE / 'entrega.patch').open('w') as stream:
        for path in files:
            rel = path.relative_to(r.ROOT).as_posix()
            stream.writelines(difflib.unified_diff([], path.read_text().splitlines(keepends=True), fromfile='/dev/null', tofile='b/' + rel))
    files.append(r.HERE / 'entrega.patch')
    r.save(r.HERE / 'MANIFIESTO.json', {'base': r.BASE, 'deletions': [], 'files': [
        {'path': path.relative_to(r.ROOT).as_posix(), **independent(path), 'baseSha256': None} for path in files]})
    files.append(r.HERE / 'MANIFIESTO.json')
    for name in ('paquete-v3', 'restauracion-v3'):
        destination = r.PARENT / '.cache/orquestador-preservacion' / name / 'entrega-t3-7f0c6fb6-final'
        r.p.durable_mkdir(destination)
        for path in files:
            target = destination / path.name
            r.p.publish(target, path.read_bytes())
            if independent(target) != independent(path):
                raise ValueError('Copia de entrega divergente')
        r.p.sync_directory(destination)
        r.p.sync_directory(destination.parent)
    print({'deliveryFiles': len(files), 'copies': 2, 'bothHashes': True})


if __name__ == '__main__':
    if os.environ.get('PRESERVACION_ENTREGA') == '1':
        deliver()
    else:
        receipts()
