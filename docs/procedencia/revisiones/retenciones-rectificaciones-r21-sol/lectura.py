import hashlib
import json
from pathlib import Path

root = Path('docs/procedencia/revisiones')
rows = []
for folder, name in [('retenciones-2015-2016-sol', 'matriz-60.json'), ('retenciones-2015-2016-sol', 'ramas-regularizacion.json'), ('retenciones-2015-2016-contraste-sol', 'decisiones-60.json')]:
    path = root / folder / name
    data = json.loads(path.read_text())
    first = {}
    changes = []
    for row in data:
        suffix = row['id'].split(':', 1)[1]
        if suffix not in first:
            first[suffix] = row
            if suffix in ['regularizacion', 'minimos'] or name == 'ramas-regularizacion.json':
                print(name, json.dumps(row, ensure_ascii=False))
        else:
            diff = {k: v for k, v in row.items() if v != first[suffix].get(k)}
            print(name, 'DIFERENCIAS respecto primer ID de sufijo', json.dumps(diff, ensure_ascii=False))
            changes.append(diff)
    rows.append({'path': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'count': len(data), 'first': first, 'differences': changes})
(root / 'retenciones-rectificaciones-r21-sol' / 'lectura-estructurada.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2))
