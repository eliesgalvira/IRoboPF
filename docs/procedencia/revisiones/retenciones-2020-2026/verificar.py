import json
import hashlib
from pathlib import Path
import pymupdf as fitz

src = Path("docs/procedencia/auditorias/retenciones-2020-2026")
out = Path("docs/procedencia/revisiones/retenciones-2020-2026")
scratch = Path(".cache/procedencia/revision-retenciones-2020-2026")


def save(name, x):
    (out / name).write_text(json.dumps(x, ensure_ascii=False, indent=2))


docs = json.loads((src / "documentos.json").read_text())
handles = {}
checks = []
for d in docs:
    b = Path(d["localPath"]).read_bytes()
    checks.append(
        {
            "hash": d["sha256"],
            "sha256": hashlib.sha256(b).hexdigest() == d["sha256"],
            "sha512": hashlib.sha512(b).hexdigest() == d["sha512"],
            "size": len(b) == d["size"],
        }
    )
    if b.startswith(b"%PDF"):
        doc = fitz.open(stream=b, filetype="pdf")
        handles[d["sha256"]] = doc
        if not (scratch / (d["sha256"][:12] + ".txt")).exists():
            (scratch / (d["sha256"][:12] + ".txt")).write_text(
                "\n".join(f"\nPAGE {i + 1}\n" + p.get_text() for i, p in enumerate(doc))
            )
cites = json.loads((src / "citas-candidatas.json").read_text())
result = {}
refined = []
last_key = None
for c in cites:
    boxes = c.get("extractionBoxes", c["boxes"])
    key = (c["documentHash"], c["page"])
    if key != last_key:
        p = handles[c["documentHash"]][c["page"] - 1]

        last_key = key
    t = "\n".join(p.get_text(clip=fitz.Rect(b)).removesuffix("\n") for b in boxes)
    result[c["id"]] = {
        "id": c["id"],
        "equal": t == c["quote"],
        "sameIgnoringWhitespaceDiagnosticOnly": "".join(t.split())
        == "".join(c["quote"].split()),
        "reextractedTextSha256": hashlib.sha256(t.encode()).hexdigest(),
        "documentHash": c["documentHash"],
        "page": c["page"],
    }
    if c.get("table") or any(
        w in t
        for w in [
            "22.000",
            "35.200",
            "90.000",
            "5.565",
            "6.498",
            "7.302",
            "La Palma",
            "26 de enero",
            "28 de junio",
            "fijado judicialmente",
        ]
    ):
        refined.append(
            {
                "id": c["id"],
                "documentHash": c["documentHash"],
                "page": c["page"],
                "extractionBoxes": boxes,
                "quote": t,
                "originalEqual": t == c["quote"],
                "scope": "Texto reextraído, no aceptación de vigencia",
            }
        )
save("comprobaciones-hashes.json", checks)
save("comprobaciones-citas.json", list(result.values()))
save("citas-refinadas.json", refined)
for name in ["cobertura", "tablas-anuales", "escalas-anuales", "ramas-regularizacion"]:
    data = json.loads((src / (name + ".json")).read_text())
    rows = data["matrix"] if name == "cobertura" else data
    res = []
    for i, r in enumerate(rows):
        ids = r.get("citationIds", [r["citationId"]] if "citationId" in r else [])
        res.append(
            {
                "index": i,
                "identity": r.get(
                    "id", r.get("branch", r.get("rowIndex", r.get("situation")))
                ),
                "year": r["year"],
                "version": r["version"],
                "references": len(ids),
                "missing": [s for s in ids if s not in result],
                "unequal": [s for s in ids if s in result and not result[s]["equal"]],
                "scope": "Comprobación de referencias y extracción; interpretación no certificada",
            }
        )
    save("comprobaciones-" + name + ".json", res)
print(
    "hashes",
    len(checks),
    "quotes",
    len(result),
    "different",
    sum(not x["equal"] for x in result.values()),
    "refined",
    len(refined),
)
