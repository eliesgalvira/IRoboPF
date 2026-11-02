"""Contraste opcional de originales externos; no forma parte de las pruebas ordinarias."""
import argparse
import hashlib
import json
from pathlib import Path
import re

import pymupdf
from bs4 import BeautifulSoup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cas", action="append", required=True, type=Path)
    args = parser.parse_args()
    registros = json.loads(Path(__file__).with_name("evidencias.json").read_text())["citas"]
    objetos = {}
    for cita in registros:
        digest = cita["sha256"]
        if digest not in objetos:
            path = next((root / digest for root in args.cas if (root / digest).is_file()), None)
            assert path is not None, digest
            data = path.read_bytes()
            assert hashlib.sha256(data).hexdigest() == digest
            assert hashlib.sha512(data).hexdigest() == cita["sha512"]
            assert len(data) == cita["bytes"]
            objetos[digest] = data
        data = objetos[digest]
        loc = cita["localizador"]
        if loc["tipo"] == "pdf":
            with pymupdf.open(stream=data, filetype="pdf") as pdf:
                page = pdf[loc["paginaFisica"] - 1]
                if cita["id"].startswith("cinco-"):
                    blocks = [b[4] for b in page.get_text("blocks") if all(abs(b[i] - loc["bbox"][i]) < 0.001 for i in range(4))]
                    assert len(blocks) == 1, cita["id"]
                    text = blocks[0]
                else:
                    text = page.get_text(clip=pymupdf.Rect(loc["bbox"]), sort=False)
        else:
            soup = BeautifulSoup(data, "html.parser")
            indice = re.search(r"select\(selector\)\[(\d+)\]", loc.get("recetaExtraccion", ""))
            if "indice" in loc:
                element = soup.select(loc["selector"])[loc["indice"]]
            elif indice:
                element = soup.select(loc["selector"])[int(indice.group(1))]
            else:
                element = soup.select_one(loc["selector"])
            assert element is not None, cita["id"]
            text = element.get_text("\n" if indice else " ", strip=True)
            text = text[loc.get("inicio", 0):loc.get("fin", len(text))]
        assert text.strip() == cita["textoLiteral"].strip(), cita["id"]
    print(f"{len(registros)} citas reextraídas; {len(objetos)} originales íntegros; sin aceptación fiscal")


if __name__ == "__main__":
    main()
