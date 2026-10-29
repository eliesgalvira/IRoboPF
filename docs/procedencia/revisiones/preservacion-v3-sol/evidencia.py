"""Contraste documental del corte, sin red ni modificar entregas ajenas."""
import copy
import re

from auditar import OUT, ROOT, V3, facts, read, save

m = read(V3 / 'manifest.json')
t = read(V3 / 'transporte-v2.json')
baseline = read(ROOT / 'docs/procedencia/preservacion/manifest-v2.json')
a, b = copy.deepcopy(t), copy.deepcopy(baseline)
for value in (a, b):
    for obj in value['blobs']:
        obj['sources'] = []
assert a == b
assert facts(ROOT / 'docs/procedencia/preservacion/manifest-v2.json') == m['baseline']
classes: dict[str, list[str]] = {}
for obj in m['annex']:
    classes.setdefault(obj['class'], []).append(obj['sha256'])
    if obj['class'] == 'documento-primario-candidato':
        assert all('web.archive.org' not in e['finalUrl'] for e in obj['acquisitions'])
    if obj['class'] == 'captura-secundaria-URL-oficial':
        assert any('web.archive.org' in e['finalUrl'] for e in obj['acquisitions'])
path_pattern = re.compile(r'^(?!/)(?!.*(?:^|/)\.\.(?:/|$))[^\\\x00-\x1f\x7f]+$')
assert all(path_pattern.fullmatch(d['path']) for d in m['dependencies'])
assert len({d['path'] for d in m['dependencies']}) == len(m['dependencies'])
inputs = [ROOT / path for path in [
    'tools/procedencia/preservacion.py', 'tools/procedencia/preservacion_urls.py',
    'tools/procedencia/preservacion.schema.json', 'tests/procedencia-preservacion_test.py',
    'docs/procedencia/preservacion-v3/recolector.py', 'docs/procedencia/preservacion-v3/manifest.json',
    'docs/procedencia/preservacion-v3/transporte-v2.json',
    'docs/procedencia/correcciones/cambio-modelo-sol/recepcion.json',
    'docs/procedencia/correcciones/integracion-r19/recepcion.json',
    'docs/procedencia/correcciones/integracion-r19/recepcion-editoriales.json',
    'docs/procedencia/correcciones/integracion-r19/cas-retenciones.json']]
save('fuentes.json', [dict(path=str(path), **facts(path)) for path in inputs])
# Se recorren íntegros los recibos terminados; no se accede a sus worktrees.
receipts = {str(path): read(path) for path in inputs if path.name.startswith('recepcion')}
save('recibos-estructura.json', {path: dict(topType=type(value).__name__, bytes=(ROOT / path).stat().st_size) for path, value in receipts.items()})
save('contraste-documental.json', dict(transportEqualsHistoricalExceptSources=True, baselinePinVerified=True, classes=classes, relativeUniqueDependencies=True))
print('Transporte histórico idéntico salvo sources; baseline y clasificación real correctos')
# Las 16 reglas siguen a error, sin escribir TypeScript/Effect.
config = read(ROOT / '.oxlintrc.json')
rules = {k: v for k, v in config['rules'].items() if k.startswith(('anti-slop/', 'anti-slop-effect/'))}
assert len(rules) == 16 and set(rules.values()) == {'error'}
save('anti-slop.json', dict(rules=rules, configuration=facts(ROOT / '.oxlintrc.json'), typescriptChanged=False))
print('16 reglas anti-slop a error; sin TypeScript propio')
print('Salida', OUT)
posterior = read(OUT / 'posteriores.json')
rows = posterior['objects']
sources = sorted({source for obj in rows for source in obj['sources']})
save('posteriores-resumen.json', dict(unique=len(rows), bytes=sum(o['size'] for o in rows),
    unresolved=len(posterior['unresolved']), batches={source: dict(
        objects=sum(source in o['sources'] for o in rows),
        bytes=sum(o['size'] for o in rows if source in o['sources'])) for source in sources},
    warning='Los lotes pueden solaparse: no sumar sus recuentos.'))
