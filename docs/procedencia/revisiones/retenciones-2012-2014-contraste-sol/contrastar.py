import gzip
import hashlib
import json
import subprocess
from pathlib import Path
import fitz

out = Path(__file__).parent
src = out.parent / "retenciones-2012-2014-sol"


def load(p):
    return json.loads(p.read_text())


paths = {r["sha256"]: r["path"] for r in load(out / "fuentes.json")}
checks = []
texts = []
for name in ["citas-boe.json", "citas-tablas.json"]:
    for c in load(src / name):
        if "documentSha256" not in c or "text" not in c:
            continue
        d = fitz.open(paths[c["documentSha256"]])
        p = d[c["page"] - 1]
        t = p.get_text()
        checks.append({"id": c["id"], "textEqual": t == c["text"]})
        texts.append(c["id"] + "\n" + t)
(out / "cotejo-norma.json").write_text(json.dumps(checks, indent=2))
with gzip.open(out / "normas.txt.gz", "wt") as f:
    f.write("\n".join(texts))
results = []
for script in ["casos.py", "regularizacion-casos.py"]:
    run = subprocess.run(
        ["python", str(out / "scratch" / script)], capture_output=True, text=True
    )
    (out / (script + ".log")).write_text(run.stdout + run.stderr)
    assert run.returncode == 0
    assert (out / "scratch" / script).read_bytes() == (src / script).read_bytes()
for name in [
    "casos-resultados.json",
    "regularizacion-resultados.json",
    "regularizacion-casos.json",
]:
    b = (out / "scratch" / name).read_bytes()
    results.append(
        {
            "path": name,
            "equal": b == (src / name).read_bytes(),
            "sha256": hashlib.sha256(b).hexdigest(),
            "entries": len(json.loads(b)),
        }
    )
(out / "repeticion.json").write_text(json.dumps(results, indent=2))
print(checks)
print(results)
