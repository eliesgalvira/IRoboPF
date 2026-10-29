"""Subpaso real del instrumento anterior; no representa una nómina completa."""
import ast
from decimal import Decimal
from pathlib import Path
import runpy
import unittest

SOURCE = Path('docs/procedencia/revisiones/retenciones-2012-2014-sol/regularizacion-casos.py')
tree = ast.parse(SOURCE.read_text())
branches = [n for n in ast.walk(tree) if isinstance(n, ast.If)
            and isinstance(n.test, ast.Compare) and isinstance(n.test.left, ast.Name)
            and n.test.left.id == 'cause' and isinstance(n.test.ops[0], ast.NotIn)]
assert len(branches) == 1
statements: list[ast.stmt] = list(branches)
operation = compile(ast.Module(body=statements, type_ignores=[]), str(SOURCE), 'exec')


class Guardia(unittest.TestCase):
    def test_alimentos_con_delta_positivo_conserva_techo(self) -> None:
        scope = runpy.run_path(str(SOURCE), run_name='instrumento_historico')
        scope.update(cause=4, old_base=Decimal('12000'), old_minimum=Decimal('2000'),
                     base=Decimal('13000'), minimum=Decimal('2000'),
                     calculated=Decimal('18'), old_final=Decimal('12'),
                     amount=Decimal('3000'), old_amount=Decimal('2000'),
                     retained=Decimal('1200'), salary=Decimal('30000'), spent=Decimal('20000'),
                     reviewed=False)
        exec(operation, scope)
        self.assertEqual(scope['calculated'], Decimal('12'),
                         'Hipótesis: nueva obligación judicial y85.2 ya calificados; mínimo0')


if __name__ == '__main__':
    unittest.main(verbosity=2)
