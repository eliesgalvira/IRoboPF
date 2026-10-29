import gzip
import hashlib
import json
import os
import stat
import subprocess
import sys
from pathlib import Path

BASE = "07c07e6376a72f229be735a904ecf36517a1b571"
assert subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip() == BASE
rows: list[dict[str, object]] = []
for entry in subprocess.check_output(["git", "ls-tree", "-rz", BASE]).split(b"\0"):
    if not entry:
        continue
    meta, name = entry.split(b"\t")
    mode, kind, oid = meta.split()
    p = Path(os.fsdecode(name))
    blob = subprocess.check_output(["git", "cat-file", "blob", oid.decode()])
    row: dict[str, object] = {
        "path": str(p),
        "baseSha256": hashlib.sha256(blob).hexdigest(),
        "mode": mode.decode(),
    }
    try:
        s = p.lstat()
        actual = (
            os.fsencode(os.readlink(p)) if stat.S_ISLNK(s.st_mode) else p.read_bytes()
        )
        row.update(
            size=len(actual),
            sha256=hashlib.sha256(actual).hexdigest(),
            lstatMode=oct(s.st_mode),
            readlink=os.readlink(p) if stat.S_ISLNK(s.st_mode) else None,
        )
        row["equal"] = (
            actual == blob
            and (
                stat.S_ISLNK(s.st_mode)
                if mode == b"120000"
                else stat.S_ISREG(s.st_mode)
            )
            and (mode == b"120000" or bool(s.st_mode & 0o111) == (mode == b"100755"))
        )
    except OSError as error:
        row.update(equal=False, error=type(error).__name__)
    rows.append(row)
with gzip.open(sys.argv[1], "wt") as f:
    json.dump(rows, f)
print(
    json.dumps(
        {
            "head": BASE,
            "entries": len(rows),
            "different": [r for r in rows if not r["equal"]],
        }
    )
)
assert len(rows) == 14957 and all(r["equal"] for r in rows)
