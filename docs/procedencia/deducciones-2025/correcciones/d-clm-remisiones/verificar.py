#!/usr/bin/env python3
# /// script
# requires-python = ">=3.13"
# dependencies = ["beautifulsoup4==4.15.0", "pymupdf==2.0"]
# ///
"""Reextrae citas de originales explícitos; no descarga ni acepta dictámenes."""
import argparse
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

from bs4 import BeautifulSoup
import pymupdf


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--originales", type=Path, action="append", required=True)
    args = parser.parse_args()
    folder = Path(__file__).resolve().parent
    sources = json.loads((folder / "fuentes.json").read_text())["documentos"]
    citations = json.loads((folder / "citas.json").read_text())["citas"]
    documents = {}
    for source in sources:
        sha = source["sha256"]
        choices = [r / sub / sha for r in args.originales for sub in ("", "sha256")]
        path = next((p for p in choices if p.is_file()), None)
        assert path is not None, source["id"]
        data = path.read_bytes()
        assert len(data) == source["bytes"], source["id"]
        assert hashlib.sha256(data).hexdigest() == sha, source["id"]
        assert hashlib.sha512(data).hexdigest() == source["sha512"], source["id"]
        documents[source["id"]] = data
    parsed = {}
    for citation in citations:
        data = documents[citation["documentoId"]]
        loc = citation["localizador"]
        key = (citation["documentoId"], loc["tipo"])
        if key not in parsed:
            parsed[key] = (
                pymupdf.open(stream=data, filetype="pdf") if loc["tipo"] == "pdf"
                else ET.fromstring(data) if loc["tipo"] == "xml"
                else BeautifulSoup(data, "html.parser")
            )
        doc = parsed[key]
        if loc["tipo"] == "pdf":
            page = doc[loc["paginaFisica"] - 1]
            text = (page.get_text() if loc.get("textoPaginaCompleta")
                    else page.get_text(clip=pymupdf.Rect(loc["bbox"]), sort=False))
        elif loc["tipo"] == "xml":
            node = doc.find(loc["xpath"])
            assert node is not None, citation["id"]
            text = "".join(node.itertext())
        else:
            node = doc.select_one(loc["selector"])
            assert node is not None, citation["id"]
            text = node.get_text(" ", strip=True)[loc.get("inicio", 0):loc.get("fin")]
        assert text == citation["textoLiteral"], citation["id"]
    print(f"{len(sources)} documentos por ambos hashes; {len(citations)} citas reextraídas")


if __name__ == "__main__":
    main()
