"""Adquisición serial mediante helper auditado; CAS exclusivo del checkout."""
import json
import sys
from datetime import datetime, timezone
from importlib import import_module
from pathlib import Path


def main():
    sys.path.insert(0, str(Path('tools/procedencia').resolve()))
    download = import_module('descargar').download
    out = Path(__file__).resolve().parents[1]
    root = Path('.cache/redondeo-tgss-mensual/cas').resolve()
    records = []
    for source in json.loads((out / 'fuentes/urls.json').read_text()):
        try:
            record = download(source['url'], root, max_bytes=16 * 1024 * 1024)
            record['id'] = source['id']
        except Exception as error:
            record = dict(source, error=str(error), attemptedAt=datetime.now(timezone.utc).isoformat())
        records.append(record)
        (out / 'fuentes/documentos.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
        print(source['id'], record.get('httpStatus', record.get('error')))


if __name__ == '__main__':
    main()
