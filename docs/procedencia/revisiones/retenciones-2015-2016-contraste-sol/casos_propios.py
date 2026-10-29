"""Casos independientes de selección, bucles y magnitudes; sin motor."""
from decimal import Decimal
from fractions import Fraction
import unittest


class CasosPropios(unittest.TestCase):
    def test_ascendiente64_visible(self) -> None:
        for edad in (63, 64, 65, 74):
            visible = 64 < edad <= 74 or edad <= 64
            self.assertTrue(visible)

    def test_ordinal_no_es_minimo(self) -> None:
        anos = [2000, 2002, 2004, 2006, 0]
        i, literal = 1, 0
        while True:
            literal += 1
            i += 1
            if anos[i - 1] == 0 or i == 13:
                break
        self.assertEqual(literal, 4)
        self.assertEqual(len(anos[:-1]) - 3, 1)
        self.assertEqual(sum([2400, 2700, 4000, 4500]), 13600)

    def test_disdes_subpaso_contadores_calificados(self) -> None:
        grados = [0, 33]
        contador = sum(33 <= g < 65 for g in grados)
        literal = sum(3000 for g in grados[:contador] if g >= 33)
        por_sujeto = sum(3000 for g in grados if g >= 33)
        self.assertEqual((literal, por_sujeto), (0, 3000))

    def test_indice_ascendiente_no_avanza(self) -> None:
        i, j, contador = 4, 1, 1
        termina = []
        for _ in range(5):
            j += 1
            termina.append(i == contador + 1)
        self.assertEqual(j, 6)
        self.assertFalse(any(termina))

    def test_dt12_y_tope_gastos(self) -> None:
        capital = Decimal('3000')
        reduccion = capital * Decimal('.4')
        legal = min(Decimal(2000), capital - reduccion)
        literal = min(Decimal(2000), capital)
        self.assertEqual((reduccion, legal, literal), (1200, 1800, 2000))
        self.assertEqual(max(0, capital - reduccion - legal - 3700), 0)
        self.assertEqual(max(0, capital - reduccion - literal - 3700), 0)
        self.assertLess(min(Decimal(2000), Decimal(1000)), 2000)

    def test_causa11(self) -> None:
        def admisible(causas: set[int]) -> bool:
            return bool(causas) and not (11 in causas and len(causas) > 1)
        self.assertFalse(admisible({6, 11}))
        self.assertFalse(admisible({1, 11}))
        self.assertTrue(admisible({11}))
        self.assertEqual(Fraction(6000 - 1500, 15000) * 100, 30)
        self.assertEqual(Fraction(4500 - 1500, 15000) * 100, 20)

    def test_art84_no_excluye_declaracion1800(self) -> None:
        renta = 2000
        self.assertGreater(renta, 1800)
        self.assertLessEqual(renta, 8000)
        # Hechos: hijo20 convive, renta2000, declara; dos progenitores con derecho.
        self.assertEqual(Fraction(2400, 2), 1200)

    def test_doble600_no_resuelto(self) -> None:
        legal_disyuntiva = 600 if True or True else 0
        suma_pdf = 600 + 600
        self.assertEqual(suma_pdf - legal_disyuntiva, 600)

    def test_movilidad_por_periodo(self) -> None:
        def vigente(ejercicio: int, traslado: int) -> bool:
            return traslado <= ejercicio <= traslado + 1
        self.assertTrue(vigente(2016, 2015))
        self.assertTrue(vigente(2016, 2016))
        self.assertFalse(vigente(2016, 2014))
        self.assertEqual(2000 + 2000 + 7750, 11750)


if __name__ == '__main__':
    unittest.main()
