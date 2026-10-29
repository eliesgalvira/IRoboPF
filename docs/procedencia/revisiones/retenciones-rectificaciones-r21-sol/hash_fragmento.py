import hashlib
from html import unescape
import json
from pathlib import Path
import re

OUT = Path('docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol')
rows = []
for citation in json.loads(Path('docs/procedencia/correcciones/retenciones-2015-2016-r21/citas-art87-5.json').read_text()):
    text = Path(citation['document']['path']).read_text()
    start = text.index('<div class="bloque" id="a87">')
    end = text.index('<div class="bloque" id="a88">', start)
    raw = text[start:end]
    candidates = {'raw-between-divs': raw, 'before-blockquote': raw.split('<blockquote>')[0], 'after-title-before-blockquote': raw.split('</h5>')[1].split('<blockquote>')[0]}
    for key, value in list(candidates.items()):
        candidates[key + '-normalized'] = ' '.join(unescape(re.sub('<[^>]+>', ' ', value)).split())
    results = {k: hashlib.sha256(v.encode()).hexdigest() for k, v in candidates.items()}
    row = {'documentSha256': citation['document']['sha256'], 'declared': citation['sectionSha256'], 'representations': results, 'matching': [k for k,v in results.items() if v == citation['sectionSha256']]}
    rows.append(row)
(OUT / 'hash-fragmento.json').write_text(json.dumps(rows, indent=2))
print(json.dumps(rows, indent=2))
