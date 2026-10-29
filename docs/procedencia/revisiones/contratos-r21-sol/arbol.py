"""Cotejo físico acotado: un blob Git cada vez, sin usar el índice."""
import gzip
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

BASE = "960773f909d4ecff290edfa3d7a7b2699a8445d3"
OUT = Path(__file__).resolve().parent


def main() -> None:
    head = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()
    assert head == BASE, head
    tree = subprocess.check_output(["git", "ls-tree", "-rz", BASE])
    rows = []
    for entry in tree.split(b"\0"):
        if not entry:
            continue
        metadata, raw_path = entry.split(b"\t", 1)
        mode, kind, oid = metadata.decode().split()
        assert kind == "blob", kind
        path = os.fsdecode(raw_path)
        source = subprocess.check_output(["git", "cat-file", "blob", oid])
        item: dict[str, object] = {"path": path, "mode": mode, "oid": oid,
                "baseSha256": hashlib.sha256(source).hexdigest()}
        try:
            info = os.lstat(path)
            link = os.readlink(path) if stat.S_ISLNK(info.st_mode) else None
            actual = os.fsencode(link) if link is not None else Path(path).read_bytes()
            item.update(size=len(actual), sha256=hashlib.sha256(actual).hexdigest(),
                        link=link, physicalMode=oct(info.st_mode),
                        equal=actual == source and (link is not None) == (mode == "120000")
                        and (mode != "100755" or bool(info.st_mode & 0o111)))
        except FileNotFoundError:
            item.update(equal=False, missing=True)
        rows.append(item)
    diff = subprocess.check_output(["git", "diff", BASE, "--"]).decode()
    result = {"head": head, "entries": len(rows), "mismatches":
              [r for r in rows if not r["equal"]], "diff": diff, "files": rows}
    with gzip.open(OUT / (sys.argv[1] + ".json.gz"), "wt") as stream:
        json.dump(result, stream, ensure_ascii=False)
    print(json.dumps({k: result[k] for k in ("head", "entries", "mismatches", "diff")}))
    assert len(rows) == 14537 and not result["mismatches"] and not diff


if __name__ == "__main__":
    main()
