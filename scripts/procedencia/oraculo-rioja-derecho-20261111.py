"""Aritmética normativa independiente: no importa ni ejecuta código del motor.
Art23 LIRPF y14 RIRPF: 3% construcción80000,184/365días, reducción50%.
Art70.1 redacción2012: aumento patrimonial>=capital3000, no intereses50.
DT18 acceso2010 y práctica efectiva2010; pagos2025 durante uso habitual.
Art32.12.4 Rioja: el derecho veta el alquiler aun con no_aplicar o cuota0.
La cuota normal se comprueba>=300 en tests; para10000, base<5500=>cuota0.
"""
from fractions import Fraction as F
from decimal import Decimal, localcontext
import json

def exacto(f):
    return {"numeradorEuros": str(f.numerator), "divisor": str(f.denominator)}

def fijo18(f):
    with localcontext() as ctx:
        ctx.prec = 80
        return format(Decimal(f.numerator) / Decimal(f.denominator), ".18f")

amortizacion = F(80000) * F(3, 100) * F(184, 365)
inicial = F(20000) + F(100000) - F(3000)
final = F(20000) + F(100000)
assert final - inicial == F(3000)
base_derecho = F(3000) + F(50)
assert final - inicial >= F(3000)
assert base_derecho == F(3050)
assert base_derecho * 100 == 305000
rentas = []
for ingreso in (30000, 10000):
    consumo = F(ingreso) - F(3000) - F(50) - F(6000)
    assert consumo > 0
    assert F(20000) - F(3000) - F(50) + F(ingreso) - F(6000) - consumo == F(20000)
    base = (F(ingreso) - amortizacion) / 2
    sin_derecho = min(F(6000) / 10, F(300))
    assert sin_derecho == 300
    if ingreso == 10000:
        assert 0 < base < 5500
        cuota_disponible = F(0)
    else:
        # No se replica la tarifa del motor: premisa verificable por la API.
        cuota_disponible = F(300)
    aplicado_sin_derecho = min(cuota_disponible, sin_derecho)
    for eleccion in ("aplicar", "no_aplicar"):
        con_derecho = F(0)  # art32.12.4: falta requisito material del alquiler
        assert min(con_derecho, cuota_disponible) == 0
    rentas.append({"ingreso": str(ingreso), "base": exacto(base), "base18": fijo18(base),
                   "alquilerSinDerecho": str(aplicado_sin_derecho.numerator),
                   "generadoSinDerecho": exacto(sin_derecho), "conDerecho": exacto(F(0))})
assert rentas[0]["base"] == exacto(F(5254200,365))
print(json.dumps({"metodo": "Fraction independiente; ningún módulo fiscal importado", "baseDT18": exacto(base_derecho), "rentas": rentas}, ensure_ascii=False, indent=2))
