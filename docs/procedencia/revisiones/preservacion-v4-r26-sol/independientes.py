"""Fronteras independientes; solo sintéticos y copias reales en lectura."""
import ast
import copy
import gzip
import hashlib
import importlib
import json
from pathlib import Path
import re
import runpy
import sys
import unittest
from unittest.mock import patch

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
CACHE = ROOT / '.cache/preservacion-v4-r26-sol/independientes'
CACHE.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(ROOT / 'docs/procedencia/preservacion-v4-sol'))
e = importlib.import_module('edicion')
setattr(e, 'CACHE', CACHE)
from adversos import EditionTests  # noqa: E402

CASES: list[dict] = []


class Independientes(EditionTests):
    def dep(self, path='a.json'):
        return dict(self.fp, path=path, sourceSha256=self.fp['sha256'], sourceSha512=self.fp['sha512'], sourceSize=self.fp['size'], sanitized=False, historical=False)

    def check_case(self, label, operation, expected):
        try:
            operation()
            outcome = 'admitido'
        except (ValueError, OSError) as error:
            self.assertNotIn('SECRETO_SINTETICO', str(error))
            outcome = 'rechazado'
        CASES.append(dict(case=label, expected=expected, outcome=outcome))
        self.assertEqual(outcome, expected, label)

    def test_nuevo_pin_con_edicion_base_historicas(self):
        self.m['dependencies'] = [self.dep()]
        event = dict(self.fp, canonicalUrl='https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', finalUrl=None, retrievedAt='2026-10-29T10:00:00Z', httpStatus=200, dependency=self.fp['sha256'])
        self.m['objects'][0]['acquisitions'] = [event, dict(reversed(list(event.items())))]
        self.store()
        self.check_case('duplicado-con-edicion-y-base-historicas', lambda: e.load(self.pin, self.external), 'rechazado')
        self.check_case('pin-historico-no-admite-otros-bytes', lambda: e.load(e.HISTORICAL_PIN, self.external), 'rechazado')
        for field, value in [('retrievedAt', '2026-10-29T10:00:01Z'), ('finalUrl', 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764')]:
            self.m['objects'][0]['acquisitions'] = [event, dict(event, **{field: value})]
            self.store()
            self.check_case('adquisicion-distinta-' + field, lambda: e.load(self.pin, self.external), 'admitido')
        # Ejecuta solo la expresión real del colector, sin collect/red/censo.
        tree = ast.parse((e.HERE / 'edicion.py').read_text())
        assignment = next(n for n in ast.walk(tree) if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'valid' for t in n.targets))
        expression = compile(ast.Expression(assignment.value), '<expresion-real-collect>', 'eval')
        namespace = dict(p=e.p, sha=self.fp['sha256'], fp=self.fp, events={self.fp['sha256']: [event, dict(reversed(list(event.items()))), dict(event, retrievedAt='2026-10-29T10:00:01Z')]})
        valid = eval(expression, namespace)
        self.assertEqual(len(valid), 2)
        self.assertEqual({v['retrievedAt'] for v in valid}, {event['retrievedAt'], '2026-10-29T10:00:01Z'})
        CASES.append(dict(case='expresion-real-collect', identicalCollapsed=True, distinctRetained=True))

    def test_todos_patrones_fin_absoluto(self):
        schema = json.loads((e.HERE / 'schema.json').read_bytes())
        patterns = []
        def walk(v, path=''):
            if isinstance(v, dict):
                if 'pattern' in v:
                    patterns.append((path, v['pattern']))
                for k, child in v.items():
                    walk(child, path + '/' + k)
            elif isinstance(v, list):
                for i, child in enumerate(v):
                    walk(child, path + '/' + str(i))
        walk(schema)
        self.assertEqual(len(patterns), 16)
        for path, pattern in patterns:
            value = 'a' * (128 if '{128}' in pattern else 64) if '[0-9a-f]' in pattern else 'carpeta/fuente.json'
            self.assertIsNotNone(re.search(pattern, value), path)
            for suffix in ('\n', '\r', '\r\n', '\0'):
                self.assertIsNone(re.search(pattern, value + suffix), path)
        (CACHE / 'patterns.json').write_text(json.dumps(patterns))
        CASES.append(dict(case='16-patrones-python', valid=True, suffixesRejected=['LF', 'CR', 'CRLF', 'NUL']))

    def test_schema_no_equivale_load_ni_verify(self):
        self.m['objects'][0]['references'] = ['a', 'a']
        validator = e.p.Draft202012Validator(json.loads((e.HERE / 'schema.json').read_bytes()))
        self.assertTrue(validator.is_valid(self.m))
        self.store()
        self.check_case('schema-admite-duplicado-load-rechaza', lambda: e.load(self.pin, self.external), 'rechazado')
        self.m['objects'][0]['references'] = []
        self.store()
        target = self.source / 'sha256' / self.fp['sha256']
        target.chmod(0o644)
        target.write_bytes(b'corrupto')
        self.check_case('load-sin-leer-cas', lambda: e.load(self.pin, self.external), 'admitido')
        self.check_case('verify-lee-cas', lambda: e.verify(self.source, self.pin, self.external), 'rechazado')

    def test_conjunto_y_tipos_tres_carpetas(self):
        for folder in ('', 'sha256', 'dependencies'):
            target = self.source / folder / 'extra'
            target.mkdir()
            self.check_case('extra-vacio-' + (folder or 'raiz'), lambda: e.verify(self.source, self.pin, self.external), 'rechazado')
            target.rename(self.work / ('retenido-' + (folder or 'raiz')))
        for folder in ('sha256', 'dependencies'):
            target = self.source / folder
            retained = self.work / ('original-' + folder)
            target.rename(retained)
            target.symlink_to(retained, target_is_directory=True)
            self.check_case('cas-symlink-' + folder, lambda: e.verify(self.source, self.pin, self.external), 'rechazado')
            target.rename(self.work / ('symlink-' + folder))
            retained.rename(target)
        target = self.source / 'sha256' / self.fp['sha256']
        retained = self.work / 'original-objeto'
        target.rename(retained)
        target.mkdir()
        self.check_case('objeto-directorio', lambda: e.verify(self.source, self.pin, self.external), 'rechazado')
        target.rename(self.work / 'directorio-con-nombre-hash')
        target.symlink_to(retained)
        self.check_case('objeto-symlink', lambda: e.verify(self.source, self.pin, self.external), 'rechazado')

    def test_prefijos_rechazados_sin_materializar(self):
        for paths in (['a/b/c', 'a'], ['a', 'a/b/c']):
            self.m['dependencies'] = [self.dep(p) for p in paths]
            self.store()
            argv = ['materializar.py', '--package', str(self.source), '--destination', str(self.dest), '--manifest', str(self.external), '--pin', self.pin]
            with patch.object(sys, 'argv', argv):
                self.check_case('prefijo-antes-de-escribir-' + paths[0], lambda: runpy.run_path(str(e.HERE / 'materializar.py'), run_name='__main__'), 'rechazado')
            self.assertFalse(self.dest.exists())
        self.m['dependencies'] = [self.dep('a/b'), self.dep('ab')]
        self.store()
        self.check_case('prefijo-lexico-no-es-ancestro', lambda: e.load(self.pin, self.external), 'admitido')

    def test_identidades_ambas_banderas(self):
        for field, replacement in [('sourceSha256', 'a' * 64), ('sourceSha512', 'b' * 128), ('sourceSize', self.fp['size'] + 1)]:
            for historical in (False, True):
                self.m['dependencies'] = [dict(self.dep(), historical=historical, **{field: replacement})]
                self.store()
                self.check_case(f'identidad-{field}-historical-{historical}', lambda: e.load(self.pin, self.external), 'rechazado')
            self.m['dependencies'][0]['sanitized'] = True
            self.store()
            self.check_case('origen-transformado-no-reconstruible-' + field, lambda: e.load(self.pin, self.external), 'admitido')

    def test_privacidad_por_valores_y_diagnostico(self):
        for value in ('https://example.invalid/?%41cCeSs_ToKeN=SECRETO_SINTETICO', 'HTTPS://u:SECRETO_SINTETICO@example.invalid/a', '/run/user/1000/SECRETO_SINTETICO', '/Users/SECRETO_SINTETICO', 'file:///SECRETO_SINTETICO'):
            self.assertNotIn('SECRETO_SINTETICO', str(e.clean({'a': [value]})))
        for value in ('https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', 'https://www.bocm.es/boletin?idAnuBlob=123456', 'https://example.invalid/?documento=BOE-A-2006-20764'):
            self.assertEqual(e.clean(value), value)
        for value in ('https://[SECRETO_SINTETICO', 'https://SECRETO_SINTETICO@example.invalid'):
            self.m['objects'][0]['references'] = [value]
            self.store()
            self.check_case('diagnostico-schema-saneado', lambda: e.load(self.pin, self.external), 'rechazado')
        residuals = ['Texto /tmp/SECRETO_SINTETICO', ' https://example.invalid/?token=SECRETO_SINTETICO', 'FILE:///tmp/SECRETO_SINTETICO']
        self.assertTrue(all('SECRETO_SINTETICO' in e.clean(v) for v in residuals))
        CASES.append(dict(case='limites-de-politica', proseAndLeadingSpaceAndUppercaseFileRemain=True, actualSecretExposed=False))


def real():
    store = Path('/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v4-938f230888d2')
    external = store / 'manifest-externo.json'
    pin = e.HISTORICAL_PIN
    assert hashlib.sha256(external.read_bytes()).hexdigest() == pin
    receipt = e.verify(store / 'paquete', pin, external)
    assert receipt['acquisitionObservations'] == 33 and receipt['distinctAcquisitionRecords'] == 23
    assert receipt['privacyCertification'] is False
    original = json.loads(external.read_bytes())
    mutated = copy.deepcopy(original)
    mutated['exclusions'].append(dict(path='revision-sintetica.json', reason='mutacion-sintetica-no-publicar'))
    path = CACHE / 'historico-mutado.json'
    path.write_bytes(e.p.encoded(mutated))
    new_pin = hashlib.sha256(path.read_bytes()).hexdigest()
    try:
        e.load(new_pin, path)
    except ValueError as error:
        assert str(error) == 'Registros duplicados en adquisiciones'
    else:
        raise AssertionError('Mutación heredó excepción')
    policy_changes = 0
    for dep in original['dependencies']:
        if not dep['historical'] and dep['path'].endswith(('.json', '.json.gz')):
            data = (store / 'paquete/dependencies' / dep['sha256']).read_bytes()
            value = e.p.strict_json(gzip.decompress(data) if dep['path'].endswith('.gz') else data)
            policy_changes += e.clean(value) != value
    software = {p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest() for p in ['docs/procedencia/preservacion-v4-sol/edicion.py', 'docs/procedencia/preservacion-v4-sol/schema.json', 'docs/procedencia/preservacion-v3/recolector.py', 'tools/procedencia/preservacion.py']}
    (OUT / 'copia-real.json').write_text(json.dumps(dict(receipt=receipt, software=software, mutatedHistoricalRejected=True, metadataDifferingUnderPolicy2=policy_changes, actualSecretsAssessment='Sin prueba de secreto real; discrepancia de política no equivale a secreto.', newRestoration=False), indent=2) + '\n')


if __name__ == '__main__':
    names = [n for n in unittest.defaultTestLoader.getTestCaseNames(Independientes) if n in Independientes.__dict__]
    result = unittest.TextTestRunner(verbosity=2).run(unittest.TestSuite(Independientes(n) for n in names))
    (OUT / 'casos-maquina.json').write_text(json.dumps(CASES, indent=2, ensure_ascii=False) + '\n')
    if not result.wasSuccessful():
        raise SystemExit(1)
    real()
