"""Aserciones documentales independientes; no importan el motor ni aceptan reglas."""
from decimal import ROUND_DOWN, ROUND_HALF_UP, Decimal

D = Decimal


def entero(x: Decimal) -> Decimal:
    return x.quantize(D('.01'), rounding=ROUND_DOWN).quantize(D('1'), rounding=ROUND_HALF_UP)


def reduccion(rnt: Decimal) -> Decimal:
    if rnt <= D('9180'):
        return D('4080')
    if rnt <= D('13260'):
        return (D('4080') - D('.35') * (rnt - D('9180'))).quantize(D('.01'), rounding=ROUND_HALF_UP)
    return D('2652')


def regularizacion(objetivo: Decimal, retenido: Decimal, pendiente: Decimal) -> Decimal:
    """Subpaso candidato sin mínimos, topes ni circunstancias territoriales."""
    if pendiente <= 0:
        raise ValueError('Dominio no cerrado: remuneración pendiente no positiva')
    return max(D(0), (objetivo - retenido) * 100 / pendiente).quantize(D('.01'), rounding=ROUND_DOWN)


def main() -> None:
    count = 0

    def check(actual: Decimal, expected: str) -> None:
        nonlocal count
        assert actual == D(expected), (actual, expected)
        count += 1

    for rnt, expected in [('9179.99','4080'), ('9180','4080'), ('9180.01','4080.00'),
                          ('13259.99','2652.00'), ('13260','2652'), ('13260.01','2652')]:
        check(reduccion(D(rnt)), expected)
    # Cálculo manual en un mismo tramo, expectativas literales independientes.
    # Viudedad sujeta 31000; edad 40; hijos 5/8/12, por entero, sin rentas.
    # No cotizaciones de activo, vivienda, discapacidad, anualidad ni irregularidad.
    check(D('5151') + D('1836') + D('2040') + D('3672'), '12699')
    check(D('31000') - D('2652') - D('1200'), '27148')
    check(D('31000') - D('2652') - D('600'), '27748')
    # Contrastes de hipótesis; ninguno se declara esperado fiscal aceptado.
    for base, quota, rate in [('27148','3845.394','12'), ('27748','4013.394','13')]:
        computed = D('4249.73') + (D(base)-D('17707.20'))*D('.28') - D('12699')*D('.24')
        check(computed, quota)
        check(entero(computed * 100 / D('31000')), rate)
    for base, quota, rate in [('27148','4071.7675','13'), ('27748','4251.7675','14')]:
        computed = D('4382.53') + (D(base)-D('17707.20'))*D('.30') - D('12699')*D('.2475')
        check(computed, quota)
        check(entero(computed * 100 / D('31000')), rate)
    # Fronteras literales, con cuotas publicadas; discontinuidades subcéntimo preservadas.
    for edge, previous, oldrate, fixed, newrate, expected in [
        ('120000.20','17132.53','.47','48431.24','.49',['48431.2353','48431.24','48431.2449']),
        ('175000.20','48431.24','.49','75381.24','.51',['75381.2351','75381.24','75381.2451']),
        ('300000.20','75381.24','.51','139131.24','.52',['139131.2349','139131.24','139131.2452']),
    ]:
        lower = {'120000.20':'53407.20','175000.20':'120000.20','300000.20':'175000.20'}[edge]
        check(D(previous)+(D(edge)-D('.01')-D(lower))*D(oldrate), expected[0])
        check(D(fixed), expected[1])
        check(D(fixed)+D('.01')*D(newrate), expected[2])
    for value, expected in [('21.49','21'), ('21.50','22'), ('21.51','22')]:
        check(entero(D(value)), expected)
    check(D('.005').quantize(D('.01'), rounding=ROUND_HALF_UP), '.01')
    check(regularizacion(D('4000'), D('1000'), D('10000')), '30')
    check(regularizacion(D('4000'), D('5000'), D('10000')), '0')
    for pending in ['0','-.01']:
        try:
            regularizacion(D('4000'), D('1000'), D(pending))
        except ValueError:
            count += 1
        else:
            raise AssertionError('No rechazó divisor no positivo')
    print(f'{count} aserciones ejecutadas; expectativas literales; cero llamadas al motor; aceptación fiscal false.')


if __name__ == '__main__':
    main()
