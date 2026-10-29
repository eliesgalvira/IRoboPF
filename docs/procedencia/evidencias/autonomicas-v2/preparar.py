"""Candidatos canónicos fijados por revisión; ninguna promoción editorial."""
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
OUT = Path(__file__).resolve().parent
BASE = 'eaed990c620b5fc4d3ff2e74dc68e0c8481c43db'
OLD = 'ed6a43fd750de05609abc3710dabdc2f8261020c'
E = ROOT / 'docs/procedencia/evidencias/autonomicas'
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
import corpus  # noqa: E402
import enlaces  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path):
    return json.loads(Path(path).read_text())


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def ref(path):
    return {'path': str(path.relative_to(ROOT)), 'sha256': sha(path.read_bytes())}


def at(base, path):
    return subprocess.check_output(['git', 'show', f'{base}:{path}'], cwd=ROOT)


def inventory(base, expected):
    manifest = at(base, 'docs/procedencia/inventario.json')
    archive = at(base, 'docs/procedencia/inventario-datos.json.gz')
    assert sha(manifest) == expected['manifestSha256']
    assert sha(archive) == expected['artifactSha256']
    m = json.loads(manifest)
    sources = []
    for entry in m['generationInputs']:
        raw = at(base, entry['file'])
        assert sha(raw) == entry['sha256']
        sources.append(entry)
    pages = dict(json.loads(gzip.decompress(archive)))
    items = [i for name, content in pages.items() if name.startswith('inventario-pagina-') for i in json.loads(content)]
    return items, sources


assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT).decode().strip() == BASE
coverage = read(E / 'cobertura.json')
for lock in ('flakeLock', 'uvLock'):
    expected_lock = read(E / 'receta.json')[lock]
    assert sha((ROOT / expected_lock['path']).read_bytes()) == expected_lock['sha256']
current_hashes = {'manifestSha256': 'd7bd61b71d11396636b1a2bd9264bb9b04950b79c06b7841466347291f99ff0e',
                  'artifactSha256': 'd6e71d1d5a2eeb8f81f607cc8b61415ee7eb8af180e4dd288aa61cd3a3a07a46'}
runtime_paths = ['tools/procedencia/' + p for p in ('corpus.py', 'enlaces.py', 'cas.py', 'descargar.py', 'run.sh', 'flake.nix', 'flake.lock', 'uv.lock', 'pyproject.toml')]
runtime_paths += ['schemas/procedencia/' + p + '.schema.json' for p in ('citation', 'document', 'binding-payload', 'binding-registry', 'legal-decision-scope')]
runtime_sources = []
for name in runtime_paths:
    raw = at(BASE, name)
    assert raw == (ROOT / name).read_bytes()
    runtime_sources.append({'file': name, 'sha256': sha(raw)})
old_items, old_sources = inventory(OLD, coverage['inventory'])
items, sources = inventory(BASE, current_hashes)
helper_file = 'lib/dominio/irpf/cuotas/escalas-publicadas.ts'
helper_raw = at(BASE, helper_file)
assert helper_raw == (ROOT / helper_file).read_bytes()
canonical = [i for i in items if i['layer'] == 'effective' and i['source']['file'] == helper_file]
assert len(canonical) == 228
assert len({i['symbol'] for i in canonical}) == 15
write(OUT / 'receta.json', {'base': BASE, 'historicalBase': OLD, 'historicalInventory': coverage['inventory'],
      'inventory': current_hashes, 'historicalSources': old_sources, 'sources': sources, 'runtimeSources': runtime_sources,
      'toolchain': read(E / 'receta.json'), 'defaultPresentInventory': False,
      'casOriginalRoot': '/home/elies/Repos/IRoboPF/.cache/procedencia', 'casCropRoot': str(OUT / 'cas'),
      'policy': 'Resolver originales por hash; verificar ambos hashes y tamaño. Sin descargas, symlinks ni registros.'})
# Lectura integral y cierre de entradas: binarios, textos y JSON de ambos lotes.
inputs = []
for directory in [E, ROOT / 'docs/procedencia/revisiones/evidencias-autonomicas-v1']:
    for path in sorted(directory.rglob('*')):
        if path.is_file():
            raw = path.read_bytes()
            if path.suffix == '.json':
                json.loads(raw)
            inputs.append({**ref(path), 'size': len(raw)})
write(OUT / 'entradas.json', inputs)
# Identidad sintáctica histórica por árbol fila/campo; no valor ni primer cero.
refined = []
prior = {r['id']: r for r in read(ROOT / 'docs/procedencia/revisiones/evidencias-autonomicas-v1/localizadores-refinados.json')}
for e in coverage['entries']:
    matches = []
    for i in old_items:
        if i['layer'] != 'syntactic' or i['symbol'] != e['helper']['symbol']:
            continue
        tree = json.loads(i['path'])
        if e['helper']['symbol'] == 'MURCIA_2022' and e['row'] == 5:
            ok = any(k == 'PropertyAssignment:' + e['field'] for k, _ in tree) and tree[-1][0] in ('StringLiteral', 'FirstLiteralToken', 'NumericLiteral')
        else:
            arrays = [n for k, n in tree if k == 'ArrayLiteralExpression']
            ok = len(arrays) >= 2 and arrays[-1] == e['row'] - 1 and tree[-1] == ['StringLiteral', 0 if e['field'] == 'baseInferior' else 1]
        if ok:
            matches.append(i)
    assert len(matches) == 1, (e['citationId'], len(matches))
    item = matches[0]
    raw = at(OLD, helper_file).decode().encode('utf-16-le')
    fragment = raw[item['source']['start'] * 2:item['source']['end'] * 2].decode('utf-16-le')
    assert Decimal(fragment.strip('"')) == Decimal(e['value'])
    key = f"{e['territory']}-{e['year']}-f{e['row']}-{e['field']}"
    assert item['id'] == prior[key]['localizadoresExactos'][0]['id']
    refined.append({'id': key, 'year': e['year'], 'territory': e['territory'], 'row': e['row'], 'field': e['field'],
                    'originalCount': len(e['syntacticLocations']), 'itemId': item['id'], 'source': item['source'],
                    'path': item['path'], 'literal': fragment, 'review': 'pending', 'fiscalAcceptance': False})
assert sum(r['originalCount'] != 1 for r in refined) == 28
write(OUT / 'localizadores-estructurales.json', refined)

originals = {r['sha256']: Path(r['path']) for r in read(OUT / 'historico/originales.json')}
pdfs: dict[str, Any] = {}
for h, path in originals.items():
    document = read(E / 'documentos' / (h + '.json'))
    raw = path.read_bytes()
    assert sha(raw) == h and hashlib.sha512(raw).hexdigest() == document['sha512'] and len(raw) == document['size']
    pdfs[h] = corpus.mupdf().open(path)


def word_span(page, citation, box, literal):
    words = page.get_text('words', clip=citation['bbox'], flags=0, sort=False)
    chosen = [w for w in words if w[4].strip('()') == literal and box[0] <= w[0] and box[1] <= w[1] and w[2] <= box[2] and w[3] <= box[3]]
    assert len(chosen) == 1, (literal, box, chosen)
    same = [w for w in words if w[4].strip('()') == literal]
    spans = list(re.finditer(r'(?<![\w.,])' + re.escape(literal) + r'(?![\w.,])', citation['quote']))
    assert len(spans) == len(same), literal
    span = spans[same.index(chosen[0])]
    return {'start': span.start(), 'end': span.end(), 'literal': literal}


cells = {c['id']: c for c in read(E / 'citas-celdas.json')}
citation_refs: dict[str, Any] = {}
for key, c in cells.items():
    citation = read(ROOT / c['citation']['path'])
    page = pdfs[c['documentSha256']][c['page'] - 1]
    assert page.get_text('text', clip=c['bbox'], flags=0, sort=False) == c['quote']
    assert page.get_text('text', clip=c['header']['bbox'], flags=0, sort=False) == c['header']['quote']
    literal = c['quote'].strip()
    number = word_span(page, citation, c['bbox'], literal)
    if isinstance(c['row'], int):
        unitwords = [w for w in page.get_text('words', clip=c['header']['bbox'], flags=0, sort=False) if w[4].strip('()') in ('euros', 'Euros', 'EUROS')]
        assert len(unitwords) == 1
        unit = word_span(page, citation, c['header']['bbox'], unitwords[0][4].strip('()'))
    else:
        # La cláusula no tiene cabecera tabular: unidad adyacente a cada importe.
        tail = citation['quote'][number['end']:]
        m = re.match(r'\s+(euros)\b', tail)
        assert m is not None
        start = number['end'] + m.start(1)
        unit = {'start': start, 'end': start + 5, 'literal': 'euros'}
    citation['engineBinding'] = {'number': number, 'numberFormat': 'es-ES', 'value': c['value'], 'unit': unit, 'unitCode': 'EUR'}
    corpus.validate_schema(citation, 'citation')
    assert corpus.verify_binding(citation['quote'], citation['engineBinding'])
    png = page.get_pixmap(dpi=144, clip=citation['bbox'], colorspace=corpus.mupdf().csRGB, alpha=False, annots=False).tobytes('png')
    h = citation['facsimile']['sha256']
    assert sha(png) == h
    dest = OUT / 'cas/sha256' / h
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(png)
    cp = OUT / 'citas' / (key + '.json')
    write(cp, citation)
    citation_refs[key] = ref(cp)

cas_roots = sorted({str(p.parent.parent) for p in originals.values()}) + [str(OUT / 'cas')]
resolver = enlaces.CasResolver(cas_roots)
for h in originals:
    resolver.resolve(h)
for path in (OUT / 'cas/sha256').iterdir():
    resolver.resolve(path.name)
write(OUT / 'cas-verificado.json', {'roots': cas_roots, 'objects': resolver.finish()})

results = []
registry = []
for e in coverage['entries']:
    candidates = [i for i in canonical if i['symbol'] == e['helper']['symbol'] and json.loads(i['path']) == [str(e['row'] - 1), e['field']]]
    assert len(candidates) == 1
    item = candidates[0]
    assert Decimal(item['value']) == Decimal(e['value'])
    source = {'file': helper_file, 'sha256': sha(helper_raw), 'symbol': item['symbol'], 'tablePath': json.loads(item['path'])}
    assert item['source']['sha256'] == source['sha256']
    legal = e.get('legalReview')
    if legal is None:
        legal = next(x['legalReview'] for x in coverage['entries'] if x['territory'] == 'murcia' and 'legalReview' in x)
    decision_path = ROOT / legal['decisions']['path']
    assert sha(decision_path.read_bytes()) == legal['decisions']['sha256']
    decisions = read(decision_path)
    decision = next(d for d in decisions if d['id'] == legal['decisionId'])
    projection = {k: decision[k] for k in ('id', 'status', 'decision', 'engineLocations') if k in decision}
    schema_error = None
    try:
        corpus.validate_schema(projection, 'legal-decision-scope')
    except enlaces.ValidationError as error:
        schema_error = error.message
    state = decision.get('status', decision.get('decision'))
    location_ok = False if schema_error else any(enlaces.location_matches(loc, source) for loc in decision['engineLocations'])
    blockers = ['revision-independiente-del-binding-pendiente']
    if schema_error:
        blockers.append('schema-decision-incompatible')
    if state != 'accepted':
        blockers.append('decision-no-aceptada')
    if not location_ok:
        blockers.append('engineLocations-no-cubre-helper-canonico')
    dimension_ok = e['year'] in item['years'] and e['territory'] in item['territories']
    if not dimension_ok:
        blockers.append('dimensions-sin-ambito-explicito')
    key = f"canonico-{e['territory']}-{e['year']}-f{e['row']}-{e['field']}"
    payload = {'schemaVersion': 1, 'id': key, 'authorTaskId': 'research-autonomicas-v2-t3-4f88346e',
               'inventory': current_hashes, 'itemId': item['id'], 'source': source,
               'scope': {'year': e['year'], 'territory': e['territory'], 'unit': 'EUR',
                         'claim': f"Candidato: {e['field']} publicado, fila {e['row']}; coincidencia con identidad canónica exacta.",
                         'conditions': ['Cuota publicada; no integral ajustada.', 'Vigencia y alcance del binding pendientes de revisión.',
                                        'Murcia 2022: tramo final solo >60000; no fallecidos.' if e['territory'] == 'murcia' else 'Sin aceptación de mínimos, fallecimientos ni deuda final.'], 'completeRule': False},
               'conversion': 'identity', 'citation': citation_refs[e['citationId']], 'document': cells[e['citationId']]['document'],
               'legalReview': {'decisions': legal['decisions'], 'decisionId': legal['decisionId']}}
    corpus.validate_schema(payload, 'binding-payload')
    path = OUT / 'payloads' / (key + '.json')
    write(path, payload)
    result = {'id': key, 'payload': ref(path), 'itemId': item['id'], 'year': e['year'], 'territory': e['territory'],
              'symbol': item['symbol'], 'tablePath': source['tablePath'], 'value': item['value'],
              'historicalCell': e['citationId'], 'oldPayloads': e['payloads'], 'dimensions': {'years': item['years'], 'territories': item['territories']},
              'proposedDimensions': {'years': sorted({x['year'] for x in coverage['entries'] if x['helper']['symbol'] == item['symbol']}), 'territories': [e['territory']],
                                    'basis': {**ref(ROOT / helper_file), 'symbol': 'obtenerEscalaAutonomicaPublicada'}, 'status': 'requires-review-not-applied'},
              'legalReview': payload['legalReview'], 'originalDecisionProjection': projection, 'schemaError': schema_error,
              'locationMatches': location_ok, 'blockers': blockers, 'decision': 'candidate-blocked',
              'expertObjection': 'Identidad y número no acreditan vigencia ni amplían el alcance editorial previo.',
              'cost': 'Revisión de dimensiones y localizadores por sus propietarios antes de integración.',
              'integrity': 'verified', 'authenticity': 'not-revalidated', 'interpretation': 'pending', 'numericAccuracy': 'decimal-equal', 'fiscalAcceptance': False}
    results.append(result)
    registry.append({'payload': ref(path), 'attestation': None})
assert len(results) == 186
write(OUT / 'candidatos.json', results)
write(OUT / 'propuesta-registro.json', {'schemaVersion': 1, 'entries': registry})
corpus.validate_schema(read(OUT / 'propuesta-registro.json'), 'binding-registry')
write(OUT / 'resultado.json', {'annualCells': len(results), 'historicalSelections': len(cells), 'historicalCitations': 93,
      'historicalPayloads': 136, 'historicalDecisions': 317, 'newPayloads': len(registry), 'newCitations': len(citation_refs),
      'canonicalLeaves': len(canonical), 'canonicalTables': 15, 'fixedAmbiguousLocations': 28,
      'dimensionBlocked': sum('dimensions-sin-ambito-explicito' in r['blockers'] for r in results),
      'locationBlocked': sum(not r['locationMatches'] for r in results), 'schemaBlocked': sum(r['schemaError'] is not None for r in results),
      'fiscalAcceptances': 0})
print(json.dumps(read(OUT / 'resultado.json'), ensure_ascii=False))
