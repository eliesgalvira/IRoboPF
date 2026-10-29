import hashlib
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path.cwd() / 'tools/procedencia'))
import corpus as c
import descargar as d
import pymupdf as p

root = Path('../sign-pdf')
(root / 'sha256').mkdir(parents=True, exist_ok=True)
results = []
for sign in ('\u207b', '\u208b'):
    with p.open() as doc:
        page = doc.new_page()
        page.insert_text((60, 70), sign + '8,50%', fontname='ReviewFont', fontfile=str(Path('../font-path.txt').read_text().strip() + '/share/fonts/truetype/DejaVuSans.ttf'))
        data = doc.tobytes()
    sha = hashlib.sha256(data).hexdigest()
    path = root / 'sha256' / sha
    path.write_bytes(data)
    record = {'canonicalUrl': 'https://www.boe.es/synthetic.pdf', 'finalUrl': 'https://www.boe.es/synthetic.pdf', 'sha256': sha, 'sha512': d.digest(path, 'sha512'), 'size': len(data), 'retrievedAt': '2026-10-29T10:00:00Z', 'httpStatus': 200, 'headers': {}, 'mimeType': 'application/pdf', 'authenticity': {'status': 'not-validated'}}
    citation = c.cite(record, root, 1, [40, 40, 200, 100])
    text = citation['quote']
    if text != sign + '8,50%\n':
        raise ValueError(repr(text))
    binding = {'number': {'start': 1, 'end': 5, 'literal': '8,50'}, 'numberFormat': 'es-ES', 'value': '8.50', 'unit': {'start': 5, 'end': 6, 'literal': '%'}, 'unitCode': 'percent'}
    citation = c.cite(record, root, 1, [40, 40, 200, 100], binding)
    result = c.verify(record, citation, root)
    results.append({'sign': sign, 'quote': text, 'binding': binding, 'result': result})
    (root / (format(ord(sign), '04x') + '.manifest.json')).write_text(json.dumps(record, indent=2))
    (root / (format(ord(sign), '04x') + '.citation.json')).write_text(json.dumps(citation, indent=2))
Path('../sign-pdf.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(results, ensure_ascii=False, indent=2))
