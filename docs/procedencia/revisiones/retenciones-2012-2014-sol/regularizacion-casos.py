"""Casos documentales independientes de regularización; no importa el motor.

Las 44 instancias cubren once causas en cuatro testimonios, con dos escalas.
No equivalen a 44 cálculos independientes de escala ni aceptación fiscal.
"""
from decimal import Decimal, ROUND_DOWN, ROUND_HALF_UP
import json
from pathlib import Path

D = Decimal
CHECKS: list[dict[str, str]] = []
FIXTURES: list[dict[str, object]] = []


def eq(label: str, actual: Decimal, expected: str) -> None:
    assert actual == D(expected), (label, actual, expected)
    CHECKS.append({'id': label, 'actual': str(actual), 'expected': expected})


def trunc(value: Decimal) -> Decimal:
    return value.quantize(D('.01'), rounding=ROUND_DOWN)


def money(value: Decimal) -> Decimal:
    return value.quantize(D('.01'), rounding=ROUND_HALF_UP)


def quota(base: Decimal, minimum: Decimal, january: bool, alimony: Decimal = D(0)) -> Decimal:
    # Estos casos solo precisan los dos primeros tramos. Expected explícitos
    # abajo, derivados también por diferencias marginales, no del motor.
    threshold = D('17707.20')
    first = D('.24') if january else D('.2475')
    second = D('.28') if january else D('.30')
    fixed = D('4249.73') if january else D('4382.53')

    def scale(value: Decimal) -> Decimal:
        assert D(0) <= value <= D('33007.20')
        return value * first if value < threshold else fixed + (value - threshold) * second

    annuality = alimony if D(0) < alimony < base else D(0)
    return max(D(0), scale(base - annuality) + scale(annuality) - scale(minimum + (D('1600') if annuality else D(0))))


def previous_rate(amount: Decimal, salary: Decimal, qualified: bool = False) -> Decimal:
    raw = trunc(amount * 100 / salary)
    if qualified:
        raw = trunc(raw / 2)
    return raw.quantize(D(1), rounding=ROUND_HALF_UP)


def rate(target: Decimal, retained: Decimal, housing: Decimal, remaining: Decimal) -> Decimal:
    assert remaining > 0
    return trunc(max(D(0), target - retained - housing) * 100 / remaining)


def main() -> None:
    for version in ['2012-enero', '2012-febrero', '2013-anual', '2014-anual']:
        january = version == '2012-enero'
        for cause in range(1, 12):
            key = f'{version}:CAUSA{cause}'
            year = int(version[:4])
            month = '01' if january else '02' if version == '2012-febrero' else '04'
            salary = D('30000')
            spent = D('15000')
            old_salary = D('28000') if cause == 1 else salary
            old_base = D('23948') if cause == 1 else D('25848')
            base = D('22848') if cause == 3 else D('25848')
            old_minimum = D('5151')
            minimum = D('6987') if cause == 2 else old_minimum
            alimony = D('6000') if cause == 4 else D(0)
            old_qualified = cause in [6, 8]
            new_qualified = cause == 7
            old_q = quota(old_base, old_minimum, january)
            new_q = quota(base, minimum, january, alimony)
            old_prev = previous_rate(old_q, old_salary, old_qualified)
            new_prev = previous_rate(new_q, salary, new_qualified)
            old_housing = D('600') if cause == 10 else D(0)
            old_final = old_prev - old_housing * 100 / old_salary
            old_amount = money(old_salary * old_final / 100)
            retained = money(spent * old_final / 100)
            target = salary * new_prev / 100
            housing = D('300') if cause in [9, 10] else D(0)
            if cause == 7:
                target = spent * previous_rate(new_q, salary) / 100 + (salary-spent) * new_prev / 100
            if cause == 8:
                target = spent * previous_rate(new_q, salary, True) / 100 + (salary-spent) * new_prev / 100
            calculated = rate(target, retained, housing, salary-spent)
            ceiling = D('23') if january and new_qualified else D('26') if new_qualified else D('45') if january else D('52')
            calculated = min(calculated, ceiling)
            amount = money(retained + (salary-spent) * calculated / 100)
            reviewed = False
            if cause not in [5, 6, 8, 9, 10, 11]:
                old_difference = max(D(0), old_base-old_minimum)
                new_difference = base-minimum
                if old_difference >= new_difference and calculated > old_final:
                    calculated = old_final
                    reviewed = True
                elif old_difference < new_difference and amount > old_amount:
                    if amount-old_amount > new_difference-old_difference:
                        calculated = rate(old_amount+new_difference-old_difference, retained, D(0), salary-spent)
                        reviewed = True
                amount = money(retained+(salary-spent)*calculated/100)
            expected_quota = {
                1: ('5292.914', '5549.8975'), 2: ('4852.274', '5095.4875'),
                3: ('4452.914', '4649.8975'), 4: ('4668.914', '4838.8975'),
            }.get(cause, ('5292.914', '5549.8975'))[0 if january else 1]
            expected_rate = {
                1: ('19', '18'), 2: ('14', '16'), 3: ('12', '12'),
                4: ('14', '14'), 5: ('18', '18'), 6: ('27', '27'),
                7: ('9', '9'), 8: ('18', '18'), 9: ('16', '16'),
                10: ('18', '18'), 11: ('18', '18'),
            }[cause][0 if january else 1]
            expected_amount = {
                1: ('5400', '5400'), 2: ('4800', '5100'), 3: ('4500', '4500'),
                4: ('4800', '4800'), 5: ('5400', '5400'), 6: ('5400', '5400'),
                7: ('4050', '4050'), 8: ('4050', '4050'), 9: ('5100', '5100'),
                10: ('5100', '5100'), 11: ('5400', '5400'),
            }[cause][0 if january else 1]
            eq(key+':cuota-nueva', new_q, expected_quota)
            eq(key+':tipo', calculated, expected_rate)
            eq(key+':importe-anual', amount, expected_amount)
            assert not reviewed, (key, 'este fixture no activa ajuste87.5; los ajustes tienen casos propios')
            events = {
                1: 'Previsión aumenta28000→30000; cotizaciones1400→1500; sin otros cambios.',
                2: 'Se comunica hijo8 años con derecho exclusivo, antes no convivía; mínimo5151→6987.',
                3: 'Resolución judicial nueva: compensatoria3000 al cónyuge, sin anualidad.',
                4: 'Resolución judicial nueva: anualidad6000 hijo sin derecho al mínimo; no compensatoria.',
                5: 'Cónyuge pasa de0 a2000 rentas no exentas; situación2→3, a30000 tabla no cambia resultado.',
                6: 'Pérdida residencia Ceuta; nuevo cálculo fuera, historia íntegra cualificada. Resultado documental con reserva jurídica de tratamiento del pasado.',
                7: 'Adquiere residencia Ceuta y trabajo pendiente cualificado; los15000 anteriores fuera.',
                8: 'Sigue residente Ceuta; empieza trabajo pendiente fuera, los15000 anteriores cualificados.',
                9: 'Nueva comunicación de préstamo adquisición2010 con derecho y agregado30000. No se aplicó minoración antes.',
                10: 'Agregado de todos pagadores pasa35000 por otro pagador; actual permanece30000. Cesa derecho comunicado; minoración previa600.',
                11: 'Continuación de contrato inicialmente inferior al año, art87.2.1, previsión anual total cualificada ya30000 y sin cambio de base/mínimo; no vivienda. La realidad de esa previsión requiere documentación propia.',
            }
            FIXTURES.append({
                'id': key, 'hecho': events[cause], 'edad': 40, 'situacionPersonal': 'activo',
                'fechaHecho': f'{year}-{month}-15', 'fechaComunicacion': f'{year}-{month}-20',
                'fechaConfeccion': f'{year}-{month}-27', 'fechaAbono': f'{year}-{month}-28',
                'correspondenciaPago': f'{year}-{month}', 'politicaPagador': 'regularización inmediata; sin opción trimestral',
                'percibidoTemporal': 'satisfecho antes del hecho; en2012-febrero primera relación/pago desde02/02, sin pago correspondiente a enero',
                'calificacionTerritorial': 'derecho68.4 y calificación de rendimientos se dan como hechos previos acreditados; la fecha sola no los demuestra',
                'situacionFamiliarActual': 'situacion1' if cause == 2 else 'situacion3',
                'descendientesActuales': 'hijo8 exclusivo' if cause == 2 else 'ninguno con mínimo',
                'otrosHechos': 'sin discapacidad, movilidad, prolongación, ascendientes ni otras reducciones',
                'contratoActual': 'general salvo11, continuación de inferioraño sin mínimo vinculante',
                'rentasIrregulares': '0', 'cotizacionesActuales': '1500', 'retribucion': str(salary),
                'percibido': str(spent), 'retenido': str(retained), 'baseAnterior': str(old_base),
                'baseNueva': str(base), 'minimoAnterior': str(old_minimum), 'minimoNuevo': str(minimum),
                'cuotaAnterior': str(old_q), 'cuotaNueva': str(new_q), 'tipoPrevioAnterior': str(old_prev),
                'tipoPrevioNuevo': str(new_prev), 'tipoAnterior': str(old_final), 'importeAnterior': str(old_amount),
                'importePrevioNuevoOMezclado': str(target), 'minoracionActual': str(housing),
                'tipoResultante': str(calculated), 'importeResultante': str(amount),
                'historiaEnAPI': 'solo percibido/retenido; antecedentes narrativos no se envían' if cause == 11 and version in ['2013-anual', '2014-anual'] else 'según datos obligatorios p4',
                'deduccion80bis': '0 por base>12000', 'limite43': 'no aplicable por30000>22000',
                'minimosContrato': 'no vinculantes', 'ajuste87_5': 'se examina y no se activa' if cause in [1, 2, 3, 4, 7] else 'rama excluida',
                'citas': [f'{version}:p{p}' for p in [4, 6, 7, 8, 21, 22, 23, 28, 29, 30, 31, 32, 34, 35, 36, 37]],
                'alcance': 'esperado documental acotado; no respuesta oficial ni prueba del motor',
                'aceptacion': False,
            })
    # Concurrencia1+2: salario28000→30000 e hijo nuevo, cuota calculada por mínimo
    #6987 y base25848; comparación anterior por5151/base23948.
    for january, expected_quota, expected_rate in [(True, '4852.274', '15'), (False, '5095.4875', '16')]:
        label = 'concurrencia1+2:'+str(january)
        q = quota(D('25848'), D('6987'), january)
        previous = D('17') if january else D('18')
        target = D('30000') * previous_rate(q, D('30000')) / 100
        actual = rate(target, D('15000')*previous/100, D(0), D('15000'))
        eq(label+':cuota', q, expected_quota)
        eq(label+':tipo', actual, expected_rate)
    # Concurrencia1+3+4: previsión aumenta, compensatoria3000 y anualidad6000
    # distintas; la anualidad no resta base. Total anterior28000, base23948.
    # Después de la compensatoria BASE-A=16848, ya en primer tramo:
    # (22848-5151-1600)*.24=3863.28; *.2475=3984.0075.
    # Se preserva el rojo del esperado inicial que suponía segundo tramo.
    for january, expected_quota in [(True, '3863.28'), (False, '3984.0075')]:
        label = 'concurrencia1+3+4:'+str(january)
        q = quota(D('22848'), D('5151'), january, D('6000'))
        eq(label+':cuota', q, expected_quota)
        target = D('30000') * previous_rate(q, D('30000')) / 100
        held = D('2550') if january else D('2700')
        eq(label+':tipo', rate(target, held, D(0), D('15000')), '9' if january else '8')
    # Concurrencia7+vivienda: misma renta y mínimo, comienza residencia y
    # se conserva vivienda ya minorada600; pendiente soporta tipo7%.
    eq('concurrencia7+vivienda:tipo', rate(D('4050'), D('2400'), D('600'), D('15000')), '7')
    eq('concurrencia7+vivienda:importe', D('2400')+D('15000')*D('.07'), '3450')
    # Aumento de previsión28000→30000 junto con adquisición de residencia:
    # aplicar los tipos nuevos18/9 a cada parte, conservando retenido real
    #2550 de enero o2700 de escala incrementada. Diferencia base crece1900;
    #importe4050 no excede el anterior4760/5040, por lo que87.5 no limita.
    for january, held, expected in [(True,'2550','10'),(False,'2700','9')]:
        target = D('15000')*D('.18')+D('15000')*D('.09')
        eq('concurrencia1+7:objetivo:'+str(january), target, '4050')
        eq('concurrencia1+7:tipo:'+str(january), rate(target,D(held),D(0),D('15000')),expected)
    # Un hijo8 con mínimo exclusivo y otro hijo no conviviente, beneficiario
    #de anualidad6000 judicial: no atribuir mínimo al mismo beneficiario.
    for january, expected_q, expected_type in [(True,'4228.274','14'),(False,'4384.4875','15')]:
        q = quota(D('25848'),D('6987'),january,D('6000'))
        eq('minimo+anualidad:cuota:'+str(january),q,expected_q)
        eq('minimo+anualidad:previo:'+str(january),previous_rate(q,D('30000')),expected_type)
    # Misma familia con un hijo, adquisición2010 comunicada, relación laboral
    #especial sin discapacidad/prisión: vivienda no elimina suelo15/8.
    ordinary = trunc((D('4800')-D('600'))/D('300'))
    eq('vivienda+especial:antes-minimo-enero',ordinary,'14')
    eq('vivienda+especial:tipo-final-enero',max(ordinary,D('15')),'15')
    territorial = trunc((D('2400')-D('600'))/D('300'))
    eq('vivienda+especial-CM:antes-minimo',territorial,'6')
    eq('vivienda+especial-CM:tipo-final',max(territorial,D('8')),'8')
    # Orden de causas9/10 y salario. Cada fase se expresa mediante sus
    # componentes, con RETENIDO constante; no se simula un pago entre fases.
    # Aumento28000→30000: vivienda primero; cuota inicialinc28000=4979.8975,
    # previo18; minoración pendiente260. Segunda fase actualiza260+40=300.
    eq('concurrencia9+aumento:fase1', rate(D('5040'), D('2700'), D('260'), D('13000')), '16')
    eq('concurrencia9+aumento:fase2-minoracion', D('260')+D('40'), '300')
    eq('concurrencia9+aumento:fase2-tipo', rate(D('5400'), D('2700'), D('300'), D('15000')), '16')
    eq('concurrencia10+aumento:fase1', rate(D('5040'), D('2400'), D('300'), D('13000')), '18')
    eq('concurrencia10+aumento:fase2-tipo', rate(D('5400'), D('2400'), D('300'), D('15000')), '18')
    eq('concurrencia9+disminucion:fase1', rate(D('5040'), D('2700'), D(0), D('13000')), '18')
    eq('concurrencia9+disminucion:fase2-minoracion', D('13000')*D('.02'), '260')
    eq('concurrencia9+disminucion:fase2-tipo', rate(D('5040'), D('2700'), D('260'), D('13000')), '16')
    eq('concurrencia10+disminucion:fase1-minoracion', D('600')-D('2000')*D('.02'), '560')
    eq('concurrencia10+disminucion:fase1-tipo', rate(D('5040'), D('2400'), D('560'), D('13000')), '16')
    eq('concurrencia10+disminucion:fase2-minoracion', D('560')-D('13000')*D('.02'), '300')
    eq('concurrencia10+disminucion:fase2-tipo', rate(D('5040'), D('2400'), D('300'), D('13000')), '18')
    #87.5, aumento exclusivo de BASE por0.01: baja previsión de gasto admisible
    #por0.01, sueldo30000 y mínimo5151 constantes. Salto del previo17→18
    #produce aumento300, que excede0.01. Tope5100.01, tipo17, importe5100.
    for january, old_base, new_base, old_q, new_q in [
        (True, '25694.73', '25694.74', '5249.9984', '5250.0012'),
        (False, '24848.34', '24848.35', '5249.9995', '5250.0025'),
    ]:
        label = '87.5:aumento-exclusivo:'+str(january)
        eq(label+':cuota-anterior', quota(D(old_base), D('5151'), january), old_q)
        eq(label+':cuota-nueva', quota(D(new_base), D('5151'), january), new_q)
        eq(label+':previo-anterior', previous_rate(D(old_q), D('30000')), '17')
        eq(label+':previo-nuevo', previous_rate(D(new_q), D('30000')), '18')
        eq(label+':diferencia-base', D(new_base)-D(old_base), '.01')
        eq(label+':tipo-sin-limite', rate(D('5400'), D('2550'), D(0), D('15000')), '19')
        eq(label+':importe-tope', D('5100')+D('.01'), '5100.01')
        eq(label+':tipo-limitado', rate(D('5100.01'), D('2550'), D(0), D('15000')), '17')
        eq(label+':importe-final', money(D('2550')+D('15000')*D('.17')), '5100')
    #87.5, disminución exclusiva de BASE por0.01 al final del año:
    #sueldo14000, gasto1190.37→1190.38, RED20=2809.63 en ambos,
    #base10000→9999.99, mínimo5151, percibido13990; contrato general.
    #El déficit por truncado inicial hace subir el cociente a8.59/9.59,
    #aunque la base baja. Por eso el límite no es un mero supuesto sintético.
    for january, old_q, new_q, old_type, target, held, raw, final in [
        (True, '1163.76', '1163.7576', '6.57', '1120', '919.14', '8.59', '919.80'),
        (False, '1200.1275', '1200.125025', '7.57', '1260', '1059.04', '9.59', '1059.80'),
    ]:
        label = '87.5:disminucion-exclusiva:'+str(january)
        eq(label+':base-anterior', D('14000')-D('1190.37')-D('2809.63'), '10000')
        eq(label+':base-nueva', D('14000')-D('1190.38')-D('2809.63'), '9999.99')
        eq(label+':cuota-anterior', quota(D('10000'), D('5151'), january), old_q)
        eq(label+':cuota-nueva', quota(D('9999.99'), D('5151'), january), new_q)
        eq(label+':deduccion-nueva', D('400')-D('.1')*(D('9999.99')-D('8000')), '200.001')
        eq(label+':retenido', money(D('13990')*D(old_type)/100), held)
        raw_type = rate(D(target)-D('200.001'), D(held), D(0), D('10'))
        eq(label+':tipo-sin-limite', raw_type, raw)
        limited = min(raw_type, D(old_type))
        eq(label+':tipo-limitado', limited, old_type)
        eq(label+':importe-final', money(D(held)+D('10')*limited/100), final)
    directory = Path(__file__).parent
    (directory/'regularizacion-casos.json').write_text(json.dumps(FIXTURES, ensure_ascii=False, indent=2)+'\n')
    (directory/'regularizacion-resultados.json').write_text(json.dumps(CHECKS, ensure_ascii=False, indent=2)+'\n')
    print(f'{len(FIXTURES)} instancias documentales, {len(CHECKS)} aserciones; dos escalas, sin aceptación fiscal ni motor.')


if __name__ == '__main__':
    main()
