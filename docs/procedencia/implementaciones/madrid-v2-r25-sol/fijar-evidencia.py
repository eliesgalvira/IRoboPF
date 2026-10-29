"""Fija recetas, cajas, citas y originales existentes; no adquiere fuentes nuevas."""
import hashlib
import json
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
CAS = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256')
registry = json.loads((ROOT / 'docs/procedencia/auditorias/cadena-autonomica-c/documentos.json').read_bytes())
manual = next(d for d in json.loads((ROOT / 'docs/procedencia/auditorias/autonomicas-2017-2021/documentos.json').read_bytes()) if d.get('identifier') == '2020-pdf')
original = json.loads((ROOT / 'docs/procedencia/corpus/madrid-2018-norma.manifest.json').read_bytes())
reform = registry['BOE-A-2022-1192-pdf0']
entries = []
for document, selections in [(original, [(1, None, 'norma-p1.png'), (4, None, 'norma-p4.png'), (12, None, 'norma-p12.png'), (12, [98, 238, 497, 327], 'vigencia-2018.png')]),
                             (manual, [(893, None, 'manual-2020-previa.png'), (894, None, 'manual-2020.png'), (894, [30, 5, 570, 235], 'manual-contexto-2020.png')]),
                             (reform, [(3, None, 'reforma-2021-final.png'), (3, [50, 555, 550, 617], 'vigencia-2022.png')])]:
    raw = (CAS / document['sha256']).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == document['sha256']
    assert hashlib.sha512(raw).hexdigest() == document['sha512']
    assert len(raw) == document['size']
    with pymupdf.open(stream=raw) as doc:
        cites = []
        for number, bbox, filename in selections:
            page = doc[number - 1]
            clip = pymupdf.Rect(bbox) if bbox else page.rect
            png = page.get_pixmap(dpi=110, clip=clip, colorspace=pymupdf.csRGB, alpha=False, annots=False).tobytes('png')
            target = OUT / filename
            if target.exists():
                assert target.read_bytes() == png
            else:
                target.write_bytes(png)
            quote = page.get_text('text', clip=clip, flags=0, sort=False)
            cites.append({'page': number, 'pageNumbering': 'physical-1-based', 'bbox': list(clip),
                          'coordinateSystem': 'pymupdf-unrotated-top-left-points', 'quote': quote,
                          'quoteSha256': hashlib.sha256(quote.encode()).hexdigest(),
                          'extraction': 'text-layer; flags=0; sort=false', 'rotation': page.rotation,
                          'mediaBox': list(page.mediabox), 'cropBox': list(page.cropbox),
                          'facsimile': {'path': target.relative_to(ROOT).as_posix(),
                                       'sha256': hashlib.sha256(png).hexdigest(), 'size': len(png),
                                       'parameters': {'engine': 'MuPDF', 'pymupdf': pymupdf.VersionBind,
                                                      'mupdf': pymupdf.VersionFitz, 'dpi': 110, 'colorspace': 'RGB',
                                                      'alpha': False, 'annots': False, 'format': 'png'}}})
        entries.append({'document': {k: document[k] for k in ['canonicalUrl', 'finalUrl', 'retrievedAt', 'httpStatus', 'sha256', 'sha512', 'size', 'mimeType']},
                        'authenticity': document.get('authenticity', {'status': 'not-validated'}),
                        'citations': cites})
(OUT / 'evidencias-temporales.json').write_text(json.dumps({'status': 'candidate', 'newAcquisitions': [],
    'documents': entries, 'bindingCitation': json.loads((ROOT / 'docs/procedencia/corpus/madrid-2020-limite.citation.json').read_bytes()),
    'limits': 'La DF2018 no formula un selector 2020; el manual2020 contradice el decimal legal; la reforma2021 no es prueba negativa exhaustiva de reformas intermedias.'}, ensure_ascii=False, indent=2) + '\n')
print('Originales comprobados con ambos hashes/tamaño; citas y PNG reproducidos con recetas fijadas.')
