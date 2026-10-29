"""Restauración y contraste independiente del corte fijado. No ejecuta fuentes históricas."""
from collections import Counter
import gzip
import hashlib
import importlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
from typing import Any

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/preservacion-v4-r24-sol'
CACHE = ROOT / '.cache/preservacion-v4-r24-sol'
SOURCE = Path('/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v4-938f230888d2')
PIN = '938f230888d2f71a999d5083c3b484e37687ebad03c4b1ca887535710c6071f2'
sys.path.insert(0, str(ROOT / 'docs/procedencia/preservacion-v4-sol'))
e = importlib.import_module('edicion')
setattr(e, 'CACHE', CACHE)

def facts(path):
    a, b, size = hashlib.sha256(), hashlib.sha512(), 0
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            a.update(block)
            b.update(block)
            size += len(block)
    return dict(sha256=a.hexdigest(), sha512=b.hexdigest(), size=size)

def save(name, value):
    raw = json.dumps(value, ensure_ascii=False, indent=2).encode()
    if len(raw) > 1000000:
        with gzip.open(OUT / (name + '.gz'), 'wb') as stream:
            stream.write(raw)
    else:
        (OUT / name).write_bytes(raw)

def compare(folder, expected, other=None):
    actual = set()
    for directory, dirs, names in os.walk(folder):
        for name in dirs:
            assert stat.S_ISDIR((Path(directory) / name).lstat().st_mode)
        for name in names:
            path = Path(directory) / name
            assert stat.S_ISREG(path.lstat().st_mode) and path.stat().st_nlink == 1
            rel = path.relative_to(folder).as_posix()
            actual.add(rel)
            assert facts(path) == expected[rel], rel
            if other:
                assert path.stat().st_ino != (other / rel).stat().st_ino
    assert actual == set(expected)
    return dict(files=len(actual), bytes=sum(r['size'] for r in expected.values()), exactSet=True, regularNoHardlinks=True)

def main():
    external = SOURCE / 'manifest-externo.json'
    assert facts(external)['sha256'] == PIN
    m = e.load(PIN, external)
    expected = {'manifest.json': facts(external)}
    for group, rows in [('sha256', m['objects']), ('dependencies', m['dependencies'])]:
        for row in rows:
            expected[group + '/' + row['sha256']] = {k: row[k] for k in ('sha256', 'sha512', 'size')}
    report = {'pin': PIN, 'source': compare(SOURCE / 'paquete', expected)}
    print('Fuente cotejada independientemente', flush=True)
    report['consumer'] = e.verify(SOURCE / 'paquete', PIN, external)
    restored = CACHE / 'restauracion'
    report['restore'] = e.transfer(SOURCE / 'paquete', restored, PIN, external)
    report['restoredPhysical'] = compare(restored, expected, SOURCE / 'paquete')
    print('Restauración completa cotejada', flush=True)
    material = CACHE / 'metadatos'
    result = subprocess.run([sys.executable, str(e.HERE / 'materializar.py'), '--package', str(restored), '--destination', str(material), '--manifest', str(external), '--pin', PIN], capture_output=True, text=True)
    report['materializer'] = dict(code=result.returncode, stdout=result.stdout, stderr=result.stderr)
    assert result.returncode == 0
    dep_expected = {d['path']: {k: d[k] for k in ('sha256', 'sha512', 'size')} for d in m['dependencies']}
    report['materializedPhysical'] = compare(material, dep_expected)
    identities = []
    for dep in m['dependencies']:
        if dep['historical']:
            continue
        path = ROOT / dep['path']
        if not path.exists():
            continue
        actual = facts(path)
        identities.append(dict(path=dep['path'], sourceMatches=all(actual[k] == dep['source' + k[0].upper() + k[1:]] for k in actual)))
    report['sourceIdentity'] = dict(checked=len(identities), mismatches=[r for r in identities if not r['sourceMatches']])
    save('identidades.json', identities)
    own = ['tools/procedencia/preservacion.py', 'tools/procedencia/preservacion_urls.py', 'docs/procedencia/preservacion-v3/recolector.py', 'docs/procedencia/preservacion-v4-sol/edicion.py', 'docs/procedencia/preservacion-v4-sol/schema.json']
    deps = {d['path']: d for d in m['dependencies']}
    report['runtime'] = [dict(path=n, current=facts(ROOT / n), preserved=deps.get(n)) for n in own]
    report['classes'] = dict(Counter(o['kind'] for o in m['objects']))
    report['exclusions'] = dict(Counter(r['reason'] for r in m['exclusions']))
    report['largeMetadata'] = [d for d in m['dependencies'] if d['sourceSize'] > 16000000]
    save('restauracion.json', report)
    # Rehacer el censo desde los bytes saneados restaurados, sin leer los CAS originales.
    objects = {o['sha256']: o for o in m['objects']}
    batches = {}
    for name in ('docs/procedencia/revisiones/preservacion-v3-sol/posteriores.json', 'docs/procedencia/correcciones/retenciones-antiguas-r20/cas-originales.json', 'docs/procedencia/correcciones/integracion-r19/cas-retenciones.json'):
        value = json.loads((material / name).read_bytes())
        rows = value['objects'] if isinstance(value, dict) else value
        checked = []
        for row in rows:
            obj = objects.get(row['sha256'])
            aux = next((d for d in m['dependencies'] if d['sourceSha256'] == row['sha256']), None)
            assert obj or aux
            if obj is None:
                assert aux is not None
                target = {k: aux['source' + k[0].upper() + k[1:]] for k in ('sha256', 'sha512', 'size')}
            else:
                target = obj
            assert all(row[k] == target[k] for k in ('sha256', 'sha512', 'size') if k in row)
            checked.append(dict(sha256=row['sha256'], auxiliary=obj is None))
        batches[name] = checked
    typed: dict[str, set[str]] = {}
    prefixes = ('docs/procedencia/auditorias/retenciones-2020-2026/', 'docs/procedencia/correcciones/editorial-r21/citas/', 'docs/procedencia/revisiones/retenciones-2012-2014-sol/', 'docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol/', 'docs/procedencia/editorial/', 'docs/procedencia/auditorias/tgss-etapas-operativas/', 'docs/procedencia/correcciones/derechos-familiares-r15/')
    for name in deps:
        if not name.startswith(prefixes) or not name.endswith('.json'):
            continue
        for rec in e.p.nodes(json.loads((material / name).read_bytes())):
            for key in ('documentSha256', 'documentHash', 'facsimileSha256', 'cropSha256'):
                sha = rec.get(key)
                if isinstance(sha, str) and e.p.HASH.fullmatch(sha):
                    typed.setdefault(sha, set()).add(name)
            for key in ('original', 'facsimil', 'facsimile'):
                row = rec.get(key)
                if isinstance(row, dict) and isinstance(row.get('sha256'), str):
                    typed.setdefault(row['sha256'], set()).add(name)
    assert set(typed) <= set(objects)
    save('censo.json', dict(batches=batches, typed=len(typed), references={k: sorted(v) for k, v in typed.items()}, unresolved=len(m['unresolvedReferences'])))
    import pymupdf as fitz
    citations = []
    for name in ('mei2025', 'madrid-tabla-ley13-2023', 'colegio-art10-p16'):
        row = json.loads((material / ('docs/procedencia/correcciones/editorial-r21/citas/' + name + '.json')).read_bytes())
        pdf = restored / 'sha256' / row['original']['sha256']
        with fitz.open(pdf) as doc:
            selector, recipe = row['selector'], row['receta']
            page = doc[selector['pagina'] - 1]
            text = page.get_text(clip=fitz.Rect(selector['caja']))
            png = page.get_pixmap(matrix=fitz.Matrix(*recipe['matrix']), clip=fitz.Rect(recipe['clip']), alpha=recipe['alpha']).tobytes('png')
        (CACHE / (name + '.png')).write_bytes(png)
        citation_result: dict[str, Any] = dict(id=name, textEqual=text == selector['texto'], pngSha256=hashlib.sha256(png).hexdigest(), expected=row['facsimil']['sha256'], version=fitz.VersionBind, text=text)
        citations.append(citation_result)
        save('reconstrucciones-iniciales.json', citations)
        assert citation_result['textEqual'] and citation_result['pngSha256'] == citation_result['expected']
    save('reconstrucciones.json', citations)
    config = json.loads((ROOT / '.oxlintrc.json').read_bytes())
    rules = {k: v for k, v in config['rules'].items() if k.startswith(('anti-slop/', 'anti-slop-effect/'))}
    assert len(rules) == 16 and set(rules.values()) == {'error'}
    save('anti-slop.json', rules)
    print('Materialización, lotes, identidades y tres reconstrucciones completos', flush=True)

if __name__ == '__main__':
    main()
