"""Sobre de transporte probado en scratch; sin operaciones VCS de escritura."""

import difflib
import gzip
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
from typing import TypedDict


class Entry(TypedDict):
    path: str
    sha256: str
    size: int
    baseSha256: None


ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/revisiones/clasificacion-censo-r30-sol"
CACHE = ROOT / ".cache/revision-clasificacion-r30"
EXCLUDED = {
    "MANIFIESTO.json",
    "entrega.patch.gz",
    "binarios.json",
    "transporte.json",
    "entrega.log",
}
DEST = CACHE / "transporte-r2"
DEST.mkdir(exist_ok=False)
files = []
patches = []
binaries = []
for path in sorted(OUT.rglob("*")):
    if not path.is_file() or path.name in EXCLUDED:
        continue
    name = path.relative_to(ROOT).as_posix()
    data = path.read_bytes()
    row: Entry = {
        "path": name,
        "sha256": hashlib.sha256(data).hexdigest(),
        "size": len(data),
        "baseSha256": None,
    }
    assert (
        subprocess.run(
            ["git", "cat-file", "-e", "HEAD:" + name], capture_output=True, check=False
        ).returncode
        != 0
    )
    files.append(row)
    if not data:
        binaries.append(row)
        continue
    try:
        content = data.decode("utf-8")
        if "\0" in content:
            raise UnicodeError("binary")
    except UnicodeError:
        binaries.append(row)
        continue
    assert not content or content.endswith("\n"), name
    patches.append(
        "".join(
            difflib.unified_diff(
                [], content.splitlines(True), fromfile="/dev/null", tofile="b/" + name
            )
        )
    )
patch = "".join(patches).encode()
(OUT / "entrega.patch.gz").write_bytes(gzip.compress(patch, mtime=0))
result = subprocess.run(
    ["patch", "--batch", "-p1", "-d", str(DEST)],
    input=gzip.decompress((OUT / "entrega.patch.gz").read_bytes()),
    capture_output=True,
    check=False,
)
(CACHE / "patch.log").write_bytes(result.stdout + result.stderr)
assert result.returncode == 0, result.stderr
for row in binaries:
    target = DEST / row["path"]
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / row["path"], target)
for row in files:
    data = (DEST / row["path"]).read_bytes()
    assert (
        len(data) == row["size"] and hashlib.sha256(data).hexdigest() == row["sha256"]
    )
for name, value in [
    (
        "MANIFIESTO.json",
        {
            "head": subprocess.check_output(["git", "rev-parse", "HEAD"])
            .decode()
            .strip(),
            "baseEntries": 16486,
            "baseModifications": [],
            "deletions": [],
            "files": files,
            "selfExcluded": sorted(EXCLUDED),
        },
    ),
    ("binarios.json", {"files": binaries}),
    (
        "transporte.json",
        {
            "files": len(files),
            "binaryFiles": len(binaries),
            "verified": True,
            "scratch": str(DEST.relative_to(ROOT)),
            "patchSha256": hashlib.sha256(
                (OUT / "entrega.patch.gz").read_bytes()
            ).hexdigest(),
            "noCheckoutCreated": True,
        },
    ),
]:
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
print("Transporte exacto:", len(files), "archivos; binarios:", len(binaries))
