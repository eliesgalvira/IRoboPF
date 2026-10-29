"""Adversos sobre bytes recibidos y ámbitos reales, sin aprobación operativa."""
import copy
import gzip
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/multiplicidad-r27-sol'
TREE = ROOT / '.cache/multiplicidad-r27-sol/despues-acotado'
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
from enlaces import ValidationError, DocumentaryReadSet, evaluate_scope, verify_attestation, verify_executable_scope  # noqa: E402


def main():
    entries = json.loads((TREE / 'docs/procedencia/enlaces/registro.json').read_bytes())['entries']
    items = {}
    for name, raw in json.loads(gzip.decompress((ROOT / 'docs/procedencia/inventario-datos.json.gz').read_bytes())):
        if name.startswith('inventario-pagina-'):
            items.update({i['id']: i for i in json.loads(raw)})
    reader = DocumentaryReadSet(TREE)
    results = []
    subjects: dict[str, list[str]] = {}
    for entry in entries:
        p = reader.read_ref(entry['payload'])
        s = verify_executable_scope(reader, p, items[p['itemId']])
        subjects.setdefault(p['itemId'], []).append(entry['payload']['sha256'])
        ctx = {k: s[k] for k in ('year', 'territory', 'component', 'taxBase', 'externalConditions')}
        ctx.update(periodStart=f"{s['year']}-01-01", accrual=f"{s['year']}-12-31", death=None, generalBase='60000.01')
        try:
            result = evaluate_scope(s, ctx)
            assert s['period'] != 'nominal-only'
            assert result['applicability'] == 'not-established' and result['completeRuleAcceptance'] is False
        except ValueError:
            assert s['period'] == 'nominal-only'
        cases = [('contexto ordinario', s['period'] != 'nominal-only')]
        for field, wrong in [('year', s['year'] + 1), ('territory', 'territorio-ajeno')]:
            bad_context = {**ctx, field: wrong}
            try:
                evaluate_scope(s, bad_context)
            except ValueError:
                cases.append((field + ' ajeno rechazado', True))
            else:
                raise AssertionError((field, s))
        if s['territory'] == 'madrid':
            ctx.update(death='2022-06-20', accrual='2022-06-20')
            assert evaluate_scope(s, ctx)['applicability'] == 'not-established'
            cases.append(('Madrid con fallecimiento coherente', True))
        if s['predicate'] == 'murcia-blg-gt-60000':
            for amount in ('59999.99', '60000', '60000.01'):
                ctx['generalBase'] = amount
                try:
                    evaluate_scope(s, ctx)
                    assert amount == '60000.01'
                except ValueError:
                    assert amount != '60000.01'
                cases.append((amount, amount == '60000.01'))
        results.append({'payloadSha256': entry['payload']['sha256'], 'scopeVerified': True, 'cases': cases})
    dependencies = reader.finish()
    first = entries[0]
    payload = reader.read_ref(first['payload'])
    att = reader.read_ref(first['attestation'])
    registry_path = TREE / 'docs/procedencia/enlaces/revisores.json'
    original = registry_path.read_bytes()
    registry = json.loads(original)
    controls = []

    def rejected(label, action):
        try:
            action()
        except (ValueError, FileNotFoundError, ValidationError) as error:
            controls.append({'case': label, 'rejected': True, 'diagnostic': str(error).splitlines()[0][:300]})
        else:
            controls.append({'case': label, 'rejected': False})
            raise AssertionError(label)

    def check(p=payload, a=first['attestation'], h=first['payload']['sha256']):
        return verify_attestation(DocumentaryReadSet(TREE), a, p, h)

    def target(reg):
        return next(r for r in reg['reviewers'] if r['taskId'] == att['reviewTaskId'])

    for label, change in [('aprobación ausente', lambda r: target(r).update(approvals=[])),
                           ('aprobación duplicada', lambda r: target(r)['approvals'].append(next(a for a in target(r)['approvals'] if a['payloadSha256'] == first['payload']['sha256']))),
                           ('tercero no registrado', lambda r: r.update(reviewers=[v for v in r['reviewers'] if v['taskId'] != att['reviewTaskId']]))]:
        altered = copy.deepcopy(registry)
        change(altered)
        registry_path.write_text(json.dumps(altered))
        try:
            rejected(label, check)
        finally:
            registry_path.write_bytes(original)
    rejected('atestación cruzada', lambda: check(a=entries[-1]['attestation']))
    rejected('hash de atestación alterado', lambda: check(a={**first['attestation'], 'sha256': '0' * 64}))
    for key, value in [('authorTaskId', att['reviewTaskId']), ('inventory', {}), ('scope', {})]:
        altered = copy.deepcopy(payload)
        altered[key] = value
        rejected(key, lambda: check(p=altered))
    report_path = TREE / att['report']['path']
    report_raw = report_path.read_bytes()
    try:
        report_path.write_bytes(b'')
        rejected('informe vacío físico', check)
        report_path.write_bytes(b'alterado')
        rejected('informe alterado físico', check)
    finally:
        report_path.write_bytes(report_raw)
    (OUT / 'controles-final.json').write_text(json.dumps({'scopes': results, 'adversos': controls, 'documentaryDependencies': dependencies, 'uniqueSubjects': len(subjects), 'repeatedSubjects': {k: v for k, v in subjects.items() if len(v) > 1}, 'liveRegistrySha256': hashlib.sha256((ROOT / 'docs/procedencia/enlaces/revisores.json').read_bytes()).hexdigest()}, ensure_ascii=False, indent=2) + '\n')
    print('228 ámbitos actuales contrastados; fronteras nominal, Madrid y Murcia; adversos de auxiliar registrados; sujetos únicos', len(subjects))


if __name__ == '__main__':
    main()
