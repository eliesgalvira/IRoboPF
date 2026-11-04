"""Reservas de ámbito y causas del balance, sin regenerar el inventario."""
from copy import deepcopy
from pathlib import Path
import json
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools/procedencia/datos/lotes/escalas-minimos-2012-2018'))
import enlaces as e
import reanudar as r

BINDING = {'file': 'fixture.ts', 'symbol': 'CUOTA', 'path': [0, 'baseInferior']}
LEAF = {**BINDING, 'years': [2018, 2019], 'territories': ['estatal'], 'period': 'annual'}


def fixture():
    cell = {'row': '0', 'column': 'base', 'bbox': [1, 1, 2, 2], 'unit': 'EUR',
            'expression': {'binding': BINDING}, 'subject': 'scale-component',
            'conditions': 'Vigencia, territorio y período pendientes', 'period': 'annual'}
    table = {'code': 'fixture', 'year': 2018, 'territory': 'estatal',
             'document': {'sha256': 'a' * 64, 'size': 1}, 'page': 1, 'cells': [cell]}
    common = {'code': 'fixture', 'row': '0', 'column': 'base', 'year': 2018,
              'territory': 'estatal', 'period': 'annual', 'expected': '10', 'observed': '10',
              'status': 'match', 'reason': None}
    physical = {k: None for k in ('quote', 'literal', 'normalized', 'words',
                                  'normalization', 'geometry', 'selectors')}
    # El doble termina donde empieza el adaptador objeto de esta regresión.
    with patch.object(e.flujo, 'pdf_table', return_value=[physical]), \
         patch.object(e.flujo, 'compare', return_value=[common]):
        result = e.execute(ROOT, [table], {'tables': [table], 'semantics': {}}, [], None, {})
    return table, result


class Resultados(unittest.TestCase):
    def test_summarize_no_conserva_razon_del_lote_no_verificable(self):
        table, result = fixture()
        before = deepcopy(result)
        before['comparison'][0].update(status='not-verifiable', reason='source-unit-unproven')
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            cas = root / 'cas'
            cas.mkdir()
            (root / 'fixture.ts').write_text('export const CUOTA = [];\n')
            for lot, candidate in zip(r.LOTS, (before, result), strict=True):
                folder = root / lot
                folder.mkdir()
                artifacts = {**candidate, 'balance': e.balance([LEAF], candidate, [table])}
                manifest = {'artifacts': {k: e.flujo.put(cas, e.flujo.encode(v))
                                          for k, v in artifacts.items()}}
                (folder / 'canonical.json').write_bytes(e.flujo.encode(manifest))
            r.summarize(SimpleNamespace(work=root, repo=root, cas=cas, base='a' * 40))
            summary = json.loads((root / 'balance.json').read_bytes())
            rows = json.loads((cas / summary['occurrences']['sha256']).read_bytes())
            self.assertEqual(rows[0]['status'], 'match')
            self.assertIsNone(rows[0]['reason'])

    def test_match_conserva_reservas_hasta_balance(self):
        table, result = fixture()
        row = result['comparison'][0]
        self.assertEqual(row.get('conditions'), table['cells'][0]['conditions'])
        self.assertEqual(row.get('subject'), 'scale-component')
        self.assertEqual(row['status'], 'match')
        app = row['applicability']
        self.assertEqual(app['status'], 'pending')
        self.assertEqual(app['declared']['period'], 'annual')
        self.assertEqual(set(app['pendingDimensions']), {'temporal', 'territorial', 'period', 'conditions'})
        occurrence = e.balance([LEAF], result, [table])['occurrences'][0]
        self.assertEqual(occurrence['status'], 'match')
        self.assertIsNone(occurrence['reason'])
        self.assertEqual(occurrence['applicability']['status'], 'pending')
        self.assertEqual(occurrence['evidence'][0]['conditions'], row['conditions'])
        self.assertEqual(occurrence['evidence'][0]['applicability'], app)

    def test_cola_incluye_match_y_rechazo_completo(self):
        table, result = fixture()
        rejected = deepcopy(table)
        rejected['code'] = 'rejected'
        rejected['cells'].append({**rejected['cells'][0], 'row': '1'})
        result['errors'] = [{'code': 'rejected', 'cells': 2, 'error': 'source-unit-unproven'}]
        queues = e.review_queues(result, [table, rejected])
        for name in ('queue', 'applicabilityQueue'):
            self.assertEqual(len(queues[name]), 3)
            self.assertEqual(queues[name][0]['status'], 'match')
            self.assertTrue(all(c['applicability']['status'] == 'pending' for c in queues[name]))
            self.assertTrue(all(c['conditions'] for c in queues[name]))

    def test_union_corrige_razon_sin_perder_reserva_anterior(self):
        table, result = fixture()
        before = deepcopy(result)
        before['comparison'][0].update(status='not-verifiable', reason='source-unit-unproven')
        first = e.balance([LEAF], before, [table])
        second = e.balance([LEAF], result, [table])
        original = deepcopy([first, second])
        row = r.merge_balances({'2012-2018': first, '2019-2026': second})[0]
        self.assertEqual(row['status'], 'match')
        self.assertIsNone(row['reason'])
        self.assertEqual(len(row['evidence']), 2)
        self.assertEqual(row['strategies'][0]['reason'], 'integration-unit-or-scope-review')
        self.assertEqual(row['strategies'][1]['status'], 'match')
        self.assertEqual(row['applicability']['status'], 'pending')
        self.assertEqual([first, second], original)
        reverse = r.merge_balances({'2019-2026': second, '2012-2018': first})[0]
        self.assertEqual(row, reverse)

    def test_union_prevalece_diferencia_y_recalcula_disponibilidad(self):
        table, result = fixture()
        first = e.balance([LEAF], {'comparison': []}, [])
        second = e.balance([LEAF], result, [table])
        row = r.merge_balances({'a': first, 'b': second})[0]
        self.assertEqual(row['availability'], 'source-bytes-extracted')
        different = deepcopy(result)
        different['comparison'][0].update(status='difference', observed='11')
        third = e.balance([LEAF], different, [table])
        row = r.merge_balances({'a': first, 'b': second, 'c': third})[0]
        self.assertEqual(row['status'], 'difference')
        self.assertIsNone(row['reason'])
        self.assertEqual(len(row['strategies']), 3)

    def test_simulada_y_sin_selector_no_se_acreditan(self):
        simulated = {**LEAF, 'territories': ['simulada-estatal']}
        absent = e.balance([LEAF], {'comparison': []}, [])['occurrences'][0]
        self.assertEqual(absent['applicability']['status'], 'pending')
        self.assertEqual(absent['reason'], 'selector-not-implemented')
        first = e.balance([simulated], {'comparison': []}, [])
        row = r.merge_balances({'a': first, 'b': first})[0]
        self.assertEqual(row['status'], 'not-applicable')
        self.assertEqual(row['applicability']['status'], 'not-applicable')
        self.assertEqual(row['reason'], 'simulation-not-official-territory')


if __name__ == '__main__':
    unittest.main()
