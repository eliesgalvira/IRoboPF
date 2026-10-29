"""Resolución local explícita; no descarga ni escribe originales."""
import hashlib
from pathlib import Path
import re
import stat


def ordinary_path(path):
    path = Path(path)
    if not path.is_absolute() or '..' in path.parts:
        raise ValueError('CAS requiere ruta absoluta sin ascensos')
    for part in [*reversed(path.parents), path]:
        if part.is_symlink():
            raise ValueError('CAS rechaza enlaces simbólicos y ancestros')
    return path


class CasResolver:
    def __init__(self, roots):
        self.roots = tuple(ordinary_path(p) for p in roots)
        if not self.roots or any(not p.is_dir() for p in self.roots):
            raise ValueError('Raíces CAS deben ser directorios existentes')
        self.dependencies = {}

    def resolve(self, sha256):
        if not isinstance(sha256, str) or not re.fullmatch('[0-9a-f]{64}', sha256):
            raise ValueError('Hash CAS inválido')
        for root in self.roots:
            path = ordinary_path(root / 'sha256' / sha256)
            if not path.exists():
                continue
            if not stat.S_ISREG(path.stat().st_mode):
                raise ValueError('CAS requiere archivo ordinario')
            with path.open('rb') as stream:
                actual = hashlib.file_digest(stream, 'sha256').hexdigest()
            if actual != sha256:
                raise ValueError('Objeto CAS corrupto')
            self.dependencies[str(path)] = sha256
            return path
        raise ValueError('Objeto ausente en raíces CAS explícitas: ' + sha256)

    def finish(self):
        for path, expected in tuple(self.dependencies.items()):
            ordinary_path(path)
            with Path(path).open('rb') as stream:
                if hashlib.file_digest(stream, 'sha256').hexdigest() != expected:
                    raise ValueError('Objeto CAS cambió durante la verificación')
        return [{'path': path, 'sha256': sha} for path, sha in sorted(self.dependencies.items())]
