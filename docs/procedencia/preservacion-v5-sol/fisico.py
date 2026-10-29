"""Cotejo físico completo, un blob por vez, sin mutaciones VCS."""

import gzip
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

ROOT = Path.cwd()
BASE = "6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9"
OUT = ROOT / "docs/procedencia/preservacion-v5-sol"


def main():
    assert (
        subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip() == BASE
    )
    rows = []
    batch = subprocess.Popen(
        ["git", "cat-file", "--batch"], stdin=subprocess.PIPE, stdout=subprocess.PIPE
    )
    assert batch.stdin and batch.stdout
    for entry in subprocess.check_output(["git", "ls-tree", "-rz", BASE]).split(b"\0"):
        if not entry:
            continue
        meta, name = entry.split(b"\t", 1)
        mode, kind, oid = meta.split()
        path = ROOT / os.fsdecode(name)
        info = path.lstat()
        batch.stdin.write(oid + b"\n")
        batch.stdin.flush()
        header = batch.stdout.readline().split()
        assert header[1] == b"blob"
        blob = batch.stdout.read(int(header[2]))
        assert batch.stdout.read(1) == b"\n"
        data = (
            os.fsencode(os.readlink(path)) if mode == b"120000" else path.read_bytes()
        )
        assert (
            stat.S_ISLNK(info.st_mode)
            if mode == b"120000"
            else stat.S_ISREG(info.st_mode)
        )
        if mode != b"120000":
            assert bool(info.st_mode & stat.S_IXUSR) == (mode == b"100755"), (
                os.fsdecode(name)
            )
        assert blob == data, os.fsdecode(name)
        rows.append(
            {
                "path": os.fsdecode(name),
                "sha256": hashlib.sha256(data).hexdigest(),
                "size": len(data),
                "mode": mode.decode(),
            }
        )
    batch.stdin.close()
    batch.wait()
    assert len(rows) == 15456, len(rows)
    result = {
        "head": BASE,
        "entries": len(rows),
        "physicalDifferences": [],
        "rows": rows,
        "diff": subprocess.check_output(["git", "diff", BASE, "--stat"]).decode(),
        "status": subprocess.check_output(["git", "status", "--porcelain"]).decode(),
    }
    with gzip.open(OUT / ("fisico-" + sys.argv[1] + ".json.gz"), "wt") as stream:
        json.dump(result, stream, ensure_ascii=False)
    print({"entries": len(rows), "physicalDifferences": 0})


if __name__ == "__main__":
    main()
