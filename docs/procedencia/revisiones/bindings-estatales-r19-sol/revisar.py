"""Revisión independiente R19: lectura física, evidencia y adversos sin fixes."""
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

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
SCRATCH = ROOT / '.cache/bindings-estatales-r19-sol'
BASE = '7668bdad60a79a8b3ad8e1e1b911f3d6c223692a'
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
import pymupdf  # noqa: E402
from corpus import validate_schema, verify_binding  # noqa: E402
from enlaces import DocumentaryReadSet, evaluate_scope, verify_executable_scope  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def load(path):
    return json.loads(Path(path).read_bytes())


def save(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def checked(ref):
    raw = (ROOT / ref['path']).read_bytes()
    assert sha(raw) == ref['sha256'], ref
    return json.loads(raw)


def physical():
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() == BASE
    tree = subprocess.check_output(['git', 'ls-tree', '-rz', BASE])
    records = []
    for entry in tree.split(b'\0'):
        if not entry:
            continue
        meta, name = entry.split(b'\t', 1)
        mode, kind, oid = meta.decode().split()
        path = ROOT / os.fsdecode(name)
        info = path.lstat()
        if mode == '120000':
            assert stat.S_ISLNK(info.st_mode)
            raw = os.fsencode(os.readlink(path))
        else:
            assert stat.S_ISREG(info.st_mode), str(path)
            raw = path.read_bytes()
        git_blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
        assert git_blob == oid, str(path)
        records.append({'path': os.fsdecode(name), 'mode': mode, 'sha256': sha(raw), 'size': len(raw)})
    raw = json.dumps(records, ensure_ascii=False, indent=2).encode()
    (OUT / 'arbol-base.json.gz').write_bytes(gzip.compress(raw, mtime=0))
    save('control-base.json', {'base': BASE, 'entries': len(records), 'missing': [], 'changed': [], 'deleted': [], 'method': 'ls-tree -rz; lstat; readlink sin seguir; SHA1 blob Git y SHA256 físico', 'diffAgainstBase': subprocess.check_output(['git', 'diff', '--stat', BASE]).decode()})
    print('BASE', len(records), 'entradas físicas idénticas; cero borrados', flush=True)


def resolve(h):
    # Rutas literales de los CAS comunicados, sin búsqueda por nombre o URL.
    for directory in [Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256'), Path('/home/elies/Repos/IRoboPF/.cache/procedencia/recepcion-r13/estatales/sha256'), ROOT / 'docs/procedencia/evidencias/estatales-v2/cas/sha256']:
        p = directory / h
        if p.exists():
            assert stat.S_ISREG(p.lstat().st_mode) and not p.is_symlink()
            assert sha(p.read_bytes()) == h
            return p
    raise ValueError('CAS ausente: ' + h)


def rejected(operation):
    try:
        operation()
    except (ValueError, AssertionError) as error:
        return str(error)
    raise AssertionError('Mutación aceptada')


def main():
    physical()
    correspondence = load(ROOT / 'docs/procedencia/correcciones/integracion-r19/candidatos/correspondencias.json')
    target = 'docs/procedencia/revisiones/evidencias-estatales-v2/decisiones-canonicas.json'
    rows = [r for r in correspondence['rows'] if r['decision']['decisions']['path'] == target]
    assert len(rows) == 78
    pin = correspondence['inventory']
    assert sha((ROOT / 'docs/procedencia/inventario.json').read_bytes()) == pin['manifestSha256']
    objects = ROOT / 'docs/procedencia/implementaciones/contenidos/datos/objetos'
    artifact = (objects / pin['artifactSha256']).read_bytes()
    assert sha(artifact) == pin['artifactSha256']
    items = {i['id']: i for name, data in json.loads(gzip.decompress(artifact)) if name.startswith('inventario-pagina-') for i in json.loads(data)}
    units = {u['citation']['path']: u for u in load(ROOT / 'docs/procedencia/evidencias/estatales-v2/unidades-geometricas-26.json')}
    mapping = {r['decisionId']: r for r in load(ROOT / 'docs/procedencia/revisiones/evidencias-estatales-v2/mapeo-78.json')}
    source_records = {}
    pages = {}
    citations = {}
    decisions = []
    adverses = []
    reader = DocumentaryReadSet(ROOT)
    for r in rows:
        p = checked(r['candidate'])
        validate_schema(p, 'binding-payload')
        assert p['inventory'] == pin and p['itemId'] == r['itemId']
        assert p['legalReview'] == r['decision']
        i = items[p['itemId']]
        s = p['source']
        assert i['layer'] == 'effective' and i['symbol'] == s['symbol']
        assert i['source']['file'] == s['file'] and i['source']['sha256'] == s['sha256']
        assert json.loads(i['path']) == s['tablePath']
        assert sha((ROOT / s['file']).read_bytes()) == s['sha256']
        assert p['scope']['year'] in i['years'] and p['scope']['territory'] in i['territories']
        scope = verify_executable_scope(reader, p, i)
        assert scope == checked(r['scope'])
        assert scope['period'] == 'nominal-only' and scope['component'] == 'estatal' and scope['taxBase'] == 'general'
        old_map = mapping[r['decision']['decisionId']]
        assert old_map['source'] == s and old_map['year'] == scope['year'] and old_map['value'] == i['value']
        c = checked(p['citation'])
        d = checked(p['document'])
        assert c['documentSha256'] == d['sha256']
        blob = resolve(d['sha256'])
        raw = blob.read_bytes()
        assert len(raw) == d['size'] and hashlib.sha512(raw).hexdigest() == d['sha512']
        source_records[d['sha256']] = {'path': str(blob), 'sha256': d['sha256'], 'sha512': d['sha512'], 'size': len(raw), 'url': d['canonicalUrl']}
        validate_schema(c, 'citation')
        validate_schema(d, 'document')
        with pymupdf.open(blob) as pdf:
            page = pdf[c['page'] - 1]
            text = page.get_text('text', clip=pymupdf.Rect(c['bbox']), flags=0, sort=False)
            assert text == c['quote']
            assert list(page.mediabox) == c['geometry']['mediaBox'] and list(page.cropbox) == c['geometry']['cropBox']
            assert page.rotation == c['geometry']['rotation']
            verify_binding(text, c['engineBinding'])
            u = units[p['citation']['path']]
            words = page.get_text('words', flags=0, sort=False)
            header = ' '.join(w[4] for w in words if pymupdf.Rect(u['headerBBox']).contains(pymupdf.Rect(w[:4])))
            cell = [w for w in words if list(w[:4]) == u['cellBBox']]
            assert header == u['headerLiteral'] and len(cell) == 1 and cell[0][4] == c['engineBinding']['number']['literal']
            assert u['headerBBox'][3] < u['cellBBox'][1]
            assert u['headerBBox'][0] - 25 < (cell[0][0] + cell[0][2]) / 2 < u['headerBBox'][2] + 25
            key = d['sha256'] + ':' + str(c['page'])
            if key not in pages:
                png = page.get_pixmap(dpi=144, clip=pymupdf.Rect(c['bbox']), colorspace=pymupdf.csRGB, alpha=False, annots=False).tobytes('png')
                assert sha(png) == c['facsimile']['sha256']
                assert png == resolve(sha(png)).read_bytes()
                image_path = SCRATCH / (sha(png) + '.png')
                image_path.write_bytes(png)
                pages[key] = {'documentSha256': d['sha256'], 'page': c['page'], 'text': text, 'facsimileSha256': sha(png), 'scratch': str(image_path)}
        assert Decimal(i['value']) == Decimal(c['engineBinding']['value']) and i['unit'] == scope['unit'] == 'EUR'
        row, col = s['tablePath']
        assert s['symbol'] in ('ESTATAL_ORDINARIA_2012_2014', 'ESTATAL_COMPLEMENTARIA_2012_2014')
        table = 'ordinaria' if s['symbol'] == 'ESTATAL_ORDINARIA_2012_2014' else 'complementaria'
        assert c['table'] == {'row': f'escala-{table}-{row}-{col}', 'column': col}
        src = (ROOT / s['file']).read_text().split('export const ' + s['symbol'] + ' = filas([')[1].split('])')[0]
        literals = re.findall(r'\["([0-9.]+)", "([0-9.]+)", "([0-9.]+)"\]', src)
        assert Decimal(literals[int(row)][0 if col == 'baseInferior' else 1]) == Decimal(i['value'])
        citations[p['citation']['path']] = {'ref': p['citation'], 'documentSha256': d['sha256'], 'page': c['page'], 'cellBBox': u['cellBBox'], 'headerBBox': u['headerBBox'], 'header': header, 'number': cell[0][4], 'quote': text, 'facsimile': c['facsimile']}
        context = {'year': scope['year'], 'territory': scope['territory'], 'component': 'estatal', 'taxBase': 'general', 'periodStart': f"{scope['year']}-01-01", 'accrual': f"{scope['year']}-12-31", 'death': None, 'externalConditions': scope['externalConditions']}
        cases = {'nominal-no-es-periodo': rejected(lambda: evaluate_scope(scope, context))}
        for field, wrong in [('year', 2026), ('territory', 'madrid'), ('component', 'autonomico'), ('taxBase', 'ahorro'), ('externalConditions', ['verified'])]:
            bad = dict(context, **{field: wrong})
            cases[field] = rejected(lambda: evaluate_scope(scope, bad))
        for field, wrong in [('value', str(Decimal(i['value']) + 1)), ('itemId', 'inv-' + '0' * 32), ('period', 'ordinary-no-death')]:
            mutated = copy.deepcopy(scope)
            mutated[field] = wrong
            class MutatedReader:
                def read_ref(self, ref):
                    return mutated if ref == p['executableScope'] else reader.read_ref(ref)
            cases['scope-' + field] = rejected(lambda: verify_executable_scope(MutatedReader(), p, i))
        for field, wrong in [('tablePath', [row, 'cuota' if col == 'baseInferior' else 'baseInferior']), ('symbol', 'ESTATAL_COMPLEMENTARIA_2012_2014' if table == 'ordinaria' else 'ESTATAL_ORDINARIA_2012_2014')]:
            mutated = copy.deepcopy(scope)
            mutated['source'][field] = wrong
            bad_p = copy.deepcopy(p)
            bad_p['source'] = mutated['source']
            class CellReader:
                def read_ref(self, ref):
                    return mutated if ref == p['executableScope'] else reader.read_ref(ref)
            cases['celda-' + field] = rejected(lambda: verify_executable_scope(CellReader(), bad_p, i))
        adverses.append({'payloadSha256': r['candidate']['sha256'], 'id': p['id'], 'cases': cases})
        decisions.append({'id': p['id'], 'payload': r['candidate'], 'itemId': p['itemId'], 'source': s, 'year': scope['year'], 'table': table, 'row': int(row), 'column': col, 'value': i['value'], 'unit': 'EUR', 'inventory': pin, 'citation': p['citation'], 'document': p['document'], 'legalReview': p['legalReview'], 'executableScope': p['executableScope'], 'decision': 'accepted-limited', 'scope': p['scope'], 'completeRule': False, 'reason': f"Celda {table}, fila {row}, columna {col}, ejercicio {scope['year']}: texto, geometría, cabecera EUR, fuente efectiva y ámbito nominal coinciden por identidad. La cadena temporal se contrasta separadamente en pasajes-primarios.json.", 'objection': 'Una cifra igual puede proceder de otra tabla, año o columna; la continuidad nominal no selecciona el período del sujeto ni acredita residencia, mínimos o cuota final.', 'response': 'Identidad exacta y columna contrastadas; no se acepta selección temporal. Alcance nominal-only y condiciones externas no verificadas permanecen visibles.', 'cost': 'Atestación candidata individual y nueva aprobación exacta del padre; ninguna regla completa ni migración de confianza.'})
    save('decisiones-78.json', decisions)
    save('reextraccion-26.json', list(citations.values()))
    save('paginas-celdas.json', list(pages.values()))
    save('adversos-78.json', adverses)
    save('fuentes-payloads.json', list(source_records.values()))
    save('dependencias.json', reader.finish())
    print('PAYLOADS', len(decisions), 'CITAS', len(citations), 'PAGINAS', len(pages), 'ADVERSOS', sum(len(a['cases']) for a in adverses), flush=True)


if __name__ == '__main__':
    main()
