"""Sustituye solo el enlace tools del scratch propio, que Nix no admite."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[4]
scratch = ROOT / '.cache/madrid-v2-r25-sol/ensayo'
tools = scratch / 'tools'
assert tools.is_relative_to(ROOT / '.cache/madrid-v2-r25-sol')
if tools.is_symlink():
    tools.unlink()
for source in (ROOT / 'tools/procedencia').iterdir():
    if source.is_file() and (source.suffix in ['.py', '.toml', '.lock', '.nix'] or source.name == 'run.sh'):
        target = tools / 'procedencia' / source.name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
print('Herramientas mínimas de ejecución copiadas en scratch; originales intactos.')
