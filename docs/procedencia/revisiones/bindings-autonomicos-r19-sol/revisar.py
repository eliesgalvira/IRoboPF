"""Revisión independiente R19, solo escribe su entrega y scratch propio."""
import copy
import gzip
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import subprocess
import sys
from decimal import Decimal
from jsonschema.exceptions import ValidationError

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/bindings-autonomicos-r19-sol'
SCRATCH = ROOT / '.cache/bindings-autonomicos-r19-sol'
BASE = '7668bdad60a79a8b3ad8e1e1b911f3d6c223692a'
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
import corpus  # noqa: E402
import enlaces  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path):
    return json.loads(Path(path).read_bytes())


def write(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def ref(ref_):
    raw = (ROOT / ref_['path']).read_bytes()
    assert sha(raw) == ref_['sha256'], ref_['path']
    return json.loads(raw)


def preflight():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
    entries = subprocess.check_output(['git', 'ls-tree', '-rz', BASE]).split(b'\0')
    result = []
    for entry in entries:
        if not entry:
            continue
        meta, name = entry.split(b'\t', 1)
        mode, _, oid = meta.decode().split()
        path = os.fsdecode(name)
        p = ROOT / path
        s = p.lstat()
        raw = os.fsencode(os.readlink(p)) if stat.S_ISLNK(s.st_mode) else p.read_bytes()
        expected = subprocess.check_output(['git', 'cat-file', 'blob', oid])
        assert raw == expected, path
        assert stat.S_ISLNK(s.st_mode) == (mode == '120000'), path
        result.append({'path': path, 'sha256': sha(raw), 'baseSha256': sha(expected), 'size': len(raw), 'mode': mode,
                       'readlink': os.readlink(p) if p.is_symlink() else None})
    with gzip.open(OUT / 'arbol-base.json.gz', 'wt') as f:
        json.dump(result, f)
    return len(result)


if __name__ == '__main__':
    if '--tree' in sys.argv:
        print('HEAD y blobs físicos:', preflight(), 'cero borrados/diferencias')
        sys.exit(0)
    inventory = {'manifestSha256': sha((ROOT / 'docs/procedencia/inventario.json').read_bytes()),
                 'artifactSha256': sha((ROOT / 'docs/procedencia/inventario-datos.json.gz').read_bytes())}
    pages = dict(json.loads(gzip.decompress((ROOT / 'docs/procedencia/inventario-datos.json.gz').read_bytes())))
    items = {i['id']: i for n, s in pages.items() if n.startswith('inventario-pagina-') for i in json.loads(s)}
    rows = [r for r in read(ROOT / 'docs/procedencia/correcciones/integracion-r19/candidatos/correspondencias.json')['rows']
            if r['decision']['decisions']['path'] == 'docs/procedencia/revisiones/evidencias-autonomicas-v2/decisiones-canonicas.json']
    assert len(rows) == 186
    mapping = {r['decisionId']: r for r in read(ROOT / 'docs/procedencia/revisiones/evidencias-autonomicas-v2/mapeo-186.json')}
    pdfs, originals, crops, citations, decisions, tests = {}, [], {}, {}, [], []
    for p in sorted((ROOT / 'docs/procedencia/evidencias/autonomicas/documentos').glob('*.json')):
        d = read(p)
        source = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256') / d['sha256']
        raw = source.read_bytes()
        assert sha(raw) == d['sha256'] and len(raw) == d['size']
        assert hashlib.sha512(raw).hexdigest() == d['sha512']
        originals.append({**d, 'literalPath': str(source)})
        pdfs[d['sha256']] = corpus.mupdf().open(stream=raw, filetype='pdf')
    write('originales.json', originals)
    for p in sorted((ROOT / 'docs/procedencia/evidencias/autonomicas-v2/citas').glob('*.json')):
        c = read(p)
        corpus.validate_schema(c, 'citation')
        page = pdfs[c['documentSha256']][c['page'] - 1]
        text = page.get_text('text', clip=c['bbox'], flags=0, sort=False)
        assert text == c['quote'], p
        assert corpus.geometry(page) == c['geometry']
        assert corpus.selectors(c['page'], c['bbox'], text) == c['selectors']
        assert corpus.verify_binding(text, c['engineBinding'])
        assert corpus.renderer() == c['facsimile']['parameters']
        h = c['facsimile']['sha256']
        if h not in crops:
            png = page.get_pixmap(dpi=144, clip=c['bbox'], colorspace=corpus.mupdf().csRGB, alpha=False, annots=False).tobytes('png')
            assert sha(png) == h
            assert sha((ROOT / 'docs/procedencia/evidencias/autonomicas-v2/cas/sha256' / h).read_bytes()) == h
            (SCRATCH / (h + '.png')).write_bytes(png)
            crops[h] = {'sha256': h, 'documentSha256': c['documentSha256'], 'page': c['page'], 'bbox': c['bbox']}
        citations[str(p.relative_to(ROOT))] = {**c, 'reextracted': True}
    write('citas-reextraidas.json', citations)
    write('recortes.json', list(crops.values()))
    selections = []
    for c in read(ROOT / 'docs/procedencia/evidencias/autonomicas/citas-celdas.json'):
        page = pdfs[c['documentSha256']][c['page'] - 1]
        text = page.get_text('text', clip=c['bbox'], flags=0, sort=False)
        header = page.get_text('text', clip=c['header']['bbox'], flags=0, sort=False)
        assert text == c['quote'] and header == c['header']['quote']
        assert Decimal(text.strip().replace('.', '').replace(',', '.')) == Decimal(c['value'])
        selections.append({**c, 'reextracted': True})
    write('selecciones-reextraidas.json', selections)
    temporals = []
    for c in read(ROOT / 'docs/procedencia/revisiones/evidencias-autonomicas-v2/citas-temporales.json'):
        h = c['documentSha256']
        if h not in pdfs:
            raw = (Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256') / h).read_bytes()
            assert sha(raw) == h
            pdfs[h] = corpus.mupdf().open(stream=raw, filetype='pdf')
        page = pdfs[h][c['page'] - 1]
        text = page.get_textbox(c['bbox']) if c['extraction'] == 'get_textbox' else page.get_text('text', clip=c['bbox'], flags=0, sort=False)
        assert text == c['quote'], c
        temporals.append({**c, 'reextracted': True})
        (SCRATCH / (h + '-p' + str(c['page']) + '.txt')).write_text(page.get_text())
        image_path = SCRATCH / (h + '-p' + str(c['page']) + '.png')
        if not image_path.exists():
            page.get_pixmap(dpi=96, alpha=False, annots=False).save(image_path)
    write('temporales-reextraidas.json', temporals)
    reader = enlaces.DocumentaryReadSet(ROOT)
    for r in rows:
        p = ref(r['candidate'])
        corpus.validate_schema(p, 'binding-payload')
        m = mapping[r['decision']['decisionId']]
        assert ref(r['original'])['source'] == p['source'] == m['source']
        assert p['inventory'] == inventory and p['itemId'] == r['itemId'] == m['itemId']
        assert sha((ROOT / p['source']['file']).read_bytes()) == p['source']['sha256']
        assert p['citation'] == m['citation']
        c = ref(p['citation'])
        d = ref(p['document'])
        assert d['sha256'] == c['documentSha256']
        item = items[p['itemId']]
        assert item['layer'] == 'effective'
        assert item['source']['file'] == p['source']['file']
        assert item['source']['sha256'] == p['source']['sha256']
        assert item['symbol'] == p['source']['symbol'] and json.loads(item['path']) == p['source']['tablePath']
        assert p['scope']['year'] in item['years'] and p['scope']['territory'] in item['territories']
        assert Decimal(item['value']) == Decimal(c['engineBinding']['value']) == Decimal(m['value'])
        assert c['engineBinding']['unitCode'] == p['scope']['unit'] == 'EUR'
        row, column = p['source']['tablePath']
        if p['source']['symbol'] == 'MURCIA_2022' and row == '4':
            assert c['table'] is None and 'superior a 60.000,00 euros' in c['quote']
        else:
            assert c['table'] == {'row': str(int(row) + 1), 'column': column}
        source_text = (ROOT / p['source']['file']).read_text()
        start = source_text.index('export const ' + p['source']['symbol'])
        end = source_text.find('\nexport const ', start + 1)
        block = source_text[start:end]
        tuples = list(re.finditer(r'\["([0-9.]+)", "([0-9.]+)", "([0-9.]+)"\]', block))
        if int(row) < len(tuples):
            number = tuples[int(row)].group(1 if column == 'baseInferior' else 2)
        else:
            match = re.search(column + r': new Decimal\(([^)]+)\)', block)
            assert match is not None
            number = match[1].strip('"')
        assert Decimal(number) == Decimal(item['value'])
        scope = enlaces.verify_executable_scope(reader, p, item)
        legal = enlaces.select_decision(ref(p['legalReview']['decisions']), p['legalReview']['decisionId'])
        assert int(p['source']['tablePath'][0]) + 1 == legal['row'] == m['row']
        context = {'year': scope['year'], 'territory': scope['territory'], 'component': 'autonomico', 'taxBase': 'general',
                   'periodStart': str(scope['year']) + '-01-01', 'accrual': str(scope['year']) + '-12-31',
                   'death': None, 'externalConditions': ['residence-unverified', 'eligibility-unverified'], 'generalBase': '60000.01'}
        assert enlaces.evaluate_scope(scope, context)['applicability'] == 'not-established'
        variants = [('year', scope['year'] + 1), ('territory', 'asturias'), ('component', 'estatal'), ('taxBase', 'ahorro'),
                    ('periodStart', str(scope['year']) + '-01-02'), ('externalConditions', ['residence-verified', 'eligibility-verified']),
                    ('accrual', str(scope['year']) + '-02-30')]
        for key, val in variants:
            changed = {**context, key: val}
            try:
                enlaces.evaluate_scope(scope, changed)
            except ValueError:
                tests.append({'id': p['id'], 'mutation': key, 'rejected': True})
            else:
                raise AssertionError((p['id'], key))
        death = {**context, 'death': str(scope['year']) + '-06-01', 'accrual': str(scope['year']) + '-06-01'}
        try:
            enlaces.evaluate_scope(scope, death)
            assert scope['territory'] == 'madrid'
        except ValueError:
            assert scope['territory'] != 'madrid'
        tests.append({'id': p['id'], 'mutation': 'fallecimiento', 'admitted': scope['territory'] == 'madrid'})
        for field in ['source', 'inventory', 'itemId', 'value', 'period', 'predicate', 'editorialConditions']:
            bad = copy.deepcopy(scope)
            if field == 'source':
                bad[field]['tablePath'][1] = 'cuota' if bad[field]['tablePath'][1] == 'baseInferior' else 'baseInferior'
            elif field == 'inventory':
                bad[field]['manifestSha256'] = '0' * 64
            elif field == 'editorialConditions':
                bad[field] = ['aceptación universal']
            else:
                bad[field] = 'mutado'
            scope_reference = p['executableScope']
            class ChangedReader:
                def read_ref(self, rr):
                    return bad if rr == scope_reference else ref(rr)
            try:
                enlaces.verify_executable_scope(ChangedReader(), p, item)
            except (ValueError, ValidationError):
                tests.append({'id': p['id'], 'mutation': 'scope.' + field, 'rejected': True})
            else:
                raise AssertionError((p['id'], field))
        if scope['predicate'] == 'murcia-blg-gt-60000':
            for amount, expected in [('59999.99', False), ('60000', False), ('60000.01', True)]:
                try:
                    enlaces.evaluate_scope(scope, {**context, 'generalBase': amount})
                    actual = True
                except ValueError:
                    actual = False
                assert actual == expected
                tests.append({'id': p['id'], 'generalBase': amount, 'admitted': actual})
        decisions.append({'id': 'R19SOL-' + legal['id'], 'payload': r['candidate'], 'itemId': p['itemId'],
                          'source': p['source'], 'inventory': inventory, 'scope': p['scope'], 'executableScope': p['executableScope'],
                          'value': item['value'], 'legalDecision': p['legalReview'], 'status': 'accepted-limited',
                          'citation': p['citation'], 'document': p['document'],
                          'reason': f"Fila {legal['row']}, columna {column}, {scope['year']}, {scope['territory']}: {item['value']} EUR; identidad estructural, original, cabecera y período cotejados; no establece aplicabilidad personal.",
                          'completeRule': False, 'completeRuleAcceptance': False,
                          'expertObjection': 'La igualdad numérica no acredita fila, columna, vigencia ni hechos externos.',
                          'response': 'Cotejo estructural y documental individual; período explícito y residencia/elegibilidad no acreditadas.',
                          'cost': 'Solo identidad y cuantía nominal de esta celda; requiere aprobación exacta del padre, sin liquidación completa.'})
    write('decisiones.json', decisions)
    write('adversos.json', tests)
    write('dependencias.json', reader.finish())
    print(json.dumps({'payloads': len(decisions), 'citas': len(citations), 'selecciones': len(selections), 'recortes': len(crops), 'temporales': len(temporals), 'adversos': len(tests)}))
