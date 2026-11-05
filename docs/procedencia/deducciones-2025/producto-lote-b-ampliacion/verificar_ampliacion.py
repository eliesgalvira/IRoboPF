"""Control ligero: transporte, cobertura y aritmética independiente de oráculos.
No ejecuta TypeScript ni equivale a Vitest, tipos, lint o auditoría normativa.
"""
import ast
import difflib
import hashlib
import json
import re
from fractions import Fraction
from pathlib import Path

root = Path(__file__).resolve().parents[4]
doc = Path(__file__).resolve().parent


def aritmetica(node):
    if isinstance(node, ast.Expression):
        return aritmetica(node.body)
    if isinstance(node, ast.Constant) and isinstance(node.value, int):
        return Fraction(node.value)
    if isinstance(node, ast.BinOp):
        a, b = aritmetica(node.left), aritmetica(node.right)
        if isinstance(node.op, ast.Add):
            return a + b
        if isinstance(node.op, ast.Sub):
            return a - b
        if isinstance(node.op, ast.Mult):
            return a * b
        if isinstance(node.op, ast.Div):
            return a / b
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
        assert node.func.id in {'min', 'max'} and not node.keywords
        values = [aritmetica(a) for a in node.args]
        return min(values) if node.func.id == 'min' else max(values)
    raise AssertionError('Operación no permitida en oráculo independiente')


matrix = json.loads((doc / 'matriz-48.json').read_text())
rows = matrix['deducciones']
assert len(rows) == len({r['codigo'] for r in rows}) == 48
new = {r['codigo'] for r in rows if r['estado'] in {'calculo_por_hechos_preparado', 'dependencia_anual_preparada'}}
assert len(new) == 37
assert sum(r['estado'] == 'dependencia_anual_preparada' for r in rows) == 3
module = root / 'lib/dominio/irpf/deducciones/asturias-cantabria-ampliacion-2025'
actual = set(re.findall(r'case "([a-z_0-9]+)":', (module / 'index.ts').read_text()))
assert actual == new
for filename in ['familia.ts', 'vivienda.ts', 'trabajo.ts', 'inversion.ts']:
    declared = set(re.findall(r'case "([a-z_0-9]+)":', (module / filename).read_text()))
    assert declared <= new
assert set().union(*(set(re.findall(r'case "([a-z_0-9]+)":', (module / f).read_text())) for f in ['familia.ts', 'vivienda.ts', 'trabajo.ts', 'inversion.ts'])) == new
cases = json.loads((doc / 'oraculos-37.json').read_text())['casos']
assert len(cases) == len({c['codigo'] for c in cases}) == 37
assert {c['codigo'] for c in cases} == new
for c in cases:
    assert len(c['expresionIndependiente']) <= 200
    tree = ast.parse(c['expresionIndependiente'], mode='eval')
    assert len(list(ast.walk(tree))) <= 100
    assert aritmetica(tree) == Fraction(int(c['numeradorEsperado']), int(c['divisorEsperado'])), c['codigo']
tests = (root / 'tests/deducciones-asturias-cantabria-ampliacion-2025.test.ts').read_text()
assert all(re.search(r'codigo\s*:\s*"' + re.escape(c) + r'"', tests) for c in new)
# No imports operativos desde carpetas de entrega previas ni instalación local.
for p in list(module.glob('*.ts')) + list((root / 'tests').glob('*ampliacion*.ts')):
    for specifier in re.findall(r'from\s+["\']([^"\']+)["\']', p.read_text()):
        assert not specifier.startswith('/') and 'Backups' not in specifier, p
assert len(re.findall(r'"330\d{2}"', (module / 'territorio.ts').read_text())) == 53
manifest_path = root / 'MANIFIESTO.json'
if manifest_path.exists():
    manifest = json.loads(manifest_path.read_text())
    patch = []
    for item in manifest['archivosNuevos']:
        data = (root / item['ruta']).read_bytes()
        assert item['preSHA256'] is None
        assert hashlib.sha256(data).hexdigest() == item['postSHA256'], item['ruta']
        assert len(data) == item['bytes']
        patch.extend(difflib.unified_diff([], data.decode().splitlines(True), fromfile='/dev/null', tofile='b/' + item['ruta']))
    expected = ''.join(patch).encode()
    assert (root / 'entrega.patch').read_bytes() == expected
    assert hashlib.sha256(expected).hexdigest() == manifest['parche']['sha256']
    for item in manifest.get('validacionPrivada', []):
        assert hashlib.sha256((root / item['ruta']).read_bytes()).hexdigest() == item['sha256']
print('OK ligero: matriz48, ramas37, dependencias3, oráculos racionales37, concejos53, imports portables y transporte sellado si hay manifiesto')
if manifest_path.exists() and 'oraculosConservados' in manifest:
    proof = manifest['oraculosConservados']
    assert proof['sha256Antes'] == proof['sha256Despues'] == hashlib.sha256((root / proof['ruta']).read_bytes()).hexdigest()
    assert len(json.loads((root / proof['ruta']).read_text())['casos']) == 37
print('Validación técnica de autor documentada por separado;sin inventario ni CI global y sin certificación de derechos particulares.')
