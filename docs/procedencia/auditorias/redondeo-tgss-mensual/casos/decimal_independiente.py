"""Variantes aritméticas; ninguna política mensual se declara regla TGSS aceptada."""
import json
from decimal import Decimal, ROUND_HALF_UP, ROUND_DOWN, ROUND_HALF_EVEN
from pathlib import Path

D = Decimal
OUT = Path(__file__).resolve().parent
RATES = {
    2025: ('4909.50', ['.0077', '.0083', '.0098'], ['.0015', '.0017', '.0019']),
    2026: ('5101.20', ['.0096', '.0104', '.0122'], ['.0019', '.0021', '.0024']),
}


def q(value, mode=ROUND_HALF_UP):
    return value.quantize(D('.01'), rounding=mode)


def month(value, year):
    maximum, employer, worker = RATES[year]
    cap = D(maximum)
    income = D(value)
    widths = [max(D(0), min(income, cap * D('1.1')) - cap),
              max(D(0), min(income, cap * D('1.5')) - cap * D('1.1')),
              max(D(0), income - cap * D('1.5'))]
    parts = [[b * D(t) for b, t in zip(widths, rates, strict=True)]
             for rates in (employer, worker)]
    variants = {}
    for mode in (ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_DOWN):
        variants[mode] = {
            'por_tramo_y_pagador': [sum(q(x, mode) for x in p) for p in parts],
            'suma_tramos_por_pagador': [q(sum(p), mode) for p in parts],
            'empresa_por_diferencia_total_menos_trabajador':
                sum(q(a + b, mode) - q(b, mode) for a, b in zip(*parts, strict=True)),
        }
    base = min(income, cap)
    ordinary = [[base * D(t) for t in rates] for rates in
                (['.236', '.055', '.002', '.006', '.015'], ['.047', '.0155', '0', '.001', '0'])]
    mei = [base * D(t) for t in (['.0067', '.0013'] if year == 2025 else ['.0075', '.0015'])]
    return {'remuneracion': value, 'base_ordinaria': base, 'bases_solidaridad': widths,
            'solidaridad_analitica_por_tramo': parts, 'variantes': variants,
            'ordinaria_conceptos_CC_desempleo_FOGASA_FP_AT_agregado': ordinary,
            'ordinaria_half_up_por_concepto': [sum(q(x) for x in p) for p in ordinary],
            'ordinaria_half_up_tipo_agregado': [q(sum(p)) for p in ordinary],
            'AT_EP_half_up_IT_008_IMS_007': q(base * D('.008')) + q(base * D('.007')),
            'mei_analitico': mei, 'mei_half_up': [q(x) for x in mei]}


def run():
    inputs = [('uniforme_11041_67', 2025, ['11041.67'] * 12),
              ('reparto_132500', 2025, ['11041.67'] * 8 + ['11041.66'] * 4),
              ('variables_132500', 2025, ['3000.00'] * 6 + ['19083.33'] * 4 + ['19083.34'] * 2)]
    for year, (cap, _, _) in RATES.items():
        for factor in ('1', '1.1', '1.5'):
            for offset in ('-.01', '0', '.01'):
                value = q(D(cap) * D(factor) + D(offset))
                inputs.append((f'limite_{year}_{factor}_{offset}', year, [str(value)] * 12))
    results = []
    for name, year, values in inputs:
        months = [month(value, year) for value in values]
        analytical = [sum(sum(m['solidaridad_analitica_por_tramo'][payer]) for m in months)
                      for payer in range(2)]
        totals = {mode: {variant: [sum(m['variantes'][mode][variant][p] for m in months)
                                  for p in range(2)]
                         for variant in ('por_tramo_y_pagador', 'suma_tramos_por_pagador')}
                  for mode in (ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_DOWN)}
        if name == 'reparto_132500':
            assert analytical == [D('673.42246'), D('132.74372')]
            assert totals[ROUND_HALF_UP]['por_tramo_y_pagador'] == [D('673.44'), D('132.84')]
        results.append({'id': name, 'anio': year, 'meses_enero_diciembre': months,
                        'salario_anual': sum(D(x) for x in values),
                        'solidaridad_anual_analitica': analytical,
                        'solidaridad_anual_variantes': totals})
    assert results[1]['salario_anual'] == D('132500')
    assert results[1]['solidaridad_anual_analitica'] == [D('673.42246'), D('132.74372')]
    ties = [{'entrada': x, 'half_up': q(D(x)), 'half_even': q(D(x), ROUND_HALF_EVEN),
             'truncamiento': q(D(x), ROUND_DOWN)} for x in ('0.005', '1.005', '1.015', '4.905')]
    output = {'estado': 'experimento aritmetico, no cuota TGSS aceptada',
              'hipotesis': 'Un trabajador, RG mensual, un tramo temporal por mes, alta completa, indefinido, sin extras no prorrateadas, sin HE, sin especialidades. Mínimos no auditados; AT 1.5% supuesto, variante IT/IMS separada.',
              'casos': results, 'empates_positivos': ties}
    (OUT / 'resultados.json').write_text(json.dumps(output, default=str, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(results)} casos mensuales y {len(ties)} empates: controles correctos')


if __name__ == '__main__':
    run()
