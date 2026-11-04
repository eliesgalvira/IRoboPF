"""Configuración explícita: fuentes públicas; estado y originales fuera del código."""
import os
import shutil
from pathlib import Path

SOURCE = Path(__file__).resolve().parent
CHECKOUT = SOURCE.parents[2]
DIRECTORIES = ('C_RUN_DIR', 'C_CAS_DIR', 'C_TEMPLATE_DIR')


def overlaps(left, right):
    return left == right or left in right.parents or right in left.parents


def external_directory(value, name):
    path = Path(value)
    if not path.is_absolute():
        raise ValueError(name + ' debe ser una ruta absoluta')
    # resolve también normaliza .. y los padres existentes de rutas aún nuevas.
    path = path.resolve()
    if overlaps(path, CHECKOUT.resolve()) or overlaps(path, SOURCE.resolve()):
        raise ValueError(name + ' debe estar separado del checkout y del código')
    if path.exists() and not path.is_dir():
        raise ValueError(name + ' no es un directorio')
    return path


def directory(name):
    value = os.environ.get(name)
    if not value:
        raise ValueError('Configure ' + name + ' con una ruta externa absoluta')
    path = external_directory(value, name)
    for peer in DIRECTORIES:
        if peer != name and os.environ.get(peer):
            other = external_directory(os.environ[peer], peer)
            if overlaps(path, other):
                raise ValueError(name + ' y ' + peer + ' deben ser directorios separados')
    return path


def executable(name, default):
    value = os.environ.get(name, default)
    found = shutil.which(value)
    if not found:
        raise ValueError('Falta ' + default + '; instálelo en su entorno o configure ' + name)
    return found


def global_lock():
    path = Path.home() / ".cache" / "irobopf-c-official.lock"
    path.parent.mkdir(parents=True, exist_ok=True)
    return path
