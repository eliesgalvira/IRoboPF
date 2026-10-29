"""Contrarrevisión local; no red, sin modificar producto ni originales."""
import copy
import importlib
import hashlib
import json
import os
from pathlib import Path
from typing import Any
import sys
from unittest.mock import patch

W = Path('/home/elies/.t3/worktrees/IRoboPF/t3-9491a8b7')
R = Path('/home/elies/Repos/IRoboPF')
OUTPUT = R / 'docs/procedencia/revisiones/preservacion-v2'
sys.path.insert(0, str(W / 'tools/procedencia'))
p = importlib.import_module('preservacion')


def dump(name, value):
    (OUTPUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def digest(path):
    a, b, n = hashlib.sha256(), hashlib.sha512(), 0
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            a.update(chunk)
            b.update(chunk)
            n += len(chunk)
    return dict(sha256=a.hexdigest(), sha512=b.hexdigest(), size=n)


mfile = W / 'docs/procedencia/preservacion/manifest-v2.json'
m = p.strict_json(mfile.read_bytes())
p.validate(m)
assert digest(mfile)['sha256'] == '1382c7186c84cdf7c1892b9b16a8ca7e222aeac54380d3ed41952deea47a67db'
packages = {}
for name in ['paquete-v2', 'restauracion-v2']:
    root = R / '.cache/orquestador-preservacion' / name
    assert (root / 'manifest.json').read_bytes() == mfile.read_bytes()
    results = []
    for blob in m['blobs']:
        actual = digest(root / 'sha256' / blob['sha256'])
        assert actual == {k: blob[k] for k in actual}
        results.append(actual)
    packages[name] = results
    print(name, len(results), sum(x['size'] for x in results), flush=True)
dump('hashes.json', packages)
old = json.loads((mfile.parent / 'manifest.json').read_bytes())
ptr = json.loads((mfile.parent / 'lfs-pointers-v2.json').read_bytes())
by = {b['sha256']: b for b in m['blobs']}
assert len(ptr) == len(by) == 708
for item in ptr:
    h = item['path'].split('/')[-1]
    assert item['pointer'] == f'version https://git-lfs.github.com/spec/v1\noid sha256:{h}\nsize {by[h]["size"]}\n'
assert {(b['sha256'], b['sha512'], b['size']) for b in old['blobs']} == {(b['sha256'], b['sha512'], b['size']) for b in m['blobs']}
changes = []
for d in m['dependencies']:
    path = R / d['path']
    if not path.is_file():
        changes.append(dict(path=d['path'], state='missing'))
    elif digest(path) != {k: d[k] for k in ('sha256', 'sha512', 'size')}:
        changes.append(dict(path=d['path'], state='changed'))
dump('comparacion.json', dict(objects=708, bytes=m['bytes'], pointers=len(ptr), identicalPointers=ptr == json.loads((mfile.parent / 'lfs-pointers.json').read_bytes()), dependenciesV1=len(old['dependencies']), dependenciesV2=len(m['dependencies']), acquisitionsV1=sum(len(b['acquisitions']) for b in old['blobs']), acquisitionsV2=sum(len(b['acquisitions']) for b in m['blobs']), changedDependencies=changes, sameBlobRecords=old['blobs'] == m['blobs']))
S = OUTPUT / 'scratch'
S.mkdir()
(S / 'a').write_bytes(b'synthetic')
facts = digest(S / 'a')
u = 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764'
base = dict(version=2, acceptance='ninguna', bytes=facts['size'], blobs=[{**facts, 'sources':['a'], 'class':'original-oficial-candidato', 'authenticity':'no-certificada', 'references':[], 'acquisitions':[dict(canonicalUrl=u, finalUrl=u, retrievedAt='2026-10-29T10:00:00Z', httpStatus=200, source='a', sourceSha256=facts['sha256'])]}], dependencies=[dict(path='a', **facts)], exclusions=[], unresolvedReferences=[])
p.validate(base)
results = []


def trial(name, fn):
    try:
        result = fn()
        results.append(dict(case=name, state='accepted', result=result))
    except (ValueError, OSError) as error:
        results.append(dict(case=name, state='rejected', error=type(error).__name__, message=str(error)))


mutations = [(('version',), True), (('version',), 2.0), (('bytes',), float(base['bytes'])), (('blobs',0,'size'), True), (('dependencies',0,'size'), 9.0), (('blobs',0,'authenticity'), 'certificada'), (('blobs',0,'acquisitions',0,'httpStatus'),200.0), (('blobs',0,'acquisitions',0,'headers'),{'Cookie':'SYNTHETIC'}), (('headers',),{'Cookie':'SYNTHETIC'})]
for i, (path, value) in enumerate(mutations):
    obj = copy.deepcopy(base)
    node: Any = obj
    for key in path[:-1]:
        node = node[key]
    node[path[-1]] = value
    trial('types-private-' + str(i), lambda obj=obj: p.validate(obj))
for date in ['2026-02-29T00:00:00Z', '2026-04-31T00:00:00Z', '2026-01-01T24:00:00Z', '2026-01-01T00:00:00', '2026-01-01T00:00:00+00:99', '2024-02-29T00:00:00Z']:
    obj = copy.deepcopy(base)
    obj['blobs'][0]['acquisitions'][0]['retrievedAt'] = date
    trial('date-' + date, lambda obj=obj: p.validate(obj))
for field in ['blobs', 'dependencies', 'exclusions', 'unresolvedReferences']:
    obj = copy.deepcopy(base)
    if not obj[field]:
        continue
    obj[field].append(copy.deepcopy(obj[field][0]))
    trial('duplicate-' + field, lambda obj=obj: p.validate(obj))
for raw in ['{"a":1,"a":2}', '{"a":NaN}', '{"a":Infinity}', '{"a":{"x":1,"x":2}}']:
    trial('json-' + raw, lambda raw=raw: p.strict_json(raw))
for url in [u, 'https://www.boe.es/PRIVATE_SENTINEL', u+'&id=BOE-A-2006-20764', 'https://www.boe.es:wrong/a', u+'&txt=SYNTHETIC', 'https://www.boe.es/buscar/act.php?id=SYNTHETIC', 'https://www.boe.es/private/123.pdf']:
    results.append(dict(case='url', url=url, result=p.public_url(url)))
manifest = S / 'manifest.json'
manifest.write_bytes(p.encoded(base))
(S / 'alias').symlink_to(S, target_is_directory=True)
trial('destination-ancestor', lambda: p.transfer(manifest, S, S/'alias/new'))
trial('source-ancestor', lambda: p.transfer(manifest, S/'alias', S/'source-ancestor'))
trial('manifest-ancestor', lambda: p.transfer(S/'alias/manifest.json', S, S/'manifest-ancestor'))
(S / '.cache').mkdir()
(S / '.cache/procedencia').symlink_to(S, target_is_directory=True)
trial('cache-ancestor', lambda: p.plan(S))
# Cada fsync de la ejecución positiva falla individualmente en una ejecución nueva.
actual_sync, actual_link = os.fsync, os.link
trace = []


def record(fd):
    trace.append(dict(op='fsync', path=os.readlink(f'/proc/self/fd/{fd}')))
    return actual_sync(fd)


def link(src, dst):
    trace.append(dict(op='link', path=str(dst)))
    return actual_link(src, dst)


with patch.object(p.os, 'fsync', record), patch.object(p.os, 'link', link):
    p.transfer(manifest, S, S/'success')
dump('fsync-orden.json', trace)
faults = []
for fail_at in range(1, sum(x['op']=='fsync' for x in trace)+1):
    calls = [0]
    dest = S / f'fail-{fail_at}'

    def fail(fd):
        calls[0] += 1
        if calls[0] == fail_at:
            raise OSError('fallo sintético fsync')
        return actual_sync(fd)

    try:
        with patch.object(p.os, 'fsync', fail):
            p.transfer(manifest, S, dest)
        state = 'success'
    except OSError:
        state = 'error'
    faults.append(dict(failAt=fail_at, state=state, markerExists=(dest/'manifest.json').exists(), files=[q.name for q in dest.glob('*')]))
dump('fallos-publicacion.json', faults)
dump('adversarial.json', results)
print(json.dumps(dict(cases=len(results), faults=faults), ensure_ascii=False))
