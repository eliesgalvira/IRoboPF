"""Una URL vecina no cambia la clase de una huella tipada."""

import importlib.util
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/procedencia/preservacion-v5-sol"
sys.path.insert(0, str(SOURCE))
SPEC = importlib.util.spec_from_file_location(
    "censo_clasificacion", SOURCE / "recolector.py"
)
assert SPEC is not None and SPEC.loader is not None
COLLECTOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(COLLECTOR)
URL = "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764"


class ClassificationTests(unittest.TestCase):
    def classify(self, key, *, url=URL, filename="datos.json"):
        return COLLECTOR.classify(filename, "/citations/0", {"url": url}, key)[0]

    def test_selection_is_not_the_adjacent_document(self):
        self.assertEqual(self.classify("selectionSha256"), "seleccion-cita")
        self.assertEqual(self.classify("documentSha256"), "original-oficial")

    def test_selection_without_url_has_same_class(self):
        self.assertEqual(self.classify("selectionSha256", url=""), "seleccion-cita")

    def test_key_spelling_is_normalized(self):
        self.assertEqual(self.classify("SELECTION_SHA256"), "seleccion-cita")

    def test_text_digest_is_not_original(self):
        self.assertEqual(self.classify("quoteSha256"), "texto-extraido")

    def test_software_digest_is_not_original(self):
        self.assertEqual(self.classify("softwareHash"), "fuente-software")
        self.assertEqual(self.classify("fileSha256"), "fuente-software")

    def test_unknown_field_does_not_inherit_officiality(self):
        self.assertEqual(self.classify("unclassifiedSha256"), "desconocido")

    def test_generic_acquisition_contract_is_preserved(self):
        self.assertEqual(self.classify("sha256"), "original-oficial")
        archived = "https://web.archive.org/web/20150101000000id_/http://www.agenciatributaria.es/static_files/AEAT/algoritmo.pdf"
        self.assertEqual(
            self.classify("sha256", url=archived), "captura-secundaria-URL-oficial"
        )

    def test_fixture_is_not_promoted(self):
        self.assertEqual(
            self.classify("selectionSha256", filename="fixtures/datos.json"),
            "fixture-sintetico",
        )

    def test_crop_and_unlocated_document_keep_their_contract(self):
        self.assertEqual(self.classify("cropSha256"), "facsimil-receta")
        self.assertEqual(
            self.classify("documentSha256", url=""), "desconocido-documental"
        )

    def test_adjacent_hashes_yield_two_distinct_observations(self):
        data = {
            "citations": [
                {"documentSha256": "a" * 64, "selectionSha256": "b" * 64, "url": URL}
            ]
        }
        found = {
            x["pointer"]: x["kind"] for x in COLLECTOR.observations(data, "datos.json")
        }
        self.assertEqual(
            found,
            {
                "/citations/0/documentSha256": "original-oficial",
                "/citations/0/selectionSha256": "seleccion-cita",
            },
        )


if __name__ == "__main__":
    unittest.main()
