"""Comprobaciones documentales independientes; no ejecutan el motor."""
import json
from datetime import date
from decimal import ROUND_DOWN, ROUND_HALF_UP, Decimal
from fractions import Fraction
from pathlib import Path

D = Decimal
TABLES = {
    'enero': [('0', '0', '20'), ('12450', '2490', '25'), ('20200', '4427.50', '31'), ('34000', '8705.50', '39'), ('60000', '18845.50', '47')],
    'julio': [('0', '0', '19.5'), ('12450', '2427.75', '24.5'), ('20200', '4326.50', '30.5'), ('34000', '8535.50', '38'), ('60000', '18415.50', '46')],
    '2016': [('0', '0', '19'), ('12450', '2365.50', '24'), ('20200', '4225.50', '30'), ('35200', '8725.50', '37'), ('60000', '17901.50', '45')],
}


def scale(value: Decimal, version: str) -> Decimal:
    lower, fixed, rate = next(row for row in reversed(TABLES[version]) if value >= D(row[0]))
    return D(fixed) + (value - D(lower)) * D(rate) / 100


def select(payment: date, august: bool) -> tuple[str, int, int]:
    if payment.year == 2016:
        return '2016', 45, 23
    if payment.year != 2015:
        raise ValueError('Fuera del contrato documental')
    boundary = date(2015, 8, 1) if august else date(2015, 7, 12)
    return ('enero', 47, 24) if payment < boundary else ('julio', 46, 23)


def main() -> None:
    results: list[dict[str, str]] = []
    for version, expected in [('enero', '5605.50'), ('julio', '5485.50'), ('2016', '5365.50')]:
        actual = scale(D('24000'), version)
        assert actual == D(expected)
        results.append({'case': 'ejemplo-publicado-' + version, 'actual': str(actual), 'expected': expected})
        rows = TABLES[version]
        for i in range(1, len(rows)):
            lower, fixed, rate = map(D, rows[i])
            prior_lower, prior_fixed, prior_rate = map(D, rows[i - 1])
            # Dos representaciones aritméticas; no dos autoridades jurídicas.
            for delta in ['-.01', '0', '.01']:
                value = lower + D(delta)
                anchor, quota, marginal = (prior_lower, prior_fixed, prior_rate) if D(delta) < 0 else (lower, fixed, rate)
                rational = Fraction(quota) + (Fraction(value) - Fraction(anchor)) * Fraction(marginal) / 100
                actual = scale(value, version)
                assert Fraction(actual) == rational
                results.append({'case': f'frontera-{version}-{value}', 'actual': str(actual), 'rational': str(rational)})
    for day, august, expected_selection in [
        ('2015-07-11', False, ('enero', 47, 24)),
        ('2015-07-12', False, ('julio', 46, 23)),
        ('2015-07-12', True, ('enero', 47, 24)),
        ('2015-07-31', True, ('enero', 47, 24)),
        ('2015-08-01', True, ('julio', 46, 23)),
        ('2016-01-01', False, ('2016', 45, 23)),
    ]:
        actual_selection = select(date.fromisoformat(day), august)
        assert actual_selection == expected_selection
        results.append({'case': f'fecha-{day}-{august}', 'actual': str(actual_selection), 'expected': str(expected_selection)})
    for value_text, expected in [('11249.99', '3700.00'), ('11250', '3700.00'), ('11250.01', '3699.99'), ('14449.99', '.01'), ('14450', '0'), ('14450.01', '0')]:
        rnt = D(value_text)
        raw = D(3700) if rnt <= 11250 else D(3700) - D('1.15625') * (rnt - 11250) if rnt <= 14450 else D(0)
        actual = raw.quantize(D('.01'), rounding=ROUND_HALF_UP)
        assert actual == D(expected)
        results.append({'case': 'reduccion-' + value_text, 'raw': str(raw), 'actual': str(actual), 'expected': expected})
    # DT12: capital de plan de pensiones, aportaciones anteriores a 2007,
    # contingencia y capital en 2016, antigüedad >2 años, sin gasto de activo.
    gross, irregular, ss = D(3000), D(1200), D(0)
    rnt = gross - irregular - ss
    legal_expense = min(D(2000), rnt)
    literal_expense = min(D(2000), gross - ss)
    assert (rnt, legal_expense, literal_expense) == (D(1800), D(1800), D(2000))
    assert max(D(0), rnt - legal_expense - D(3700)) == max(D(0), rnt - literal_expense - D(3700)) == 0
    results.append({'case': 'RRO08-DT12', 'rnt': str(rnt), 'gastoLegal': str(legal_expense), 'gastoPDF': str(literal_expense), 'baseAmbas': '0', 'efectoRetencion': '0'})
    for target, expected in [('6000', '30.00'), ('4500', '20.00')]:
        actual = ((D(target) - 1500) / 15000 * 100).quantize(D('.01'), rounding=ROUND_DOWN)
        assert actual == D(expected)
        results.append({'case': 'julio-hipotesis-' + target, 'actual': str(actual), 'expected': expected})
    assert D('.005').quantize(D('.01'), rounding=ROUND_HALF_UP) == D('.01')
    assert D('17.85964523').quantize(D('.01'), rounding=ROUND_DOWN) == D('17.85')
    Path(__file__).with_name('casos-resultados.json').write_text(json.dumps({'cases': results, 'aceptacionFiscal': False}, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(results)} escenarios comprobados; 57 aserciones ejecutadas; sin motor ni fix.')


if __name__ == '__main__':
    main()
