"""Entrega sin commit; el manifiesto no se incluye a sí mismo."""

import difflib
import gzip
import hashlib
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = Path.cwd()


def main() -> None:
    # Solo artefactos propios; cada forma comprimida conserva exactamente los bytes.
    for p in sorted(OUT.iterdir()):
        if (
            p.is_file()
            and p.stat().st_size > 1_000_000
            and p.suffix in [".json", ".log"]
        ):
            compressed = p.with_suffix(p.suffix + ".gz")
            with gzip.open(compressed, "wb") as stream:
                stream.write(p.read_bytes())
            assert gzip.decompress(compressed.read_bytes()) == p.read_bytes()
            p.resolve().unlink()
    exclusions = {"entrega.patch.gz", "manifiesto.json", "binarios.json"}
    files = [
        p for p in sorted(OUT.iterdir()) if p.is_file() and p.name not in exclusions
    ]
    binaries = []
    texts = []
    for p in files:
        if p.suffix == ".gz":
            binaries.append(
                {
                    "path": str(p.relative_to(ROOT)),
                    "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
                    "size": p.stat().st_size,
                }
            )
        else:
            texts.append(p)
    (OUT / "binarios.json").write_text(
        json.dumps(binaries, ensure_ascii=False, indent=2) + "\n"
    )
    texts.append(OUT / "binarios.json")
    patch = []
    for p in texts:
        relative = str(p.relative_to(ROOT))
        patch.extend(
            [f"diff --git a/{relative} b/{relative}\n", "new file mode 100644\n"]
        )
        patch.extend(
            difflib.unified_diff(
                [],
                p.read_text().splitlines(keepends=True),
                fromfile="/dev/null",
                tofile="b/" + relative,
            )
        )
    with gzip.open(OUT / "entrega.patch.gz", "wb") as stream:
        stream.write("".join(patch).encode())
    manifest = []
    for p in sorted(OUT.iterdir()):
        if p.is_file() and p.name != "manifiesto.json":
            manifest.append(
                {
                    "path": str(p.relative_to(ROOT)),
                    "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
                    "size": p.stat().st_size,
                    "baseSha256": None,
                }
            )
    (OUT / "manifiesto.json").write_text(
        json.dumps(
            {
                "base": "960773f909d4ecff290edfa3d7a7b2699a8445d3",
                "head": "960773f909d4ecff290edfa3d7a7b2699a8445d3",
                "files": manifest,
                "deleted": [],
                "manifestSelfExcluded": True,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )
    print(len(manifest), "archivos; cero borrados; patch textual y binarios separados")


if __name__ == "__main__":
    main()
