"""Rojo RP07: signos cercanos de otra fuente o con desplazamiento vertical."""
from pathlib import Path
import tempfile
import unittest
from casos import f


class SignGeometry(unittest.TestCase):
    def test_external_signs_same_baseline_different_font(self):
        self.check_signs(8, 50)

    def test_external_signs_overlapping_vertical_boxes(self):
        self.check_signs(11, 53)

    def check_signs(self, fontsize, baseline):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for x in [40, 66]:
                for sign in ["-", "+"]:
                    with self.subTest(x=x, sign=sign, fontsize=fontsize, baseline=baseline):
                        doc = f.pymupdf.open()
                        page = doc.new_page()
                        page.insert_text((50, 50), "12", fontsize=11)
                        page.insert_text((x, baseline), sign, fontsize=fontsize)
                        ref = f.put(root, doc.tobytes(), "application/pdf")
                        doc.close()
                        table = {"code": "S", "document": ref, "page": 1, "year": 2025, "territory": "S",
                                 "cells": [{"row": "0", "column": "a", "bbox": [48, 35, 64, 54], "unit": "EUR"}]}
                        with self.assertRaisesRegex(ValueError, "Signo"):
                            f.pdf_table(f.Store([root]), table)


if __name__ == "__main__":
    unittest.main()
