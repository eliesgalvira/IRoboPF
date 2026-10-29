"""Amplía los adversos independientes sin cambiar sus expectativas históricas."""
import copy
import unittest
from adversos_test import Adversos, r


class ContratoCompleto(Adversos):
    def test_fuentes_portables_antes_de_crear_destino(self):
        for relative in ('../fuera', './fuera', '/fuera', 'dir/../fuera', 'dir//fuera'):
            with self.subTest(relative=relative):
                self.m['annex'][0]['sources'] = ['checkout:' + relative]
                self.store()
                with self.assertRaises(ValueError):
                    r.load()
                self.assertFalse(self.dest.exists())

    def test_cierre_recursivo_y_diagnostico_sin_valores(self):
        original = copy.deepcopy(self.m)
        for path in ((), ('baseline',), ('transport',), ('annex', 0),
                     ('annex', 0, 'acquisitions', 0), ('dependencies', 0)):
            with self.subTest(path=path):
                self.m = copy.deepcopy(original)
                obj: object = self.m
                for key in path:
                    if isinstance(key, int):
                        assert isinstance(obj, list)
                        obj = obj[key]
                    else:
                        assert isinstance(obj, dict)
                        obj = obj[key]
                assert isinstance(obj, dict)
                obj['headers'] = {'Cookie': 'PRIVATE_SENTINEL'}
                self.store()
                with self.assertRaises(ValueError) as caught:
                    r.load()
                self.assertNotIn('PRIVATE_SENTINEL', str(caught.exception))
                self.assertFalse(self.dest.exists())


if __name__ == '__main__':
    unittest.main(defaultTest='ContratoCompleto', verbosity=2)
