"""Expectativas del techo condicionado; no evalúa admisión ni nóminas."""
from decimal import Decimal
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path.cwd()
HERE = Path(__file__).resolve().parent
INTERPRETER = ROOT / 'docs/procedencia/correcciones/retenciones-2015-2016-r22/contraste.py'
spec = importlib.util.spec_from_file_location('techo_documental_r22', INTERPRETER)
assert spec is not None and spec.loader is not None
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)


class TechoCondicionado(unittest.TestCase):
    def test_fronteras_y_minimo_compatible(self) -> None:
        data = json.loads((HERE / 'ajustes.json').read_text())
        rows = [x for x in data['corrections'] if x['id'].endswith(':CAUSA4')]
        self.assertEqual(len(rows), 4)
        cases = [('0', '12', '0'), ('6', '12', '6'), ('11.99', '12', '11.99'),
                 ('12', '12', '12'), ('12.01', '12', '12'), ('18', '12', '12'),
                 ('15', '15', '15'), ('20', '15', '15')]
        for row in rows:
            step = row['replacement']['subpasoDocumental']
            self.assertIs(step['evaluatesAdmission'], False)
            self.assertIs(step['completePayroll'], False)
            for candidate, previous, expected in cases:
                with self.subTest(id=row['id'], candidate=candidate):
                    actual = reader.literal_substep(step['formula'], Decimal(candidate), Decimal(previous))
                    self.assertEqual(actual, Decimal(expected))
                    self.assertLessEqual(actual, Decimal(candidate))
        self.assertIs(data['completeRuleAcceptance'], False)
        self.assertEqual(data['enableVersions'], [])

    def test_fuentes_y_reemplazos_exactos(self) -> None:
        data = json.loads((HERE / 'ajustes.json').read_text())
        for source in data['sources'] + [data['independentReview']]:
            self.assertEqual(hashlib.sha256((ROOT / source['path']).read_bytes()).hexdigest(), source['sha256'])
        ids = [x['id'] for x in data['corrections']]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(len(ids), 12)
        evidence = json.loads((HERE / 'evidencia.json').read_text())
        self.assertEqual(len(evidence['algorithmCrops']), 8)
        self.assertEqual(len(evidence['primary']), 2)
        for item in evidence['algorithmCrops'] + evidence['primary']:
            crop = item['facsimile']
            self.assertEqual(hashlib.sha256((ROOT / crop['path']).read_bytes()).hexdigest(), crop['sha256'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
