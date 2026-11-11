"""Oráculo independiente stdlib; no importa el candidato ni módulos fiscales."""
from fractions import Fraction as F
from decimal import Decimal, localcontext
import json

def q(x):
    return {"n": str(x.numerator), "d": str(x.denominator)}

def fijo(x):
    with localcontext() as c:
        c.prec = 80
        return format(Decimal(x.numerator) / Decimal(x.denominator), '.18f')

amortizacion = F(80000) * F(3, 100) * F(184, 365)
assert amortizacion == F(88320, 73)
inicial = F(20000) + 100000 - 3000
final = F(20000) + 100000
assert final - inicial == 3000
base_dt18 = min(F(9040), F(3000) + 50)
assert base_dt18 == 3050
rentas = []
for ingreso in (30000, 16000, 10000):
    consumo = F(ingreso) - 3000 - 50 - 6000
    assert consumo > 0
    assert F(20000) + ingreso - 3000 - 50 - 6000 - consumo == 20000
    base = (F(ingreso) - amortizacion) / 2
    rentas.append({"ingreso": str(ingreso), "base": q(base), "base18": fijo(base)})
assert rentas[0]['base'] == q(F(1050840, 73))
assert rentas[2]['base'] == q(F(320840, 73))
print(json.dumps({"amortizacion": q(amortizacion), "baseDT18": q(base_dt18),
    "incrementoPatrimonial": q(final-inicial), "generadoConDT18": q(F(0)),
    "generadoSinDT18": q(min(F(6000, 10), F(300))), "rentas": rentas}, indent=2))
