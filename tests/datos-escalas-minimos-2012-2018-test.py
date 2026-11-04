"""Autonomous synthetic regression tests; no historical originals or Git."""
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('batch', ROOT / 'tools/procedencia/datos/lotes/escalas-minimos-2012-2018/lote.py')
batch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(batch)
f = batch.flujo


class BatchTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        document = f.pymupdf.open()
        page = document.new_page()
        page.insert_text((30, 50), 'Base liquidable hasta euros', fontsize=10)
        page.insert_text((30, 90), '- 1.234,56', fontsize=10)
        self.ref = f.put(self.root, document.tobytes(), 'application/pdf')
        document.close()
        self.table = {'code': 'synthetic', 'year': 2012, 'territory': 'ceuta',
                      'page': 1, 'document': self.ref, 'cells': [
                          {'row': '0', 'column': 'value', 'unit': 'EUR', 'bbox': [25, 75, 120, 94]}]}
        self.obligation = copy.deepcopy(self.table)
        self.obligation['cells'][0]['unitEvidence'] = {
            'unit': 'EUR', 'literal': 'Base liquidable hasta euros', 'bbox': [25, 35, 180, 55]}
        source = self.root / 'fixture.ts'
        source.write_text('/* EUR */')
        binding = {'file': 'fixture.ts', 'symbol': 'VALUE', 'path': ['amount']}
        self.table['cells'][0]['expression'] = {'binding': binding}
        self.items = [{'layer': 'effective', 'source': {'file': 'fixture.ts'}, 'symbol': 'VALUE',
                       'path': json.dumps(['amount']), 'value': '-1234.56'}]
        self.semantics = {f.encode(binding).decode().strip(): {
            'sourceSha256': f.digest(source.read_bytes()), 'quote': 'EUR', 'unit': 'EUR'}}
        self.store = f.Store([self.root])

    def cells(self):
        return f.pdf_table(self.store, self.table)

    def compare(self, cells):
        return f.compare([self.table], cells, self.items, obligations=[self.obligation],
                         store=self.store, semantics=self.semantics, repo=self.root)

    def test_negative_exact_and_mutation_difference(self):
        self.assertEqual(self.compare(self.cells())[0]['status'], 'match')
        self.items[0]['value'] = '1234.56'
        self.assertEqual(self.compare(self.cells())[0]['status'], 'difference')

    def test_omission_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Cobertura'):
            self.compare([])
        with self.assertRaisesRegex(ValueError, 'Obligaciones'):
            batch.execute([], [self.obligation], self.items, self.store, self.semantics, self.root)

    def test_unit_not_inferred_from_equality(self):
        self.obligation['cells'][0].pop('unitEvidence')
        result = self.compare(self.cells())[0]
        self.assertEqual(result['status'], 'not-verifiable')
        self.assertEqual(result['reason'], 'source-unit-unproven')

    def test_year_and_territory_rejected(self):
        for field, value in [('year', 2013), ('territory', 'melilla')]:
            with self.subTest(field=field):
                cells = self.cells()
                cells[0][field] = value
                with self.assertRaisesRegex(ValueError, 'Ámbito'):
                    self.compare(cells)

    def test_binding_mutation_rejected(self):
        cells = self.cells()
        cells[0]['expression']['binding']['path'] = ['other']
        # Mutation affects the shared expression too; binding lookup must fail.
        with self.assertRaisesRegex(ValueError, 'Binding'):
            self.compare(cells)

    def test_failed_table_retains_all_obligations(self):
        self.table['cells'][0]['bbox'] = [300, 300, 400, 400]
        self.obligation['cells'][0]['bbox'] = [300, 300, 400, 400]
        result = batch.execute([self.table], [self.obligation], self.items, self.store,
                               self.semantics, self.root)
        self.assertEqual(result['obligations'], 1)
        self.assertEqual(result['errors'][0]['obligations'], 1)
        self.assertEqual(result['comparison'], [])
        self.assertEqual(result['extraction'], [])

    def test_supplement_requires_intact_inventory_and_all_exports(self):
        module_spec = importlib.util.spec_from_file_location(
            'quota_census', ROOT / 'tools/procedencia/datos/lotes/escalas-minimos-2012-2018/censo_cuotas.py')
        module = importlib.util.module_from_spec(module_spec)
        module_spec.loader.exec_module(module)
        folder = self.root / 'inventory'
        folder.mkdir()
        (folder / 'censo-completo.json').write_text('{"leaves":[]}')
        items = [{'layer': 'effective', 'symbol': symbol,
                  'source': {'file': 'lib/dominio/irpf/cuotas/escalas-publicadas.ts', 'sha256': '0' * 64},
                  'path': '["0","cuota"]', 'value': '0', 'years': [2014],
                  'territories': [], 'unit': 'EUR'} for symbol in ['PUBLISHED_FIXTURE', 'ADDITIONAL_FIXTURE']]
        raw = f.encode(items)
        (folder / 'page.json').write_bytes(raw)
        (folder / 'inventario.json').write_text(json.dumps({
            'pages': [{'file': 'page.json', 'sha256': f.digest(raw)}]}))
        self.assertEqual(len(module.augment(folder)['leaves']), 2)
        (folder / 'page.json').write_bytes(f.encode(items[:-1]))
        with self.assertRaisesRegex(ValueError, 'hash'):
            module.augment(folder)
        (folder / 'page.json').write_bytes(f.encode([]))
        (folder / 'inventario.json').write_text(json.dumps({
            'pages': [{'file': 'page.json', 'sha256': f.digest(f.encode([]))}]}))
        with self.assertRaisesRegex(ValueError, 'absent'):
            module.augment(folder)

    def test_printed_absence_is_not_zero(self):
        document = f.pymupdf.open()
        page = document.new_page()
        page.insert_text((30, 50), 'Base liquidable hasta euros', fontsize=10)
        page.insert_text((30, 90), '-', fontsize=10)
        reference = f.put(self.root, document.tobytes(), 'application/pdf')
        document.close()
        self.table['document'] = self.obligation['document'] = reference
        self.items[0]['value'] = '0'
        result = self.compare(self.cells())[0]
        self.assertEqual(result['status'], 'extraction-absent')
        self.assertEqual(result['expected'], 'absent')

    def test_lowercase_and_broken_grouping_stay_errors(self):
        for literal in ['en adelante', '66. 593,00', '− 1.234,56']:
            with self.subTest(literal=literal), self.assertRaises(ValueError):
                f.number(literal, 'EUR')


if __name__ == '__main__':
    unittest.main()
