"""Recibe un corte fijado; comprueba copias con hashlib y restaura fuera de T3."""
import gzip
import hashlib
import importlib
import json
import os
from pathlib import Path
import stat
import sys

ROOT = Path('/home/elies/Repos/IRoboPF')
HERE = Path(__file__).resolve().parent
SOURCE = Path('/home/elies/.t3/worktrees/IRoboPF/t3-06f31ede/.cache/preservacion-v4-sol')
PIN = '938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2'
DEST = ROOT / '.cache/orquestador-preservacion/v4-938f230888d2'
sys.path.insert(0, str(ROOT / 'docs/procedencia/preservacion-v4-sol'))
edition = importlib.import_module('edicion')


def facts(path: Path) -> dict:
    a, b, size = hashlib.sha256(), hashlib.sha512(), 0
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            a.update(block)
            b.update(block)
            size += len(block)
    return {'sha256': a.hexdigest(), 'sha512': b.hexdigest(), 'size': size}


def verify_independent(folder: Path, expected: dict, other: Path | None = None) -> dict:
    edition.p.no_symlink_ancestors(folder)
    actual = set()
    for directory, dirs, files in os.walk(folder, followlinks=False):
        for name in dirs:
            assert stat.S_ISDIR((Path(directory) / name).lstat().st_mode)
        for name in files:
            path = Path(directory) / name
            assert stat.S_ISREG(path.lstat().st_mode)
            relative = path.relative_to(folder).as_posix()
            actual.add(relative)
    assert actual == set(expected), 'Conjunto físico distinto del manifiesto'
    for relative, fp in expected.items():
        path = folder / relative
        assert facts(path) == fp, relative
        if other is not None:
            a, b = path.stat(), (other / relative).stat()
            assert (a.st_dev, a.st_ino) != (b.st_dev, b.st_ino), relative
    return {'path': str(folder), 'files': len(actual),
            'bytes': sum(x['size'] for x in expected.values()),
            'sha256Sha512SizeVerified': True, 'hardlinksToOther': False if other else None}


def main() -> None:
    raw = gzip.decompress((ROOT / 'docs/procedencia/preservacion-v4-sol/manifest-cierre.json.gz').read_bytes())
    assert hashlib.sha256(raw).hexdigest() == PIN
    data = json.loads(raw)
    expected = {'manifest.json': {'sha256': PIN, 'sha512': hashlib.sha512(raw).hexdigest(), 'size': len(raw)}}
    for name, rows in [('sha256', data['objects']), ('dependencies', data['dependencies'])]:
        for row in rows:
            relative = name + '/' + row['sha256']
            value = {k: row[k] for k in ['sha256', 'sha512', 'size']}
            assert relative not in expected or expected[relative] == value
            expected[relative] = value
    assert len(expected) == 7991
    copies = [verify_independent(SOURCE / 'paquete-v4-final', expected),
              verify_independent(SOURCE / 'restauracion-v4-final', expected, SOURCE / 'paquete-v4-final')]
    print('Dos copias de origen verificadas con hashlib y pin externo', flush=True)
    edition.p.no_symlink_ancestors(DEST)
    DEST.mkdir(exist_ok=False)
    external = DEST / 'manifest-externo.json'
    with external.open('xb') as stream:
        stream.write(raw)
        stream.flush()
        os.fchmod(stream.fileno(), 0o444)
        os.fsync(stream.fileno())
    edition.p.sync_directory(DEST)
    package, restored = DEST / 'paquete', DEST / 'restauracion'
    exported = edition.transfer(SOURCE / 'paquete-v4-final', package, PIN, external)
    print('Paquete recibido fuera de T3', flush=True)
    restoration = edition.transfer(package, restored, PIN, external)
    print('Restauración nueva fuera de T3', flush=True)
    copies += [verify_independent(package, expected, SOURCE / 'paquete-v4-final'),
               verify_independent(restored, expected, package)]
    software = []
    for relative in ['docs/procedencia/preservacion-v4-sol/edicion.py',
                     'docs/procedencia/preservacion-v4-sol/schema.json',
                     'docs/procedencia/preservacion-v3/recolector.py',
                     'tools/procedencia/preservacion.py']:
        software.append({'path': relative, **facts(ROOT / relative)})
    report = {'pin': PIN, 'cutBase': data.get('base'), 'external': str(external),
              'copies': copies, 'export': exported, 'restore': restoration,
              'verificationSoftware': software, 'fiscalAcceptance': False,
              'independentCustody': False, 'remoteCopy': False,
              'crossaVersion': 'v1-desfasado', 'historicalPackagesChanged': False}
    (HERE / 'copias-comprobadas.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'filesEach': len(expected), 'bytesEach': sum(x['size'] for x in expected.values()),
                      'pin': PIN, 'rootDestination': str(DEST)}))


if __name__ == '__main__':
    main()
