import hashlib
import json
import shutil
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[4]
out = root / ".cache/ambitos/e2e"
out.mkdir(parents=True, exist_ok=True)


def copy(p):
    target = out / p
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(root / p, target)


def write(p, o):
    target = out / p
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(o, ensure_ascii=False, indent=2) + "\n")
    return {"path": p, "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}


for p in (
    subprocess.check_output(
        ["git", "-C", str(root), "ls-tree", "-rz", "--name-only", "HEAD"]
    )
    .decode()
    .split("\0")
):
    if not p or p.startswith(("docs/", "tests/", ".github/")):
        continue
    if (root / p).is_file():
        copy(p)
for p in [
    "scripts/procedencia/ambito-publicado.mjs",
    "schemas/procedencia/executable-cell-scope.schema.json",
]:
    copy(p)
for inventory_path in (root / "docs/procedencia").glob("inventario*"):
    if inventory_path.is_file():
        copy(str(inventory_path.relative_to(root)))
folder = "docs/procedencia/implementaciones/integracion-sol-r17/candidatos"
for d in json.loads((root / folder / "correspondencias.json").read_bytes())[
    "dependencies"
]:
    copy(d["path"])
p = folder + "/payloads/ambito-r17-EAV2-madrid-2022-f1-baseInferior.json"
copy(p)
payload = json.loads((root / p).read_bytes())
for k in ["document", "citation", "executableScope"]:
    copy(payload[k]["path"])
copy("docs/procedencia/implementaciones/contenidos/conceptos.json")
for c in json.loads(
    (root / "docs/procedencia/implementaciones/contenidos/conceptos.json").read_bytes()
):
    copy(c["informe"])
doc = json.loads((root / payload["document"]["path"]).read_bytes())
cite = json.loads((root / payload["citation"]["path"]).read_bytes())
for h in [doc["sha256"], cite["facsimile"]["sha256"]]:
    source = Path("/home/elies/Repos/IRoboPF/.cache/procedencia/sha256") / h
    if not source.exists():
        source = next((root / "docs/procedencia/evidencias").rglob(h + ".png"))
    target = out / "docs/procedencia/corpus/fixtures/sha256" / h
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
report = write(
    "docs/procedencia/revisiones/synthetic-e2e/report.json",
    {"syntheticOnly": True, "warning": "NO ES UNA REVISION REAL"},
)
payloadref = {"path": p, "sha256": hashlib.sha256((out / p).read_bytes()).hexdigest()}
att = write(
    "docs/procedencia/revisiones/synthetic-e2e/attestation.json",
    {
        "schemaVersion": 1,
        "payloadSha256": payloadref["sha256"],
        "inventory": payload["inventory"],
        "scope": payload["scope"],
        "decision": "accepted-limited",
        "reviewTaskId": "synthetic-e2e-review",
        "report": report,
    },
)
delegates = write(
    "docs/procedencia/synthetic-e2e-delegates.json",
    {"version": 1, "delegate": {"taskId": "synthetic-e2e-review"}},
)
write(
    "docs/procedencia/enlaces/revisores.json",
    {
        "schemaVersion": 2,
        "reviewers": [
            {
                "taskId": "synthetic-e2e-review",
                "delegationRegistry": delegates,
                "reportDirectory": "docs/procedencia/revisiones/synthetic-e2e",
                "approvals": [
                    {"payloadSha256": payloadref["sha256"], "attestation": att}
                ],
            }
        ],
    },
)
write(
    "docs/procedencia/enlaces/registro.json",
    {"schemaVersion": 1, "entries": [{"payload": payloadref, "attestation": att}]},
)
if not (out / "node_modules").exists():
    (out / "node_modules").symlink_to("/home/elies/Repos/IRoboPF/node_modules")
print("scratch sintético listo")
