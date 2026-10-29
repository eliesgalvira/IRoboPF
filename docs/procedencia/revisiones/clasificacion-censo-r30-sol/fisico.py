import subprocess
import os
import stat
import hashlib
import json
import time
import resource
from pathlib import Path

root = Path.cwd()
start = time.monotonic()
rows = []
bad = []
entries = subprocess.check_output(["git", "ls-tree", "-rz", "HEAD"]).split(b"\0")
for entry in entries:
    if not entry:
        continue
    meta, name = entry.split(b"\t", 1)
    mode, kind, oid = meta.split()
    path = os.fsdecode(name)
    p = root / path
    blob = subprocess.check_output(["git", "cat-file", "blob", oid.decode()])
    s = p.lstat()
    data = os.fsencode(os.readlink(p)) if stat.S_ISLNK(s.st_mode) else p.read_bytes()
    ok = data == blob and (
        (mode == b"120000" and stat.S_ISLNK(s.st_mode))
        or (
            mode != b"120000"
            and stat.S_ISREG(s.st_mode)
            and bool(s.st_mode & 0o111) == (mode == b"100755")
        )
    )
    row = {
        "path": path,
        "baseSha256": hashlib.sha256(blob).hexdigest(),
        "sha256": hashlib.sha256(data).hexdigest(),
        "size": len(data),
        "mode": oct(s.st_mode),
        "ok": ok,
    }
    rows.append(row)
    if not ok:
        bad.append(row)
print(
    json.dumps(
        {
            "head": subprocess.check_output(["git", "rev-parse", "HEAD"])
            .decode()
            .strip(),
            "entries": len(rows),
            "differences": bad,
            "seconds": time.monotonic() - start,
            "maxRssKiB": resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
            "rows": rows,
        }
    )
)
