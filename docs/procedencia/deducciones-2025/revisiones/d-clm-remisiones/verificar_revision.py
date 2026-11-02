"""Fronteras documentales pequeñas; no evalúa cuotas ni necesita corpus privado."""
import json
from pathlib import Path
import re
import unittest

HERE = Path(__file__).resolve().parent
CITAS = {c['id']: c for c in json.loads((HERE / 'evidencia-fronteras.json').read_text())['citas']}
MUNICIPIOS = json.loads((HERE / 'municipios.json').read_text())['municipios']
DICTAMENES = json.loads((HERE / 'dictamenes.json').read_text())['deducciones']


class Fronteras(unittest.TestCase):
    def test_anexo_original_enumera_25_sin_duplicados(self):
        filas = re.findall(r'(Albacete|Ciudad Real|Toledo)\s+(\d{4,5})\s+([^\n]+)', CITAS['intermedias2023-p2']['textoLiteral'])
        self.assertEqual(len(filas), 25)
        self.assertEqual(len({c.zfill(5) for _, c, _ in filas}), 25)
        self.assertEqual([sum(p == provincia for p, _, _ in filas) for provincia in ['Albacete', 'Ciudad Real', 'Toledo']], [5, 4, 16])
        self.assertEqual([(r['provincia'], r['ine'], r['nombre']) for r in MUNICIPIOS], [(p, c.zfill(5), n.strip()) for p, c, n in filas])

    def test_acuerdo_extiende_articulo_12bis(self):
        texto = CITAS['intermedias2023-p1']['textoLiteral']
        self.assertIn('Acuerdo de 07/02/2023', texto)
        self.assertIn('artículo 12 bis', texto)
        self.assertIn('1 de enero de 2016 al 1 de enero de 2021', texto)

    def test_padron_y_salvaguarda_son_operaciones_distintas(self):
        self.assertIn('1 de enero de cada año', CITAS['CLM-DA2-1']['textoLiteral'])
        self.assertIn('padrón municipal de 2021', CITAS['CLM-DA2-2']['textoLiteral'])
        self.assertIn('minoración o inaplicación', CITAS['CLM-DA2-2']['textoLiteral'])

    def test_reserva_no_suprime_ninguna_de_las_dos_evidencias(self):
        ley = CITAS['CLM2026-art18']['textoLiteral']
        self.assertIn('Las previstas en los artículos 12 y 12 ter', ley)
        self.assertIn('periodo impositivo iniciado el 1 de enero de 2025', CITAS['CLM2026-DF6']['textoLiteral'])
        self.assertIn('no se aplica al periodo impositivo del IRPF de 2025', CITAS['AVISO2025']['textoLiteral'])
        self.assertEqual({r['codigo'] for r in DICTAMENES if r['reserva']}, {'clm_intereses_primera_vivienda_menores_40', 'clm_adquisicion_rehabilitacion_vivienda_zonas_rurales'})

    def test_identificacion_cuenta_es_exigencia_de_norma(self):
        texto = CITAS['CLM2026-art18']['textoLiteral']
        self.assertIn('g) Las cuentas deberán identificarse separadamente en la autoliquidación', texto)
        self.assertIn('fecha de apertura y el incremento de saldo', texto)

    def test_persona_mayor_y_ascendiente_son_supuestos_distintos(self):
        self.assertIn('Los contribuyentes mayores de 75 años', CITAS['CLM-a6-1:p2']['textoLiteral'])
        self.assertIn('por el cuidado de cada ascendiente', CITAS['CLM-a6-1:p3']['textoLiteral'])
        self.assertNotIn('ascendiente', CITAS['CLM-a6-1:p2']['textoLiteral'])

    def test_continuacion_perros_contiene_condiciones_no_solo_importe(self):
        texto = CITAS['manual-perros-282']['textoLiteral']
        for literal in ['100 euros anuales por contribuyente', 'unidad de vinculación', 'factura', 'subvencionados', '27.000', '36.000']:
            self.assertIn(literal, texto)


if __name__ == '__main__':
    unittest.main()
