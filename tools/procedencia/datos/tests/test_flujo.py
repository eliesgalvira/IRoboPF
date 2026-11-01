"""Fixtures sintéticos: expectativas ajenas al generador. Pruebas reales vía reconstrucción."""
import copy
from decimal import Decimal
import importlib.util
from pathlib import Path
import tempfile
import unittest

MODULE = Path(__file__).resolve().parents[1] / 'flujo.py'
spec = importlib.util.spec_from_file_location('flujo', MODULE)
if spec is None or spec.loader is None:
    raise RuntimeError('Módulo ausente')
f = importlib.util.module_from_spec(spec)
spec.loader.exec_module(f)


class Contract(unittest.TestCase):
    def setUp(self):
        self.item = {'layer':'effective', 'source':{'file':'synthetic.ts'}, 'symbol':'X', 'path':'["a"]', 'value':'1234.56'}
        self.cell = {'table':'synthetic', 'row':'1', 'column':'a', 'unit':'EUR', 'bbox':[0,0,10,10],
                     'expression':{'binding':{'file':'synthetic.ts', 'symbol':'X', 'path':['a']}},
                     'year':2014, 'territory':'estatal-comun', 'literal':'1.234,56', 'normalized':'1234.56',
                     'document':{}, 'page':1}
        self.table = {'code':'synthetic','year':2014,'territory':'estatal-comun','cells':[copy.deepcopy(self.cell)]}

    def test_independent_decimal(self):
        self.assertEqual(f.number('-1.234,56', 'EUR'), '-1234.56')
        self.assertEqual(f.number('En adelante', 'EUR'), 'Infinity')
        for value in ['−1', '1.23', '1 234', '+  1', '1,2,3']:
            with self.assertRaises(ValueError):
                f.number(value, 'EUR')

    def test_match_and_motor_change(self):
        self.assertEqual(f.compare([self.table],[self.cell],[self.item])[0]['status'],'match')
        self.item['value'] = '1234.57'
        self.assertEqual(f.compare([self.table],[self.cell],[self.item])[0]['status'],'difference')

    def test_cell_mutations(self):
        for key, value in [('unit','percent'),('year',2025),('literal','-1.234,56'),('bbox',[1,1,2,2]),('normalized','0')]:
            changed = {**self.cell,key:value}
            with self.assertRaises(ValueError):
                f.compare([self.table],[changed],[self.item])

    def test_coverage_and_duplicates(self):
        for cells in [[],[self.cell,self.cell]]:
            with self.assertRaises(ValueError):
                f.compare([self.table],cells,[self.item])
        with self.assertRaises(ValueError):
            f.compare([self.table],[self.cell],[self.item,self.item])

    def test_original_absent_corrupt_and_artifact(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            ref = f.put(root,b'official fixture synthetic','text/plain')
            self.assertEqual(f.Store([root]).read(ref),b'official fixture synthetic')
            (root/ref['sha256']).write_bytes(b'corrupt')
            with self.assertRaises(ValueError):
                f.Store([root]).read(ref)
            with self.assertRaises(ValueError):
                f.Store([root]).read({'sha256':'0'*64,'size':1})

    def test_expression(self):
        expression = {'op':'percent','args':[{'binding':{'file':'synthetic.ts','symbol':'X','path':['a']}}]}
        self.assertEqual(f.evaluate([self.item],expression),Decimal('123456'))


if __name__ == '__main__':
    unittest.main()
