import json
import gzip
from pathlib import Path

OUT = Path("docs/procedencia/auditorias/cierre-cobertura")


def save(n, d):
    (OUT / n).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n")


common = [
    "andalucia",
    "aragon",
    "asturias",
    "illes-balears",
    "canarias",
    "cantabria",
    "castilla-la-mancha",
    "castilla-y-leon",
    "catalunya",
    "extremadura",
    "galicia",
    "madrid",
    "murcia",
    "la-rioja",
    "comunitat-valenciana",
    "ceuta",
    "melilla",
]
specs = [
    (
        "escala-estatal",
        range(2012, 2027),
        ["estatal-comun"],
        "escala publicada, componente general; no declaración completa",
        "lib/dominio/irpf/cuotas/escalas-publicadas.ts",
        "escalas-publicadas",
        "evidencias-estatales-v2",
        "78 celdas/año aceptadas limitadamente; selector jurídico pendiente",
    ),
    (
        "escala-autonomica",
        range(2012, 2026),
        common,
        "selección autonómica anual, cuotas publicadas donde modeladas",
        "lib/dominio/irpf/cuotas/escalas-publicadas.ts",
        "escalas-publicadas",
        "evidencias-autonomicas-v2",
        "186 decisiones acotadas; fallecimientos y condiciones temporales no ejecutados en binding",
    ),
    (
        "escala-autonomica",
        [2026],
        common,
        "fuera del selector real actual",
        "lib/dominio/irpf/comunidades/comunidad-autonoma.ts",
        "comunidades-autonomas",
        "cadena-autonomica-c",
        "norma disponible no equivale a motor disponible",
    ),
    (
        "foral",
        range(2012, 2027),
        ["navarra", "alava", "bizkaia", "gipuzkoa"],
        "no modelado; País Vasco no es una escala fiscal única",
        "lib/dominio/irpf/comunidades/comunidad-autonoma.ts",
        "comunidades-autonomas",
        None,
        "requiere contratos, puntos de conexión y primarias propias",
    ),
    (
        "minimos",
        range(2012, 2026),
        common + ["simulada-estatal"],
        "perfil histórico parcial de edad/discapacidad",
        "lib/dominio/irpf/minimos/minimo-descendientes.ts",
        "minimos-procedencia",
        "minimos",
        "MIN-001/007 corregidos; elegibilidad general, devengo y reparto no se heredan",
    ),
    (
        "minimos-derechos",
        [2025],
        ["madrid"],
        "individual y devengo ordinario, hechos declarados",
        "lib/dominio/irpf/minimos/derechos.ts",
        "minimos-derechos",
        None,
        "98 pruebas recibidas; nueva revisión pendiente, CX-06-A no cerrado universalmente",
    ),
    (
        "trabajo-gastos",
        [2025],
        ["madrid"],
        "entrada anual explícita, individual, hechos conciliados",
        "lib/dominio/irpf/trabajo-anual/conexion.ts",
        "conexion-anual",
        "conexion-anual-v2",
        "otros años/mezclas no inferidos; TDE-27/28/35 no cerrados",
    ),
    (
        "trabajo-reduccion",
        range(2012, 2027),
        ["regimen-comun"],
        "reducción canónica con otras rentas explícitas; perfil legacy separado",
        "lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts",
        "reduccion-trabajo-procedencia",
        "trabajo-deducciones-estatales",
        "TDE-09/10/18 corregidos, no toda clasificación/gastos/deducciones",
    ),
    (
        "retenciones",
        range(2012, 2017),
        ["regimen-comun"],
        "sin versión inicial canónica",
        "lib/dominio/irpf/retenciones/versiones/catalogo.ts",
        "retenciones-versionadas",
        "retenciones-originales-2012-2016",
        "originales recuperados; lectura jurídica/visual parcial, julio 2015 ambiguo",
    ),
    (
        "retenciones",
        range(2017, 2027),
        ["regimen-comun"],
        "inicial parcial; fecha/cierre expreso, 2026 solo 10-09 a 29-10",
        "lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts",
        "retenciones-versionadas",
        "retenciones-implementacion",
        "regularización rechazada; familias previamente elegibles; no sumar pagadores para simular nómina",
    ),
    (
        "retenciones-soportadas",
        [2025],
        common,
        "importe efectivo declarado separado de estimación inicial",
        "components/liquidacion-irpf.tsx",
        "liquidacion-irpf-anual",
        "conexion-anual-v2",
        "la consignación no verifica pago ni certificado; UI antigua no aporta todos los hechos",
    ),
    (
        "seguridad-social",
        range(2012, 2027),
        ["regimen-general"],
        "12 meses uniformes, analítico, reparto por pagador",
        "lib/dominio/laboral/cotizaciones-perfil-uniforme.ts",
        "cotizaciones-perfil-uniforme",
        "seguridad-social",
        "SS mínimos/horas/RETA fuera; TGSS R05/R06/R10 parcialmente pendientes",
    ),
    (
        "capital-ganancias",
        range(2012, 2027),
        ["regimen-comun"],
        "rentas simplificadas y exenciones acotadas",
        "lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts",
        "ganancias-patrimoniales-procedencia",
        "capital-ganancias",
        "CG-01/02/03 corregidos; CG-04/06 acumulados, CG-08+ alquiler, CG-20/21 bolsas requieren contrato",
    ),
    (
        "ahorro",
        range(2012, 2027),
        ["regimen-comun"],
        "mínimos y régimen temporal separados; no bolsas completas",
        "lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts",
        "ahorro-regimen-historico",
        "escalas-minimos-integracion",
        "no heredar aceptación a todas las compensaciones",
    ),
    (
        "deducciones-autonomicas",
        [2025],
        common,
        "351 fichas; consignación o evaluación parcial por contrato",
        "lib/dominio/irpf/deducciones/contratos-2025.ts",
        "deducciones-contratos",
        "deducciones-implementacion",
        "DED-I-01..05 corregidos en integración R7; condiciones de titulares y hechos externos siguen parciales",
    ),
    (
        "actividades",
        [2025],
        ["madrid"],
        "EDS profesional acotada conectada al anual individual",
        "lib/dominio/irpf/actividades-economicas/calcular.ts",
        "actividades-economicas-2025",
        "actividades-implementacion",
        "no módulos/objetiva/RETA calculado ni mezclas universales",
    ),
    (
        "ipc",
        range(2012, 2027),
        ["espana"],
        "tasas publicadas; 2026 escenario expreso, no observado",
        "lib/dominio/inflacion/factor-ipc.ts",
        "ipc-escenarios-procedencia",
        "coherencia-ipc-v1",
        "índices y medias anuales no equivalen al producto de tasas",
    ),
    (
        "redondeos",
        range(2012, 2027),
        ["contrato-tecnico"],
        "monetario canónico y orden binary64 legacy separados",
        "lib/dominio/compatibilidad-legacy/aritmetica-tabular.ts",
        "redondeos-legacy-oracle",
        "redondeos-legacy-v1",
        "recibo Excel independiente no acepta fiscalidad; TGSS por etapa incompleto",
    ),
]
rows = []
for domain, years, territories, contract, code, test, review, limit in specs:
    for year in years:
        for territory in territories:
            rows.append(
                dict(
                    dominio=domain,
                    anio=year,
                    territorio=territory,
                    contrato=contract,
                    codigo=code,
                    test="tests/" + test + ".test.ts",
                    revision=review,
                    limite=limit,
                    inventariado=True,
                    candidato=True,
                    contrarrevisadoAcotado="ver decisión exacta; no universal"
                    if review
                    else "pendiente",
                    implementado=False
                    if domain == "foral"
                    or (domain == "escala-autonomica" and year == 2026)
                    or (domain == "retenciones" and year < 2017)
                    else "parcial según contrato",
                    bindingAceptado="no acreditado para esta fila",
                    reglaCompleta=False,
                )
            )
save("matriz-contratos.json", rows)
# Independent interpretation is never inferred from a literal ID match.
records = json.loads(gzip.decompress((OUT / "registros.json.gz").read_bytes()))
byid: dict[str, list[dict[str, str]]] = {}
for r in records:
    byid.setdefault(r["id"], []).append(dict(path=r["source"], pointer=r["pointer"]))
ledger = []
for p in sorted(Path("docs/procedencia/auditorias").glob("*/hallazgos.json")):
    data = json.loads(p.read_text())
    data = (
        data
        if isinstance(data, list)
        else data.get("findings", data.get("hallazgos", []))
    )
    if not isinstance(data, list):
        continue
    for i, r in enumerate(data):
        if not isinstance(r, dict) or "id" not in r:
            continue
        ledger.append(
            dict(
                id=r["id"],
                origen=dict(path=str(p), pointer="/" + str(i)),
                dominio=r.get("domain"),
                anios=r.get("years"),
                territorios=r.get("territories"),
                estadoOriginal=r.get("status"),
                codigoDeclarado=r.get("engineLocations", []),
                evidenciaPrimariaDeclarada=r.get("sources", []),
                referenciasMismoId=byid.get(r["id"], []),
                decisionIndependiente="consultar alcance individual; coincidencia ID no prueba identidad",
                fix="no inferido: usar relaciones-literales y casos dirigidos del informe",
                binding="no inferido",
                paginaRastro="no inferido",
                reglaCompleta=False,
            )
        )
# Avoid duplicating acquisition headers or personal identity into new public output.
for r in ledger:
    r["evidenciaPrimariaDeclarada"] = [
        {
            k: v
            for k, v in s.items()
            if k
            in (
                "canonicalUrl",
                "sha256",
                "sha512",
                "page",
                "pages",
                "quote",
                "title",
                "officialId",
            )
        }
        if isinstance(s, dict)
        else s
        for s in r["evidenciaPrimariaDeclarada"]
    ]
(OUT / "matriz-hallazgos.json.gz").write_bytes(
    gzip.compress(
        (json.dumps(ledger, ensure_ascii=False, indent=2) + "\n").encode(), mtime=0
    )
)
print(len(rows), len(ledger))
