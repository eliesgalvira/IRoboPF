import gzip
import hashlib
import json
import shutil
from pathlib import Path
import fitz

out = Path(__file__).parent
src = out.parent / "retenciones-2012-2014-sol"


def load(p):
    return json.loads(p.read_text())


refs = (
    load(src / "control-contexto.json")["originalesHistoricosCotejados"]
    + load(src / "primarios-comprobados.json")
    + load(
        Path(
            "docs/procedencia/correcciones/retenciones-antiguas-r20/cas-originales.json"
        )
    )["objects"]
)
paths = {}
checked = []
for r in refs:
    p = Path(r.get("localPath", r.get("path", "")))
    if not p.is_file():
        continue
    b = p.read_bytes()
    h = hashlib.sha256(b).hexdigest()
    assert h == r["sha256"]
    assert len(b) == r["size"]
    assert hashlib.sha512(b).hexdigest() == r["sha512"]
    paths[h] = str(p)
    checked.append({"sha256": h, "sha512": r["sha512"], "size": len(b), "path": str(p)})
(out / "fuentes.json").write_text(json.dumps(checked, indent=2))
versions = load(src / "versiones-4.json")
checks = []
with gzip.open(out / "textos-algoritmos.txt.gz", "wt") as f:
    for v in versions:
        d = fitz.open(paths[v["sha256"]])
        f.write("\nVERSION " + v["id"] + "\n")
        for i in range(len(d)):
            p = d[i]
            f.write(f"\nPAGINA {i + 1}\n" + p.get_text())
        for page in [10, 16]:
            p = d[page - 1]
            clip = fitz.Rect(
                45, 180 if page == 10 else 490, 570, 750 if page == 10 else 700
            )
            p.get_pixmap(matrix=fitz.Matrix(2, 2), clip=clip, alpha=False).save(
                out / f"{v['id']}-p{page}.png"
            )
        for c in load(src / "citas-paginas.json"):
            if c["documentSha256"] != v["sha256"]:
                continue
            p = d[c["page"] - 1]
            t = p.get_text()
            png = p.get_pixmap(dpi=95, alpha=False).tobytes("png")
            checks.append(
                {
                    "id": c["id"],
                    "textEqual": t == c["text"],
                    "pngEqual": hashlib.sha256(png).hexdigest() == c["facsimileSha256"],
                }
            )
(out / "cotejo-paginas.json").write_text(json.dumps(checks, indent=2))
print(
    "fuentes",
    len(paths),
    "paginas",
    len(checks),
    "texto distinto",
    sum(not c["textEqual"] for c in checks),
    "png distinto",
    sum(not c["pngEqual"] for c in checks),
)
for name in ["casos.py", "regularizacion-casos.py"]:
    shutil.copyfile(src / name, out / "scratch" / name)
