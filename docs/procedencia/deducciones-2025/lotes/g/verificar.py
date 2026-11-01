#!/usr/bin/env python3
"""Comprueba cobertura, integridad y reextracción literal; nunca descarga fuentes."""
import argparse
import hashlib
import json
from pathlib import Path

import fitz
from bs4 import BeautifulSoup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cas', action='append', type=Path, required=True,
                        help='Root externo plano o con subcarpeta sha256; repetible')
    parser.add_argument('--schema', type=Path)
    args = parser.parse_args()
    folder = Path(__file__).resolve().parent
    results = json.loads((folder / 'dictamenes.json').read_text())
    sources = json.loads((folder / 'fuentes.json').read_text())
    census = json.loads((folder.parents[1] / 'censo.json').read_text())
    expected = {x['codigo'] for x in census['fichas'] if x['lote'] == 'g'}
    actual = [x['codigo'] for x in results['deducciones']]
    assert len(actual) == len(set(actual)) == 40 and set(actual) == expected
    assert results['baseCommit'] == '016ec72d9539ccd887202735960ce306bd2354e5'
    if args.schema:
        from jsonschema import Draft202012Validator
        schema = json.loads(args.schema.read_text())
        for definition, instance in [('lote', results), ('fuentes', sources)]:
            Draft202012Validator({**schema, '$ref': '#/$defs/' + definition}).validate(instance)
    documents = {}
    for source in sources['documentos']:
        sha = source['sha256']
        candidates = [p for cas in args.cas for p in (cas / sha, cas / 'sha256' / sha) if p.is_file()]
        assert candidates, 'Original ausente: ' + sha
        data = candidates[0].read_bytes()
        assert hashlib.sha256(data).hexdigest() == sha
        assert hashlib.sha512(data).hexdigest() == source['sha512']
        assert len(data) == source['bytes']
        documents[source['id']] = (source, data)
    html = {key: BeautifulSoup(data, "html.parser") for key, (source, data) in documents.items()
            if source["mimeType"] != "application/pdf"}
    count = 0
    for result in results['deducciones']:
        assert result['estadoRevision'] == 'candidato'
        assert len(result['comparaciones']) >= 7
        assert result['pendientes']
        for citation in result['citas']:
            source, data = documents[citation['documentoId']]
            locator = citation['localizador']
            if locator['tipo'] == 'html':
                soup = html[citation['documentoId']]
                tag = soup.select_one(locator['selector'])
                assert tag is not None, citation['id']
                text = tag.get_text(' ', strip=True)[locator['inicio']:locator['fin']]
            else:
                with fitz.open(stream=data, filetype='pdf') as pdf:
                    text = pdf[locator['paginaFisica'] - 1].get_textbox(fitz.Rect(locator['bbox']))
            assert text == citation['textoLiteral'], citation['id']
            count += 1
    print(f'{len(actual)} fichas; {len(documents)} documentos íntegros; {count} citas reextraídas. Candidato, sin aceptación fiscal.')


if __name__ == '__main__':
    main()
