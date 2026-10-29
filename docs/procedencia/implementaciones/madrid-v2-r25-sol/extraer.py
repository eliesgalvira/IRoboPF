import hashlib
import json
from pathlib import Path

import pymupdf

OUT = Path(__file__).resolve().parent
CAS = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256')
citation = json.loads(Path('docs/procedencia/corpus/madrid-2020-limite.citation.json').read_bytes())
manifest = json.loads(Path('docs/procedencia/corpus/madrid-2018-norma.manifest.json').read_bytes())
raw = (CAS / manifest['sha256']).read_bytes()
assert hashlib.sha256(raw).hexdigest() == manifest['sha256']
assert hashlib.sha512(raw).hexdigest() == manifest['sha512']
assert len(raw) == manifest['size']
with pymupdf.open(stream=raw) as doc:
    page = doc[citation['page'] - 1]
    quote = page.get_text('text', clip=pymupdf.Rect(citation['bbox']), flags=0, sort=False)
    assert quote == citation['quote'], repr(quote)
    png = page.get_pixmap(dpi=144, clip=pymupdf.Rect(citation['bbox']), colorspace=pymupdf.csRGB, alpha=False, annots=False).tobytes('png')
    assert hashlib.sha256(png).hexdigest() == citation['facsimile']['sha256']
    (OUT / 'tabla.png').write_bytes(png)
    for index in [0, 3, 11]:
        p = doc[index]
        (OUT / f'norma-p{index + 1}.png').write_bytes(p.get_pixmap(dpi=110, alpha=False, annots=False).tobytes('png'))
        (OUT / f'norma-p{index + 1}.txt').write_text(p.get_text())
    print(doc[11].get_text())
print('TABLA Y PNG EXACTOS', hashlib.sha256(png).hexdigest(), pymupdf.VersionBind, pymupdf.VersionFitz)
for digest in ['7784a1bc3fc8d602b9c2ffc334bc4b69e0e5bb24289134adff2396fbee093647']:
    data = (CAS / digest).read_bytes()
    assert hashlib.sha256(data).hexdigest() == digest
    with pymupdf.open(stream=data) as doc:
        for index, page in enumerate(doc):
            print('LEY 2/2021', index + 1, page.get_text())
            if index == len(doc) - 1:
                (OUT / 'reforma-2021-final.png').write_bytes(page.get_pixmap(dpi=110, alpha=False, annots=False).tobytes('png'))
