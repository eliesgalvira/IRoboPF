"""Cotejo independiente de bytes, árbol y cobertura; nunca modifica paquetes."""
import gzip
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
from typing import Any

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/preservacion-v3-sol'
SCRATCH = ROOT / '.cache/preservacion-v3-sol'
BASE = '7668bdad60a79a8b3ad8e1e1b911f3d6c223692a'
V3 = ROOT / 'docs/procedencia/preservacion-v3'
PARENT = Path('/home/elies/Repos/IRoboPF')


def facts(path):
    if any(p.is_symlink() for p in (path, *path.parents)):
        raise ValueError(f'Ancestro enlazado: {path}')
    if not stat.S_ISREG(path.lstat().st_mode):
        raise ValueError(f'No regular: {path}')
    a, b, size = hashlib.sha256(), hashlib.sha512(), 0
    with path.open('rb') as stream:
        for data in iter(lambda: stream.read(1048576), b''):
            a.update(data)
            b.update(data)
            size += len(data)
    return dict(sha256=a.hexdigest(), sha512=b.hexdigest(), size=size)


def save(name, value):
    data = (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()
    path = OUT / name
    if len(data) > 1000000:
        path = path.with_suffix(path.suffix + '.gz')
        data = gzip.compress(data, mtime=0)
    path.write_bytes(data)


def read(path):
    return json.loads(path.read_bytes())


def tree(label):
    head = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip()
    assert head == BASE
    records = []
    failures: list[str | dict[str, str]] = []
    for line in subprocess.check_output(['git', 'ls-tree', '-rz', BASE]).split(b'\0'):
        if not line:
            continue
        meta, raw = line.split(b'\t', 1)
        mode, _, oid = meta.decode().split()
        path = ROOT / os.fsdecode(raw)
        try:
            st = path.lstat()
            original = subprocess.check_output(['git', 'cat-file', 'blob', oid])
            actual = os.fsencode(os.readlink(path)) if stat.S_ISLNK(st.st_mode) else path.read_bytes()
            record = dict(path=str(path), mode=mode, size=len(actual), sha256=hashlib.sha256(actual).hexdigest(), baseSha256=hashlib.sha256(original).hexdigest(), readlink=os.readlink(path) if stat.S_ISLNK(st.st_mode) else None)
            if actual != original:
                failures.append(str(path))
            records.append(record)
        except OSError as error:
            failures.append(dict(path=str(path), error=str(error)))
    save('arbol-' + label + '.json', dict(head=head, entries=len(records), failures=failures, records=records, diff=subprocess.check_output(['git', 'diff', BASE, '--stat']).decode(), deleted=subprocess.check_output(['git', 'diff', BASE, '--diff-filter=D', '--name-only']).decode()))
    assert not failures
    print(label, head, len(records), 'sin diferencias ni ausencias', flush=True)


def module():
    spec = importlib.util.spec_from_file_location('recolector', V3 / 'recolector.py')
    assert spec is not None and spec.loader is not None
    mod = importlib.util.module_from_spec(spec)
    sys.modules['recolector'] = mod
    spec.loader.exec_module(mod)
    return mod


def verify():
    m, t = read(V3 / 'manifest.json'), read(V3 / 'transporte-v2.json')
    assert facts(V3 / 'manifest.json')['sha256'] == '147e90bf15aa6a82e71b304bd6bd8983983007c2b07ed6e306f1ca244f3ae8be'
    assert facts(V3 / 'transporte-v2.json')['sha256'] == 'b4e91adcdd69dbe62f221d97bc8910ad1243719b8bdcb63df095ce5679c8db9e'
    objects = t['blobs'] + m['annex']
    assert len(objects) == len({o['sha256'] for o in objects}) == 945
    assert sum(o['size'] for o in objects) == 1068593978
    copies = []
    for name in ('paquete-v3', 'restauracion-v3'):
        root = PARENT / '.cache/orquestador-preservacion' / name
        rows = []
        for marker in ('manifest.json', 'transporte-v2.json'):
            assert (root / marker).read_bytes() == (V3 / marker).read_bytes()
        for folder, entries in (('sha256', objects), ('dependencies', m['dependencies'])):
            for obj in entries:
                path = root / folder / obj['sha256']
                fp = facts(path)
                assert fp == {key: obj[key] for key in fp}, path
                rows.append(dict(path=str(path), **fp))
        copies.append(dict(root=str(root), records=rows, objects=len(objects), bytes=sum(o['size'] for o in objects)))
        print(name, '945 objetos y 1910 referencias verificadas', flush=True)
    save('copias.json', copies)
    deps = {d['path']: d for d in m['dependencies']}
    events = [e for o in m['annex'] for e in o['acquisitions']]
    assert all(e['source'] in deps and deps[e['source']]['sha256'] == e['sourceSha256'] for e in events)
    save('cierre-dependencias.json', dict(references=len(m['dependencies']), unique=len({d['sha256'] for d in m['dependencies']}), bytes=sum(d['size'] for d in {d['sha256']: d for d in m['dependencies']}.values()), annexAcquisitions=len(events), classes={kind: sum(o['class'] == kind for o in m['annex']) for kind in {o['class'] for o in m['annex']}}))
    r = module()
    import shutil
    free = shutil.disk_usage(SCRATCH).free
    assert free > 2500000000
    dest = SCRATCH / 'restauracion-independiente'
    assert not dest.exists()
    save('espacio-previo.json', dict(free=free, destination=str(dest)))
    receipt = r.transfer(dest, PARENT / '.cache/orquestador-preservacion/paquete-v3')
    # Recotejo independiente después de la API del producto.
    for folder, entries in (('sha256', objects), ('dependencies', m['dependencies'])):
        for obj in entries:
            assert facts(dest / folder / obj['sha256']) == {k: obj[k] for k in ('sha256', 'sha512', 'size')}
    assert all((dest / 'sha256' / o['sha256']).stat().st_ino != (PARENT / '.cache/orquestador-preservacion/paquete-v3/sha256' / o['sha256']).stat().st_ino for o in objects)
    save('restauracion.json', receipt)
    print('Restauración nueva confirmada y recotejada, sin hardlinks', flush=True)


def posterior():
    included = {o['sha256'] for o in read(V3 / 'transporte-v2.json')['blobs'] + read(V3 / 'manifest.json')['annex']}
    records: dict[str, Any] = {}
    sources = ['docs/procedencia/correcciones/integracion-r19/cas-retenciones.json',
               'docs/procedencia/correcciones/derechos-familiares-r15/fuentes.json',
               'docs/procedencia/auditorias/tgss-etapas-operativas/binarios.json',
               'docs/procedencia/editorial/escalas-minimos/originales.json',
               'docs/procedencia/editorial/escalas-minimos/binarios.json',
               'docs/procedencia/editorial/rentas-retenciones-cotizaciones/fuentes-primarias.json',
               'docs/procedencia/editorial/rentas-retenciones-cotizaciones/binarios.json']
    def nodes(value):
        if isinstance(value, dict):
            yield value
            for child in value.values():
                yield from nodes(child)
        elif isinstance(value, list):
            for child in value:
                yield from nodes(child)
    unresolved, covered = [], []
    for source in sources:
        for obj in nodes(read(ROOT / source)):
            if not all(key in obj for key in ('sha256', 'size')):
                continue
            sha = obj['sha256']
            if sha in included:
                covered.append(dict(source=source, sha256=sha))
                continue
            if 'manifest' in obj:
                path = Path(read(ROOT / obj['manifest'])['localPath'])
            else:
                path = Path(obj.get('preservedPath', obj.get('path', '')))
                if not path.is_absolute():
                    path = ROOT / path
            if path.suffix in ('.gz',) or 'control-' in path.name:
                continue
            try:
                fp = facts(path)
            except OSError as error:
                unresolved.append(dict(path=str(path), source=source, sha256=sha, error=str(error)))
                continue
            assert all(fp[k] == obj[k] for k in ('sha256', 'sha512', 'size') if k in obj)
            records.setdefault(sha, dict(**fp, path=str(path), sources=[]))['sources'].append(source)
    for path in sorted((ROOT / 'docs/procedencia/auditorias/tgss-etapas-operativas/crops').glob('*.png')):
        fp = facts(path)
        if fp['sha256'] not in included:
            records.setdefault(fp['sha256'], dict(**fp, path=str(path), sources=[]))['sources'].append('crops TGSS')
    save('posteriores.json', dict(objects=list(records.values()), unresolved=unresolved, alreadyIncluded=covered))
    print('Ausentes de V3 comprobados:', len(records), sum(r['size'] for r in records.values()), 'sin localizar', len(unresolved), flush=True)


if __name__ == '__main__':
    {'inicio': lambda: tree('inicio'), 'cierre': lambda: tree('cierre'), 'copias': verify, 'posteriores': posterior}[sys.argv[1]]()
