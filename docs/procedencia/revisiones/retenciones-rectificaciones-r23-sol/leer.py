import json
from pathlib import Path

root = Path("docs/procedencia")
for file in [
    "revisiones/retenciones-2012-2014-sol/matriz-80.json",
    "revisiones/retenciones-2012-2014-sol/ramas-44.json",
    "correcciones/retenciones-2012-2014-r23/ajustes.json",
]:
    data = json.loads((root / file).read_text())
    rows = data["corrections"] if isinstance(data, dict) else data
    print("\nARCHIVO", file)
    for row in rows:
        print(json.dumps(row, ensure_ascii=False))
