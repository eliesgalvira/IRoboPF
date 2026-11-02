"""Discriminantes de los defectos documentales, sin CAS, red o historial Git."""
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs/procedencia/deducciones-2025"


class CorreccionesDocumentales(unittest.TestCase):
    def setUp(self):
        self.culture = DOCS / "correcciones/g-cultura-lengua"
        self.cites = {
            c["id"]: c
            for c in json.loads((self.culture / "citas.json").read_text())["citas"]
        }

    def test_recuento_de_municipios_coincide_con_el_anexo(self):
        municipalities = json.loads(
            (DOCS / "revisiones/d-clm-remisiones/municipios.json").read_text()
        )["municipios"]
        self.assertEqual(len({m["ine"] for m in municipalities}), 25)
        self.assertEqual(
            {p: sum(m["provincia"] == p for m in municipalities)
             for p in {m["provincia"] for m in municipalities}},
            {"Albacete": 5, "Ciudad Real": 4, "Toledo": 16},
        )
        for name in ["INFORME.md", "matriz.json", "propuestas-por-codigo.json"]:
            with self.subTest(archivo=name):
                text = (DOCS / "correcciones/d-clm-remisiones" / name).read_text()
                self.assertFalse("anexo26 municipios" in text, name)
                self.assertTrue("anexo25 municipios" in text, name)

    def test_gasto_propio_se_cita_en_su_seccion_y_no_en_el_indice(self):
        text = self.cites["gl-71"]["literal"]
        self.assertIn("cantidades destinadas por las personas titulares", text)
        self.assertIn("primeros 250 euros", text)
        self.assertNotIn("Por donaciones destinadas al fomento", text)
        self.assertIn("transferencia bancaria", self.cites["gl-72"]["literal"])

    def test_abonos_incluye_importe_renta_y_pago_sin_vehiculos(self):
        self.assertIn("Art. 4.Uno.x)", self.cites["gl-77"]["literal"])
        text = self.cites["gl-78"]["literal"]
        for fragment in ["El 21 por 100", "165 euros", "50.000", "transferencia bancaria"]:
            self.assertIn(fragment, text)
        self.assertNotIn("Por adquisición de vehículos", text)

    def test_abonos_no_se_fundamenta_en_sucesiones(self):
        report = (self.culture / "INFORME.md").read_text()
        self.assertNotIn("Abonos: Ley9/2014 art30", report)
        self.assertIn("disposición adicional decimosexta", report)
        # La fuente equivocadamente atribuida sigue conservada y se identifica.
        self.assertIn("Impuesto de Sucesiones", self.cites["gl-67"]["literal"])

    def test_citas_del_manual_tienen_posicion_de_pagina(self):
        for citation in self.cites.values():
            if citation["fuente"] != "manual2025":
                continue
            with self.subTest(cita=citation["id"]):
                self.assertGreaterEqual(citation.get("paginaFisica", 0), 577)
                self.assertEqual(citation["fin"] - citation["inicio"], len(citation["literal"]))
                self.assertGreater(citation["inicio"], 1_000_000)

    def test_no_se_traslada_certificado_de_donacion_al_gasto_propio(self):
        proposals = json.loads((self.culture / "propuestas-por-codigo.json").read_text())["propuestas"]
        own = next(p for p in proposals if p["codigo"] == "valenciana_conservacion_patrimonio_cultural_titulares")
        gifts = next(p for p in proposals if p["codigo"] == "valenciana_donaciones_bienes_patrimonio_cultural")
        self.assertIn("gl-cert-donativos-586", gifts["citas"])
        self.assertNotIn("gl-cert-donativos-586", own["citas"])


if __name__ == "__main__":
    unittest.main()
