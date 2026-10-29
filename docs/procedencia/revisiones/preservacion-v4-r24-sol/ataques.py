"""Casos sintéticos propios; registra comportamientos sin corregir consumidor ni esperados."""
import copy
import hashlib
import importlib
import json
from pathlib import Path
import runpy
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/preservacion-v4-r24-sol'
CACHE = ROOT / '.cache/preservacion-v4-r24-sol'
sys.path.insert(0, str(ROOT / 'docs/procedencia/preservacion-v4-sol'))
e = importlib.import_module('edicion')
setattr(e, 'CACHE', CACHE)
inherited = importlib.import_module('adversos')


def main():
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(inherited.EditionTests)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    assert result.wasSuccessful()
    work = Path(tempfile.mkdtemp(dir=CACHE, prefix='propios-'))
    source = work / 'source'
    source.mkdir()
    (source / 'sha256').mkdir()
    (source / 'dependencies').mkdir()
    blob = source / 'payload-original'
    blob.write_bytes(b'sintetico propio')
    fp = e.p.fingerprint(blob)
    e.put(blob, source / 'sha256' / fp['sha256'])
    # El payload fuera de las dos carpetas es deliberadamente un extra.
    base = dict(format='irobopf-preservacion-local-v4', edition=4, base=e.BASE, acceptance='ninguna', objects=[dict(**fp, kind='facsimil', inherited=False, acquisitions=[], references=[])], dependencies=[], unresolvedReferences=[], exclusions=[])
    external = work / 'externo.json'
    results = []
    def run(label, mutation, verify=False):
        m = copy.deepcopy(base)
        mutation(m)
        data = e.p.encoded(m)
        external.write_bytes(data)
        (source / 'manifest.json').write_bytes(data)
        pin = hashlib.sha256(data).hexdigest()
        try:
            (e.verify(source, pin, external) if verify else e.load(pin, external))
            results.append(dict(case=label, outcome='aceptado'))
        except (ValueError, OSError) as error:
            results.append(dict(case=label, outcome='rechazado', error=type(error).__name__, message=str(error)))
    run('extra-fuera-de-inventario', lambda m: None, True)
    for value in ('../escape', 'a\nb', 'a\r', 'a\u0000b', 'a\\b', 'a//b', 'a/./b', 'a:b', '/abs'):
        run('ruta:' + repr(value), lambda m, value=value: m['objects'][0].update(references=[value]))
    for value in ('a\u202eb', 'caf\u00e9', 'cafe\u0301'):
        run('unicode:' + repr(value), lambda m, value=value: m['objects'][0].update(references=[value]))
    run('referencias-duplicadas', lambda m: m['objects'][0].update(references=['a', 'a']))
    run('no-resueltas-duplicadas', lambda m: m.update(unresolvedReferences=[{'sha256': 'a'*64, 'sources': ['a']}] * 2))
    run('hash512-salto-final', lambda m: m['objects'][0].update(sha512=fp['sha512'] + '\n'))
    run('tamano-sin-cota', lambda m: m['objects'][0].update(size=10**30))
    run('heredado-autodeclarado', lambda m: m['objects'][0].update(kind='documento-primario-candidato', inherited=True))
    # Privacidad en valor URL: no son secretos reales y nunca se realizan peticiones.
    private = {'nested': {'url': 'https://example.invalid/documento?token=SENTINELA', 'path': '/tmp/SENTINELA', 'Authorization': 'SENTINELA'}}
    cleaned = e.clean(private)
    results.append(dict(case='privacidad-valores-anidados', cleaned=cleaned, residualSentinel='SENTINELA' in json.dumps(cleaned)))
    depdata = e.p.encoded(cleaned)
    depfile = source / 'dependencies' / hashlib.sha256(depdata).hexdigest()
    depfile.write_bytes(depdata)
    depfp = e.p.fingerprint(depfile)
    dep = dict(**depfp, path='adquisicion.json', sourceSha256=depfp['sha256'], sourceSha512=depfp['sha512'], sourceSize=depfp['size'], sanitized=False, historical=False)
    run('privacidad-url-en-dependencia', lambda m: m.update(dependencies=[dep]), True)
    event = dict(**fp, canonicalUrl='https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', finalUrl=None, retrievedAt='2026-10-29T10:00:00Z', httpStatus=200, dependency=depfp['sha256'])
    def acquisitions(m):
        m.update(dependencies=[dep])
        m['objects'][0].update(kind='documento-primario-candidato', acquisitions=[event, event])
    run('adquisiciones-duplicadas-reales', acquisitions, True)
    # Mutación coordinada de dos hashes no vence al ancla externa original.
    external.write_bytes(e.p.encoded(base))
    original_pin = hashlib.sha256(external.read_bytes()).hexdigest()
    altered = copy.deepcopy(base)
    altered['objects'][0].update(sha256='a'*64, sha512='b'*128)
    external.write_bytes(e.p.encoded(altered))
    try:
        e.load(original_pin, external)
        raise AssertionError('Pin original aceptó sustitución')
    except ValueError:
        results.append(dict(case='ambos-hashes-mutados-pin-original', outcome='rechazado'))
    # JSON estricto y schema con claves desconocidas.
    for data in (b'{"format":1,"format":2}', b'{"x":NaN}'):
        try:
            e.p.strict_json(data)
            raise AssertionError('Representación ambigua aceptada')
        except ValueError:
            results.append(dict(case='json:' + data.decode(), outcome='rechazado'))
    e.p.Draft202012Validator.check_schema(json.loads((e.HERE / 'schema.json').read_bytes()))
    # Fallo anterior al marcador: se conservan residuos y se recupera en otro destino.
    external.write_bytes(e.p.encoded(base))
    (source / 'manifest.json').write_bytes(external.read_bytes())
    pin = hashlib.sha256(external.read_bytes()).hexdigest()
    failed = work / 'transferencia-parcial'
    with patch.object(e, 'put', side_effect=OSError('fallo sintético previo al marcador')):
        try:
            e.transfer(source, failed, pin, external)
        except OSError:
            assert not (failed / 'manifest.json').exists()
    try:
        e.transfer(source, failed, pin, external)
        raise AssertionError('Destino parcial reutilizado')
    except FileExistsError:
        pass
    recovered = work / 'transferencia-recuperada'
    e.transfer(source, recovered, pin, external)
    results.append(dict(case='fallo-antes-marcador', outcome='sin marcador; residuos conservados; recuperación en destino nuevo'))
    # Materialización: probar prefijos conflictivos y recuperación exclusiva.
    m = copy.deepcopy(base)
    m['dependencies'] = [dict(dep, path='a.json'), dict(dep, path='b.json')]
    data = e.p.encoded(m)
    external.write_bytes(data)
    (source / 'manifest.json').write_bytes(data)
    pin = hashlib.sha256(data).hexdigest()
    dest = work / 'metadata-parcial'
    argv = ['materializar.py', '--package', str(source), '--destination', str(dest), '--manifest', str(external), '--pin', pin]
    real_put = e.put
    def fail_second(src, target):
        if target.name == 'b.json':
            raise OSError('fallo sintético de materialización')
        real_put(src, target)
    with patch.object(sys, 'argv', argv), patch.object(e, 'put', fail_second):
        try:
            runpy.run_path(str(e.HERE / 'materializar.py'), run_name='__main__')
        except OSError:
            assert (dest / 'a.json').exists() and not (dest / 'b.json').exists()
    argv[4] = str(work / 'metadata-recuperada')
    with patch.object(sys, 'argv', argv):
        runpy.run_path(str(e.HERE / 'materializar.py'), run_name='__main__')
    results.append(dict(case='materializacion-fallo', outcome='parcial conservado; destino nuevo recuperado'))
    run('prefijos-conflictivos-dependencias', lambda m: m.update(dependencies=[dict(dep, path='a'), dict(dep, path='a/b')]))
    (OUT / 'casos-maquina.json').write_text(json.dumps(results, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(results, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
