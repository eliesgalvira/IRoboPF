"""Pins completos de las fuentes examinadas y comprobación de anti-slop."""

import hashlib
import json
import os
from pathlib import Path
import subprocess

out = Path("docs/procedencia/revisiones/preservacion-r21-sol")
paths = [
    "AGENTS.md",
    "docs/procedencia/CONTRATO-AUDITORIA.md",
    "docs/procedencia/COORDINACION.md",
    "docs/procedencia/ESTADO.md",
    "docs/procedencia/DECISIONES.md",
    "docs/procedencia/preservacion-v3/recolector.py",
    "docs/procedencia/preservacion-v3/manifest.json",
    "docs/procedencia/preservacion-v3/transporte-v2.json",
    "tools/procedencia/preservacion.py",
    "tools/procedencia/preservacion_urls.py",
    "tools/procedencia/preservacion.schema.json",
    "tools/procedencia/preservacion_ampliacion.schema.json",
    "tools/procedencia/preservacion_tgss_urls.json",
    "docs/procedencia/revisiones/preservacion-v3-sol/INFORME.md",
    "docs/procedencia/revisiones/preservacion-v3-sol/adversos_test.py",
    "docs/procedencia/revisiones/preservacion-v3-sol/auditar.py",
    "docs/procedencia/correcciones/preservacion-r21/INFORME.md",
    "docs/procedencia/correcciones/preservacion-r21/COMANDOS.md",
    "docs/procedencia/correcciones/preservacion-r21/adversos.py",
    "docs/procedencia/correcciones/preservacion-r21/mypy-entrega.log",
    "docs/procedencia/correcciones/preservacion-r21/diez-verdes-cierre.log",
    "docs/procedencia/correcciones/editorial-r21/evidencias.py",
    ".oxlintrc.json",
]
rows = []
for name in paths:
    path = Path(name)
    raw = os.fsencode(os.readlink(path)) if path.is_symlink() else path.read_bytes()
    original = subprocess.check_output(
        ["git", "cat-file", "blob", "960773f909d4ecff290edfa3d7a7b2699a8445d3:" + name]
    )
    assert raw == original, name
    rows.append(
        dict(
            path=name,
            sha256=hashlib.sha256(raw).hexdigest(),
            sha512=hashlib.sha512(raw).hexdigest(),
            size=len(raw),
        )
    )
(out / "fuentes.json").write_text(json.dumps(rows, indent=2) + "\n")
rules = {
    k: v
    for k, v in json.loads(Path(".oxlintrc.json").read_text())["rules"].items()
    if k.startswith(("anti-slop/", "anti-slop-effect/"))
}
assert len(rules) == 16 and set(rules.values()) == {"error"}
(out / "anti-slop.json").write_text(json.dumps(rules, indent=2) + "\n")
print(len(rows), "pins completos, 16 reglas a error")
