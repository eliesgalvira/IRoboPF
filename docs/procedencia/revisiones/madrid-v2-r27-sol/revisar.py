"""Contraste fijo de R25; no es consumidor ni otorga confianza."""

import gzip
import hashlib
import json
from pathlib import Path
import shutil
import sys

import pymupdf

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
CAND = ROOT / "docs/procedencia/implementaciones/madrid-v2-r25-sol"
SCRATCH = ROOT / ".cache/madrid-r27"
CAS = SCRATCH / "cas"
sys.path.insert(0, str(ROOT / "tools/procedencia"))
from corpus import validate_schema  # noqa: E402
from enlaces import DocumentaryReadSet, evaluate_scope, verify_executable_scope  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def load(path):
    return json.loads(path.read_bytes())


def save(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main():
    CAS.mkdir(parents=True, exist_ok=True)
    checks = []
    # Manifiesto recibido: examina todos sus archivos, no solo el payload.
    manifest = load(CAND / "manifiesto.json")
    for entry in manifest["files"]:
        raw = (ROOT / entry["path"]).read_bytes()
        assert sha(raw) == entry["sha256"] and len(raw) == entry["size"], entry["path"]
        assert hashlib.sha512(raw).hexdigest() == entry["sha512"]
        checks.append({"path": entry["path"], "sha256": sha(raw), "size": len(raw)})
    save("manifiesto-candidato-verificado.json", checks)
    payload = load(CAND / "payload-v2.json")
    scope = load(CAND / "ambito.json")
    assert (
        sha((CAND / "payload-v2.json").read_bytes())
        == "c8722b5f4aed938ae4ba73e60a3e69716900d46a89289299dbeea0428681fde6"
    )
    assert (
        sha((CAND / "ambito.json").read_bytes())
        == "48a10afb7bf6a5dd82332573e4a9c6af30904f5ea9005a0e034b97c8dad72e5d"
    )
    validate_schema(payload, "binding-payload")
    validate_schema(scope, "executable-cell-scope")
    dependencies: list[dict] = []
    visited: set[str] = set()

    def walk(value):
        if isinstance(value, dict):
            if isinstance(value.get("path"), str) and isinstance(
                value.get("sha256"), str
            ):
                name = value["path"]
                if name not in visited:
                    visited.add(name)
                    raw = (ROOT / name).read_bytes()
                    assert sha(raw) == value["sha256"], name
                    dependencies.append(
                        {"path": name, "sha256": sha(raw), "size": len(raw)}
                    )
                    if name.endswith(".json"):
                        walk(json.loads(raw))
            else:
                for child in value.values():
                    walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(payload)
    # Todas las referencias exactas se comprueban; la prosa histórica se lee aparte.
    walk(load(CAND / "dependencias.json"))
    for key, name in [
        ("manifestSha256", "inventario.json"),
        ("artifactSha256", "inventario-datos.json.gz"),
    ]:
        raw = (ROOT / "docs/procedencia" / name).read_bytes()
        assert sha(raw) == payload["inventory"][key]
    items: list[dict] = []
    for name, data in json.loads(
        gzip.decompress(
            (ROOT / "docs/procedencia/inventario-datos.json.gz").read_bytes()
        )
    ):
        if name.startswith("inventario-pagina-"):
            items.extend(i for i in json.loads(data) if i["id"] == payload["itemId"])
    assert len(items) == 1
    item = items[0]
    assert item["value"] == "53407.2" and item["symbol"] == payload["source"]["symbol"]
    assert (
        json.loads(item["path"])
        == ["madrid", "tramos", "3", "0"]
        == payload["source"]["tablePath"]
    )
    assert item["source"]["file"] == payload["source"]["file"]
    assert item["source"]["sha256"] == payload["source"]["sha256"]
    assert (
        item["layer"] == "effective"
        and 2020 in item["years"]
        and "madrid" in item["territories"]
    )
    assert (
        sha((ROOT / payload["source"]["file"]).read_bytes())
        == payload["source"]["sha256"]
    )
    save("dependencias-verificadas.json", {"references": dependencies, "item": item})
    temporal = load(CAND / "evidencias-temporales.json")
    evidence = []
    for entry in temporal["documents"]:
        meta = entry["document"]
        source = (
            Path("/home/elies/Repos/IRoboPF/.cache/procedencia/sha256") / meta["sha256"]
        )
        raw = source.read_bytes()
        assert sha(raw) == meta["sha256"] and len(raw) == meta["size"]
        assert hashlib.sha512(raw).hexdigest() == meta["sha512"]
        target = CAS / meta["sha256"]
        if target.exists():
            assert target.read_bytes() == raw
        else:
            shutil.copyfile(source, target)
        with pymupdf.open(stream=raw) as document:
            for citation in entry["citations"]:
                page = document[citation["page"] - 1]
                rect = pymupdf.Rect(citation["bbox"])
                quote = page.get_text("text", clip=rect, flags=0, sort=False)
                assert (
                    quote == citation["quote"]
                    and sha(quote.encode()) == citation["quoteSha256"]
                )
                png = page.get_pixmap(
                    dpi=110,
                    clip=rect,
                    colorspace=pymupdf.csRGB,
                    alpha=False,
                    annots=False,
                ).tobytes("png")
                assert sha(png) == citation["facsimile"]["sha256"]
                assert png == (ROOT / citation["facsimile"]["path"]).read_bytes()
                name = Path(citation["facsimile"]["path"]).name
                (OUT / name).write_bytes(png)
                evidence.append(
                    {
                        "documentSha256": meta["sha256"],
                        "page": citation["page"],
                        "bbox": citation["bbox"],
                        "quote": quote,
                        "render": name,
                        "sha256": sha(png),
                    }
                )
            if meta["sha256"].startswith("8a77"):
                cite = load(ROOT / payload["citation"]["path"])
                page = document[cite["page"] - 1]
                assert (
                    page.get_text(
                        "text", clip=pymupdf.Rect(cite["bbox"]), flags=0, sort=False
                    )
                    == cite["quote"]
                )
                png = page.get_pixmap(
                    dpi=144,
                    clip=pymupdf.Rect(cite["bbox"]),
                    colorspace=pymupdf.csRGB,
                    alpha=False,
                    annots=False,
                ).tobytes("png")
                assert sha(png) == cite["facsimile"]["sha256"]
                (OUT / "tabla.png").write_bytes(png)
                for key in ["number", "unit"]:
                    binding = cite["engineBinding"][key]
                    assert (
                        cite["quote"][binding["start"] : binding["end"]]
                        == binding["literal"]
                    )
    save(
        "evidencia-reproducida.json",
        {
            "recipes": evidence,
            "documents": [e["document"] for e in temporal["documents"]],
            "pymupdf": pymupdf.VersionBind,
            "mupdf": pymupdf.VersionFitz,
            "casRelative": ".cache/madrid-r27/cas",
        },
    )
    reader = DocumentaryReadSet(ROOT)
    try:
        verify_executable_scope(reader, payload, item)
    except ValueError as error:
        assert str(error) == "Condiciones editoriales omitidas o alteradas"
        gate = str(error)
    else:
        raise AssertionError("Admisión inesperada del candidato bloqueado")
    decisions = load(ROOT / payload["legalReview"]["decisions"]["path"])
    decision = next(
        d for d in decisions if d["id"] == payload["legalReview"]["decisionId"]
    )
    save("decision-historica-observada.json", decision)
    ctx = {
        "year": 2020,
        "territory": "madrid",
        "component": "autonomico",
        "taxBase": "general",
        "periodStart": "2020-01-01",
        "accrual": "2020-12-31",
        "death": None,
        "externalConditions": ["residence-unverified", "eligibility-unverified"],
    }
    variants: list[tuple[str, dict]] = [
        ("ordinario", {}),
        ("anterior", {"year": 2019}),
        ("posterior", {"year": 2021}),
        ("falsa-identidad-2022", {"year": 2022}),
        ("territorio", {"territory": "murcia"}),
        ("estatal", {"component": "estatal"}),
        ("ahorro", {"taxBase": "ahorro"}),
        ("antes-cierre", {"accrual": "2020-12-30"}),
        ("despues-cierre", {"accrual": "2021-01-01"}),
        ("fallecido", {"death": "2020-06-15", "accrual": "2020-06-15"}),
        ("residencia-no-probada", {"externalConditions": []}),
    ]
    cases = []
    for label, changes in variants:
        context = dict(ctx, **changes)
        try:
            evaluate_scope(scope, context)
        except ValueError as error:
            cases.append(
                {
                    "id": label,
                    "context": context,
                    "result": "rejected",
                    "diagnostic": str(error),
                    "applicability": "not-established",
                    "completeRuleAcceptance": False,
                }
            )
        else:
            raise AssertionError(label)
    save(
        "casos.json",
        {
            "schema": "valid",
            "gate": gate,
            "cases": cases,
            "readSet": reader.finish(),
            "attestation": None,
            "completeRuleAcceptance": False,
        },
    )
    print(
        "Manifiesto y dependencias cotejados; originales, citas y renders reproducidos; rechazo exacto y 11 contextos conservados. Sin atestación."
    )


if __name__ == "__main__":
    main()
