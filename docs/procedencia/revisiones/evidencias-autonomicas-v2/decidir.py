"""Materializa decisiones nuevas y comprueba su proyección, sin promoción."""

import hashlib
import json
import sys
from decimal import Decimal
from pathlib import Path

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "tools/procedencia"))
import corpus  # noqa: E402
import enlaces  # noqa: E402


def read(name):
    return json.loads((OUT / name).read_text())


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def reference(name):
    return {
        "path": "docs/procedencia/revisiones/evidencias-autonomicas-v2/" + name,
        "sha256": hashlib.sha256((OUT / name).read_bytes()).hexdigest(),
    }


reason = {
    "andalucia": "Ley 3/2012 art. 2.Dos: añade art. 15 quáter con efectos expresos desde 1/1/2012. La sustitución por Ley 1/2015 DF 4.1 declara efectos desde 1/1/2016; no se anticipa a 2015. Se conserva el ámbito 2012–2015 y la columna de IRPF, separada de Patrimonio en la misma página.",
    "comunitat-valenciana": "Ley 7/2014 art. 45.Uno, primera tabla de p. 58, y DF cuarta.b p. 127: efectos desde 1/1/2014. El apartado Dos restringe DA12 a 2012–2013; la segunda tabla de p. 58 no es la revisada. El historial de art. 2 identifica la sustitución siguiente por Ley 13/2016 art. 11 para 2017; se conservan 2014, 2015 y 2016 por su cadena, no por igualdad con el motor.",
    "catalunya": "Ley 5/2020 art. 87 fija efectos desde 1/1/2020 para la escala de 2020–2021. Ley 2/2021 art. 41 fija la sustitución desde 1/1/2022, con tabla repartida en pp. 46–47. DL 1/2024 art. 611-1 conserva esas filas en 2024. No se incorpora el mínimo del art. 88 ni su nulidad a esta decisión de celda; tampoco se extiende a la reforma de 2025.",
    "madrid": "Ley 8/2022 art. único.Uno p. 3 y DF única p. 5: períodos iniciados desde 1/1/2022. Sustituye la tabla intermedia de Ley 2/2021. Incluye el período iniciado en 2022 que termina por fallecimiento; la restricción técnica sin fallecimiento de MADRID_2025 no se traslada a MADRID_2022. No acepta años 2023–2025.",
    "murcia": "DL 4/2022, artículo único, sustituye DA5.4 para período 2022; BORM 4846 pp. 3–4. Entrada 29/9/2022. Se acepta únicamente cierre ordinario sin fallecimiento, que cumple el selector actual. Fila lógica 5 es párrafo, no fila gráfica: base estrictamente superior a 60000. En 60000 rige fila 4, sin corregir la discontinuidad publicada por continuidad aritmética.",
}
rows = read("mapeo-tecnico.json")
decisions = []
mapping = []
for r in rows:
    identifier = "EAV2-" + r["id"].removeprefix("r12-canonico-")
    conditions = [
        "Componente autonómico de la base liquidable general; residencia territorial debe acreditarse fuera de esta decisión.",
        "Aceptación limitada a la identidad y cuantía EUR de esta celda, en este ejercicio; no acepta mínimos, tipos como bindings, deducciones, redondeos ni liquidación completa.",
        "No autoriza registrar el payload original ni crear atestación; el padre debe preparar y revisar un payload nuevo con estas condiciones.",
    ]
    conditions.append(
        "Período iniciado en 2022, incluido su cierre por fallecimiento; sin extensión a 2025."
        if r["territory"] == "madrid"
        else "Ámbito aceptado: cierre ordinario anual sin fallecimiento. Los supuestos de fallecimiento quedan fuera de esta decisión limitada."
    )
    if r["territory"] == "murcia":
        conditions.append(
            "Fila 5 solo si BLG > 60000. BLG = 60000 usa fila 4: 8625.8332 antes del redondeo; no se impone continuidad."
        )
    d = {
        "id": identifier,
        "status": "accepted",
        "reviewer": "Codex /root, checkout T3 t3-74b09993",
        "base": "5799bb03826719a4dd3500a962e2d6bb5124fdca",
        "payloadId": r["id"],
        "payloadSha256": r["payloadSha256"],
        "itemId": r["itemId"],
        "year": r["year"],
        "territory": r["territory"],
        "row": r["row"],
        "column": r["column"],
        "value": r["value"],
        "unit": "EUR",
        "engineLocations": [r["engineLocation"]],
        "conditions": conditions,
        "reason": f"Ejercicio {r['year']}, {r['territory']}, fila {r['row']}, columna {r['column']}: {r['value']} EUR. "
        + reason[r["territory"]],
        "citations": [
            r["citation"],
            reference("citas-temporales.json"),
            reference("persistencia.json"),
        ],
        "expertObjection": "Una cifra igual no prueba fila, columna ni vigencia. Se verifica ruta estructural, encabezado, original y cadena temporal; el alcance no se amplía a supuestos excluidos ni se hereda de decisiones antiguas.",
        "cost": "Una decisión por celda y año, dependencias preservadas y nueva preparación del binding por el padre. La autenticidad histórica y la liquidación completa siguen pendientes.",
        "integrity": "verified",
        "authenticity": "not-revalidated",
        "interpretation": "accepted-limited-to-stated-conditions",
        "numericAccuracy": "verified-against-current-effective-occurrence",
        "completeRuleAcceptance": False,
    }
    projection = {k: d[k] for k in ("id", "status", "engineLocations")}
    corpus.validate_schema(projection, "legal-decision-scope")
    assert enlaces.select_decision([d], identifier) == d
    assert enlaces.location_matches(d["engineLocations"][0], r["source"])
    neighbor = dict(
        r["source"],
        tablePath=[
            r["source"]["tablePath"][0],
            "cuota" if r["column"] == "baseInferior" else "baseInferior",
        ],
    )
    assert not enlaces.location_matches(d["engineLocations"][0], neighbor)
    for status in ["needs-evidence", "rejected"]:
        try:
            enlaces.select_decision([dict(d, status=status)], identifier)
        except ValueError:
            pass
        else:
            raise AssertionError("Selector aceptó estado bloqueado")
    decisions.append(d)
    mapping.append(
        {
            **r,
            "decisionId": identifier,
            "status": d["status"],
            "blockersForPromotion": [
                "payload-nuevo-con-condiciones",
                "revision-del-binding-exacto",
                "sin-atestacion-ni-registro-autorizados",
            ],
        }
    )
assert len({d["id"] for d in decisions}) == 186
write("decisiones-canonicas.json", decisions)
write("mapeo-186.json", mapping)
cases = []
for value in ["59999.99", "60000", "60000.01", "100000"]:
    base = Decimal(value)
    strict = (
        Decimal("8716.67") + (base - 60000) * Decimal(".227")
        if base > 60000
        else Decimal("4142.62") + (base - 35394) * Decimal(".1822")
    )
    inclusive = (
        Decimal("8716.67") + (base - 60000) * Decimal(".227")
        if base >= 60000
        else strict
    )
    cases.append(
        {
            "base": value,
            "strict": str(strict),
            "inclusiveMutant": str(inclusive),
            "same": strict == inclusive,
            "kind": "aritmetica-independiente-no-liquidacion",
        }
    )
assert cases[1]["strict"] == "8625.8332" and not cases[1]["same"]
write("casos.json", cases)
write(
    "validacion-decisiones.json",
    {
        "decisions": len(decisions),
        "schema": "legal-decision-scope",
        "projectionPassed": 186,
        "selectDecisionPassed": 186,
        "oppositeColumnRejected": 186,
        "nonAcceptedRejected": 372,
        "completeRuleAcceptance": False,
        "limit": "select_decision valida estado y localizador; no impone condiciones temporales editoriales. Sin registrar ni atestar los payloads originales.",
    },
)
print(
    "PASS: 186 decisiones nuevas limitadas; 186 proyecciones; 186 select_decision; 186 columnas contrarias rechazadas; 372 estados bloqueados rechazados; frontera Murcia correcta."
)
