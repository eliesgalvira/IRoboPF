"""Contraejemplo de la asignación documental, sin ejecutar el motor."""
from decimal import Decimal
import json
from pathlib import Path
import unittest

DATA = json.loads(Path('docs/procedencia/correcciones/retenciones-2015-2016-r21/ajustes.json').read_text())

class Contrato(unittest.TestCase):
    def test_asignacion_sin_guarda_de_subida(self) -> None:
        branches = [r for r in DATA['corrections'] if r['id'].endswith(':87.5-no-aumento')]
        self.assertEqual(len(branches), 3)
        for row in branches:
            with self.subTest(id=row['id']):
                replacement = row['replacement']
                self.assertEqual(replacement['formula'].split(';')[0], 'TIPOREG=TIPOA')
                self.assertNotIn('tipo pretende subir', replacement['condicion'])
                # Lectura literal: la alternativa85.2 se cumple aunque candidato6<anterior12.
                literal_assignment = Decimal('12')
                ceiling_operation = min(Decimal('6'), Decimal('12'))
                self.assertEqual(literal_assignment, ceiling_operation,
                                 '87.5 prohíbe incrementar; no exige elevar6 al anterior12')

if __name__ == '__main__':
    unittest.main()
