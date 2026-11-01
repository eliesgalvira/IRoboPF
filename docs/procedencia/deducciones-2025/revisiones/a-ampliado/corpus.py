#!/usr/bin/env python3
"""Suite externa opcional. Requiere CAS explícito, bs4 y PyMuPDF1.26.7.
Comprueba hashes/tamaño, nuevas citas y encabezado material de consolidaciones.
Salida1 mientras persista AAMP-01. No descarga ni escribe originales.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re

from bs4 import BeautifulSoup
import fitz


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cas', type=Path, action='append', required=True)
    args = parser.parse_args()
    here = Path(__file__).resolve().parent
    base = here.parents[1]
    fuentes = json.loads((base / 'lotes/a/fuentes.json').read_text())['documentos']
    fuentes += json.loads((here / 'fuentes-complementarias.json').read_text())['documentos']
    paths = {}
    for doc in fuentes:
        h = doc['sha256']
        p = next((p for root in args.cas for p in (root / h, root / 'sha256' / h) if p.is_file()), None)
        assert p is not None, h
        data = p.read_bytes()
        assert len(data) == doc['bytes']
        assert hashlib.sha256(data).hexdigest() == h
        assert hashlib.sha512(data).hexdigest() == doc['sha512']
        paths[doc['id']] = p
    citas = json.loads((here / 'citas-complementarias.json').read_text())['citas']
    for c in citas:
        with fitz.open(paths[c['documentoId']]) as doc:
            loc = c['localizador']
            assert doc[loc['paginaFisica'] - 1].get_text(clip=fitz.Rect(loc['bbox']), sort=False) == c['textoLiteral']
    expedientes = json.loads((base / 'lotes/a/dictamenes.json').read_text())['deducciones']
    errores = {}
    revisadas = set()
    for docid in ('andalucia', 'aragon', 'catalunya-2025'):
        soup = BeautifulSoup(paths[docid].read_bytes(), 'html.parser')
        for d in expedientes:
            for c in d['citas']:
                if c['documentoId'] != docid or c['id'] in revisadas:
                    continue
                if not re.fullmatch(r'[\d-]+(?: bis| ter| quater)?', c['articulo']):
                    continue
                revisadas.add(c['id'])
                loc = c['localizador']
                index = int(re.search(r'\[(\d+)\]', loc['recetaExtraccion']).group(1))
                element = soup.select(loc['selector'])[index]
                heading = element.find_previous('h5')
                title = heading.get_text(' ', strip=True) if heading else ''
                article = re.match(r'Artículo ([\d-]+(?: bis| ter| quater)?)[.]', title)
                assert article is not None, (c['id'], title)
                if article[1] != c['articulo']:
                    errores[c['id']] = {'atribuido': c['articulo'], 'encabezadoReal': title}
    print(f'{len(fuentes)} documentos íntegros; {len(citas)} citas nuevas; {len(revisadas)} atribuciones únicas contrastadas.')
    print(json.dumps(errores, ensure_ascii=False, indent=2))
    raise SystemExit(bool(errores))


if __name__ == '__main__':
    main()
