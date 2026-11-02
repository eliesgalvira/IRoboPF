"""Controles RP07 independientes; fixtures sintéticos, sin CAS privado ni Git."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[4]
SPEC = importlib.util.spec_from_file_location("geometry_flow", ROOT / "tools/procedencia/datos/flujo.py")
assert SPEC is not None and SPEC.loader is not None
f = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(f)


def table(ref, bbox):
    return {"code": "G", "document": ref, "page": 1, "year": 2025, "territory": "synthetic",
            "cells": [{"row": "0", "column": "a", "bbox": bbox, "unit": "EUR"}]}


class Geometry(unittest.TestCase):
    def test_real_fonts_near_signs_and_valid_controls(self):
        # Narrower/wider glyphs; the external sign shares the number baseline.
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for font in ("cour", "tiro", "hebo"):
                for size in (5, 9, 15, 23):
                    for sign in ("-", "+"):
                        for side in ("left", "right", "row", "column"):
                            with self.subTest(font=font, size=size, sign=sign, side=side):
                                doc = f.pymupdf.open()
                                page = doc.new_page()
                                page.insert_text((100, 100), "1.234,56", fontname=font, fontsize=11)
                                chosen = page.get_text("words", flags=0)[0]
                                width = f.pymupdf.get_text_length(sign, fontname=font, fontsize=size)
                                x = chosen[0] - width - 5 if side == "left" else chosen[2] + 5
                                y = 150 if side == "row" else 100
                                if side == "column":
                                    x = chosen[2] + 40
                                page.insert_text((x, y), sign, fontname=font, fontsize=size)
                                ref = f.put(root, doc.tobytes(), "application/pdf")
                                doc.close()
                                bbox = [chosen[0] - .2, chosen[1] - .2, chosen[2] + .2, chosen[3] + .2]
                                spec = table(ref, bbox)
                                if side in ("left", "right"):
                                    with self.assertRaisesRegex(ValueError, "Signo próximo"):
                                        f.pdf_table(f.Store([root]), spec)
                                else:
                                    cell = f.pdf_table(f.Store([root]), spec)[0]
                                    self.assertEqual((cell["literal"], cell["normalized"]), ("1.234,56", "1234.56"))

    def test_real_included_separate_signs(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for sign, expected in (("-", "-1234.56"), ("+", "1234.56")):
                with self.subTest(sign=sign):
                    doc = f.pymupdf.open()
                    page = doc.new_page()
                    page.insert_text((100, 100), sign, fontname="cour", fontsize=9)
                    page.insert_text((114, 100), "1.234,56", fontname="tiro", fontsize=11)
                    ref = f.put(root, doc.tobytes(), "application/pdf")
                    doc.close()
                    cell = f.pdf_table(f.Store([root]), table(ref, [98, 80, 170, 105]))[0]
                    self.assertEqual(cell["literal"], sign + " 1.234,56")
                    self.assertEqual(cell["normalized"], expected)

    def test_exact_boundaries_and_every_recognized_glyph(self):
        # Exact synthetic word boxes isolate inclusive/exclusive thresholds.
        chosen = (50., 40., 70., 50., "12", 0, 0, 0)
        spec = table({}, [49, 39, 71, 51])
        for glyph in ("+", "-", "−", "–", "—"):
            for gap in (0., 11.999, 12., 12.001):
                for overlap in (0., 4.999, 5., 5.001, 10.):
                    for side in ("left", "right"):
                        with self.subTest(glyph=glyph, gap=gap, overlap=overlap, side=side):
                            x0, x1 = (45-gap, 50-gap) if side == "left" else (70+gap, 75+gap)
                            word = (x0, 50-overlap, x1, 60-overlap, glyph, 1, 0, 0)
                            page = FakePage([chosen, word])
                            with patch.object(f.pymupdf, "open", return_value=FakeDocument(page)), patch.object(f, "extract", return_value="12"), patch.object(f, "geometry", return_value={}), patch.object(f, "selectors", return_value=[]):
                                if gap < 12 and overlap >= 5:
                                    with self.assertRaisesRegex(ValueError, "Signo próximo"):
                                        f.pdf_table(FakeStore(), spec)
                                else:
                                    self.assertEqual(f.pdf_table(FakeStore(), spec)[0]["normalized"], "12")

    def test_per_word_and_large_partial_sign(self):
        # A small chosen word in a tall overall selection must still be guarded.
        selected = [(50., 40., 70., 50., "12", 0, 0, 0), (50., 80., 70., 90., "34", 1, 0, 0)]
        sign = (40., 35., 45., 55., "-", 2, 0, 0)
        page = FakePage([*selected, sign])
        with patch.object(f.pymupdf, "open", return_value=FakeDocument(page)), patch.object(f, "extract", return_value="12 34"):
            with self.assertRaisesRegex(ValueError, "Signo próximo"):
                f.pdf_table(FakeStore(), table({}, [49, 39, 71, 91]))


class FakeStore:
    def read(self, ref):
        return b"synthetic"


class FakePage:
    def __init__(self, words):
        self.words = words

    def get_text(self, *args, **kwargs):
        return self.words


class FakeDocument:
    def __init__(self, page):
        self.page = page

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def __getitem__(self, index):
        return self.page


if __name__ == "__main__":
    unittest.main()
