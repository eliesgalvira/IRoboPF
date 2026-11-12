"""Oráculo independiente stdlib: gasto común/2;20% por persona;máximo500. No importa producción."""
from fractions import Fraction
import json

def r(x):
    return {"numeradorEuros": str(x.numerator), "divisor": str(x.denominator)}

def casos():
    for gasto in ["0", "0.01", "0.03", "100.01", "1000", "4999.99", "5000", "5000.01", "10000.01"]:
        base = Fraction(gasto) / 2
        generado = min(base * Fraction(1, 5), Fraction(500))
        for cuota in ["3000", "17.03"]:
            aplicado = min(generado, Fraction(cuota))
            yield dict(importe=gasto, cuota=cuota, baseIndividual=r(base), generado=r(generado), aplicado=r(aplicado), pendiente=r(generado-aplicado))

if __name__ == "__main__":
    print(json.dumps(list(casos()), indent=2))
