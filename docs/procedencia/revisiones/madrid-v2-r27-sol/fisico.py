import subprocess
import pathlib
import os
import stat
import hashlib
import json
import gzip
import sys

root = pathlib.Path.cwd()
base = "1ed8acfdf77dfee5330da0f0131f42956b45206a"
rows = subprocess.check_output(["git", "ls-tree", "-rz", base]).split(b"\0")
results = []
for row in rows:
    if not row:
        continue
    meta, name = row.split(b"\t", 1)
    mode, kind, oid = meta.decode().split()
    path = os.fsdecode(name)
    original = subprocess.check_output(["git", "cat-file", "blob", oid])
    p = root / path
    try:
        info = p.lstat()
        actual = (
            os.fsencode(os.readlink(p))
            if stat.S_ISLNK(info.st_mode)
            else p.read_bytes()
        )
        valid_type = (
            stat.S_ISLNK(info.st_mode)
            if mode == "120000"
            else stat.S_ISREG(info.st_mode)
        )
        equal = (
            valid_type
            and actual == original
            and (mode == "120000" or bool(info.st_mode & 0o111) == (mode == "100755"))
        )
        results.append(
            dict(
                path=path,
                baseSha256=hashlib.sha256(original).hexdigest(),
                sha256=hashlib.sha256(actual).hexdigest(),
                size=len(actual),
                mode=mode,
                equal=equal,
            )
        )
    except FileNotFoundError:
        results.append(dict(path=path, equal=False, deleted=True))
    del original
diff = subprocess.check_output(["git", "diff", base, "--"]).decode()
out = dict(
    head=subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip(),
    base=base,
    count=len(results),
    differences=[r for r in results if not r["equal"]],
    diff=diff,
    entries=results,
)
with gzip.open(sys.argv[1], "wt") as f:
    json.dump(out, f, ensure_ascii=False)
print(json.dumps({k: v for k, v in out.items() if k != "entries"}))
assert (
    out["head"] == base
    and len(results) == 15730
    and not out["differences"]
    and not diff
)
