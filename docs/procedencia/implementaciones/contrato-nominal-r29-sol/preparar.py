import hashlib
import json
import shutil
from pathlib import Path

R = Path.cwd()
S = R / ".cache/nominal-r29/ensayo"
OUT = R / "docs/procedencia/implementaciones/contrato-nominal-r29-sol"
S.mkdir(parents=True, exist_ok=True)
for name in ["Calculo_Salario_IRPF.py", "package.json", "tsconfig.json", "bun.lock"]:
    p = S / name
    if not p.exists():
        p.symlink_to(R / name)
if not (S / "lib").exists():
    shutil.copytree(R / "lib", S / "lib")
p = S / "node_modules"
if not p.exists():
    p.symlink_to("/home/elies/Repos/IRoboPF/node_modules")
for folder in ["scripts/procedencia", "tools/procedencia", "schemas/procedencia"]:
    for src in (R / folder).iterdir():
        if src.is_file():
            dst = S / folder / src.name
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dst)
# References are fixtures copied from delivered documents, never an active registry.
paths = {str(x.relative_to(R)) for x in OUT.glob("*.json")}
paths.update(
    [
        "docs/procedencia/inventario.json",
        "docs/procedencia/inventario-datos.json.gz",
        "docs/procedencia/inventario-schema.json",
        "docs/procedencia/implementaciones/madrid-v2-r25-sol/payload-v2.json",
        "docs/procedencia/implementaciones/madrid-v2-r25-sol/ambito.json",
    ]
)
paths.add("docs/procedencia/correcciones/madrid-nominal-r29/decision-nominal.json")
deps = json.loads(
    (R / "schemas/procedencia/nominal-dependencies.schema.json").read_bytes()
)["const"]
paths.update(x["path"] for x in deps["documents"])
# R25 antecedent reference closure, for the independent historical control.
p = json.loads((OUT / "payload.json").read_bytes())
for name in [
    p["citation"]["path"],
    p["document"]["path"],
    "docs/procedencia/revisiones/autonomicas-2017-2021/revisiones.json",
]:
    paths.add(name)
for name in paths:
    dst = S / name
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(R / name, dst)
cas = R / ".cache/nominal-r29/cas/sha256"
cas.mkdir(parents=True, exist_ok=True)
source = Path(
    "/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4/paquete/sha256"
)
blobs = []
for blob in deps["blobs"]:
    raw = (
        (R / "docs/procedencia/revisiones/madrid-v2-r27-sol/tabla.png")
        if blob["kind"] == "binding-facsimile"
        else source / blob["sha256"]
    ).read_bytes()
    assert (
        len(raw) == blob["size"]
        and hashlib.sha256(raw).hexdigest() == blob["sha256"]
        and hashlib.sha512(raw).hexdigest() == blob["sha512"]
    )
    (cas / blob["sha256"]).write_bytes(raw)
    blobs.append(blob)
c = json.loads((R / p["citation"]["path"]).read_bytes())
raw = (R / "docs/procedencia/revisiones/madrid-v2-r27-sol/tabla.png").read_bytes()
assert hashlib.sha256(raw).hexdigest() == c["facsimile"]["sha256"]
(cas / c["facsimile"]["sha256"]).write_bytes(raw)
ref = {
    "path": str((OUT / "payload.json").relative_to(R)),
    "sha256": hashlib.sha256((OUT / "payload.json").read_bytes()).hexdigest(),
}
registry = S / "docs/procedencia/enlaces/registro.json"
registry.parent.mkdir(parents=True, exist_ok=True)
registry.write_text(
    json.dumps({"schemaVersion": 1, "entries": [{"payload": ref, "attestation": None}]})
    + "\n"
)
(OUT / "originales.json").write_text(
    json.dumps(
        {
            "cas": str(cas.parent),
            "documents": [b for b in blobs if b["kind"] == "context-original"],
            "fixtureOnly": True,
            "preservationSource": str(source),
        },
        indent=2,
    )
    + "\n"
)
