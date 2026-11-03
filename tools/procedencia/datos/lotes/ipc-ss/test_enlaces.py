"""Pruebas públicas: solo literales sintéticos; sin CAS, Git ni motor privado."""

import unittest
from decimal import Decimal

import enlaces


class SemanticsTest(unittest.TestCase):
    def test_percent_per_hundred_disability_is_not_rate(self):
        text = (
            "Contratación indefinida, discapacidad no inferior al 33 por ciento: "
            "7,05 por 100, del que el 5,50 por 100 será a cargo de la empresa "
            "y el 1,55 por 100 a cargo del trabajador."
        )
        rows = enlaces.semantic_rates(text)
        self.assertEqual(
            [(x["party"], x["literal"]) for x in rows],
            [("total", "7,05"), ("empresarial", "5,50"), ("trabajador", "1,55")],
        )
        for row in rows:
            self.assertEqual(text[row["start"] : row["end"]], row["literal"])

    def test_comma_before_and(self):
        rows = enlaces.semantic_rates(
            "Formación Profesional: el 0,70 por ciento, "
            "del que el 0,60 por ciento será a cargo de la empresa, y el 0,10 por ciento a cargo del trabajador."
        )
        self.assertEqual([r["literal"] for r in rows], ["0,70", "0,60", "0,10"])

    def test_no_unlabelled_numeric_coincidence(self):
        self.assertEqual(enlaces.semantic_rates("0,60 por ciento 0,10 por ciento"), [])

    def test_dimensions_are_explicit(self):
        self.assertEqual(enlaces.compare("4070.10", "48841.20", 12), "match")
        self.assertEqual(enlaces.compare("4070.10", "48841.20"), "difference")
        self.assertEqual(
            enlaces.period(2018, 8), {"from": "2018-08", "through": "2018-12"}
        )

    def test_duplicate_selector_refused(self):
        for values in ([], [1, 1]):
            with self.assertRaises(ValueError):
                enlaces.choose_unique(values)

    def test_2018_cap_not_average_clamp(self):
        salary = Decimal("45100")
        expected = (
            min(salary / 12, Decimal("3751.20")) * 7
            + min(salary / 12, Decimal("3803.70")) * 5
        )
        self.assertEqual(expected, Decimal("45050.06666666666666666666666"))
        self.assertNotEqual(expected, min(salary, Decimal("45276.90")))


if __name__ == "__main__":
    unittest.main()
