"""Valida el contrato y exige reconstrucción desde las fuentes actuales, sin asserts."""
import gzip
import hashlib
import io
import json
import subprocess
from pathlib import Path

from jsonschema import Draft202012Validator


def verify(root):
    folder = root / 'docs/procedencia'
    schema = json.loads((folder / 'inventario-schema.json').read_text())
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)
    manifest = json.loads((folder / 'inventario.json').read_text())
    raw = (folder / 'inventario-datos.json.gz').read_bytes()
    if hashlib.sha256(raw).hexdigest() != manifest['artifact']['sha256']:
        raise ValueError('Hash de artefacto incorrecto')
    with gzip.GzipFile(fileobj=io.BytesIO(raw)) as stream:
        decoded = stream.read(128 * 1024 * 1024 + 1)
    if len(decoded) > 128 * 1024 * 1024:
        raise ValueError('Artefacto descomprimido demasiado grande')
    files = dict(json.loads(decoded))
    count = 0
    for page in manifest['pages']:
        for item in json.loads(files[page['file']]):
            validator.validate(item)
            count += 1
    # Contrasta todos los bytes derivados contra una regeneración, incluidos auxiliares,
    # índices, ubicaciones, conteos y conjuntos exactos. No confía en hashes reescritos.
    subprocess.run(['bun', 'scripts/procedencia/inventario-artefacto.mjs', 'check'], cwd=root, check=True)
    print(f'{count} ocurrencias: schema y reconstrucción correctos; fiscalidad pendiente')


if __name__ == '__main__':
    verify(Path(__file__).resolve().parents[2])
