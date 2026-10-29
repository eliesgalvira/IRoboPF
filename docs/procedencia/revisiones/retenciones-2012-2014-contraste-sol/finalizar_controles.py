"""Cotejo acotado de entrega, citas con caja y cobertura; no motor fiscal."""

import hashlib
import json
from pathlib import Path
import fitz

out = Path(__file__).parent
src = out.parent / "retenciones-2012-2014-sol"


def load(p):
    return json.loads(p.read_text())


paths = {r["sha256"]: r["path"] for r in load(out / "fuentes.json")}
checks = []
for name in ["citas-boe.json", "citas-tablas.json"]:
    for c in load(src / name):
        d = fitz.open(paths[c["documentSha256"]])
        p = d[c["page"] - 1]
        t = p.get_text(clip=fitz.Rect(c["bbox"]))
        checks.append(
            {
                "id": c["id"],
                "textEqual": t == c["text"],
                "quoteSha256": hashlib.sha256(c["text"].encode()).hexdigest(),
                "extractedSha256": hashlib.sha256(t.encode()).hexdigest(),
            }
        )
(out / "cotejo-citas-con-caja.json").write_text(json.dumps(checks, indent=2))
manifest = src / "manifiesto.json"
assert (
    hashlib.sha256(manifest.read_bytes()).hexdigest()
    == "5e36d291f23dca8e73c2b23cd59123d84374ee672049b2f18a9b934efa9735ff"
)
objects = []
for r in load(manifest)["files"]:
    p = Path(r["path"])
    if not p.is_file():
        p = Path(paths[r["sha256"]])
    b = p.read_bytes()
    assert hashlib.sha256(b).hexdigest() == r["sha256"]
    assert len(b) == r["size"]
    objects.append(
        {
            "path": r["path"],
            "resolvedPath": str(p),
            "sha256": r["sha256"],
            "size": len(b),
        }
    )
(out / "recepcion-propia.json").write_text(
    json.dumps(
        {"files": objects, "count": len(objects), "completeRuleAcceptance": False},
        indent=2,
    )
)
print(
    "citas con caja",
    len(checks),
    "diferencias",
    sum(not x["textEqual"] for x in checks),
    "archivos recibidos",
    len(objects),
)
