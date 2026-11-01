"""Contraste acotado, sin descargas ni escritura de fixtures.

Ejecutar desde la raíz con jsonschema==4.26.0. El argumento opcional es la
ruta de un verificador exportado en scratch. Solo imprime IDs y resultados.
"""
import copy
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[5]
script = (Path(sys.argv[1]) if len(sys.argv) > 1 else
          ROOT / 'scripts/procedencia/deducciones-2025/verificar.py')
spec = importlib.util.spec_from_file_location('verificador', script)
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)
p = ROOT / 'docs/procedencia/deducciones-2025'
censo = json.loads((p / 'censo.json').read_text())
base = {k: json.loads((p / f'lotes/a/{k}.json').read_text())
        for k in ('dictamenes', 'fuentes')}
cases = []
for i, query in enumerate(('%54OKEN', 'session', 'key=', 'auth=', 'signature=')):
    url = 'https://example.invalid/norma?' + query
    for kind, text in (
        ('directo', url), ('markdown', f'Documento: [norma]({url})'),
        ('puntuacion', f'Consultar [norma]({url}).'),
        ('adyacente', f'[otra](https://example.invalid/ley)[norma]({url})'),
        ('balanceado', f'[norma](https://example.invalid/articulo(2)?{query})'),
    ):
        cases.append((f'sensible-{i}-{kind}', text, False))

for i, text in enumerate((
    '[norma](https://example.invalid/articulo(2)?id=ley).',
    '[uno](https://example.invalid/1)[dos](https://example.invalid/2)',
    'https://www.boe.es/buscar/doc.php?id=BOE-A-2025-1',
    '[norma](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-1).',
    '[norma](https://example.invalid/articulo(2)?id=%54OKEN)',
    'La documentación describe los parámetros token, session y key.',
    '[norma](https://example.invalid/norma?tokenizacion=publica)',
)):
    cases.append((f'inocuo-{i}', text, True))

# Destinos Markdown válidos: <...> permite paréntesis sin balancear;
# la barra inversa escapa el cierre dentro de un destino sin <...>.
for i, query in enumerate(('session', '%54OKEN=')):
    for kind, text in (
        ('angular', f'[norma](<https://example.invalid/articulo)?{query}>)'),
        ('escapado', f'[norma](https://example.invalid/articulo\\)?{query})'),
    ):
        cases.append((f'limite-{i}-{kind}', text, False))

failures = 0
for ident, text, expected in cases:
    paquete = copy.deepcopy(base)
    paquete['dictamenes']['deducciones'][0]['vigencia']['reservaURL'] = text
    diagnostic = True
    try:
        v.verificar_paquetes(censo, [paquete], 'parcial')
        observed = True
    except ValueError as error:
        observed = False
        # Lista cerrada: nunca publicar el mensaje recibido en caso de fallo.
        diagnostic = str(error) in (
            'URL con credenciales', 'URL pública inválida: credenciales')
    ok = observed == expected and diagnostic
    failures += not ok
    print(ident, 'esperado=' + ('admitir' if expected else 'rechazar'),
          'observado=' + ('admitir' if observed else 'rechazar'),
          'diagnostico=' + ('seguro' if diagnostic else 'inesperado'),
          'OK' if ok else 'FALLO')
print(f'Casos: {len(cases)}; fallos: {failures}')
raise SystemExit(bool(failures))
