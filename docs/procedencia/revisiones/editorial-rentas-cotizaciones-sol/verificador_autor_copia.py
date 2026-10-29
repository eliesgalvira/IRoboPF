"""Validación propia de estructura, referencias y casos; no certifica reglas fiscales."""
from __future__ import annotations

import ast
import gzip
import hashlib
import json
import pathlib
import subprocess
from fractions import Fraction

import jsonschema
import pymupdf

ROOT = pathlib.Path('docs/procedencia/editorial/rentas-retenciones-cotizaciones')
BASE = '1196269d4e73742beeed35cc05011b70c21a0b69'


def load(name: str):
    return json.loads((ROOT / name).read_text())


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def rational(expression: str) -> Fraction:
    """Solo aritmética racional; sin eval ni imports del motor."""
    def visit(node: ast.AST) -> Fraction:
        if isinstance(node, ast.Constant):
            return Fraction(str(node.value))
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
            return -visit(node.operand)
        if isinstance(node, ast.BinOp):
            left, right = visit(node.left), visit(node.right)
            if isinstance(node.op, ast.Add):
                return left + right
            if isinstance(node.op, ast.Sub):
                return left - right
            if isinstance(node.op, ast.Mult):
                return left * right
            if isinstance(node.op, ast.Div):
                return left / right
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            args = [visit(a) for a in node.args]
            if node.func.id == 'min':
                return min(args)
            if node.func.id == 'max':
                return max(args)
        raise ValueError(ast.dump(node))
    return visit(ast.parse(expression, mode='eval').body)


def main() -> None:
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
    fichas = load('fichas.json')
    jsonschema.Draft202012Validator(load('fichas.schema.json')).validate(fichas)
    jsonschema.Draft202012Validator(load('parametros.schema.json')).validate(
        load('parametros.json'))
    rastro = json.loads(pathlib.Path('lib/procedencia/rastro-generado.json').read_text())
    def included(site: str) -> bool:
        return not (site.startswith(('anual.base.', 'anual.cuota.', 'anual.minimo.',
                                    'anual.deducciones.', 'anual.explicito.cuota.'))
                    or site in {'anual.explicito.big', 'anual.explicito.blg'})
    bindings = {b['siteId']: b for b in rastro['bindings'] if included(b['siteId'])}
    assert len(bindings) == 37
    assert {f['objetivo']['siteId'] for f in fichas if f['objetivo']['siteId']} == set(bindings)
    assert len(fichas) == 40
    assert len({f['id'] for f in fichas}) == 40
    cites = {c['id']: c for c in load('citas.json')}
    for ficha in fichas:
        site = ficha['objetivo']['siteId']
        if site:
            assert ficha['objetivo']['sujeto'] == bindings[site]['sujeto']
        for source in ficha['codigo']:
            assert digest(pathlib.Path(source['archivo']).read_bytes()) == source['sha256']
        assert ficha['secciones']['evidencia']['citas']
        for cite in ficha['secciones']['evidencia']['citas']:
            assert cite in cites
    documents = {}
    reproduced = 0
    for cite in cites.values():
        original = cite['original']
        path = original['path']
        if path not in documents:
            data = pathlib.Path(path).read_bytes()
            assert digest(data) == original['sha256']
            assert hashlib.sha512(data).hexdigest() == original['sha512']
            assert len(data) == original['size']
            documents[path] = pymupdf.open(path)
        page = documents[path][cite['selector']['pagina'] - 1]
        assert page.get_text() == cite['selector']['texto']
        if cite['facsimil']:
            data = pathlib.Path(cite['facsimil']['path']).read_bytes()
            assert digest(data) == cite['facsimil']['sha256']
            assert data == page.get_pixmap(dpi=90, alpha=False).tobytes('png')
        reproduced += 1
    for leaf in load('parametros.json'):
        source = leaf['ocurrencia']['fuente']
        assert digest(pathlib.Path(source['file']).read_bytes()) == source['sha256']
        assert leaf['aceptacionFiscalCompleta'] is False
        for reference in leaf['secciones']['evidencia']['citas']:
            assert reference in cites
    artifact = json.loads(gzip.decompress(pathlib.Path(
        'docs/procedencia/inventario-datos.json.gz').read_bytes()))
    inventory = {}
    for name, content in artifact:
        if name.startswith('inventario-pagina-'):
            inventory.update({item['id']: item for item in json.loads(content)})
    for leaf in load('parametros.json'):
        occurrence = leaf['ocurrencia']
        item = inventory[occurrence['id']]
        assert occurrence['fuente'] == item['source']
        assert occurrence['simbolo'] == item['symbol']
        assert occurrence['ruta'] == item['path']
        assert leaf['valor'] == item['value']
        assert leaf['objetivo']['sujeto']['id'] == occurrence['id']
    ficha_ids = {f['id'] for f in fichas}
    for leaf in load('parametros.json'):
        assert set(leaf['usosCandidatos']) <= ficha_ids
    for mapping in load('correspondencias.json'):
        assert mapping['ficha'] in ficha_ids
        for occurrence in mapping['ocurrencias']:
            item = inventory[occurrence['id']]
            assert occurrence['source'] == item['source']
            assert occurrence['path'] == item['path']
            assert occurrence['symbol'] == item['symbol']
    for source in load('fuentes-codigo.json'):
        assert digest(pathlib.Path(source['path']).read_bytes()) == source['sha256']
    for case in load('casos.json'):
        assert rational(case['expresion']) == Fraction(case['esperado']), case['id']
    tree = subprocess.check_output(['git', 'ls-tree', '-rz', 'HEAD']).split(b'\0')
    checked = 0
    for entry in filter(None, tree):
        meta, raw_path = entry.split(b'\t', 1)
        mode, _, oid = meta.split(b' ')
        path = pathlib.Path(raw_path.decode())
        info = path.lstat()
        assert info
        data = str(path.readlink()).encode() if mode == b'120000' else path.read_bytes()
        actual = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        assert actual == oid.decode(), str(path)
        checked += 1
    result = {'base': BASE, 'entradasBaseIdenticas': checked, 'sitios': len(bindings),
              'fichas': len(fichas), 'hojasTecnicas': len(load('parametros.json')),
              'originalesSHA256y512': len(documents), 'paginasReextraidas': reproduced,
              'casosRacionales': len(load('casos.json')), 'aceptacionFiscal': False}
    pathlib.Path('/home/elies/.t3/worktrees/IRoboPF/t3-9664290b/docs/procedencia/revisiones/editorial-rentas-cotizaciones-sol/verificador-autor-resultado.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result))


if __name__ == '__main__':
    main()
