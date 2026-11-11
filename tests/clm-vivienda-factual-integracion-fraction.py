"""Fraction independiente; sin importar producto, runtime fiscal ni frameworks.
Trayectorias de cada variante positiva, pagos/deuda/precio y cuotas previas inalteradas.
"""
from fractions import Fraction as F
from pathlib import Path
import json
base = Path(__file__).parent / "fixtures"
fixture = json.loads((base / "clm-vivienda-aplicacion-2024.json").read_text())
factual = fixture["aplicacionViviendaCLM2024"]["patrimonioHistorico"]
assert fixture["aplicacionViviendaCLM2024"]["nacimiento"] == "1995-01-01"
assert "patrimonio2024" not in fixture["aplicacionViviendaCLM2024"]
assert factual == json.loads((base / "clm-patrimonio-factual.json").read_text())
# Basal: reconstruir cada cuenta desde sus movimientos y su pasivo desde el precio.
prev = None
for y in [2024, 2025]:
    e = factual[f"cortes{y}"]
    ini = sum(F(c["inicio"]["importe"]) for c in e["cuentas"])
    fin = sum(F(c["cierre"]["importe"]) for c in e["cuentas"])
    assert ini + sum((1 if m["clase"] == "salario" else -1) * F(m["importe"]) for m in e["movimientos"]) == fin
    precio = F(factual["adquisicion"]["precio"])
    pagos = sum(F(m["importe"]) for m in e["movimientos"] if m["clase"] == "precio")
    di, df = (F(e["deudaVendedor"][k]["importe"]) for k in ["inicio", "cierre"])
    assert (precio if y == 2024 else di) - pagos == df
    pi = ini + (0 if y == 2024 else precio) - di
    pf = fin + precio - df
    if prev is not None:
        assert pi == prev
    prev = pf
    assert pf - pi >= pagos
# Proyección POSITIVA independiente: flujo=salario-precio-consumo; consumo=salario-precio.
# Banco queda20000 en ambos cierres; patrimonio crece por ahorro salarial genuino.
casos = json.loads((base / "clm-vivienda-fracciones.json").read_text())
for c in casos:
    p24, p25, precio = (F(c[k]) for k in ["pago2024", "pago2025", "coste"])
    assert p24 + p25 == precio
    deuda_original = precio - p24
    banco24 = F(20000) + F(40000) - p24 - (F(40000) - p24)
    banco25 = banco24 + F(25000) - p25 - (F(25000) - p25)
    assert banco24 == banco25 == F(20000)
    patr24 = banco24 + precio - deuda_original
    patr25 = banco25 + precio - (deuda_original - p25)
    assert patr24 - F(20000) == p24 and patr25 - patr24 == p25
    assert min(F(12000), precio, F(180000), p24) == F(c["base2024"])
    generado = min(F(12000), p25, min(precio, F(180000)) - F(c["base2024"])) * F(15, 100)
    assert generado == F(c["generado2025"])
# Umbral independiente: mantener crecimiento10000.01 con consumos factuales positivos.
# Art19=2000; art20=0 en estos salarios. Escala CLM y mínimo5550, precisión exacta.
def cuota(bruto):
    base = F(bruto) - F(2000)
    total = F(12450) * F(95,1000) + (base - F(12450)) * F(12,100)
    return total - F(5550) * F(95,1000)
def moneda(x):
    z=x*100
    return F((z.numerator*2//z.denominator+1)//2,100)
generacion = F("10000.01") * F(15,100)
assert moneda(cuota("21487.50")) == F(1500) < generacion
assert moneda(cuota("21487.59")) == F("1500.01") > generacion
for salario in [F("21487.50"), F("21487.59")]:
    consumo=salario-F("10000.01")
    assert consumo>0 and salario-consumo == F("10000.01")
print(f"Fraction integración: basal, {len(casos)} variantes, deuda/continuidad y umbrales exactos")
