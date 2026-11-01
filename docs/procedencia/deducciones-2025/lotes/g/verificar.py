#!/usr/bin/env python3
"""Comprueba cobertura, integridad y reextracción literal; nunca descarga fuentes."""
import argparse
import hashlib
import json
import re
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
    html = {}
    pdfs = {key: fitz.open(stream=data, filetype="pdf")
            for key, (source, data) in documents.items()
            if source["mimeType"] == "application/pdf"}
    selections = {}
    children = {}

    def select_tag(document_id, selector):
        key = (document_id, selector)
        if document_id not in html:
            html.clear()
            selections.clear()
            children.clear()
            html[document_id] = BeautifulSoup(documents[document_id][1], "html.parser")
        if key in selections:
            return selections[key]
        parts = selector.split(' > ')
        if re.fullmatch(r'#[\w-]+', parts[0]) and all(
                re.fullmatch(r'\w+:nth-of-type\(\d+\)', part) for part in parts[1:]):
            root_key = (document_id, parts[0])
            if root_key not in selections:
                selections[root_key] = html[document_id].find(id=parts[0][1:])
            tag = selections[root_key]
            for part in parts[1:]:
                match = re.fullmatch(r'(\w+):nth-of-type\((\d+)\)', part)
                child_key = (id(tag), match[1])
                if child_key not in children:
                    children[child_key] = tag.find_all(match[1], recursive=False)
                tag = children[child_key][int(match[2]) - 1]
        else:
            tag = html[document_id].select_one(selector)
        selections[key] = tag
        return tag

    count = 0
    for result in results['deducciones']:
        assert result['estadoRevision'] == 'candidato'
        assert len(result['comparaciones']) >= 7
        assert result['pendientes']
    citations = sorted((citation for result in results['deducciones']
                        for citation in result['citas']),
                       key=lambda citation: citation['documentoId'])
    for citation in citations:
        source, data = documents[citation['documentoId']]
        locator = citation['localizador']
        if locator['tipo'] == 'html':
            tag = select_tag(citation['documentoId'], locator['selector'])
            assert tag is not None, citation['id']
            text = tag.get_text(' ', strip=True)[locator['inicio']:locator['fin']]
        else:
            pdf = pdfs[citation['documentoId']]
            text = pdf[locator['paginaFisica'] - 1].get_textbox(fitz.Rect(locator['bbox']))
        assert text == citation['textoLiteral'], citation['id']
        count += 1
    print(f'{len(actual)} fichas; {len(documents)} documentos íntegros; {count} citas reextraídas. Candidato, sin aceptación fiscal.')


if __name__ == '__main__':
    main()
