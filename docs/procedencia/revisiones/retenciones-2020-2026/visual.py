import pymupdf as f
import json
import hashlib
from pathlib import Path

p = Path("docs/procedencia/revisiones/retenciones-2020-2026")
docs = json.loads(
    Path(
        "docs/procedencia/auditorias/retenciones-2020-2026/documentos.json"
    ).read_text()
)
manifest = []
for prefix, pages in [
    ("645d06d2dc5a", [27, 28, 30]),
    ("a15b7fee871d", [4, 29, 30]),
    ("b1a120d93bf5", [4, 8]),
    ("14b45b26fc65", [3, 4]),
    ("0236d8d10472", [24, 25]),
]:
    d = next(x for x in docs if x["sha256"].startswith(prefix))
    doc = f.open(d["localPath"])
    for n in pages:
        dest = p / f"visual-{prefix}-{n}.png"
        doc[n - 1].get_pixmap(dpi=90).save(dest)
        manifest.append(
            {
                "file": dest.name,
                "sha256": hashlib.sha256(dest.read_bytes()).hexdigest(),
                "documentHash": d["sha256"],
                "page": n,
                "dpi": 90,
                "renderer": f.VersionBind,
            }
        )
(p / "visuales.json").write_text(json.dumps(manifest, indent=2))
