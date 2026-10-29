"""Contraste racional exacto; los escenarios no son cuotas fiscales aceptadas."""
import json
import sys
from fractions import Fraction as F
from pathlib import Path


def cents(x: F, mode: str) -> F:
    """Redondeo positivo implementado con cociente y resto enteros."""
    q, r = divmod(x.numerator * 100, x.denominator)
    if mode == 'ROUND_HALF_UP':
        q += 2 * r >= x.denominator
    elif mode == 'ROUND_HALF_EVEN':
        q += 2 * r > x.denominator or (2 * r == x.denominator and q % 2 == 1)
    return F(q, 100)


def main() -> None:
    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    data = json.loads(source.read_text())
    results = []
    rates = {2025: ('4909.50', ['.0077', '.0083', '.0098'], ['.0015', '.0017', '.0019']),
             2026: ('5101.20', ['.0096', '.0104', '.0122'], ['.0019', '.0021', '.0024'])}
    for case in data['casos']:
        cap, er, wr = rates[case['anio']]
        totals = {}
        exact = [F(0), F(0)]
        for mode in ['ROUND_HALF_UP', 'ROUND_HALF_EVEN', 'ROUND_DOWN']:
            totals[mode] = {'por_tramo_y_pagador': [F(0), F(0)], 'suma_tramos_por_pagador': [F(0), F(0)]}
        ordinary = [F(0), F(0)]
        mei = [F(0), F(0)]
        itims = F(0)
        for month in case['meses_enero_diciembre']:
            income = F(month['remuneracion'])
            b = F(cap)
            intervals = [(b, b * F('1.1')), (b * F('1.1'), b * F('1.5')), (b * F('1.5'), max(income, b * F('1.5')))]
            widths = [max(F(0), min(income, hi) - lo) for lo, hi in intervals]
            for payer, rr in enumerate([er, wr]):
                products = [w * F(rate) for w, rate in zip(widths, rr, strict=True)]
                exact[payer] += sum(products)
                for mode, variants in totals.items():
                    variants['por_tramo_y_pagador'][payer] += sum(cents(p, mode) for p in products)
                    variants['suma_tramos_por_pagador'][payer] += cents(sum(products, F(0)), mode)
            base = min(income, b)
            for payer, rr in enumerate([['.236', '.055', '.002', '.006', '.015'], ['.047', '.0155', '.001']]):
                ordinary[payer] += sum(cents(base * F(rate), 'ROUND_HALF_UP') for rate in rr)
            for payer, rate in enumerate(['.0067', '.0013'] if case['anio'] == 2025 else ['.0075', '.0015']):
                mei[payer] += cents(base * F(rate), 'ROUND_HALF_UP')
            itims += cents(base * F('.008'), 'ROUND_HALF_UP') + cents(base * F('.007'), 'ROUND_HALF_UP')
        ok = exact == [F(x) for x in case['solidaridad_anual_analitica']]
        for mode, variants in totals.items():
            for variant, values in variants.items():
                ok = ok and values == [F(x) for x in case['solidaridad_anual_variantes'][mode][variant]]
        results.append({'id': case['id'], 'coincide': ok, 'solidaridad': totals, 'analitica': exact, 'ordinaria': ordinary, 'mei': mei, 'IT_IMS': itims})
    ties = []
    for row in data['empates_positivos']:
        values = [cents(F(row['entrada']), mode) for mode in ['ROUND_HALF_UP', 'ROUND_HALF_EVEN', 'ROUND_DOWN']]
        ties.append({'entrada': row['entrada'], 'valores': values, 'coincide': values == [F(row[k]) for k in ['half_up', 'half_even', 'truncamiento']]})
    output.write_text(json.dumps({'metodo': 'Fraction exacto, sin Decimal ni import del autor', 'casos': results, 'empates': ties}, default=str, indent=2) + '\n')
    assert all(r['coincide'] for r in results + ties)
    print('21 escenarios y 4 empates coinciden con aritmética racional independiente')


if __name__ == '__main__':
    main()
