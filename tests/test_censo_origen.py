"""Distinguir bytes de origen, documento y recorte sin certificar su autenticidad."""

import hashlib
import json
import unittest

from test_censo_clasificacion import COLLECTOR, ROOT, URL


class OriginTests(unittest.TestCase):
    def classify(self, key, row, pointer="/citations/0"):
        return COLLECTOR.classify("datos.json", pointer, row, key)[0]

    def test_document_inside_crop_is_not_the_crop(self):
        self.assertEqual(
            self.classify("documentSha256", {"url": URL}, "/facsimiles/0"),
            "original-oficial",
        )

    def test_unlocated_document_inside_crop_remains_documentary(self):
        self.assertEqual(
            self.classify("documentSha256", {}, "/facsimiles/0"),
            "desconocido-documental",
        )

    def test_pdf_origin_is_not_software_or_authenticated_by_its_url(self):
        self.assertEqual(
            self.classify(
                "sourceSha256",
                {
                    "url": URL,
                    "mimeType": "application/pdf",
                    "path": "fuentes/original.pdf",
                },
            ),
            "desconocido-documental",
        )

    def test_origin_without_context_is_unknown(self):
        self.assertEqual(self.classify("sourceSha256", {}), "desconocido")

    def test_code_path_identifies_contextual_software(self):
        self.assertEqual(
            self.classify("sourceSha256", {"path": "lib/rentas.ts"}),
            "fuente-software",
        )

    def test_explicit_origin_precedes_destination(self):
        self.assertEqual(
            self.classify(
                "sourceSha256", {"source": "fichas.json", "path": "lib/salida.ts"}
            ),
            "desconocido",
        )

    def test_conflicting_origin_paths_are_unknown(self):
        self.assertEqual(
            self.classify(
                "sourceSha256", {"source": "lib/uno.ts", "sourcePath": "original.pdf"}
            ),
            "desconocido",
        )

    def test_code_path_and_pdf_type_are_ambiguous(self):
        self.assertEqual(
            self.classify(
                "sourceSha256", {"path": "lib/rentas.ts", "mimeType": "application/pdf"}
            ),
            "desconocido",
        )

    def test_invalid_explicit_origin_does_not_fall_back_to_destination(self):
        self.assertEqual(
            self.classify("sourceSha256", {"source": None, "path": "lib/salida.ts"}),
            "desconocido",
        )

    def test_origin_key_normalization(self):
        self.assertEqual(self.classify("SOURCE_SHA256", {}), "desconocido")

    def test_real_editorial_origins_are_not_programs(self):
        path = (
            ROOT / "docs/procedencia/editorial/flujo-escalas-r21-sol/verificacion.json"
        )
        rows = json.loads(path.read_bytes())["editions"]
        self.assertEqual(len(rows), 4)
        for row in rows:
            self.assertEqual(
                hashlib.sha256((ROOT / row["source"]).read_bytes()).hexdigest(),
                row["sourceSha256"],
            )
            self.assertEqual(
                self.classify("sourceSha256", row, "/editions/0"), "desconocido"
            )

    def test_generic_hash_in_crop_retains_its_context(self):
        self.assertEqual(
            self.classify("sha256", {"url": URL}, "/facsimiles/0"), "facsimil-receta"
        )

    def test_documentary_origin_field_is_not_a_source_code_substring(self):
        self.assertEqual(
            self.classify("sourceDocumentSha256", {"url": URL}, "/facsimiles/0"),
            "desconocido-documental",
        )

    def test_resource_is_not_a_software_contract(self):
        self.assertEqual(self.classify("resourceSha256", {"url": URL}), "desconocido")

    def test_observation_keeps_the_origin_used_to_classify(self):
        row = {
            "source": "fichas.json",
            "path": "lib/salida.ts",
            "sourceSha256": "a" * 64,
        }
        observation = next(COLLECTOR.observations(row, "datos.json"))
        self.assertEqual(observation["context"].get("source"), "fichas.json")


if __name__ == "__main__":
    unittest.main()
