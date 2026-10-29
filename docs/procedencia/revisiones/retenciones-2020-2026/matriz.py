from pathlib import Path
import json

s = Path("docs/procedencia/auditorias/retenciones-2020-2026")
o = Path("docs/procedencia/revisiones/retenciones-2020-2026")


def load(p):
    return json.loads(p.read_text())


steps = load(s / "cobertura.json")["matrix"]
out = []
absent = {
    "regularizacion",
    "maximos-regularizacion",
    "limites87-5",
    "la-palma",
    "fechas",
}
for r in steps:
    step = r["step"]
    status = "needs-evidence"
    scope = "Fórmula leída y pasajes reextraídos; no aceptación de entradas elegibles, cronología completa ni todas las salidas."
    if step in absent:
        status = "accepted"
        scope = "Solo ausencia de entrada/rama en contrato TS examinado; no validación de la regla documental sustitutiva."
    elif step == "validaciones":
        status = "accepted"
        scope = "Defectos de edad25, divisor0,90.000 y30% ejecutados; no todas las validaciones documentales."
    elif step == "escala" and r["year"] == 2020:
        status = "accepted"
        scope = (
            "Error del tramo47% en2020 confirmado con control2021; no todos los bordes."
        )
    elif step == "reduccion" and (r["year"] <= 2023 or "1-enero" in r["version"]):
        status = "accepted"
        scope = "Fórmula única históricamente incorrecta. Servicio ejecutado por año; fecha no representable."
    elif step == "limite43" and (r["year"] <= 2022 or "1_a_31" in r["version"]):
        status = "accepted"
        scope = "Condición22000 frente35200; caso monetario ejecutado2020, no todos los perfiles."
    out.append(
        {
            "id": r["id"],
            "step": step,
            "year": r["year"],
            "version": r["version"],
            "previousStatus": r["status"],
            "reviewStatus": status,
            "acceptanceScope": scope,
            "citationIds": r["citationIds"],
            "objection": "Localizar un pasaje o coincidir una fórmula no acredita condiciones y vigencia.",
            "action": "Conservar aceptación acotada; ampliar casos y contrato antes de certificación.",
        }
    )
(o / "revision-533-pasos.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2)
)
branches = []
for r in load(s / "ramas-regularizacion.json"):
    branches.append(
        {
            "year": r["year"],
            "version": r["version"],
            "branch": r["branch"],
            "status": "accepted",
            "acceptanceScope": "Exclusivamente ausencia de regularización en servicio TS real leído.",
            "execution": "not-executed: rama y entradas no existen",
            "normativeInterpretation": "needs-evidence",
            "citationIds": r["citationIds"],
            "objection": "416 registros documentales no son416 implementaciones ni pruebas ejecutadas.",
            "action": "Contrato de regularización, casos de historial y cadena temporal antes de implementar.",
        }
    )
(o / "revision-416-ramas.json").write_text(
    json.dumps(branches, ensure_ascii=False, indent=2)
)
