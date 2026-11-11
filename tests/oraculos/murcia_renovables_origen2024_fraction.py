"""Oráculo independiente completo para el perfil B05: stdlib/Fraction.
No importa código, tablas ni salidas del motor. Importes certificados como hechos.
Política: racional con casillas a céntimos HALF_UP, contrastadas en cinco capturas Open2024.
La versión sin cuantización queda preservada junto al PRE causal, no sobrescrita en su entrega original.
Fuentes: LIRPF2024 arts19/20/56/63/74/77; AEAT2024 escalaMurcia;
Ley4/2023 art55.Tres art1.Cinco. Sólo origen2024, base<35000, edad18–64.
"""
from fractions import Fraction as F
import unittest


def centimos(x):
    assert x >= 0
    c = x * 100
    return F((2 * c.numerator + c.denominator) // (2 * c.denominator), 100)


def art20(previo):
    if previo <= F(14852):
        return F(7302)
    if previo <= F("17673.52"):
        return F(7302) - F("1.75") * (previo - F(14852))
    if previo < F("19747.50"):
        return F("2364.34") - F("1.14") * (previo - F("17673.52"))
    return F(0)


def escala(base, filas):
    # Filas publicadas base inferior/cuota fija/tipo: independiente del algoritmo
    # por anchos de tramo utilizado por el motor para Murcia2024.
    fila = next(x for x in reversed(filas) if base >= F(x[0]))
    return F(fila[1]) + (base - F(fila[0])) * F(fila[2])


AUTON = [("0", "0", ".095"), ("12450", "1182.75", ".112"),
         ("20200", "2050.75", ".133"), ("34000", "3886.15", ".179")]
ESTATAL = [("0", "0", ".095"), ("12450", "1182.75", ".12"),
           ("20200", "2112.75", ".15")]


def cuotas(bruto, ss):
    bruto, ss = F(bruto), F(ss)
    assert 0 < bruto <= 1000000 and 0 <= ss <= bruto
    previo = bruto - ss
    generales = min(F(2000), max(F(0), previo))
    neto = previo - generales
    reduccion = centimos(min(neto, art20(previo)))
    base = max(F(0), neto - reduccion)
    if base >= 35000:
        raise ValueError("fuera de la primera franja2024")
    minimo = min(base, F(5550))
    auto = centimos(escala(base, AUTON)) - centimos(escala(minimo, AUTON))
    estatal = centimos(escala(base, ESTATAL)) - centimos(escala(minimo, ESTATAL))
    return dict(bruto=bruto, gastos=ss+generales, neto=neto, reduccion=reduccion,
                base=base, autonomica=auto, estatal=estatal)


def origen(bruto="30000", ss="2000", factura="10000", ayuda="0", retenciones="1000", eleccion="aplicar"):
    if eleccion != "aplicar":
        raise ValueError("omisión no acredita insuficiencia")
    q = cuotas(bruto, ss)
    assert F(0) <= F(ayuda) <= F(factura) <= 1000000
    neto = F(factura) - F(ayuda)
    antes_tope = neto / 2
    sin_cuantizar = min(F(7000), antes_tope)
    generado = centimos(sin_cuantizar)
    aplicado = min(generado, q["autonomica"])
    saldo = generado - aplicado
    liquida = q["estatal"] + q["autonomica"] - aplicado
    return dict(**q, inversion_neta=neto, antes_tope=antes_tope, exceso=antes_tope-sin_cuantizar, ajuste=generado-sin_cuantizar,
                generado=generado, aplicado=aplicado, saldo=saldo,
                liquida=liquida, diferencial=liquida-F(retenciones), ultimo_ejercicio=2026)


def consumir2025(libro, cuota, agua="0"):
    cuota, agua = F(cuota), F(agua)
    primero = min(cuota, agua)
    aplicado = min(cuota-primero, libro["saldo"])
    return primero+aplicado, libro["saldo"]-aplicado, cuota-primero-aplicado


class Origen2024(unittest.TestCase):
    def test_liquidacion_completa(self):
        q = origen()
        for campo, valor in {"bruto":"30000", "gastos":"4000", "neto":"26000", "reduccion":"0", "base":"26000",
                             "estatal":"2455.5", "autonomica":"2294.9", "generado":"5000", "aplicado":"2294.9",
                             "saldo":"2705.1", "liquida":"2455.5", "diferencial":"1455.5"}.items():
            self.assertEqual(q[campo], F(valor), campo)

    def test_cuota_suficiente_sin_saldo(self):
        q = origen(factura="1000")
        self.assertEqual((q["generado"],q["aplicado"],q["saldo"]), (F(500),F(500),F(0)))

    def test_aplicacion2025_escasa_y_prioridad_agua(self):
        q = origen()
        self.assertEqual(consumir2025(q, "2560.9"), (F("2560.9"),F("144.2"),F(0)))
        self.assertEqual(consumir2025(q, "2560.9", "60"), (F("2560.9"),F("204.2"),F(0)))

    def test_cuota2025_suficiente_y_cero(self):
        q = origen()
        self.assertEqual(consumir2025(q,"6000"), (F("2705.1"),F(0),F("3294.9")))
        self.assertEqual(consumir2025(q,"0"), (F(0),F("2705.1"),F(0)))

    def test_ayudas_y_exceso_no_arrastrable(self):
        self.assertEqual(origen(ayuda="2000")["saldo"], F("1705.1"))
        q = origen(factura="20000")
        self.assertEqual((q["antes_tope"],q["exceso"],q["generado"],q["saldo"]), (F(10000),F(3000),F(7000),F("4705.1")))
        self.assertEqual(origen(ayuda="10000")["generado"], F(0))

    def test_art20_todos_los_tramos_y_minimo_limitado(self):
        for bruto,ss,base in [("17000","1000","8707"),("18000","1000","11457"),
                              ("20000","1000","16147.85"),("30000","2000","26000")]:
            self.assertEqual(cuotas(bruto,ss)["base"], F(base))
        self.assertEqual(cuotas("10000","0")["autonomica"], F(0))
        self.assertEqual(art20(F("17673.52")), F("2364.34"))
        self.assertEqual(art20(F("19747.50")), F(0))

    def test_conservacion_sin_doble_consumo(self):
        q = origen()
        for cuota in [F(0),F("0.01"),F(2000),F(8000)]:
            total,pendiente,disponible = consumir2025(q,cuota)
            self.assertEqual(q["generado"], q["aplicado"]+total+pendiente)
            self.assertEqual(cuota,total+disponible)

    def test_no_aplicado_no_produce_saldo(self):
        with self.assertRaises(ValueError):
            origen(eleccion="no_aplicar")

    def test_casillas_oficiales_y_medio_centimo(self):
        for bruto, ss, cuota, saldo in [("17000","1000","299.92","4700.08"), ("18000","1000","561.17","4438.83"), ("20000","1000","1069.66","3930.34"), ("30000","2000","2294.90","2705.10")]:
            q = origen(bruto=bruto, ss=ss)
            self.assertEqual(q["autonomica"], F(cuota))
            self.assertEqual(q["saldo"], F(saldo))
        q = origen(factura="10000.01")
        self.assertEqual((q["generado"], q["saldo"], q["exceso"], q["ajuste"]), (F("5000.01"), F("2705.11"), F(0), F("0.005")))

    def test_vencimiento_y_frontera(self):
        self.assertEqual(origen()["ultimo_ejercicio"],2026)
        self.assertTrue(2024 < 2025 <= 2026)
        self.assertFalse(2024 < 2027 <= 2026)
        self.assertFalse(2022 < 2025 <= 2024)
        with self.assertRaises(ValueError):
            origen(bruto="39000")


if __name__ == "__main__":
    unittest.main()
