"""Adversos sintéticos. Ejecutar desde la raíz con REVIEW_TMP externo.

Dependencias: jsonschema==4.26.0 y markdown-it-py==4.0.0.
El argumento opcional selecciona un verificador exportado en scratch.
Solo se imprimen IDs, decisiones y contadores, nunca valores recibidos.
"""
import copy
import importlib.util
from pathlib import Path
import sys
from urllib.parse import parse_qsl, urlsplit

from markdown_it import MarkdownIt

sys.dont_write_bytecode = True
ROOT = Path.cwd()


def cargar(nombre, ruta):
    spec = importlib.util.spec_from_file_location(nombre, ruta)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo


revision = cargar('fixtures_revision', ROOT / 'docs/procedencia/deducciones-2025/revisiones/contrato/casos.py')
v = cargar('verificador_revisado', Path(sys.argv[1]) if len(sys.argv) > 1 else
           ROOT / 'scripts/procedencia/deducciones-2025/verificar.py')
fixture = revision.Contrato()
fixture.setUp()
parser = MarkdownIt('commonmark')
SENSIBLES = {'token', 'session', 'key', 'auth', 'signature'}
SEGUROS = {'URL con credenciales', 'URL pública inválida: credenciales'}


def destinos(texto):
    pendientes = list(parser.parse(texto))
    resultado = []
    while pendientes:
        token = pendientes.pop()
        pendientes.extend(token.children or [])
        if token.type in ('link_open', 'image'):
            resultado.append(token.attrGet('href' if token.type == 'link_open' else 'src'))
    return resultado


def sensible(url):
    u = urlsplit(url)
    return bool(u.username is not None or u.password is not None or
                {k.casefold() for k, _ in parse_qsl(u.query, keep_blank_values=True)} & SENSIBLES)


casos = []
formas = (
    ('angular', '[n](<https://example.invalid/a)?{q}>)'),
    ('escape', r'[n](https://example.invalid/a\)?{q})'),
    ('entidad-esquema', '[n](https&#58;//example.invalid/a?{q})'),
    ('entidad-query', '[n](https://example.invalid/a&#63;{q})'),
    ('entidad-amp', '[n](https://example.invalid/a?id=ley&amp;{q})'),
    ('referencia', '[n][r]\n\n[r]: <https://example.invalid/a)?{q}> "Título"'),
    ('referencia-colapsada', '[r][]\n\n[r]: https://example.invalid/a?{q}'),
    ('referencia-corta', '[r]\n\n[r]: https://example.invalid/a?{q}'),
    ('imagen', '![n](https://example.invalid/a?{q})'),
    ('imagen-referencia', '![r][]\n\n[r]: <https://example.invalid/a)?{q}>'),
    ('escape-amp', r'[n](https://example.invalid/a?id=ley\&{q})'),
)
for ident, forma in formas:
    for i, query in enumerate(('session', '%54OKEN=', 'k%65y=', 'aUtH', 'signature=')):
        casos.append((f'M-{ident}-{i}', forma.format(q=query), False, True))
for i, query in enumerate(('&#115;ession', '&#x74;oken=', 'key&#61;', 'a&#117;th', 'signat&#117;re=')):
    casos.append((f'M-entidad-nombre-{i}', f'![n](https://example.invalid/a?{query})', False, True))
for i, texto in enumerate((
    '[n](https://example.invalid/a?session=MARCADOR_SINTETICO)',
    '[n](https://example.invalid/a?id=ley&%73ession=MARCADOR_SINTETICO)',
    '[n](https://usuario:MARCADOR_SINTETICO@example.invalid/a)',
    '[n](https://example.invalid/a?session) y ![n](https://example.invalid/a?id=ley)',
)):
    casos.append((f'M-diagnostico-{i}', texto, False, True))
for ident, forma in formas:
    casos.append((f'C-{ident}', forma.format(q='id=ley'), True, False))
for i, texto in enumerate((
    r'[n](https://example.invalid/a?se\ssion)',
    '[n](https://example.invalid/a?id=&#115;ession)',
    '[n](https://example.invalid/a?session%3Dx=ley)',
    '[n](https://example.invalid/a%3Fsession)',
    '[n](https://example.invalid/a?%2574oken=ley)',
    '[n](https://example.invalid/a?tokenizacion=ley)',
    '[n](https://example.invalid/a?ses+sion=ley)',
    '[n](https://example.invalid/a?session&#35;id)',
    'Los nombres token, session, auth y key se describen en texto.',
)):
    # El fragmento tras # no forma parte del nombre de query: session sí lo es.
    esperado = i != 7
    casos.append((f'C-semantic-{i}', texto, esperado, not esperado))
fallos = 0
for ident, texto, admitir, sensible_esperado in casos:
    urls = destinos(texto)
    oraculo = any(sensible(url) for url in urls)
    if oraculo != sensible_esperado or (ident.startswith('M-') and not urls):
        print(ident, 'FALLO_ORACULO')
        fallos += 1
        continue
    paquete = copy.deepcopy(fixture.paquetes[0])
    paquete['dictamenes']['deducciones'][0]['vigencia']['reservaURL'] = texto
    seguro = True
    try:
        v.verificar_paquetes(revision.CENSO, [paquete], 'parcial')
        observado = True
    except ValueError as error:
        observado = False
        seguro = str(error) in SEGUROS
    ok = observado == admitir and seguro
    fallos += not ok
    print(ident, 'admitir' if observado else 'rechazar', 'OK' if ok else 'FALLO')
print(f'Casos: {len(casos)}; fallos: {fallos}')
raise SystemExit(bool(fallos))
