"""Recuperación exclusiva de restauración; ninguna consulta CAS alternativa."""

import gzip
import hashlib
import json
import argparse
from pathlib import Path
import pymupdf as fitz
import consumidor as c


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", type=Path, default=c.CACHE)
    parser.add_argument("--output", type=Path, default=c.HERE / "recuperacion.json")
    args = parser.parse_args()
    cache = args.cache
    package = cache / "restauracion-v5"
    pin = json.loads((cache / "PIN-final.json").read_bytes())["manifest"]["sha256"]
    m = c.load(pin, cache / "manifest-final.json")
    c.verify(package, pin, cache / "manifest-final.json")
    deps = {d["path"]: d for d in m["dependencies"]}

    def data(name):
        row = deps[name]
        path = package / "dependencies" / row["sha256"]
        c.p.check(path, row)
        raw = path.read_bytes()
        return c.p.strict_json(gzip.decompress(raw) if name.endswith(".gz") else raw)

    def blob(sha):
        path = package / "sha256" / sha
        if not path.exists():
            path = package / "dependencies" / sha
        assert path.is_file()
        return path

    results = {
        "renderer": fitz.VersionBind,
        "noCacheFallback": True,
        "citations": [],
        "missingRecovered": [],
    }
    for name in ("mei2025", "madrid-tabla-ley13-2023", "colegio-art10-p16"):
        row = data(
            "docs/procedencia/correcciones/editorial-r21/citas/" + name + ".json"
        )
        with fitz.open(blob(row["original"]["sha256"])) as doc:
            sel, rec = row["selector"], row["receta"]
            page = doc[sel["pagina"] - 1]
            text = page.get_textbox(fitz.Rect(sel["caja"]))
            png = page.get_pixmap(
                matrix=fitz.Matrix(*rec["matrix"]),
                clip=fitz.Rect(rec["clip"]),
                alpha=rec["alpha"],
            ).tobytes("png")
        assert text == sel["texto"]
        assert hashlib.sha256(png).hexdigest() == row["facsimil"]["sha256"]
        (cache / (name + ".png")).write_bytes(png)
        results["citations"].append(
            {
                "id": name,
                "textExact": True,
                "png": row["facsimil"]["sha256"],
                "text": text,
            }
        )
    missing = data(
        "docs/procedencia/correcciones/preservacion-v4-r26/faltantes-localizados.json"
    )
    for row in missing:
        path = blob(row["sha256"])
        c.p.check(path, row)
        result = {"sha256": row["sha256"], "verified": True}
        if path.read_bytes()[:4] == b"%PDF":
            if row["sha256"].startswith("1cfe"):
                citations = data(
                    "docs/procedencia/revisiones/autonomicas-2022-2026/citas-adicionales.json"
                )
            else:
                citations = data(
                    "docs/procedencia/revisiones/deducciones-autonomicas-a/citas-refinadas.json"
                )
            candidates = [
                v for v in citations if v.get("documentSha256") == row["sha256"]
            ]
            if not candidates:
                raise ValueError("Sin cita PDF declarada")
            sel = max(candidates, key=lambda row: len(row["quote"]))
            with fitz.open(path) as doc:
                text = doc[sel["page"] - 1].get_text(
                    clip=fitz.Rect(sel.get("bbox", sel.get("box")))
                )
            result.update(selector=sel, extracted=text, exact=text == sel["quote"])
            assert result["exact"]
        else:
            value = c.p.strict_json(path.read_bytes())
            citations = data(
                "docs/procedencia/auditorias/ipc-redondeos/citas-candidatas.json"
            )
            result.update(
                existingSelectors=[
                    v for v in citations if row["sha256"] in json.dumps(v)
                ],
                rootType=type(value).__name__,
                firstRecord=value[0] if isinstance(value, list) else value,
                nextStep="selector existente; no PNG inventado",
            )
        results["missingRecovered"].append(result)
    large = deps[
        "docs/procedencia/auditorias/retenciones-2020-2026/citas-candidatas.json"
    ]
    large_data = data(large["path"])
    results["largeIndex"] = {
        "dependency": large,
        "parsedRoot": type(large_data).__name__,
    }
    historical = next(
        d
        for d in m["dependencies"]
        if d["path"] == "herencia-v4/heredado/manifest.json"
    )
    results["historical"] = {
        "dependency": historical,
        "root": list(data(historical["path"]).keys()),
    }
    results["physical"] = {"files": 0, "bytes": 0, "hardlinksBetweenCopies": 0}
    export = cache / "paquete-v5"
    for folder, rows in [("sha256", m["objects"]), ("dependencies", m["dependencies"])]:
        for row in {r["sha256"]: r for r in rows}.values():
            a = export / folder / row["sha256"]
            b = package / folder / row["sha256"]
            c.p.check(a, row)
            c.p.check(b, row)
            assert (
                a.stat().st_ino != b.stat().st_ino
                and a.stat().st_nlink == b.stat().st_nlink == 1
            )
            results["physical"]["files"] += 1
            results["physical"]["bytes"] += row["size"]
    args.output.write_bytes(c.p.encoded(results))
    print(
        "Recuperación sin fallback: cuatro originales, tres textos/PNG exactos, índice grande e histórico; sin hardlinks"
    )


if __name__ == "__main__":
    main()
