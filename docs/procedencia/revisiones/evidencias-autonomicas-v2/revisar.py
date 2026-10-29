"""Revisión de bytes, celdas y ámbitos; no escribe registros ni originales."""

import gzip
import hashlib
import json
import re
import subprocess
import sys
from decimal import Decimal
from pathlib import Path

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
SCRATCH = ROOT / ".cache/eav2"
sys.path.insert(0, str(ROOT / "tools/procedencia"))
import corpus  # noqa: E402


def read(path):
    return json.loads(Path(path).read_text())


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def write(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def check_ref(ref):
    assert sha((ROOT / ref["path"]).read_bytes()) == ref["sha256"]


assert (
    subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()
    == "5799bb03826719a4dd3500a962e2d6bb5124fdca"
)
inv = {
    "manifestSha256": sha((ROOT / "docs/procedencia/inventario.json").read_bytes()),
    "artifactSha256": sha(
        (ROOT / "docs/procedencia/inventario-datos.json.gz").read_bytes()
    ),
}
assert inv == {
    "manifestSha256": "ff58be7c8b497d2b38ad7019afb85e2e621296108eeae85163ad2319c9c9d397",
    "artifactSha256": "ae25e219e75593d7a0d408e325db872faca31261ded79a2115a563536073b3d0",
}
pages = dict(
    json.loads(
        gzip.decompress(
            (ROOT / "docs/procedencia/inventario-datos.json.gz").read_bytes()
        )
    )
)
items = {
    i["id"]: i
    for name, raw in pages.items()
    if name.startswith("inventario-pagina-")
    for i in json.loads(raw)
}
for entry in read(ROOT / "docs/procedencia/inventario.json")["generationInputs"]:
    assert sha((ROOT / entry["file"]).read_bytes()) == entry["sha256"]
pdfs = {}
originals = []
for p in (ROOT / "docs/procedencia/evidencias/autonomicas/documentos").glob("*.json"):
    d = read(p)
    raw = Path(
        "/home/elies/Repos/IRoboPF/.cache/procedencia/sha256", d["sha256"]
    ).read_bytes()
    assert sha(raw) == d["sha256"] and len(raw) == d["size"]
    assert hashlib.sha512(raw).hexdigest() == d["sha512"]
    pdfs[d["sha256"]] = corpus.mupdf().open(stream=raw, filetype="pdf")
    originals.append(d)
write("originales.json", originals)
selections = []
for c in read(ROOT / "docs/procedencia/evidencias/autonomicas/citas-celdas.json"):
    page = pdfs[c["documentSha256"]][c["page"] - 1]
    text = page.get_text("text", clip=c["bbox"], flags=0, sort=False)
    header = page.get_text("text", clip=c["header"]["bbox"], flags=0, sort=False)
    assert text == c["quote"] and header == c["header"]["quote"]
    assert Decimal(text.strip().replace(".", "").replace(",", ".")) == Decimal(
        c["value"]
    )
    selections.append({**c, "reextracted": True})
write("selecciones.json", selections)
cs = []
crops = {}
for p in sorted(
    (ROOT / "docs/procedencia/evidencias/autonomicas-v2/citas").glob("*.json")
):
    c = read(p)
    corpus.validate_schema(c, "citation")
    page = pdfs[c["documentSha256"]][c["page"] - 1]
    text = page.get_text("text", clip=c["bbox"], flags=0, sort=False)
    assert text == c["quote"]
    assert corpus.geometry(page) == c["geometry"]
    assert corpus.selectors(c["page"], c["bbox"], text) == c["selectors"]
    assert corpus.renderer() == c["facsimile"]["parameters"]
    assert corpus.verify_binding(text, c["engineBinding"])
    h = c["facsimile"]["sha256"]
    if h not in crops:
        png = page.get_pixmap(
            dpi=144,
            clip=c["bbox"],
            colorspace=corpus.mupdf().csRGB,
            alpha=False,
            annots=False,
        ).tobytes("png")
        assert sha(png) == h
        assert (
            sha(
                (
                    ROOT / "docs/procedencia/evidencias/autonomicas-v2/cas/sha256" / h
                ).read_bytes()
            )
            == h
        )
        (SCRATCH / (h + ".png")).write_bytes(png)
        crops[h] = {
            "sha256": h,
            "page": c["page"],
            "documentSha256": c["documentSha256"],
            "bbox": c["bbox"],
        }
    cs.append(
        {
            "path": str(p.relative_to(ROOT)),
            "sha256": sha(p.read_bytes()),
            "citation": c,
            "reextracted": True,
        }
    )
assert len(cs) == 94 and len(crops) == 9 and len(selections) == 94
write("citas.json", cs)
write("recortes.json", list(crops.values()))
old = read(
    ROOT / "docs/procedencia/evidencias/autonomicas-v2/localizadores-estructurales.json"
)
prior = {
    r["id"]: r
    for r in read(
        ROOT
        / "docs/procedencia/revisiones/evidencias-autonomicas-v1/localizadores-refinados.json"
    )
}
for row in old:
    exact = prior[row["id"]]["localizadoresExactos"]
    assert len(exact) == 1 and exact[0]["id"] == row["itemId"]
    source = subprocess.check_output(
        [
            "git",
            "show",
            "ed6a43fd750de05609abc3710dabdc2f8261020c:" + row["source"]["file"],
        ]
    )
    assert sha(source) == row["source"]["sha256"]
    fragment = (
        source.decode()
        .encode("utf-16-le")[row["source"]["start"] * 2 : row["source"]["end"] * 2]
        .decode("utf-16-le")
    )
    assert fragment == row["literal"]
assert len(old) == 186 and sum(r["originalCount"] == 2 for r in old) == 28
write("localizadores-comprobados.json", old)
previous = []
for m in read(ROOT / "docs/procedencia/evidencias/autonomicas/matriz-revisiones.json"):
    check_ref(m["review"])
    d = next(d for d in read(ROOT / m["review"]["path"]) if d["id"] == m["id"])
    assert m["priorDecision"] == d.get("decision", d.get("status"))
    assert m["scope"] == d.get("acceptanceScope")
    previous.append(
        {
            "id": m["id"],
            "reference": m["review"],
            "status": m["priorDecision"],
            "scope": m["scope"],
            "promoted": False,
        }
    )
assert len(previous) == 317
write("decisiones-previas.json", previous)
rows = []
for path in sorted(
    (ROOT / "docs/procedencia/evidencias/propuestas-r12/autonomicas").glob("*.json")
):
    p = read(path)
    corpus.validate_schema(p, "binding-payload")
    assert p["inventory"] == inv
    i = items[p["itemId"]]
    s = p["source"]
    assert (
        i["layer"] == "effective"
        and i["source"]["file"] == s["file"]
        and i["source"]["sha256"] == s["sha256"]
    )
    assert i["symbol"] == s["symbol"] and json.loads(i["path"]) == s["tablePath"]
    text = (ROOT / s["file"]).read_text()
    assert sha(text.encode()) == s["sha256"]
    assert (
        p["scope"]["year"] in i["years"] and p["scope"]["territory"] in i["territories"]
    )
    check_ref(p["citation"])
    check_ref(p["document"])
    check_ref(p["legalReview"]["decisions"])
    c = read(ROOT / p["citation"]["path"])
    assert Decimal(c["engineBinding"]["value"]) == Decimal(i["value"])
    row, col = s["tablePath"]
    if s["symbol"] == "MURCIA_2022" and row == "4":
        assert c["table"] is None
        assert "superior a 60.000,00 euros" in c["quote"]
        assert (
            c["documentSha256"]
            == "962a88eff2128d036bf8745c31faadb050c45abc0e93e712c3b3d50c72906bf4"
        )
    else:
        assert c["table"] == {"row": str(int(row) + 1), "column": col}
    start = text.index("export const " + s["symbol"])
    end = text.find("\nexport const ", start + 1)
    block = text[start:end]
    tuples = list(re.finditer(r'\["([0-9.]+)", "([0-9.]+)", "([0-9.]+)"\]', block))
    if int(row) < len(tuples):
        match = tuples[int(row)]
        field = 1 if col == "baseInferior" else 2
        assert Decimal(match.group(field)) == Decimal(i["value"])
        offset = start + match.start(field)
    else:
        property_match = re.search(col + r": new Decimal\(([^)]+)\)", block)
        assert property_match is not None and Decimal(
            property_match[1].strip('"')
        ) == Decimal(i["value"])
        offset = start + property_match.start()
    line = text[:offset].count("\n") + 1
    rows.append(
        {
            "id": p["id"],
            "payloadSha256": sha(path.read_bytes()),
            "itemId": p["itemId"],
            "year": p["scope"]["year"],
            "territory": p["scope"]["territory"],
            "row": int(row) + 1,
            "column": col,
            "value": i["value"],
            "engineLocation": {
                "path": s["file"],
                "symbol": s["symbol"] + "[" + row + "]." + col,
                "sha256": s["sha256"],
                "line": line,
            },
            "citation": p["citation"],
            "source": s,
            "dimensionsVerified": True,
            "completeRuleAcceptance": False,
        }
    )
assert len(rows) == 186
write("mapeo-tecnico.json", rows)
print(
    "PASS: 186 identidades actuales; 94 citas y selecciones; 9 PNG; 28 ceros; 317 decisiones preservadas.",
    flush=True,
)
