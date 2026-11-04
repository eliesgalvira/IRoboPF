"""Rechaza rutas .cache en el checkout limpio de CI, antes de instalar o probar."""
import os
import sys
from pathlib import Path


def cache_paths(root):
    for directory, folders, files in os.walk(root, followlinks=False):
        # Metadatos del VCS no forman parte del árbol publicado.
        if Path(directory) == root:
            folders[:] = [name for name in folders if name not in ('.git', '.jj')]
        for name in folders + files:
            if name == '.cache':
                yield (Path(directory) / name).relative_to(root)
        folders[:] = [name for name in folders if name != '.cache']


if __name__ == '__main__':
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    if not root.is_dir():
        raise SystemExit('Checkout inexistente')
    paths = list(cache_paths(root))
    for path in paths:
        print('Ruta .cache prohibida en el checkout de CI: ' + str(path), file=sys.stderr)
    raise SystemExit(1 if paths else 0)
