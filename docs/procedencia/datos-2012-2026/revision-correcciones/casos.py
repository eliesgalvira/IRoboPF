"""Adversos independientes. Sin originales privados ni historial Git."""
import copy
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[4]
SPEC = importlib.util.spec_from_file_location("review_flow", ROOT / "tools/procedencia/datos/flujo.py")
assert SPEC is not None and SPEC.loader is not None
f = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(f)


class Guards(unittest.TestCase):
    def test_registry_all_omissions_and_coherent_unit_changes(self):
        import json
        registry = json.loads((ROOT / "docs/procedencia/datos-2012-2026/obligaciones.json").read_bytes())
        tables = json.loads((ROOT / "docs/procedencia/datos-2012-2026/tablas.json").read_bytes())
        f.validate_obligations(tables, registry["tables"])
        for ti, table in enumerate(tables):
            for ci, _ in enumerate(table["cells"]):
                omitted = copy.deepcopy(tables)
                omitted[ti]["cells"].pop(ci)
                with self.assertRaises(ValueError):
                    f.validate_obligations(omitted, registry["tables"])
                changed = copy.deepcopy(tables)
                changed[ti]["cells"][ci]["unit"] = "proportion"
                with self.assertRaises(ValueError):
                    f.validate_obligations(changed, registry["tables"])

    def test_mixed_units_and_nested_operations(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "source.ts").write_text("EUR amount; fraction rate")
            bindings = [{"binding": {"file": "source.ts", "symbol": s, "path": []}} for s in ["amount", "rate"]]
            semantics = {f.encode(b["binding"]).decode().strip(): {"unit": u, "quote": q,
                "sourceSha256": f.digest((root / "source.ts").read_bytes())}
                for b, u, q in zip(bindings, ["EUR", "proportion"], ["EUR amount", "fraction rate"], strict=True)}
            for op in ["sum", "subtract"]:
                self.assertIsNone(f.expression_unit({"op": op, "args": bindings}, semantics, root))
            rate = {"op": "percent", "args": [bindings[1]]}
            self.assertEqual(f.expression_unit(rate, semantics, root), "percent")
            self.assertIsNone(f.expression_unit({"op": "percent", "args": [rate]}, semantics, root))
            self.assertIsNone(f.expression_unit({"op": "sum", "args": []}, semantics, root))

    def test_repeated_json_values_escaped_keys(self):
        text = '{"a/b":{"~x":12},"Data":[{"Valor":12},{"Valor":13},{"Valor":12}]}'
        positions = f.json_positions(text)
        pointers = ["/a~1b/~0x", "/Data/0/Valor", "/Data/2/Valor"]
        self.assertEqual(len({positions[p] for p in pointers}), 3)
        for pointer in pointers:
            self.assertEqual(text[slice(*positions[pointer])], "12")

    def test_contained_signs_preserved_and_distant_signs_allowed(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for sign in ["-", "+"]:
                doc = f.pymupdf.open()
                page = doc.new_page()
                page.insert_text((50, 50), sign + "12")
                page.insert_text((150, 50), "-")
                ref = f.put(root, doc.tobytes(), "application/pdf")
                doc.close()
                table = {"code": "S", "document": ref, "page": 1, "year": 2025, "territory": "S",
                         "cells": [{"row": "0", "column": "a", "bbox": [48, 35, 80, 54], "unit": "EUR"}]}
                cell = f.pdf_table(f.Store([root]), table)[0]
                self.assertEqual(cell["normalized"], "-12" if sign == "-" else "12")


if __name__ == "__main__":
    unittest.main()
