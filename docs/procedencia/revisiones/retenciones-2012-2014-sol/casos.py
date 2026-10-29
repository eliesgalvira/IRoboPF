"""Oráculo documental acotado: Decimal contra racionales/literales, sin motor."""
from decimal import ROUND_DOWN, ROUND_HALF_UP, Decimal
from fractions import Fraction
import json
from pathlib import Path

D = Decimal
RESULTS: list[dict[str, str]] = []


def check(name: str, actual: Decimal, expected: str | Fraction) -> None:
    wanted = D(expected.numerator) / D(expected.denominator) if isinstance(expected, Fraction) else D(expected)
    assert actual == wanted, (name, actual, wanted)
    RESULTS.append({'id': name, 'actual': str(actual), 'expected': str(wanted)})


def trunc(value: Decimal) -> Decimal:
    return value.quantize(D('.01'), rounding=ROUND_DOWN)


def nearest(value: Decimal) -> Decimal:
    return value.quantize(D('1'), rounding=ROUND_HALF_UP)


def reduction(value: Decimal) -> Decimal:
    result = D('4080') if value <= D('9180') else D('4080') - D('.35') * (value-D('9180')) if value <= D('13260') else D('2652')
    return result.quantize(D('.01'), rounding=ROUND_HALF_UP)


def quotient(target: Decimal, retained: Decimal, housing: Decimal, deduction: Decimal, remaining: Decimal) -> Decimal:
    if remaining <= 0:
        raise ValueError('El PDF valida RETRIB > PERCIBIDO; no hay cociente fiscal para este dominio')
    return trunc(max(D(0), (target-retained-housing-deduction)*100/remaining))


def main() -> None:
    for value, expected in [('9179.99','4080'),('9180','4080'),('9180.01','4080'),('13259.99','2652'),('13260','2652'),('13260.01','2652')]:
        check('reduccion-'+value, reduction(D(value)), expected)
    # Cada fila usa cuota fija publicada; el esperado racional se calcula con otra representación.
    scales = {
        'enero': [('0','0','24'),('17707.20','4249.73','28'),('33007.20','8533.73','37'),('53407.20','16081.73','43'),('120000.20','44716.72','44'),('175000.20','68916.72','45')],
        'incrementada': [('0','0','24.75'),('17707.20','4382.53','30'),('33007.20','8972.53','40'),('53407.20','17132.53','47'),('120000.20','48431.24','49'),('175000.20','75381.24','51'),('300000.20','139131.24','52')],
    }
    for version, rows in scales.items():
        for index in range(1, len(rows)):
            for delta in ['-.01','0','.01']:
                edge = D(rows[index][0]) + D(delta)
                row = rows[index-1] if D(delta) < 0 else rows[index]
                actual = D(row[1]) + (edge-D(row[0]))*D(row[2])/100
                rational = Fraction(row[1]) + (Fraction(str(edge))-Fraction(row[0]))*Fraction(row[2])/100
                check(f'escala-{version}-{rows[index][0]}-{delta}', actual, rational)
    # Art.81: ocho celdas válidas y tres situaciones laborales; HIJOS no incrementa exclusión.
    for threshold in ['13662','15617','13335','14774','16952','11162','11888','12519']:
        for increment in ['0','600','1200']:
            limit = D(threshold)+D(increment)
            for delta in ['-.01','0','.01']:
                check(f'exclusion-{threshold}-{increment}-{delta}', D(int(limit+D(delta) <= limit)), '1' if D(delta) <= 0 else '0')
    check('minimo-tres-hijos-exclusivos', D('5151')+D('1836')+D('2040')+D('3672'), '12699')
    check('minimo-tres-hijos-mitad', D('5151')+(D('1836')+D('2040')+D('3672'))/2, '8925')
    check('ascendiente-75-reparto-tres', (D('918')+D('1122'))/3, '680')
    check('discapacidad-65-asistencia', D('7038')+D('2316'), '9354')
    check('incremento-mayores-65', D('5151')+D('918'), '6069')
    check('incremento-mayores-75', D('5151')+D('918')+D('1122'), '7191')
    # Diferencia anual del PDFp23: >64 y >74, aunque los epígrafes dicen >65/>75.
    # No equivale a decidir por intuición la fecha civil de todo hecho familiar.
    for year in [2012,2013,2014]:
        for difference, expected in [(64,'5151'),(65,'6069'),(66,'6069'),(74,'6069'),(75,'7191'),(76,'7191')]:
            birth_year=year-difference
            minimum = D('5151')+(D('918') if year-birth_year>64 else D(0))+(D('1122') if year-birth_year>74 else D(0))
            check(f'nacimiento-minimo-{year}-{birth_year}', minimum, expected)
    check('manual-jornal-100', D('87.43')*100, '8743')
    check('remuneracion-irregular-gastos', max(D(0),D('50000')-D('8000')-D('1000')-D('3000')), '38000')
    check('irregular-tope-reduccion-no-ingreso', D('300000')*D('.40'), '120000')
    check('activo-movil-prolongacion-discapacidad', max(D(0),D('20000')-D('2652')*3-D('7242')), '4802')
    check('pension-compensatoria-base', max(D(0),D('20000')-D('2652')-D('3000')), '14348')
    # RRO-09: pensión de viudedad contributiva sujeta reconocida20000/año,
    # tres hijos menores elegibles exclusivos; no se calcula prestación SS.
    # Ambas bases quedan en primer tramo; límite43=1626.69 no vincula.
    for reduction_total, base in [('1200','16148'),('600','16748')]:
        check('RRO09-base-'+reduction_total, D('20000')-D('2652')-D(reduction_total),base)
        for version, first_rate, expected, result in [
            ('enero','.24','827.76' if base=='16148' else '971.76','4' if base=='16148' else '5'),
            ('incrementada','.2475','853.6275' if base=='16148' else '1002.1275','4' if base=='16148' else '5'),
        ]:
            quota=(D(base)-D('12699'))*D(first_rate)
            check('RRO09-cuota-'+version+'-'+reduction_total,quota,expected)
            check('RRO09-entero-'+version+'-'+reduction_total,nearest(trunc(quota*100/D('20000'))),result)
            assert quota < (D('20000')-D('15617')-D('600'))*D('.43')
    check('RRO09-limite43', (D('20000')-D('15617')-D('600'))*D('.43'), '1626.69')
    # Especialidad anualidades: base 24000, anualidades 6000, mínimo 5151, escala incrementada.
    check('anualidades-cuota1',D('4382.53')+(D('18000')-D('17707.20'))*D('.30')+D('6000')*D('.2475'),'5955.37')
    check('anualidades-cuota2', (D('5151')+D('1600'))*D('.2475'),'1670.8725')
    check('anualidades-cuota',D('5955.37')-D('1670.8725'),'4284.4975')
    for amount,expected in [('0','0'),('.01','1'),('23999.99','1'),('24000','0'),('24000.01','0')]:
        check('rama-anualidad-'+amount,D(int(D(0)<D(amount)<D('24000'))),expected)
    for base, expected in [('7999.99','400'),('8000','400'),('8000.01','399.999'),('11999.99','.001'),('12000','0'),('12000.01','0')]:
        deduction=D('400') if D(base)<=8000 else max(D(0),D('400')-D('.1')*(D(base)-8000))
        check('80bis-'+base,deduction,expected)
    for salary,eligible in [('21999.99','1'),('22000','1'),('22000.01','0')]:
        check('limite43-condicion-'+salary,D(int(D(salary)<=22000)),eligible)
    check('limite43-22000-s3-cero', (D('22000')-D('11162'))*D('.43'),'4660.34')
    for edge in ['22000','33007.20']:
        for delta in ['-.01','0','.01']:
            check('vivienda-estricto-'+edge+'-'+delta,D(int(D(edge)+D(delta)<D(edge))),'1' if D(delta)<0 else '0')
    check('vivienda-truncada', trunc(D('33007.19')*D('.02')), '660.14')
    for raw,expected in [('21.499','21'),('21.50','22'),('21.509','22')]:
        check('redondeo-entero-'+raw, nearest(trunc(D(raw))),expected)
    check('territorial-orden',nearest(trunc(trunc(D('21.50'))/2)),'11')
    check('importe-empate',D('1.005').quantize(D('.01'),rounding=ROUND_HALF_UP),'1.01')
    # Componentes independientes, no casos íntegros de nómina ni pruebas del motor.
    for cause in range(1,12):
        for version in ['2012-enero','2012-febrero','2013-anual','2014-anual']:
            check(f'{version}-CAUSA{cause}-cociente-control',quotient(D('6000'),D('1500'),D(0),D(0),D('15000')),'30')
    check('mezcla-adquiere-residencia',D('15000')*D('.20')+D('15000')*D('.10'),'4500')
    check('mezcla-sale-trabajo',D('15000')*D('.10')+D('15000')*D('.20'),'4500')
    check('mezcla-cociente',quotient(D('4500'),D('1500'),D(0),D(0),D('15000')),'20')
    check('retenido-superior',quotient(D('1000'),D('1500'),D(0),D(0),D('15000')),'0')
    for remaining in ['0','-.01']:
        try:
            quotient(D('6000'),D('1500'),D(0),D(0),D(remaining))
        except ValueError:
            RESULTS.append({'id':'divisor-'+remaining,'actual':'rechazo','expected':'rechazo'})
        else:
            raise AssertionError('Divisor no rechazado')
    check('C9-inicio', D('.02')*(D('30000')-D('15000')),'300')
    check('C10-cese', D('600')-D('.02')*(D('30000')-D('15000')),'300')
    check('C11-febrero-con-historia',D('400')+D('.02')*(D('30000')-D('28000')),'440')
    check('C11-2013-sin-historia',D('.02')*(D('30000')-D('15000')),'300')
    check('C1-vivienda-aumento',D('400')+D('.02')*(D('30000')-D('28000')),'440')
    check('C1-vivienda-disminucion',D('600')-D('.02')*(D('28000')-D('26000')),'560')
    for ceiling in ['45','23','52','26']:
        for delta in ['-.01','0','.01']:
            check('tope-'+ceiling+'-'+delta,min(D(ceiling)+D(delta),D(ceiling)),Fraction(ceiling)+Fraction(delta) if D(delta)<0 else ceiling)
    check('87.5-no-sube',min(D('30'),D('20')),'20')
    check('87.5-incremento-base', (D('21000')-D('6000'))-(D('20000')-D('6000')),'1000')
    check('87.5-cuota-limitada',D('4000')+D('1000'),'5000')
    check('87.5-tipo-recalculado',quotient(D('5000'),D('1500'),D(0),D(0),D('15000')),'23.33')
    check('87.5-importe-truncado', D('15000')*D('.2333')+D('1500'),'4999.50')
    check('87.5-reaplica-minimo-especial',max(D('1'),D('15')),'15')
    # Cálculo inicial íntegro acotado: activo40,soltero,sin familia,30000,
    # cotizaciones1500 dadas,sin irregularidad,movilidad,discapacidad ni vivienda.
    check('ordinario-RNT',D('30000')-D('1500'),'28500')
    check('ordinario-base',D('28500')-reduction(D('28500')),'25848')
    january_quota=D('4249.73')+(D('25848')-D('17707.20'))*D('.28')-D('5151')*D('.24')
    increased_quota=D('4382.53')+(D('25848')-D('17707.20'))*D('.30')-D('5151')*D('.2475')
    check('ordinario-cuota-enero',january_quota,'5292.914')
    check('ordinario-cuota-incrementada',increased_quota,'5549.8975')
    check('ordinario-previo-enero',nearest(trunc(january_quota/300)),'18')
    check('ordinario-previo-incrementado',nearest(trunc(increased_quota/300)),'18')
    check('ordinario-importe-enero',D('30000')*D('.18'),'5400')
    check('ordinario-importe-incrementado',D('30000')*D('.18'),'5400')
    # Variante con derecho y comunicación vivienda ya acreditados en régimen único.
    check('ordinario-vivienda-minoracion',trunc(D('30000')*D('.02')),'600')
    check('ordinario-vivienda-tipo',trunc((D('5400')-D('600'))/300),'16')
    check('ordinario-vivienda-importe',D('30000')*D('.16'),'4800')
    # Contraejemplo del prefijo por discapacidad: primer hijo mayor sin discapacidad,
    # segundo menor con65%; ambos elegibles y por entero, sin reordenar por categoría.
    disabilities=[D(0),D('7038')]
    check('familia-discapacidad-por-identidad',sum(disabilities,D(0)),'7038')
    check('familia-prefijo-literal-no-oracle',sum(disabilities[:1],D(0)),'0')
    check('familia-asistencia-segundo',D('2316'),'2316')
    check('familia-minimo-dos-hijos-discapacidad',D('5151')+D('1836')+D('2040')+D('7038')+D('2316'),'18381')
    for income,expected in [('7999.99','1'),('8000','1'),('8000.01','0')]:
        check('familiar-renta-'+income,D(int(D(income)<=8000)),expected)
    for age,disabled,expected in [(24,False,'1'),(25,False,'0'),(25,True,'1'),(64,True,'1')]:
        check(f'edad-descendiente-{age}-{disabled}',D(int(age<25 or disabled)),expected)
    for degree,expected in [('32.99','0'),('33','2316'),('33.01','2316'),('64.99','2316'),('65','7038'),('65.01','7038')]:
        check('discapacidad-'+degree,D('7038') if D(degree)>=65 else D('2316') if D(degree)>=33 else D(0),expected)
    for income,expected in [('1499.99','1'),('1500','1'),('1500.01','0')]:
        check('conyuge-renta-'+income,D(int(D(income)<=1500)),expected)
    for resident,qualified,expected in [(False,False,'0'),(False,True,'0'),(True,False,'0'),(True,True,'1')]:
        check(f'territorial-derecho-{resident}-{qualified}',D(int(resident and qualified)),expected)
    for contract_floor in ['15','2','8','1']:
        check('exclusion-con-minimo-'+contract_floor,max(D(0),D(contract_floor)),contract_floor)
    Path(__file__).with_name('casos-resultados.json').write_text(json.dumps(RESULTS,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(RESULTS)} aserciones; racionales y literales independientes; 44 controles de cociente comparten fórmula y NO prueban 44 ramas completas; aceptación false.')


if __name__ == '__main__':
    main()
