"""Oráculo independiente: contabilidad de activo, banco y deuda; sin TS ni fiscal externo."""
from fractions import Fraction as F
import json
from pathlib import Path
f = json.loads((Path(__file__).parent / "fixtures/clm-patrimonio-factual.json").read_text())
precio = F(f["adquisicion"]["precio"])
previo = None
for y, esperado in [(2024, F(20000)), (2025, F(10000))]:
    e = f[f"cortes{y}"]
    banco_ini = sum(F(x["inicio"]["importe"]) for x in e["cuentas"])
    banco_fin = sum(F(x["cierre"]["importe"]) for x in e["cuentas"])
    flujo = sum((1 if x["clase"] == "salario" else -1) * F(x["importe"]) for x in e["movimientos"])
    assert banco_ini + flujo == banco_fin
    deuda_ini = F(e["deudaVendedor"]["inicio"]["importe"])
    deuda_fin = F(e["deudaVendedor"]["cierre"]["importe"])
    inicial = banco_ini + (0 if y == 2024 else precio) - deuda_ini
    final = banco_fin + precio - deuda_fin
    if previo is not None:
        assert inicial == previo
    previo = final
    incremento = final - inicial
    inversion = sum(F(x["importe"]) for x in e["movimientos"] if x["clase"] == "precio")
    assert incremento == esperado and incremento >= inversion
    for valoracion in [F(15000), F(900000), F(1)]:
        assert banco_fin + valoracion - deuda_fin - (valoracion - precio) == final
# Ahorro previo paga la inversión mientras todo el salario se consume: incremento cero.
assert F(20000) + F(40000) - F("10000.01") - F(40000) + precio - F("4999.99") - F(20000) == 0
# Omitir la deuda2024 fabricaría incremento4999.99: por eso se concilia el pasivo.
assert (F("29999.99") + precio) - F(40000) == F("4999.99")
# Fiscal derivado independiente: base exacta, generación y residual, sin invertir moneda.
base24 = min(F(12000), F(180000), precio, F("10000.01"))
assert base24 == F("10000.01")
assert base24 * F(15,100) == F(3000003,2000)
base25 = min(F(12000), F("4999.99"), min(precio,F(180000))-base24)
assert base25 * F(15,100) == F(1499997,2000)
print("Oráculo Fraction: dos trayectorias, continuidad, deuda, cero y valoración comprobados")
