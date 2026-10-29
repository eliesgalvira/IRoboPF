"""Prepara solo el runtime fijado de lint en scratch; dependencias de lectura."""
import hashlib
import json
from pathlib import Path
import shutil

root = Path.cwd()
dest = root / '.cache/preservacion-r21-sol/lint-runtime1'
dest.mkdir()
(dest / 'tools').mkdir()
shutil.copytree(root / 'tools/oxlint', dest / 'tools/oxlint')
shutil.copyfile(root / '.oxlintrc.json', dest / '.oxlintrc.json')
(dest / 'node_modules').symlink_to('/home/elies/Repos/IRoboPF/node_modules', target_is_directory=True)
(dest / 'smoke.ts').write_text('export const revision = 1;\n')
rows = []
for original in (root / 'tools/oxlint').rglob('*'):
    if original.is_file():
        target = dest / original.relative_to(root)
        assert original.read_bytes() == target.read_bytes()
        rows.append(dict(path=original.relative_to(root).as_posix(),sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
(root / 'docs/procedencia/revisiones/preservacion-r21-sol/lint-runtime.json').write_text(json.dumps(rows,indent=2)+'\n')
