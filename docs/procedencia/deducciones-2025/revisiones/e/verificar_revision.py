"""Comprueba cobertura, complementos y tres atribuciones incorrectas conocidas.

Recibe --cas ROOT cuyo subdirectorio sha256 contiene los originales.
Requiere BeautifulSoup4 4.14.3 y PyMuPDF 1.26.7 en entorno externo.
"""
import argparse
import hashlib
import json
from pathlib import Path

from bs4 import BeautifulSoup
import pymupdf

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--cas", required=True, type=Path)
args = parser.parse_args()
carpeta = Path(__file__).resolve().parent
base = carpeta.parents[1]


def leer(path):
    return json.loads(path.read_text())


censo = {x["codigo"] for x in leer(base / "censo.json")["fichas"] if x["lote"] == "e"}
decisiones = leer(carpeta / "decisiones.json")["decisiones"]
assert len(decisiones) == 49
assert {x["codigo"] for x in decisiones} == censo
fuentes = leer(base / "lotes/e/fuentes.json")["documentos"]
fuentes += leer(carpeta / "fuentes-complementarias.json")["documentos"]
fuentes = {x["id"]: x for x in fuentes}
cache = {}
for c in leer(carpeta / "citas-complementarias.json")["citas"]:
    doc = fuentes[c["documentoId"]]
    if doc["id"] not in cache:
        contenido = (args.cas / "sha256" / doc["sha256"]).read_bytes()
        assert len(contenido) == doc["bytes"]
        for algoritmo in ("sha256", "sha512"):
            assert hashlib.new(algoritmo, contenido).hexdigest() == doc[algoritmo]
        cache[doc["id"]] = (
            pymupdf.open(stream=contenido, filetype="pdf")
            if doc["mimeType"] == "application/pdf"
            else BeautifulSoup(contenido, "html.parser")
        )
    fuente = cache[doc["id"]]
    loc = c["localizador"]
    if loc["tipo"] == "html":
        texto = fuente.select(loc["selector"])[loc["indiceGlobal"]].get_text(" ", strip=True)
        texto = texto[loc["inicio"]:loc["fin"]]
    else:
        bloques = fuente[loc["paginaFisica"] - 1].get_text("blocks")
        candidatos = [b for b in bloques if all(abs(a - v) < 0.001 for a, v in zip(b[:4], loc["bbox"]))]
        assert len(candidatos) == 1
        texto = candidatos[0][4]
    assert texto == c["textoLiteral"]
limites = leer(carpeta / "limites-manual.json")
incorrectas = []
for d in leer(base / "lotes/e/dictamenes.json")["deducciones"]:
    seccion = limites["secciones"][d["codigo"]]
    for c in d["citas"]:
        if c["documentoId"] != "e-765c89ade626abf97268":
            continue
        loc = c["localizador"]
        punto = [loc["paginaFisica"], loc["bbox"][1]]
        if not seccion["inicio"] <= punto < seccion["finExclusivo"]:
            incorrectas.append(c["id"])
assert set(incorrectas) == {x["cita"] for x in limites["atribucionesIncorrectas"]}
assert len(incorrectas) == 3
print("49 decisiones; 5 complementos reextraídos; 3 atribuciones ajenas reproducidas")
