import json
import gzip
import pathlib
import re

OUTPUT = pathlib.Path("docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol")
B = json.loads(gzip.decompress((OUTPUT / "pasajes-primarios.json.gz").read_bytes()))
cs = {c["cita"]: c for c in B}
claims = [
    (
        "ART19-AE",
        "7393a032cbcb-p12",
        r"cotizaciones|derechos pasivos|colegios de huérfanos|cuotas satisfechas|defensa jurídica",
        "a-e efectivos, tope300;500 procede de reglamento distinto",
    ),
    (
        "ART19-F",
        "7393a032cbcb-p12",
        r"2.000 euros|tendrán como límite",
        "Gasto f y límite por saldo, no suelo de pérdida a-e",
    ),
    (
        "ART20-SIN-F",
        "7393a032cbcb-p12",
        r"A estos efectos|saldo resultante",
        "Argumento a-e; reducción no genera saldo negativo",
    ),
    (
        "ART20-2024",
        "0236d8d10472-p23",
        r"14.852|17.673|19.747|7.302|2.364",
        "Fórmula2024+; no reforma de retención por mera igualdad temporal",
    ),
    (
        "ART20-2018",
        "aac01cdb3005-p78",
        r"devengado|mitad de la diferencia|satisfechos",
        "Separar devengo anual de pago/retención",
    ),
    (
        "ART20-2023",
        "758a2d02ef82-p84",
        r"14.047|6.498|1,14",
        "Reforma art20, no usar para aumentar art32 a7302",
    ),
    (
        "DA61",
        "9657d0c565a0-p47",
        r"16.576|18.276|340|cuotas íntegras|cuota líquida",
        "Umbral bruto, límite proporcional, después80",
    ),
    (
        "DA61-ACTIVO",
        "9657d0c565a0-p46",
        r"efectiva de servicios|2025|sexagésima primera",
        "La calificación servicio es distinta de toda pensión/trabajo",
    ),
    (
        "COLEGIO500",
        "0f6003cfa63f-p17",
        r"500 euros|colegios profesionales",
        "Pasaje reglamentario primario disponible, no enlazado en la ficha del tope",
    ),
    (
        "EDS-CLIENTE",
        "7393a032cbcb-p18",
        r"30 por ciento|70 por ciento|única persona|incompatible",
        "Requisitos materiales; gastos incluyen RETA+A y sujeto no es importe retenido",
    ),
    (
        "EDS-5-2000",
        "6fe8785ba1a1-p7",
        r"5 por ciento|2.000 euros",
        "Tope ordinario y base antes de G",
    ),
    (
        "EDS-INICIO",
        "4cf41092d949-p16",
        r"20 por ciento|100.000|50 por ciento|período impositivo siguiente",
        "Historia positivo y empleador; igualdad50 no excluye",
    ),
    (
        "EDS-ART32-2023",
        "758a2d02ef82-p85",
        r"14.047|6.498|1,14",
        "Cuantías actuales del adicional cliente único",
    ),
    (
        "DA37",
        "402d62616a31-p12",
        r"50 por ciento|2012|cónyuge",
        "Adquisición en ventana y ausencia de vinculación; no fecha límite de venta",
    ),
    (
        "VITALICIA-PLAZO",
        "6fe8785ba1a1-p8",
        r"seis meses|retención",
        "Excepción plazo importe retenido, no plazo general indefinido",
    ),
    (
        "VITALICIA-ACUMULADO",
        "6fe8785ba1a1-p9",
        r"240.000|reinversiones anteriores|periodicidad|un año|cinco por ciento",
        "Acumulado por contribuyente y condiciones de renta; no basta formula",
    ),
    (
        "SS2025-MEI",
        "918a1c126ddf-p16",
        r"0,80|0,67|0,13|intergeneracional",
        "Tipos empresa/obrero del ejercicio2025",
    ),
    (
        "SS2025-SOL",
        "918a1c126ddf-p16",
        r"0,77|0,15|0,83|0,17|0,98|0,19",
        "Repartos expresos por tramo; no5/6",
    ),
    (
        "RET-TIPO",
        "0f6003cfa63f-p40",
        r"tipo de retención|dos decimales",
        "Texto reglamentario histórico, exige versión; algoritmo2020 aporta instrucciones por su año",
    ),
]
rows = []
for id, cid, pat, note in claims:
    c = cs[cid]
    p = [x for x in c["pasajes"] if re.search(pat, x["texto"], re.I)]
    rows.append(
        {
            "afirmacion": id,
            "cita": cid,
            "sha256": c["sha256"],
            "sha512": c["sha512"],
            "pagina": c["pagina"],
            "pasajes": p,
            "dictamen": note,
            "estado": "candidato-localizado" if p else "pendiente-localizador",
            "aceptacionFiscalCompleta": False,
            "objecionExperta": "Localizar texto no cierra vigencia ni hechos.",
            "respuesta": "Conservar hash,página,caja y literal, sin heredar aprobación.",
            "coste": "Completar interpretación y cierre transitivo por sitio.",
        }
    )
(OUTPUT / "mapa-afirmaciones-primarias.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2) + "\n"
)
print([(x["afirmacion"], len(x["pasajes"])) for x in rows])
