"""Recortes candidatos de originales conservados; no concede aceptación fiscal."""
import hashlib
import json
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent


def read(path):
    return json.loads((ROOT / path).read_bytes())


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    (OUT / 'citas').mkdir(exist_ok=True)
    (OUT / 'png').mkdir(exist_ok=True)
    docs = read('docs/procedencia/auditorias/seguridad-social/documentos.json')
    docs += read('docs/procedencia/auditorias/minimos/documentos.json')
    docs += read('docs/procedencia/editorial/rentas-retenciones-cotizaciones/fuentes-primarias.json')
    by_hash = {d['sha256']: d for d in docs}
    documents = {}
    citations = []

    def document(h):
        if h not in documents:
            d = by_hash[h]
            path = Path(d.get('localPath', d.get('path')))
            raw = path.read_bytes()
            assert sha(raw) == h
            assert hashlib.sha512(raw).hexdigest() == d['sha512']
            assert len(raw) == d['size']
            documents[h] = fitz.open(path)
        return documents[h]

    def cite(label, h, page, bbox, expected):
        pdf = document(h)
        p = pdf[page - 1]
        clip = fitz.Rect(bbox)
        coordinates = [clip.x0, clip.y0, clip.x1, clip.y1]
        text = p.get_textbox(clip)
        for token in expected:
            assert token in text, (label, token)
        png = p.get_pixmap(matrix=fitz.Matrix(2, 2), clip=clip, alpha=False).tobytes('png')
        image_path = OUT / 'png' / (sha(png) + '.png')
        image_path.write_bytes(png)
        d = by_hash[h]
        original = {k: d[k] for k in ('sha256', 'sha512', 'size')}
        original.update(path=d.get('localPath', d.get('path')), url=d.get('canonicalUrl', d.get('url')))
        assert original['url']
        citation = {
            'id': label, 'original': original,
            'selector': {'tipo': 'pdf', 'pagina': page, 'caja': coordinates,
                         'coordenadas': 'PDF points; top-left; page 1-based', 'texto': text},
            'receta': {'engine': 'PyMuPDF', 'version': fitz.VersionBind, 'matrix': [2, 2],
                       'clip': coordinates, 'alpha': False, 'format': 'png'},
            'facsimil': {'path': str(image_path.relative_to(ROOT)), 'sha256': sha(png), 'size': len(png)},
            'estado': 'candidata; revisión independiente pendiente', 'aceptacionFiscalCompleta': False,
        }
        target = OUT / 'citas' / (label + '.json')
        target.write_text(json.dumps(citation, ensure_ascii=False, indent=2) + '\n')
        citations.append({'id': label, 'path': str(target.relative_to(ROOT)), 'sha256': sha(target.read_bytes())})

    ss = read('docs/procedencia/auditorias/seguridad-social/citas-candidatas.json')
    selected = [
        ('ss2018-enero-maximo', 'BOE-A-2018-1142-p3-b5', ['3.751,20', '2018']),
        ('ss2018-agosto-maximo', 'BOE-A-2018-9268-p168-b8', ['3.803,70', 'mes']),
        ('mei2025', 'BOE-A-2025-3780-p16-b8', ['0,80', '0,67', '0,13']),
        ('solidaridad2025-t1', 'BOE-A-2025-3780-p16-b12', ['0,92', '0,77', '0,15']),
        ('solidaridad2025-t2', 'BOE-A-2025-3780-p17-b0', ['1 por ciento', '0,83', '0,17']),
        ('solidaridad2025-t3', 'BOE-A-2025-3780-p17-b1', ['1,17', '0,98', '0,19']),
        ('mei2026', 'BOE-A-2026-7296-p16-b2', ['0,90', '0,75', '0,15']),
        ('solidaridad2026-t1', 'BOE-A-2026-7296-p16-b6', ['1,15', '0,96', '0,19']),
        ('solidaridad2026-t2', 'BOE-A-2026-7296-p16-b7', ['1,25', '1,04', '0,21']),
        ('solidaridad2026-t3', 'BOE-A-2026-7296-p16-b8', ['1,46', '1,22', '0,24']),
    ]
    for label, cid, expected in selected:
        c = next(x for x in ss if x['id'] == cid)
        boxes = c.get('boxes', [c.get('bbox')])
        box = fitz.Rect(boxes[0])
        for other in boxes[1:]:
            box |= fitz.Rect(other)
        cite(label, c['documentSha256'], c['page'], box, expected)

    madrid = '502aa027788673d8f653c2cd8ce87038630a7dab13b63d625c5905bd1a5ce8de'
    cite('madrid-tabla-ley13-2023', madrid, 3, [115, 305, 501, 510], ['Escala', 'Cuota', '13.362,22'])
    cite('madrid-minimo-ley13-2023', madrid, 3, [115, 519, 501, 710], ['5.956,65'])
    minimums = read('docs/procedencia/auditorias/minimos/citas-candidatas.json')
    c = next(x for x in minimums if x['id'] == 'madrid2023-p14-b5')
    cite('madrid-efectos-ley13-2023', madrid, 14, c['boxes'][0], ['1 de enero de 2023'])
    cite('ss2018-entrada-vigor', 'aac01cdb3005f9276f021359c7a165d810fbaa5419e6e89ceec9ebe891d3150d',
         306, [99, 215, 500, 373], ['La presente Ley entrará en vigor al día siguiente'])

    rirpf = '0f6003cfa63f80e44e4ff31bfe72432e3147d8164347940001c5de7e1c74380f'
    cite('colegio-art10-p16', rirpf, 16, [355, 752, 630, 825], ['Artículo 10.', 'colegiación'])
    for page in (17,):
        blocks = document(rirpf)[page - 1].get_text('blocks')
        for b in blocks:
            if '500 euros anuales' in b[4]:
                cite('colegio-art10-p' + str(page), rirpf, page, list(b[:4]),
                     ['500 euros anuales'])

    law = 'ff21371b04e372bc56b65057cb792a3872cd7b4839e5547d1518d8eb77ed0525'
    for index, page in enumerate(document(law)):
        for b in page.get_text('blocks'):
            if 'Se considerarán rendimientos íntegros del tra' in b[4]:
                cite('trabajo-calificacion-art17', law, index + 1, list(b[:4]), ['Se considerarán'])
    for pdf in documents.values():
        pdf.close()
    (OUT / 'citas-nuevas.json').write_text(json.dumps(citations, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'citations': len(citations), 'originals': len(documents)}))


if __name__ == '__main__':
    main()
