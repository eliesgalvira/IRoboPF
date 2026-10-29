"""Contraste ampliado de claves y adquisiciones desde el paquete, sin ampliar el corte."""
from collections import Counter
import gzip
import json
from revisar import CACHE, e, save


def main():
    package = CACHE / 'restauracion'
    m = json.loads((package / 'manifest.json').read_bytes())
    objects = {o['sha256']: o for o in m['objects']}
    deps = {d['sha256']: d for d in m['dependencies']}
    events = []
    for obj in m['objects']:
        for event in obj['acquisitions']:
            dep = deps[event['dependency']]
            raw = (package / 'dependencies' / dep['sha256']).read_bytes()
            if dep['path'].endswith('.gz'):
                raw = gzip.decompress(raw)
            records = list(e.p.nodes(e.p.strict_json(raw)))
            support = any(all(rec.get(k) == event[k] for k in ('sha256', 'sha512', 'size')) and rec.get('canonicalUrl', rec.get('url')) == event['canonicalUrl'] and rec.get('finalUrl') == event['finalUrl'] and rec.get('retrievedAt', rec.get('acquiredAt')) == event['retrievedAt'] and rec.get('httpStatus', rec.get('status')) == event['httpStatus'] for rec in records)
            events.append(dict(sha256=obj['sha256'], dependency=dep['path'], projectionSupported=support))
    assert all(r['projectionSupported'] for r in events)
    typed: dict[str, set[tuple[str, str]]] = {}
    for dep in m['dependencies']:
        if dep['historical'] or not dep['path'].endswith(('.json', '.json.gz')):
            continue
        raw = (package / 'dependencies' / dep['sha256']).read_bytes()
        if dep['path'].endswith('.gz'):
            raw = gzip.decompress(raw)
        for rec in e.p.nodes(e.p.strict_json(raw)):
            for key in ('documentSha256', 'documentHash', 'facsimileSha256', 'cropSha256'):
                sha = rec.get(key)
                if isinstance(sha, str) and e.p.HASH.fullmatch(sha):
                    typed.setdefault(sha, set()).add((dep['path'], key))
    misses = [dict(sha256=sha, references=sorted(refs)) for sha, refs in typed.items() if sha not in objects]
    tgss = {sha for sha, refs in typed.items() if any('tgss-etapas-operativas/' in p and key == 'cropSha256' for p,key in refs)}
    editorial = [d for d in m['dependencies'] if d['path'].startswith('docs/procedencia/correcciones/editorial-r21/citas/')]
    save('seleccion-ampliada.json', dict(acquisitionProjections=events, typedUnique=len(typed), absentFromObjects=misses, missingByPrefix=dict(Counter(p.split('/')[3] if len(p.split('/')) > 3 else p for row in misses for p,k in row['references'])), tgssCropCount=len(tgss), tgssMissing=sorted(tgss - set(objects)), editorialCitations=len(editorial)))
    print(dict(acquisitions=len(events), supported=True, typedUnique=len(typed), absent=len(misses), tgssCrops=len(tgss), editorialCitations=len(editorial)))

if __name__ == '__main__':
    main()
