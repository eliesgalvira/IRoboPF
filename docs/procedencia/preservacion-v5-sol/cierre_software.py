"""Control independiente de cierre de fuentes: identidad origen y transporte exactos."""

import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", type=Path, required=True)
    args = parser.parse_args()
    m = json.loads((args.cache / "manifest-final.json").read_bytes())
    deps = {row["path"]: row for row in m["dependencies"]}
    missing = []
    for name, fp in m["software"].items():
        row = deps.get(name)
        if row is None or any(row[k] != fp[k] for k in ("sha256", "sha512", "size")):
            missing.append(name)
    print({"missingOrTransformedSoftware": missing, "checked": len(m["software"])})
    assert not missing


if __name__ == "__main__":
    main()
