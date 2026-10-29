"""Casos documentales: Decimal y racionales; no importan el motor ni el oracle legacy."""
import json
from datetime import date
from decimal import ROUND_DOWN, ROUND_HALF_UP, Decimal
from fractions import Fraction
from pathlib import Path

D = Decimal
TABLES = {
    "enero": [("0", "0", "20"), ("12450", "2490", "25"), ("20200", "4427.50", "31"), ("34000", "8705.50", "39"), ("60000", "18845.50", "47")],
    "julio": [("0", "0", "19.5"), ("12450", "2427.75", "24.5"), ("20200", "4326.50", "30.5"), ("34000", "8535.50", "38"), ("60000", "18415.50", "46")],
    "2016": [("0", "0", "19"), ("12450", "2365.50", "24"), ("20200", "4225.50", "30"), ("35200", "8725.50", "37"), ("60000", "17901.50", "45")],
}
RESULTS: list[dict[str, str]] = []


def check(name: str, actual: object, expected: object) -> None:
    assert actual == expected, (name, actual, expected)
    RESULTS.append({"id": name, "actual": str(actual), "expected": str(expected)})


def money(value: Decimal) -> Decimal:
    return value.quantize(D(".01"), rounding=ROUND_HALF_UP)


def trunc(value: Decimal) -> Decimal:
    return value.quantize(D(".01"), rounding=ROUND_DOWN)


def scale(base: Decimal, version: str) -> Decimal:
    if base < 0:
        raise ValueError("Base negativa")
    low, fixed, rate = next(row for row in reversed(TABLES[version]) if base >= D(row[0]))
    return D(fixed) + (base - D(low)) * D(rate) / 100


def reduction(rnt: Decimal) -> Decimal:
    return money(max(D(0), D(3700) - max(D(0), rnt - 11250) * D("1.15625")))


def selection(payment: date, august: bool) -> tuple[str, int, int]:
    if payment.year == 2016:
        return "2016", 45, 23
    if payment.year != 2015:
        raise ValueError("Ejercicio fuera del contrato")
    return ("enero", 47, 24) if payment < date(2015, 8 if august else 7, 1 if august else 12) else ("julio", 46, 23)


def rate(target: Decimal, withheld: Decimal, gross: Decimal, paid: Decimal, housing: Decimal = D(0)) -> Decimal:
    if not D(0) < paid < gross:
        raise ValueError("Validaciones de regularización: 0 < percibido < retribución")
    return trunc(max(D(0), (target - withheld - housing) * 100 / (gross - paid)))


def main() -> None:
    for version, expected in [("enero", "5605.50"), ("julio", "5485.50"), ("2016", "5365.50")]:
        check("ejemplo-24000-" + version, scale(D(24000), version), D(expected))
        for i, row in enumerate(TABLES[version][1:], 1):
            for delta in [D("-.01"), D(0), D(".01")]:
                base = D(row[0]) + delta
                anchor = TABLES[version][i - 1 if delta < 0 else i]
                low, fixed, marginal = map(Fraction, anchor)
                check(f"escala-{version}-{base}", Fraction(scale(base, version)), fixed + (Fraction(base) - low) * marginal / 100)
    for day, august, expected_tuple in [
        ("2015-01-01", False, ("enero", 47, 24)), ("2015-07-11", False, ("enero", 47, 24)),
        ("2015-07-12", False, ("julio", 46, 23)), ("2015-07-12", True, ("enero", 47, 24)),
        ("2015-07-31", True, ("enero", 47, 24)), ("2015-08-01", True, ("julio", 46, 23)),
        ("2016-01-01", True, ("2016", 45, 23)), ("2016-12-31", False, ("2016", 45, 23)),
    ]:
        check("fecha-" + day + str(august), selection(date.fromisoformat(day), august), expected_tuple)
    for rnt_text, expected in [("11249.99", "3700"), ("11250", "3700"), ("11250.01", "3699.99"), ("14449.99", ".01"), ("14450", "0"), ("14450.01", "0")]:
        check("reduccion-" + rnt_text, reduction(D(rnt_text)), D(expected))
    # Ocho celdas del art81, y frontera del límite43 del art85.3.
    for threshold in [14266, 15803, 13696, 14985, 17138, 12000, 12607, 13275]:
        for extra in [0, 600, 1200]:
            for offset, expected_bool in [("-.01", True), ("0", True), (".01", False)]:
                check(f"exclusion-{threshold}-{extra}-{offset}", D(threshold + extra) + D(offset) <= threshold + extra, expected_bool)
    for gross, expected_bool in [("21999.99", True), ("22000", True), ("22000.01", False)]:
        check("limite43-elegible-" + gross, D(gross) <= 22000, expected_bool)
    check("limite43-18000", (D(18000) - 12000) * D(".43"), D(2580))
    for gross, expected_bool in [("33007.19", True), ("33007.20", False), ("33007.21", False)]:
        check("vivienda-" + gross, D(gross) < D("33007.20"), expected_bool)
    check("vivienda-frontera-importe", trunc(D("33007.19") * D(".02")), D("660.14"))
    # DT12: plan ordinario, capital de aportaciones pre2007, contingencia/percepción2016,
    # antigüedad>2 años. No se afirma que sea pensionista SS ni trabajador activo.
    check("DT12-reduccion", D(3000) * D(".40"), D(1200))
    rnt = D(3000) - 1200
    check("RRO08-rnt", rnt, D(1800))
    check("RRO08-gasto-legal", min(D(2000), rnt), D(1800))
    check("RRO08-gasto-literal", min(D(2000), D(3000)), D(2000))
    for expense in [D(1800), D(2000)]:
        check("RRO08-base-" + str(expense), max(D(0), rnt - expense - reduction(rnt)), D(0))
    # Mínimos escalares y prorrateo de derechos ya comprobados, no elegibilidad inferida.
    for age, expected_int in [(64, 5550), (65, 6700), (74, 6700), (75, 8100)]:
        check("minimo-edad-" + str(age), 5550 + (1150 if age >= 65 else 0) + (1400 if age >= 75 else 0), expected_int)
    for grade, aid, expected_int in [(32, False, 0), (33, False, 3000), (64, True, 6000), (65, False, 12000)]:
        check(f"discapacidad-{grade}-{aid}", (9000 if grade >= 65 else 3000 if grade >= 33 else 0) + (3000 if grade >= 65 or grade >= 33 and aid else 0), expected_int)
    check("cuarto-descendiente", sum([2400, 2700, 4000, 4500]), 13600)
    check("descendientes-por-mitad", D(13600) / 2, D(6800))
    check("ascendiente75-tercios", Fraction(1150 + 1400, 3), Fraction(850))
    check("gasto-discapacidad33", D(2000) + 3500, D(5500))
    check("gasto-discapacidad65-movilidad", D(2000) + 7750 + 2000, D(11750))
    check("jornal", D("75.25") * 100, D(7525))
    # Anualidades: solo beneficiario judicial sin derecho al mínimo por ese hijo.
    for annuality, expected_split in [("0", False), ("19999.99", True), ("20000", False), ("20000.01", False)]:
        check("anualidad-frontera-" + annuality, 0 < D(annuality) < 20000, expected_split)
    check("anualidad2016-cuota1", scale(D(15000), "2016") + scale(D(5000), "2016"), D("3927.50"))
    check("anualidad2016-cuota2", scale(D(5550 + 1980), "2016"), D("1430.70"))
    check("anualidad2016-cuota", D("3927.50") - D("1430.70"), D("2496.80"))
    # Subramas territoriales: cuotas supuestas, sin atribuirles deuda fiscal completa.
    check("altaCM-objetivo", D(15000) * 6000 / 30000 + D(15000) * 3000 / 30000, D(4500))
    check("baja-trabajoCM-objetivo", D(15000) * 3000 / 30000 + D(15000) * 6000 / 30000, D(4500))
    check("julio-literal-causa11-sola", rate(D(6000), D(1500), D(30000), D(15000)), D(30))
    check("julio-hipotesis-no-fiscal", rate(D(4500), D(1500), D(30000), D(15000)), D(20))
    check("exceso-retenido", rate(D(1000), D(1500), D(30000), D(15000)), D(0))
    for paid in [D(0), D(30000), D(30001)]:
        try:
            rate(D(6000), D(0), D(30000), paid)
        except ValueError:
            check("rechazo-percibido-" + str(paid), True, True)
        else:
            raise AssertionError("Entrada debía rechazarse")
    # Vivienda causas1..8 aumento/disminución/igual; 9 con/sin previa;10;11 enero/2016.
    for wage_delta, expected_int in [(1000, 420), (-1000, 380), (0, 400)]:
        check("vivienda-regularizacion-" + str(wage_delta), D(400) + D(".02") * wage_delta, D(expected_int))
    check("vivienda-causa9-previa", D(200) + D(".02") * 15000, D(500))
    check("vivienda-causa9-nueva", D(".02") * 15000, D(300))
    check("vivienda-causa10", D(400) - D(".02") * 15000, D(100))
    # Art87.5: nueva diferencia no crece -> tipo no puede subir.
    check("87.5-sin-aumento", min(D(18), D(12)), D(12))
    # Aumento de diferencia1000, importe anterior2000: techo anual3000.
    check("87.5-aumento-acotado-tipo", rate(D(3000), D(1000), D(30000), D(20000)), D(20))
    check("87.5-aumento-acotado-importe", D(1000) + D(10000) * D(".20"), D(3000))
    for version, cap, reduced in [("enero", 47, 24), ("julio", 46, 23), ("2016", 45, 23)]:
        check("tope-" + version, min(D(80), D(cap)), D(cap))
        check("tope-territorial-" + version, min(D(80), D(reduced)), D(reduced))
    for territory, expected_pair in [(False, (15, 2)), (True, (8, 1))]:
        check("minimos-contrato-" + str(territory), (8, 1) if territory else (15, 2), expected_pair)
    check("redondeo-empate", money(D(".005")), D(".01"))
    check("truncado-tipo", trunc(D("17.85964523")), D("17.85"))
    check("sin-entero-previo", trunc(D("17.50")), D("17.50"))
    # Tres trazas iniciales completas acotadas: activo40, general, situación3,
    # sin familia, movilidad, discapacidad, vivienda ni irregularidad.
    for version, expected_quota, expected_rate, expected_amount in [
        ("enero", "1981.75", "11.00", "1980.00"),
        ("julio", "1935.215", "10.75", "1935.00"),
        ("2016", "1888.68", "10.49", "1888.20"),
    ]:
        ordinary_rnt = D(18000) - D(1143)
        ordinary_base = ordinary_rnt - 2000 - reduction(ordinary_rnt)
        check("ordinario-rnt-" + version, ordinary_rnt, D(16857))
        check("ordinario-base-" + version, ordinary_base, D(14857))
        quota = min(scale(ordinary_base, version) - scale(D(5550), version), D(2580))
        check("ordinario-cuota-" + version, quota, D(expected_quota))
        ordinary_rate = trunc(quota * 100 / 18000)
        check("ordinario-tipo-" + version, ordinary_rate, D(expected_rate))
        check("ordinario-importe-" + version, money(D(18000) * ordinary_rate / 100), D(expected_amount))
    # Art18.2, extinción calificada: el límite de la base de reducción decrece.
    for amount, expected_limit in [("700000", "300000"), ("700000.01", "299999.99"), ("999999.99", ".01"), ("1000000", "0")]:
        actual_limit = min(D(300000), max(D(0), D(1000000) - D(amount)))
        check("irregularidad-base-limite-" + amount, actual_limit, D(expected_limit))
    Path(__file__).with_name("casos-resultados.json").write_text(json.dumps({"aserciones": len(RESULTS), "cases": RESULTS, "motorEjecutado": False, "aceptacionFiscal": False}, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(RESULTS)} aserciones ejecutadas, sin motor ni habilitación")


if __name__ == "__main__":
    main()
