"""Oráculo propio independiente, stdlib Fraction. No importa ni ejecuta el motor.
GRANT0: preparado y analizado sintácticamente; NO ejecutado.
Ejecución posterior por el padre: timeout -k 30s 1m python3 -m unittest discover -s tests -p familia-empleo-pension-2025_test.py
"""
import json
import unittest
from fractions import Fraction as F
from pathlib import Path


def reduccion(previo):
    if previo <= F(14852):
        return F(7302)
    if previo <= F("17673.52"):
        return F(7302) - F("1.75") * (previo - F(14852))
    if previo < F("19747.50"):
        return F("2364.34") - F("1.14") * (previo - F("17673.52"))
    return F(0)


class FamiliaEmpleoPension(unittest.TestCase):
    def test_fixture_exacta(self):
        rows = json.loads(Path(__file__).with_name("familia-empleo-pension-2025.oraculos.json").read_text())
        for row in rows:
            with self.subTest(row=row):
                empleo, pension = F(row["empleo"]), F(row["pension"])
                previo = empleo + pension
                general = min(F(2000), max(F(0), previo))
                # 365 días activos certificados; ningún gasto a-e en estas filas.
                activo = min(F(7750), max(F(0), empleo - general), max(F(0), previo - general))
                art19 = previo - general - activo
                base = art19 - min(max(F(0), art19), reduccion(previo))
                self.assertEqual(art19, F(row["art19"]))
                self.assertEqual(base, F(row["general"]))

    def test_fronteras_y_parcial(self):
        self.assertEqual(F(73, 365) * 2000, 400)
        self.assertEqual(F(17000) - 2000 - 600 - reduccion(F(17000)), 10857)
        self.assertEqual(F(26293) + 3707, 30000)
        self.assertGreater(F("26293.01") + 3707, 30000)
        self.assertEqual(F(26056) + 97664, 30930 * 4)
        self.assertGreater(F(26056) + F("97664.01"), 30930 * 4)
