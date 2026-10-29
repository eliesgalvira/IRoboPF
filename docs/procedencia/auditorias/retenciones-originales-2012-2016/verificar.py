"""Verifica los artefactos persistidos; no es una revision fiscal independiente."""
import hashlib
import json
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent


def main():
    fuentes = json.loads((ROOT / 'fuentes.json').read_text())
    citas = json.loads((ROOT / 'citas.json').read_text())
    por_hash = {fuente['sha256']: fuente for fuente in fuentes}
    for fuente in fuentes:
        datos = Path(fuente['localPath']).read_bytes()
        assert len(datos) == fuente['size']
        assert hashlib.sha256(datos).hexdigest() == fuente['sha256']
        assert hashlib.sha512(datos).hexdigest() == fuente['sha512']
    for cita in citas:
        with fitz.open(por_hash[cita['documentSha256']]['localPath']) as pdf:
            pagina = pdf[cita['page'] - 1]
            assert pagina.get_textbox(fitz.Rect(cita['bbox'])) == cita['quote']
            receta = cita['facsimile']
            datos = pagina.get_pixmap(dpi=receta['dpi'], colorspace=fitz.csRGB,
                                     alpha=receta['alpha']).tobytes('png')
            assert hashlib.sha256(datos).hexdigest() == receta['sha256']
            assert Path(receta['path']).read_bytes() == datos
    print(json.dumps({'originales': len(fuentes), 'citas': len(citas),
                      'facsímiles': len(citas), 'fallos': 0, 'aceptacionFiscal': False}))


if __name__ == '__main__':
    main()
