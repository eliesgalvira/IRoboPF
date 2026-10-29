import pathlib
import subprocess
import hashlib
import json
import gzip
import stat
import pymupdf

R = pathlib.Path.cwd()
OUTPUT = R / "docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol"
E = R / "docs/procedencia/editorial/rentas-retenciones-cotizaciones"


def load(n):
    return json.loads((E / n).read_text())


def dump(n, x):
    (OUTPUT / n).write_text(json.dumps(x, ensure_ascii=False, indent=2) + "\n")


head = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()
assert head == "7668bdad60a79a8b3ad8e1e1b911f3d6c223692a"
rows = []
for en in subprocess.check_output(["git", "ls-tree", "-rz", head]).split(b"\0"):
    if not en:
        continue
    meta, p = en.split(b"\t", 1)
    mode, kind, oid = meta.split()
    path = R / p.decode()
    info = path.lstat()
    target = str(path.readlink()) if stat.S_ISLNK(info.st_mode) else None
    data = target.encode() if target is not None else path.read_bytes()
    actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
    rows.append(
        {
            "path": p.decode(),
            "mode": mode.decode(),
            "readlink": target,
            "size": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "gitBlob": oid.decode(),
            "identico": actual == oid.decode(),
        }
    )
assert all(x["identico"] for x in rows)
(OUTPUT / "arbol-head.json.gz").write_bytes(
    gzip.compress(json.dumps(rows, ensure_ascii=False).encode(), mtime=0)
)
dump(
    "base.json",
    {
        "head": head,
        "baseAutor": "1196269d4e73742beeed35cc05011b70c21a0b69",
        "entradas": len(rows),
        "borradosFisicos": 0,
        "modificadosFisicos": 0,
        "diffBase": subprocess.check_output(
            ["git", "diff", "--stat", "1196269d4e73742beeed35cc05011b70c21a0b69", head]
        ).decode(),
        "borradosDiff": subprocess.check_output(
            [
                "git",
                "diff",
                "--name-only",
                "--diff-filter=D",
                "1196269d4e73742beeed35cc05011b70c21a0b69",
                head,
            ]
        ).decode(),
    },
)
docs = {}
pages = []
blocks = []
for c in load("citas.json"):
    s = c["original"]
    document_path = pathlib.Path(s["path"])
    data = document_path.read_bytes()
    assert hashlib.sha256(data).hexdigest() == s["sha256"]
    assert hashlib.sha512(data).hexdigest() == s["sha512"]
    assert len(data) == s["size"]
    docs[s["sha256"]] = s
    with pymupdf.open(document_path) as pdf:
        page = pdf[c["selector"]["pagina"] - 1]
        text = page.get_text()
        assert text == c["selector"]["texto"]
        b = [
            {"bbox": list(x[:4]), "texto": x[4]}
            for x in page.get_text("blocks")
            if len(x) > 4
        ]
        blocks.append(
            {
                "cita": c["id"],
                "sha256": s["sha256"],
                "sha512": s["sha512"],
                "pagina": c["selector"]["pagina"],
                "pasajes": b,
            }
        )
        png = c["facsimil"]
        ok = None
        if png:
            ok = (
                page.get_pixmap(dpi=90, alpha=False).tobytes("png")
                == pathlib.Path(png["path"]).read_bytes()
            )
            assert ok
        pages.append(
            {
                "id": c["id"],
                "original": s["sha256"],
                "textoIdentico": True,
                "pngIdentico": ok,
            }
        )
dump("fuentes-reabiertas.json", list(docs.values()))
dump("paginas-reextraidas.json", pages)
(OUTPUT / "pasajes-primarios.json.gz").write_bytes(
    gzip.compress(json.dumps(blocks, ensure_ascii=False, indent=2).encode(), mtime=0)
)
(R / ".cache/revision-editorial-sol/paginas.txt").write_text(
    "\n\n".join(
        x["cita"] + "\n" + "\n".join(b["texto"] for b in x["pasajes"]) for x in blocks
    )
)
for n in ["parametros.json", "controles-tecnicos.json"]:
    print("\n" + n)
    for x in load(n):
        o = x["ocurrencia"]
        print(
            o["id"],
            o["fuente"]["file"],
            o["fuente"]["line"],
            o["simbolo"],
            x["valor"],
            x.get("unidad", ""),
            x.get("contextoCodigo", "").replace("\n", " ")[:180],
        )
print("BASE", len(rows), "DOCS", len(docs), "PAGINAS", len(pages))
