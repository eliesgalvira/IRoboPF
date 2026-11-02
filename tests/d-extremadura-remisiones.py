import importlib.util
import json
from pathlib import Path
import unittest
from decimal import Decimal

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'docs/procedencia/deducciones-2025/correcciones/d-extremadura-remisiones'
ROWS = {r['codigo'].removeprefix('extremadura_'): r for r in json.loads((FOLDER / 'matriz.json').read_text())['deducciones']}
VERSIONS = {v['id']: v for v in json.loads((FOLDER / 'evidencia.json').read_text())['versiones']}


class ContrasteExtremadura(unittest.TestCase):
    def test_cobertura_y_referencias(self):
        spec = importlib.util.spec_from_file_location('verificar_ext', FOLDER / 'verificar.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        self.assertEqual(module.verificar(FOLDER)['codigos'], 19)

    def test_preserva_cinco_articulos(self):
        for code, article in [('intereses_vivienda_jovenes', '11 quater'), ('donaciones_entidades_culturales_deportistas', '11 quinquies'), ('traslado_residencia_habitual', '11 sexies'), ('ayudas_subvenciones_ela', '11 septies'), ('enfermos_ela_familiares', '11 octies')]:
            with self.subTest(code=code):
                self.assertIn(article, ROWS[code]['articulo'])

    def test_base_intereses_no_es_cuota(self):
        literal = '\n'.join(p['textoLiteral'] for p in VERSIONS['EXT-a1-15-1']['pasajes'])
        self.assertIn('base de deducción máxima de 1.000', literal)
        self.assertEqual(Decimal('1000') * Decimal('.25'), Decimal('250'))
        self.assertIn('máximo deducción250', ROWS['intereses_vivienda_jovenes']['conclusion'])

    def test_congelacion_2012_no_usa_supresion_2013(self):
        for code in ['intereses_vivienda_jovenes', 'vivienda_jovenes_victimas_terrorismo']:
            refs = ROWS[code]['versionesAplicables']
            self.assertIn('LIRPF-a68-5', refs)
            self.assertIn('LIRPF-a70-1', refs)
            self.assertNotIn('LIRPF-a70-2', refs)

    def test_censo_no_se_extiende_a_residencia(self):
        text = '\n'.join(p['textoLiteral'] for p in VERSIONS['EXT-a9-10-2']['pasajes'])
        self.assertIn('artículo 9.ter', text)
        self.assertIn('SUP-EXT-historia-an-2', ROWS['rehabilitacion_viviendas_zonas_rurales_alquiler']['versionesAplicables'])
        self.assertNotIn('SUP-EXT-historia-an-2', ROWS['residencia_municipios_menos_3000']['versionesAplicables'])

    def test_reserva_fecha_no_se_oculta(self):
        row = ROWS['vivienda_zonas_rurales']
        self.assertEqual(row['decision'], 'diferencia_actual')
        self.assertIn('21-3-2022', row['reservas'][0])
        self.assertFalse(row['lagunaDocumentalGeneral'])

    def test_deportista_no_es_cualquier_aficionado(self):
        text = '\n'.join(p['textoLiteral'] for p in VERSIONS['DEPORTE-a2-3-1']['pasajes'])
        self.assertIn('por cuenta propia', text)
        self.assertIn('aficionado', ROWS['donaciones_entidades_culturales_deportistas']['conclusion'])

    def test_ela_distintas_bases(self):
        self.assertIn('tipos medios', ROWS['ayudas_subvenciones_ela']['conclusion'])
        self.assertIn('2000 por diagnosticado', ROWS['enfermos_ela_familiares']['conclusion'])
        self.assertEqual(Decimal('1000') * (Decimal('.10') + Decimal('.08')), Decimal('180'))

    def test_acreditaciones_son_hechos(self):
        for code, row in ROWS.items():
            with self.subTest(code=code):
                self.assertTrue(row['hechosIndividuales'])
                self.assertFalse(row['lagunaDocumentalGeneral'])
                self.assertTrue(row['discriminante'])

    def test_campos_completos_y_privacidad(self):
        for row in ROWS.values():
            fields = {f['campo']: f['valorFicha'] for f in row['campos']}
            self.assertTrue(fields['normativa'].startswith('Artículo'))
            self.assertTrue(fields['requisitos'])
        for file in FOLDER.glob('*'):
            if file.is_file():
                self.assertNotIn('/home/', file.read_text())


if __name__ == '__main__':
    unittest.main()
