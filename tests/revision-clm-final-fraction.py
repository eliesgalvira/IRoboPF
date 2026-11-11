"""Continuación independiente: oráculos stdlib preparados, NO ejecutados.
Padre: timeout -k 30s 1m python3 tests/revision-clm-final-fraction.py
No importa código fiscal ni fixtures del autor; no es supervisor ni arnés TS.
"""
from fractions import Fraction as F

def moneda(x):
    assert x >= 0
    v = x * 100 + F(1, 2)
    return F(v.numerator // v.denominator, 100)

def corte(bi,bf,precio_inicio,valor_fin,precio_fin,di,df):
    inicial=F(bi)+F(precio_inicio)-F(di)
    variacion=F(valor_fin)-F(precio_fin)
    final=F(bf)+F(valor_fin)-F(df)-variacion
    return inicial,final,final-inicial

# Contabilidad nominal: banco y deuda continúan; las valoraciones no crean crecimiento.
a=corte("20000","29999.99",0,"15000","15000",0,"4999.99")
b=corte("29999.99","35000","15000","15000","15000","4999.99",0)
assert a==(F(20000),F(40000),F(20000))
assert b==(F(40000),F(50000),F(10000))
assert a[1]==b[0]
assert corte("20000","29999.99",0,"999999","15000",0,"4999.99")==a
assert corte("29999.99","35000","15000","1","15000","4999.99",0)==b

# Umbral exacto vs un céntimo inferior, con libros cerrados aritméticamente.
for consumo,cierre,incremento in [("29999.99","20000","10000.01"),("30000","19999.99","10000")]:
    assert F(20000)+F(40000)-F("10000.01")-F(consumo)==F(cierre)
    assert corte("20000",cierre,0,"15000","15000",0,"4999.99")[2]==F(incremento)
for consumo,cierre,incremento in [("20000.01","29999.99","4999.99"),("20000.02","29999.98","4999.98")]:
    assert F("29999.99")+25000-F("4999.99")-F(consumo)==F(cierre)
    assert corte("29999.99",cierre,"15000","15000","15000","4999.99",0)[2]==F(incremento)

# Cotización efectiva nominal2025 de1000: el banco cobra24000, crecimiento9000.
assert F("29999.99")+24000-F("4999.99")-15000==34000
assert corte("29999.99","34000","15000","15000","15000","4999.99",0)[2]==9000
# No se deduce ni impone una cotización canónica estimada desde estos hechos.

# Frontera de cuota origen con salario sin art20: base general = bruto -2000.
def cuota_sin_art20(bruto):
    base=F(bruto)-2000
    assert F(12450)<=base<=F(20200) and F(bruto)>=F("19747.50")
    return moneda(F(12450)*F(95,1000)+(base-12450)*F(12,100)-F(5550)*F(95,1000))
base=F("10000.01");generada=base*F(15,100)
assert generada==F(3000003,2000) and moneda(generada)==1500
assert cuota_sin_art20("21487.50")==1500 < generada
assert cuota_sin_art20("21487.59")==F("1500.01") > generada
assert moneda(generada)/F(15,100)!=base
residual=min(F(12000),F(15000)-base,F("4999.99"))
assert residual*F(15,100)==F(1499997,2000)
print("Oráculos finales propios completados")
