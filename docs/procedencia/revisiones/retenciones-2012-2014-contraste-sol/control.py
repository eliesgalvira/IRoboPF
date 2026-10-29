import gzip
import hashlib
import json
import os
import stat
import subprocess
import sys
from pathlib import Path

base = "960773f909d4ecff290edfa3d7a7b2699a8445d3"
out = Path(__file__).parent
entries = []
for entry in subprocess.check_output(["git", "ls-tree", "-rz", base]).split(b"\0"):
    if not entry:
        continue
    meta, path = entry.split(b"\t", 1)
    mode, kind, oid = meta.decode().split()
    p = Path(os.fsdecode(path))
    s = p.lstat()
    link = os.readlink(p) if stat.S_ISLNK(s.st_mode) else None
    actual = os.fsencode(link) if link is not None else p.read_bytes()
    expected = subprocess.check_output(["git", "cat-file", "blob", oid])
    entries.append(
        {
            "path": str(p),
            "mode": mode,
            "lstatMode": s.st_mode,
            "readlink": link,
            "size": len(actual),
            "sha256": hashlib.sha256(actual).hexdigest(),
            "equal": actual == expected,
        }
    )
result = {
    "head": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
    "base": base,
    "count": len(entries),
    "differences": [e for e in entries if not e["equal"]],
    "deleted": [],
    "entries": entries,
    "diff": subprocess.check_output(["git", "diff", base, "--"], text=True),
}

with gzip.open(out / ("control-" + sys.argv[1] + ".json.gz"), "wt") as f:
    json.dump(result, f, ensure_ascii=False)
print(
    base,
    len(entries),
    sum(not e["equal"] for e in entries),
    len(subprocess.check_output(["git", "diff", base, "--"])),
)
