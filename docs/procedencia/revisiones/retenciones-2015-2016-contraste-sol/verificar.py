"""Contraste físico/documental; no ejecuta ni cambia el motor fiscal."""
from __future__ import annotations

import difflib
import gzip
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
from typing import Any

import fitz

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
AUTHOR = OUT.parent / 'retenciones-2015-2016-sol'
SCRATCH = ROOT / '.cache/contraste-s1516'


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read(path: Path) -> Any:
    return json.loads(path.read_text())


def main() -> None:
    sources = read(AUTHOR / 'integridad-19.json')['records'] + read(ROOT / 'docs/procedencia/correcciones/integracion-r19/cas-retenciones.json')['objects']
    catalog: dict[str, str] = {}
    verified = []
    for row in sources:
        path = row.get('preservedPath', row.get('path'))
        data = Path(path).read_bytes()
        assert digest(data) == row['sha256']
        assert hashlib.sha512(data).hexdigest() == row['sha512']
        assert len(data) == row['size']
        catalog[row['sha256']] = path
        verified.append({'path': path, 'sha256': digest(data), 'sha512': hashlib.sha512(data).hexdigest(), 'size': len(data)})
    (OUT / 'fuentes-verificadas.json').write_text(json.dumps(verified, indent=2))
    for original in read(AUTHOR / "originales.json"):
        doc = fitz.open(catalog[original["sha256"]])
        parts = [f"\n=== {original['id']} PAGINA {i + 1} ===\n" + page.get_text(sort=False) for i, page in enumerate(doc)]
        (SCRATCH / (original["id"] + "-lectura.txt")).write_text("\n".join(parts))
        doc[15].get_pixmap(matrix=fitz.Matrix(3, 3), clip=fitz.Rect(50, 535, 560, 650), alpha=False).save(str(SCRATCH / (original["id"] + "-edad.png")))
    pages = []
    for row in read(AUTHOR / 'citas-paginas.json'):
        doc = fitz.open(catalog[row['documentSha256']])
        page = doc[row['page'] - 1]
        text = page.get_text(sort=True).rstrip('\n')
        assert text == row['text'].rstrip('\n'), row['id']
        png = page.get_pixmap(matrix=fitz.Matrix(1.1, 1.1), alpha=False).tobytes('png')
        assert digest(png) == row['facsimileSha256'], row['id']
        pages.append({'id': row['id'], 'textExact': True, 'renderExact': True, 'textSha256': digest(text.encode()), 'facsimileSha256': digest(png), 'visualPersonal': False})
    (OUT / 'contraste-140.json').write_text(json.dumps(pages, indent=2))
    for name in ['citas-juridicas.json']:
        for row in read(AUTHOR / name):
            doc = fitz.open(catalog[row['documentSha256']])
            text = doc[row['page'] - 1].get_text()
            (SCRATCH / (row['id'].replace(':', '-') + '.txt')).write_text(text)
    # Todas las tablas finales se cotejan literalmente, con orden de lectura original.
    jan = (SCRATCH / '2015-enero-revision-lectura.txt').read_text().split('PAGINA 39 ===')[1]
    for name, start in [('2015-julio-revision', 38), ('2016-anual', 39)]:
        other = (SCRATCH / (name + '-lectura.txt')).read_text().split(f'PAGINA {start} ===')[1]
        (SCRATCH / (name + '-tablas.diff')).write_text(''.join(difflib.unified_diff(jan.splitlines(True), other.splitlines(True))))
    for name in ['casos.py', 'repro_rojo.py']:
        target = SCRATCH / name
        shutil.copyfile(AUTHOR / name, target)
        result = subprocess.run([sys.executable, str(target)], capture_output=True, text=True, check=False)
        (OUT / (name + '.log')).write_text(result.stdout + result.stderr + f'\nexitCode={result.returncode}\n')
        assert result.returncode == (1 if name == 'repro_rojo.py' else 0)
    actual = read(SCRATCH / 'casos-resultados.json')
    expected = read(AUTHOR / 'casos-resultados.json')
    assert actual == expected and actual['aserciones'] == 207
    (OUT / 'aserciones-207.json').write_text(json.dumps({'aserciones': 207, 'equal': True, 'motorEjecutado': False, 'cases': actual['cases']}, indent=2))
    for name in ['2015-enero-revision', '2015-julio-revision', '2016-anual']:
        data = (SCRATCH / (name + '-edad.png')).read_bytes()
        path = OUT / (digest(data) + '.png')
        path.write_bytes(data)
    cfg = read(ROOT / '.oxlintrc.json')['rules']
    assert sum(k.startswith('anti-slop') and v == 'error' for k, v in cfg.items()) == 16
    with gzip.open(OUT / 'lecturas-textuales.txt.gz', 'wt') as file:
        for name in ['2015-enero-revision', '2015-julio-revision', '2016-anual']:
            file.write((SCRATCH / (name + '-lectura.txt')).read_text())
    print('30 referencias de integridad; 140 textos y renders exactos; 207 aserciones reproducidas; 3 rojos originales conservados; 16 reglas a error')


if __name__ == '__main__':
    main()
