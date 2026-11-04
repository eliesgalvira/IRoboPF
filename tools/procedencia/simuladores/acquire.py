"""Descarga secuencial. Caché fijada explícita o nueva petición; sin reintentos."""
import argparse
import fcntl
import json
import time
import urllib.request
import urllib.parse
from pathlib import Path
from storage import append_jsonl, put_blob, read_jsonl, read_ref

from config import global_lock, directory
OUT = None
STORE = None

def fetch(url, fresh=False):
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != 'https' or not parsed.hostname or not (
            parsed.hostname.endswith('.agenciatributaria.gob.es') or parsed.hostname == 'sede.agenciatributaria.gob.es'):
        raise ValueError('Solo se admiten URL HTTPS oficiales AEAT')
    with global_lock().open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        records = read_jsonl(OUT / 'acquisitions.jsonl', repair_tail=True)
        matches = [row for row in records if row.get('url') == url]
        if not fresh and matches and matches[-1].get('status') == 200:
            row = matches[-1]
            return dict(row, reuse='historical-fixed'), read_ref(row['artifact'])
        time.sleep(1.5)
        row = {'url': url, 'utc': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'reuse': 'new-request'}
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'IRoboPF research official simulators'})
            with urllib.request.urlopen(request, timeout=45) as response:
                data = response.read(128 * 1024 * 1024 + 1)
                if len(data) > 128 * 1024 * 1024 or response.status != 200:
                    raise ValueError('Respuesta demasiado grande o distinta de 200')
                row.update(status=response.status, final=response.url, headers=dict(response.headers))
            row['artifact'] = put_blob(STORE, data)
            append_jsonl(OUT / 'acquisitions.jsonl', row)
            return row, data
        except Exception as error:
            append_jsonl(OUT / 'acquisitions.jsonl', dict(row, error=type(error).__name__ + ': ' + str(error)))
            raise


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--fresh', action='store_true')
    parser.add_argument('urls', nargs='+')
    args = parser.parse_args()
    OUT = directory('C_RUN_DIR')
    STORE = directory('C_CAS_DIR')
    OUT.mkdir(parents=True, exist_ok=True)
    STORE.mkdir(parents=True, exist_ok=True)
    for url in args.urls:
        print(json.dumps(fetch(url, args.fresh)[0]), flush=True)
