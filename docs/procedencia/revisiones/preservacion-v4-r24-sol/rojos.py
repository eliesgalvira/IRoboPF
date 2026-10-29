"""Expectativas protectoras que v4 debe satisfacer; los fallos se conservan."""
import unittest
from ataques import inherited
from adversos import EditionTests


class Rojos(EditionTests):
    def test_r24_referencias_unicas(self):
        self.m['objects'][0]['references'] = ['doc.json', 'doc.json']
        self.store()
        with self.assertRaises(ValueError):
            inherited.e.load(self.pin, self.external)

    def test_r24_no_resueltas_unicas(self):
        self.m['unresolvedReferences'] = [{'sha256': 'a' * 64, 'sources': ['doc.json']}] * 2
        self.store()
        with self.assertRaises(ValueError):
            inherited.e.load(self.pin, self.external)

    def test_r24_conjunto_exacto(self):
        (self.source / 'extra').write_bytes(b'no enumerado')
        with self.assertRaises(ValueError):
            inherited.e.verify(self.source, self.pin, self.external)

    def test_r24_hash512_fin_absoluto(self):
        self.m['objects'][0]['sha512'] += '\n'
        self.store()
        with self.assertRaises(ValueError):
            inherited.e.load(self.pin, self.external)

    def test_r24_dep_identidad_coherente(self):
        dep = {**self.fp, 'path': 'meta.json', 'sourceSha256': 'a' * 64, 'sourceSha512': self.fp['sha512'], 'sourceSize': self.fp['size'], 'historical': False, 'sanitized': False}
        self.m['dependencies'] = [dep]
        self.store()
        with self.assertRaises(ValueError):
            inherited.e.load(self.pin, self.external)


if __name__ == '__main__':
    suite = unittest.TestSuite(Rojos(name) for name in unittest.defaultTestLoader.getTestCaseNames(Rojos) if name.startswith('test_r24_'))
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    raise SystemExit(0 if result.wasSuccessful() else 1)
