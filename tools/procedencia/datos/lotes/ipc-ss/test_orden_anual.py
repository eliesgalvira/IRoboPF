"""Focal offline: dos originales, sin inventario ni ejecución del motor."""
import copy
import json
import os
from pathlib import Path
import sys
import unittest

REPO = Path(os.environ.get('DATOS_RUNTIME_ROOT', Path(__file__).resolve().parents[5]))
sys.path[:0] = [str(REPO / 'tools/procedencia/datos/lotes/ipc-ss'),
               str(REPO / 'tools/procedencia/datos')]
import enlaces  # Fijar el módulo del lote antes de que flujo añada rutas comunes.
import contexto
import flujo
import orden_anual as annual


@unittest.skipUnless(os.environ.get('SS_ANNUAL_OBJECTS') and os.environ.get('SS_ANNUAL_CENSUS'),
                     'requiere dos originales oficiales y censo previo, explícitos')
class OfficialOrderTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.registry = json.loads(Path(os.environ.get('SS_ANNUAL_REGISTRY',
            REPO / 'docs/procedencia/datos-2012-2026/lotes/ipc-ss/ordenes-anuales-v1.json')).read_bytes())
        cls.store = flujo.Store([Path(os.environ['SS_ANNUAL_OBJECTS'])])
        cls.census = json.loads(Path(os.environ['SS_ANNUAL_CENSUS']).read_bytes())
        cls.result = annual.run(cls.registry, cls.store, cls.census, REPO)

    def test_real_coverage_and_reserves(self):
        self.assertEqual(self.result['counts'], {'match': 32, 'pending': 6})
        self.assertEqual(len(self.result['physicalCells']), 88)
        for year, cap, minimum in [(2025, '4909.50', '1381.20'), (2026, '5101.20', '1424.40')]:
            rows = {r['id']: r for r in self.result['physicalCells'] if r['year'] == year}
            self.assertEqual(rows['base-1-maximum']['normalized'], cap)
            self.assertEqual(rows['base-4-minimum']['normalized'], minimum)
            self.assertEqual(rows['base-8-minimum']['periodUnit'], 'EUR/day')
            self.assertTrue(all(r['period'] == {'from': f'{year}-01-01', 'through': None} for r in rows.values()))
        self.assertFalse(self.result['ipc2026']['INEObservation'])
        self.assertTrue(all(x['futurePart'] for x in self.result['links']
                            if x['year'] == 2026 and x['status'] == 'match'))

    def test_every_changed_dimension_and_selector_is_rejected(self):
        # El registro sellado es el contrato de revisión de estas dos órdenes;
        # cambiar sólo mapping incluso con texto físicamente cierto no acredita.
        variants = []
        for key, value in [('year', 2024), ('document', self.registry[1]['document'])]:
            r = copy.deepcopy(self.registry); r[0][key] = value; variants.append((key, r))
        for key, value in [('column', 'maximum'), ('unit', 'percent'),
                           ('periodUnit', 'EUR/day'), ('article', '2'), ('group', 2)]:
            r = copy.deepcopy(self.registry); r[0]['cells'][0][key] = value; variants.append((key, r))
        for key, value in [('page', 5), ('literal', '-1.929,00'), ('bbox', [1, 1, 2, 2])]:
            r = copy.deepcopy(self.registry); r[0]['cells'][0]['value'][key] = value; variants.append((key, r))
        r = copy.deepcopy(self.registry); r[0]['cells'][-1]['party'] = 'empresarial'; variants.append(('party', r))
        r = copy.deepcopy(self.registry); r[0]['cells'][0]['header'] = r[0]['cells'][1]['header']; variants.append(('other-column', r))
        r = copy.deepcopy(self.registry); r[0]['effects'] = r[1]['effects']; variants.append(('effect-transplant', r))
        for label, registry in variants:
            with self.subTest(label=label), self.assertRaisesRegex(ValueError, 'Contrato cerrado'):
                annual.run(registry, self.store, self.census, REPO)

    def test_physical_replay_independent_of_registry_seal(self):
        # También se prueba el verificador físico, sin depender sólo del sello.
        order = self.registry[0]
        with flujo.pymupdf.open(stream=self.store.read(order['document']), filetype='pdf') as doc:
            for field, value in [('page', 1), ('literal', '0,00'), ('bbox', [1, 1, 2, 2])]:
                p = copy.deepcopy(order['cells'][0]['value']); p[field] = value
                with self.subTest(field=field), self.assertRaises(ValueError):
                    contexto.quote(doc, p)

    def test_other_original_cannot_supply_this_order(self):
        raw = self.store.read(self.registry[1]['document'])
        class WrongDocument:
            def read(self, ref):
                return raw
        with self.assertRaisesRegex(ValueError, 'Identidad documental'):
            annual.verify_order(WrongDocument(), self.registry[0])

    def test_census_reuse_checks_only_consumed_modules(self):
        changed = copy.deepcopy(self.census)
        next(m for m in changed['modules'] if m['file'] == annual.SS)['sha256'] = '0' * 64
        with self.assertRaisesRegex(ValueError, 'obsoleto'):
            annual.checked_modules(changed, REPO)
        # No atribuir a esta prueba verificación de liquidación IRPF ajena.
        unrelated = next(m for m in changed['modules'] if 'liquidar-irpf' in m['file'])
        changed = copy.deepcopy(self.census)
        next(m for m in changed['modules'] if m['file'] == unrelated['file'])['sha256'] = '0' * 64
        self.assertEqual(len(annual.checked_modules(changed, REPO)), 4)

    def test_numeric_disagreement_preserved(self):
        row = next(r for r in self.result['physicalCells'] if r['id'] == 'base-1-maximum')
        self.assertEqual(annual.compare_row(row, '0', 12), 'difference')
        self.assertEqual(annual.compare_row(row, '58914.00', 12), 'match')
        self.assertEqual(annual.compare_row(row, '58914.00', 1), 'difference')

    def test_ast_binding_must_identify_the_verified_module(self):
        for field, value in [('sha256', '0' * 64), ('file', annual.RATES)]:
            changed = copy.deepcopy(self.census)
            module = next(m for m in changed['modules'] if m['file'] == annual.PROFILE)
            item = next(x for x in module['ast']['items']
                        if x['symbol'] == 'tiposSolidaridad' and x.get('value') is not None
                        and ['PropertyAssignment:2025', 0] in json.loads(x['path'])
                        and ['PropertyAssignment:empresa', 0] in json.loads(x['path'])
                        and json.loads(x['path'])[-1] == ['StringLiteral', 0])
            item['source'][field] = value
            with self.subTest(field=field), self.assertRaisesRegex(ValueError, 'AST de otro módulo'):
                annual.run(self.registry, self.store, changed, REPO)


if __name__ == '__main__':
    unittest.main()
