"""Contrastes exactos de criterio, etapa y agregación; no oracle de cuotas TGSS."""

import json
from fractions import Fraction
from pathlib import Path


def centimos(valor: Fraction) -> Fraction:
    """Céntimo próximo con empate superior, limitado aquí a importes positivos."""
    assert valor >= 0
    escalado = valor * 100
    entero, resto = divmod(escalado.numerator, escalado.denominator)
    return Fraction(entero + (2 * resto >= escalado.denominator), 100)


def euros(valor: Fraction) -> str:
    cent = valor * 100
    assert cent.denominator == 1
    entero, decimal = divmod(cent.numerator, 100)
    return f"{entero}.{decimal:02d}"


def main() -> None:
    empate = centimos(Fraction("0.005"))
    meses = sum((centimos(Fraction("0.005")) for _ in range(12)), Fraction())
    anual = centimos(12 * Fraction("0.005"))
    componentes = centimos(Fraction("0.004")) * 2
    agregado = centimos(2 * Fraction("0.004"))
    assert empate == Fraction("0.01")
    assert meses == Fraction("0.12") and anual == Fraction("0.06")
    assert componentes == 0 and agregado == Fraction("0.01")

    # Vector de remuneraciones comunicables en céntimos, suma anual 132.500.
    remuneraciones = [Fraction("11041.67")] * 8 + [Fraction("11041.66")] * 4
    assert sum(remuneraciones) == 132500
    maximo = Fraction("4909.50")
    tipos = (
        [Fraction("0.0077"), Fraction("0.0083"), Fraction("0.0098")],
        [Fraction("0.0015"), Fraction("0.0017"), Fraction("0.0019")],
    )
    cuotas = [
        [
            [base * tipo for base, tipo in zip(
                [maximo / 10, maximo * Fraction("0.4"), sueldo - maximo * Fraction("1.5")],
                reparto,
                strict=True,
            )]
            for reparto in tipos
        ]
        for sueldo in remuneraciones
    ]
    por_tramo = [sum((sum((centimos(x) for x in mes[i]), Fraction()) for mes in cuotas), Fraction()) for i in range(2)]
    por_mes = [sum((centimos(sum(mes[i])) for mes in cuotas), Fraction()) for i in range(2)]
    por_anio = [centimos(sum((sum(mes[i]) for mes in cuotas), Fraction())) for i in range(2)]
    assert por_tramo == [Fraction("673.44"), Fraction("132.84")]
    assert por_mes == [Fraction("673.44"), Fraction("132.72")]
    assert por_anio == [Fraction("673.42"), Fraction("132.74")]
    resultado = {
        "alcance": "Contraste aritmético exacto; no prueba normativa ni ejecución del motor",
        "expectedNormativoTgss": None,
        "empate_positivo_0_005": euros(empate),
        "doce_saldos_mensuales_0_005": euros(meses),
        "un_saldo_anual_12_por_0_005": euros(anual),
        "dos_componentes_0_004_redondeados": euros(componentes),
        "suma_dos_componentes_0_004_redondeada": euros(agregado),
        "solidaridad_2025_vector_132500": {
            "hipotesis": "12 meses completos, un trabajador, un tramo temporal mensual, tres fracciones retributivas; sin mínimos/especialidades",
            "por_fraccion_retributiva_pagador_mes": list(map(euros, por_tramo)),
            "por_pagador_mes_tras_sumar_fracciones": list(map(euros, por_mes)),
            "por_pagador_anio_tras_sumar_productos": list(map(euros, por_anio)),
            "orden": ["empresa", "trabajador"],
        },
    }
    Path(__file__).with_name("discriminantes.json").write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + "\n")
    print("Discriminantes exactos correctos; ningún oracle TGSS aceptado.")


if __name__ == "__main__":
    main()
