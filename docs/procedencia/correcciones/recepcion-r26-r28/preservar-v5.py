"""Conservar el corte v5 r2 recibido, sin regenerar ni alterar su manifiesto."""

import gzip
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path('/home/elies/Repos/IRoboPF')
SOURCE = Path('/home/elies/.t3/worktrees/IRoboPF/t3-fdfbf688/.cache/preservacion-v5-sol')
PIN = '2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88'
OLD_PIN = '7883e53fd88d11b8fef626669ce63d0676ea217799551e72195a510710378a41'
DEST = ROOT / '.cache/orquestador-preservacion/v5-r2-2b15925970d4'
OUT = ROOT / 'docs/procedencia/correcciones/recepcion-r26-r28'
FOLDER = ROOT / 'docs/procedencia/preservacion-v5-sol'
sys.path.insert(0, str(FOLDER))
import consumidor as c  # noqa: E402


def main():
    pin = json.loads((FOLDER / 'r2/PIN-final.json').read_bytes())
    assert pin['manifest']['sha256'] == PIN
    source_manifest = SOURCE / 'r2/manifest-final.json'
    c.p.check(source_manifest, pin['manifest'])
    assert gzip.decompress((FOLDER / 'r2/manifest-final.json.gz').read_bytes()) == source_manifest.read_bytes()
    assert hashlib.sha256((SOURCE / 'manifest-final.json').read_bytes()).hexdigest() == OLD_PIN
    assert not DEST.exists(), 'No sobrescribir una conservación anterior'
    c.p.durable_mkdir(DEST)
    external = DEST / 'manifest-externo.json'
    c.put(source_manifest, external)
    c.put(FOLDER / 'r2/PIN-final.json', DEST / 'PIN-final.json')
    c.put(SOURCE / 'manifest-final.json', DEST / 'manifest-entrada-r1.json')
    c.put(FOLDER / 'CENSO-EXTERNO.json', DEST / 'CENSO-EXTERNO.json')
    receipts = {'sourceRestoration': c.verify(SOURCE / 'r2/restauracion-v5', PIN, external)}
    print('Restauración del autor verificada.', flush=True)
    receipts['localPackage'] = c.transfer(SOURCE / 'r2/paquete-v5', DEST / 'paquete', PIN, external)
    print('Paquete conservado fuera de T3.', flush=True)
    receipts['localRestoration'] = c.transfer(DEST / 'paquete', DEST / 'restauracion', PIN, external)
    print('Restauración nueva terminada.', flush=True)
    m = c.load(PIN, external)
    deps = {d['path']: d for d in m['dependencies']}
    fragments = json.loads((FOLDER / 'CENSO-EXTERNO.json').read_bytes())['fragments']
    for row in fragments:
        d = deps[row['packageDependencyPath']]
        assert all(d[k] == row[k] for k in ('sha256', 'sha512', 'size'))
        c.p.check(DEST / 'restauracion/dependencies' / row['sha256'], row)
    previous = json.loads((DEST / 'manifest-entrada-r1.json').read_bytes())
    for folder, key in [('sha256', 'objects'), ('dependencies', 'dependencies')]:
        for row in previous[key]:
            c.p.check(DEST / 'restauracion' / folder / row['sha256'], row)
    # Los consumidores han comprobado bytes, ambos hashes y tamaño. Este pase
    # distingue las cuatro copias físicas sin volver a contabilizar referencias.
    locations = [SOURCE / 'r2/paquete-v5', SOURCE / 'r2/restauracion-v5', DEST / 'paquete', DEST / 'restauracion']
    count = 1
    total = external.stat().st_size
    for folder, rows in [('sha256', m['objects']), ('dependencies', m['dependencies'])]:
        for h, row in {r['sha256']: r for r in rows}.items():
            stats = [(location / folder / h).stat() for location in locations]
            assert len({(s.st_dev, s.st_ino) for s in stats}) == 4
            assert all(s.st_nlink == 1 and s.st_size == row['size'] for s in stats)
            count += 1
            total += row['size']
    marker_stats = [(location / 'manifest.json').stat() for location in locations]
    assert len({(s.st_dev, s.st_ino) for s in marker_stats}) == 4
    assert all(s.st_nlink == 1 for s in marker_stats)
    assert count == 18146 and total == 2169593524
    result = {'manifest': pin['manifest'], 'inputManifest': OLD_PIN, 'destination': str(DEST),
              'receipts': receipts, 'physicalFilesPerCopy': count, 'bytesPerCopy': total,
              'externalCensusFragmentsRecoverable': len(fragments),
              'previousManifestDependenciesRecoverable': True,
              'fourPhysicalCopiesWithoutHardlinks': True, 'independentCustody': False,
              'remoteTransfer': False, 'completeRuleAcceptance': False,
              'selectionAndConsumerReview': 'pending-independent', 'crossa': 'v1-desfasado'}
    (OUT / 'preservacion-v5.json').write_bytes(c.p.encoded(result))
    print(json.dumps({'manifest': PIN, 'files': count, 'bytes': total, 'fragments': len(fragments)}), flush=True)


if __name__ == '__main__':
    main()
