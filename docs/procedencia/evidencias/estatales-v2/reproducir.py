"""Reextracción candidata fijada; no escribe registros ni originales."""
import copy
import gzip
import hashlib
import json
import subprocess
import sys
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
OLD = ROOT / 'docs/procedencia/evidencias/estatales'
REV = ROOT / 'docs/procedencia/revisiones/evidencias-estatales-v1'
CAS = Path('/home/elies/Repos/IRoboPF/.cache/procedencia')
BASE = 'eaed990c620b5fc4d3ff2e74dc68e0c8481c43db'
HIST = 'ed6a43fd750de05609abc3710dabdc2f8261020c'
HISTORICAL = {'manifestSha256': '6872a5fb9315a4e970c5da7fb3d8ad58f2ebf74b3d84fe07101b90cb8c58564d', 'artifactSha256': '29fb5e311f33982395227b15f2e08705e2943bf5ea21409702f48dd8ba4e613c'}
CURRENT = {'manifestSha256': 'd7bd61b71d11396636b1a2bd9264bb9b04950b79c06b7841466347291f99ff0e', 'artifactSha256': 'd6e71d1d5a2eeb8f81f607cc8b61415ee7eb8af180e4dd288aa61cd3a3a07a46'}
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
import pymupdf  # noqa: E402
from corpus import validate_schema, verify_binding  # noqa: E402
from cas import CasResolver  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path):
    return json.loads(path.read_bytes())


def write(name, obj):
    path = OUT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')
    return {'path': str(path.relative_to(ROOT)), 'sha256': sha(path.read_bytes())}


def ref(path):
    return {'path': str(path.relative_to(ROOT)), 'sha256': sha(path.read_bytes())}


def artifact(pin):
    objects = ROOT / 'docs/procedencia/implementaciones/contenidos/datos/objetos'
    manifest = (objects / pin['manifestSha256']).read_bytes()
    raw = (objects / pin['artifactSha256']).read_bytes()
    assert sha(manifest) == pin['manifestSha256'] and sha(raw) == pin['artifactSha256']
    m = json.loads(manifest)
    assert m['artifact']['sha256'] == sha(raw) and m['artifact']['size'] == len(raw)
    files = dict(json.loads(gzip.decompress(raw)))
    summary = dict(m)
    del summary['artifact']
    assert json.loads(files['inventario.json']) == summary
    return [i for n, c in files.items() if n.startswith('inventario-pagina-') for i in json.loads(c)]


def main():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT).decode().strip() == BASE
    inputs = []
    for folder in (OLD, REV, ROOT / 'docs/procedencia/correcciones/integracion-ronda10'):
        for path in sorted(folder.rglob('*')):
            if path.is_file():
                raw = path.read_bytes()
                if path.suffix == '.json':
                    json.loads(raw)
                inputs.append({'path': str(path.relative_to(ROOT)), 'sha256': sha(raw), 'size': len(raw)})
    write('entradas-leidas.json', inputs)
    current = artifact(CURRENT)
    historical_pin = HISTORICAL
    assert read(OLD / 'cobertura.json')['inventory'] == historical_pin
    historical = {i['id']: i for i in artifact(historical_pin)}
    effective = [i for i in current if i['layer'] == 'effective']
    lookup = {(i['source']['file'], i['symbol'], i['path']): i for i in effective}
    write('inventarios-fijados.json', {'base': BASE, 'historicalSourceRevision': HIST, 'historical': historical_pin, 'current': CURRENT})
    docs = {read(p)['sha256']: (read(p), p) for p in (OLD / 'documentos').glob('*.json')}
    (OUT / 'cas/sha256').mkdir(parents=True, exist_ok=True)
    resolver = CasResolver([CAS, OUT / 'cas'])
    for h, (d, _) in docs.items():
        raw = resolver.resolve(h).read_bytes()
        assert len(raw) == d['size'] and hashlib.sha512(raw).hexdigest() == d['sha512']
        validate_schema(d, 'document')
    index = read(OLD / 'citas-indice.json')
    citations = sorted((OLD / 'citas').glob('*.json')) + [ROOT / r['path'] for r in read(OLD / 'contextos.json')]
    page_cache = {}
    checked = []
    units = []
    scale_refs = {}
    for path in citations:
        c = read(path)
        validate_schema(c, 'citation')
        key = (c['documentSha256'], c['page'])
        if key not in page_cache:
            with pymupdf.open(resolver.resolve(key[0])) as pdf:
                page = pdf[key[1] - 1]
                assert list(page.mediabox) == c['geometry']['mediaBox']
                assert list(page.cropbox) == c['geometry']['cropBox'] and page.rotation == c['geometry']['rotation']
                text = page.get_text('text', clip=pymupdf.Rect(c['bbox']), flags=0, sort=False)
                words = page.get_text('words', flags=0, sort=False)
                png = page.get_pixmap(dpi=144, clip=pymupdf.Rect(c['bbox']), colorspace=pymupdf.csRGB, alpha=False, annots=False).tobytes('png')
                assert sha(png) == c['facsimile']['sha256']
                assert png == (OLD / 'recortes' / (sha(png) + '.png')).read_bytes()
                (OUT / 'cas/sha256' / sha(png)).write_bytes(png)
                resolver.resolve(sha(png))
                page_cache[key] = (text, words, c)
        text, words, _ = page_cache[key]
        assert c['quote'] == text
        if c['engineBinding']:
            verify_binding(text, c['engineBinding'])
            box = index[path.stem]['cellBBox']
            assert any(list(w[:4]) == box and w[4] == c['engineBinding']['number']['literal'] for w in words)
        checked.append({'citation': ref(path), 'text': 'exact', 'png': c['facsimile']['sha256']})
        if not path.stem.startswith('escala-'):
            continue
        column = c['table']['column']
        # Cabecera de tabla delimitada por orden literal y geometría de columna.
        header_text = 'Base liquidable\n–\nHasta euros\nCuota íntegra\n–\nEuros'
        if 'complementaria' in path.stem:
            header_text = 'Base liquidable general\n–\nHasta euros\nIncremento en cuota \níntegra estatal\n–\nEuros'
        start = text.index(header_text)
        literal = 'euros' if column == 'baseInferior' else 'Euros'
        offset = start + (header_text.index('euros') if column == 'baseInferior' else header_text.index('Euros'))
        selected = [w for w in words if w[4] == literal and w[1] < box[1] and abs((w[0]+w[2])/2 - (box[0]+box[2])/2) < 55]
        # Elegir la última cabecera anterior a las celdas, nunca un párrafo.
        word = max(selected, key=lambda w: w[1])
        header_box = list(word[:4])
        assert header_box[1] < box[1]
        if column == 'baseInferior':
            hasta = [w for w in words if w[4] == 'Hasta' and abs(w[1]-word[1]) < 1 and 0 < word[0]-w[2] < 10]
            assert len(hasta) == 1
            header_box = list(pymupdf.Rect(header_box) | pymupdf.Rect(hasta[0][:4]))
        header_quote = ' '.join(w[4] for w in words if pymupdf.Rect(header_box).contains(pymupdf.Rect(w[:4])))
        assert header_quote == ('Hasta euros' if column == 'baseInferior' else 'Euros'), (path.name, header_quote, header_box)
        old_unit = c['engineBinding']['unit']
        assert old_unit['start'] != offset  # Rojo documental v1 reproducido.
        c['engineBinding']['unit'] = {'start': offset, 'end': offset+len(literal), 'literal': literal}
        validate_schema(c, 'citation')
        verify_binding(text, c['engineBinding'])
        newref = write('citas/' + path.name, c)
        scale_refs[path.stem] = newref
        units.append({'id': path.stem, 'citation': newref, 'documentSha256': key[0], 'page': key[1], 'cellBBox': box, 'headerBBox': header_box, 'headerLiteral': 'Hasta euros' if column == 'baseInferior' else 'Euros', 'oldUnit': old_unit, 'newUnit': c['engineBinding']['unit'], 'v1SelectorRejected': True, 'column': column})
    assert len(units) == 26
    write('unidades-geometricas-26.json', units)
    write('reextraccion-83.json', checked)
    # Contexto compuesto en una relación documental, sin inventar campos del schema citation.
    h = read(OLD / 'documentos/2010-19703.json')['sha256']
    contexts = []
    for page in (62, 63):
        c = copy.deepcopy(page_cache[(h, page)][2])
        c['engineBinding'] = None
        c['table'] = None
        validate_schema(c, 'citation')
        contexts.append(write(f'citas/contexto-discapacidad-p{page}.json', c))
    write('contexto-compuesto.json', {'id': 'ESTV1-02', 'documentSha256': h, 'orderedPassages': contexts, 'affectedCitations': [ref(p) for p in (OLD / 'citas').glob('min-2012-2014-discapacidad-familiar-*.json')], 'interpretation': 'Art. 60.2: inicio sujeto en p62 y continuación en p63; cuantías, requisitos y asistencia se leen juntos.', 'acceptance': False, 'objecion': 'Un pasaje aislado no acredita sujeto ni todas las condiciones.', 'coste': 'Relación compuesta externa al schema y revisión nueva; no sustituye payloads históricos.'})
    legal_path = ROOT / 'docs/procedencia/revisiones/escalas-estatales-ahorro/revisiones.json'
    decisions = read(legal_path)
    decision = next(d for d in decisions if d['id'] == 'EEA-CUOTAS-FIJAS')
    rows = []
    registry = []
    for u in units:
        name = u['id']
        _, component, row, column = name.split('-')
        symbol = 'ESTATAL_' + component.upper() + '_2012_2014'
        source_file = 'lib/dominio/irpf/cuotas/escalas-publicadas.ts'
        i = lookup[(source_file, symbol, json.dumps([row, column], separators=(',', ':'))) ]
        assert sha((ROOT / source_file).read_bytes()) == i['source']['sha256']
        c = read(ROOT / u['citation']['path'])
        assert Decimal(i['value']) == Decimal(c['engineBinding']['value'])
        for year in (2012, 2013, 2014):
            p = {'schemaVersion': 1, 'id': f'estatal-v2-{i["id"]}-{year}', 'authorTaskId': 'research-estatales-v2-t3-c304202c', 'inventory': CURRENT, 'itemId': i['id'], 'source': {'file': source_file, 'sha256': i['source']['sha256'], 'symbol': symbol, 'tablePath': [row, column]}, 'scope': {'year': year, 'territory': 'estatal-comun', 'unit': 'EUR', 'claim': f'Cuantía publicada {symbol}, fila {row}, columna {column}: {i["value"]} EUR.', 'conditions': ['Cuantía nominal; no acredita liquidación ni elegibilidad.', 'Ámbito territorial técnico vacío: candidato bloqueado.', 'La tabla complementaria y la ordinaria son identidades distintas.'], 'completeRule': False}, 'conversion': 'identity', 'citation': u['citation'], 'document': ref(docs[c['documentSha256']][1]), 'legalReview': {'decisions': ref(legal_path), 'decisionId': decision['id']}}
            validate_schema(p, 'binding-payload')
            r = write('payloads/' + p['id'] + '.json', p)
            registry.append({'payload': r, 'attestation': None})
            rows.append({'id': p['id'], 'itemId': i['id'], 'source': p['source'], 'value': i['value'], 'scope': p['scope'], 'technicalYears': i['years'], 'technicalTerritories': i['territories'], 'status': 'blocked', 'blockers': ['territorio técnico vacío', 'schema operativo rechaza lines/currentSha256 de la decisión histórica', 'decisión jurídica previa no cubre archivo canónico', 'revisión nueva del binding pendiente'], 'completeRuleAcceptance': False})
    write('matriz-canonica-78.json', rows)
    write('contextos-por-payload.json', [{'id': r['id'], 'temporalContext': read(OLD / 'contextos.json') if r['scope']['year'] == 2014 else [], 'note': 'Prórroga general en p75; p76 distingue ahorro/retenciones, no sustituye tabla general.'} for r in rows])
    proposed = {'schemaVersion': 1, 'entries': registry}
    validate_schema(proposed, 'binding-registry')
    write('registro-propuesto-NO-APLICAR.json', proposed)
    # Revisar las 319 identidades originales sin migrarlas ni modificar sus decisiones.
    matrix = []
    previous_reviews = {d['id']: d for d in read(REV / 'decisiones-319.json')}
    source_cache = {}
    for path in sorted((OLD / 'payloads').glob('*.json')):
        p = read(path)
        i = historical[p['itemId']]
        source = p['source']
        assert i['layer'] == 'effective' and source['file'] == i['source']['file'] and source['symbol'] == i['symbol'] and source['tablePath'] == json.loads(i['path'])
        if source['file'] not in source_cache:
            source_cache[source['file']] = subprocess.check_output(['git', 'show', HIST + ':' + source['file']], cwd=ROOT)
        assert sha(source_cache[source['file']]) == source['sha256'] == i['source']['sha256']
        assert sha((ROOT / p['citation']['path']).read_bytes()) == p['citation']['sha256']
        assert p['inventory'] == historical_pin
        c = read(ROOT / p['citation']['path'])
        assert Decimal(i['value']) == Decimal(c['engineBinding']['value'])
        fresh = lookup.get((source['file'], source['symbol'], i['path']))
        if fresh is not None:
            assert sha((ROOT / fresh['source']['file']).read_bytes()) == fresh['source']['sha256']
        matrix.append({'id': p['id'], 'historicalPayload': ref(path), 'previousReviewFile': ref(REV / 'decisiones-319.json'), 'previousBlockers': previous_reviews[p['id']]['pendiente'], 'previousFileGate': previous_reviews[p['id']]['puertaArchivo'], 'historicalItemId': i['id'], 'currentItemId': fresh['id'] if fresh else None, 'currentEqual': fresh is not None and Decimal(fresh['value']) == Decimal(i['value']), 'year': p['scope']['year'], 'decisionId': p['legalReview']['decisionId'], 'status': 'blocked-no-migration', 'technicalYears': fresh['years'] if fresh else [], 'technicalTerritories': fresh['territories'] if fresh else [], 'reason': 'La decisión jurídica previa y la continuidad anual no aceptan un binding fresco.', 'objecion': 'Igualdad de número y alias no prueba vigencia anual ni consumo canónico.', 'coste': 'Revisión individual del ámbito, cadena anual y payload exacto.'})
    assert len(matrix) == 319
    write('matriz-historica-319.json', matrix)
    aliases = []
    for year in range(2015, 2025):
        path = ROOT / f'lib/dominio/normativa/datos/minimos-autonomicos-{year}.ts'
        raw = path.read_bytes()
        aliases.append({'year': year, 'source': ref(path), 'containsAlias2025': 'MINIMOS_ESTATALES_2025' in raw.decode(), 'continuity': 'no acreditada por alias; requiere cadena normativa anual', 'accepted': False})
    write('continuidad-2015-2024.json', aliases)
    write('cas-config.json', {'roots': [str(CAS), str(OUT / 'cas')], 'dependencies': resolver.finish(), 'note': 'El resolver añade sha256; solo lectura de originales. PNG propios por hash, sin modificar fixtures.'})
    write('resultados.json', {'base': BASE, 'originals': len(docs), 'citationsReextracted': len(checked), 'rendersSameBytes': len(page_cache), 'unitsCorrected': len(units), 'candidatePayloads': len(rows), 'historicalPayloads': len(matrix), 'historicalCurrentEqual': sum(m['currentEqual'] for m in matrix), 'coordinatorRun': False, 'coordinatorBlock': 'Ámbito territorial vacío y decisión sin archivo canónico; no ejecutar ni fabricar aceptación.', 'authenticity': 'not-validated', 'acceptance': False, 'pymupdf': pymupdf.VersionBind})
    print(json.dumps(read(OUT / 'resultados.json'), ensure_ascii=False))


if __name__ == '__main__':
    main()
