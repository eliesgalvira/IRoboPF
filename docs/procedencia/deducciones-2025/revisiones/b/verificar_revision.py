"""Reextracción acotada del complemento, no validador de interpretación jurídica.

Ejecutar con pymupdf==1.26.7 y beautifulsoup4==4.15.0; --cas-plano externo.
"""
import argparse
import hashlib
import json
from pathlib import Path

import fitz
from bs4 import BeautifulSoup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cas-plano", required=True, type=Path)
    args = parser.parse_args()
    folder = Path(__file__).resolve().parent
    lote = folder.parents[1] / "lotes" / "b"
    base = json.loads((lote / "fuentes.json").read_text())["documentos"]
    nuevas = json.loads((folder / "fuentes-complementarias.json").read_text())["documentos"]
    fuentes = {f["id"]: f for f in base + nuevas}
    for f in fuentes.values():
        b = (args.cas_plano / f["sha256"]).read_bytes()
        assert len(b) == f["bytes"]
        assert hashlib.sha256(b).hexdigest() == f["sha256"]
        assert hashlib.sha512(b).hexdigest() == f["sha512"]
    citas = json.loads((folder / "citas-complementarias.json").read_text())["citas"]
    for c in citas:
        f = fuentes[c["documentoId"]]
        b = (args.cas_plano / f["sha256"]).read_bytes()
        loc = c["localizador"]
        if loc["tipo"] == "html":
            s = BeautifulSoup(b, "html.parser").select_one(loc["selector"])
            texto = s.get_text(" ", strip=True)[loc["inicio"]:loc["fin"]]
        else:
            doc = fitz.open(stream=b, filetype="pdf")
            blocks = doc[loc["paginaFisica"] - 1].get_text("blocks")
            matches = [x[4] for x in blocks if all(abs(x[i] - loc["bbox"][i]) < .001 for i in range(4))]
            assert len(matches) == 1
            texto = matches[0][loc["inicioBloque"]:loc["finBloque"]]
        assert texto == c["textoLiteral"], c["id"]
    decisiones = json.loads((folder / "decisiones.json").read_text())["deducciones"]
    original = json.loads((lote / "dictamenes.json").read_text())["deducciones"]
    assert len(decisiones) == len({r["codigo"] for r in decisiones}) == 48
    assert {r["codigo"] for r in decisiones} == {r["codigo"] for r in original}
    matriz = json.loads((folder / "matriz-vigencia.json").read_text())["articulos"]
    assert {r["codigo"] for r in matriz} == {r["codigo"] for r in decisiones}
    print(json.dumps({"codigos": 48, "documentos": len(fuentes), "citasComplementarias": len(citas), "literalidad": "comprobada"}))


if __name__ == "__main__":
    main()
