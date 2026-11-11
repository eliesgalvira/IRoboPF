"""Oráculo stdlib independiente. No importar ni ejecutar el productor TS.
Ejecutar por el padre: timeout -k 30s 1m python3 tests/clm-vivienda-fracciones.py
GRANT0: preparado, NO ejecutado por el implementador.
"""
from fractions import Fraction as F
from pathlib import Path
import json

casos = json.loads((Path(__file__).parent / "fixtures/clm-vivienda-fracciones.json").read_text())
for c in casos:
    consumida = min(F(12000), F(180000), F(c["coste"]), F(c["pago2024"]))
    cuota_origen = consumida * F(15, 100)
    # Salario40000: art19=2000, art20=0; mínimo5550 y escala CLM2024.
    cuota_disponible = F(12450)*F(95,1000) + F(7750)*F(12,100) + F(15000)*F(15,100) + F(2800)*F(185,1000) - F(5550)*F(95,1000)
    assert cuota_disponible >= cuota_origen
    assert consumida == F(c["base2024"]), c["id"]
    base_actual = min(F(12000), max(F(0), min(F(180000), F(c["coste"])) - consumida), F(c["pago2025"]))
    assert base_actual * F(15,100) == F(c["generado2025"]), c["id"]
print(f"Fraction: {len(casos)} vectores exactos")
