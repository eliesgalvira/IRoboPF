#!/usr/bin/env python3
# /// script
# requires-python = ">=3.13"
# dependencies = ["beautifulsoup4==4.15.0", "pymupdf==2.0"]
# ///
"""Ensayo local opcional de citas con originales explícitos; nunca descarga."""
import argparse
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

from bs4 import BeautifulSoup
import pymupdf


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cas", type=Path, action="append", required=True)
    args = parser.parse_args()
    folder = Path(__file__).resolve().parent
    sources = json.loads((folder / "fuentes.json").read_text())["documentos"]
    citations = json.loads((folder / "citas.json").read_text())["citas"]
    documents = {}
    for source in sources:
        candidates = [root / sub / source["sha256"] for root in args.cas for sub in ("", "sha256")]
        path = next((p for p in candidates if p.is_file()), None)
        assert path is not None, source["id"]
        data = path.read_bytes()
        assert len(data) == source["bytes"], source["id"]
        assert hashlib.sha256(data).hexdigest() == source["sha256"], source["id"]
        assert hashlib.sha512(data).hexdigest() == source["sha512"], source["id"]
        documents[source["id"]] = data
    parsed = {}
    for citation in citations:
        locator = citation["localizador"]
        kind = locator["tipo"]
        identifier = citation["documentoId"]
        key = (identifier, kind)
        data = documents[identifier]
        if key not in parsed:
            if kind.startswith("pdf"):
                parsed[key] = pymupdf.open(stream=data, filetype="pdf")
            elif kind in ("xml", "xml-hijo"):
                parsed[key] = ET.fromstring(data)
            else:
                parsed[key] = BeautifulSoup(data, "html.parser")
        document = parsed[key]
        if kind == "xml-hijo":
            text = "".join(list(document.find("texto"))[locator["indice"]].itertext())
        elif kind == "xml":
            node = document.find(locator["xpath"])
            assert node is not None, citation["id"]
            text = "".join(node.itertext())
        elif kind == "pdf-pagina":
            text = document[locator["paginaFisica"] - 1].get_text(sort=False)
        elif kind == "pdf":
            text = document[locator["paginaFisica"] - 1].get_text(clip=pymupdf.Rect(locator["bbox"]), sort=False)
        elif kind == "html-p":
            text = document.select("p")[locator["indice"]].get_text(" ", strip=True)
        else:
            node = document.select_one(locator["selector"])
            assert node is not None, citation["id"]
            text = node.get_text(" ", strip=True)[locator["inicio"]:locator["fin"]]
        assert text == citation["textoLiteral"], citation["id"]
    print(f"{len(sources)} originales íntegros, {len(citations)} citas reextraídas. No implica aceptación fiscal.")


if __name__ == "__main__":
    main()
