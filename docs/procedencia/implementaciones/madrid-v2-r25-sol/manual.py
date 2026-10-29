import hashlib
import json
from pathlib import Path

import pymupdf

out = Path(__file__).resolve().parent
rows = json.loads(Path('docs/procedencia/auditorias/autonomicas-2017-2021/citas-candidatas.json').read_bytes())
row = next(r for r in rows if r.get('id') == 'AUT1721-2020-madrid-r5-c1')
print(json.dumps(row, ensure_ascii=False))
with pymupdf.open('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256/' + row['documentSha256']) as doc:
    page = doc[row['page'] - 1]
    print(page.get_text())
    (out / 'manual-2020.png').write_bytes(page.get_pixmap(dpi=110, alpha=False, annots=False).tobytes('png'))
    raw = page.get_text('text', clip=pymupdf.Rect(row['boxes'][0]), flags=0, sort=False)
    print(repr(raw), hashlib.sha256(raw.encode()).hexdigest())
