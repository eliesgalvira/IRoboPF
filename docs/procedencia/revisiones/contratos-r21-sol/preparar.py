"""Prepara solo módulos de reproducción, no un checkout histórico."""
from pathlib import Path
import re
import subprocess

ROOT = Path.cwd()
SCRATCH = ROOT / '.cache/contratos-r21-sol'
OLD = '7668bdad60a79a8b3ad8e1e1b911f3d6c223692a'
REVIEW = ROOT / 'docs/procedencia/revisiones/contratos-publicacion-r19-sol'


def main() -> None:
    SCRATCH.mkdir(parents=True, exist_ok=True)
    for name in ('ambito-publicado', 'contenido-verificar'):
        src = subprocess.check_output(['git', 'show', f'{OLD}:scripts/procedencia/{name}.mjs']).decode()
        src = re.sub(r'from "(\.[^"]+)"',
                     lambda m: 'from "' + str((ROOT / 'scripts/procedencia' / m[1]).resolve()) + '"', src)
        (SCRATCH / f'{name}-old.mjs').write_text(src)
    src = (REVIEW / 'adversos-node.test.mjs').read_text()
    (SCRATCH / 'adversos-old.test.mjs').write_text(src.replace(
        '../../../../scripts/procedencia/ambito-publicado.mjs', str(SCRATCH / 'ambito-publicado-old.mjs')))
    src = (REVIEW / 'rojo-software.mjs').read_text().replace(
        '.cache/contratos-publicacion-r19-sol/software', '.cache/contratos-r21-sol/software')
    (SCRATCH / 'software-old.mjs').write_text(src.replace(
        '../../../../lib/', str(ROOT / 'lib') + '/').replace(
        '../../../../scripts/procedencia/contenido-verificar.mjs', str(SCRATCH / 'contenido-verificar-old.mjs')))


if __name__ == '__main__':
    main()
