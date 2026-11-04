"""Pruebas ordinarias: solo PDF sintético y archivos temporales generados."""

import importlib.util
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "lote", ROOT / "tools/procedencia/datos/lotes/escalas-minimos-2019-2026/lote.py"
)
lote = importlib.util.module_from_spec(SPEC)
sys.modules["lote"] = lote
SPEC.loader.exec_module(lote)
f = lote.flujo


class Contract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.cas = Path(self.temp.name)
        doc = f.pymupdf.open()
        page = doc.new_page()
        page.insert_text((50, 50), "Base liquidable hasta euros", fontsize=10)
        page.insert_text((50, 100), "1.234,56", fontsize=10)
        ref = f.put(self.cas, doc.tobytes(), "application/pdf")
        self.store = f.Store([self.cas])
        self.spec = {
            "row": "0",
            "column": "0",
            "bbox": [48, 86, 110, 104],
            "unit": "EUR",
            "expression": None,
            "unitEvidence": {
                "bbox": [48, 36, 190, 54],
                "unit": "EUR",
                "literal": "Base liquidable hasta euros",
            },
        }
        self.table = {
            "code": "synthetic",
            "year": 2020,
            "territory": "andalucia",
            "document": ref,
            "page": 1,
            "cells": [self.spec],
        }
        self.cells = f.pdf_table(self.store, self.table)

    def compare(self, cells=None, tables=None, items=None):
        return f.compare(
            tables or [self.table],
            self.cells if cells is None else cells,
            items or [],
            obligations=[self.table],
            store=self.store,
        )

    def test_decimal(self):
        self.assertEqual(self.cells[0]["normalized"], "1234.56")
        self.assertEqual(
            self.compare()[0]["reason"], "no-binding-in-reviewed-inventory"
        )

    def test_omission(self):
        with self.assertRaisesRegex(ValueError, "Cobertura"):
            self.compare(cells=[])

    def test_unit_mutation(self):
        with self.assertRaisesRegex(ValueError, "unit"):
            self.compare(cells=[{**self.cells[0], "unit": "percent"}])

    def test_year(self):
        with self.assertRaisesRegex(ValueError, "Ámbito"):
            self.compare(cells=[{**self.cells[0], "year": 2021}])

    def test_territory(self):
        with self.assertRaisesRegex(ValueError, "Ámbito"):
            self.compare(cells=[{**self.cells[0], "territory": "madrid"}])

    def test_binding_not_value(self):
        binding = {"file": "synthetic.ts", "symbol": "X", "path": ["valor"]}
        item = {
            "layer": "effective",
            "source": {"file": "synthetic.ts"},
            "symbol": "X",
            "path": '["valor"]',
            "value": "1234.56",
        }
        self.assertEqual(str(f.engine_value([item], binding)), "1234.56")
        with self.assertRaisesRegex(ValueError, "Binding"):
            f.engine_value([item], {**binding, "symbol": "Y"})

    def test_unit_required(self):
        self.spec.pop("unitEvidence")
        self.assertEqual(self.compare()[0]["reason"], "source-unit-unproven")

    def test_signs(self):
        with self.assertRaises(ValueError):
            f.number("- 1.234,56", "EUR")
        self.assertEqual(f.physical_number("- 1.234,56", {'unit': 'EUR', 'bbox': [0, 0, 100, 20]},
                                          [[1, 1, 4, 10, '-'], [5, 1, 60, 10, '1.234,56']]), '-1234.56')
        with self.assertRaises(ValueError):
            f.number("−1.234,56", "EUR")
        with self.assertRaises(ValueError):
            f.number("18.90", "percent")

    def test_empty_and_absent(self):
        with self.assertRaises(ValueError):
            f.number("", "EUR")
        self.assertEqual(f.number("—", "EUR"), "absent")

    def test_header_geometry_and_percent_suffix(self):
        sys.path.insert(
            0, str(ROOT / "tools/procedencia/datos/lotes/escalas-minimos-2019-2026")
        )
        from geometria import sections

        doc = f.pymupdf.open()
        page = doc.new_page()
        for x, text in [
            (50, "Base liquidable"),
            (200, "Cuota integra"),
            (330, "Resto base"),
            (500, "Tipo aplicable"),
        ]:
            page.insert_text((x, 50), text, fontsize=9)
        for x, text in [
            (140, "0,00"),
            (260, "0,00"),
            (400, "12.450,00"),
            (500, "9,50%"),
        ]:
            page.insert_text((x, 100), text, fontsize=9)
        found = sections(page)
        self.assertEqual(len(found), 1)
        self.assertEqual(len(found[0]["rows"]), 1)
        self.assertEqual(lote.literal(page, found[0]["rows"][0][3]), "9,50%")
        with self.assertRaises(ValueError):
            f.number(lote.literal(page, found[0]["rows"][0][3]), "percent")

    def test_unequal_rows_reject_whole_table(self):
        entry = {**self.table, "kind": "scale", "columnRows": [1, 2, 1, 1]}
        result = lote.compare_registry({"tables": [entry]}, self.store, [], ROOT)
        self.assertEqual(result["comparison"], [])
        self.assertEqual(result["rejected"][0]["reason"], "unequal-column-row-geometry")


if __name__ == "__main__":
    unittest.main()
