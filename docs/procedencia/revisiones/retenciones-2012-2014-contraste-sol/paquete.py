"""Metadatos de revisión y transporte por archivos, sin mutar VCS."""

import difflib
import gzip
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess

out = Path(__file__).parent
src = out.parent / "retenciones-2012-2014-sol"


def load(p):
    return json.loads(p.read_text())


def write(name, data):
    (out / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


paths = {r["sha256"]: r["path"] for r in load(out / "fuentes.json")}
h = []
for c in load(src / "citas-html.json"):
    parser = Text()
    parser.feed(Path(paths[c["documentSha256"]]).read_text())
    normalized = " ".join(" ".join(parser.parts).split())
    quote = " ".join(c["text"].split())
    h.append(
        {
            "id": c["id"],
            "normalizedContains": quote in normalized,
            "normalization": "HTMLParser.handle_data, unir espacios; sin reescribir palabras",
            "quoteSha256": hashlib.sha256(c["text"].encode()).hexdigest(),
        }
    )
write("cotejo-html.json", h)
seen = {
    "2012-enero": [6, 10, 16, 19, 20, 23, 26, 27, 28, 29, 35],
    "2012-febrero": [2, 4, 6, 10, 16, 19, 20, 26, 28, 29, 34, 35],
    "2013-anual": [4, 6, 7, 8, 10, 16, 19, 20, 26, 28, 29, 34, 35],
    "2014-anual": [6, 10, 16, 19, 20, 23, 26, 27, 28, 29, 34, 35],
}
visual = []
for c in load(src / "citas-paginas.json"):
    version = c["id"].split(":")[0]
    visual.append(
        {
            "id": c["id"],
            "documentSha256": c["documentSha256"],
            "page": c["page"],
            "facsimile": str(src / c["facsimile"]),
            "sha256": c["facsimileSha256"],
            "visualPersonal": c["page"] in seen[version],
            "modo": "facsimil individual abierto con view_image"
            if c["page"] in seen[version]
            else "reextracción/cotejo; no inspección visual personal",
        }
    )
write("inspeccion-visual.json", visual)
primary_ids = {
    "0f6003cfa63f:p41",
    "bc36ac7820d4:p4",
    "89eaeb5898f7:p54",
    "0f6003cfa63f:p39",
    "0abb5d0eda31:p3",
    "8357df623a45:p19",
    "f10ae435f91b:p2",
    "06dd554f71e1:p2",
    "df00632182a9:p58",
}
write(
    "inspeccion-primarios.json",
    [
        {
            "id": c["id"],
            "documentSha256": c["documentSha256"],
            "facsimile": str(src / c["facsimile"]),
            "visualPersonal": True,
        }
        for c in load(src / "citas-boe.json")
        if c["id"] in primary_ids
    ],
)
write(
    "hallazgos.json",
    [
        {
            "id": "C01",
            "status": "refutado-parcial-SOL03",
            "claim": "<64 en cuatro PDF y >25 en enero",
            "observed": "≤64 en cuatro;≥25 también enero",
            "evidence": [v["id"] for v in visual if v["page"] in [10, 16]],
            "review": "pendiente de contraste posterior",
            "completeRuleAcceptance": False,
        },
        {
            "id": "C02",
            "status": "confirmado-candidato-nuevo",
            "claim": "Contrato87.5 incompleto para nueva obligación judicial85.2",
            "evidence": ["bc36ac7820d4:p4", "bc36ac7820d4:p5", "0f6003cfa63f:p41"],
            "review": "pendiente de contraste posterior",
            "completeRuleAcceptance": False,
        },
    ],
)
# Este archivo se ejecuta después de controles. No acepta su propio resultado fiscal.
summary = {
    "head": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
    "base": "960773f909d4ecff290edfa3d7a7b2699a8445d3",
    "completeRuleAcceptance": False,
    "celdas": len(load(out / "decisiones-80.json")),
    "ramas": len(load(out / "decisiones-44.json")),
    "asercionesAutor": load(out / "repeticion.json"),
    "html": h,
    "citasClipDiferentes": [
        c for c in load(out / "cotejo-citas-con-caja.json") if not c["textEqual"]
    ],
    "bandasSinMetodoReproducible": [
        r["id"] for r in load(out / "diagnostico-bandas.json") if not r["matches"]
    ],
    "extractorTablas": "Page.get_textbox(bbox), espacios y salto final exactos",
    "visualPersonalPaginas": sum(v["visualPersonal"] for v in visual),
    "fuentesNuevas": 0,
    "deleted": [],
}
write("cierre.json", summary)
files = []
binary = []
patch: list[str] = []
for p in sorted(out.rglob("*")):
    if not p.is_file() or p.name in [
        "manifiesto.json",
        "entrega.patch.gz",
        "binarios.json",
    ]:
        continue
    b = p.read_bytes()
    r = {
        "path": str(p.relative_to(Path.cwd())),
        "sha256": hashlib.sha256(b).hexdigest(),
        "size": len(b),
        "baseSha256": None,
    }
    files.append(r)
    try:
        t = b.decode("utf-8")
    except UnicodeDecodeError:
        binary.append(r)
        continue
    patch.extend(
        difflib.unified_diff(
            [], t.splitlines(keepends=True), fromfile="/dev/null", tofile="b/" + str(p.relative_to(Path.cwd()))
        )
    )
write("binarios.json", binary)
b = (out / "binarios.json").read_bytes()
files.append(
    {
        "path": str((out / "binarios.json").relative_to(Path.cwd())),
        "sha256": hashlib.sha256(b).hexdigest(),
        "size": len(b),
        "baseSha256": None,
    }
)
patch.extend(
    difflib.unified_diff(
        [],
        b.decode().splitlines(keepends=True),
        fromfile="/dev/null",
        tofile="b/" + str((out / "binarios.json").relative_to(Path.cwd())),
    )
)
with gzip.open(out / "entrega.patch.gz", "wt") as f:
    f.write("".join(patch))
b = (out / "entrega.patch.gz").read_bytes()
files.append(
    {
        "path": str((out / "entrega.patch.gz").relative_to(Path.cwd())),
        "sha256": hashlib.sha256(b).hexdigest(),
        "size": len(b),
        "baseSha256": None,
    }
)
write(
    "manifiesto.json",
    {
        "base": summary["base"],
        "head": summary["head"],
        "files": files,
        "deleted": [],
        "manifestSelfExcluded": True,
        "completeRuleAcceptance": False,
    },
)
print(
    json.dumps(
        {k: v for k, v in summary.items() if k not in ["asercionesAutor"]},
        ensure_ascii=False,
    )
)
print("manifest", hashlib.sha256((out / "manifiesto.json").read_bytes()).hexdigest())
