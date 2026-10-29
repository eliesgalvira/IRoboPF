"""Controles discriminantes documentales, independientes del motor y de AEAT remoto."""

from decimal import Decimal, ROUND_DOWN, ROUND_HALF_UP
import json
from pathlib import Path

D = Decimal
rows = []
actual: object
expected: object


def check(name, actual, expected, scope):
    assert actual == expected, (name, actual, expected)
    rows.append(
        {"id": name, "actual": str(actual), "expected": str(expected), "alcance": scope}
    )


# Signos transcritos después de inspección visual personal, no inferidos de OCR.
for version in ["2012-enero", "2012-febrero", "2013-anual", "2014-anual"]:
    check(
        version + ":asc64-discapacitado",
        64 <= 64,
        True,
        "operador visible; restantes requisitos se dan calificados",
    )
    check(
        version + ":des25-discapacitado",
        25 >= 25,
        True,
        "operador visible; no valida contador completo",
    )
    check(
        version + ":extraccion-asc64",
        64 < 64,
        False,
        "lectura textual defectuosa conservada",
    )
check(
    "enero:extraccion-des25",
    25 > 25,
    False,
    "pérdida de trazo respecto imagen; no cambio fiscal",
)

# Contador elegible suministrado: recorrido de un prefijo frente identidad familiar.
check(
    "prefijo-discapacidad",
    sum([0, 7038][:1]),
    0,
    "subpaso literal p26 con contador1, no ejecutable completo",
)
check(
    "identidad-discapacidad",
    sum([0, 7038]),
    7038,
    "hijos12/8, segundo65%, orden natal inalterado",
)
check(
    "prefijo-asistencia",
    sum([0, 2316][:1]),
    0,
    "p27 con contador1; no ordenar por discapacidad",
)
check("identidad-asistencia", sum([0, 2316]), 2316, "segundo65% con derecho calificado")
check(
    "minimo-familiar",
    5151 + 1836 + 2040 + 7038 + 2316,
    18381,
    "sin otros sujetos, ambos descendientes por entero",
)
# Watchdog de estructura j/i: i fijo en1, NUMASMOV1, condición i==2 nunca termina.
i = 1
j = 1
for _ in range(4):
    j += 1
check(
    "bucle-movilidad-j-i",
    i == 2,
    False,
    "p19, watchdog cuatro iteraciones; no atribución al servicio",
)
check(
    "bucle-discapacidad-convivencia-i",
    [1, 2][i - 1],
    1,
    "p20 repite índice1 frentej2, cuyo divisor correcto sería2",
)
check("divisor-correcto-j", [1, 2][1], 2, "contraste estructural; no fix")
for remaining in [D("0"), D("-.01"), D(".01")]:
    check(
        "divisor:" + str(remaining),
        remaining > 0,
        remaining == D(".01"),
        "guarda documental antes del cociente; no solución del pago final",
    )
check(
    "exceso-retenido",
    max(D(0), (D(1000) - D(1500)) * 100 / D(15000)),
    D(0),
    "suelo aritmético; no restitución automática ni eliminación86.2",
)

# C01 no se prueba con texto: evidencia en PNG y registro personal. C02 es guardia legal.
for increased in [False, True]:
    raw = D(18)
    old = D(12)
    delta = D(1000) if increased else D(-1000)
    contract = raw if delta > 0 else min(raw, old)
    legal = min(raw, old)
    check(
        "alimentos:guardia:" + str(increased),
        legal,
        D(12),
        "85.2 calificado, guardia87.5 independiente; mínimos no vinculantes",
    )
    check(
        "alimentos:contrato:" + str(increased),
        contract,
        D(18) if increased else D(12),
        "contraejemplo de subpaso contractual, no nómina",
    )

for reductions, base in [(600, 16748), (1200, 16148)]:
    check(
        "viudedad:base:" + str(reductions),
        20000 - 2652 - reductions,
        base,
        "pensiónSS20000, viudo40, hijos5/8/12 exclusivos; sin otras minoraciones",
    )
    for rate, expected in [
        (D(".24"), D("971.76") if reductions == 600 else D("827.76")),
        (D(".2475"), D("1002.1275") if reductions == 600 else D("853.6275")),
    ]:
        quota = D(base - 12699) * rate
        check(
            "viudedad:cuota:" + str(reductions) + str(rate),
            quota,
            expected,
            "dos hipótesis; cuota43 máxima1626.69,80bis0",
        )
        integer = (
            (quota / D(200))
            .quantize(D(".01"), rounding=ROUND_DOWN)
            .quantize(D(1), rounding=ROUND_HALF_UP)
        )
        check(
            "viudedad:entero:" + str(reductions) + str(rate),
            integer,
            D(5) if reductions == 600 else D(4),
            "previo entero; no resultado fiscal único",
        )

# Cada una de las44 decisiones tiene un discriminante de admisibilidad distinto por causa.
for version in ["2012-enero", "2012-febrero", "2013-anual", "2014-anual"]:
    for cause in range(1, 12):
        if cause == 1:
            actual, expected = (25848 != 23948, 25848 != 25848), (True, False)
        elif cause == 2:
            actual, expected = (6987 != 5151, 5151 != 5151), (True, False)
        elif cause == 3:
            actual, expected = (3000 > 0, 0 > 0), (True, False)
        elif cause == 4:
            actual, expected = (0 < 6000 < 25848, 0 < 25848 < 25848), (True, False)
        elif cause == 5:
            actual, expected = (1500 > D(1500), D("1500.01") > 1500), (False, True)
        elif cause == 6:
            actual, expected = (D(5400) - D(1350)) * 100 / D(15000), D(27)
        elif cause == 7:
            actual, expected = (D(10000) * D(".18") + D(20000) * D(".09")), D(3600)
        elif cause == 8:
            actual, expected = (D(10000) * D(".09") + D(20000) * D(".18")), D(4500)
        elif cause == 9:
            actual, expected = (D(".02") * (30000 - 15000)), D(300)
        elif cause == 10:
            actual, expected = (D(600) - D(".02") * (30000 - 15000)), D(300)
        else:
            actual, expected = (
                (version == "2012-febrero"),
                (version not in ["2012-enero", "2013-anual", "2014-anual"]),
            )
        check(
            version + ":CAUSA" + str(cause),
            actual,
            expected,
            "discriminante de subpaso; no cobertura integral ni44liquidaciones",
        )
check(
    "vivienda:11-febrero",
    400 + D(".02") * (30000 - 28000),
    D(440),
    "historia admitida solo en febrero",
)
check(
    "vivienda:11-2013",
    D(".02") * (30000 - 15000),
    D(300),
    "historia anterior incompatible; no misma nómina",
)
check(
    "orden9-aumento",
    ("vivienda", "salario"),
    ("vivienda", "salario"),
    "incidencias80enero/73febrero/77año2013/76año2014",
)
check(
    "orden9-disminucion",
    ("salario", "vivienda"),
    ("salario", "vivienda"),
    "orden diferente; control de contrato, no cálculo completo",
)
Path(__file__).with_name("casos-propios-resultados.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2) + "\n"
)
print(len(rows), "controles; alcance por fila; completeRuleAcceptance=false")
