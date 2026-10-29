import json
import re
from pathlib import Path

s = Path("docs/procedencia/auditorias/retenciones-2020-2026")
o = Path("docs/procedencia/revisiones/retenciones-2020-2026")
c = {x["id"]: x for x in json.loads((o / "citas-refinadas.json").read_text())}
rows = []
fixed = [
    ["0,00", "0,00", "12.450,00", "19,00"],
    ["12.450,00", "2.365,50", "7.750,00", "24,00"],
    ["20.200,00", "4.225,50", "15.000,00", "30,00"],
    ["35.200,00", "8.725,50", "24.800,00", "37,00"],
    ["60.000,00", "17.901,50", "240.000,00", "45,00"],
    ["300.000,00", "125.901,50", "En adelante", "47,00"],
]
for r in json.loads((s / "escalas-anuales.json").read_text()):
    q = c.get(r["citationId"])
    cells = r["officialCells"]

    def compact(t):
        return re.sub(r"\s+", "", t).lower()

    present = q is not None and all(
        compact(cell) in compact(q["quote"]) for cell in cells
    )
    rows.append(
        {
            "year": r["year"],
            "version": r["version"],
            "rowIndex": r["rowIndex"],
            "citationId": r["citationId"],
            "cellsReextracted": present,
            "matchesFixedEngineRow": cells == fixed[r["rowIndex"]],
            "scope": "Comparación fila del código leído y cita reextraída; no ejecución de cada límite ni aceptación normativa",
        }
    )
(o / "contraste-77-filas.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2)
)
print(
    "rows",
    len(rows),
    "inquote",
    sum(r["cellsReextracted"] for r in rows),
    "fixed",
    sum(r["matchesFixedEngineRow"] for r in rows),
)
