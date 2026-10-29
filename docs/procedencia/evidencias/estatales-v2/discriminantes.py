"""Casos documentales: identidad, columna, valor y ámbito."""
import copy
import sys
from decimal import Decimal

sys.dont_write_bytecode = True

from reproducir import OUT, ROOT, read, write  # noqa: E402
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
from corpus import verify_binding  # noqa: E402
from enlaces import location_matches, select_decision  # noqa: E402

cases = []
for u in read(OUT / 'unidades-geometricas-26.json'):
    c = read(ROOT / u['citation']['path'])
    b = c['engineBinding']
    verify_binding(c['quote'], b)
    bad = copy.deepcopy(b)
    bad['value'] = str(Decimal(b['value']) + 1)
    try:
        verify_binding(c['quote'], bad)
    except ValueError:
        cases.append({'id': u['id'], 'alteredNumberRejected': True, 'oldUnrelatedUnitRejectedByGeometry': u['oldUnit']['start'] != b['unit']['start']})
    else:
        raise AssertionError('Número alterado aceptado')
for component in ('ordinaria', 'complementaria'):
    base = read(OUT / f'citas/escala-{component}-1-baseInferior.json')
    quota = read(OUT / f'citas/escala-{component}-1-cuota.json')
    assert base['engineBinding']['unit']['literal'] == 'euros'
    assert quota['engineBinding']['unit']['literal'] == 'Euros'
    assert base['engineBinding']['unit']['start'] != quota['engineBinding']['unit']['start']
    cases.append({'id': component, 'baseAndQuotaHeadersDistinct': True})
rows = read(OUT / 'matriz-canonica-78.json')
for row in rows:
    assert row['scope']['year'] in row['technicalYears']
    assert row['scope']['territory'] not in row['technicalTerritories']
    p = read(OUT / 'payloads' / (row['id'] + '.json'))
    ds = read(ROOT / p['legalReview']['decisions']['path'])
    try:
        select_decision(ds, 'EEA-CUOTAS-FIJAS')
    except ValueError as error:
        assert str(error) == 'Decisión jurídica ambigua o sin alcance explícito'
    else:
        raise AssertionError('La decisión histórica sin contrato vigente fue admitida')
    d = next(d for d in ds if d['id'] == 'EEA-CUOTAS-FIJAS')
    assert not any(location_matches(loc, p['source']) for loc in d['engineLocations'])
assert len({r['itemId'] for r in rows}) == 26
assert Decimal('17707.20') * Decimal('.12') != Decimal('2124.86')
assert Decimal('17707.20') * Decimal('.0075') != Decimal('132.80')
contexts = read(OUT / 'contexto-compuesto.json')['orderedPassages']
assert [read(ROOT / c['path'])['page'] for c in contexts] == [62, 63]
assert 'descendientes' in read(ROOT / contexts[0]['path'])['quote']
assert '7.038' in read(ROOT / contexts[1]['path'])['quote']
write('discriminantes.json', {'cases': cases, 'blockedScopeCases': 78, 'legalLocationRejectedCases': 78, 'legalDecisionSchemaRejectedCases': 78, 'distinctEffectiveIdentities': 26, 'compositePages': [62, 63], 'publishedQuotaNotUnroundedIntegral': True, 'acceptance': False})
print('28 casos documentales, 78 ámbitos bloqueados, 78 localizaciones rechazadas, contexto compuesto y cuotas publicados comprobados.')
