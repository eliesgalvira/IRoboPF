"""Reconstruye exclusivamente el scratch de esta revisión desde bytes fijados."""
from pathlib import Path
import hashlib
import json
import shutil
import sys

out = Path(__file__).resolve().parent
source = Path(sys.argv[1]).resolve()
scratch = out / 'scratch'
if scratch.exists():
    raise SystemExit('Scratch ya existente: conservar o retirar explícitamente antes')
for entry in json.loads((out / 'fuentes.json').read_text())['files']:
    data = (source / entry['path']).read_bytes()
    if hashlib.sha256(data).hexdigest() != entry['sha256']:
        raise SystemExit('Fuente distinta: ' + entry['path'])
    target = scratch / entry['path']
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
(scratch / 'node_modules').symlink_to('/home/elies/Repos/IRoboPF/node_modules', target_is_directory=True)
(scratch / '.cache').mkdir(exist_ok=True)
for name in ['adversos.mjs', 'render-original.py']:
    shutil.copyfile(out / name, scratch / name)
print(scratch)
