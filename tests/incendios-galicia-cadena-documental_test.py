"""Contrato documental de la exención estatal, sin CAS ni datos personales."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
LOT = ROOT / 'docs/procedencia/deducciones-2025/lotes/e'
CODE = 'galicia_ayudas_incendios_peifoga_2025'


class CadenaIncendios(unittest.TestCase):
    def setUp(self):
        self.row = next(r for r in json.loads((LOT / 'dictamenes.json').read_text())['deducciones'] if r['codigo'] == CODE)
        self.sources = {r['id']: r for r in json.loads((LOT / 'fuentes.json').read_text())['documentos']}

    def test_original_posterior_y_convalidacion_identificados(self):
        expected = {
            'rev-e-rdl10': ('eb6180e1aedb7e2f77fa9f0166daa0f2918c8379201a14ea136abb5c6fb99f33', '2026-04-29'),
            'rev-e-convalidacion10': ('73a481446e2842aebf65e9375ca01a39cba37decb1784d1ebdb9580056a89d13', '2026-05-22'),
        }
        for key, (digest, date) in expected.items():
            with self.subTest(source=key):
                self.assertEqual(self.sources[key]['sha256'], digest)
                self.assertEqual(self.sources[key]['fechaPublicacion'], date)

    def test_articulo_2_conserva_limites_personales_y_temporales(self):
        cite = next(c for c in self.row['citas'] if c['id'] == CODE + '-exencion-rdl10-art2')
        text = ' '.join(cite['textoLiteral'].split())
        for fragment in ('Desde el 26 de agosto de 2025', 'daños personales', 'Acuerdo del Consejo de Ministros', 'entre el 23 de junio y el 25 de agosto de 2025'):
            self.assertIn(fragment, text)
        self.assertEqual(cite['articulo'], 'Artículo 2')
        self.assertIn("select('p')[62]", cite['localizador']['recetaExtraccion'])

    def test_no_confunde_entrada_en_vigor_y_efectos(self):
        chain = self.row['vigencia']['cadenaLocalizada']
        source = next(r for r in chain if r['documentoId'] == 'rev-e-rdl10')
        self.assertIn('30/04/2026', source['norma'])
        self.assertIn('26/08/2025', source['norma'])
        self.assertTrue(any(c['documentoId'] == 'rev-e-convalidacion10' for c in self.row['citas']))

    def test_derogaciones_se_conservan_como_antecedentes(self):
        ids = {c['id'] for c in self.row['citas']}
        self.assertIn(CODE + '-aux-derogacion16-4', ids)
        self.assertIn(CODE + '-aux-derogacion2-4', ids)

    def test_limite_de_clasificacion_no_se_convierte_en_exencion_global(self):
        source = (ROOT / 'lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/galicia.ts').read_text()
        start = source.index('codigo: "' + CODE + '"')
        ficha = source[start:source.index('\n  {', start)]
        self.assertIn('RDL 10/2026', ficha)
        self.assertIn('20 de mayo de 2026', ficha)
        self.assertIn('no amplía el intervalo estatal', ficha)
        self.assertIn('importe efectivamente integrado', ficha)
        self.assertEqual(self.row['dictamenCalculo'], 'no_verificable')
        self.assertNotIn('no localizada disposición posterior', json.dumps(self.row['pendientes'], ensure_ascii=False))


if __name__ == '__main__':
    unittest.main()
