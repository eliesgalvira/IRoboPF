"""Entrega por archivos contra base; excluye artefactos autorreferentes."""

import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/revisiones/preservacion-r21-sol"
BASE = "960773f909d4ecff290edfa3d7a7b2699a8445d3"
excluded = {"MANIFIESTO.json", "entrega.patch.gz", "binarios.json"}
rows, binaries = [], []
patches: list[str] = []
for path in sorted(OUT.rglob("*")):
    if not path.is_file() or path.name in excluded:
        continue
    relative = path.relative_to(ROOT).as_posix()
    raw = path.read_bytes()
    old = subprocess.run(
        ["git", "cat-file", "blob", BASE + ":" + relative], capture_output=True
    )
    assert old.returncode != 0, "Esta entrega solo añade archivos propios"
    row = dict(
        path=relative,
        sha256=hashlib.sha256(raw).hexdigest(),
        sha512=hashlib.sha512(raw).hexdigest(),
        size=len(raw),
        baseSha256=None,
    )
    rows.append(row)
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        binaries.append(row)
    else:
        patches.extend(
            difflib.unified_diff(
                [],
                text.splitlines(keepends=True),
                fromfile="/dev/null",
                tofile="b/" + relative,
            )
        )
(OUT / "entrega.patch.gz").write_bytes(
    gzip.compress("".join(patches).encode(), mtime=0)
)
(OUT / "binarios.json").write_text(json.dumps(binaries, indent=2) + "\n")
(OUT / "MANIFIESTO.json").write_text(
    json.dumps(
        dict(
            base=BASE,
            head=subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip(),
            files=rows,
            deleted=[],
            exclusions=sorted(excluded),
        ),
        indent=2,
    )
    + "\n"
)
print(len(rows), "archivos; sin borrados; patch y binarios separados")
