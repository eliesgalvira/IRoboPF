"""Oráculos racionales Galicia 2025, sin importar el motor ni sus tablas.

Fuentes: AEAT2025 escala autonómica Galicia y mínimos, LIRPF arts19/20/23/63,
Galicia art5.Siete y Ley5/2025 DF3 (DA61). Ver procedencia del perfil mixto.
El supuesto tiene empleo único, SS, gasto general2000, vivienda cedida todo2025
con amortización2400 y reducción50%, alquiler propio6000, edad35 y retención100.
"""
from fractions import Fraction as F
import json


def escala(base, filas):
    inicio, cuota, tipo = next(row for row in reversed(filas) if base >= F(row[0]))
    return F(cuota) + (base - F(inicio)) * F(tipo)


ESTATAL = [('0', '0', '.095'), ('12450', '1182.75', '.12'),
           ('20200', '2112.75', '.15'), ('35200', '4362.75', '.185'),
           ('60000', '8950.75', '.225'), ('300000', '62950.75', '.245')]
GALICIA = [('0', '0', '.09'), ('12985.35', '1168.68', '.1165'),
           ('21068.60', '2110.38', '.149'), ('35200', '4215.96', '.184'),
           ('60000', '8779.16', '.225')]


def proyeccion12(valor):
    # HALF_UP sólo para comparar; la fracción original queda en el fixture.
    n = abs(valor) * 10**12
    unidades = n.numerator // n.denominator
    unidades += 2 * (n.numerator % n.denominator) >= n.denominator
    texto = str(unidades).zfill(13)
    return ('-' if valor < 0 else '') + texto[:-12] + '.' + texto[-12:]


def calcular(bruto, renta, ss):
    b, r, s = map(F, (bruto, renta, ss))
    previo = b - s
    neto = max(F(0), previo - 2000)
    inmobiliario = r - 2400
    assert inmobiliario >= 0 and previo >= 0
    teorica = F(0)
    if inmobiliario <= 6500:
        if previo <= 14852:
            teorica = F(7302)
        elif previo <= F('17673.52'):
            teorica = 7302 - F('1.75') * (previo - 14852)
        elif previo < F('19747.5'):
            teorica = F('2364.34') - F('1.14') * (previo - F('17673.52'))
    art20 = min(neto, max(F(0), teorica))
    laboral = neto - art20
    base = laboral + inmobiliario / 2
    estatal = max(F(0), escala(base, ESTATAL) - escala(min(base, F(5550)), ESTATAL))
    autonomica = max(F(0), escala(base, GALICIA) - escala(min(base, F(5789)), GALICIA))
    integra = estatal + autonomica
    ded_alquiler = min(F(300), autonomica) if base <= 22000 else F(0)
    liquida = integra - ded_alquiler
    legal = max(F(0), 340 - max(F(0), b - 16576) / 5) if b > 0 and inmobiliario <= 6500 else F(0)
    limite = integra * laboral / base if base else F(0)
    da61 = min(legal, limite, liquida)
    valores = dict(netoTrabajo=neto, art20=art20, laboral=laboral, otras=inmobiliario,
                   base=base, estatal=estatal, autonomica=autonomica, integra=integra,
                   alquiler=ded_alquiler, liquida=liquida, da61=da61, diferencial=liquida-da61-100)
    return {'entrada': {'bruto': bruto, 'renta': renta, 'ss': ss},
            'exactos': {k: {'n': str(v.numerator), 'd': str(v.denominator)} for k, v in valores.items()},
            'proyeccion12': {k: proyeccion12(v) for k, v in valores.items()}}


CASOS = [('20000', r, '1000') for r in ('8900', '8900.01', '12400', '12400.01', '12400.02')]
CASOS += [(b, r, s) for b, r, s in [
    ('17000', '8900', '1000'), ('17000', '8900.01', '1000'),
    ('13902', '8900', '1000'), ('13902', '8800', '1000'),
    ('15000', '7000', '1000'), ('1000', '2400', '0'),
    ('18275.99', '8900', '1000'), ('18276', '8900', '1000'),
    ('16576', '8900', '1000'), ('16576.01', '8900', '1000'),
    ('45000', '15000', '1000'), ('65000', '15000', '1000'),
]]

if __name__ == '__main__':
    casos = [calcular(*c) for c in CASOS]
    limite = casos[7]['exactos']['da61']
    assert F(int(limite['n']), int(limite['d'])) == F('218.99') * F(3600, 6850)
    assert casos[7]['proyeccion12']['da61'] == '115.089635036496'
    print(json.dumps({'alcance': 'Galicia2025 salario y alquileres acotados; no cotejo Open',
                      'politicaComparacion': 'fracciones conservadas y proyección HALF_UP12; sin cuantización fiscal entre etapas',
                      'casos': casos}, ensure_ascii=False, indent=2))
