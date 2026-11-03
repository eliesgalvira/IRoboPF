"""Regresiones pequeñas de geometría y adaptadores; sin reconstruir el censo."""
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

from test_flujo import f

ROOT = Path(__file__).resolve().parents[4]


class ContextTests(unittest.TestCase):
    def unit(self, relation, header_position, cell_box, proof_box):
        doc = f.pymupdf.open()
        page = doc.new_page()
        page.insert_text(header_position, "Tasa (%)")
        raw = doc.tobytes()
        doc.close()

        class Memory:
            def read(self, ref):
                return raw

        cell = {"row": "1", "column": "rate", "bbox": cell_box, "unit": "percent",
                "unitEvidence": {"literal": "Tasa (%)", "unit": "percent",
                                 "relation": relation, "bbox": proof_box}}
        table = {"document": {"sha256": f.digest(raw), "size": len(raw)},
                 "page": 1, "cells": [cell]}
        return f.evidence_unit(Memory(), table, cell)

    def test_legitimate_column_and_padded_selector(self):
        for box in ([15, 15, 80, 35], [0, 0, 300, 40]):
            with self.subTest(box=box):
                self.assertTrue(self.unit("column", (20, 30), [15, 50, 80, 70], box))

    def test_foreign_column_and_false_adjacency(self):
        for relation, position, cell, box in [
            ("column", (220, 30), [15, 50, 80, 70], [15, 15, 300, 35]),
            ("adjacent", (220, 65), [15, 50, 80, 70], [81, 50, 300, 70]),
        ]:
            with self.subTest(relation=relation), self.assertRaisesRegex(ValueError, "Cabecera ajena"):
                self.unit(relation, position, cell, box)
        self.assertTrue(self.unit("adjacent", (90, 65), [15, 50, 80, 70], [85, 50, 150, 70]))

    def test_identity_subset(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / "identity.ts"
            for fn, accepted in [("(x) => x", True), ("async (x) => x", False),
                                 ("(...x) => x", False), ("(x = {}) => x", False),
                                 ("(x) => ({a: '99'})", False)]:
                with self.subTest(fn=fn):
                    source.write_text(f"const id = {fn}; export const DATA = id({{a: '12'}})")
                    result = subprocess.run(
                        ["bun", "--no-install", str(ROOT / "tools/procedencia/datos/binding-position.mjs"),
                         str(source), "DATA", '["a"]'], capture_output=True, text=True, timeout=15)
                    self.assertEqual(result.returncode == 0, accepted, result.stderr)
                    if accepted:
                        self.assertEqual(json.loads(result.stdout)["quote"], "'12'")


if __name__ == "__main__":
    unittest.main()
