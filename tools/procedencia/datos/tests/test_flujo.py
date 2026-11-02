"""Fixtures sintéticos: expectativas ajenas al generador. Pruebas reales vía reconstrucción."""
import copy
from decimal import Decimal
import importlib.util
from pathlib import Path
import tempfile
import json
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
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        document = f.pymupdf.open()
        page = document.new_page()
        page.insert_text((20, 30), 'Cuota íntegra euros')
        ref = f.put(self.root, document.tobytes(), 'application/pdf')
        document.close()
        self.cell['document'] = ref
        self.table = {'code':'synthetic','year':2014,'territory':'estatal-comun',
                      'document':ref, 'page':1, 'cells':[copy.deepcopy(self.cell)]}
        self.obligations = [copy.deepcopy(self.table)]
        self.obligations[0]['cells'][0]['unitEvidence'] = {
            'bbox':[15,15,150,35], 'literal':'Cuota íntegra euros', 'unit':'EUR'}
        source = self.root / 'synthetic.ts'
        source.write_text('Amount a is denominated in euros. Synthetic independent contract.')
        self.semantics = {f.encode(self.cell['expression']['binding']).decode().strip(): {
            'unit':'EUR', 'sourceSha256':f.digest(source.read_bytes()),
            'quote':'Amount a is denominated in euros.'}}

    def compare(self, tables, cells, items):
        return f.compare(tables, cells, items, obligations=self.obligations,
                         store=f.Store([self.root]), semantics=self.semantics, repo=self.root)

    def test_independent_decimal(self):
        self.assertEqual(f.number('-1.234,56', 'EUR'), '-1234.56')
        self.assertEqual(f.number('En adelante', 'EUR'), 'Infinity')
        for value in ['−1', '1.23', '1 234', '+  1', '1,2,3']:
            with self.assertRaises(ValueError):
                f.number(value, 'EUR')

    def test_match_and_motor_change(self):
        self.assertEqual(self.compare([self.table],[self.cell],[self.item])[0]['status'],'match')
        self.item['value'] = '1234.57'
        self.assertEqual(self.compare([self.table],[self.cell],[self.item])[0]['status'],'difference')

    def test_cell_mutations(self):
        for key, value in [('unit','percent'),('year',2025),('literal','-1.234,56'),('bbox',[1,1,2,2]),('normalized','0')]:
            changed = {**self.cell,key:value}
            with self.assertRaises(ValueError):
                self.compare([self.table],[changed],[self.item])

    def test_coverage_and_duplicates(self):
        for cells in [[],[self.cell,self.cell]]:
            with self.assertRaises(ValueError):
                self.compare([self.table],cells,[self.item])
        with self.assertRaises(ValueError):
            self.compare([self.table],[self.cell],[self.item,self.item])

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

    def test_independent_obligations_and_units(self):
        self.table['cells'] = []
        with self.assertRaisesRegex(ValueError, 'Obligaciones'):
            self.compare([self.table], [], [self.item])
        self.table['cells'] = [copy.deepcopy(self.cell)]
        self.cell['unit'] = self.table['cells'][0]['unit'] = 'percent'
        with self.assertRaisesRegex(ValueError, 'Obligaciones'):
            self.compare([self.table], [self.cell], [self.item])

    def test_coherent_units_still_need_original_header(self):
        self.table['cells'][0]['unit'] = self.cell['unit'] = 'percent'
        self.obligations[0]['cells'][0]['unit'] = 'percent'
        self.obligations[0]['cells'][0]['unitEvidence']['unit'] = 'percent'
        with self.assertRaisesRegex(ValueError, 'semántica de cabecera'):
            self.compare([self.table], [self.cell], [self.item])

    def test_semantic_source_hash_and_operations(self):
        source = self.root / 'synthetic.ts'
        source.write_text('Modified source; its previous unit proof is stale.')
        with self.assertRaisesRegex(ValueError, 'Semántica del campo'):
            self.compare([self.table], [self.cell], [self.item])
        binding = self.cell['expression']
        self.assertIsNone(f.expression_unit({'op':'percent','args':[binding]}, {}, self.root))

    def test_missing_and_mismatched_semantics_never_match(self):
        self.semantics = {}
        self.assertEqual(self.compare([self.table], [self.cell], [self.item])[0]['reason'],
                         'engine-field-or-operation-unit-unproven')
        key = f.encode(self.cell['expression']['binding']).decode().strip()
        source = self.root / 'synthetic.ts'
        self.semantics[key] = {'unit':'proportion', 'sourceSha256':f.digest(source.read_bytes()),
                               'quote':'Amount a is denominated in euros.'}
        self.assertEqual(self.compare([self.table], [self.cell], [self.item])[0]['reason'], 'unit-mismatch')

    def test_missing_source_unit_never_matches(self):
        self.obligations[0]['cells'][0]['unitEvidence'] = None
        self.assertEqual(self.compare([self.table], [self.cell], [self.item])[0]['reason'], 'source-unit-unproven')

    def test_document_page_and_header_mutations(self):
        for key, value in [('page',999), ('document',{'sha256':'0'*64,'size':1})]:
            with self.assertRaises(ValueError):
                self.compare([self.table], [{**self.cell,key:value}], [self.item])
        self.obligations[0]['cells'][0]['unitEvidence']['literal'] = 'Invented euros'
        with self.assertRaisesRegex(ValueError, 'Cabecera'):
            self.compare([self.table], [self.cell], [self.item])

    def test_empty_and_explicit_absence(self):
        for literal in ['----','—','–','-']:
            self.assertEqual(f.number(literal, 'EUR'), 'absent')
        with self.assertRaisesRegex(ValueError, 'Caja vacía'):
            f.number('', 'EUR')
        self.cell.update(literal='----', normalized='absent')
        self.assertEqual(self.compare([self.table], [self.cell], [self.item])[0]['status'], 'extraction-absent')

    def test_both_external_signs(self):
        for x in [40,66]:
            for sign in ['-', '+']:
                with self.subTest(x=x, sign=sign):
                    doc = f.pymupdf.open()
                    page = doc.new_page()
                    page.insert_text((50,50), '12')
                    page.insert_text((x,50), sign)
                    ref = f.put(self.root,doc.tobytes(),'application/pdf')
                    doc.close()
                    table = {**self.table, 'document':ref,
                             'cells':[{**self.cell,'bbox':[48,35,64,54]}]}
                    with self.assertRaisesRegex(ValueError, 'Signo próximo'):
                        f.pdf_table(f.Store([self.root]),table)
        with self.assertRaisesRegex(ValueError, 'Caja vacía'):
            f.pdf_table(f.Store([self.root]),self.table)

    def test_ine_pointer_indices(self):
        raw = f.encode({'COD':'S','FK_Unidad':133,'FK_Escala':1,'Data':[
            {'Valor':12,'Secreto':False,'FK_TipoDato':1,'Anyo':2025,'FK_Periodo':1}]})
        table = {**self.table,'document':f.put(self.root,raw),'series':'S','rows':1,
                 'cells':[{'row':'0','column':'Valor','unit':'index','bbox':None,'expression':None}]}
        cells = f.ine_table(f.Store([self.root]),table)
        self.assertEqual(cells[0]['selectors'][0]['value'], '/Data/0/Valor')
        self.assertEqual(json.loads(raw)['Data'][0]['Valor'], int(cells[0]['normalized']))
        for row in ['999','-1','00']:
            table['cells'][0]['row'] = row
            with self.assertRaisesRegex(ValueError, 'JSON Pointer'):
                f.ine_table(f.Store([self.root]),table)

    def test_external_sign_geometry_across_font_sizes_and_vertical_offsets(self):
        for fontsize, baseline in [(6,50),(8,50),(14,50),(17,50),(11,47),(11,53)]:
            for x in (40,66):
                for sign in ('-', '+'):
                    with self.subTest(fontsize=fontsize,baseline=baseline,x=x,sign=sign):
                        doc = f.pymupdf.open()
                        page = doc.new_page()
                        page.insert_text((50,50), '12', fontsize=11)
                        page.insert_text((x,baseline), sign, fontsize=fontsize)
                        ref = f.put(self.root,doc.tobytes(),'application/pdf')
                        doc.close()
                        table = {**self.table,'document':ref,
                                 'cells':[{**self.cell,'bbox':[48,35,64,54]}]}
                        with self.assertRaisesRegex(ValueError, 'Signo próximo'):
                            f.pdf_table(f.Store([self.root]),table)

    def test_signs_in_separate_rows_or_distant_columns_do_not_change_cell(self):
        for x, baseline in [(40,20),(66,80),(40,64),(66,36),(10,50),(100,50)]:
            for sign in ('-', '+'):
                with self.subTest(x=x,baseline=baseline,sign=sign):
                    doc = f.pymupdf.open()
                    page = doc.new_page()
                    page.insert_text((50,50), '12', fontsize=11)
                    page.insert_text((x,baseline), sign, fontsize=8)
                    ref = f.put(self.root,doc.tobytes(),'application/pdf')
                    doc.close()
                    table = {**self.table,'document':ref,
                             'cells':[{**self.cell,'bbox':[48,35,64,54]}]}
                    self.assertEqual(f.pdf_table(f.Store([self.root]),table)[0]['normalized'],'12')

    def test_contained_signs_keep_their_value(self):
        for sign, expected in [('-', '-12'), ('+', '12')]:
            with self.subTest(sign=sign):
                doc = f.pymupdf.open()
                page = doc.new_page()
                page.insert_text((50,50), sign + '12', fontsize=11)
                ref = f.put(self.root,doc.tobytes(),'application/pdf')
                doc.close()
                table = {**self.table,'document':ref,
                         'cells':[{**self.cell,'bbox':[48,35,100,54]}]}
                self.assertEqual(f.pdf_table(f.Store([self.root]),table)[0]['normalized'],expected)

    def test_json_positions_are_structural(self):
        text = '{"other":{"Valor":12},"Data":[{"note":"Valor", "Valor":12}]}'
        start, end = f.json_positions(text)['/Data/0/Valor']
        self.assertEqual(text[start:end], '12')
        self.assertGreater(start, text.index('Data'))
        with self.assertRaisesRegex(ValueError, 'duplicada'):
            f.json_positions('{"Data":[{"Valor":12,"Valor":12}]}')

    def test_operation_units_require_compatible_operands(self):
        binding = self.cell['expression']
        for op in ['sum', 'subtract']:
            expression = {'op':op, 'args':[binding, binding]}
            self.assertEqual(f.expression_unit(expression, self.semantics, self.root), 'EUR')
        self.assertIsNone(f.expression_unit({'op':'subtract', 'args':[binding]}, self.semantics, self.root))
        self.assertIsNone(f.expression_unit({'op':'percent', 'args':[binding]}, self.semantics, self.root))
        key = f.encode(binding['binding']).decode().strip()
        self.semantics[key]['unit'] = 'proportion'
        self.assertEqual(f.expression_unit({'op':'percent', 'args':[binding]}, self.semantics, self.root), 'percent')
        self.assertIsNone(f.expression_unit({'op':'sum', 'args':[binding, binding]}, self.semantics, self.root))

    def test_json_pointer_selects_second_repeated_value(self):
        text = '{"Data":[{"Valor":12},{"Valor":12}],"Valor":12}'
        positions = f.json_positions(text)
        first = positions['/Data/0/Valor']
        second = positions['/Data/1/Valor']
        self.assertGreater(second[0], first[1])
        self.assertEqual(text[slice(*second)], '12')
        self.assertNotEqual(second, positions['/Valor'])

    def test_expression(self):
        expression = {'op':'percent','args':[{'binding':{'file':'synthetic.ts','symbol':'X','path':['a']}}]}
        self.assertEqual(f.evaluate([self.item],expression),Decimal('123456'))


if __name__ == '__main__':
    unittest.main()
