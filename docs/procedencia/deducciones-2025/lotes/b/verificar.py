#!/usr/bin/env python3
"""Verifica cobertura, integridad y literalidad; no acepta interpretación fiscal.

Dependencias de extracción: pymupdf==1.26.7 y beautifulsoup4.
Los roots CAS se pasan explícitamente; nunca se descargan fuentes.
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
    repo = folder.parents[4]
    lote = json.loads((folder / "dictamenes.json").read_text())
    fuentes = json.loads((folder / "fuentes.json").read_text())["documentos"]
    censo = json.loads((repo / "docs/procedencia/deducciones-2025/censo.json").read_text())
    esperado = {f["codigo"] for f in censo["fichas"] if f["lote"] == "b"}
    codigos = [r["codigo"] for r in lote["deducciones"]]
    assert len(codigos) == len(set(codigos)) == 48
    assert set(codigos) == esperado
    paths = {}
    html = {}
    pdf = {}
    for fuente in fuentes:
        h = fuente["sha256"]
        matches = [root / h for root in args.cas_plano if (root / h).is_file()]
        assert matches, "Original ausente: " + h
        path = matches[0]
        data = path.read_bytes()
        assert len(data) == fuente["bytes"]
        assert hashlib.sha256(data).hexdigest() == h
        assert hashlib.sha512(data).hexdigest() == fuente["sha512"]
        paths[fuente["id"]] = path
        if fuente["mimeType"] == "text/html":
            html[fuente["id"]] = BeautifulSoup(data, "html.parser")
        else:
            pdf[fuente["id"]] = fitz.open(path)
    indices = json.loads(
        (repo / "docs/procedencia/deducciones-2025/correcciones/b-condiciones/cadenas.json").read_text()
    )["indices"]
    for indice in indices:
        matches = [root / indice["sha256"] for root in args.cas_plano
                   if (root / indice["sha256"]).is_file()]
        assert matches, "Índice ausente: " + indice["sha256"]
        data = matches[0].read_bytes()
        assert len(data) == indice["bytes"]
        assert hashlib.sha256(data).hexdigest() == indice["sha256"]
        assert hashlib.sha512(data).hexdigest() == indice["sha512"]
    count = 0
    for registro in lote["deducciones"]:
        ids = {c["id"] for c in registro["citas"]}
        assert registro["estadoRevision"] == "candidato"
        assert set(registro["manual"]["citas"]) <= ids
        for comparacion in registro["comparaciones"]:
            assert set(comparacion["citas"]) <= ids
        for cita in registro["citas"]:
            local = cita["localizador"]
            doc = cita["documentoId"]
            assert doc in paths
            if local["tipo"] == "html":
                elemento = html[doc].select_one(local["selector"])
                assert elemento is not None
                texto = elemento.get_text(" ", strip=True)
                extraido = texto[local["inicio"] : local["fin"]]
            else:
                pagina = pdf[doc][local["paginaFisica"] - 1]
                # Caja de bloque de PyMuPDF, no texto de OCR ni búsqueda web.
                bloques = pagina.get_text("blocks")
                candidatos = [
                    bloque[4]
                    for bloque in bloques
                    if all(abs(bloque[i] - local["bbox"][i]) < 0.001 for i in range(4))
                ]
                assert len(candidatos) == 1, cita["id"]
                extraido = candidatos[0]
            assert extraido == cita["textoLiteral"], cita["id"]
            count += 1
    print(json.dumps({"registros": 48, "documentos": len(fuentes), "citasReextraidas": count, "indicesComprobados": len(indices),
                      "integridad": "comprobada", "estado": "candidato"}))


if __name__ == "__main__":
    main()
