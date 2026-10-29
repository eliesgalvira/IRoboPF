import subprocess
import os
import stat
import hashlib
import json
import gzip
import sys
from pathlib import Path

base = "960773f909d4ecff290edfa3d7a7b2699a8445d3"
rows = []
for entry in subprocess.check_output(["git", "ls-tree", "-rz", base]).split(b"\0"):
    if not entry:
        continue
    meta, path = entry.split(b"\t")
    mode, kind, oid = meta.split()
    p = Path(os.fsdecode(path))
    row: dict[str, object] = {
        "path": str(p),
        "mode": mode.decode(),
        "oid": oid.decode(),
    }
    blob = subprocess.check_output(["git", "cat-file", "blob", oid.decode()])
    row["baseSha256"] = hashlib.sha256(blob).hexdigest()
    try:
        s = p.lstat()
        row["lstatMode"] = oct(s.st_mode)
        row["size"] = s.st_size
        if stat.S_ISLNK(s.st_mode):
            target = os.readlink(p)
            row["readlink"] = target
            actual = os.fsencode(target)
        elif stat.S_ISREG(s.st_mode):
            actual = p.read_bytes()
        else:
            actual = b""
            row["error"] = "non regular"
        row["sha256"] = hashlib.sha256(actual).hexdigest()
        row["typeEqual"] = (
            stat.S_ISLNK(s.st_mode) if mode == b"120000" else stat.S_ISREG(s.st_mode)
        )
        row["equal"] = actual == blob and row["typeEqual"]
    except FileNotFoundError:
        row["missing"] = True
        row["equal"] = False
    rows.append(row)
with gzip.open(sys.argv[1], "wt") as f:
    json.dump(rows, f, ensure_ascii=False)
print(
    json.dumps(
        {
            "head": subprocess.check_output(["git", "rev-parse", "HEAD"])
            .decode()
            .strip(),
            "entries": len(rows),
            "different": [r for r in rows if not r["equal"]],
        }
    )
)
