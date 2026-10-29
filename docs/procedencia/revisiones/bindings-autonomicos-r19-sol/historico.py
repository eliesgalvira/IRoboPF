"""Comprueba offsets históricos fijados; no cambia inventario ni autores."""
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/bindings-autonomicos-r19-sol'


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def blob(base, path):
    return subprocess.check_output(['git', 'show', base + ':' + path])


recipe = json.loads((ROOT / 'docs/procedencia/evidencias/autonomicas-v2/receta.json').read_bytes())
results = []
for label, base, hashes in [('historical', recipe['historicalBase'], recipe['historicalInventory']),
                            ('v2', recipe['base'], recipe['inventory'])]:
    manifest = blob(base, 'docs/procedencia/inventario.json')
    artifact = blob(base, 'docs/procedencia/inventario-datos.json.gz')
    assert sha(manifest) == hashes['manifestSha256'] and sha(artifact) == hashes['artifactSha256']
    results.append({'base': base, 'inventory': hashes, 'fixedRead': True})
    if label == 'historical':
        pages = dict(json.loads(gzip.decompress(artifact)))
        items = {i['id']: i for n, raw in pages.items() if n.startswith('inventario-pagina-') for i in json.loads(raw)}
        locs = json.loads((ROOT / 'docs/procedencia/evidencias/autonomicas-v2/localizadores-estructurales.json').read_bytes())
        checked = []
        for loc in locs:
            src = loc['source']
            raw = blob(base, src['file'])
            assert sha(raw) == src['sha256']
            text = raw.decode().encode('utf-16-le')[src['start'] * 2:src['end'] * 2].decode('utf-16-le')
            assert text == loc['literal']
            item = items[loc['itemId']]
            assert item['path'] == loc['path']
            checked.append({'id': loc['id'], 'itemId': loc['itemId'], 'literal': text, 'originalCount': loc['originalCount'], 'path': loc['path']})
        (OUT / 'localizadores-historicos.json').write_text(json.dumps(checked, ensure_ascii=False, indent=2) + '\n')
(OUT / 'lectura-historica.json').write_text(json.dumps(results, indent=2) + '\n')
print('Recetas históricas fijas verificadas; localizadores:', len(checked))
