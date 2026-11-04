"""Contrato local de la matriz C300; sin navegador ni red."""
import copy
import sys
import unittest
import tempfile
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools/procedencia/simuladores'))
import c300
from c300_evidence import pdf_checks
from contract import MAP
from evidence import REQUIRED_PDF
from storage import canonical, digest, read_jsonl


class MatrixTests(unittest.TestCase):
    def test_compare_selection_never_repairs_a_live_journal(self):
        with tempfile.TemporaryDirectory() as tmp, patch.object(c300.run, 'OUT', Path(tmp)):
            journal = Path(tmp) / 'journal.jsonl'
            started = canonical(dict(status='started', key='a' * 64)) + b'\n'
            for tail in (b'{"incomplete":', b'{"status":"done"}', b''):
                with self.subTest(tail=tail):
                    before = started + tail
                    journal.write_bytes(before)
                    self.assertEqual(c300.historical_receipts([]), {})
                    self.assertEqual(journal.read_bytes(), before)
                    self.assertEqual(sorted(p.name for p in Path(tmp).iterdir()), ['journal.jsonl'])

    def test_closed_snapshot_does_not_hide_corrupt_complete_records(self):
        with tempfile.TemporaryDirectory() as tmp:
            journal = Path(tmp) / 'journal.jsonl'
            for content in (b'{broken}\n', b'42\n'):
                journal.write_bytes(content)
                with self.subTest(content=content), self.assertRaises(ValueError):
                    read_jsonl(journal, closed_snapshot=True)
                self.assertEqual(journal.read_bytes(), content)
            journal.write_bytes(b'{"ok":1}\n{"incomplete":')
            self.assertEqual(read_jsonl(journal, closed_snapshot=True), [dict(ok=1)])
            with self.assertRaisesRegex(ValueError, 'no puede reparar'):
                read_jsonl(journal, repair_tail=True, closed_snapshot=True)

    def test_pdf_zero_with_ses_absent_is_not_equality(self):
        text = 'Ejercicio 2025\n' + '\n'.join('0,00 ' + box for box in REQUIRED_PDF)
        values = {key: None for key in MAP.values()}
        checked = pdf_checks(text, values, 2025)
        self.assertEqual(checked['0533']['state'], 'ses-ausente')
        self.assertIsNone(checked['0533']['ses'])
        with self.assertRaisesRegex(ValueError, 'no cero'):
            pdf_checks(text + '\n0,01 0533', values, 2025)
        with self.assertRaisesRegex(ValueError, 'obligatoria'):
            pdf_checks(text.replace('0,00 0533', ''), values, 2025)
        values['CIGAUT'] = '0.01'
        with self.assertRaisesRegex(ValueError, 'Discrepancia'):
            pdf_checks(text, values, 2025)

    def test_deterministic_distinct_complete_inputs(self):
        cases = c300.matrix()
        self.assertEqual(len(cases), 300)
        self.assertEqual(canonical(cases), canonical(c300.matrix()))
        self.assertEqual(len({digest(canonical(c['entrada'])) for c in cases}), 300)
        self.assertGreaterEqual(sum(len(c['entrada']['trabajo']['rendimientos']) == 2 for c in cases), 20)
        self.assertGreaterEqual(len({c['job']['ss'] for c in cases}), 50)
        self.assertGreaterEqual(len({c['job']['retention'] for c in cases}), 50)

    def test_duplicate_and_contradictory_inputs_rejected(self):
        case = c300.matrix()[2]
        for field in ('gross', 'ss', 'retention'):
            bad = copy.deepcopy(case)
            bad['job'][field] = '1.01'
            with self.subTest(field=field), self.assertRaises(ValueError):
                c300.validate_cases([bad])
        for field in ('GCS', 'GCC', 'GDJ'):
            bad = copy.deepcopy(case)
            bad['expenses'][field] = '1.01'
            with self.subTest(field=field), self.assertRaises(ValueError):
                c300.validate_cases([bad])
        duplicate = copy.deepcopy(case)
        duplicate['job']['id'] = 'c300-999'
        with self.assertRaisesRegex(ValueError, 'duplicado'):
            c300.validate_cases([case, duplicate])

    def test_two_payers_preserve_expenses_and_totals(self):
        case = c300.matrix()[2]
        rs = case['entrada']['trabajo']['rendimientos']
        self.assertEqual([r['id'] for r in rs], ['a', 'b'])
        self.assertEqual(rs[1]['sindicato']['importe'], '0.00')
        self.assertIn('agregados', case['officialPayers'])
        c300.validate_cases([case])

    def test_absent_zero_requires_ui_observation_without_zero_conversion(self):
        case = c300.matrix()[3]
        fields = dict(IDII=case['job']['gross'], GSS=None, IDRE=case['job']['retention'],
                      IDICLDED2=case['job']['gross'], GSSCLDED2=None, GCS=None, GCC=None, GDJ=None)
        row = dict(id=case['job']['id'], fields=fields, ses={}, uiReadback=dict(GSS='0.00', GSSCLDED2='0.00'))
        person = dict(EDADD='40', DPFNAC_D='01/01/1985', CAD_D='MADRID', CAC_D='12', ZCCAD='12', ZFNAC_D='01/01/1985')
        with tempfile.TemporaryDirectory() as tmp, patch.object(c300.run, 'BASE', Path(tmp)), patch.object(c300.run, 'TEMPLATES', {'componentes': digest(b'')}), patch('contract.decode', return_value=''), patch.object(c300, 'validate_result', return_value={}), patch.object(c300, 'read_ref', return_value=b''), patch.object(c300, 'personal', return_value=person):
            (Path(tmp) / 'componentes.ses').write_bytes(b'')
            checked = c300.validate(row, case)
            self.assertEqual(checked['absentInputs'], ['GSS', 'GSSCLDED2'])
            self.assertIsNone(row['fields']['GSS'])
            del row['uiReadback']['GSS']
            with self.assertRaisesRegex(ValueError, 'sin lectura UI cero'):
                c300.validate(row, case)


if __name__ == '__main__':
    unittest.main()
