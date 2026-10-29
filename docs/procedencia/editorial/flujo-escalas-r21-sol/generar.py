"""Contrato candidato de flujo; las aristas se eligen por lectura, no por AST heurístico."""

from __future__ import annotations
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any

OUT = Path(__file__).resolve().parent
ED = Path("docs/procedencia/correcciones/editorial-r21")
BASE = "960773f909d4ecff290edfa3d7a7b2699a8445d3"
L = "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts"
X = "lib/dominio/irpf/trabajo-anual/conexion.ts"
G = "lib/dominio/irpf/cuotas/escalas-gravamen.ts"
P = "lib/dominio/irpf/cuotas/escalas-publicadas.ts"
A = "lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts"
M = "lib/dominio/irpf/minimos/"
C = "lib/dominio/irpf/comunidades/comunidad-autonoma.ts"
D = "lib/dominio/normativa/datos/"


def read(path: str | Path) -> Any:
    p = Path(path)
    if not p.exists():
        with gzip.open(str(p) + ".gz", "rt") as stream:
            return json.load(stream)
    return json.loads(p.read_text())


def sha(path: str | Path) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write(name: str, data: Any) -> None:
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


AST: dict[str, Any] = {}
NODES: dict[str, Any] = {}
LINKS: dict[str, list[tuple[str, str]]] = {}


def node(file: str, symbol: str) -> str:
    key = file + "#" + symbol
    if key not in NODES:
        choices = [d for d in AST[file]["declarations"] if d["symbol"] == symbol]
        if len(choices) > 1 and file == L:
            scope = next(
                d
                for d in AST[L]["declarations"]
                if d["symbol"] == "liquidarTrabajoIndividualSimple"
            )
            choices = [d for d in choices if scope["start"] < d["start"] < scope["end"]]
        assert len(choices) == 1, (key, len(choices))
        d = choices[0]
        NODES[key] = {
            "symbol": symbol,
            "source": {
                "file": file,
                "sha256": AST[file]["sha256"],
                "start": d["start"],
                "end": d["end"],
                "offsetEncoding": "utf16",
            },
            "expression": d["text"],
            "imports": AST[file]["imports"],
        }
    return key


def link(file: str, symbol: str, deps: list[tuple[str, str]], why: str) -> None:
    key = node(file, symbol)
    LINKS[key] = [(node(f, s), why) for f, s in deps]


def main() -> None:
    global AST
    AST = {r["file"]: r for r in read(OUT / "ast.json")}
    # DAG de valores: argumentos realmente consumidos; controles se registran aparte.
    local: dict[str, list[str]] = {
        "baseLiquidableGeneral": ["baseImponibleGeneral"],
        "baseImponibleGeneral": [
            "rendimientoTrabajo",
            "reduccionRendimientosTrabajo",
            "rendimientoCapitalInmobiliario",
            "gananciasPatrimoniales",
        ],
        "baseLiquidableAhorro": ["gananciasPatrimoniales"],
        "otrasRentasNoExentas": [
            "rendimientoCapitalInmobiliario",
            "gananciasPatrimoniales",
        ],
        "reduccionRendimientosTrabajo": ["rendimientoTrabajo", "otrasRentasNoExentas"],
        "rendimientoTrabajo": ["rendimientoIntegroTrabajo", "cotizacionesSociales"],
        "cotizacionesSociales": ["rendimientoIntegroTrabajo"],
        "rendimientoCapitalInmobiliario": ["rendimientoIntegroCapitalInmobiliario"],
        "cuotaIntegraGeneral": [
            "cuotaIntegraGeneralEstatal",
            "cuotaIntegraGeneralAutonomica",
        ],
        "cuotaIntegraGeneralEstatal": [
            "baseLiquidableGeneral",
            "tramosIrpfEstatalGeneral",
            "escalasPublicadasEstatales",
        ],
        "cuotaIntegraGeneralAutonomica": [
            "baseLiquidableGeneral",
            "parametrosComunidad",
            "escalasPublicadasAutonomicas",
        ],
        "tramosIrpfEstatalGeneral": ["parametrosComunidad"],
        "escalasPublicadasAutonomicas": ["escalaPublicadaAutonomica"],
        "parametrosComunidad": ["resultadoParametrosComunidad"],
        "resultadoParametrosComunidad": ["baseLiquidableGeneral"],
        "cuotaIntegraAhorro": ["baseLiquidableAhorro"],
        "desgloseCuotaIntegraAhorro": ["baseLiquidableAhorro"],
        "desgloseCuotaIntegraGeneralEstatal": [
            "baseLiquidableGeneral",
            "tramosIrpfEstatalGeneral",
            "escalasPublicadasEstatales",
        ],
        "desgloseCuotaIntegraGeneralAutonomica": [
            "baseLiquidableGeneral",
            "parametrosComunidad",
            "escalasPublicadasAutonomicas",
        ],
        "minimoContribuyente": ["minimosEstatales"],
        "minimoAscendientes": ["minimosEstatales"],
        "minimoDescendientes": ["derechosEstatales", "minimosEstatales"],
        "minimoDiscapacidadContribuyente": ["minimosEstatales"],
        "minimoDiscapacidadFamiliares": ["derechosEstatales", "minimosEstatales"],
        "minimoPersonalYFamiliar": [
            "minimoContribuyente",
            "minimoAscendientes",
            "minimoDescendientes",
            "minimoDiscapacidadContribuyente",
            "minimoDiscapacidadFamiliares",
        ],
        "minimoPersonalYFamiliarAutonomico": [
            "derechosAutonomicos",
            "parametrosComunidad",
        ],
        "derechosEstatales": ["minimosEstatales"],
        "derechosAutonomicos": ["parametrosComunidad"],
        "cuotaMinimoPersonalEstatal": [
            "minimoPersonalYFamiliar",
            "baseLiquidableGeneral",
            "tramosIrpfEstatalGeneral",
            "escalasPublicadasEstatales",
        ],
        "cuotaMinimoPersonalAutonomica": [
            "minimoPersonalYFamiliarAutonomico",
            "baseLiquidableGeneral",
            "parametrosComunidad",
            "escalasPublicadasAutonomicas",
        ],
        "cuotaMinimoPersonal": [
            "cuotaMinimoPersonalEstatal",
            "cuotaMinimoPersonalAutonomica",
        ],
        "desgloseCuotaMinimoPersonalEstatal": [
            "minimoPersonalYFamiliar",
            "baseLiquidableGeneral",
            "tramosIrpfEstatalGeneral",
            "escalasPublicadasEstatales",
        ],
        "desgloseCuotaMinimoPersonalAutonomica": [
            "minimoPersonalYFamiliarAutonomico",
            "baseLiquidableGeneral",
            "parametrosComunidad",
            "escalasPublicadasAutonomicas",
        ],
        "ahorroConMinimos": [
            "baseLiquidableAhorro",
            "baseLiquidableGeneral",
            "minimoPersonalYFamiliar",
            "minimoPersonalYFamiliarAutonomico",
        ],
        "cuotaMinimoPersonalAhorro": ["ahorroConMinimos"],
        "cuotaGeneralDespuesMinimo": ["cuotaIntegraGeneral", "cuotaMinimoPersonal"],
        "cuotaAutonomicaGeneralDespuesMinimo": [
            "cuotaIntegraGeneralAutonomica",
            "cuotaMinimoPersonalAutonomica",
        ],
        "cuotaAhorroDespuesMinimo": ["cuotaIntegraAhorro", "cuotaMinimoPersonalAhorro"],
        "deduccionesAutonomicasAplicadas": [
            "deduccionesAutonomicasDeclaradas",
            "cuotaAutonomicaGeneralDespuesMinimo",
            "ahorroConMinimos",
        ],
        "cuotaLiquida": [
            "cuotaGeneralDespuesMinimo",
            "cuotaAhorroDespuesMinimo",
            "deduccionesAutonomicasAplicadas",
        ],
        "pagosACuentaAplicadosCentimos": ["retencionTrabajoAeatCentimos"],
        "retencionTrabajoAeatCentimos": ["retencionTrabajoAeat"],
    }
    for s, deps in local.items():
        link(
            L,
            s,
            [(L, d) for d in deps],
            "Asignación, argumento o operación aritmética visible; solo propiedades consumidas, según expression. Las ramas son condicionales, no simultáneas.",
        )
    extra = {
        "baseImponibleGeneral": [
            (
                "lib/dominio/irpf/integracion/base-imponible-general.ts",
                "calcularBaseImponibleGeneral",
            )
        ],
        "baseLiquidableAhorro": [
            (
                "lib/dominio/irpf/integracion/base-imponible-ahorro.ts",
                "calcularBaseImponibleAhorro",
            )
        ],
        "reduccionRendimientosTrabajo": [
            (
                "lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts",
                "calcularReduccionTrabajoConOtrasRentas",
            )
        ],
        "resultadoParametrosComunidad": [(C, "obtenerParametrosComunidadAutonoma")],
        "escalaPublicadaAutonomica": [(P, "obtenerEscalaAutonomicaPublicada")],
        "escalasPublicadasEstatales": [
            (P, "ESTATAL_ORDINARIA_2012_2014"),
            (P, "ESTATAL_COMPLEMENTARIA_2012_2014"),
        ],
        "cuotaIntegraAhorro": [(A, "calcularCuotaPorEscalaAhorro")],
        "desgloseCuotaIntegraAhorro": [(A, "calcularDesgloseCuotaPorEscalaAhorro")],
        "ahorroConMinimos": [(A, "calcularAhorroConMinimos")],
        "minimoPersonalYFamiliarAutonomico": [(L, "calcularMinimoPersonalYFamiliar")],
        "derechosEstatales": [(M + "derechos.ts", "calcularDerechosMinimos")],
        "derechosAutonomicos": [(M + "derechos.ts", "calcularDerechosMinimos")],
    }
    for suffix, f, names in [
        ("Contribuyente", "minimo-contribuyente.ts", ["obtenerMinimoContribuyente"]),
        ("Ascendientes", "minimo-ascendientes.ts", ["obtenerMinimoAscendientes"]),
        ("Descendientes", "minimo-descendientes.ts", ["obtenerMinimoDescendientes"]),
        (
            "DiscapacidadContribuyente",
            "minimo-discapacidad.ts",
            ["obtenerMinimoDiscapacidadContribuyente"],
        ),
        (
            "DiscapacidadFamiliares",
            "minimo-discapacidad.ts",
            [
                "obtenerMinimoDiscapacidadFamiliares",
                "obtenerMinimoDiscapacidadAscendientes",
            ],
        ),
    ]:
        extra["minimo" + suffix] = [(M + f, n) for n in names]
    for s, extra_deps in extra.items():
        k = node(L, s)
        LINKS.setdefault(k, []).extend(
            (node(f, d), "Llamada/importación explícita; ver argumentos exactos.")
            for f, d in extra_deps
        )
    for s in [
        "cuotaIntegraGeneralEstatal",
        "cuotaMinimoPersonalEstatal",
        "desgloseCuotaIntegraGeneralEstatal",
        "desgloseCuotaMinimoPersonalEstatal",
    ]:
        LINKS[node(L, s)].extend(
            (node(G, d), "Rama real o simulada, según usaEscalaAutonomicaReal.")
            for d in [
                "calcularDesgloseCuotaPorEscala",
                "calcularDesgloseCuotaPorEscalaGeneral",
            ]
        )
    for s in [
        "cuotaIntegraGeneralAutonomica",
        "cuotaMinimoPersonalAutonomica",
        "desgloseCuotaIntegraGeneralAutonomica",
        "desgloseCuotaMinimoPersonalAutonomica",
    ]:
        LINKS[node(L, s)].append(
            (
                node(G, "calcularDesgloseCuotaPorEscala"),
                "Rama real; rama simulada produce cero o ningún tramo.",
            )
        )
    for s in ["calcularCuotaPorEscalaAhorro", "calcularDesgloseCuotaPorEscalaAhorro"]:
        link(
            A,
            s,
            [
                (D + "irpf-estatal-2012-2026.ts", "obtenerTramosIrpfAhorro"),
                (G, "calcularDesgloseCuotaPorEscala"),
            ],
            "Escala conjunta integrada; no consume tablas AHORRO publicadas por componente.",
        )
    link(
        A,
        "calcularAhorroConMinimos",
        [(A, "calcularCuotaComponenteAhorro")],
        "Dos componentes separados; orden F(B-r) hasta2014, F(B)-F(r) desde2015; remanente limitado a base del ahorro.",
    )
    link(
        A,
        "calcularCuotaComponenteAhorro",
        [(P, "obtenerEscalasAhorroPublicadas"), (G, "calcularDesgloseCuotaPorEscala")],
        "Tablas publicadas por año y componente; tramos integrados vacío.",
    )
    for y in [2012, 2013, 2014]:
        LINKS.setdefault(node(L, "minimosEstatales"), []).append(
            (
                node(D + f"minimos-autonomicos-{y}.ts", f"MINIMOS_ESTATALES_{y}"),
                "Selección nominal del año exacto, no intervalo universal.",
            )
        )
    LINKS[node(L, "minimosEstatales")].append(
        (
            node(D + "minimos-autonomicos-2025.ts", "MINIMOS_ESTATALES_2025"),
            "Desde2015 vía servicio; continuidad técnica, no vigencia acreditada.",
        )
    )
    # Conexión explícita: neto tiene asignaciones posteriores; se conserva su bloque completo.
    for s, deps in {
        "cuotaEstatal": ["base", "parametros"],
        "cuotaAutonomica": ["base", "parametros", "publicada"],
        "base": ["neto"],
        "liquida": ["cuotaEstatal", "cuotaAutonomica"],
    }.items():
        link(
            X,
            s,
            [(X, d) for d in deps],
            "Operación explícita con base positiva; BIG/BLG conservan neto con signo.",
        )
    for s in ["cuotaEstatal", "cuotaAutonomica"]:
        LINKS[node(X, s)].append(
            (
                node(G, "calcularDesgloseCuotaPorEscala"),
                "Estatal integra; autonómica usa publicada si existe.",
            )
        )
    LINKS[node(X, "cuotaEstatal")].append(
        (
            node(D + "minimos-autonomicos-2025.ts", "MINIMOS_ESTATALES_2025"),
            "Solo contribuyente.general; no todo el juego.",
        )
    )
    link(
        X,
        "parametros",
        [(C, "obtenerParametrosComunidadAutonoma")],
        "Madrid2025, sin fallecimiento.",
    )
    link(
        X,
        "publicada",
        [(P, "obtenerEscalaAutonomicaPublicada")],
        "Madrid2025, sin fallecimiento.",
    )

    # Escrituras explícitas: no inferir flujo de la declaración inicial mutable.
    def write_node(symbol: str, expression: str, condition: str) -> str:
        text = Path(X).read_text()
        index = text.index(expression)
        assert text.count(expression) == 1
        key = X + "#" + symbol + "@" + str(index)
        NODES[key] = {
            "symbol": symbol,
            "source": {
                "file": X,
                "sha256": sha(X),
                "start": len(text[:index].encode("utf-16-le")) // 2,
                "end": len(text[: index + len(expression)].encode("utf-16-le")) // 2,
                "offsetEncoding": "utf16",
            },
            "expression": expression,
            "condition": condition,
        }
        return key

    neto_work = write_node(
        "neto",
        "neto = new D(trabajo.rendimientoAntesArt20)",
        "perfil solo-trabajo, adaptación disponible",
    )
    neto_reduce = write_node(
        "neto",
        "neto = neto.minus(reduccionArt20)",
        "perfil solo-trabajo, una vez tras artículo19",
    )
    neto_eds = write_node(
        "neto",
        "neto = new D(actividad.aporte.importeEurosExactos)",
        "perfil solo-actividad-eds, adaptación disponible",
    )
    posterior_da = write_node(
        "posterior",
        "posterior = new D(resultado.cuotaPosterior)",
        "brutoServicios.gt(0), resultado DA61 soportado",
    )
    LINKS[node(X, "neto")] = [
        (neto_reduce, "Rama trabajo; escritura final de neto."),
        (neto_eds, "Rama EDS; aporte ya reducido sin artículo20 salarial."),
    ]
    LINKS[neto_reduce] = [
        (neto_work, "Valor previo en esta rama."),
        (
            node(X, "reduccionArt20"),
            "min(max(neto,0), reducción sobre argumentoArt20); otras rentas0.",
        ),
    ]
    LINKS[neto_work] = [
        (
            node(X, "trabajo"),
            "Propiedad rendimientoAntesArt20, no retenciones ni pagos.",
        )
    ]
    LINKS[neto_eds] = [
        (
            node(X, "actividad"),
            "Solo aporte.importeEurosExactos, no retencionesEuros/pagosFraccionadosEuros.",
        )
    ]
    LINKS[node(X, "posterior")] = [
        (node(X, "liquida"), "Inicialización y rama sin servicios."),
        (
            posterior_da,
            "Sustituye valor solo cuando brutoServicios>0; no vuelve a restar DA61.",
        ),
    ]
    LINKS[posterior_da] = [
        (node(X, "resultado"), "Solo cuotaPosterior del resultado soportado.")
    ]
    link(
        X,
        "trabajo",
        [("lib/dominio/irpf/trabajo-anual/adaptador.ts", "adaptarTrabajoAnual")],
        "Adaptación de trabajo; art19 y argumentoArt20 distintos.",
    )
    link(
        X,
        "actividad",
        [
            (
                "lib/dominio/irpf/actividades-economicas/adaptador.ts",
                "adaptarActividadGeneral",
            )
        ],
        "Aporte EDS ya contiene RETA y artículo32.",
    )
    link(
        X,
        "resultado",
        [
            ("lib/dominio/irpf/trabajo-anual/calcular.ts", "calcularDeduccionTrabajo"),
            (X, "liquida"),
            (X, "base"),
            (X, "brutoServicios"),
        ],
        "DA61 después de artículo80; brutoServicios solo de empleo, no pensión.",
    )
    link(
        X,
        "reduccionArt20",
        [
            (
                "lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts",
                "calcularReduccionTrabajoConOtrasRentas",
            ),
            (X, "trabajo"),
        ],
        "Escritura de reduccionArt20 visible en el bloque de conexión, limita reducción al neto positivo.",
    )
    link(
        "lib/dominio/irpf/trabajo-anual/adaptador.ts",
        "adaptarTrabajoAnual",
        [("lib/dominio/irpf/trabajo-anual/calcular.ts", "calcularGastosTrabajo")],
        "Consume netoArt19 y netoPrevioArt20, no íntegro aislado.",
    )
    link(
        "lib/dominio/irpf/actividades-economicas/adaptador.ts",
        "adaptarActividadGeneral",
        [
            (
                "lib/dominio/irpf/actividades-economicas/calcular.ts",
                "calcularActividad2025",
            )
        ],
        "Consume aporte del cálculo EDS.",
    )
    # La selección de titulares cambia cuantía, además de las guardas de admisión.
    link(
        M + "derechos.ts",
        "calcularDerechosMinimos",
        [
            (M + "derechos.ts", "titularesConDerecho"),
            (M + "derechos.ts", "validarDerechosMinimos"),
            (M + "minimo-contribuyente.ts", "obtenerMinimoContribuyente"),
            (M + "minimo-discapacidad.ts", "obtenerMinimoDiscapacidadFamiliares"),
        ],
        "Selección antes de ordenar y divisor por derecho; contribuyente no dividido.",
    )
    link(
        M + "derechos.ts",
        "titularesConDerecho",
        [(M + "derechos.ts", "cumpleRentas"), (M + "derechos.ts", "tieneRelacion")],
        "Renta descendiente distinta de renta titulares cercanos; filtro, prioridad de grado y titulares.",
    )
    link(
        M + "derechos.ts",
        "validarDerechosMinimos",
        [(M + "derechos-contrato.ts", "DerechosMinimos2025")],
        "Schema y coherencia restringen el dominio; no sumandos monetarios.",
    )
    roots = {
        "base.ahorro": ["baseLiquidableAhorro"],
        "base.general-imponible": ["baseImponibleGeneral"],
        "base.general-liquidable": ["baseLiquidableGeneral"],
        "cuota.ahorro-componente-postminimo": ["ahorroConMinimos"],
        "cuota.ahorro-total": ["cuotaIntegraAhorro"],
        "cuota.ahorro-tramo": ["desgloseCuotaIntegraAhorro"],
        "cuota.diferencial": ["cuotaLiquida", "pagosACuentaAplicadosCentimos"],
        "cuota.general-autonomica-tramo": ["desgloseCuotaIntegraGeneralAutonomica"],
        "cuota.general-estatal-tramo": ["desgloseCuotaIntegraGeneralEstatal"],
        "cuota.general-total": ["cuotaIntegraGeneral"],
        "cuota.liquida": ["cuotaLiquida"],
        "cuota.minimo-ahorro-total": ["cuotaMinimoPersonalAhorro"],
        "cuota.minimo-autonomico-tramo": ["desgloseCuotaMinimoPersonalAutonomica"],
        "cuota.minimo-estatal-tramo": ["desgloseCuotaMinimoPersonalEstatal"],
        "cuota.minimo-general-total": ["cuotaMinimoPersonal"],
        "deducciones.autonomicas": ["deduccionesAutonomicasAplicadas"],
        "minimo.ascendientes": ["minimoAscendientes"],
        "minimo.autonomico": ["minimoPersonalYFamiliarAutonomico"],
        "minimo.contribuyente": ["minimoContribuyente"],
        "minimo.descendientes": ["minimoDescendientes"],
        "minimo.discapacidad": [
            "minimoDiscapacidadContribuyente",
            "minimoDiscapacidadFamiliares",
        ],
        "minimo.estatal": ["minimoPersonalYFamiliar"],
        "explicito.big": ["neto"],
        "explicito.blg": ["neto"],
        "explicito.cuota.autonomica": ["cuotaAutonomica"],
        "explicito.cuota.estatal": ["cuotaEstatal"],
        "explicito.cuota.liquida-legal": ["liquida"],
        "explicito.cuota.posterior": ["posterior"],
    }
    catalog = read("lib/procedencia/rastro-generado.json")
    bindings = {r["siteId"]: r for r in catalog["bindings"]}
    sites = []
    for ficha in read(ED / "escalas-fichas.json"):
        sid = ficha["selector"]["siteId"]
        file = X if ".explicito." in sid else L
        source = Path(file).read_text()
        exact = ficha["selector"]["codigoExacto"]
        start = source.index(exact)
        span = {
            "file": file,
            "sha256": sha(file),
            "start": len(source[:start].encode("utf-16-le")) // 2,
            "end": len(source[: start + len(exact)].encode("utf-16-le")) // 2,
            "offsetEncoding": "utf16",
        }
        direct = [node(file, s) for s in roots[sid.removeprefix("anual.")]]

        # Una arista directa desde cada argumento de importe, no desde etiqueta/formula.
        def edge(chain: list[str], why: str) -> dict[str, Any]:
            return {
                "symbol": NODES[chain[-1]]["symbol"],
                "chain": chain,
                "reason": why,
                "conditions": {
                    "temporal": "Ejercicio del caso; selector exacto en los nodos. No hereda vigencia jurídica.",
                    "territorial": "Territorio del caso; real/simulado separados. Explícito solo Madrid2025.",
                    "contract": "Derechos opcionales solo Madrid2025, conciliados; explícito sin familiares. Cada rama consume únicamente las propiedades visibles de sus argumentos.",
                },
            }

        trans = []

        def walk(chain: list[str]) -> None:
            for target, why in LINKS.get(chain[-1], []):
                assert target not in chain, chain
                new = [*chain, target]
                trans.append(edge(new, why))
                walk(new)

        for r in direct:
            walk([r])
        controls = []
        if file == X:
            control_specs = [
                ("lib/dominio/irpf/trabajo-anual/conexion-contrato.ts", "Alcance"),
                (X, "liquidarIrpfAnualExplicito"),
            ]
        else:
            control_specs = [
                (L, "construirLiquidarIrpfAnual"),
                (L, "detectarCasoNoSoportado"),
                (M + "derechos.ts", "validarRentasAnualesDerechos"),
                (M + "derechos.ts", "hayAlimentosPropiosSinMinimo"),
                (M + "derechos-contrato.ts", "DerechosMinimos2025"),
            ]
        for f, s in control_specs:
            controls.append(
                edge(
                    [node(f, s)],
                    "Restringe admisión/producción de salida; no se suma como importe. Derechos solo si presentes.",
                )
            )
        omissions = []
        if any(
            "rendimiento" in k or "ganancias" in k or "neto" in k
            for k in [*direct, *[n for e in trans for n in e["chain"]]]
        ):
            omissions.append(
                "Los submotores de trabajo/cotizaciones/ganancias/EDS se conservan como fronteras de llamada o bloque; falta descomponer cada literal y propiedad interna como arista propia. No es cierre exhaustivo de esos dominios."
            )
        if file == X:
            omissions.append(
                "Escrituras neto y posterior localizadas por rama; falta descomponer todas las propiedades internas de los submotores trabajo/EDS y DA61, sin inferirlas del bloque compartido."
            )
        if any(
            "parametrosComunidad" in k or "#parametros" in k
            for k in [*direct, *[n for e in trans for n in e["chain"]]]
        ):
            omissions.append(
                "El selector anual de comunidad queda localizado, pero no están descompuestos todos sus resolutores/importaciones y mínimos condicionados por renta (incluida Catalunya). No autorizar wiring de tabla anual por nombre."
            )
        omissions.append(
            "Funciones terminales conservan cuerpo exacto; sus símbolos internos no se convierten automáticamente en aristas. Otra revisión debe validar y completar ese desglose antes del wiring."
        )
        excluded = []
        for f, s, reason in [
            (
                L,
                "pagosACuentaAplicadosCentimos",
                "Pagos no alimentan bases, mínimos ni cuotas anteriores al diferencial.",
            ),
            (
                L,
                "cuotaIntegraAhorro",
                "La bruta conjunta no equivale al resultado por componente.",
            ),
            (X, "retenciones", "No se resta al obtener BIG/BLG o cuota líquida legal."),
        ]:
            k = node(f, s)
            if k not in direct and not any(k in e["chain"] for e in trans):
                excluded.append(
                    {"symbol": s, "source": NODES[k]["source"], "reason": reason}
                )
        if sid in ["anual.minimo.contribuyente", "anual.minimo.ascendientes"]:
            key = node(M + "derechos.ts", "titularesConDerecho")
            excluded.append(
                {
                    "symbol": "titularesConDerecho",
                    "source": NODES[key]["source"],
                    "reason": "Seleccionar descendientes no modifica el mínimo propio ni el cero de ascendientes del contrato explícito; sus hechos pueden restringir admisión, que se registra aparte.",
                }
            )
        sites.append(
            {
                "siteId": sid,
                "subject": bindings[sid]["sujeto"],
                "snapshot": catalog["actual"]["versiones"],
                "source": span,
                "expression": exact,
                "historicalSelectorPreserved": ficha["selector"]["sujeto"],
                "valueDependencies": {
                    "direct": [
                        edge(
                            [r],
                            "Importe de llamada; ver expresión y contenedor del map para tramo/componente.",
                        )
                        for r in direct
                    ],
                    "transitive": trans,
                },
                "controlDependencies": controls,
                "excludedCoLocations": excluded,
                "sections": {
                    section: {
                        "text": entry["texto"],
                        "state": "candidate",
                        "wiringBlocker": (
                            "La identidad y expresión están fijadas; revisar las omisiones de flujo antes de convertirlas en aristas publicadas."
                            if section in ["formula", "derivacion"]
                            else "Conservar ámbito y reservas de esta afirmación; no promover por el cierre técnico."
                        ),
                    }
                    for section, entry in ficha["secciones"].items()
                },
                "completeness": {
                    "technical": "partial-explicit-omissions",
                    "legalAcceptance": False,
                    "independentReview": "pending",
                    "omissions": omissions,
                },
            }
        )
    write(
        "flujo.json",
        {
            "version": 1,
            "base": BASE,
            "inventory": {
                "manifestSha256": sha("docs/procedencia/inventario.json"),
                "artifactSha256": sha("docs/procedencia/inventario-datos.json.gz"),
            },
            "sites": sites,
        },
    )
    # Transporte individual de las 264 identidades hacia consumidores realmente existentes.
    cells = []
    manifest = read("docs/procedencia/inventario.json")
    with gzip.open("docs/procedencia/inventario-datos.json.gz", "rt") as stream:
        packed = json.load(stream)
    wanted = {c["selector"]["itemId"] for c in read(ED / "escalas-celdas.json")}
    occurrences = {}
    for name, content in packed:
        if name.startswith("inventario-pagina-"):
            data = json.loads(content)
            rows = data if isinstance(data, list) else data.get("items", [])
            for row in rows:
                if row["id"] in wanted:
                    occurrences[row["id"]] = row
    for cell in read(ED / "escalas-celdas.json"):
        sel = cell["selector"]
        pid = Path(
            "docs/procedencia/correcciones/integracion-r19/candidatos/payloads"
        ) / ("ambito-r19-" + cell["id"] + ".json")
        payload = read(pid)
        assert (
            payload["itemId"] == sel["itemId"]
            and payload["source"]["symbol"] == sel["simbolo"]
            and payload["source"]["tablePath"] == sel["ruta"]
        )
        assert payload["inventory"]["manifestSha256"] == sha(
            "docs/procedencia/inventario.json"
        )
        assert sel["itemId"] in occurrences, sel["itemId"]
        occurrence = occurrences[sel["itemId"]]
        assert occurrence["symbol"] == sel["simbolo"]
        table = node(sel["archivo"], sel["simbolo"])
        state = sel["simbolo"].startswith("ESTATAL_")
        consumers = (
            ["anual.cuota.general-estatal-tramo", "anual.cuota.minimo-estatal-tramo"]
            if state
            else [
                "anual.cuota.general-autonomica-tramo",
                "anual.cuota.minimo-autonomico-tramo",
            ]
        )
        paths = []
        for sid in consumers:
            site = next(s for s in sites if s["siteId"] == sid)
            # Tabla autonómica entra a través del selector; estatal por array explícito.
            selector = (
                node(L, "escalasPublicadasEstatales")
                if state
                else node(P, "obtenerEscalaAutonomicaPublicada")
            )
            paths.append(
                {
                    "siteId": sid,
                    "chain": [
                        table,
                        selector,
                        *[e["chain"][0] for e in site["valueDependencies"]["direct"]],
                    ],
                    "conditions": {
                        "payloadScope": payload["scope"],
                        "runtime": "Solo si la tabla devuelta contiene esta fila y findLast la selecciona con base>0; la cuota fija afecta a esa fila, el límite también al cambio de selección. Murcia60000 es estricto. Mínimos usan min(M,BG); no BA.",
                    },
                    "role": "cuota fija sumada"
                    if cell["columna"] == "cuota"
                    else "límite: selección de fila y resta de exceso; no cuota fija",
                }
            )
        downstream = [
            "anual.cuota.general-total",
            "anual.cuota.minimo-general-total",
            "anual.cuota.liquida",
            "anual.cuota.diferencial",
        ]
        if not state:
            downstream.append("anual.deducciones.autonomicas")
        cells.append(
            {
                "id": cell["id"],
                "occurrenceId": sel["itemId"],
                "occurrence": occurrence,
                "payload": {
                    "path": str(pid),
                    "sha256": sha(pid),
                    "acceptance": "pending; no heredada",
                },
                "source": NODES[table]["source"],
                "symbol": sel["simbolo"],
                "tablePath": sel["ruta"],
                "value": cell["valor"],
                "unit": cell["unidad"],
                "role": "Q EUR impuesto"
                if cell["columna"] == "cuota"
                else "L EUR renta; umbral y origen del exceso",
                "rate": "fila.tipo, fracción adimensional; NO cubierta por decisión EUR",
                "consumers": paths,
                "downstreamSiteIds": downstream,
                "excluded": [
                    "anual.cuota.ahorro-total",
                    "anual.cuota.ahorro-tramo",
                    "anual.cuota.ahorro-componente-postminimo",
                    "anual.base.general-imponible",
                    "anual.base.ahorro",
                    "anual.explicito.cuota.autonomica",
                    "anual.explicito.cuota.estatal",
                ],
                "conditions": payload["scope"],
                "case": cell["casoIndependiente"],
                "completeness": "Tabla y consumidores candidatos resueltos por identidad; falta revisión de aristas y dominio de selección del payload nominal.",
            }
        )
    assert len(cells) == 264 and len(sites) == 28
    write("celdas-flujo.json", cells)
    write("nodos.json", NODES)
    write(
        "control-generacion.json",
        {
            "sites": len(sites),
            "cells": len(cells),
            "occurrencesResolved": len(occurrences),
            "nodes": len(NODES),
            "inventory": manifest["artifact"],
            "acceptance": False,
        },
    )


if __name__ == "__main__":
    main()
