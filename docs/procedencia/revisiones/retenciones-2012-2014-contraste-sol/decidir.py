"""Serializa dictámenes de contraste; no decide legalidad mediante un contador."""

import json
from pathlib import Path

out = Path(__file__).parent
src = out.parent / "retenciones-2012-2014-sol"
# Dictamen, motivo propio y exclusión por familia, tras lectura del material indicado.
familias = {
    "remuneracion": (
        "confirmado-acotado",
        "83.2 distingue previsión, especie sin ingreso y jornal diario. 87.43 por 100 son 8743, no una anualización salarial universal.",
        "Exigir previsión contractual, variables y calificación por pagador; excluir atrasos interanuales.",
    ),
    "irregularidad": (
        "confirmado-acotado",
        "120000 representa reducción y no ingreso; 300000 por 40% lo explica. DT25 mira extinción, no cobro.",
        "Recibir importes previamente calificados, fecha de extinción y agregación de grupo; no evaluar opciones ni generación con solo un importe.",
    ),
    "gastos": (
        "confirmado-acotado",
        "83.3.b remite a19.2 a/b/c. La lista histórica no contiene gasto general2000.",
        "No aplicar sindicato, colegio profesional ni defensa como gasto del retenedor; conservar diferencia frente liquidación anual.",
    ),
    "reduccion-trabajo": (
        "confirmado-acotado",
        "Ley39/2010arts60-61 aporta vigencia indefinida; 83.3.c limita el cómputo a RNT de a/b. Movilidad y prolongación requieren hechos adicionales.",
        "Actividad efectiva, inscripción y traslado acreditados; no inferir por edad/discapacidad un derecho.",
    ),
    "reducciones-personales": (
        "needs-evidence",
        "La suma PDF de dos600 existe. La disyunción de83.3.d y compatibilidad posterior no resuelven inequívocamente duplicar600 dentro del primer párrafo.",
        "Solo excluir pensión SS/ClasesPasivas con más de dos descendientes elegibles del resultado único; conservar escenarios individuales.",
    ),
    "minimos": (
        "confirmado-parcial-refutacion-C01",
        "Cuantías y reparto se sostienen; son falsos los claims visuales <64 y >25 enero. Persisten j/i y prefijos por categoría incompatibles con orden natal.",
        "Aplicar por sujetos elegibles y fechas calificadas; no ejecutar literalmente auxiliares defectuosos ni convertir etiquetas de tablas en topes legales.",
    ),
    "escala": (
        "confirmado-acotado",
        "Cuotas fijas y límites publicados se conservan; complemento se aplica también al mínimo y anualidades+1600. Sumar tipos sin cuotas fijas pierde céntimos.",
        "Escala identificada temporalmente; para anualidades exigir resolución y 0<A<BASE. Mismo hijo con mínimo queda fuera del candidato.",
    ),
    "exclusion": (
        "confirmado-acotado",
        "RD2004/2009 aporta las ocho celdas; incremento por pensión/desempleo, sin HIJOS. Igualdad excluye salvo mínimos86.2.",
        "No usar tabla original2007 niRD861 como tabla vigente2012; calificar situación1 y sujetos antes de contar.",
    ),
    "limite43": (
        "confirmado-acotado",
        "RD2004/2009 sustituye85.3: deducción más43% de diferencia positiva; 22000 incluido. La vieja redacción no basta.",
        "Recalcular deducción con base de retención; no confundir este límite de cuota con tipo máximo de regularización.",
    ),
    "deduccion80bis": (
        "confirmado-acotado",
        "Ley26/2009art70 yRD2004/2009 separan base imponible anual de base del retenedor. A12000 la expresión da0.",
        "No trasladar otras rentas del contribuyente al testBASE ni restar dos veces la deducción.",
    ),
    "tipo-minimo": (
        "confirmado-acotado",
        "PDF separa15/2 y8/1; excepción penitenciaria/discapacidad exige relación especial cualificada.",
        "No dividir automáticamente15 entre2 ni aplicar mínimo a una relación especial excluida por86.2.",
    ),
    "tipo-maximo": (
        "confirmado-acotado",
        "RD1788/2010 yDA35 sustentan45/23 y52/26; Ley22/2013art64 extiende2014.",
        "Solo regularización; reducido únicamente si totalidad rendimientos cualificados, no mera residencia actual.",
    ),
    "redondeos": (
        "confirmado-acotado",
        "PDF usa precisión interna, céntimo mitad arriba, truncado y entero previo; CM parte del previo con decimales antes del entero.",
        "No redondear cada producto marginal ni mitad del entero previo; separar política documental de cualquier implementación futura.",
    ),
    "regularizacion": (
        "confirmado-parcial-C02",
        "Cociente y orden documentales se sostienen. Falta alternativa judicial de87.5 independiente del signo; figura ya enRD1788/2010p4.",
        "Añadir guardia de alimentos85.2 o excluir expresamente ese evento; no habilitar el procedimiento con el contrato actual.",
    ),
    "comunicacion": (
        "confirmado-acotado",
        "87.4/88 distinguen hecho, comunicación, cinco días, diez días y opción trimestral del pagador.",
        "Conservar comunicación firmada y recibo. En2014 no exigir testimonio adjunto derogado; resolución judicial sigue necesaria.",
    ),
    "multiples-pagadores": (
        "confirmado-acotado",
        "89.A es actuación administrativa distinta del procedimiento por pagador; vivienda agrega según simultáneos/sucesivos.",
        "Excluir89.A del cálculo numérico general y no usar suma de pagadores como nómina única.",
    ),
    "vivienda": (
        "confirmado-acotado",
        "DA23 y145 distinguen enero, febrero y nuevaDT18 desde2013; el númeroDT18 tiene dos historias distintas.",
        "Derecho transitorio calificado, financiación, comunicación y agregado estricto. No basta escritura ni pagador actual.",
    ),
    "ceuta-melilla": (
        "needs-evidence-parcial",
        "Mezclas7/8 visibles y marcas11 confirmadas; pérdida de residencia con hechos mixtos no recibe respuesta jurídica única por fórmula.",
        "Calificar68.4 y pasado/pendiente; excluir mezcla6 sin criterio adicional y11 histórico no admitido por versión.",
    ),
    "validaciones": (
        "confirmado-acotado",
        "Incidencia37 enero/35 resto excluye divisor no positivo; no demuestra solución jurídica del último pago. AND/OR de vivienda no son especificación inequívoca.",
        "Rechazo explícito del dominio inválido; no inventar devolución ni corregir silenciosamente conjunciones.",
    ),
    "fecha-aplicacion": (
        "needs-evidence-parcial",
        "DA35.3 yDA23.2 contienen pago y correspondencia simultáneamente; el resto del selector no está decidido por esas dos frases.",
        "Excluir residual2012, separar conceptos con distinta correspondencia y no inferir por fecha bancaria.",
    ),
}

ramas = {
    1: (
        "confirmado-acotado",
        "Cambio de BASE distinto deBASEA; gastos o previsión y87.5 según variación exclusiva.",
        "No atribuir a todo cambio de bruto una variación exclusiva base-mínimo.",
    ),
    2: (
        "confirmado-acotado",
        "Cambio de mínimo por sujetos elegibles; registrar mínimo anterior y nuevo y87.5.",
        "No confundir nacimiento/comunicación o pérdida de derecho con solo un contador.",
    ),
    3: (
        "confirmado-acotado",
        "Nueva compensatoria judicial reduce BASE, no es anualidad de85.2.",
        "Excluir compensatoria voluntaria; mantener prueba judicial según fecha.",
    ),
    4: (
        "confirmado-parcial-C02",
        "Anualidad judicial a hijos aplica85.2 si0<A<BASE; no restar de BASE. No subida87.5 como alternativa propia.",
        "Contrato recibido requiere guardia o exclusión del evento; el cociente del fixture no la demuestra.",
    ),
    5: (
        "confirmado-acotado",
        "Cambio2→3 exige renta no exenta cónyuge>1500. Sale del bloque87.5 documental.",
        "No crear incremento si30000 deja tabla sin efecto; el fixture neutro no prueba umbral.",
    ),
    6: (
        "needs-evidence",
        "Pérdida de residencia exige historia cualificada, nuevo estado y calificación del pasado; fórmula PDF no equivale a decisión jurídica completa.",
        "Excluir coexistencia de pérdida y otros cambios sin criterio primario suficiente; no fingir aceptado el27% del fixture.",
    ),
    7: (
        "confirmado-acotado",
        "Adquisición residencia: ponderar percibido con tipo ordinario y pendiente conCM, antes del cociente.",
        "ExigirRESICEME,RENCEME e historia; no rebajar retrospectivamente todo el importe.",
    ),
    8: (
        "confirmado-acotado",
        "Trabajo pendiente fuera por residente: historiaCM y pendiente ordinario; ponderación inversa7.",
        "Incompatible6/7 para el mismo evento. No confundirCEUMELI=N con ausencia de residencia.",
    ),
    9: (
        "confirmado-acotado",
        "Inicio vivienda con comunicación y derecho: minoración previa más2%pendiente si procede.",
        "Aumento retribución exige vivienda primero; disminución salario primero. No mandar a la API antecedentes incompatibles.",
    ),
    10: (
        "confirmado-acotado",
        "Cese vivienda: comunicación de improcedencia,MINORADO y MINOPAGOA anterior; sustraer2%pendiente.",
        "No interpretar AND ambiguo como autorización de historias imposibles; dos fases según signo salarial.",
    ),
    11: (
        "confirmado-acotado",
        "Causa residual incompatible1..10. Respetar historia admitida en cada versión.",
        "No reutilizar440 y300 como misma nómina válida ni inferir vivienda/residencia por defecto.",
    ),
}


def write(name, value):
    (out / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


cells = []
for x in json.loads((src / "matriz-80.json").read_text()):
    version, family = x["id"].split(":")
    status, reason, exclusion = familias[family]
    cells.append(
        {
            "id": x["id"],
            "dictamen": status,
            "afirmacionExaminada": x["reglaCandidata"],
            "razonPropia": reason,
            "contratoViable": exclusion,
            "evidenciaPDF": x["citas"],
            "primarios": x["primarios"],
            "version": version,
            "objecionExperta": "La igualdad numérica no prueba requisitos ni vigencia de "
            + family
            + ".",
            "respuesta": "Conservar las condiciones de esta celda y las exclusiones expresas; el dictamen no habilita el motor.",
            "coste": "Calificación externa y contraste posterior de conclusiones nuevas; cobertura menor hasta resolver reservas.",
            "completeRuleAcceptance": False,
        }
    )
write("decisiones-80.json", cells)
branches = []
for x in json.loads((src / "ramas-44.json").read_text()):
    n = int(x["branch"][5:])
    status, reason, exclusion = ramas[n]
    version = x["version"]
    extra = ""
    if n == 11:
        extra = (
            "Febrero admiteRETRIBA,MINORADO,MINOPAGOA,RENCEMEA; azul no eliminado."
            if version == "2012-febrero"
            else "SoloPERCIBIDO/RETENIDO como antecedentes; no enviar historia incompatible. En2013 eliminar tachados antes de interpretar."
        )
    branches.append(
        {
            "id": x["id"],
            "dictamen": status,
            "razonPropia": reason,
            "contratoViable": x["contrato"] + " " + reason + " " + extra,
            "exclusiones": exclusion,
            "topes": x["topes"],
            "vivienda": x["vivienda"],
            "evidenciaPDF": x["citas"],
            "primarios": [
                "bc36ac7820d4:p4",
                "bc36ac7820d4:p5",
                "0abb5d0eda31:p4",
                "0abb5d0eda31:p5",
                "0f6003cfa63f:p41",
            ],
            "objecionExperta": "Un cociente30 repetido no discrimina "
            + x["branch"]
            + "; tampoco prueba su admisibilidad.",
            "respuesta": "Separar hechos, validación, objetivo, pendiente, mínimos, topes y87.5. Usar controles discriminantes; mantener reserva cuando falta calificación.",
            "coste": "No declarar probada integralmente esta rama; exigir futura implementación revisada con esos hechos.",
            "completeRuleAcceptance": False,
        }
    )
write("decisiones-44.json", branches)
assert len(cells) == 80 and len(branches) == 44
print("80 dictámenes y44 ramas serializados; no son124 reglas aceptadas.")
