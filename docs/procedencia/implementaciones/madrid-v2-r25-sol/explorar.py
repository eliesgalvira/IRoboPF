import json
from pathlib import Path

root = Path.cwd()
for filename in ['docs/procedencia/revisiones/autonomicas-2017-2021/revisiones.json', 'docs/procedencia/revisiones/cadena-autonomica-c/pasajes-temporales.json', 'docs/procedencia/auditorias/cadena-autonomica-c/documentos.json', 'docs/procedencia/auditorias/autonomicas-2017-2021/documentos.json']:
    data = json.loads(Path(filename).read_bytes())
    print('\nFILE', filename)
    rows = data.items() if isinstance(data, dict) else enumerate(data)
    for key, value in rows:
        s = json.dumps(value, ensure_ascii=False)
        if ('MADRID-2020-LIMITE' in s or 'madrid' in str(key).lower() or 'BOE-A-2019-4451' in str(key) or 'BOE-A-2022-1192' in str(key) or 'BOCM-20181228' in s):
            print(key, s[:16000])
