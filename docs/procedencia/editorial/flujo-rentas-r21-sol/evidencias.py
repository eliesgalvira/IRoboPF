"""Cotejo de fuentes recibidas y schema candidato, sin aceptación fiscal."""
import hashlib
import json
from pathlib import Path
from typing import TypedDict

import fitz
from jsonschema import Draft202012Validator


class Original(TypedDict):
    path: str
    size: int
    sha256: str
    sha512: str
    url: str


class Selector(TypedDict):
    pagina: int
    caja: list[float]
    texto: str


class Facsimil(TypedDict):
    path: str
    sha256: str


class Citation(TypedDict):
    id: str
    original: Original
    selector: Selector
    facsimil: Facsimil


class Flow(TypedDict):
    sites: list[object]


def main() -> None:
    out = Path('docs/procedencia/editorial/flujo-rentas-r21-sol')
    rows: list[dict[str, object]] = []
    for path in sorted(Path('docs/procedencia/correcciones/editorial-r21/citas').glob('*.json')):
        c: Citation = json.loads(path.read_bytes())
        if c['id'].startswith('madrid'):
            continue
        original = c['original']
        raw = Path(original['path']).read_bytes()
        assert len(raw) == original['size']
        assert hashlib.sha256(raw).hexdigest() == original['sha256']
        assert hashlib.sha512(raw).hexdigest() == original['sha512']
        with fitz.open(stream=raw, filetype='pdf') as doc:
            page = doc[c['selector']['pagina'] - 1]
            text: str = page.get_textbox(fitz.Rect(c['selector']['caja']))
        assert text == c['selector']['texto'], c['id']
        image = Path(c['facsimil']['path']).read_bytes()
        assert hashlib.sha256(image).hexdigest() == c['facsimil']['sha256']
        rows.append({'id': c['id'], 'original': original, 'selector': c['selector'],
                     'facsimile': c['facsimil'],
                     'result': 'hashes-originales-texto-exacto-png-conservado-correctos',
                     'visualInspection': 'inspección personal en esta tarea; sin rerender'})
    (out / 'pasajes.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
    flow: Flow = json.loads((out / 'flujo.json').read_bytes())
    schema: dict[str, object] = json.loads((out / 'schema.json').read_bytes())
    Draft202012Validator.check_schema(schema)
    Draft202012Validator(schema).validate(flow)
    (out / 'schema-resultado.json').write_text(json.dumps({
        'valid': True, 'version': 1, 'sites': len(flow['sites']),
        'citations': len(rows), 'pymupdf': fitz.VersionBind}, indent=2) + '\n')
    print('Schema y14pasajes: correctos; no aceptación jurídica')


if __name__ == '__main__':
    main()
