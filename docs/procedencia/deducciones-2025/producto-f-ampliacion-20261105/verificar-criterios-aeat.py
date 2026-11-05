"""Reextrae localizadores desde CAS externo, sin red ni escritura de originales."""
import argparse
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path


class TextoHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.partes = []

    def handle_data(self, data):
        self.partes.append(data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cas-root", type=Path, required=True)
    args = parser.parse_args()
    fuentes = json.loads(
        Path(__file__).with_name("fuentes-criterios-aeat-2025.json").read_text()
    )
    textos = {}
    for documento in fuentes["documentos"]:
        cuerpo = (args.cas_root / documento["sha256"]).read_bytes()
        assert len(cuerpo) == documento["bytes"]
        assert hashlib.sha256(cuerpo).hexdigest() == documento["sha256"]
        assert hashlib.sha512(cuerpo).hexdigest() == documento["sha512"]
        html = TextoHTML()
        html.feed(cuerpo.decode("utf-8"))
        textos[documento["id"]] = " ".join(" ".join(html.partes).split())
    for cita in fuentes["criterios"]:
        localizador = cita["localizador"]
        pasaje = textos[cita["documentoId"]][localizador["inicio"]:localizador["fin"]]
        assert hashlib.sha256(pasaje.encode()).hexdigest() == cita["sha256PasajeNormalizado"]
        if "textoLiteral" in cita:
            assert cita["textoLiteral"] == pasaje
    print(f"{len(textos)} documentos y {len(fuentes['criterios'])} localizadores cotejados")


if __name__ == "__main__":
    main()
