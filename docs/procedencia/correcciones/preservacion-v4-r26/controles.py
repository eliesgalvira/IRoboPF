"""Discriminantes del consumidor v4; ningún original real se modifica."""
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / 'docs/procedencia/preservacion-v4-sol'))
import edicion as e  # noqa: E402
from adversos import EditionTests  # noqa: E402

e.CACHE = ROOT / '.cache/orquestador-preservacion/r26/tests'
e.CACHE.mkdir(parents=True, exist_ok=True)


class Adicionales(EditionTests):
    def dependency(self, path='meta.json'):
        return {**self.fp, 'path': path, 'sourceSha256': self.fp['sha256'],
                'sourceSha512': self.fp['sha512'], 'sourceSize': self.fp['size'],
                'sanitized': False, 'historical': False}

    def event(self):
        return {**self.fp, 'canonicalUrl': 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764',
                'finalUrl': None, 'retrievedAt': '2026-10-29T10:00:00Z',
                'httpStatus': 200, 'dependency': self.fp['sha256']}

    def test_r26_adquisicion_repetida_fuera_del_pin_historico(self):
        self.m['dependencies'] = [self.dependency()]
        event = self.event()
        self.m['objects'][0].update(kind='documento-primario-candidato', acquisitions=[event, dict(reversed(list(event.items())))])
        self.store()
        with self.assertRaises(ValueError):
            e.load(self.pin, self.external)

    def test_r26_observaciones_distintas_admitidas(self):
        self.m['dependencies'] = [self.dependency()]
        first = self.event()
        second = dict(first, retrievedAt='2026-10-29T10:00:01Z')
        self.m['objects'][0].update(kind='documento-primario-candidato', acquisitions=[first, second])
        self.store()
        self.assertEqual(len(e.load(self.pin, self.external)['objects'][0]['acquisitions']), 2)

    def test_r26_origenes_no_resueltos_unicos(self):
        self.m['unresolvedReferences'] = [{'sha256': 'a' * 64, 'sources': ['a', 'a']}]
        self.store()
        with self.assertRaises(ValueError):
            e.load(self.pin, self.external)

    def test_r26_prefijos_de_dependencias(self):
        self.m['dependencies'] = [self.dependency('a'), self.dependency('a/b')]
        self.store()
        with self.assertRaises(ValueError):
            e.load(self.pin, self.external)

    def test_r26_extra_vacio_en_carpeta_cas(self):
        (self.source / 'sha256' / 'extra-vacio').mkdir()
        with self.assertRaises(ValueError):
            e.verify(self.source, self.pin, self.external)

    def test_r26_privacidad_url_y_localizador(self):
        for value in ('https://example.invalid/d?token=SENTINELA',
                      'https://example.invalid/d?ToKeN=SENTINELA',
                      'https://example.invalid/d?%74oken=SENTINELA',
                      'https://SENTINELA@example.invalid/d',
                      '/tmp/SENTINELA', '/var/tmp/SENTINELA', 'file:///tmp/SENTINELA'):
            with self.subTest(value=value):
                self.assertNotIn('SENTINELA', str(e.clean({'nested': {'value': value}})))

    def test_r26_clean_idempotente_y_query_documental(self):
        data = {'url': 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764',
                'citation': {'path': 'docs/procedencia/corpus/a.json'},
                'text': 'No es una URL ni una ruta local'}
        self.assertEqual(e.clean(data), data)
        self.assertEqual(e.clean(e.clean(data)), data)

    def test_r26_no_transformado_exige_tres_identidades(self):
        for key, value in (('sourceSha256', 'a' * 64), ('sourceSha512', 'b' * 128), ('sourceSize', 99)):
            self.m['dependencies'] = [dict(self.dependency(), **{key: value})]
            self.store()
            with self.assertRaises(ValueError):
                e.load(self.pin, self.external)

    def test_r26_exclusiones_son_observaciones(self):
        self.m['exclusions'] = [{'path': 'doc.json', 'reason': 'fuera-de-alcance'}] * 2
        self.store()
        self.assertEqual(len(e.load(self.pin, self.external)['exclusions']), 2)

    def test_r26_historico_no_saneado_no_se_reescribe(self):
        data = e.p.encoded({'headers': {'Cookie': 'SENTINELA'}})
        path = self.work / 'historico'
        path.write_bytes(data)
        fp = e.p.fingerprint(path)
        e.put(path, self.source / 'dependencies' / fp['sha256'])
        self.m['dependencies'] = [{**fp, 'path': 'heredado/meta.json',
                                   'sourceSha256': fp['sha256'], 'sourceSha512': fp['sha512'],
                                   'sourceSize': fp['size'], 'sanitized': False, 'historical': True}]
        self.store()
        e.verify(self.source, self.pin, self.external)
        self.m['dependencies'][0]['historical'] = False
        self.store()
        with self.assertRaises(ValueError):
            e.verify(self.source, self.pin, self.external)


if __name__ == '__main__':
    suite = unittest.TestSuite(Adicionales(name) for name in unittest.defaultTestLoader.getTestCaseNames(Adicionales) if name.startswith('test_r26_'))
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    raise SystemExit(0 if result.wasSuccessful() else 1)
