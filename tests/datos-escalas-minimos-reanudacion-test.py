"""Regresiones de reutilización física: una prueba no se trasplanta por caché."""
from pathlib import Path
import sys
import tempfile
import unittest
import shutil
import os
from unittest.mock import patch
from copy import deepcopy
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools/procedencia/datos/lotes/escalas-minimos-2012-2018"))
import enlaces as e
from reanudar import reconcile
from selectores_minimos import manual_contribuyente


class CacheGeometry(unittest.TestCase):
    def test_simulation_is_separate_from_missing_official_selector(self):
        leaf = {'file': 'a.ts', 'symbol': 'a', 'path': [], 'years': [2025],
                'territories': ['simulada-estatal']}
        row = e.balance([leaf], {'comparison': [], 'errors': []}, [])['occurrences'][0]
        self.assertEqual(row['status'], 'not-applicable')
        self.assertEqual(row['reason'], 'simulation-not-official-territory')

    @unittest.skipUnless(shutil.which('bun'), 'Bun no disponible para el AST')
    def test_batch_executes_real_resolver_and_rejects_async_and_transplant(self):
        with tempfile.TemporaryDirectory() as folder:
            repo = Path(folder)
            resolver = repo / 'tools/procedencia/datos/binding-position.mjs'
            resolver.parent.mkdir(parents=True)
            resolver.write_bytes((ROOT / 'tools/procedencia/datos/binding-position.mjs').read_bytes())
            source = repo / 'fixture.ts'
            source.write_text('export const direct = { amount: 12, other: 13 };\n'
                              'const identity = async (x) => x;\n'
                              'export const invalid = identity({ amount: 12 });\n')
            binding = {'file': 'fixture.ts', 'symbol': 'direct', 'path': ['amount']}
            with patch.dict(os.environ, {'DATOS_RUNTIME_ROOT': str(ROOT)}):
                second = {**binding, 'path': ['other']}
                combined = e.batch_positions(repo, {'semantics': {e.flujo.encode(b).decode().strip(): {} for b in (binding, second)}}, repo)
                other_key = (str(repo), str(source), 'direct', '["other"]',
                             e.flujo.digest(source.read_bytes()), e.flujo.digest(resolver.read_bytes()))
                self.assertEqual(combined(*other_key)['quote'], '13')
                lookup = e.batch_positions(repo, {'semantics': {e.flujo.encode(binding).decode().strip(): {}}}, repo)
                key = (str(repo), str(source), 'direct', '["amount"]',
                       e.flujo.digest(source.read_bytes()), e.flujo.digest(resolver.read_bytes()))
                self.assertEqual(lookup(*key)['quote'], '12')
                with self.assertRaises(ValueError):
                    lookup(*key[:-2], '0' * 64, key[-1])
                binding['symbol'] = 'invalid'
                with self.assertRaisesRegex(ValueError, 'identidad'):
                    e.batch_positions(repo, {'semantics': {e.flujo.encode(binding).decode().strip(): {}}}, repo)

    def test_manual_selector_uses_subject_and_annual_phrase(self):
        doc = e.flujo.pymupdf.open()
        page = doc.new_page()
        page.insert_text((30, 40), 'Rentas anuales no superiores a 9.999 euros', fontsize=9)
        page.insert_text((30, 80), 'El mínimo del contribuyente es, con carácter general, de 5.550 euros anuales,', fontsize=9)
        result = manual_contribuyente(page)
        self.assertEqual(result['path'], ['contribuyente', 'general'])
        self.assertEqual(result['period'], 'anual')
        self.assertIn('5.550', result['literal'])
        self.assertTrue(any(w[4] == 'anuales,' for w in result['words']))
        page.insert_text((30, 120), 'El mínimo del contribuyente es, con carácter general, de 5.550 euros anuales', fontsize=9)
        with self.assertRaises(ValueError):
            manual_contribuyente(page)

    def test_manual_selector_rejects_income_threshold_and_nonannual(self):
        for text in ('Rentas del contribuyente de 5.550 euros anuales',
                     'El mínimo del contribuyente es, con carácter general, de 5.550 euros mensuales'):
            doc = e.flujo.pymupdf.open()
            page = doc.new_page()
            page.insert_text((30, 80), text, fontsize=9)
            with self.assertRaises(ValueError):
                manual_contribuyente(page)

    def test_reconciliation_never_matches_equal_numbers(self):
        a = {'file': 'a.ts', 'symbol': 'old', 'path': ['x'], 'value': '100',
             'years': [2020], 'territories': ['madrid'], 'unit': 'EUR', 'period': None}
        b = {**a, 'symbol': 'new'}
        self.assertEqual({r['status'] for r in reconcile([a], [b])}, {'new', 'retired'})

    def test_reconciliation_keeps_changed_dimensions(self):
        a = {'file': 'a.ts', 'symbol': 'a', 'path': ['x'], 'years': [2020],
             'territories': ['madrid'], 'unit': 'EUR', 'period': None}
        b = {**a, 'years': [2021], 'period': 'enero-julio'}
        row = reconcile([a], [b])[0]
        self.assertEqual(row['status'], 'scope-changed')
        self.assertEqual(row['changedDimensions'], ['years', 'period'])

    def test_reconciliation_rejects_duplicate_denominator(self):
        a = {'file': 'a.ts', 'symbol': 'a', 'path': []}
        with self.assertRaises(ValueError):
            reconcile([a, a], [a])

    def test_same_header_does_not_prove_another_column(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            doc = e.flujo.pymupdf.open()
            page = doc.new_page()
            page.insert_text((50, 50), "EUR")
            page.insert_text((50, 100), "12")
            page.insert_text((250, 100), "13")
            ref = e.flujo.put(root, doc.tobytes())
            cell = {"row": "0", "column": "a", "bbox": [49, 86, 80, 104], "unit": "EUR", "expression": None,
                    "unitEvidence": {"bbox": [49, 36, 80, 54], "literal": "EUR", "unit": "EUR", "relation": "column"}}
            a = {"code": "a", "year": 2020, "territory": "madrid", "document": ref, "page": 1, "cells": [cell]}
            b = deepcopy(a)
            b["code"] = "b"
            b["cells"][0]["bbox"] = [249, 86, 280, 104]
            with patch.object(e.flujo, 'evidence_unit', e.unit_evidence_cache(e.flujo.evidence_unit)):
                result = e.execute(ROOT, [a, b], {"tables": [a, b], "semantics": {}}, [], e.VerifiedStore([root]), {})
            self.assertEqual([c["code"] for c in result["comparison"]], ["a"])
            self.assertEqual([c["code"] for c in result["errors"]], ["b"])
            refused = deepcopy(a)
            refused['cells'][0]['unitEvidenceRejection'] = {'literal': 'legacy euros'}
            rejection = e.execute(ROOT, [refused], {'tables': [refused], 'semantics': {}}, [], e.VerifiedStore([root]), {})
            self.assertEqual(rejection['comparison'], [])
            self.assertIn('tabla rechazada', rejection['errors'][0]['error'])

    def test_unit_cache_checks_neighbour_columns(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            doc = e.flujo.pymupdf.open()
            page = doc.new_page()
            page.insert_text((50, 50), "EUR broad column")
            page.insert_text((50, 100), "12")
            page.insert_text((100, 100), "13")
            ref = e.flujo.put(root, doc.tobytes())
            cell = {"row": "0", "column": "a", "bbox": [49, 86, 80, 104], "unit": "EUR", "expression": None,
                    "unitEvidence": {"bbox": [49, 36, 160, 54], "literal": "EUR broad column", "unit": "EUR", "relation": "column"}}
            a = {"code": "a", "year": 2020, "territory": "madrid", "document": ref, "page": 1, "cells": [cell]}
            b = deepcopy(a)
            b["code"] = "b"
            b["cells"].append({"row": "0", "column": "b", "bbox": [99, 86, 120, 104], "unit": "EUR", "expression": None, "unitEvidence": None})
            with patch.object(e.flujo, 'evidence_unit', e.unit_evidence_cache(e.flujo.evidence_unit)):
                result = e.execute(ROOT, [a, b], {"tables": [a, b], "semantics": {}}, [], e.VerifiedStore([root]), {})
            self.assertEqual([c["code"] for c in result["comparison"]], ["a"])
            self.assertEqual([c["code"] for c in result["errors"]], ["b"])


if __name__ == "__main__":
    unittest.main()
