"""Reconstruye el parche de adiciones en scratch y coteja también binarios/vacíos."""

import base64
import gzip
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
TARGET = ROOT / '.cache/redondeo-anual-rentaweb-open/reconstruccion'


def main():
    patch = json.loads((HERE / 'entrega.patch.json').read_text())
    assert patch['formato'] == 'adiciones-gzip-base64-v1'
    for record in patch['archivos']:
        relative = Path(record['ruta'])
        assert not relative.is_absolute() and '..' not in relative.parts
        data = gzip.decompress(base64.b64decode(record['gzipBase64']))
        assert hashlib.sha256(data).hexdigest() == record['sha256']
        assert len(data) == record['bytes']
        dest = TARGET / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        dest.chmod(record['modo'])
        assert dest.read_bytes() == (ROOT / relative).read_bytes()
    print(f"Reconstruidos y cotejados {len(patch['archivos'])} archivos, incluidos binarios y vacíos.")


if __name__ == '__main__':
    main()
