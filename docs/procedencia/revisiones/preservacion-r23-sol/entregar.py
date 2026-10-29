"""Entrega sin mutaciones VCS; excluir derivados autorreferenciales."""

import gzip
import hashlib
import json
import os
from pathlib import Path
import subprocess

BASE = "07c07e6376a72f229be735a904ecf36517a1b571"
root = Path.cwd()
assert subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip() == BASE
out = Path(__file__).resolve().parent
excludes = {"MANIFIESTO.json", "entrega.patch.gz", "binarios.json"}
rows = []
binary = []
patch = bytearray()
for path in sorted(out.rglob("*")):
    if not path.is_file() or path.name in excludes:
        continue
    relative = str(path.relative_to(root))
    assert subprocess.run(["git", "cat-file", "-e", BASE + ":" + relative], capture_output=True).returncode != 0
    raw = path.read_bytes()
    row = dict(
        path=relative,
        sha256=hashlib.sha256(raw).hexdigest(),
        sha512=hashlib.sha512(raw).hexdigest(),
        size=len(raw),
        baseSha256=None,
    )
    rows.append(row)
    if b"\0" in raw or path.suffix == ".gz":
        binary.append(row)
    else:
        diff = subprocess.run(
            ["git", "diff", "--no-index", "--", "/dev/null", relative],
            capture_output=True,
        )
        assert diff.returncode in (0, 1), diff.stderr
        patch.extend(diff.stdout)
(out / "entrega.patch.gz").write_bytes(gzip.compress(bytes(patch), mtime=0))
(out / "binarios.json").write_text(json.dumps(binary, indent=2) + "\n")
(out / "MANIFIESTO.json").write_text(
    json.dumps(
        dict(
            base=BASE,
            head=subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip(),
            physicalEntries=14957,
            deletions=[],
            excludedDerivedFiles=sorted(excludes),
            files=rows,
        ),
        indent=2,
    )
    + "\n"
)
# Pines de los artefactos derivados se devuelven al terminal, sin autorreferencia.
for name in sorted(excludes):
    raw = (out / name).read_bytes()
    print(name, hashlib.sha256(raw).hexdigest(), len(raw))
assert all(
    Path(str(row["path"])).read_bytes()
    and hashlib.sha256(Path(str(row["path"])).read_bytes()).hexdigest() == row["sha256"]
    if row["size"]
    else Path(str(row["path"])).read_bytes() == b""
    for row in rows
)
print(len(rows), "archivos cotejados; binarios", len(binary), "cwd", os.getcwd())
