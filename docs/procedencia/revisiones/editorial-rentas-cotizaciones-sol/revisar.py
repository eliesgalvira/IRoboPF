"""Contrarrevisión documental: matrices exhaustivas, casos y rojos sin fixes."""

from __future__ import annotations

import ast
import gzip
import hashlib
import json
import pathlib
import re
import sys
import unittest
from fractions import Fraction

ROOT = pathlib.Path(__file__).resolve().parents[4]
OUT = pathlib.Path(__file__).resolve().parent
EDITORIAL = ROOT / "docs/procedencia/editorial/rentas-retenciones-cotizaciones"


def load(name: str):
    return json.loads((EDITORIAL / name).read_text())


def save(name: str, value) -> None:
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def rationale(objection: str, response: str, cost: str):
    return {"objecionExperta": objection, "respuesta": response, "coste": cost}


def rational(expression: str) -> Fraction:
    """El token decimal original se convierte directamente a racional, sin float."""

    def visit(node: ast.AST) -> Fraction:
        if isinstance(node, ast.Constant):
            segment = ast.get_source_segment(expression, node)
            if segment is None:
                raise ValueError("Token sin posición fuente")
            return Fraction(segment)
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
            return -visit(node.operand)
        if isinstance(node, ast.BinOp):
            a, b = visit(node.left), visit(node.right)
            if isinstance(node.op, ast.Add):
                return a + b
            if isinstance(node.op, ast.Sub):
                return a - b
            if isinstance(node.op, ast.Mult):
                return a * b
            if isinstance(node.op, ast.Div):
                return a / b
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            args = [visit(x) for x in node.args]
            if node.func.id == "min":
                return min(args)
            if node.func.id == "max":
                return max(args)
        raise ValueError(ast.dump(node))

    return visit(ast.parse(expression, mode="eval").body)


NOTES = {
    "anual.trabajo.integro": "Suma de íntegros, sin restar H. Art17 no está transcrito en las dos páginas citadas: falta enlazar el pasaje de calificación.",
    "anual.trabajo.cotizacion": "Reutiliza total obrero del modo; estima, no acredita cotizaciones efectivas ni situación pensionista.",
    "anual.trabajo.previo-neto": "P=I-C técnico. El argumento art20 legal incluiría los demás a-e. No llamarlo neto fiscal completo.",
    "anual.trabajo.gastos": "Tabla nominal 0/2000; no gasto f efectivamente limitado. No multiplicar por pagadores.",
    "anual.trabajo.neto": "El suelo técnico destruye pérdidas a-e; se declara como simplificación. Comparar explícito -0.01 frente 0.",
    "anual.trabajo.reduccion": "O algebraico antes de compensación, sin f. Media2018 por devengo correcta en el pasaje DA47. Referencia textual derivaciones.json rota.",
    "anual.explicito.trabajo.integro": "Límite familiar corresponde a conexion-contrato, que sigue exigiendo ninguno. No confundir con derechosMinimos del anual general actual.",
    "anual.explicito.trabajo.gastos-a-e": "a-e conserva pérdidas. 300 consta en Ley26p12; 500 requiere RIRPF art10, ausente entre las citas de esta ficha.",
    "anual.explicito.trabajo.gasto-f": "F=min(2000,max(P,0)), anual por contribuyente; movilidad/discapacidad excluidas de esta conexión.",
    "anual.explicito.trabajo.art19": "N19=P-F con signo; argumentoArt20=P. Cuota estimada SS no entra de nuevo.",
    "anual.explicito.trabajo.art20": "O=0 es hecho del contrato. Tope de reducción en N19 positivo; no reduce una pérdida a-e.",
    "anual.explicito.da61": "Servicio activo frente pensión; límite proporcional y tras80 distintos de cuota líquida legal. Norma creada2025, no habilita2026.",
    "anual.explicito.retenciones": "Operaciones efectivas únicas, no importe estimado por tipo. Un ID diferente no prueba otro hecho.",
    "anual.explicito.pagos": "EDS toma fraccionados efectivos y trabajo0; fecha2026 del cuarto trimestre no cambia ejercicio2025.",
    "anual.explicito.diferencial": "Qposterior-H-P mantiene negativo; no es devolución reconocida ni neto salarial.",
    "anual.inmobiliario.integro": "Suma ingresos declarados sin gastos. Faltan titularidad, período, uso y exigibilidad.",
    "anual.inmobiliario.neto": "Identidad técnica N=I explícitamente incompleta: con I5000,gastos7000+500 el contraste da -500 y exceso2000.",
    "anual.ganancias.total": "Entrada ya precalculada, pérdida requiere calificación previa; no valida FIFO, costes ni recompras.",
    "anual.ganancias.exenta": "Exención limitada a ganancia positiva; cómputo por operación no concilia acumulados240000 entre operaciones.",
    "anual.pagos.retenciones": "Retenciones soportadas declaradas se convierten de céntimos, no disminuyen íntegros.",
    "anual.pagos.cuenta": "El perfil general puede sumar estimación a pagos ya declarados: conciliación externa, no deduplicación legal probada.",
    "anual.retencion.base": "Base de procedimiento distinta de BLG; rechazos por versión/fecha no se habilitan por disponer PDF histórico.",
    "anual.retencion.cuota": "Mínimo minora cuota y no base; 45% en2020 y límite43% hasta22000 necesitan versión explícita, no todo año del archivo.",
    "anual.retencion.tipo": "Unidad puntos porcentuales. CB024=955/100 no demuestra truncamiento de Q/R; discriminante independiente 1720/18000.",
    "anual.retencion.anual": "Hestimado=R*t/100, redondeo del modo, distinto de cuota y de soportadas.",
    "anual.ss.base": "7/5 meses2018 correcto aritméticamente. Las citas de esta ficha solo son de2025: falta fuente2018 enlazada para vigencia intranual.",
    "anual.ss.exceso": "Exceso sobre base limitada no forma base MEI; antes2025 no genera solidaridad.",
    "anual.ss.empresarial-ordinaria": "31.40 incluye AT/EP1.50 condicionado, no universal; falta elegibilidad ocupacional.",
    "anual.ss.trabajador-ordinaria": "6.35 separado de MEI, desempleo temporal1.60 no se selecciona por hechos aquí.",
    "anual.ss.mei-empresarial": "2025 .0067 y2026 .0075 son distintos; ficha enlaza únicamente orden2025. Fuente2026 pendiente local.",
    "anual.ss.mei-trabajador": "2025 .0013 y2026 .0015: no reconstruir reparto por proporción total. Falta cita2026 enlazada.",
    "anual.ss.solidaridad-empresarial": "Tipos por aportación .77/.83/.98 en2025; .96/1.04/1.22 en2026 no respaldados por orden2025 enlazada.",
    "anual.ss.solidaridad-trabajador": "Tipos .15/.17/.19 en2025, .19/.21/.24 en2026; no dividir por6. No emitir deuda TGSS desde producto analítico.",
    "anual.ss.empresarial-total": "Sumar componentes del mismo modo. XML histórico no prescribe redondeo2025 ni residual.",
    "anual.ss.trabajador-total": "Total1905+39=1944 reutilizado una vez. Deducción legal exige aportación efectiva.",
    "anual.ss.coste-laboral": "S+empresa, obrero ya incluido en bruto. Neto comparado debe usar misma cuota y modo; no agregar anticipos como impuesto extra.",
    "anual.explicito.actividad.etapa": "18 familias de instancias, no fórmula única; RETA una vez,5%/2000,30% incluye RETA+A,70% mide bases sujetas. Referencia derivaciones.json rota.",
    "irpf.ganancias.perdidas": "Conservar signo no implementa bolsas ni cuatro años; general/ahorro exige períodos y categorías. Cadena histórica completa pendiente.",
    "irpf.ganancias.exencion-inmuebles": "Ventana adquisición12mayo-31dic2012 inclusiva; venta posterior posible. Concurrencia con reinversión no cerrada.",
    "irpf.ganancias.renta-vitalicia": "Desde2015,240000 acumulados y plazo6meses con excepción por retención; anualidad,inicio,comunicación y cláusulas deben acreditarse. No suprime exención vivienda2014.",
}


def main() -> None:
    fichas, leaves, controls = (
        load("fichas.json"),
        load("parametros.json"),
        load("controles-tecnicos.json"),
    )
    blocks = json.loads(
        gzip.decompress((OUT / "pasajes-primarios.json.gz").read_bytes())
    )
    by_cite = {x["cita"]: x for x in blocks}
    decisions = []
    for index, ficha in enumerate(fichas, 1):
        site = ficha["objetivo"]["siteId"] or ficha["id"].removeprefix("editorial.")
        assert site in NOTES, site
        sections = []
        for name, value in ficha["secciones"].items():
            # Pasajes reales con coordenadas; son contexto, nunca validación automática por palabras.
            candidates = []
            for cid in ficha["secciones"]["evidencia"]["citas"]:
                for passage in by_cite[cid]["pasajes"]:
                    text = passage["texto"]
                    if re.search(
                        r"artículo|por ciento|euros|cotiz|rendimiento|retenci|ganancia",
                        text,
                        re.I,
                    ):
                        candidates.append(
                            {
                                "cita": cid,
                                "sha256": by_cite[cid]["sha256"],
                                "sha512": by_cite[cid]["sha512"],
                                "pagina": by_cite[cid]["pagina"],
                                **passage,
                            }
                        )
            sections.append(
                {
                    "afirmacionId": f"{ficha['id']}.{name}",
                    "textoExaminado": value["texto"],
                    "decision": "candidata-con-limites"
                    if name != "evidencia"
                    else "pendiente-vinculo-por-afirmacion",
                    "razon": NOTES[site],
                    "pasajesContexto": candidates,
                    "alcancePasajes": "Selección de bloques primarios reales dentro de las páginas enlazadas; no prueba exclusiva de todos los literales. La correspondencia fina continúa pendiente.",
                    "aceptacionFiscalCompleta": False,
                    **rationale(
                        "Una fórmula coherente puede usar condiciones o vigencia ajenas.",
                        "Separar comportamiento técnico del cierre jurídico y conservar el objetivo histórico exacto.",
                        "Revisión y vínculo adicionales antes de publicación.",
                    ),
                }
            )
        decisions.append(
            {
                "numero": index,
                "id": ficha["id"],
                "objetivoHistorico": ficha["objetivo"],
                "dictamen": NOTES[site],
                "secciones": sections,
                "aceptacionFiscalCompleta": False,
            }
        )
    save("decisiones-40-fichas.json", decisions)
    leaf_decisions = []
    for index, leaf in enumerate(leaves, 1):
        occurrence = leaf["ocurrencia"]
        src = ROOT / occurrence["fuente"]["file"]
        assert (
            hashlib.sha256(src.read_bytes()).hexdigest()
            == occurrence["fuente"]["sha256"]
        )
        contexts = [by_cite[c] for c in leaf["secciones"]["evidencia"]["citas"]]
        token = leaf["valor"].replace(".", "").replace(",", "")
        matching = []
        if len(token) >= 3:
            for context in contexts:
                for passage in context["pasajes"]:
                    if token in re.sub(r"[.,\s\u00a0]", "", passage["texto"]):
                        matching.append(
                            {
                                "cita": context["cita"],
                                "sha256": context["sha256"],
                                "sha512": context["sha512"],
                                "pagina": context["pagina"],
                                **passage,
                            }
                        )
        leaf_decisions.append(
            {
                "fila": index,
                "id": leaf["id"],
                "ocurrencia": occurrence,
                "valor": leaf["valor"],
                "unidadDeclarada": leaf["unidad"],
                "ejerciciosDeclarados": leaf["ejercicios"],
                "usosCandidatos": leaf["usosCandidatos"],
                "decisionTecnica": "archivo-exacto-hash-coincidente",
                "decisionJuridica": "pendiente-por-literal-y-rama",
                "cincoSecciones": {
                    k: {
                        "textoExaminado": v["texto"],
                        "decision": "pendiente-cierre-individual"
                        if k in ("norma", "evidencia")
                        else "candidata-tecnica",
                        "limite": "La derivación compartida no sustituye predicado, unidad y vigencia de esta ocurrencia exacta.",
                    }
                    for k, v in leaf["secciones"].items()
                },
                "pasajesConToken": matching,
                "advertencia": "Coincidencia textual candidata; no se deduce identidad por número. Para 0,1,meses,divisores y selectores se requiere derivación de la operación; no buscar una falsa cuantía legal.",
                "aceptacionFiscalCompleta": False,
                **rationale(
                    "Una hoja genérica puede asignar el mismo papel a ocurrencias diferentes.",
                    "Conservar ruta, símbolo, valor y contexto exactos; no declarar regla completa.",
                    "Completar cierre transitivo y pasaje de cada ámbito antes de promover.",
                ),
            }
        )
    data = json.dumps(leaf_decisions, ensure_ascii=False, indent=2).encode()
    (OUT / "decisiones-195-hojas.json.gz").write_bytes(gzip.compress(data, mtime=0))
    annex = []
    for index, control in enumerate(controls, 1):
        value = control["valor"]
        material = value == "33" or (
            value == "2015" and "discapacidad" in control["contextoCodigo"]
        )
        annex.append(
            {
                "fila": index,
                **control,
                "decision": "reclasificar-o-enlazar-condicion-material"
                if material
                else "auxiliar-conservar-separado",
                "razon": "33 condiciona grado elegible;2015 condiciona vigencia de discapacidad. No son meros calendarios neutros."
                if material
                else "Calendario,cardinalidad,índice,validación o elemento neutro. No se convierte en regla fiscal por contarlo.",
                "aceptacionFiscalCompleta": False,
                **rationale(
                    "La etiqueta auxiliar puede ocultar condiciones jurídicas.",
                    "Examinar contexto literal y separar control informático de elegibilidad material.",
                    "Enlazar condiciones materiales a la derivación sin inflar número de reglas.",
                ),
            }
        )
    save("anexo-130-controles.json", annex)
    results = []
    for case in load("casos.json"):
        got = rational(case["expresion"])
        assert got == Fraction(case["esperado"]), case
        results.append(
            {
                **case,
                "racionalIndependiente": str(got),
                "aritmetica": "coincide",
                "limite": "No ejecuta motor ni selecciona rama; CB024 es constante955/100 y CB004 constante2000.",
                **rationale(
                    "Un expected correcto no discrimina una implementación errónea.",
                    "Recalcular desde tokens exactos y separar ejemplos de regresiones del motor.",
                    "Exigir casos con selección de rama, hechos y adversos.",
                ),
            }
        )
    save("revision-54-casos.json", results)
    discriminants = [
        (
            "trabajo-perdida",
            "100-150-min(2000,max(100-150,0))",
            "-50",
            "El general da0; explícito debe preservar-50.",
        ),
        (
            "gasto-f-frontera",
            "min(2000,max(1999.99,0))",
            "1999.99",
            "Contrasta gasto aplicado con tabla2000.",
        ),
        ("eds-umbral-g", "min(2000,.05*40000.01)", "2000", "Impide5% sin tope."),
        (
            "eds-30-incluye-reta",
            "(2500+600)/10000",
            "0.31",
            "Rechazo cliente único aunque gastos ordinarios sean25%.",
        ),
        (
            "eds-70-bases",
            "7000/10000",
            "0.7",
            "Igualdad admite, retención ingresada no es el numerador.",
        ),
        (
            "eds-inicio-tope",
            ".20*min(100000,150000)",
            "20000",
            "Tope de base, no20% sin límite.",
        ),
        (
            "vitalicia-acumulado",
            "100000*min(1,min(200000,max(240000-200000,0))/200000)",
            "20000",
            "Segunda operación requiere previas200000.",
        ),
        (
            "ss-intrannual",
            "7*3751.2+5*3803.7-12*3751.2",
            "262.5",
            "Distingue canon2018 de legacy.",
        ),
        (
            "ss-reparto",
            "1086*.0077-1086*.0092*5/6",
            "0.0362",
            "Empresa publicada no es5/6 del total.",
        ),
        (
            "retencion-cociente",
            "1720*100/18000",
            "86/9",
            "Truncar cociente a9.55 produce1719; redondearlo9.56 produce1720.8.",
        ),
        (
            "duplicidad-canales",
            "1000-500-500",
            "0",
            "Si ambos500 son mismo anticipo, saldo correcto condicionado500; conciliación externa.",
        ),
        (
            "cuota-neto-modo",
            "30000-1944-3000",
            "25056",
            "Si cuota mostrada3000, neto debe usar3000, no retención de otro modo.",
        ),
    ]
    save(
        "discriminantes-independientes.json",
        [
            {
                "id": name,
                "expresion": expr,
                "esperado": expected,
                "resultado": str(rational(expr)),
                "criterio": text,
                "alcance": "Oracle aritmético y receta para contraste del padre; no prueba ejecutada del motor.",
            }
            for name, expr, expected, text in discriminants
        ],
    )
    assert all(
        rational(expr) == Fraction(expected) for _, expr, expected, _ in discriminants
    )
    config = json.loads((ROOT / ".oxlintrc.json").read_text())
    rules = {
        k: v
        for k, v in config["rules"].items()
        if k.startswith(("anti-slop/", "anti-slop-effect/"))
    }
    assert len(rules) == 16 and all(x == "error" for x in rules.values())
    save("anti-slop.json", rules)
    mapping = []
    for ficha in fichas:
        mapping.append(
            {
                "editorial": ficha["id"],
                "destinoExacto": ficha["objetivo"]["sujeto"],
                "snapshot": ficha["objetivo"]["snapshot"],
                "siteId": ficha["objetivo"]["siteId"],
                "cincoSecciones": list(ficha["secciones"]),
                "propuesta": "Superponer secciones solo tras comprobar Referencia id+revision y snapshot; conservar Fuente por archivo/hash/localizador. Derivacion y citas requieren entidades propias y aristas por revision.",
                "ambito": "Mantener desconocido con motivo cuando ejercicios esté vacío; no fabricar desde/hasta,predicadoVersion o territorio desde el nombre de archivo.",
                "estados": {
                    "interpretacion": "pendiente",
                    "contrarrevision": "pendiente",
                    "integridad": "por-comprobar",
                    "autenticidad": "pendiente",
                },
                "prohibido": "No convertir aceptacionFiscalCompleta=false en estado aceptado. Publicador todavía no consume esta superposición.",
            }
        )
    save("propuesta-mapeo-entidad.json", mapping)
    save(
        "recuento.json",
        {
            "fichas": len(fichas),
            "hojas": len(leaves),
            "hojasIdsUnicos": len({x["id"] for x in leaves}),
            "controles": len(controls),
            "casos": len(results),
            "discriminantes": len(discriminants),
            "reglasCompletasAceptadas": 0,
        },
    )
    print(json.dumps(json.loads((OUT / "recuento.json").read_text())))


class ContratosEditoriales(unittest.TestCase):
    def test_referencia_derivacion_resoluble(self):
        """Rojo ERSC-01: dos fichas remiten a derivaciones.json inexistente."""
        bad = [
            x["id"]
            for x in load("fichas.json")
            if "derivaciones.json" in json.dumps(x, ensure_ascii=False)
            and not (EDITORIAL / "derivaciones.json").exists()
        ]
        self.assertEqual(bad, [])

    def test_colegio_500_tiene_pasaje_en_citas_ficha(self):
        """Rojo ERSC-02: art19d delega límite, no acredita500."""
        f = next(
            x
            for x in load("fichas.json")
            if x["objetivo"]["siteId"] == "anual.explicito.trabajo.gastos-a-e"
        )
        cites = {x["id"]: x for x in load("citas.json")}
        texts = "\n".join(
            cites[c]["selector"]["texto"] for c in f["secciones"]["evidencia"]["citas"]
        )
        self.assertRegex(texts, r"(?<![\d.,])500 euros")

    def test_control_33_no_es_solo_auxiliar(self):
        """Rojo ERSC-03: condición material de grado sin clasificación propia."""
        bad = [
            x["ocurrencia"]["id"]
            for x in load("controles-tecnicos.json")
            if x["valor"] == "33" and "no magnitud fiscal autónoma" in x["papel"]
        ]
        self.assertEqual(bad, [])

    def test_2026_mei_tiene_fuente_del_ejercicio(self):
        """Rojo ERSC-04: cita2025 no prueba tarifa2026."""
        f = next(
            x
            for x in load("fichas.json")
            if x["objetivo"]["siteId"] == "anual.ss.mei-trabajador"
        )
        cites = {x["id"]: x for x in load("citas.json")}
        urls = [
            cites[c]["original"]["url"] for c in f["secciones"]["evidencia"]["citas"]
        ]
        self.assertTrue(any("2026" in url for url in urls), urls)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "rojos":
        unittest.main(argv=[sys.argv[0]], verbosity=2)
    else:
        main()
