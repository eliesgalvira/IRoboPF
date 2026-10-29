"""Recalcula fuente y derivado contra los blobs R21, sin ejecutar código histórico."""
import gzip
import hashlib
import json
import subprocess
from revisar import CACHE, ROOT, e, save


def fingerprint_bytes(data):
    return dict(sha256=hashlib.sha256(data).hexdigest(), sha512=hashlib.sha512(data).hexdigest(), size=len(data))


def main():
    entries = {}
    for row in subprocess.check_output(['git', 'ls-tree', '-rz', e.BASE]).split(b'\0'):
        if row:
            meta, name = row.split(b'\t', 1)
            entries[name.decode()] = meta.split()[2].decode()
    m = json.loads((CACHE / 'restauracion/manifest.json').read_bytes())
    results = []
    for dep in m['dependencies']:
        if dep['historical'] or dep['path'].startswith('auxiliares-cdx/'):
            continue
        name = dep['path']
        if name in entries:
            data = subprocess.check_output(['git', 'cat-file', 'blob', entries[name]])
            origin = 'blob-base-R21'
        else:
            assert name.startswith('docs/procedencia/preservacion-v4-sol/')
            data = (ROOT / name).read_bytes()
            origin = 'fuente-v4-entregada'
        fp = fingerprint_bytes(data)
        assert all(fp[k] == dep['source' + k[0].upper() + k[1:]] for k in fp), name
        if name.endswith(('.json', '.json.gz')):
            decoded = gzip.decompress(data) if name.endswith('.gz') else data
            data = e.p.encoded(e.clean(e.p.strict_json(decoded)))
            if name.endswith('.gz'):
                data = gzip.compress(data, mtime=0)
        assert fingerprint_bytes(data) == {k: dep[k] for k in fp}, name
        assert data == (CACHE / 'metadatos' / name).read_bytes()
        results.append(dict(path=name, origin=origin, sourceAndDerivationExact=True, changed=dep['sourceSha256'] != dep['sha256']))
    save('identidades-base.json', results)
    print(dict(checked=len(results), transformed=sum(r['changed'] for r in results), mismatch=0))

if __name__ == '__main__':
    main()
