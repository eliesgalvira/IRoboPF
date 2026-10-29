import hashlib
import json
from pathlib import Path


OUT = Path(__file__).resolve().parent
CAS = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256')
for name in ['docs/procedencia/revisiones/autonomicas-2017-2021/sources.json', 'docs/procedencia/revisiones/autonomicas-2017-2021/refined-citations.json']:
    data = json.loads(Path(name).read_bytes())
    rows = data.items() if isinstance(data, dict) else enumerate(data)
    for key, value in rows:
        if any(s in json.dumps(value, ensure_ascii=False).lower() for s in ['madrid', '53.407,29']):
            print(name, key, json.dumps(value, ensure_ascii=False)[:7000])
docs = json.loads(Path('docs/procedencia/auditorias/autonomicas-2017-2021/documentos.json').read_bytes())
for d in docs:
    if d.get('identifier') in ['2020-pdf','madrid-historico']:
        raw = (CAS / d['sha256']).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == d['sha256']
        print('DOC', json.dumps(d, ensure_ascii=False))
