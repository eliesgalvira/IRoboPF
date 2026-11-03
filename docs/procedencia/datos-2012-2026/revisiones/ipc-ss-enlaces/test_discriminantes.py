"""Discriminantes sintéticos: el adaptador debe comprobar las etiquetas.

Ejecutar con unittest; no necesitan originales, CAS ni Git.
"""
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(ROOT / 'tools/procedencia/datos/lotes/ipc-ss'))
import enlaces
import lote


class Controles(unittest.TestCase):
    def test_fuente_ausente(self):
        self.assertRaises(ValueError, enlaces.flujo.Store([]).read,
                          {'sha256': '0' * 64, 'size': 1})

    def test_indice_y_mes_no_son_tasa_diciembre(self):
        raw = ('Grupos ECOICOP;Tipo de dato;Periodo;Total\n'
               'Índice general;Índice;2024M12;100,0\n').encode()
        spec = dict(group='Índice general', measure='Índice', period='2024M12',
                    unit='index', scale=100)
        self.assertRaises(ValueError, lote.select_ipc, raw, spec)
        spec.update(measure='Variación anual', unit='percent', period='2024M11')
        self.assertRaises(ValueError, lote.select_ipc, raw, spec)

    def test_comparacion_sin_vigencia_es_solo_aritmetica(self):
        self.assertEqual(enlaces.compare('4070.10', '48841.20', 12), 'match')
        # compare no recibe sujeto, año, columna ni período.


class Discriminantes(unittest.TestCase):
    def test_columna_y_periodo_no_pueden_reetiquetarse(self):
        import pymupdf
        doc = pymupdf.open()
        page = doc.new_page()
        page.insert_text((50, 50), '2024 enero-julio. Minimum 1.000,00')
        word = next(w for w in page.get_text('words') if w[4] == '1.000,00')
        raw = doc.tobytes()
        class Memory:
            def read(self, ref):
                return raw
        spec = dict(row='1', column='maximum', unit='EUR', periodUnit='EUR/month',
                    bbox=[word[0]-.01, word[1]-.01, word[2]+.01, word[3]+.01])
        table = dict(code='synthetic', year=2024, territory='ES', page=1,
                     document={'sha256': enlaces.flujo.digest(raw), 'size': len(raw)},
                     cells=[spec])
        cells, _ = enlaces.bases(Memory(), {'bases': [table], 'rawTables': []})
        self.assertFalse(any(x['column'] == 'maximum' and
                             x['period']['through'] == '2024-12' for x in cells),
                         'Una mínima enero-julio se etiqueta máxima de año completo')

    def test_segundo_cargo_debe_ser_trabajador(self):
        text = ('Formación Profesional: el 0,70 por ciento, del que el '
                '0,60 por ciento será a cargo de la empresa y el '
                '0,10 por ciento a cargo de la empresa.')
        rows = enlaces.semantic_rates(text)
        self.assertFalse(any(x['party'] == 'trabajador' for x in rows),
                         'Se asigna trabajador sin comprobar su literal de cargo')

    def test_anio_no_puede_reetiquetarse_sin_evidencia(self):
        import pymupdf
        doc = pymupdf.open()
        page = doc.new_page()
        page.insert_text((50, 50), 'Ejercicio 2024. Formación Profesional: el 0,70 por ciento,')
        # Helvetica no conserva el acento; usar concepto sin acento tolerado por regex.
        page.insert_text((50, 70), 'del que el 0,60 por ciento sera a cargo de la empresa y el 0,10 por ciento')
        page.insert_text((50, 90), 'a cargo del trabajador.')
        raw = doc.tobytes()
        class Memory:
            def read(self, ref):
                return raw
        ref = {'sha256': enlaces.flujo.digest(raw), 'size': len(raw)}
        # Mismo PDF con dos años; la extracción no comprueba la vigencia.
        a = enlaces.extract_rates(Memory(), ref, 2024)
        self.assertTrue(a, 'Fixture debe extraer tipos')
        # La fixture ahora acredita el segundo cargo para aislar el fallo temporal.
        # Exigir rechazo expreso; comparar dos listas no comprueba ese contrato.
        with self.assertRaisesRegex(ValueError, 'Año solicitado'):
            enlaces.extract_rates(Memory(), ref, 2025)


if __name__ == '__main__':
    unittest.main()
