"""Transporta solo la propiedad R27, sin VCS ni originales PDF."""

import difflib
import gzip
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
EXCLUDED = {"manifiesto.json", "binarios.json", "entrega.patch.gz", "transporte.json"}


def entry(path):
    raw = path.read_bytes()
    return {
        "path": path.relative_to(ROOT).as_posix(),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "sha512": hashlib.sha512(raw).hexdigest(),
        "size": len(raw),
        "executable": bool(path.stat().st_mode & 0o111),
        "baseSha256": None,
    }


def save(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main():
    scratch = Path(
        tempfile.mkdtemp(prefix="transporte-", dir=ROOT / ".cache/madrid-r27")
    )
    paths = sorted(p for p in OUT.rglob("*") if p.is_file() and p.name not in EXCLUDED)
    patch: list[str] = []
    binaries = []
    for path in paths:
        raw = path.read_bytes()
        name = path.relative_to(ROOT).as_posix()
        if path.suffix in {".png", ".gz"}:
            binaries.append(entry(path))
        else:
            text = raw.decode("utf-8")
            patch.extend(
                difflib.unified_diff(
                    [],
                    text.splitlines(keepends=True),
                    fromfile="/dev/null",
                    tofile="b/" + name,
                )
            )
    patch_raw = "".join(patch).encode()
    (OUT / "entrega.patch.gz").write_bytes(gzip.compress(patch_raw, mtime=0))
    save(
        "binarios.json",
        {
            "files": binaries,
            "transport": "Bytes originales en cada ruta; no se incluyen PDF ni CAS scratch.",
        },
    )
    save(
        "manifiesto.json",
        {
            "base": "1ed8acfdf77dfee5330da0f0131f42956b45206a",
            "head": subprocess.check_output(["git", "rev-parse", "HEAD"])
            .decode()
            .strip(),
            "files": [entry(p) for p in paths],
            "excludedPackagingArtifacts": sorted(EXCLUDED),
            "baseModifications": [],
            "deletions": [],
        },
    )
    # Árbol de reconstrucción de la entrega; no es un checkout ni copia de app.
    result = subprocess.run(
        ["patch", "-p1", "--batch", "--forward", "-d", str(scratch)],
        input=patch_raw,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False,
    )
    assert result.returncode == 0, result.stdout.decode()
    for b in binaries:
        target = scratch / b["path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / b["path"], target)
    for p in paths:
        assert (scratch / p.relative_to(ROOT)).read_bytes() == p.read_bytes()
        assert bool((scratch / p.relative_to(ROOT)).stat().st_mode & 0o111) == bool(
            p.stat().st_mode & 0o111
        )
    save(
        "transporte.json",
        {
            "textPatchAndBinaryReplay": "passed",
            "checkedFiles": len(paths),
            "scratch": scratch.relative_to(ROOT).as_posix(),
            "packagingArtifacts": [
                entry(OUT / n)
                for n in ["manifiesto.json", "binarios.json", "entrega.patch.gz"]
            ],
            "receiptSelfHash": "excluded-to-avoid-circularity",
            "noVcsMutation": True,
        },
    )
    print("Transporte textual/binario reconstruido y cotejado:", len(paths))


if __name__ == "__main__":
    main()
