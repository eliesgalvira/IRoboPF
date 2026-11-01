"""Casos independientes; solo fixtures sintéticos, nunca resultados fiscales.

Ejecutar con jsonschema==4.26.0 mediante uv run --no-project --with.
REVIEW_TMP debe señalar un directorio privado externo. No borra temporales.
Las pruebas R01-R03 conservan las expectativas deseadas y fallan en la base.
"""
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest

sys.dont_write_bytecode = True
REPO = Path(__file__).resolve().parents[5]
spec = importlib.util.spec_from_file_location(
    "contrato", REPO / "scripts/procedencia/deducciones-2025/verificar.py")
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)
CENSO = json.loads((REPO / "docs/procedencia/deducciones-2025/censo.json").read_text())


class Contrato(unittest.TestCase):
    def setUp(self):
        privado = Path(os.environ["REVIEW_TMP"]).resolve(strict=True)
        if privado.is_relative_to(REPO):
            raise ValueError("REVIEW_TMP debe ser externo")
        self.root = Path(tempfile.mkdtemp(prefix="casos-", dir=privado))
        self.cas = dict(root=str(self.root), formato="plano")
        self.docs = []
        for ident, tipo in [("norma", "original"), ("manual", "manual")]:
            contenido = f"<p>Fixture sintético {ident}: regla 100.</p>".encode()
            sha = hashlib.sha256(contenido).hexdigest()
            (self.root / sha).write_bytes(contenido)
            self.docs.append(dict(
                id=ident, tipo=tipo, sha256=sha,
                sha512=hashlib.sha512(contenido).hexdigest(), bytes=len(contenido),
                mimeType="text/html", urlOficial=f"https://example.invalid/{ident}",
                fechaRecuperacion="2026-11-01T12:00:00Z", fechaPublicacion="2025-01-01",
                boletin="Fixture sintético sin valor fiscal", identificador=ident))
        self.paquetes = []
        for lote in CENSO["lotes"]:
            registros = []
            for f in CENSO["fichas"]:
                if f["lote"] != lote:
                    continue
                citas = [dict(id=ident, documentoId=ident, articulo="1", apartado="",
                              textoLiteral=f"Fixture sintético {ident}: regla 100.",
                              localizador=dict(tipo="html", selector="p", inicio=0,
                                               fin=len(f"Fixture sintético {ident}: regla 100."),
                                               recetaExtraccion="Texto del primer p, caracteres Unicode"))
                         for ident in ("norma", "manual")]
                registros.append(dict(
                    codigo=f["codigo"], comunidad=f["comunidad"],
                    dictamenAntes="coincide", dictamenDespues="coincide",
                    dictamenFicha="coincide", dictamenCalculo="coincide",
                    alcance="Solo hipótesis estructural", motivo="Regla sintética 100",
                    estadoRevision="candidato", vigencia=dict(citas=["norma"], reservas=[]),
                    citas=citas, manual=dict(documentoId="manual", paginasFicha=f["fuenteManual"]["paginas"],
                                            paginasComprobadas=[1], citas=["manual"], reservas=[]),
                    comparaciones=[dict(campoCodigo="cuantia", valorCodigo=100, reglaOficial="100",
                                        citas=["norma"], resultado="coincide", motivo="Hipótesis actual")],
                    contraejemplos=[], cambios=[], pendientes=[]))
            self.paquetes.append(dict(dictamenes=dict(version=1, ejercicio=2025, lote=lote,
                baseCommit="016ec72d9539ccd887202735960ce306bd2354e5", deducciones=registros),
                fuentes=dict(version=1, documentos=copy.deepcopy(self.docs))))
        self.f = self.paquetes[0]["dictamenes"]["deducciones"][0]

    def verificar(self, paquetes=None, modo="completo", cas=True):
        return v.verificar_paquetes(CENSO, self.paquetes if paquetes is None else paquetes,
                                    modo, self.cas if cas else None)

    def contraejemplo(self):
        return dict(entradas=dict(base=100), esperado=100, observado=90,
                    calculoIndependiente="100 por uno = 100", apiOCampo="cuantia",
                    pruebaReproducible="Comparar 100 con 90 en este fixture", alcance="Hipótesis actual")

    def test_positivo_completo_cas(self):
        r = self.verificar()
        self.assertEqual(r["recibidas"], 351)
        self.assertEqual(r["integridadBytes"], "comprobada")
        self.assertEqual(r["vigenciaJuridica"], "requiere_revision_independiente")

    def test_positivo_parcial(self):
        r = self.verificar(self.paquetes[:1], "parcial")
        self.assertEqual(r["recibidas"] + len(r["pendientes"]), 351)

    def test_positivo_diferencia_actual(self):
        for k in ("dictamenAntes", "dictamenDespues", "dictamenFicha"):
            self.f[k] = "diferencia"
        self.f["comparaciones"][0]["resultado"] = "diferencia"
        self.f["contraejemplos"] = [self.contraejemplo()]
        self.verificar()

    def test_positivo_reserva_no_verificable(self):
        self.f.update(dictamenDespues="no_verificable", dictamenAntes="no_verificable",
                      dictamenCalculo="no_verificable", pendientes=[dict(causa="Remisión pendiente",
                      actuacionesRealizadas=["Inspección sintética"], evidenciaNecesaria="Original de remisión")])
        self.verificar()

    def test_positivo_historia_explicita(self):
        self.historia_corregida()
        historica = copy.deepcopy(self.f["comparaciones"][0])
        historica.update(resultado="diferencia", motivo="Histórica, corregida; no es comparación actual")
        self.f["comparaciones"].append(historica)
        self.verificar()

    def historia_corregida(self):
        self.f["dictamenAntes"] = "diferencia"
        self.f["contraejemplos"] = [self.contraejemplo()]
        self.f["contraejemplos"][0]["alcance"] = "Histórico anterior al fix; resultado actual 100"
        self.f["cambios"] = [dict(archivo="fixture.ts", motivo="Corregir 90 a 100",
            pruebaRojaAnterior="Fixture anterior 90 frente a 100", resultadoPosterior="Fixture actual 100")]

    def test_cobertura_omisiones(self):
        with self.assertRaisesRegex(ValueError, "Cobertura incompleta"):
            self.verificar([])
        self.paquetes[0]["dictamenes"]["deducciones"].pop()
        with self.assertRaisesRegex(ValueError, "cobertura incompleta"):
            self.verificar(self.paquetes[:1], "parcial")

    def test_comunidad_y_lote(self):
        self.f["comunidad"] = "inexistente"
        with self.assertRaisesRegex(ValueError, "Código/comunidad/lote"):
            self.verificar()

    def test_duplicados(self):
        self.paquetes[0]["dictamenes"]["deducciones"].append(copy.deepcopy(self.f))
        with self.assertRaisesRegex(ValueError, "duplicado"):
            self.verificar()

    def test_schema_obligatorio(self):
        del self.f["vigencia"]
        with self.assertRaises(Exception):
            self.verificar()

    def test_referencia_anidada(self):
        self.f["vigencia"]["reformas"] = [dict(citaIds=["ausente"])]
        with self.assertRaisesRegex(ValueError, "referencia rota"):
            self.verificar()

    def test_manual_cruzado(self):
        self.f["manual"]["citas"] = ["norma"]
        with self.assertRaisesRegex(ValueError, "manual apunta a otro"):
            self.verificar()

    def test_rango_vacio(self):
        self.f["citas"][0]["localizador"]["fin"] = 0
        with self.assertRaises(Exception):
            self.verificar()

    def test_sin_discriminante(self):
        self.f["dictamenFicha"] = "diferencia"
        with self.assertRaisesRegex(ValueError, "sin discriminante"):
            self.verificar()

    def test_global_oculta_limite_explicito(self):
        self.f.update(dictamenCalculo="no_verificable", pendientes=[dict(causa="Remisión pendiente",
            actuacionesRealizadas=["Inspección sintética"], evidenciaNecesaria="Remisión")])
        with self.assertRaisesRegex(ValueError, "global oculta"):
            self.verificar()

    def test_bytes_tamano_sha512_ausente(self):
        doc = copy.deepcopy(self.docs[0])
        for campo, valor in [("bytes", doc["bytes"] + 1), ("sha512", "0" * 128), ("sha256", "0" * 64)]:
            d = dict(doc, **{campo: valor})
            with self.assertRaises((ValueError, FileNotFoundError)):
                v.comprobar_bytes(d, self.cas)

    def test_cas_symlink_fuera(self):
        sub = self.root / "sub"
        sub.mkdir()
        (sub / self.docs[0]["sha256"]).symlink_to(self.root / self.docs[0]["sha256"])
        with self.assertRaisesRegex(ValueError, "fuera del root"):
            v.comprobar_bytes(self.docs[0], dict(root=str(sub), formato="plano"))

    def test_privacidad_campos(self):
        self.f["vigencia"]["authorization"] = "MARCADOR_SINTETICO"
        with self.assertRaisesRegex(ValueError, "Campo privado"):
            self.verificar()

    def test_url_userinfo(self):
        self.paquetes[0]["fuentes"]["documentos"][0]["urlOficial"] = "https://synthetic@example.invalid/"
        with self.assertRaisesRegex(ValueError, "URL pública inválida"):
            self.verificar()

    def test_url_segundo_parametro_se_rechaza(self):
        self.paquetes[0]["fuentes"]["documentos"][0]["urlOficial"] += "?a=1&token=MARCADOR_SINTETICO"
        with self.assertRaisesRegex(ValueError, "credenciales"):
            self.verificar(self.paquetes[:1], "parcial")

    def test_R01_comparacion_actual_discrepante(self):
        self.f["comparaciones"][0].update(resultado="diferencia", valorCodigo=90,
                                              motivo="Diferencia ACTUAL sin fix")
        self.f["contraejemplos"] = [self.contraejemplo()]
        with self.assertRaises(ValueError, msg="El global coincide debe rechazar diferencia actual"):
            self.verificar()

    def test_R01_comparacion_actual_no_verificable(self):
        self.f["comparaciones"][0].update(resultado="no_verificable", motivo="Regla actual sin cerrar")
        with self.assertRaises(ValueError, msg="El global coincide debe conservar la reserva actual"):
            self.verificar()

    def test_R02_manual_mismo_id_adquisicion_distinta(self):
        self.paquetes[1]["fuentes"]["documentos"][1]["fechaRecuperacion"] = "2026-11-01T13:00:00Z"
        self.verificar(self.paquetes[:2], "parcial")

    def test_R02_manual_id_independiente(self):
        doc = self.paquetes[1]["fuentes"]["documentos"][1]
        doc.update(id="manual-b", fechaRecuperacion="2026-11-01T13:00:00Z")
        for f in self.paquetes[1]["dictamenes"]["deducciones"]:
            f["manual"]["documentoId"] = "manual-b"
            f["citas"][1]["documentoId"] = "manual-b"
        self.verificar(self.paquetes[:2], "parcial")

    def test_R03_url_primer_parametro(self):
        # Marcador inventado: no imprimir ni introducir credenciales reales.
        self.paquetes[0]["fuentes"]["documentos"][0]["urlOficial"] += "?token=MARCADOR_SINTETICO"
        with self.assertRaisesRegex(ValueError, "credenciales"):
            self.verificar(self.paquetes[:1], "parcial")

    def test_historia_requiere_conservar_comparacion_anterior(self):
        self.historia_corregida()
        with self.assertRaisesRegex(ValueError, "diferencia sin discriminante"):
            self.verificar()


if __name__ == "__main__":
    unittest.main(verbosity=2)
