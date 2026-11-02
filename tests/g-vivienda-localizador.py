"""Regresión documental de RV01, sin red, CAS ni objetos Git históricos."""
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs/procedencia/deducciones-2025/correcciones/g-vivienda"


class LocalizadorArticulo60(unittest.TestCase):
    def setUp(self):
        citations = json.loads((FOLDER / "citas.json").read_text())["citas"]
        self.citation = next(item for item in citations if item["id"] == "gv-31")

    def test_cita_contiene_la_regla_material_completa(self):
        text = self.citation["literal"]
        self.assertIn("Único. Se modifica la letra c) del apartado 2 del anexo II", text)
        self.assertIn("ocupación máxima", text)
        self.assertIn("20 %", text)
        self.assertIn("25 %", text)
        self.assertIn("retorno automático", text)
        self.assertIn("seguridad contra incendios", text)

    def test_delimita_el_articulo_sin_incluir_el_siguiente(self):
        citation = self.citation
        self.assertEqual(citation["pagina"], 87)
        self.assertEqual(citation["paginas"], [87, 88])
        self.assertTrue(citation["literal"].startswith("Artículo 60. Modificación"))
        self.assertNotIn("Artículo 61.", citation["literal"])
        self.assertTrue(citation["literal"].endswith("[…].»\n"))
        self.assertEqual(citation["fin"] - citation["inicio"], len(citation["literal"]))

    def test_conserva_documento_y_remision(self):
        sources = json.loads((FOLDER / "fuentes.json").read_text())["documentos"]
        source = next(item for item in sources if item["id"] == "dl14-original")
        self.assertEqual(self.citation["sha256"], source["sha256"])
        self.assertEqual(self.citation["fuente"], source["id"])
        chains = json.loads((FOLDER / "cadenas.json").read_text())
        chain = next(item for item in chains if item["id"] == "cadena-31")
        self.assertEqual(chain["citas"], ["gv-31"])
        self.assertEqual(chain["efecto"], "2025-12-30")


if __name__ == "__main__":
    unittest.main()
