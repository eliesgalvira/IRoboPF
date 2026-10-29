import hashlib
import json
from pathlib import Path

import fitz

OUT = Path('docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol')
SOURCES = json.loads(Path('docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol/fuentes-verificadas.json').read_text())

def main() -> None:
    rows = []
    for prefix, pages in [('4b1117df', [8, 9, 14, 15]), ('6fe8785b', [23, 24, 27]), ('6e2dc7a4', [11])]:
        source = next(s for s in SOURCES if s['sha256'].startswith(prefix))
        data = Path(source['path']).read_bytes()
        assert hashlib.sha256(data).hexdigest() == source['sha256']
        assert hashlib.sha512(data).hexdigest() == source['sha512']
        with fitz.open(stream=data, filetype='pdf') as doc:
            for page in pages:
                text = doc[page - 1].get_text(sort=True)
                rows.append({'document': source, 'physicalPage': page, 'text': text})
    (OUT / 'cadena-primaria.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2))
    for row in rows:
        print(row['document']['sha256'][:8], row['physicalPage'], row['text'])

if __name__ == '__main__':
    main()
