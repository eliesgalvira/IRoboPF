"""Transporte probado sin commits, índice ni checkouts adicionales."""

import difflib
import gzip
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess

ROOT = Path.cwd()
OUT = ROOT / "docs/procedencia/implementaciones/contrato-nominal-r29-sol"
BASE = "0d1f0e26d752a9466aefec35e7f517db5ddcdc37"
MODIFIED = {
    "tools/procedencia/enlaces.py",
    "scripts/procedencia/ambito-publicado.mjs",
    "schemas/procedencia/binding-payload.schema.json",
    "schemas/procedencia/executable-cell-scope.schema.json",
}
EXCLUDED = {"manifiesto.json", "entrega.patch.gz", "binarios.json", "transporte.json"}


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def main():
    assert (
        subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip() == BASE
    )
    initial = json.loads(
        gzip.decompress((OUT / "recepcion-limpia.json.gz").read_bytes())
    )
    final = json.loads(gzip.decompress((OUT / "final.json.gz").read_bytes()))
    assert initial["entries"] == final["entries"] == 16106
    assert not initial["mismatches"] and not initial["diff"]
    assert {r["path"] for r in final["mismatches"]} == MODIFIED
    assert not any(r.get("missing") for r in final["files"])
    paths = set(MODIFIED)
    for pattern in [
        "schemas/procedencia/nominal-*.json",
        "scripts/procedencia/nominal-*.mjs",
        "tools/procedencia/nominal*.py",
        "tests/nominal-*.test.mjs",
        "tests/test_nominal_*.py",
    ]:
        paths.update(str(p.relative_to(ROOT)) for p in ROOT.glob(pattern))
    paths.update(
        str(p.relative_to(ROOT))
        for p in OUT.iterdir()
        if p.is_file() and p.name not in EXCLUDED
    )
    # Los contratos históricos deben conservar sus valores JSON completos.
    for name, branch in [("binding-payload", slice(0, 2)), ("executable-cell-scope", 0)]:
        relative = "schemas/procedencia/" + name + ".schema.json"
        old = json.loads(subprocess.check_output(["git", "show", BASE + ":" + relative]))
        new = json.loads((ROOT / relative).read_bytes())["oneOf"][branch]
        assert new == (old["oneOf"] if name == "binding-payload" else old)
    physical = set()
    for directory, folders, files in os.walk(ROOT, followlinks=False):
        if Path(directory) == ROOT:
            folders[:] = [f for f in folders if f not in (".git", ".cache")]
            files = [f for f in files if f not in (".git", ".codex")]
        for name in files:
            physical.add(str((Path(directory) / name).relative_to(ROOT)))
        for name in folders:
            path = Path(directory) / name
            if path.is_symlink():
                physical.add(str(path.relative_to(ROOT)))
    known = {r["path"] for r in initial["files"]} | paths | {str((OUT / n).relative_to(ROOT)) for n in EXCLUDED}
    assert not physical - known, sorted(physical - known)
    entries = []
    patch: list[str] = []
    binaries = []
    destination = ROOT / ".cache/nominal-r29/transporte-2"
    destination.mkdir(parents=True, exist_ok=True)
    for name in sorted(paths):
        path = ROOT / name
        raw = path.read_bytes()
        before = (
            subprocess.check_output(["git", "show", BASE + ":" + name])
            if name in MODIFIED
            else b""
        )
        base_hash = sha(before) if name in MODIFIED else None
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            raise ValueError(
                "Transporte requiere destino nuevo; conservar intentos anteriores"
            )
        if name in MODIFIED:
            target.write_bytes(before)
        elif not raw:
            # Un diff de dos textos vacíos no crea el archivo añadido.
            target.write_bytes(b"")
        record = {
            "path": name,
            "sha256": sha(raw),
            "sha512": hashlib.sha512(raw).hexdigest(),
            "size": len(raw),
            "baseSha256": base_hash,
            "executable": bool(path.stat().st_mode & 0o111),
        }
        entries.append(record)
        try:
            text = raw.decode("utf8")
            if "\0" in text:
                raise UnicodeError("binario")
        except UnicodeError:
            binaries.append(record)
            shutil.copyfile(path, target)
        else:
            patch.extend(
                difflib.unified_diff(
                    before.decode("utf8").splitlines(True),
                    text.splitlines(True),
                    fromfile="a/" + name if name in MODIFIED else "/dev/null",
                    tofile="b/" + name,
                )
            )
    patch_raw = "".join(patch).encode()
    (OUT / "entrega.patch.gz").write_bytes(gzip.compress(patch_raw, mtime=0))
    subprocess.run(
        ["patch", "-p1", "--batch", "--directory", str(destination)],
        input=patch_raw,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    for record in entries:
        target = destination / record["path"]
        target.chmod(0o755 if record["executable"] else 0o644)
        assert (
            sha(target.read_bytes()) == record["sha256"]
            and target.stat().st_size == record["size"]
        )
    def write(name, value):
        (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    write(
        "manifiesto.json",
        {
            "head": BASE,
            "entries": entries,
            "deleted": [],
            "excludedPackaging": sorted(EXCLUDED),
            "scratchExcluded": ".cache/nominal-r29/",
        },
    )
    write("binarios.json", binaries)
    write(
        "transporte.json",
        {
            "head": BASE,
            "exactFilesVerified": len(entries),
            "scratch": str(destination),
            "patchSha256": sha((OUT / "entrega.patch.gz").read_bytes()),
            "manifestSha256": sha((OUT / "manifiesto.json").read_bytes()),
            "binaryMapSha256": sha((OUT / "binarios.json").read_bytes()),
            "deleted": [],
            "vcsMutations": False,
        },
    )
    print(
        json.dumps(
            {"verified": len(entries), "binaryFiles": len(binaries), "deleted": 0}
        )
    )


if __name__ == "__main__":
    main()
