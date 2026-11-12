"""Integridad semántica del registro público, sin CAS ni dependencias privadas."""
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs/procedencia/deducciones-2025"


def leer(path):
    return json.loads(path.read_text())


def nodos(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodos(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodos(child)


class RegistroDeducciones(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.registro = leer(DOCS / "cobertura-producto-20261104/registro-351.json")
        cls.cache = {}

    def resolver(self, referencia):
        archivo = referencia["archivo"]
        self.assertFalse(Path(archivo).is_absolute())
        self.assertNotIn("..", Path(archivo).parts)
        if archivo not in self.cache:
            self.cache[archivo] = leer(ROOT / archivo)
        value = self.cache[archivo]
        for key in referencia["puntero"].split("/")[1:]:
            key = key.replace("~1", "/").replace("~0", "~")
            value = value[int(key)] if isinstance(value, list) else value[key]
        return value

    def test_censo_completo_sin_confundir_capacidad_y_acreditacion(self):
        censo = {x["codigo"]: x for x in leer(DOCS / "censo.json")["fichas"]}
        rows = self.registro["deducciones"]
        self.assertEqual(len(rows), len(censo))
        self.assertEqual({x["codigo"] for x in rows}, set(censo))
        for row in rows:
            with self.subTest(codigo=row["codigo"]):
                self.assertEqual(row["comunidad"], censo[row["codigo"]]["comunidad"])
                self.assertEqual(row["lote"], censo[row["codigo"]]["lote"])
                self.assertIs(row["documentalActual"]["aceptacionFiscalIntegral"], False)
                self.assertIs(row["capacidadCalculo"]["consignacionAcreditaDerecho"], False)
        self.assertEqual(self.registro["balance"]["total"], len(rows))
        self.assertEqual(
            self.registro["balance"]["hechosEspecificosParciales"],
            sum(r["capacidadCalculo"]["hechosEspecificosParciales"] for r in rows),
        )

    def test_historia_es_el_dictamen_completo_y_conserva_sus_estados(self):
        originales = {
            lote: {r["codigo"]: r for r in leer(DOCS / "lotes" / lote / "dictamenes.json")["deducciones"]}
            for lote in {r["lote"] for r in self.registro["deducciones"]}
        }
        for row in self.registro["deducciones"]:
            original = originales[row["lote"]][row["codigo"]]
            history = row["historia"]
            with self.subTest(codigo=row["codigo"]):
                self.assertEqual(self.resolver(history["referencia"]), original)
                self.assertEqual(self.resolver(row["evidencia"]["expediente"]), original)
                for field, old in [
                    ("dictamenAntes", "dictamenAntes"),
                    ("dictamenDespuesConservado", "dictamenDespues"),
                    ("estadoRevisionConservado", "estadoRevision"),
                ]:
                    self.assertEqual(history[field], original[old])
                self.assertIs(history["noUsarComoEstadoActual"], True)

    def test_referencias_resuelven_sin_salir_del_repositorio(self):
        refs = [r for r in nodos(self.registro) if "archivo" in r and "puntero" in r]
        self.assertGreater(len(refs), 6000)
        for ref in refs:
            self.resolver(ref)

    def test_camp02_no_promueve_la_proposicion_descartada_a_regla_actual(self):
        row = next(r for r in self.registro["deducciones"] if r["codigo"] == "balears_conciliacion_menores_6")
        condiciones = row["documentalActual"]["condiciones"]
        self.assertNotIn("50%,900 desde11julio", condiciones["reglaContrastada"])
        rectificacion = next(
            r for r in nodos(leer(DOCS / "correcciones/c/hechos-y-ruta-unica.json"))
            if r.get("codigo") == row["codigo"]
        )
        self.assertEqual(condiciones["reglaContrastada"], rectificacion["parametros"]["reglaDocumentada"])
        decision = next(r for r in leer(DOCS / "revisiones/cinco-rectificaciones/decisiones.json")["decisiones"] if r["id"] == "CAMP-02")
        for field in ["id", "decision", "motivo", "discriminantes", "evidencias"]:
            self.assertEqual(condiciones["rectificacionVigente"][field], decision[field])
        self.assertEqual(
            row["historia"]["proposicionDescartadaCAMP02"],
            self.resolver(row["evidencia"]["revisionVigente"])["reglaContrastada"],
        )

    def test_norma_veh_distinta_del_modelo_993(self):
        rows = [r for r in self.registro["deducciones"] if r.get("integracionOverlay", {}).get("id") == "VEH-192-2018"]
        self.assertEqual(len(rows), 3)
        for row in rows:
            texto = json.dumps(row["reservasActuales"], ensure_ascii=False)
            self.assertNotIn("Orden993", texto)
            self.assertIn("VEH/192/2018", texto)
            self.assertIn("modelo 993", texto)

    def test_overlay_no_cambia_fuentes_ni_localizadores(self):
        clm = self.registro["integraciones"]["CLM-XML"]
        self.assertEqual((len(clm["fuentes"]), len(clm["citas"])), (36, 2495))
        for fuente in clm["fuentes"]:
            original = self.resolver(fuente["referencia"])
            for field in ["id", "sha256", "sha512", "bytes", "urlOficial"]:
                self.assertEqual(fuente[field], original[field])
        for cita in clm["citas"]:
            original = self.resolver(cita["referencia"])
            for field in ["id", "documentoId", "localizador"]:
                self.assertEqual(cita[field], original[field])

    def test_inventario_reconcilia_el_corte308_con_el_censo(self):
        inventario = leer(DOCS / "inventario-20261112/inventario.json")
        censo = {r["codigo"]: r for r in leer(DOCS / "censo.json")["fichas"]}
        cubiertos = set()
        for fuente in inventario["fuentesCorteHistorico"]:
            rows = leer(ROOT / fuente["archivo"])[fuente["coleccion"]]
            self.assertEqual(len(rows), len({r["codigo"] for r in rows}))
            for row in rows:
                self.assertIn(row["codigo"], censo)
                if fuente["seleccion"] == "todos" or row["capacidadCalculo"]["hechosEspecificosParciales"]:
                    cubiertos.add(row["codigo"])
        self.assertEqual(len(cubiertos), 308)
        faltaban = inventario["faltabanEnCorte308"]
        self.assertEqual(len(faltaban), 43)
        self.assertEqual({r["codigo"] for r in faltaban}, set(censo) - cubiertos)
        for comunidad in inventario["porComunidad"]:
            nombre = comunidad["comunidad"]
            self.assertEqual(comunidad["censo"], sum(r["comunidad"] == nombre for r in censo.values()))
            self.assertEqual(comunidad["faltabanEnCorte308"], sum(r["comunidad"] == nombre for r in faltaban))
        self.assertEqual({r["comunidad"] for r in inventario["porComunidad"]}, {r["comunidad"] for r in censo.values()})

    def test_inventario_no_convierte_formula_pendiente_en_importe(self):
        inventario = leer(DOCS / "inventario-20261112/inventario.json")
        rows = inventario["faltabanEnCorte308"]
        pendientes = [r["codigo"] for r in rows if r["estadoObservado"] == "formula_condicionada_sin_importe"]
        self.assertEqual(pendientes, ["murcia_vivienda_jovenes_hasta_40"])
        self.assertEqual(inventario["pendientesSinRamaMonetariaEntreLos43"], pendientes)
        self.assertFalse(inventario["balance"]["punto4Cerrado"])
        self.assertEqual(rows, sorted(rows, key=lambda r: (r["prioridadTematica"], r["comunidad"], r["codigo"])))
        for row in rows:
            self.assertFalse(row["aceptacionFiscalIntegral"])
            for archivo in row["archivos"] + row["pruebas"]:
                self.assertFalse(Path(archivo).is_absolute())
                self.assertNotIn("..", Path(archivo).parts)
                self.assertTrue((ROOT / archivo).is_file(), archivo)
            if row["matrizPosterior"] is not None:
                self.assertEqual(self.resolver(row["matrizPosterior"])["codigo"], row["codigo"])


if __name__ == "__main__":
    unittest.main()
