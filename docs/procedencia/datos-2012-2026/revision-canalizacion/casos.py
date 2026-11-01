"""Contraejemplos sintéticos; PASS confirma una carencia, no aceptación fiscal."""
import copy
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[4]
spec = importlib.util.spec_from_file_location('pipeline_review', ROOT / 'tools/procedencia/datos/flujo.py')
assert spec is not None and spec.loader is not None
f = importlib.util.module_from_spec(spec)
spec.loader.exec_module(f)


class Counterexamples(unittest.TestCase):
    def setUp(self):
        self.item = {'layer': 'effective', 'source': {'file': 'synthetic.ts'},
                     'symbol': 'X', 'path': '["amount"]', 'value': '12'}
        self.cell = {'table': 'synthetic', 'row': '0', 'column': 'amount',
                     'unit': 'EUR', 'bbox': [0, 0, 20, 20], 'year': 2025,
                     'territory': 'synthetic', 'literal': '12', 'normalized': '12',
                     'document': {'sha256': '0' * 64, 'size': 1}, 'page': 1,
                     'expression': {'binding': {'file': 'synthetic.ts', 'symbol': 'X', 'path': ['amount']}}}
        self.table = {'code': 'synthetic', 'year': 2025, 'territory': 'synthetic',
                      'cells': [copy.deepcopy(self.cell)]}

    def test_rp01_coherent_unit_mutation_still_matches(self):
        self.table['cells'][0]['unit'] = self.cell['unit'] = 'percent'
        self.assertEqual(f.compare([self.table], [self.cell], [self.item])[0]['status'], 'match')

    def test_rp02_deleted_obligation_is_not_detected(self):
        self.table['cells'] = []
        self.assertEqual(f.compare([self.table], [], [self.item]), [])

    def test_rp03_compare_does_not_authenticate_document(self):
        self.cell['document'] = {'sha256': '1' * 64, 'size': 999}
        self.cell['page'] = 999
        self.assertEqual(f.compare([self.table], [self.cell], [self.item])[0]['status'], 'match')

    def test_rp04_empty_box_becomes_absence(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            doc = f.pymupdf.open()
            page = doc.new_page()
            page.insert_text((50, 50), '12')
            ref = f.put(root, doc.tobytes(), 'application/pdf')
            doc.close()
            table = {**self.table, 'document': ref, 'page': 1}
            cells = f.pdf_table(f.Store([root]), table)
            self.assertEqual(cells[0]['literal'], '')
            self.assertEqual(f.compare([table], cells, [self.item])[0]['status'], 'extraction-absent')

    def test_rp05_ine_row_label_can_misidentify_pointer(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            raw = b'{"COD":"synthetic","FK_Unidad":133,"FK_Escala":1,"Data":[{"Valor":12,"Secreto":false,"FK_TipoDato":1,"Anyo":2025,"FK_Periodo":1}]}'
            table = {**self.table, 'series': 'synthetic', 'rows': 1,
                     'document': f.put(root, raw)}
            table['cells'] = [{'row': '999', 'column': 'index', 'unit': 'index',
                               'bbox': None, 'expression': None, 'numberFormat': 'decimal'}]
            cells = f.ine_table(f.Store([root]), table)
            self.assertEqual(cells[0]['selectors'][0]['value'], '/Data/999/Valor')
            self.assertEqual(cells[0]['normalized'], '12')
            self.assertEqual(f.compare([table], cells, [])[0]['status'], 'not-verifiable')

    def test_rp07_trailing_sign_outside_box_is_ignored(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            doc = f.pymupdf.open()
            page = doc.new_page()
            page.insert_text((50, 50), '12')
            page.insert_text((66, 50), '-')
            ref = f.put(root, doc.tobytes(), 'application/pdf')
            doc.close()
            table = {**self.table, 'document': ref, 'page': 1}
            table['cells'][0]['bbox'] = [48, 35, 64, 54]
            cells = f.pdf_table(f.Store([root]), table)
            self.assertEqual(cells[0]['literal'], '12')
            self.assertEqual(f.compare([table], cells, [self.item])[0]['status'], 'match')

    def test_rp06_motor_mutation_is_detected(self):
        self.item['value'] = '13'
        self.assertEqual(f.compare([self.table], [self.cell], [self.item])[0]['status'], 'difference')


if __name__ == '__main__':
    unittest.main()
