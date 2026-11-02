"""Pruebas documentales ordinarias, sin Git, CAS, red ni dependencias externas."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs/procedencia/deducciones-2025/correcciones/d-cyl-remisiones"


def read(name):
    return json.loads((FOLDER / name).read_text())


class RemisionesCyL(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = {x["codigo"][4:]: x for x in read("matriz.json")["deducciones"]}
        cls.rules = {x["id"]: x for x in read("reglas.json")["reglas"]}
        cls.cites = {x["id"]: x for x in read("citas.json")["citas"]}

    def test_17_codigos_y_campos_completos(self):
        self.assertEqual(len(self.rows), 17)
        for row in self.rows.values():
            self.assertEqual(set(row["ficha"]), {x["campo"] for x in row["matrizCampos"]})
            for field, value in row["ficha"].items():
                expected = value if isinstance(value, list) and value else [value]
                self.assertEqual(expected, [x["valorFicha"] for x in row["matrizCampos"] if x["campo"] == field])

    def test_sin_citas_huerfanas(self):
        for row in self.rows.values():
            for comparison in row["matrizCampos"]:
                for ref in comparison["citasManual"] + comparison["citasNorma"]:
                    self.assertIn(ref, self.cites)
                self.assertTrue(comparison["paginasManual"])
            self.assertTrue(row["hechosDelCaso"])
        for rule in self.rules.values():
            self.assertTrue(rule["citas"])
            self.assertTrue(rule["discriminantes"])
            for ref in rule["citas"]:
                self.assertIn(ref, self.cites)

    def test_9f_no_hereda_vehiculo_9g(self):
        row = self.rows["donaciones_idi"]
        own = row["matrizCampos"][0]["citasNorma"]
        texts = [self.cites[c]["textoLiteral"] for c in own if c.startswith("CYL-a9")]
        self.assertTrue(any(x.startswith("f)") for x in texts))
        self.assertFalse(any("4.000" in x or x.startswith("g)") for x in texts))
        self.assertIn("exceptuado", row["ficha"]["requisitos"][0])

    def test_7_3_no_hereda_edad_primera_vivienda(self):
        row = self.rows["rehabilitacion_viviendas_medio_rural_alquiler"]
        texts = [self.cites[c]["textoLiteral"] for c in row["matrizCampos"][0]["citasNorma"] if c.startswith("CYL-a7")]
        self.assertFalse(any("menos de 36" in x or "primera vivienda" in x for x in texts))
        self.assertIn("remisión exclusiva a7.1.c", row["apartado"])

    def test_saldos_2022_no_nuevos_2025(self):
        for row in self.rows.values():
            for text in row["ficha"]["requisitos"]:
                self.assertNotIn("en el ejercicio citado", text)
                if "hubieran tenido derecho" in text:
                    self.assertIn("ejercicio 2022", text)
        text = self.rules["saldos-2022"]["reglaGeneral"]
        self.assertIn("no nace arrastre2026", text)
        self.assertTrue(any("2022" in self.cites[c]["textoLiteral"] for c in self.rules["saldos-2022"]["citas"]))

    def test_reservas_no_silenciadas(self):
        expected = {"fomento_emprendimiento", "recuperacion_patrimonio_historico_cultural_natural", "rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad"}
        self.assertEqual(expected, {c for c, row in self.rows.items() if row["reservas"]})
        for code in expected:
            self.assertEqual(self.rows[code]["dictamen"], "diferencia_actual_con_reserva")

    def test_naturaleza_o_frente_e(self):
        texts = [self.cites[c]["textoLiteral"] for c in self.rules["patrimonio"]["citas"]]
        self.assertTrue(any("autorizadas o informadas favorablemente" in x for x in texts))
        self.assertTrue(any("autorizadas e informadas favorablemente" in " ".join(x["textoLiteral"].split()) for x in self.cites.values()))

    def test_movilidad_reparto_y_estatal_por_vehiculo(self):
        texts = [self.cites[c]["textoLiteral"] for c in self.rules["movilidad"]["citas"]]
        self.assertTrue(any("prorrateará" in x and "4.000" in x for x in texts))
        text = self.rules["movilidad"]["reglaGeneral"]
        self.assertIn("MISMO vehículo", text)
        self.assertIn("40km", text)
        self.assertIn("4.000porvehículo", text)

    def test_territorio_dos_listas_negativas_y_vigencia(self):
        cites = [self.cites[c] for c in self.rules["territorio"]["citas"]]
        pdfs = {c["documentoId"] for c in cites if c["localizador"]["tipo"] == "pdf-pagina"}
        self.assertEqual(pdfs, {"CENSO2025-0", "CENSO2025-1"})
        text = self.rules["territorio"]["reglaGeneral"]
        self.assertIn("NEGATIVAS", text)
        self.assertIn("no se renombra", text)

    def test_2012_y_iva_no_sustituyen_ventana_dt5(self):
        row = self.rows["vivienda_nueva_construccion"]
        self.assertNotIn("rehabilitacion-iva", row["reglas"])
        self.assertIn("primer pago2021", self.rules["nueva-dt5"]["discriminantes"][0])
        refs = self.rules["vivienda-2012"]["citas"]
        self.assertTrue(any(c.startswith("LIRPF-a68-6-") for c in refs))
        text = self.rules["rehabilitacion-iva"]["reglaGeneral"]
        self.assertIn("MÁS del50%", text)
        self.assertIn("SUPERIOR al25%", text)

    def test_propuestas_con_preimagen_sin_autoaceptacion(self):
        data = read("propuestas-por-codigo.json")
        self.assertFalse(data["aplicarAutomaticamente"])
        self.assertEqual(17, len(data["deducciones"]))
        for row in data["deducciones"]:
            for change in row["actualizaciones"]:
                self.assertEqual(change["preimagen"]["codigo"], row["codigo"])
                self.assertEqual(64, len(change["sha256ArchivoAntes"]))
                self.assertEqual("candidato", change["propuesta"]["estadoRevision"])

    def test_privacidad_y_fuentes_identificadas(self):
        sources = {x["id"]: x for x in read("fuentes.json")["documentos"]}
        for cite in self.cites.values():
            self.assertEqual(cite["sha256"], sources[cite["documentoId"]]["sha256"])
            self.assertEqual(128, len(cite["sha512"]))
        for file in FOLDER.iterdir():
            if file.suffix in [".json", ".md", ".py"]:
                self.assertNotIn("/home/", file.read_text())


if __name__ == "__main__":
    unittest.main()
