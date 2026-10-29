"""Casos independientes de fronteras e identidad documental; no oracle fiscal."""
import copy
from decimal import Decimal

from revisar import ROOT, checked, load, rejected, save
from corpus import verify_binding
from enlaces import evaluate_scope


def main():
    decisions = load(ROOT / 'docs/procedencia/revisiones/bindings-estatales-r19-sol/decisiones-78.json')
    cases = []
    for d in decisions:
        p = checked(d['payload'])
        scope = checked(p['executableScope'])
        c = checked(p['citation'])
        binding = copy.deepcopy(c['engineBinding'])
        binding['value'] = str(Decimal(binding['value']) + Decimal('0.01'))
        cases.append({'id': p['id'], 'case': 'valor-declarado-mas-un-centimo', 'result': rejected(lambda: verify_binding(c['quote'], binding))})
        for accrual, death in [(f"{d['year']}-02-29", None), (f"{d['year']}-06-30", f"{d['year']}-06-30"), (f"{d['year']}-12-31", None)]:
            ctx = {'year': d['year'], 'territory': 'estatal-comun', 'component': 'estatal', 'taxBase': 'general', 'periodStart': f"{d['year']}-01-01", 'accrual': accrual, 'death': death, 'externalConditions': ['residence-unverified', 'eligibility-unverified']}
            cases.append({'id': p['id'], 'case': 'periodo-' + accrual + '-' + str(death), 'result': rejected(lambda: evaluate_scope(scope, ctx))})
    # Misma base inferior, cuota distinta: identidad antes que igualdad.
    for year in [2012, 2013, 2014]:
        ordinary = next(d for d in decisions if d['year'] == year and d['table'] == 'ordinaria' and d['row'] == 1 and d['column'] == 'baseInferior')
        complementary = next(d for d in decisions if d['year'] == year and d['table'] == 'complementaria' and d['row'] == 1 and d['column'] == 'baseInferior')
        assert Decimal(ordinary['value']) == Decimal(complementary['value']) == Decimal('17707.20')
        assert ordinary['itemId'] != complementary['itemId'] and ordinary['citation'] != complementary['citation']
        cases.append({'case': 'misma-base-dos-escalas', 'year': year, 'ordinary': ordinary['payload'], 'complementary': complementary['payload'], 'result': 'Mismo número; distinta ocurrencia, cabecera y tabla. No se intercambian.'})
    for rate, published in [('0.12', '2124.86'), ('0.0075', '132.80')]:
        integrated = Decimal('17707.20') * Decimal(rate)
        assert integrated != Decimal(published)
        cases.append({'case': 'integral-no-es-cuota-publicada', 'rate': rate, 'base': '17707.20', 'integrated': str(integrated), 'published': published, 'difference': str(integrated - Decimal(published)), 'result': 'La cuantía publicada es el objeto; no se sustituye por producto sin redondear.'})
    save('fronteras.json', cases)
    print('FRONTERAS', len(cases), 'correctas; no acreditan liquidación ni regla de redondeo universal')


if __name__ == '__main__':
    main()
