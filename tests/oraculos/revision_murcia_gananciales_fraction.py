"""Oráculo independiente B09. Sólo stdlib; no carga fuentes ni salidas del producto."""
from fractions import Fraction as F
import json


def q(x):
    x = F(x)
    return {"numeradorEuros": str(x.numerator), "divisor": str(x.denominator)}


def construir():
    casos = []
    # Un único pago íntegro, ambos elegibles, sin ayudas. Por persona: 20% * G/2.
    # Incluye pares que difieren sólo en medio céntimo de atribución.
    for gasto in ["0", "0.01", "0.03", "0.05", "0.07", "100.01", "1234.57", "4999.95", "4999.99", "5000", "5000.01", "9999.99"]:
        for cuota in ["3000", "17.03", "0"]:
            mitad = F(gasto) / 2
            generado = min(mitad * F(1, 5), F(500))
            aplicado = min(F(cuota), generado)
            casos.append({"gasto": gasto, "cuota": cuota, "mitad": q(mitad), "generado": q(generado), "aplicado": q(aplicado), "pendiente": q(generado - aplicado), "disponible": q(F(cuota) - aplicado)})
    return casos


if __name__ == "__main__":
    print(json.dumps(construir(), ensure_ascii=False, indent=2))
