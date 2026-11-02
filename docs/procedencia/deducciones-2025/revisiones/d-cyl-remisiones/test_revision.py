"""Controles del dictamen candidato; no calculan ni aceptan una liquidación."""
import json
from pathlib import Path
import unittest

FOLDER = Path(__file__).resolve().parent


class RevisionIndependiente(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((FOLDER / "dictamenes.json").read_text())
        cls.rows = {row["codigo"]: row for row in cls.data["deducciones"]}

    def test_cobertura_y_reservas_delimitadas(self):
        self.assertEqual(len(self.rows), 17)
        self.assertFalse(self.data["aceptacionGlobal"])
        self.assertEqual(
            {code for code, row in self.rows.items() if row["decision"] == "reserva_delimitada"},
            {"cyl_fomento_emprendimiento", "cyl_recuperacion_patrimonio_historico_cultural_natural", "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad"},
        )

    def test_cada_campo_y_discriminante_tiene_trazabilidad(self):
        for row in self.rows.values():
            self.assertTrue(row["condiciones"])
            self.assertTrue(row["discriminante"])
            self.assertTrue(row["paginasManual"])
            self.assertTrue(row["citasRefinadas"])
            for field in row["camposRevisados"]:
                self.assertEqual(len(field["sha256Valor"]), 64)
            for cite in row["citasRefinadas"]:
                self.assertEqual(len(cite["sha256"]), 64)
                self.assertTrue(cite["localizador"])

    def test_se_conservan_los_tres_supuestos_discriminantes(self):
        expected = {
            "cyl_recuperacion_patrimonio_historico_cultural_natural": "solo autorización o solo informe",
            "cyl_fomento_emprendimiento": "proyecto regional con sede fuera",
            "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad": "Plan exclusivamente autonómico",
        }
        for code, text in expected.items():
            self.assertIn(text, self.rows[code]["discriminante"])

    def test_fronteras_no_se_convierten_en_calculo(self):
        idi = self.rows["cyl_donaciones_idi"]
        self.assertIn("Exceptuado de renta", idi["condiciones"])
        rural = self.rows["cyl_rehabilitacion_viviendas_medio_rural_alquiler"]
        self.assertIn("solo remisión 7.1.c", rural["condiciones"])
        self.assertIn("Propietario de 40 años", rural["discriminante"])
        self.assertIn("Primer pago 2020 agota 2024", self.rows["cyl_vivienda_nueva_construccion"]["discriminante"])


if __name__ == "__main__":
    unittest.main()
