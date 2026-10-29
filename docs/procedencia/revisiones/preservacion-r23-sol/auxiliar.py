"""Pins, configuración de lint y runtime propio con dependencias de lectura."""

import hashlib
import json
from pathlib import Path
import shutil

root = Path.cwd()
out = root / "docs/procedencia/revisiones/preservacion-r23-sol"
dest = root / ".cache/preservacion-r23-sol/lint"
dest.mkdir(exist_ok=True)
(dest / "tools").mkdir(exist_ok=True)
shutil.copytree(root / "tools/oxlint", dest / "tools/oxlint", dirs_exist_ok=True)
shutil.copyfile(root / ".oxlintrc.json", dest / ".oxlintrc.json")
if not (dest / "node_modules").exists():
    (dest / "node_modules").symlink_to(
        "/home/elies/Repos/IRoboPF/node_modules", target_is_directory=True
    )
shutil.copyfile(out / "historicos.mjs", dest / "historicos.mjs")
rows = []
for original in (root / "tools/oxlint").rglob("*"):
    if original.is_file():
        assert original.read_bytes() == (dest / original.relative_to(root)).read_bytes()
        rows.append(
            dict(
                path=str(original.relative_to(root)),
                sha256=hashlib.sha256(original.read_bytes()).hexdigest(),
            )
        )
(out / "lint-runtime.json").write_text(json.dumps(rows, indent=2) + "\n")
rules = {
    k: v
    for k, v in json.loads((root / ".oxlintrc.json").read_bytes())["rules"].items()
    if k.startswith(("anti-slop/", "anti-slop-effect/"))
}
assert len(rules) == 16 and set(rules.values()) == {"error"}
(out / "anti-slop.json").write_text(json.dumps(rules, indent=2) + "\n")
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
    "docs/procedencia/revisiones/preservacion-r21-sol/INFORME.md",
    "docs/procedencia/revisiones/preservacion-r21-sol/revisar.py",
    "docs/procedencia/revisiones/preservacion-r21-sol/rojos_test.py",
    "docs/procedencia/revisiones/preservacion-r21-sol/complementos.py",
    "docs/procedencia/correcciones/tecnica-r23/INFORME.md",
    "docs/procedencia/correcciones/tecnica-r23/preservacion-controles.py",
    "docs/procedencia/correcciones/tecnica-r23/preservacion-politica.py",
    "docs/procedencia/correcciones/recepcion-r21-r23/INFORME.md",
    ".oxlintrc.json",
]
pins = []
for name in paths:
    path = root / name
    raw = (
        path.readlink().as_posix().encode() if path.is_symlink() else path.read_bytes()
    )
    pins.append(
        dict(
            path=name,
            sha256=hashlib.sha256(raw).hexdigest(),
            sha512=hashlib.sha512(raw).hexdigest(),
            size=len(raw),
        )
    )
(out / "fuentes.json").write_text(json.dumps(pins, indent=2) + "\n")
