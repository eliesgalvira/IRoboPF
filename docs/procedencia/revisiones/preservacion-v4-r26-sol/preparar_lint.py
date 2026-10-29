"""Misma política anti-slop; carga del plugin compilado en caché propia."""
import json
from pathlib import Path

root = Path.cwd()
config = json.loads((root / '.oxlintrc.json').read_bytes())
assert len(config['rules']) == 16 and set(config['rules'].values()) == {'error'}
config['jsPlugins'] = [str(root / '.cache/preservacion-v4-r26-sol/anti-slop.js'), str(root / '.cache/preservacion-v4-r26-sol/anti-slop-effect.js')]
(root / '.cache/preservacion-v4-r26-sol/oxlint.json').write_text(json.dumps(config))
link = root / '.cache/preservacion-v4-r26-sol/node_modules'
if not link.exists():
    link.symlink_to('/home/elies/Repos/IRoboPF/node_modules', target_is_directory=True)
