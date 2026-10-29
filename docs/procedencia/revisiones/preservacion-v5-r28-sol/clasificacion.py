"""Contraejemplo propio: la URL contigua no convierte una selección en original."""

import importlib
import json
from pathlib import Path
import sys

ROOT = Path.cwd()
CACHE = ROOT / ".cache/revision-v5-r28"
sys.path.insert(
    0, str(CACHE / "software-restaurado/docs/procedencia/preservacion-v5-sol")
)
r = importlib.import_module("recolector")
probe = {
    "selectionSha256": "a" * 64,
    "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764",
}
observed = list(r.observations(probe, "citations.json"))[0]
m = json.loads((CACHE / "manifest-final.json").read_bytes())
name = "docs/procedencia/editorial/flujo-rentas-r21-sol/entradas-editoriales.json"
dep = next(d for d in m["dependencies"] if d["path"] == name)
row = json.loads((CACHE / "restauracion-v5/dependencies" / dep["sha256"]).read_bytes())[
    "citations"
][0]
# Only structural keys and hashes; no private context values.
result = {
    "id": "V5R28-CL01",
    "expected": "un digest de selección no debe identificarse como original documental por URL contigua",
    "expectedNot": "original-oficial",
    "actual": observed["kind"],
    "pass": observed["kind"] != "original-oficial",
    "realSample": {
        "path": name,
        "pointer": "/citations/0/selectionSha256",
        "keys": list(row),
        "selectionSha256": row["selectionSha256"],
    },
    "impact": "clasificación candidata; no demuestra pérdida del original ni defecto de transporte",
}
(CACHE / "clasificacion.json").write_text(
    json.dumps(result, indent=2, ensure_ascii=False)
)
print(json.dumps(result, ensure_ascii=False))
if not result["pass"]:
    raise SystemExit(1)
