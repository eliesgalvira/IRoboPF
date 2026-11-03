"""Contextos sintéticos con controles positivos y negativos independientes."""
import copy
import unittest

import enlaces


class ContextTest(unittest.TestCase):
    def fixture(self):
        doc = enlaces.flujo.pymupdf.open()
        page = doc.new_page(width=1000)
        lines = [
            ((20, 25), "Bases de cotización: del 1 de enero de 2024 al 31 de julio de 2024"),
            ((150, 60), "Base máxima euros/mes"),
            ((20, 100), "1"), ((170, 100), "1.000,00"),
        ]
        for pos, text in lines:
            page.insert_text(pos, text)

        def proof(text):
            box = page.search_for(text)[0]
            return {"page": 1, "literal": text,
                    "bbox": [box.x0-.01, box.y0-.01, box.x1+.01, box.y1+.01]}

        spec = {"row": "1", "column": "maximum", "unit": "EUR", "periodUnit": "EUR/month",
                "bbox": proof("1.000,00")["bbox"], "columnEvidence": proof(lines[1][1]),
                "rowEvidence": proof("1")}
        # search_for('1') también encuentra dígitos de fechas: selector de la fila física.
        word = next(w for w in page.get_text("words") if w[4] == "1" and w[1] > 80)
        spec["rowEvidence"]["bbox"] = [word[0]-.01, word[1]-.01, word[2]+.01, word[3]+.01]
        raw = doc.tobytes()
        table = {"code": "synthetic", "year": 2024, "territory": "ES", "page": 1,
                 "periodEvidence": proof(lines[0][1]),
                 "document": {"sha256": enlaces.flujo.digest(raw), "size": len(raw)}, "cells": [spec]}
        doc.close()

        class Memory:
            def read(self, ref):
                return raw

        return Memory(), {"bases": [table], "rawTables": []}

    def test_positive_partial_period_preserved(self):
        store, config = self.fixture()
        cells, ambiguous = enlaces.bases(store, config)
        self.assertEqual(ambiguous, [])
        self.assertEqual(cells[0]["normalized"], "1000.00")
        self.assertEqual(cells[0]["column"], "maximum")
        self.assertEqual(cells[0]["period"], {"from": "2024-01", "through": "2024-07"})
        self.assertEqual(cells[0]["scopeStatus"], "context-evidenced")

    def test_missing_context_does_not_inherit_labels(self):
        store, config = self.fixture()
        for field in ("periodEvidence", "columnEvidence", "rowEvidence"):
            c = copy.deepcopy(config)
            table = c["bases"][0]
            (table if field == "periodEvidence" else table["cells"][0]).pop(field)
            with self.subTest(field=field):
                cells, _ = enlaces.bases(store, c)
                self.assertEqual(cells[0]["scopeStatus"], "unverified")
                self.assertIsNone(cells[0]["period"])
                self.assertIsNone(cells[0]["year"])
                self.assertIsNone(cells[0]["column"])
                self.assertEqual(cells[0]["candidateScope"]["year"], 2024)

    def test_relabelled_column_year_unit_and_group_rejected(self):
        store, config = self.fixture()
        for field, value in (("year", 2025), ("column", "minimum"),
                             ("periodUnit", "EUR/day"), ("row", "2")):
            c = copy.deepcopy(config)
            table = c["bases"][0]
            (table if field == "year" else table["cells"][0])[field] = value
            with self.subTest(field=field), self.assertRaises(ValueError):
                enlaces.bases(store, c)

    def test_forged_period_literal_rejected(self):
        store, config = self.fixture()
        proof = config["bases"][0]["periodEvidence"]
        proof["literal"] = proof["literal"].replace("julio", "diciembre")
        with self.assertRaisesRegex(ValueError, "Contexto no reproducible"):
            enlaces.bases(store, config)

    def test_other_table_period_cannot_be_transplanted(self):
        store, config = self.fixture()
        table = config["bases"][0]
        with enlaces.flujo.pymupdf.open(stream=store.read(None), filetype="pdf") as doc:
            doc[0].insert_text((20, 40), "Bases de cotización: del 1 de agosto de 2024 al 31 de diciembre de 2024")
            raw = doc.tobytes()

        class Changed:
            def read(self, ref):
                return raw

        table["document"] = {"sha256": enlaces.flujo.digest(raw), "size": len(raw)}
        with self.assertRaisesRegex(ValueError, "cabecera temporal inmediata"):
            enlaces.bases(Changed(), config)

    def test_open_period_does_not_acquire_december_end(self):
        doc = enlaces.flujo.pymupdf.open()
        page = doc.new_page()
        literal = "Bases de cotización: desde el 1 de enero de 2024"
        page.insert_text((20, 30), literal)
        proof = {"page": 1, "bbox": [10, 10, 550, 40], "literal": literal}
        try:
            with self.assertRaisesRegex(ValueError, "Período explícito"):
                enlaces.contexto.period(doc, proof, "Bases de cotización")
        finally:
            doc.close()

    def test_cargos_require_worker_literal(self):
        prefixes = [
            "Formación Profesional: el 0,70 por ciento, del que el 0,60 por ciento será a cargo de la empresa y el 0,10 por ciento",
            "mecanismo de equidad intergeneracional: 0,70 por ciento, del que el 0,58 por ciento a cargo del empleador y el 0,12 por ciento",
            "a) El 0,92 por ciento, siendo el 0,77 por ciento a cargo de la empresa y el 0,15 por ciento",
        ]
        for text in prefixes:
            for suffix, valid in ((" a cargo del trabajador.", True),
                                  (" a cargo de la empresa.", False), (".", False),
                                  (". Otra disposición a cargo del trabajador.", False)):
                with self.subTest(text=text, suffix=suffix):
                    rows = enlaces.semantic_rates(text + suffix)
                    self.assertEqual(any(r["party"] == "trabajador" for r in rows), valid)

    def test_rate_year_and_period_are_separate_evidence(self):
        doc = enlaces.flujo.pymupdf.open()
        page = doc.new_page(width=1000)
        page.insert_text((20, 30), "Ejercicio 2024")
        label = "Tipos de cotización: del 1 de enero de 2024 al 31 de julio de 2024"
        page.insert_text((20, 60), label)
        page.insert_text((20, 90), "Formación Profesional: el 0,70 por ciento, del que el 0,60 por ciento")
        page.insert_text((20, 110), "será a cargo de la empresa y el 0,10 por ciento a cargo del trabajador.")
        box = page.search_for(label)[0]
        proof = {"page": 1, "literal": label, "bbox": [box.x0-.01, box.y0-.01, box.x1+.01, box.y1+.01]}
        raw = doc.tobytes()
        doc.close()

        class Memory:
            def read(self, ref):
                return raw

        ref = {"sha256": enlaces.flujo.digest(raw), "size": len(raw)}
        without = enlaces.extract_rates(Memory(), ref, 2024)
        self.assertTrue(without)
        self.assertTrue(all(x["period"] is None for x in without))
        rows = enlaces.extract_rates(Memory(), ref, 2024, proof)
        self.assertTrue(all(x["period"]["through"] == "2024-07" for x in rows))
        with self.assertRaisesRegex(ValueError, "Año solicitado"):
            enlaces.extract_rates(Memory(), ref, 2025, proof)

    def test_document_title_year_ignores_previous_budget_in_preamble(self):
        with enlaces.flujo.pymupdf.open() as doc:
            page = doc.new_page()
            lines = [
                "Orden PJC/51/2024, por la que se desarrollan las normas",
                "legales de cotización a la Seguridad Social para el",
                "ejercicio 2024.",
                "Se prorrogan los presupuestos para el ejercicio 2023.",
            ]
            for i, line in enumerate(lines):
                page.insert_text((20, 30 + i*20), line)
            self.assertEqual(enlaces.contexto.year(doc), 2024)
            page.insert_text((20, 150), "Orden XYZ/1/2025, normas legales de cotización")
            page.insert_text((20, 170), "para el ejercicio 2025.")
            with self.assertRaisesRegex(ValueError, "ambiguo"):
                enlaces.contexto.year(doc)


if __name__ == "__main__":
    unittest.main()
