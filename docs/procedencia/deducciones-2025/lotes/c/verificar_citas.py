"""Reextrae citas del lote C desde CAS externos, sin descargar ni modificar originales.

Dependencias: beautifulsoup4 y pymupdf. Ejecútese con uv --no-project y caché externa.
Cada --cas admite ROOT/HASH y ROOT/sha256/HASH. No usa rutas de manifiestos históricos.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup
import pymupdf


def verificar(carpeta, roots):
    fuentes = json.loads((carpeta / 'fuentes.json').read_text())['documentos']
    lote = json.loads((carpeta / 'dictamenes.json').read_text())
    documentos = {}
    html = {}
    pdf = {}
    for documento in fuentes:
        digest = documento['sha256']
        candidatos = [p for root in roots for p in (root / digest, root / 'sha256' / digest)]
        archivo = next((p for p in candidatos if p.is_file()), None)
        if archivo is None:
            raise ValueError(f'Original ausente: {digest}')
        raw = archivo.read_bytes()
        assert hashlib.sha256(raw).hexdigest() == digest, digest
        assert hashlib.sha512(raw).hexdigest() == documento['sha512'], digest
        assert len(raw) == documento['bytes'], digest
        documentos[documento['id']] = documento
        if documento['mimeType'] == 'application/pdf':
            pdf[documento['id']] = pymupdf.open(archivo)
        else:
            html[documento['id']] = BeautifulSoup(raw, 'html.parser')
    nodos = {}
    total = 0
    codigos = set()
    for deduccion in lote['deducciones']:
        assert deduccion['codigo'] not in codigos
        codigos.add(deduccion['codigo'])
        ids = set()
        for cita in deduccion['citas']:
            assert cita['id'] not in ids
            ids.add(cita['id'])
            did = cita['documentoId']
            assert did in documentos
            loc = cita['localizador']
            if loc['tipo'] == 'pdf':
                original = pdf[did][loc['paginaFisica'] - 1].get_text(
                    clip=pymupdf.Rect(loc['bbox']), sort=False
                )
            else:
                key = (did, loc['selector'])
                if key not in nodos:
                    parts = loc['selector'].split(' > ')
                    root = re.fullmatch(r'(\w+)#([\w-]+)', parts[0])
                    if root:
                        root_key = (did, parts[0])
                        if root_key not in nodos:
                            nodos[root_key] = html[did].find_all(root[1], id=root[2])
                        selected = nodos[root_key]
                        for part in parts[1:]:
                            step = re.fullmatch(r'(\w+):nth-of-type\((\d+)\)', part)
                            if not step:
                                selected = html[did].select(loc['selector'])
                                break
                            selected = [child for parent in selected for child in
                                        parent.find_all(step[1], recursive=False)[int(step[2])-1:int(step[2])]]
                        nodos[key] = selected
                    else:
                        nodos[key] = html[did].select(loc['selector'])
                nodes = nodos[key]
                assert len(nodes) == 1, cita['id']
                original = nodes[0].get_text(' ', strip=True)[loc['inicio']:loc['fin']]
            assert original == cita['textoLiteral'], cita['id']
            total += 1
        for comparacion in deduccion['comparaciones']:
            assert comparacion['citas'] and set(comparacion['citas']) <= ids
        assert set(deduccion['manual']['citas']) <= ids
        assert set(deduccion['vigencia']['citas']) <= ids
    assert len(codigos) == 51
    for documento in pdf.values():
        documento.close()
    return {'deducciones': len(codigos), 'documentos': len(documentos), 'citasReextraidas': total}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cas', type=Path, action='append', required=True)
    parser.add_argument('--carpeta', type=Path, default=Path(__file__).parent)
    args = parser.parse_args()
    print(json.dumps(verificar(args.carpeta, args.cas), ensure_ascii=False))
