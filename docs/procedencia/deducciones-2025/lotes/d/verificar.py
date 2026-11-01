#!/usr/bin/env python3
# /// script
# requires-python = ">=3.13"
# dependencies = ["beautifulsoup4==4.15.0", "pymupdf==2.0"]
# ///
"""Verifica cobertura, integridad y reextracción; no acepta interpretaciones fiscales.

Ejecutar con uv run y --cas ROOT tantas veces como almacenes externos.
Admite ROOT/HASH y ROOT/sha256/HASH. Nunca descarga ni modifica originales.
"""
import argparse
import hashlib
import json
from pathlib import Path

from bs4 import BeautifulSoup
import pymupdf


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cas", type=Path, action="append", required=True)
    args = parser.parse_args()
    folder = Path(__file__).resolve().parent
    records = json.loads((folder / "dictamenes.json").read_text())["deducciones"]
    sources = json.loads((folder / "fuentes.json").read_text())["documentos"]
    additional = json.loads((folder / "fuentes-adicionales.json").read_text())["documentos"]
    sources += additional
    census = json.loads((folder.parents[1] / "censo.json").read_text())
    expected = {row["codigo"] for row in census["fichas"] if row["lote"] == "d"}
    codes = [row["codigo"] for row in records]
    assert len(codes) == len(set(codes)) == 63
    assert set(codes) == expected
    documents = {}
    for source in sources:
        sha = source["sha256"]
        choices = [root / sub / sha for root in args.cas for sub in ("", "sha256")]
        path = next((path for path in choices if path.is_file()), None)
        assert path is not None, f"Falta original {source['id']} ({sha})"
        data = path.read_bytes()
        assert len(data) == source["bytes"], source["id"]
        assert hashlib.sha256(data).hexdigest() == sha, source["id"]
        assert hashlib.sha512(data).hexdigest() == source["sha512"], source["id"]
        documents[source["id"]] = (
            pymupdf.open(stream=data, filetype="pdf")
            if source["mimeType"] == "application/pdf"
            else BeautifulSoup(data, "html.parser")
        )
    total = 0
    for source in additional:
        locator = source["cita"]
        node = documents[source["id"]].select_one(locator["selector"])
        text = node.get_text(" ", strip=True)[locator["inicio"]:locator["fin"]]
        assert text == locator["textoLiteral"], source["id"]
        total += 1
    for record in records:
        ids = {citation["id"] for citation in record["citas"]}
        assert len(ids) == len(record["citas"]), record["codigo"]
        assert set(record["manual"]["citas"]) <= ids
        assert set(record["vigencia"]["citas"]) <= ids
        for comparison in record["comparaciones"]:
            assert set(comparison["citas"]) <= ids
        for citation in record["citas"]:
            document = documents[citation["documentoId"]]
            locator = citation["localizador"]
            if locator["tipo"] == "pdf":
                page = document[locator["paginaFisica"] - 1]
                text = page.get_text(clip=pymupdf.Rect(locator["bbox"]), sort=False)
            else:
                node = document.select_one(locator["selector"])
                assert node is not None, citation["id"]
                text = node.get_text(" ", strip=True)[locator["inicio"]:locator["fin"]]
            assert text == citation["textoLiteral"], citation["id"]
            total += 1
    print(f"63 códigos; {len(sources)} documentos íntegros; {total} citas reextraídas")
    print("Resultado técnico candidato; requiere revisión fiscal independiente")


if __name__ == "__main__":
    main()
