"""Revisión de celdas estatales; ejecuta desde la raíz fijada, sin editar lotes."""
import copy
import gzip
import hashlib
import json
import re
import subprocess
import sys
from decimal import Decimal
from pathlib import Path

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
SCRATCH = ROOT / '.cache/revision-estatales-v2'
BASE = '5799bb03826719a4dd3500a962e2d6bb5124fdca'
E = ROOT / 'docs/procedencia/evidencias'
CAS = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256')
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
import pymupdf  # noqa: E402
from corpus import validate_schema, verify_binding  # noqa: E402
from enlaces import location_matches, select_decision  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path):
    return json.loads(path.read_bytes())


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def ref(path):
    return {'path': str(path.relative_to(ROOT)), 'sha256': sha(path.read_bytes())}


def checked_ref(value):
    path = ROOT / value['path']
    assert sha(path.read_bytes()) == value['sha256']
    return read(path)


def items(pin):
    objects = ROOT / 'docs/procedencia/implementaciones/contenidos/datos/objetos'
    for h in pin.values():
        assert sha((objects / h).read_bytes()) == h
    raw = (objects / pin['artifactSha256']).read_bytes()
    return {i['id']: i for name, data in json.loads(gzip.decompress(raw))
            if name.startswith('inventario-pagina-') for i in json.loads(data)}


def main():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
    pin = {'manifestSha256': 'ff58be7c8b497d2b38ad7019afb85e2e621296108eeae85163ad2319c9c9d397',
           'artifactSha256': 'ae25e219e75593d7a0d408e325db872faca31261ded79a2115a563536073b3d0'}
    current = items(pin)
    assert sha((ROOT / 'docs/procedencia/inventario.json').read_bytes()) == pin['manifestSha256']
    index = read(E / 'estatales/citas-indice.json')
    docs = {read(p)['sha256']: read(p) for p in (E / 'estatales/documentos').glob('*.json')}
    for h, d in docs.items():
        raw = (CAS / h).read_bytes()
        assert sha(raw) == h and hashlib.sha512(raw).hexdigest() == d['sha512'] and len(raw) == d['size']
        validate_schema(d, 'document')
    # Reextraer todas las citas sin reutilizar el texto del informe anterior.
    paths = sorted((E / 'estatales/citas').glob('*.json')) + [ROOT / r['path'] for r in read(E / 'estatales/contextos.json')]
    results = []
    pages = {}
    for path in paths:
        c = read(path)
        validate_schema(c, 'citation')
        with pymupdf.open(CAS / c['documentSha256']) as pdf:
            page = pdf[c['page'] - 1]
            text = page.get_text('text', clip=pymupdf.Rect(c['bbox']), flags=0, sort=False)
            assert text == c['quote']
            assert list(page.mediabox) == c['geometry']['mediaBox']
            assert list(page.cropbox) == c['geometry']['cropBox'] and page.rotation == c['geometry']['rotation']
            words = page.get_text('words', flags=0, sort=False)
            key = (c['documentSha256'], c['page'])
            if key not in pages:
                png = page.get_pixmap(dpi=144, clip=pymupdf.Rect(c['bbox']), colorspace=pymupdf.csRGB, alpha=False, annots=False).tobytes('png')
                assert sha(png) == c['facsimile']['sha256']
                assert png == (E / 'estatales/recortes' / (sha(png) + '.png')).read_bytes()
                assert png == (E / 'estatales-v2/cas/sha256' / sha(png)).read_bytes()
                (SCRATCH / (sha(png)+'.png')).write_bytes(png)
                pages[key] = {'documentSha256': key[0], 'page': key[1], 'bbox': c['bbox'], 'quote': text, 'facsimileSha256': sha(png)}
            if c['engineBinding']:
                verify_binding(text, c['engineBinding'])
                assert any(list(w[:4]) == index[path.stem]['cellBBox'] and w[4] == c['engineBinding']['number']['literal'] for w in words)
            results.append({'citation': ref(path), 'text': 'exact', 'geometry': 'exact', 'facsimileSha256': c['facsimile']['sha256']})
    assert len(results) == 83 and len(pages) == 13
    write('reextraccion-83.json', results)
    write('citas-propias-pasajes.json', list(pages.values()))
    units = read(E / 'estatales-v2/unidades-geometricas-26.json')
    for u in units:
        c = checked_ref(u['citation'])
        validate_schema(c, 'citation')
        with pymupdf.open(CAS / u['documentSha256']) as pdf:
            page = pdf[u['page']-1]
            text = page.get_text('text', clip=pymupdf.Rect(c['bbox']), flags=0, sort=False)
            assert text == c['quote']
            verify_binding(text, c['engineBinding'])
            words = page.get_text('words', flags=0, sort=False)
            header = ' '.join(w[4] for w in words if pymupdf.Rect(u['headerBBox']).contains(pymupdf.Rect(w[:4])))
            assert header == u['headerLiteral']
            assert any(list(w[:4]) == u['cellBBox'] and w[4] == c['engineBinding']['number']['literal'] for w in words)
            assert u['headerBBox'][3] < u['cellBBox'][1]
            assert abs((u['headerBBox'][0]+u['headerBBox'][2]-u['cellBBox'][0]-u['cellBBox'][2])/2) < 55
            assert u['newUnit'] == c['engineBinding']['unit'] and u['oldUnit'] != u['newUnit']
    assert len(units) == 26
    write('cabeceras-26.json', units)
    composite = read(E / 'estatales-v2/contexto-compuesto.json')
    context = [checked_ref(r) for r in composite['orderedPassages']]
    assert [c['page'] for c in context] == [62, 63]
    for c in context:
        assert c['documentSha256'] == composite['documentSha256']
        assert c['quote'] == pages[(c['documentSha256'], c['page'])]['quote']
    write('contexto-compuesto-revisado.json', {'relation': composite, 'result': 'Pasajes ordenados y reextraídos; sujeto en p62 continúa en p63. No acepta elegibilidad.', 'completeRuleAcceptance': False})
    # Historia: nueva comprobación de cada identidad y sus fuentes de época.
    historical = items(read(E / 'estatales/cobertura.json')['inventory'])
    hist = []
    source_cache = {}
    for pth in sorted((E / 'estatales/payloads').glob('*.json')):
        p = read(pth)
        i = historical[p['itemId']]
        s = p['source']
        assert i['layer'] == 'effective' and i['source']['file'] == s['file'] and i['source']['sha256'] == s['sha256']
        assert i['symbol'] == s['symbol'] and json.loads(i['path']) == s['tablePath']
        if s['file'] not in source_cache:
            source_cache[s['file']] = subprocess.check_output(['git', 'show', 'ed6a43fd750de05609abc3710dabdc2f8261020c:'+s['file']])
        assert sha(source_cache[s['file']]) == s['sha256']
        c = checked_ref(p['citation'])
        d = checked_ref(p['document'])
        assert c['documentSha256'] == d['sha256']
        assert Decimal(i['value']) == Decimal(c['engineBinding']['value'])
        assert p['scope']['unit'] == c['engineBinding']['unitCode']
        inventory_unit = i['unit']
        hist.append({'id': p['id'], 'payloadSha256': sha(pth.read_bytes()), 'year': p['scope']['year'], 'source': s, 'value': i['value'], 'unit': p['scope']['unit'], 'historicalInventoryUnit': inventory_unit, 'historicalEquality': True, 'currentAcceptance': False,
                     'reason': 'Correspondencia histórica. Los alias de mínimos requieren continuidad normativa por ejercicio; metadatos legacy no acreditan helper canónico.'})
    assert len(hist) == 319
    write('correspondencias-historicas-319.json', hist)
    decisions = []
    mapping = []
    discriminants = []
    source = (ROOT / 'lib/dominio/irpf/cuotas/escalas-publicadas.ts').read_text()
    for pth in sorted((E / 'propuestas-r12/estatales').glob('*.json')):
        p = read(pth)
        validate_schema(p, 'binding-payload')
        i = current[p['itemId']]
        s = p['source']
        assert p['inventory'] == pin
        assert i['layer'] == 'effective' and i['source']['file'] == s['file'] and i['source']['sha256'] == s['sha256']
        assert sha((ROOT / s['file']).read_bytes()) == s['sha256']
        assert i['symbol'] == s['symbol'] and json.loads(i['path']) == s['tablePath']
        assert p['scope']['year'] in i['years'] and p['scope']['territory'] == 'estatal-comun' and 'estatal-comun' in i['territories']
        c = checked_ref(p['citation'])
        d = checked_ref(p['document'])
        assert c['documentSha256'] == d['sha256']
        assert Decimal(i['value']) == Decimal(c['engineBinding']['value']) and i['unit'] == p['scope']['unit'] == 'EUR'
        row, col = s['tablePath']
        assert col in ('baseInferior', 'cuota') and c['table']['column'] == col
        component = 'ordinaria' if s['symbol'] == 'ESTATAL_ORDINARIA_2012_2014' else 'complementaria'
        assert s['symbol'] in ('ESTATAL_ORDINARIA_2012_2014', 'ESTATAL_COMPLEMENTARIA_2012_2014')
        assert c['table']['row'] == f'escala-{component}-{row}-{col}'
        block = source.split('export const '+s['symbol']+' = filas([')[1].split('])')[0]
        rows = re.findall(r'\["([0-9.]+)", "([0-9.]+)", "([0-9.]+)"\]', block)
        assert Decimal(rows[int(row)][0 if col == 'baseInferior' else 1]) == Decimal(i['value'])
        line = source[:source.index('export const '+s['symbol'])].count('\n') + 2 + int(row)
        symbol = s['symbol']+'['+row+'].'+col
        year = p['scope']['year']
        identifier = f'ESTV2-{year}-{component}-{row}-{col}'
        reason = ('Ley 39/2010 art. 62.Uno, p63: art. 63.1 LIRPF, efectos 2011 y vigencia indefinida. Cadena de modificaciones consultada: siguiente sustitución por Ley 26/2014 art. 1.39, efectos 2015.' if component == 'ordinaria' else
                  'RDL 20/2011 DF segunda.Primero, DA35.1.a LIRPF, p53: ejercicios 2012 y 2013; cuantía adicional de base general, distinta de ahorro y retención.')
        if component == 'complementaria' and year == 2014:
            reason += ' Ley 22/2013 art. 64.Uno, pp75–76, extiende expresamente a 2014 y reproduce las siete filas. Errata BOE-A-2014-2109 no cambia art. 64.'
        if component == 'complementaria':
            reason += ' Ley 2/2012 art. 61 vuelve a añadir DA35 con efectos 2012 y las mismas celdas. Errata BOE-A-2012-352: cambia el título y aspectos editoriales de DF segunda y el rendimiento cedido de DA12, sin alterar las celdas DA35.1.a.'
        citations = [p['citation']]
        if component == 'complementaria' and year == 2014:
            citations += read(E / 'estatales/contextos.json')
        decision = {'id': identifier, 'status': 'accepted', 'reviewer': 'Codex, hilo T3 t3-803d665c, agente /root de esta revisión',
                    'engineLocations': [{'path': s['file'], 'symbol': symbol, 'sha256': s['sha256'], 'line': line}],
                    'year': year, 'territory': 'estatal-comun', 'table': s['symbol'], 'row': int(row), 'column': col, 'value': i['value'], 'unit': 'EUR',
                    'motivos': reason, 'conditions': ['Aceptación limitada a cuantía nominal de esta celda y ejercicio, componente estatal de base general.', 'No acepta base del ahorro, retenciones, componente autonómico, régimen foral ni declaración completa.', 'La cuota tabulada es publicada: no sustituirla por integral de tipos.', 'Elegibilidad, minoración por mínimos, anualidades, selección del caso y redondeo final quedan fuera.'],
                    'citations': citations, 'chainEvidence': 'cadena-normativa.json',
                    'objection': 'La igualdad decimal y un territorio técnico no prueban vigencia; una tabla de retención repite las cifras y es otro supuesto.',
                    'cost': 'Decisión individual por año/celda; el padre debe preparar payload nuevo y pedir revisión exacta, sin migrar atestaciones.',
                    'integrity': 'verified', 'authenticity': 'not-validated', 'interpretation': 'accepted-limited', 'numericAccuracy': 'verified-fixed-artifact-and-current-source',
                    'bindingReview': 'pending-new-payload', 'completeRuleAcceptance': False}
        projection = {k: decision[k] for k in ('id', 'status', 'engineLocations')}
        validate_schema(projection, 'legal-decision-scope')
        assert select_decision([decision], identifier) == decision and location_matches(decision['engineLocations'][0], s)
        wrong = copy.deepcopy(s)
        wrong['tablePath'][1] = 'cuota' if col == 'baseInferior' else 'baseInferior'
        assert not location_matches(decision['engineLocations'][0], wrong)
        discriminants.append({'id': identifier, 'schema': True, 'select_decision': True, 'exactLocation': True, 'otherColumnRejected': True})
        decisions.append(decision)
        mapping.append({'payloadId': p['id'], 'payloadSha256': sha(pth.read_bytes()), 'itemId': p['itemId'], 'year': year, 'table': s['symbol'], 'row': int(row), 'column': col, 'value': i['value'], 'unit': 'EUR', 'source': s, 'decisionId': identifier, 'status': 'accepted', 'completeRuleAcceptance': False, 'next': 'Preparar payload nuevo con esta decisión; revisión exacta del enlace pendiente.'})
    assert len(decisions) == len(mapping) == 78
    write('decisiones-canonicas.json', decisions)
    write('mapeo-78.json', mapping)
    write('discriminantes.json', discriminants)
    names = subprocess.check_output(['git', 'ls-tree', '-rz', '--name-only', BASE]).decode().split('\0')
    missing = [n for n in names if n and not (ROOT / n).exists() and not (ROOT / n).is_symlink()]
    assert not missing
    write('control-base.json', {'base': BASE, 'files': len([n for n in names if n]), 'missing': missing, 'inventory': pin, 'vcsMutations': False})
    print(json.dumps({'citations': len(results), 'png': len(pages), 'units': len(units), 'historical': len(hist), 'decisions': len(decisions), 'schemaAndSelectionPassed': len(discriminants), 'completeRuleAcceptance': False}))


if __name__ == '__main__':
    main()
