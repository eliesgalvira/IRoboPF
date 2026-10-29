"""Comprime controles físicos completos y registra diff y alcance de añadidos."""

import gzip
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/revisiones/clasificacion-censo-r30-sol"
CACHE = ROOT / ".cache/revision-clasificacion-r30"
results = []
for label in ["inicio", "final"]:
    raw = (CACHE / f"fisico-{label}.json").read_bytes()
    data = json.loads(raw)
    assert data["head"] == "376fb100512ca6a2f975c3c9500a20ee375dd431"
    assert data["entries"] == 16486 and not data["differences"]
    (OUT / f"fisico-{label}.json.gz").write_bytes(gzip.compress(raw, mtime=0))
    results.append({k: v for k, v in data.items() if k != "rows"})
for args, name in [
    (["git", "diff", "--no-ext-diff", "HEAD"], "diff-final.log"),
    (["git", "diff", "--no-ext-diff", "--cached", "HEAD"], "diff-indice-final.log"),
]:
    raw = subprocess.check_output(args)
    assert not raw
    (OUT / name).write_bytes(raw)
extra = subprocess.check_output(
    ["git", "ls-files", "--others", "--exclude-standard", "-z"]
).split(b"\0")
extras = [p.decode() for p in extra if p]
assert all(
    p.startswith(
        (
            "docs/procedencia/revisiones/clasificacion-censo-r30-sol/",
            ".cache/revision-clasificacion-r30/",
        )
    )
    for p in extras
)
precommit = json.loads(
    (
        ROOT
        / "docs/procedencia/correcciones/recepcion-r27-r28-r30/archivos-precommit.json"
    ).read_bytes()
)
checks = []
for name in [
    "docs/procedencia/preservacion-v5-sol/recolector.py",
    "tests/test_censo_clasificacion.py",
]:
    expected = next(r for r in precommit["files"] if r["path"] == name)
    digest = hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
    assert digest == expected["sha256"]
    checks.append({"path": name, "sha256": digest, "matchesFatherManifest": True})
(OUT / "cotejo-resumen.json").write_text(
    json.dumps(
        {
            "physical": results,
            "baseModifications": [],
            "deletions": [],
            "extraPaths": extras,
            "extraPathsAllInScope": True,
            "fatherManifest": checks,
        },
        ensure_ascii=False,
        indent=2,
    )
    + "\n"
)
print(
    "Dos cotejos íntegros de 16486 entradas; cero diferencias/borrados; añadidos solo de ámbito"
)
rules = json.loads((ROOT / ".oxlintrc.json").read_bytes())["rules"]
assert len(rules) == 16 and set(rules.values()) == {"error"}
(OUT / "reglas-anti-slop.json").write_text(json.dumps(rules, indent=2) + "\n")
