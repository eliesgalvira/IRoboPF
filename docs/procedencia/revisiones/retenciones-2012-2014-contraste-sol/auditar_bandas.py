"""Diagnóstico de selectores; conserva todas las diferencias, no normaliza citas."""

import json
from pathlib import Path
import fitz

out = Path(__file__).parent
src = out.parent / "retenciones-2012-2014-sol"
paths = {r["sha256"]: r["path"] for r in json.loads((out / "fuentes.json").read_text())}
rows = []
for c in json.loads((src / "citas-tablas.json").read_text()):
    d = fitz.open(paths[c["documentSha256"]])
    p = d[c["page"] - 1]
    box = fitz.Rect(c["bbox"])
    options = {
        "clip": p.get_text(clip=box),
        "clipSorted": p.get_text(clip=box, sort=True),
        "textbox": p.get_textbox(box),
    }
    rows.append(
        {
            "id": c["id"],
            "bbox": c["bbox"],
            "expected": c["text"],
            "options": options,
            "matches": [k for k, v in options.items() if v == c["text"]],
        }
    )
(out / "diagnostico-bandas.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2) + "\n"
)
print("bandas", len(rows), "sin reproducción", sum(not r["matches"] for r in rows))
print(rows[0])
