"""Ejecuta herramientas transportadas y contrasta suplemento con datos restaurados."""

import hashlib
import html
import importlib
import json
from pathlib import Path
import re
import resource
import runpy
import sys
import time

ROOT = Path.cwd()
CACHE = ROOT / ".cache/revision-v5-r28"
SOFT = CACHE / "software-restaurado"
HERE = SOFT / "docs/procedencia/preservacion-v5-sol"
sys.path.insert(0, str(HERE))
start = time.monotonic()
parent_root = Path("/home/elies/Repos/IRoboPF")
delivered = parent_root / ".cache/orquestador-preservacion/v5-r2-2b15925970d4"


def audit_open(event, args):
    if event != "open" or not isinstance(args[0], (str, bytes)):
        return
    path = (
        Path(args[0]).resolve()
        if isinstance(args[0], str)
        else Path(args[0].decode()).resolve()
    )
    if path.is_relative_to(parent_root) and not path.is_relative_to(delivered):
        raise PermissionError(
            "Lectura fuera de la entrega recibida: bloqueada sin imprimir ruta"
        )


sys.addaudithook(audit_open)
for name, output in [
    ("recuperar2.py", "recuperacion.json"),
    ("selector_ine.py", "ine.json"),
]:
    sys.argv = [
        str(HERE / name),
        "--cache",
        str(CACHE),
        "--output",
        str(CACHE / output),
    ]
    runpy.run_path(str(HERE / name), run_name="__main__")
c = importlib.import_module("consumidor")
m = json.loads((CACHE / "manifest-final.json").read_bytes())
deps = {d["path"]: d for d in m["dependencies"]}
received_restoration = c.verify(
    delivered / "restauracion",
    hashlib.sha256((CACHE / "manifest-final.json").read_bytes()).hexdigest(),
    CACHE / "manifest-final.json",
)
for folder, rows in [("sha256", m["objects"]), ("dependencies", m["dependencies"])]:
    for row in {r["sha256"]: r for r in rows}.values():
        paths = [
            delivered / "paquete" / folder / row["sha256"],
            delivered / "restauracion" / folder / row["sha256"],
            CACHE / "restauracion-v5" / folder / row["sha256"],
        ]
        stats = [path.stat() for path in paths]
        assert len({(st.st_dev, st.st_ino) for st in stats}) == 3
        assert all(st.st_nlink == 1 for st in stats)

package = CACHE / "restauracion-v5"


def raw(name):
    row = deps[name]
    path = package / "dependencies" / row["sha256"]
    c.p.check(path, row)
    return path.read_bytes()


large = raw("docs/procedencia/auditorias/retenciones-2020-2026/citas-candidatas.json")
assert c.p.encoded(c.p.strict_json(large)) == large
citations = c.p.strict_json(
    raw(
        "docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol/citas-propias.json"
    )
)
sample = next(
    row
    for row in citations
    if row.get("sourceSha256Prefix") == "82a57fd7" and row.get("selector") == 'id="a84"'
)
obj = next(row for row in m["objects"] if row["sha256"].startswith("82a57fd7"))
path = package / "sha256" / obj["sha256"]
c.p.check(path, obj)
chunks = re.split(r'<div[^>]+class="bloque"', path.read_text())
selected = [chunk for chunk in chunks if sample["selector"] in chunk[:300]]
assert len(selected) == 1
text = " ".join(html.unescape(re.sub("<[^>]+>", " ", selected[0])).split())
assert text == sample["textNormalized"]
imports = {
    name: module.__file__
    for name, module in sys.modules.items()
    if name in ("consumidor", "preservacion", "preservacion_urls", "v3")
}
imports["v3-explicit"] = c.v3.__file__
assert all(
    value is not None and Path(value).is_relative_to(SOFT) for value in imports.values()
)
identities = {}
for name, row in m["software"].items():
    c.p.check(SOFT / name, row)
    identities[name] = row
result = {
    "receivedRestoration": received_restoration,
    "threeCopiesNoHardlinks": True,
    "parentFallbackReadGuard": True,
    "imports": imports,
    "software": identities,
    "largeIndex": {
        "bytes": len(large),
        "sha256": hashlib.sha256(large).hexdigest(),
        "canonicalExact": True,
    },
    "historicalHtml": dict(obj, selector=sample["selector"], normalizedTextExact=True),
    "seconds": time.monotonic() - start,
    "maxRssKiB": resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
}
(CACHE / "recuperacion-independiente.json").write_text(json.dumps(result, indent=2))
print("Software restaurado, índice canónico y HTML histórico contrastados")
