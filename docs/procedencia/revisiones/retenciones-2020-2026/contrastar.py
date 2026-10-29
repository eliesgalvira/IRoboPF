from pathlib import Path
import json
from decimal import Decimal, ROUND_DOWN, ROUND_HALF_UP

s = Path("docs/procedencia/auditorias/retenciones-2020-2026")
o = Path("docs/procedencia/revisiones/retenciones-2020-2026")


def load(p):
    return json.loads(p.read_text())


def save(n, v):
    (o / n).write_text(json.dumps(v, ensure_ascii=False, indent=2))


e = load(o / "ejecucion-ts.json")
save("casos-resultados.json", e["resultados"])
save("tablas-ts.json", e["tablas"])
save("fechas-resultados.json", e["fechas"])
periods = {p["version"]: p for p in load(s / "cobertura.json")["periods"]}
out = []
for r in load(s / "tablas-anuales.json"):
    date = periods[r["version"]]["validFrom"]
    options = [x for x in e["tablas"] if x["anio"] == r["year"] and x["fecha"] <= date]
    t = max(options, key=lambda x: x["fecha"])["tabla"]
    field = {
        "0": "sinDescendientes",
        "1": "unDescendiente",
        "2+": "dosOMasDescendientes",
    }[r["descendants"]]
    v = t["situacion" + str(r["situation"])][field]
    out.append(
        {
            **r,
            "review": "Comparación independiente catálogo TS ejecutado, no aceptación fiscal",
            "actualTS": v,
            "equal": v == r["officialValue"],
            "date": date,
        }
    )
save("contraste-117-celdas.json", out)
D = Decimal
tramos = [
    (D("0"), D("0"), D(".19")),
    (D("12450"), D("2365.50"), D(".24")),
    (D("20200"), D("4225.50"), D(".30")),
    (D("35200"), D("8725.50"), D(".37")),
    (D("60000"), D("17901.50"), D(".45")),
]


def scale(b, year):
    ts = tramos + ([(D("300000"), D("125901.50"), D(".47"))] if year >= 2021 else [])
    start, cuota, tipo = max((x for x in ts if x[0] <= b), key=lambda x: x[0])
    return cuota + (b - start) * tipo


expected = []
for r in e["resultados"]:
    if r.get("expectedImporte") is None:
        continue
    c = r["input"]
    y = c["anio"]
    gross = D(c["retribucionAnualCentimos"]) / 100
    net = gross - D(c["cotizacionesCentimos"]) / 100
    if y <= 2022:
        red = max(D(0), D(5565) - D("1.5") * max(D(0), net - D(13115)))
    elif y == 2023:
        red = max(D(0), D(6498) - D("1.14") * max(D(0), net - D("14047.50")))
    elif net <= D(14852):
        red = D(7302)
    elif net <= D("17673.52"):
        red = D(7302) - D("1.75") * (net - D(14852))
    else:
        red = max(D(0), D("2364.34") - D("1.14") * (net - D("17673.52")))
    red = red.quantize(D(".01"), rounding=ROUND_HALF_UP)
    base = max(D(0), net - D(2000) - red)
    minimum = D(8100 if c["descendientes"] else 5550)
    cuota = max(D(0), scale(base, y) - scale(minimum, y))
    umbral = D(
        17634
        if c["descendientes"]
        else 14000
        if y <= 2022
        else 15000
        if y == 2023
        else 15876
    )
    if gross <= D(22000 if y <= 2022 else 35200):
        cuota = min(cuota, max(D(0), (gross - umbral) * D(".43")))
    tipo = (cuota / gross * 100).quantize(D(".01"), rounding=ROUND_DOWN)
    importe = (gross * tipo / 100).quantize(D(".01"), rounding=ROUND_HALF_UP)
    expected.append(
        {
            "id": r["id"],
            "base": str(base),
            "red20": str(red),
            "minimo": str(minimum),
            "cuotaLimitada": str(cuota),
            "tipoTruncado": str(tipo),
            "importe": str(importe),
            "matchesDeclaredExpected": int(importe * 100) == r["expectedImporte"],
            "scope": "Recálculo independiente de perfiles concretos con fuentes AEAT; no oracle Excel ni SS",
        }
    )
save("casos-expected-independiente.json", expected)
print(
    "117 tablas",
    sum(x["equal"] for x in out),
    "expected",
    len(expected),
    all(x["matchesDeclaredExpected"] for x in expected),
)
