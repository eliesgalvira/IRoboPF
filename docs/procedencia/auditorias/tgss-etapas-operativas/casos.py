"""Discriminantes exactos; ninguna salida constituye expected normativo TGSS."""
import json
from decimal import Decimal, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_DOWN
from pathlib import Path

D = Decimal


def q(value: Decimal, mode: str = ROUND_HALF_UP) -> Decimal:
    return value.quantize(D('0.01'), rounding=mode)


def main() -> None:
    rates = {
        'CC': ('0.236', '0.047'), 'desempleo_indefinido': ('0.055', '0.0155'),
        'desempleo_temporal': ('0.067', '0.016'), 'FOGASA': ('0.002', '0'),
        'FP': ('0.006', '0.001'), 'MEI': ('0.0067', '0.0013'),
        '497': ('0.0077', '0.0015'), '498': ('0.0083', '0.0017'),
        '499': ('0.0098', '0.0019'), 'IT_hipotetica': ('0.008', '0'),
        'IMS_hipotetica': ('0.007', '0'),
    }
    rows = []
    for concept, (er, wr) in rates.items():
        # Bases sintéticas de producto; no acreditan mínimo ni elegibilidad.
        found_split = False
        found_residual = False
        for cents in range(1, 20001):
            base = D(cents) / 100
            e, w = base * D(er), base * D(wr)
            split = cents % 2 == 0 and q(e / 2) * 2 != q(e)
            residual = q(e + w) - q(w) != q(e)
            if (split and not found_split) or (residual and not found_residual):
                rows.append({'concepto': concept, 'base': str(base),
                             'productos_empresa_trabajador': [str(e), str(w)],
                             'empresa_directa': str(q(e)), 'trabajador': str(q(w)),
                             'total_directo': str(q(e+w)),
                             'empresa_residual': str(q(e+w)-q(w)),
                             'empresa_dos_tramos_iguales': str(q(e/2)*2),
                             'empresa_dos_trabajadores_igual_base': str(q(e)*2),
                             'empresa_base_agregada_dos_trabajadores': str(q(e*2)),
                             'empate_interno': e * 100 % 1 == D('.5'),
                             'expectedNormativo': None})
                found_split |= split
                found_residual |= residual
            if found_split and (found_residual or wr == '0'):
                break
    ties = [{'entrada': str(x), 'half_up': str(q(x)),
             'half_even': str(q(x, ROUND_HALF_EVEN)),
             'hacia_cero': str(q(x, ROUND_DOWN)), 'expectedNormativo': None}
            for x in map(D, ['1.005', '1.015', '-1.005', '-1.015', '.005', '-.005'])]
    assert q(D('-1.005')) == D('-1.01')
    assert q(D('-1.005'), ROUND_HALF_EVEN) == D('-1.00')
    assert q(D('2600.71') * D('.0795')) == D('206.76')
    assert sum(map(D, ['183.35', '5.20', '18.20'])) == D('206.75')
    assert q(D('125') * D('.055')) == D('6.88')
    assert q(D('125') * D('.0705')) - q(D('125') * D('.0155')) == D('6.87')
    assert q(D('125') * D('.015')) + q(D('125') * D('.011')) == D('3.26')
    assert q(D('125') * D('.026')) == D('3.25')
    result = {'estado': 'escenarios aritmeticos, no cuotas ingresables',
              'moneda': 'EUR', 'anioTipos': 2025, 'casos': rows, 'empates': ties,
              'observacionE01': {'base': '125.00', 'empresa701Publicada': '6.87',
                                'empresa701DirectaHalfUp': '6.88',
                                'empresa701Residual': '6.87',
                                'IT_IMS_publicados': '3.26', 'combinado': '3.25',
                                'expectedNormativo2025': None},
              'limites': 'Bases sintéticas sin validar mínimos. La búsqueda de partición exige céntimos pares; otras filas seleccionadas por residual pueden contener medios céntimos al partir y no son bases C admisibles. Dos trabajadores usan bases individuales en céntimos.'}
    Path(__file__).with_name('discriminantes.json').write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(rows)} discriminantes por concepto y {len(ties)} empates; aserciones correctas')


if __name__ == '__main__':
    main()
