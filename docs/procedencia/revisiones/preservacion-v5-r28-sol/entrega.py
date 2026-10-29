"""Manifiesto, patch textual y ensayo de transporte exclusivo del ámbito nuevo."""

import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess
from typing import TypedDict


class Entry(TypedDict):
    path: str
    sha256: str
    size: int
    baseSha256: None


ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/revisiones/preservacion-v5-r28-sol"
CACHE = ROOT / ".cache/revision-v5-r28"
excluded = {"MANIFIESTO.json", "entrega.patch.gz", "binarios.json", "transporte.json"}
rows: list[Entry] = []
binaries: list[Entry] = []
parts = []
for path in sorted(OUT.rglob("*")):
    if not path.is_file() or path.name in excluded:
        continue
    raw = path.read_bytes()
    relative = path.relative_to(ROOT).as_posix()
    row: Entry = {
        "path": relative,
        "sha256": hashlib.sha256(raw).hexdigest(),
        "size": len(raw),
        "baseSha256": None,
    }
    rows.append(row)
    try:
        text = raw.decode("utf-8")
        if "\0" in text:
            raise UnicodeError("binary")
    except UnicodeError:
        binaries.append(row)
        continue
    parts.append("diff --git a/" + relative + " b/" + relative + "\n")
    parts.append("new file mode 100644\n")
    for line in difflib.unified_diff(
        [],
        text.splitlines(keepends=True),
        fromfile="/dev/null",
        tofile="b/" + relative,
    ):
        parts.append(
            line if line.endswith("\n") else line + "\n\\ No newline at end of file\n"
        )
patch_bytes = "".join(parts).encode()
(OUT / "entrega.patch.gz").write_bytes(gzip.compress(patch_bytes, mtime=0))
(OUT / "binarios.json").write_text(json.dumps(binaries, indent=2) + "\n")
(OUT / "MANIFIESTO.json").write_text(
    json.dumps(
        {
            "base": subprocess.check_output(["git", "rev-parse", "HEAD"])
            .decode()
            .strip(),
            "files": rows,
            "excludedSelfReferences": sorted(excluded),
        },
        indent=2,
    )
    + "\n"
)
target = CACHE / "transporte-final"
target.mkdir(exist_ok=False)
result = subprocess.run(
    ["patch", "-p1", "-d", str(target)],
    input=patch_bytes,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    check=True,
)
(CACHE / "transporte.log").write_bytes(result.stdout)
for row in binaries:
    path = target / row["path"]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes((ROOT / row["path"]).read_bytes())
for row in rows:
    assert (
        hashlib.sha256((target / row["path"]).read_bytes()).hexdigest() == row["sha256"]
    )
(OUT / "transporte.json").write_text(
    json.dumps(
        {
            "textPatchApplied": True,
            "allManifestBytesExact": True,
            "files": len(rows),
            "binaryFiles": len(binaries),
            "base": subprocess.check_output(["git", "rev-parse", "HEAD"])
            .decode()
            .strip(),
        },
        indent=2,
    )
    + "\n"
)
print("Transporte textual/binario exacto")
