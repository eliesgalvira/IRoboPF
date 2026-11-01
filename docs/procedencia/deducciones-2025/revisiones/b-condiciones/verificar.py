"""Suite documental opcional. Requiere originales externos por hash, nunca los descarga.

Dependencias: pymupdf==1.26.7, beautifulsoup4. Los tests ordinarios usan solo Git.
"""
import argparse
import hashlib
import json
from pathlib import Path

import fitz
from bs4 import BeautifulSoup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cas-plano", action="append", type=Path, required=True)
    args = parser.parse_args()
    folder = Path(__file__).resolve().parent
    base = folder.parents[1]
    sources = json.loads((base / "lotes/b/fuentes.json").read_text())["documentos"]
    sources += json.loads((folder / "fuentes-complementarias.json").read_text())["documentos"]
    documents = {s["id"]: s for s in sources}
    citations = json.loads((folder / "citas-complementarias.json").read_text())["citas"]
    for citation in citations:
        source = documents[citation["documentoId"]]
        path = next(
            root / source["sha256"] for root in args.cas_plano
            if (root / source["sha256"]).is_file()
        )
        data = path.read_bytes()
        assert len(data) == source["bytes"]
        assert hashlib.sha256(data).hexdigest() == source["sha256"] == citation["sha256"]
        assert hashlib.sha512(data).hexdigest() == source["sha512"]
        local = citation["localizador"]
        if local["tipo"] == "html":
            element = BeautifulSoup(data, "html.parser").select_one(local["selector"])
            assert element is not None
            text = element.get_text(" ", strip=True)[local["inicio"]:local["fin"]]
        else:
            document = fitz.open(path)
            blocks = document[local["paginaFisica"] - 1].get_text("blocks")
            matches = [b[4] for b in blocks if all(
                abs(b[i] - local["bbox"][i]) < 0.001 for i in range(4)
            )]
            assert len(matches) == 1
            text = matches[0]
        assert text == citation["textoLiteral"], citation["id"]
    decisions = json.loads((folder / "decisiones.json").read_text())["deducciones"]
    lot = json.loads((base / "lotes/b/dictamenes.json").read_text())["deducciones"]
    records = {r["codigo"]: r for r in lot}
    assert len(decisions) == len({r["codigo"] for r in decisions}) == 48
    assert {r["codigo"] for r in decisions} == set(records)
    for decision in decisions:
        originals = {c["id"]: c for c in records[decision["codigo"]]["citas"]}
        for reference in decision["citasExactas"]:
            original = originals[reference["id"]]
            assert reference["localizador"] == original["localizador"]
            assert reference["articulo"] == original["articulo"]
            assert reference["sha256"] == documents[original["documentoId"]]["sha256"]
    print(json.dumps({"decisiones": 48, "citasComplementarias": len(citations),
                      "resultado": "integridad_y_literalidad_comprobadas; sin_aceptacion"}))


if __name__ == "__main__":
    main()
