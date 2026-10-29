"""Paquete de altas propias; metadatos excluyen su autorreferencia."""

import difflib
import gzip
import hashlib
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = Path.cwd()
EXCLUDED = {"manifiesto.json", "binarios.json", "entrega.patch.gz", "entrega.json"}


def main():
    for path in OUT.iterdir():
        if (
            path.is_file()
            and path.stat().st_size > 1_000_000
            and path.suffix in {".log", ".json"}
        ):
            compressed = OUT / (path.name + ".gz")
            compressed.write_bytes(gzip.compress(path.read_bytes(), mtime=0))
            path.unlink()
    manifest = []
    binaries = []
    patch: list[str] = []
    for path in sorted(OUT.iterdir()):
        if not path.is_file() or path.name in EXCLUDED:
            continue
        data = path.read_bytes()
        relative = path.relative_to(ROOT).as_posix()
        row = {
            "path": relative,
            "sha256": hashlib.sha256(data).hexdigest(),
            "size": len(data),
            "baseSha256": None,
        }
        manifest.append(row)
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            binaries.append(row)
            continue
        patch.append(f"diff --git a/{relative} b/{relative}\nnew file mode 100644\n")
        patch.extend(
            difflib.unified_diff(
                [],
                text.splitlines(keepends=True),
                fromfile="/dev/null",
                tofile="b/" + relative,
            )
        )
    (OUT / "manifiesto.json").write_text(
        json.dumps(
            {
                "base": "07c07e6376a72f229be735a904ecf36517a1b571",
                "files": manifest,
                "deleted": [],
                "excludedSelfReference": sorted(EXCLUDED),
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )
    (OUT / "binarios.json").write_text(json.dumps(binaries, indent=2) + "\n")
    (OUT / "entrega.patch.gz").write_bytes(
        gzip.compress("".join(patch).encode(), mtime=0)
    )
    transport = []
    for name in ["manifiesto.json", "binarios.json", "entrega.patch.gz"]:
        data = (OUT / name).read_bytes()
        transport.append(
            {
                "path": str((OUT / name).relative_to(ROOT)),
                "sha256": hashlib.sha256(data).hexdigest(),
                "size": len(data),
            }
        )
    (OUT / "entrega.json").write_text(
        json.dumps({"transport": transport, "externalAnchorRequired": True}, indent=2)
        + "\n"
    )
    print("Paquete preparado; ancla externa requerida para entrega.json.")


if __name__ == "__main__":
    main()
