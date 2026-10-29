from pathlib import Path
import shutil
import json

R = Path.cwd()
S = R / ".cache/nominal-r29/lint"
paths = [
    "docs/procedencia/implementaciones/contrato-nominal-r29-sol/recorrido.mjs",
    ".oxlintrc.json",
    "eslint.config.mjs",
    "scripts/procedencia/nominal-contrato.mjs",
    "scripts/procedencia/ambito-publicado.mjs",
    "tests/nominal-contrato.test.mjs",
]
paths += [str(p.relative_to(R)) for p in (R / "tools/oxlint").rglob("*") if p.is_file()]
for relative in paths:
    p = S / relative
    p.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(R / relative, p)
p = S / "node_modules"
if not p.exists():
    p.symlink_to("/home/elies/Repos/IRoboPF/node_modules")
r = json.loads((S / ".oxlintrc.json").read_bytes())["rules"]
assert len(r) == 16 and all(x == "error" for x in r.values())
(
    R / "docs/procedencia/implementaciones/contrato-nominal-r29-sol/reglas-lint.json"
).write_text(json.dumps(r, indent=2) + "\n")
# Existing Node scope tests run against exact copied consumers with dependencies read-only.
T = R / ".cache/nominal-r29/ensayo/tests"
T.mkdir(exist_ok=True)
shutil.copyfile(R / "tests/ambito-publicado.test.mjs", T / "ambito-publicado.test.mjs")
