#!/usr/bin/env python3
"""Reextrae las citas del lote A desde un CAS proporcionado explícitamente.

Requiere beautifulsoup4 y pymupdf==1.26.7. Admite CAS plano o root/sha256.
No descarga fuentes ni escribe en los almacenes.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup
import fitz


def verificar(roots):
    carpeta = Path(__file__).resolve().parent
    datos = json.loads((carpeta / "dictamenes.json").read_text())
    documentos = json.loads((carpeta / "fuentes.json").read_text())["documentos"]
    censo = json.loads((carpeta.parents[1] / "censo.json").read_text())
    esperados = {f["codigo"] for f in censo["fichas"] if f["lote"] == "a"}
    codigos = [d["codigo"] for d in datos["deducciones"]]
    assert len(codigos) == len(set(codigos)) == 49
    assert set(codigos) == esperados
    archivos = {}
    for doc in documentos:
        h = doc["sha256"]
        candidatos = [p for root in roots for p in (root / h, root / "sha256" / h)]
        p = next((p for p in candidatos if p.is_file()), None)
        assert p is not None, f"Falta objeto {h}"
        b = p.read_bytes()
        assert hashlib.sha256(b).hexdigest() == h, f"SHA256: {h}"
        assert hashlib.sha512(b).hexdigest() == doc["sha512"], f"SHA512: {h}"
        assert len(b) == doc["bytes"], f"Tamaño: {h}"
        archivos[doc["id"]] = p
    pdfs = {}
    html = {}
    total = 0
    for d in datos["deducciones"]:
        assert d["estadoRevision"] == "candidato"
        ids = {c["id"] for c in d["citas"]}
        assert len(ids) == len(d["citas"]), d["codigo"]
        for comparacion in d["comparaciones"]:
            assert set(comparacion["citas"]) <= ids
        for cita in d["citas"]:
            docid = cita["documentoId"]
            loc = cita["localizador"]
            p = archivos[docid]
            if loc["tipo"] == "pdf":
                if docid not in pdfs:
                    pdfs[docid] = fitz.open(p)
                pagina = pdfs[docid][loc["paginaFisica"] - 1]
                texto = pagina.get_text(clip=fitz.Rect(loc["bbox"]), sort=False)
            else:
                if docid not in html:
                    html[docid] = BeautifulSoup(p.read_bytes(), "html.parser")
                indice = int(re.search(r"select\(selector\)\[(\d+)\]", loc["recetaExtraccion"]).group(1))
                el = html[docid].select(loc["selector"])[indice]
                texto = el.get_text("\n", strip=True)
                inicio, fin = loc["inicio"], loc["fin"]
                texto = texto[inicio:fin]
            assert texto == cita["textoLiteral"], cita["id"]
            total += 1
    for p in pdfs.values():
        p.close()
    print(f"49 códigos; {len(documentos)} documentos íntegros; {total} citas reextraídas.")
    print("La reextracción no acredita interpretación, vigencia ni aceptación fiscal.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cas", type=Path, action="append", required=True)
    args = parser.parse_args()
    verificar(args.cas)
