"""Reproducción literal documental; fallo esperado, no llama al motor."""
import unittest


class LiteralPDF(unittest.TestCase):
    def test_ascendiente64_discapacitado_2015(self) -> None:
        age, disability = 64, True
        literal = 64 < age <= 74 or age < 64 and disability
        self.assertTrue(literal, 'Art59 permite ascendiente discapacitado cualquiera que sea su edad')

    def test_cuarto_y_sucesivos(self) -> None:
        # Página12 física: i=1, aumenta hasta fin de cuatro registros.
        literal_count = len([2000, 2002, 2004, 2006])
        self.assertEqual(literal_count, 1, 'Cuatro descendientes solo contienen un cuarto y sucesivos')

    def test_discapacidad_segundo_hijo(self) -> None:
        # Página27 física: NUMDES3365=1, NUMDES65=0; recorre solo i=1.
        grades = [0, 33]
        literal = sum(3000 if x >= 33 else 0 for x in grades[:1])
        self.assertEqual(literal, 3000, 'Art60 no excluye al segundo hijo por posición')


if __name__ == '__main__':
    unittest.main()
