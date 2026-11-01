"""Rojos intencionales de contrato; ejecutar separado de los controles del piloto."""
from pathlib import Path
import tempfile
import unittest

from casos import Counterexamples, f


class RequiredGuards(unittest.TestCase):
    def test_rp01_reject_coherent_unit_change_without_unit_evidence(self):
        fixture = Counterexamples()
        fixture.setUp()
        fixture.cell['unit'] = fixture.table['cells'][0]['unit'] = 'percent'
        with self.assertRaises(ValueError):
            f.compare([fixture.table], [fixture.cell], [fixture.item])

    def test_rp07_reject_nearby_trailing_sign(self):
        fixture = Counterexamples()
        fixture.setUp()
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            document = f.pymupdf.open()
            page = document.new_page()
            page.insert_text((50, 50), '12')
            page.insert_text((66, 50), '-')
            ref = f.put(root, document.tobytes(), 'application/pdf')
            document.close()
            table = {**fixture.table, 'document': ref, 'page': 1}
            table['cells'][0]['bbox'] = [48, 35, 64, 54]
            with self.assertRaises(ValueError):
                f.pdf_table(f.Store([root]), table)


if __name__ == '__main__':
    unittest.main(defaultTest='RequiredGuards')
