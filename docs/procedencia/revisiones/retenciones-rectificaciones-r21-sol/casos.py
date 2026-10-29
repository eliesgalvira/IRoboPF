"""Casos de subpaso independientes; no implementan nómina ni motor AEAT."""
from decimal import Decimal
from fractions import Fraction
import json
from pathlib import Path

OUT = Path('docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol')

def main() -> None:
    rows: list[dict[str, str | bool]] = []
    for name, candidate, old, expected in [('subida', '18', '12', '12'), ('bajada', '6', '12', '6'), ('igual', '12', '12', '12'), ('cero', '0', '12', '0')]:
        actual = min(Decimal(candidate), Decimal(old))
        assert actual == Decimal(expected)
        assert Fraction(actual) == min(Fraction(candidate), Fraction(old))
        rows.append({'id': name, 'candidate': candidate, 'old': old, 'guardCeilingOnly': str(actual), 'replacementAssignment': old, 'difference': str(Decimal(old) - actual), 'kind': 'subpaso con85.2 supuesto y sin mínimo; no nómina'})
    # Techo de importe por aumento exclusivo: 2000 + (11000 - 10000).
    ceiling = Fraction(2000) + Fraction(11000) - Fraction(10000)
    pending, withheld = Fraction(10000), Fraction(1200)
    rate = (ceiling - withheld) * 100 / pending
    assert ceiling == 3000 and rate == 18
    assert Decimal(3000 - 1200) * 100 / Decimal(10000) == Decimal('18')
    rows.append({'id': 'aumento-diferencia', 'ceilingAmount': '3000', 'withheld': '1200', 'pending': '10000', 'amountRate': '18', 'maintenanceCeiling': '12', 'amountAfterMaintenance': '2400', 'kind': 'dos techos; cuota inicial suministrada, no fiscalmente reconstruida'})
    # El mínimo se representa aparte. No resolver una colisión por ordenar max/min.
    assert max(Decimal('6'), Decimal('15')) == Decimal('15')
    assert min(max(Decimal('6'), Decimal('15')), Decimal('12')) == Decimal('12')
    assert max(min(Decimal('6'), Decimal('12')), Decimal('15')) == Decimal('15')
    rows.append({'id': 'colision-minimo', 'old': '12', 'candidate': '6', 'newMinimum': '15', 'orderA': '12', 'orderB': '15', 'verdict': 'rechazar hasta conciliar historia y evento; no esperado fiscal'})
    for cause in [4, 5, 6, 8, 9, 10, 11]:
        rows.append({'id': f'causa-{cause}', 'pdfSpecialLimitBypass': cause in [5, 6, 8, 9, 10, 11], 'legalGuardFromNumberAlone': 'indeterminada', 'verdict': 'calificar hechos y85.2; ningún entero dispensa de87.5'})
    (OUT / 'casos.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2))
    print('Casos propios Decimal/Fraction correctos; límites y colisiones conservados sin esperado fiscal')

if __name__ == '__main__':
    main()
