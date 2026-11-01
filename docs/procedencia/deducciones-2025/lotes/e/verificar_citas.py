#!/usr/bin/env python3
"""Reextrae citas del lote E usando un índice CAS privado, sin descargar."""
import argparse
import hashlib
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup
import pymupdf

def verificar(carpeta, indice):
    datos = json.loads((carpeta / "dictamenes.json").read_text())
    documentos = json.loads((carpeta / "fuentes.json").read_text())["documentos"]
    rutas = json.loads(indice.read_text())
    fuentes = {}
    for documento in documentos:
        contenido = Path(rutas[documento["sha256"]]).read_bytes()
        assert len(contenido) == documento["bytes"]
        for algoritmo in ("sha256", "sha512"):
            assert hashlib.new(algoritmo, contenido).hexdigest() == documento[algoritmo]
        fuentes[documento["id"]] = (
            pymupdf.open(stream=contenido, filetype="pdf")
            if documento["mimeType"] == "application/pdf"
            else BeautifulSoup(contenido, "html.parser")
        )
    total = 0
    for ficha in datos["deducciones"]:
        for cita in ficha["citas"]:
            fuente = fuentes[cita["documentoId"]]
            loc = cita["localizador"]
            if loc["tipo"] == "html":
                patron = r"BeautifulSoup\(bytes, 'html.parser'\)\.select\('p'\)\[(\d+)\]\.get_text\(' ', strip=True\); aplicar \[inicio:fin\]"
                coincidencia = re.fullmatch(patron, loc["recetaExtraccion"])
                assert coincidencia, cita["id"]
                texto = fuente.select("p")[int(coincidencia[1])].get_text(" ", strip=True)
                texto = texto[loc["inicio"]:loc["fin"]]
            else:
                bloques = fuente[loc["paginaFisica"] - 1].get_text("blocks")
                candidatos = [
                    b for b in bloques
                    if all(abs(a - v) < 0.001 for a, v in zip(b[:4], loc["bbox"]))
                ]
                assert len(candidatos) == 1, cita["id"]
                texto = candidatos[0][4]
            assert texto == cita["textoLiteral"], cita["id"]
            total += 1
    assert len(datos["deducciones"]) == 49
    assert len({f["codigo"] for f in datos["deducciones"]}) == 49
    return total

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--indice", required=True, type=Path, help="JSON privado SHA256 -> ruta del original")
    args = parser.parse_args()
    total = verificar(Path(__file__).resolve().parent, args.indice)
    print(f"49 registros; {total} citas reextraídas; hashes SHA256/SHA512 correctos")
