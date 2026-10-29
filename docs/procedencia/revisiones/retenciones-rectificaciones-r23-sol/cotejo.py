import subprocess
import os
import stat
import json
from pathlib import Path

base = "07c07e6376a72f229be735a904ecf36517a1b571"
root = Path.cwd()
own = "docs/procedencia/revisiones/retenciones-rectificaciones-r23-sol/"
rows = subprocess.check_output(["git", "ls-tree", "-rz", base]).split(b"\0")
diffs = []
count = 0
for row in rows:
    if not row:
        continue
    meta, path = row.split(b"\t", 1)
    mode, kind, oid = meta.split()
    p = os.fsdecode(path)
    f = root / p
    count += 1
    blob = subprocess.check_output(["git", "cat-file", "blob", oid.decode()])
    try:
        s = f.lstat()
        data = (
            os.fsencode(os.readlink(f)) if stat.S_ISLNK(s.st_mode) else f.read_bytes()
        )
        goodmode = (
            stat.S_ISLNK(s.st_mode)
            if mode == b"120000"
            else stat.S_ISREG(s.st_mode)
            and bool(s.st_mode & 0o111) == (mode == b"100755")
        )
        if data != blob or not goodmode:
            diffs.append({"path": p, "bytesEqual": data == blob, "modeEqual": goodmode})
    except FileNotFoundError:
        diffs.append({"path": p, "missing": True})
assert count == 14957, count
r = {
    "head": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
    "base": base,
    "entries": count,
    "method": "ls-tree; lstat/readlink/bytes; cat-file blob individual; modos ejecutables",
    "differences": diffs,
    "diff": subprocess.check_output(["git", "diff", base, "--stat"], text=True),
    "status": subprocess.check_output(
        ["git", "status", "--short", "--untracked-files=all"], text=True
    ),
}
assert r["head"] == base
print(json.dumps(r, ensure_ascii=False, indent=2))
assert not diffs
