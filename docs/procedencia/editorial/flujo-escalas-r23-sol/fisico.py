"""Cotejo físico secuencial: ningún dato del índice decide el resultado."""

import gzip
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

BASE = "07c07e6376a72f229be735a904ecf36517a1b571"
OUT = Path(__file__).resolve().parent


def main() -> None:
    head = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    assert head == BASE
    rows = subprocess.check_output(["git", "ls-tree", "-rz", BASE]).split(b"\0")
    result = []
    for row in rows:
        if not row:
            continue
        meta, raw = row.split(b"\t", 1)
        mode, kind, oid = meta.decode().split()
        assert kind == "blob"
        path = Path(os.fsdecode(raw))
        original = subprocess.check_output(["git", "cat-file", "blob", oid])
        info = path.lstat()
        actual = (
            os.fsencode(os.readlink(path))
            if stat.S_ISLNK(info.st_mode)
            else path.read_bytes()
        )
        equal = actual == original
        correct_type = (
            stat.S_ISLNK(info.st_mode)
            if mode == "120000"
            else (
                stat.S_ISREG(info.st_mode)
                and bool(info.st_mode & 0o111) == (mode == "100755")
            )
        )
        result.append(
            {
                "path": str(path),
                "mode": mode,
                "lstatMode": info.st_mode,
                "readlink": os.readlink(path) if stat.S_ISLNK(info.st_mode) else None,
                "size": len(actual),
                "sha256": hashlib.sha256(actual).hexdigest(),
                "baseSha256": hashlib.sha256(original).hexdigest(),
                "equal": equal,
                "typeEqual": correct_type,
            }
        )
    assert len(result) == 14957, len(result)
    data = {
        "head": head,
        "entries": len(result),
        "missing": [],
        "differences": [r for r in result if not r["equal"] or not r["typeEqual"]],
        "files": result,
    }
    with gzip.open(OUT / (sys.argv[1] + ".json.gz"), "wt") as out:
        json.dump(data, out, ensure_ascii=False)
    diff = subprocess.check_output(
        ["git", "diff", BASE, "--no-ext-diff", "--stat"], text=True
    )
    (OUT / (sys.argv[1] + "-diff.txt")).write_text(diff)
    assert not data["differences"]
    print(head, len(result), "sin diferencias físicas; diff:", repr(diff))


if __name__ == "__main__":
    main()
