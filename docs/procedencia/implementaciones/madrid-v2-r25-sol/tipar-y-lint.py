"""Prepara la vista mínima de lint sin cambiar reglas ni instalar paquetes JS."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
scratch = ROOT / '.cache/madrid-v2-r25-sol/lint'
for relative in ['.oxlintrc.json', 'eslint.config.mjs', *[str(p.relative_to(ROOT)) for p in (ROOT / 'tools/oxlint').rglob('*') if p.is_file()], str((OUT / 'coordinador.mjs').relative_to(ROOT))]:
    target = scratch / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / relative, target)
link = scratch / 'node_modules'
if not link.exists():
    link.symlink_to('/home/elies/Repos/IRoboPF/node_modules')
print('Vista mínima de lint con configuración y plugin exactos, node_modules solo lectura.')
