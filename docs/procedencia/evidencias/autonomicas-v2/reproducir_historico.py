"""Reextracción independiente; solo escribe la carpeta de esta revisión."""
import gzip
import hashlib
import json
import re
import subprocess
import sys
from decimal import Decimal
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent / 'historico'
E = ROOT / 'docs/procedencia/evidencias/autonomicas'
BASE = 'ed6a43fd750de05609abc3710dabdc2f8261020c'
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
import corpus  # noqa: E402


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(path):
    return json.loads(Path(path).read_text())


def write(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def historical(path):
    return subprocess.check_output(['git', 'show', f'{BASE}:{path}'], cwd=ROOT)


def refcheck(ref):
    return sha((ROOT / ref['path']).read_bytes()) == ref['sha256']


def number(text):
    return Decimal(text.strip().replace('.', '').replace(',', '.'))


coverage = read(E / 'cobertura.json')
manifest_bytes = historical('docs/procedencia/inventario.json')
archive = historical('docs/procedencia/inventario-datos.json.gz')
assert sha(manifest_bytes) == coverage['inventory']['manifestSha256'] == '6872a5fb9315a4e970c5da7fb3d8ad58f2ebf74b3d84fe07101b90cb8c58564d'
assert sha(archive) == coverage['inventory']['artifactSha256'] == '29fb5e311f33982395227b15f2e08705e2943bf5ea21409702f48dd8ba4e613c'
files = dict(json.loads(gzip.decompress(archive)))
items: dict[str, Any] = {}
for name, content in files.items():
    if name.startswith('inventario-pagina-'):
        items.update((item['id'], item) for item in json.loads(content))
print('Inventario histórico:', len(items), flush=True)

wanted = {p.stem for p in (E / 'documentos').glob('*.json')}
originals: dict[str, Path] = {}
for p in Path('/home/elies/Repos/IRoboPF/.cache/procedencia').rglob('*'):
    if p.name in wanted and p.is_file() and sha(p.read_bytes()) == p.name:
        originals.setdefault(p.name, p)
assert set(originals) == wanted
pdfs = {}
document_results = []
for h, path in originals.items():
    record = read(E / 'documentos' / f'{h}.json')
    raw = path.read_bytes()
    assert len(raw) == record['size']
    assert hashlib.sha512(raw).hexdigest() == record['sha512']
    pdfs[h] = corpus.mupdf().open(path)
    document_results.append({'sha256': h, 'path': str(path), 'size': len(raw), 'integridad': True,
                             'autenticidad': 'no revalidada'})
write('originales.json', document_results)

cells = read(E / 'citas-celdas.json')
cell_results = []
for c in cells:
    page = pdfs[c['documentSha256']][c['page'] - 1]
    text = page.get_text('text', clip=c['bbox'], flags=0, sort=False)
    header = page.get_text('text', clip=c['header']['bbox'], flags=0, sort=False)
    checks = {'texto': text == c['quote'], 'cabecera': header == c['header']['quote'],
              'unidadEUR': 'euros' in header.lower(), 'numero': number(text) == Decimal(c['value']),
              'documento': refcheck(c['document']), 'cita': refcheck(c['citation'])}
    cell_results.append({'id': c['id'], 'checks': checks, 'decision': 'reextraida' if all(checks.values()) else 'requiere-cambios',
                         'documentSha256': c['documentSha256'], 'page': c['page'], 'bbox': c['bbox'],
                         'quote': text, 'header': {'bbox': c['header']['bbox'], 'quote': header},
                         'row': c['row'], 'column': c['column'], 'value': c['value'], 'aceptacionFiscal': False})
write('selecciones.json', cell_results)

citation_results = []
crops = {}
for path in sorted((E / 'citas').glob('*.json')):
    c = read(path)
    page = pdfs[c['documentSha256']][c['page'] - 1]
    text = page.get_text('text', clip=c['bbox'], flags=0, sort=False)
    key = c['facsimile']['sha256']
    if key not in crops:
        png = page.get_pixmap(dpi=144, clip=c['bbox'], colorspace=corpus.mupdf().csRGB,
                             alpha=False, annots=False).tobytes('png')
        crops[key] = {'id': key, 'regeneradoSha256': sha(png), 'archivoSha256': sha((E / 'recortes' / f'{key}.png').read_bytes()),
                      'decision': 'reproducido' if sha(png) == key else 'requiere-cambios',
                      'documentSha256': c['documentSha256'], 'page': c['page'], 'bbox': c['bbox']}
    checks = {'texto': text == c['quote'], 'geometria': corpus.geometry(page) == c['geometry'],
              'selectores': corpus.selectors(c['page'], c['bbox'], text) == c['selectors'],
              'receta': corpus.renderer() == c['facsimile']['parameters'],
              'png': crops[key]['regeneradoSha256'] == key}
    corpus.validate_schema(c, 'citation')
    if c['engineBinding']:
        checks['bindingLiteral'] = corpus.verify_binding(text, c['engineBinding'])
    citation_results.append({'id': path.stem, 'checks': checks, 'quote': text,
                             'decision': 'integridad-verificada' if all(checks.values()) else 'requiere-cambios',
                             'binding': 'literal-verificado' if c['engineBinding'] else 'ausente', 'aceptacionFiscal': False})
write('citas.json', citation_results)
write('recortes.json', list(crops.values()))
print('Reextraídas:', len(cells), len(citation_results), 'PNG:', len(crops), flush=True)

matrix_results = []
review_cache = {}
for m in read(E / 'matriz-revisiones.json'):
    path = m['review']['path']
    if path not in review_cache:
        review_cache[path] = {r['id']: r for r in read(ROOT / path)}
    r = review_cache[path][m['id']]
    checks = {'hash': refcheck(m['review']), 'decision': m['priorDecision'] == r.get('decision', r.get('status')),
              'alcance': m['scope'] == r.get('acceptanceScope'), 'sinPromocion': m['thisDelivery'] == 'candidate-only-no-promotion'}
    matrix_results.append({'id': m['id'], 'review': m['review'], 'checks': checks,
                           'decision': 'conservar-alcance-previo' if all(checks.values()) else 'requiere-cambios',
                           'priorDecision': m['priorDecision'], 'scope': m['scope'], 'aceptacionNueva': False})
write('decisiones-previas.json', matrix_results)

payload_results = []
for path in sorted((E / 'payloads').glob('*.json')):
    p = read(path)
    corpus.validate_schema(p, 'binding-payload')
    item = items[p['itemId']]
    c = read(ROOT / p['citation']['path'])
    source = historical(p['source']['file'])
    row = int(c['table']['row'])
    table_path = p['source']['tablePath']
    r = review_cache[p['legalReview']['decisions']['path']][p['legalReview']['decisionId']]
    checks = {'inventario': p['inventory'] == coverage['inventory'], 'effective': item['layer'] == 'effective',
              'fuente': sha(source) == p['source']['sha256'] == item['source']['sha256'],
              'simbolo': p['source']['symbol'] == item['symbol'], 'ruta': table_path == json.loads(item['path']),
              'cita': refcheck(p['citation']), 'documento': refcheck(p['document']),
              'valor': Decimal(c['engineBinding']['value']) == Decimal(item['value']),
              'filaSiguiente': int(table_path[-2]) == row - 2 and table_path[-1] == '0',
              'territorio': table_path[0] == p['scope']['territory'],
              'revision': refcheck(p['legalReview']['decisions']), 'noReglaCompleta': p['scope']['completeRule'] is False}
    payload_results.append({'id': p['id'], 'itemId': p['itemId'], 'checks': checks,
                            'decision': 'coincidencia-historica-candidata' if all(checks.values()) else 'requiere-cambios',
                            'scope': p['scope'], 'source': p['source'], 'legalDecisionId': r['id'],
                            'legalStatusField': r.get('status'), 'legalDecisionField': r.get('decision'),
                            'bloqueos': ['contrato-decision-status', 'registro-CAS', 'revision-individual-del-binding', 'no-es-helper-canonico'],
                            'aceptacionFiscal': False})
write('payloads.json', payload_results)

by_cell = {c['id']: c for c in cell_results}
annual = []
helper_source = historical('lib/dominio/irpf/cuotas/escalas-publicadas.ts').decode()
for e in coverage['entries']:
    c = by_cell[e['citationId']]
    helper = e['helper']
    symbol = helper['symbol']
    effective = [i['id'] for i in items.values() if i['layer'] == 'effective' and i['symbol'] == symbol]
    checks = {'valor': Decimal(e['value']) == Decimal(c['value']), 'celda': all(c['checks'].values()),
              'helperHash': sha(helper_source.encode()) == helper['sha256'],
              'sinHojaEfectiva': not effective, 'bloqueoCanonico': e['canonicalHelperBinding'] == 'blocked-no-effective-occurrence'}
    locations = []
    for loc in e.get('syntacticLocations', []):
        item = items[loc['id']]
        s = loc['source']
        fragment = helper_source.encode('utf-16-le')[s['start']*2:s['end']*2].decode('utf-16-le')
        locations.append({'id': loc['id'], 'fragment': fragment, 'source': s,
                          'identidad': item['source'] == s and item['symbol'] == symbol and item['path'] == loc['path']})
    checks['localizadores'] = all(x['identidad'] for x in locations)
    annual.append({'id': f"{e['territory']}-{e['year']}-f{e['row']}-{e['field']}",
                   'checks': checks, 'decision': 'documentada-sin-binding-canonico' if all(checks.values()) else 'requiere-cambios',
                   'year': e['year'], 'territory': e['territory'], 'citationId': e['citationId'], 'value': e['value'],
                   'helper': helper, 'syntacticLocations': locations, 'payloads': e['payloads'], 'aceptacionFiscal': False})
write('celdas-anuales.json', annual)

cases = []
for value in ['59999.99', '60000', '60000.01', '100000']:
    b = Decimal(value)
    literal = Decimal('8716.67') + (b-60000)*Decimal('.227') if b > 60000 else Decimal('4142.62') + (b-35394)*Decimal('.1822')
    inclusive = Decimal('8716.67') + (b-60000)*Decimal('.227') if b >= 60000 else Decimal('4142.62') + (b-35394)*Decimal('.1822')
    cases.append({'base': value, 'clausulaEstricta': str(literal), 'mutanteInclusivo': str(inclusive),
                  'equivalentes': literal == inclusive})
write('murcia-frontera.json', cases)
summary: dict[str, Any] = {name: {'total': len(rows), 'fallos': [r['id'] for r in rows if not all(r['checks'].values())]}
           for name, rows in [('selecciones', cell_results), ('citas', citation_results), ('previas', matrix_results), ('payloads', payload_results), ('anuales', annual)]}
summary['png'] = len(crops)
summary['aceptacionesFiscales'] = 0
write('resultado.json', summary)
print(json.dumps(summary, ensure_ascii=False), flush=True)

# Refinar por estructura, nunca por el primer literal de igual valor.
refined = []
for e in annual:
    helper = e['helper']
    symbol = helper['symbol']
    field = e['id'].rsplit('-', 1)[1]
    block = helper_source.split('const ' + symbol, 1)[1].split('\nconst ', 1)[0]
    tuples = list(re.finditer(r'\["([0-9.]+)", "([0-9.]+)", "([0-9.]+)"\]', block))
    row = helper['rowIndex']
    if row < len(tuples):
        expected = Decimal(tuples[row].group(1 if field == 'baseInferior' else 2))
        prefix = helper_source.index('const ' + symbol) + len('const ' + symbol)
        offset = prefix + tuples[row].start(1 if field == 'baseInferior' else 2) - 1
        utf16 = len(helper_source[:offset].encode('utf-16-le')) // 2
        exact = [x for x in e['syntacticLocations'] if x['source']['start'] == utf16]
    else:
        expected = Decimal('60000' if field == 'baseInferior' else '8716.67')
        exact = [x for x in e['syntacticLocations'] if f'PropertyAssignment:{field}' in items[x['id']]['path']]
    refined.append({'id': e['id'], 'valorHelperCoincide': expected == Decimal(e['value']),
                    'localizadoresOriginales': len(e['syntacticLocations']), 'localizadoresExactos': exact,
                    'decision': 'refinar-localizador' if len(e['syntacticLocations']) != 1 else 'localizador-univoco',
                    'bindingEfectivo': False})
write('localizadores-refinados.json', refined)

inputs = json.loads(manifest_bytes)['generationInputs']
write('contexto-historico.json', {
    'baseRevision': 'eaed990c620b5fc4d3ff2e74dc68e0c8481c43db', 'baseCandidatos': BASE,
    'snapshot': coverage['snapshot'], 'inventory': coverage['inventory'],
    'generationInputs': [{'file': i['file'], 'hashCoincide': sha(historical(i['file'])) == i['sha256']} for i in inputs],
    'manifiestoEntrega': [{'path': f['path'], 'sha256Coincide': sha((ROOT / f['path']).read_bytes()) == f['sha256'],
                           'sizeCoincide': (ROOT / f['path']).stat().st_size == f['size']} for f in read(E / 'manifiesto.json')['files']]})
print('Localizadores ambiguos:', sum(len(e['syntacticLocations']) != 1 for e in annual), flush=True)
