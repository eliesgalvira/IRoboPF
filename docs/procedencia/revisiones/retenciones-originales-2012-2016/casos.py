"""Casos aritméticos independientes: no ejecutan ni aceptan el motor fiscal."""
import json
from decimal import ROUND_DOWN, ROUND_HALF_UP, Decimal
from pathlib import Path

D = Decimal
OUT = Path('/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-originales-2012-2016')
TABLES = {
    '2012-enero': [('0','0','24'),('17707.20','4249.73','28'),('33007.20','8533.73','37'),('53407.20','16081.73','43'),('120000.20','44716.72','44'),('175000.20','68916.72','45')],
    '2012-febrero': [('0','0','24.75'),('17707.20','4382.53','30'),('33007.20','8972.53','40'),('53407.20','17132.53','47'),('120000.20','48431.24','49'),('175000.20','75381.24','51'),('300000.20','139131.24','52')],
    '2015-enero-revision': [('0','0','20'),('12450','2490','25'),('20200','4427.50','31'),('34000','8705.50','39'),('60000','18845.50','47')],
    '2015-julio-revision': [('0','0','19.5'),('12450','2427.75','24.5'),('20200','4326.50','30.5'),('34000','8535.50','38'),('60000','18415.50','46')],
    '2016-anual': [('0','0','19'),('12450','2365.50','24'),('20200','4225.50','30'),('35200','8725.50','37'),('60000','17901.50','45')],
}
TABLES['2013-anual'] = TABLES['2012-febrero']
TABLES['2014-anual'] = TABLES['2012-febrero']


def money(value):
    return value.quantize(D('.01'), rounding=ROUND_HALF_UP)


def trunc(value):
    return value.quantize(D('.01'), rounding=ROUND_DOWN)


def scale(value, rows):
    lower, fixed, rate = next(row for row in reversed(rows) if value >= D(row[0]))
    return D(fixed) + (value - D(lower)) * D(rate) / 100


def main():
    cases = []
    for version, rows in TABLES.items():
        for lower, _, _ in rows[1:]:
            for delta in ['-.01', '0', '.01']:
                base = D(lower) + D(delta)
                cases.append(dict(version=version, operation='escala-cuota-publicada', base=str(base), exact=str(scale(base, rows)), presented=str(money(scale(base, rows)))))
        historical = int(version[:4]) < 2015
        gross = D('30000')
        base = gross - D('2652' if historical else '2000')
        minimum = D('5151' if historical else '5550')
        quota = scale(base, rows) - scale(minimum, rows)
        rate = trunc(100 * quota / gross)
        if historical:
            rate = rate.quantize(D('1'), rounding=ROUND_HALF_UP)
        cases.append(dict(version=version, operation='inicial-ordinario-candidato', facts={'retribucion':'30000','cotizaciones':'0','edad':40,'situacionFamiliar':3,'familia':[], 'contrato':'general','territorio':'comun','vivienda':False,'regularizacion':False,'movilidad':False,'discapacidad':False,'irregularidad':'0'}, base=str(base), quota=str(quota), rate=str(rate), amount=str(money(gross*rate/100)), limit='Cotizaciones cero sintéticas; expectativa documental candidata, sin aceptación fiscal.'))
    for old, edges in [(True,['9180','13260']),(False,['11250','14450'])]:
        for edge in edges:
            for delta in ['-.01','0','.01']:
                value=D(edge)+D(delta)
                reduction=(D('4080') if value<=D('9180') else D('4080')-D('.35')*(value-D('9180')) if value<=D('13260') else D('2652')) if old else (D('3700') if value<=D('11250') else D('3700')-D('1.15625')*(value-D('11250')) if value<=D('14450') else D('0'))
                cases.append(dict(operation='reduccion', regime='2012-2014' if old else '2015-2016', rnt=str(value), exact=str(reduction), rounded=str(money(reduction))))
    for x in ['.0049','.005','.0051','21.4999','21.5','21.5001']:
        value=D(x)
        cases.append(dict(operation='redondeo-aislado', input=x, centimos=str(money(value)), truncado=str(trunc(value)), enteroTrasTruncar=str(trunc(value).quantize(D('1'),rounding=ROUND_HALF_UP))))
    for remaining, held in [('10000','1000'),('10000','5000'),('0','1000')]:
        numerator=D('4000')-D(held)
        rate=trunc(max(D(0),100*numerator/D(remaining))) if D(remaining)>0 else None
        cases.append(dict(operation='regularizacion-aritmetica-sin-limites', importeObjetivo='4000', retenido=held, restante=remaining, rate=str(rate) if rate is not None else None, decision='rechazo-de-dominio-candidato' if rate is None else 'subpaso-solamente'))
    assert money(D('.005')) == D('.01')
    assert scale(D('24000'),TABLES['2012-enero']) == D('6011.714')
    assert money(scale(D('24000'),TABLES['2012-febrero'])) == D('6270.37')
    assert scale(D('24000'),TABLES['2015-julio-revision']) == D('5485.50')
    assert scale(D('24000'),TABLES['2016-anual']) == D('5365.50')
    (OUT/'casos-decimal.json').write_text(json.dumps({'casos':cases,'aceptacionFiscal':False},ensure_ascii=False,indent=2)+'\n')
    (OUT/'tablas-candidatas.json').write_text(json.dumps(TABLES,indent=2)+'\n')
    print(f'{len(cases)} casos Decimal generados; cinco aserciones independientes correctas; motor no ejecutado.')


if __name__ == '__main__':
    main()
