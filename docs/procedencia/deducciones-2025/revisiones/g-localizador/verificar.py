"""Controles independientes del localizador; biblioteca estándar y sin Git/CAS."""
import copy
import hashlib
import json
from pathlib import Path
import unittest

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
FOLDER = ROOT / 'docs/procedencia/deducciones-2025/correcciones/g-vivienda'
EVIDENCE = json.loads((HERE / 'evidencias.json').read_text())


def validate(citation, chain):
    assert (citation['inicio'], citation['fin']) == (425731, 428476)
    assert citation['pagina'] == 87 and citation['paginas'] == [87, 88]
    assert citation['fuente'] == 'dl14-original'
    assert citation['sha256'] == EVIDENCE['documentoSha256']
    assert hashlib.sha256(citation['literal'].encode()).hexdigest() == EVIDENCE['literalSha256']
    assert chain['remision'] == 'anexoII2.c D65/2019'
    assert chain['efecto'] == '2025-12-30'
    assert 'no trasladar a obra histórica' in chain['regla']
    assert chain['citas'] == ['gv-31']


class RevisionLocalizador(unittest.TestCase):
    def setUp(self):
        self.citation = next(c for c in json.loads((FOLDER / 'citas.json').read_text())['citas'] if c['id'] == 'gv-31')
        self.chain = next(c for c in json.loads((FOLDER / 'cadenas.json').read_text()) if c['id'] == 'cadena-31')

    def test_actual_y_archivos_conservados(self):
        validate(self.citation, self.chain)
        for item in EVIDENCE['archivosConservados']:
            with self.subTest(path=item['ruta']):
                self.assertEqual(hashlib.sha256((ROOT / item['ruta']).read_bytes()).hexdigest(), item['sha256'])

    def test_rechaza_desplazamiento_de_igual_longitud(self):
        changed = copy.deepcopy(self.citation)
        changed['inicio'] += 1
        changed['fin'] += 1
        with self.assertRaises(AssertionError):
            validate(changed, self.chain)

    def test_rechaza_porcentaje_alterado(self):
        changed = copy.deepcopy(self.citation)
        changed['literal'] = changed['literal'].replace('20 %', '21 %')
        with self.assertRaises(AssertionError):
            validate(changed, self.chain)

    def test_rechaza_cambio_temporal_y_obra_historica(self):
        for field, value in [('efecto', '2025-01-01'), ('regla', 'Aplicar a obra histórica.')]:
            with self.subTest(field=field):
                changed = copy.deepcopy(self.chain)
                changed[field] = value
                with self.assertRaises(AssertionError):
                    validate(self.citation, changed)


if __name__ == '__main__':
    unittest.main()
