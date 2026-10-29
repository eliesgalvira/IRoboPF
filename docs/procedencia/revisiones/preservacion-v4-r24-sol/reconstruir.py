"""Reproduce tres citas con la operación del productor, conservando el intento get_text inicial."""
import hashlib
import json
import pymupdf as fitz
from revisar import CACHE, ROOT, facts, save


def main():
    citations = []
    for name in ('mei2025', 'madrid-tabla-ley13-2023', 'colegio-art10-p16'):
        row = json.loads((CACHE / ('metadatos/docs/procedencia/correcciones/editorial-r21/citas/' + name + '.json')).read_bytes())
        with fitz.open(CACHE / 'restauracion/sha256' / row['original']['sha256']) as doc:
            selector, recipe = row['selector'], row['receta']
            page = doc[selector['pagina'] - 1]
            text = page.get_textbox(fitz.Rect(selector['caja']))
            first_attempt = page.get_text(clip=fitz.Rect(selector['caja']))
            png = page.get_pixmap(matrix=fitz.Matrix(*recipe['matrix']), clip=fitz.Rect(recipe['clip']), alpha=recipe['alpha']).tobytes('png')
        (CACHE / (name + '.png')).write_bytes(png)
        result = dict(id=name, textEqual=text == selector['texto'], initialOperationEqual=first_attempt == selector['texto'], pngSha256=hashlib.sha256(png).hexdigest(), expected=row['facsimil']['sha256'], version=fitz.VersionBind, text=text, operation='get_textbox', historicalProducer=facts(ROOT / 'docs/procedencia/correcciones/editorial-r21/evidencias.py'))
        citations.append(result)
    save('reconstrucciones.json', citations)
    assert all(r['textEqual'] and r['pngSha256'] == r['expected'] for r in citations)
    print('Tres textos y tres PNG exactos desde restauración; get_textbox según productor histórico, sin ejecutar productor')

if __name__ == '__main__':
    main()
