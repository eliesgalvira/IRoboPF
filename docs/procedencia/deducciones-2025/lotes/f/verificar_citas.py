"""Reextrae literalmente las citas del lote F; solo lee CAS externos explícitos.

Dependencias de inspección: beautifulsoup4 y pymupdf. No descarga fuentes.
Uso: uv run --no-project --with beautifulsoup4 --with pymupdf python verificar_citas.py ROOT...
Cada ROOT admite objetos planos o sha256/HASH. Los índices públicos no contienen rutas.
"""
import argparse
import hashlib
import json
from pathlib import Path

from bs4 import BeautifulSoup
import pymupdf


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("roots", nargs="+", type=Path)
    args = parser.parse_args()
    here = Path(__file__).resolve().parent
    sources = json.loads((here / "fuentes.json").read_text())["documentos"]
    rows = json.loads((here / "dictamenes.json").read_text())["deducciones"]
    documents = {}
    for source in sources:
        candidates = [candidate for root in args.roots for candidate in
                      (root / source["sha256"], root / "sha256" / source["sha256"])
                      if candidate.is_file()]
        if not candidates:
            raise ValueError("Original ausente: " + source["id"])
        data = candidates[0].read_bytes()
        assert len(data) == source["bytes"], source["id"]
        assert hashlib.sha256(data).hexdigest() == source["sha256"], source["id"]
        assert hashlib.sha512(data).hexdigest() == source["sha512"], source["id"]
        documents[source["id"]] = (pymupdf.open(stream=data, filetype="pdf")
                                    if source["mimeType"] == "application/pdf"
                                    else BeautifulSoup(data, "html.parser"))
    count = 0
    for row in rows:
        for citation in row["citas"]:
            document = documents[citation["documentoId"]]
            locator = citation["localizador"]
            if locator["tipo"] == "pdf":
                observed = document[locator["paginaFisica"] - 1].get_text(
                    clip=pymupdf.Rect(locator["bbox"])).strip()
            else:
                element = document.select_one(locator["selector"])
                assert element is not None, citation["id"]
                observed = element.get_text(" ", strip=True)[locator["inicio"]:locator["fin"]]
            assert observed == citation["textoLiteral"], citation["id"]
            count += 1
    assert len(rows) == len({row["codigo"] for row in rows}) == 51
    print(f"51 registros; {count} citas reextraídas; {len(sources)} fuentes íntegras")


if __name__ == "__main__":
    main()
