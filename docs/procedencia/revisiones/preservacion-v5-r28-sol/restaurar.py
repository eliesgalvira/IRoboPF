import importlib
import sys
import json
import time
import resource
import hashlib
import shutil
import os
from pathlib import Path

root = Path.cwd()
cache = root / ".cache/revision-v5-r28"
source = Path(
    "/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4"
)
pin = "2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88"
sys.path.insert(0, str(root / "docs/procedencia/preservacion-v5-sol"))
c = importlib.import_module("consumidor")

start = time.monotonic()
external = source / "manifest-externo.json"
assert hashlib.sha256(external.read_bytes()).hexdigest() == pin
shutil.copyfile(external, cache / "manifest-final.json")
shutil.copyfile(
    root / "docs/procedencia/preservacion-v5-sol/r2/PIN-final.json",
    cache / "PIN-final.json",
)
r = c.transfer(source / "paquete", cache / "restauracion-v5", pin, external)
m = c.load(pin, external)
soft = cache / "software-restaurado"
wanted = set(m["software"])
wanted.update(
    d["path"] for d in m["dependencies"] if d["path"].startswith("tools/procedencia/")
)
wanted.add("docs/procedencia/preservacion-v5-sol/recuperar.py")
for d in m["dependencies"]:
    if d["path"] in wanted:
        target = soft / d["path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        c.put(cache / "restauracion-v5/dependencies" / d["sha256"], target)
for name, fp in m["software"].items():
    c.p.check(soft / name, fp)
# Paths expected by the historical recovery helper point to the delivered package, read-only.
os.symlink(source / "paquete", cache / "paquete-v5")
r.update(
    seconds=time.monotonic() - start,
    maxRssKiB=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
    externalSha512=hashlib.sha512(external.read_bytes()).hexdigest(),
    softwareMaterialized=len(m["software"]),
)
(cache / "restauracion-recibo.json").write_text(json.dumps(r, indent=2))
print(json.dumps(r))
