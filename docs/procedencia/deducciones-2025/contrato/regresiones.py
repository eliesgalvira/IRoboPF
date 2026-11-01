"""Regresiones del contrato; reutilizan fixtures sintéticos de la revisión.

Las pruebas originales permanecen intactas. El positivo histórico se representa
con momento=antes, sin deducir su estado de una frase libre.
"""
import copy
import importlib.util
from pathlib import Path
import sys
import unittest

sys.dont_write_bytecode = True
REPO = Path(__file__).resolve().parents[4]
spec = importlib.util.spec_from_file_location(
    'revision_contrato', REPO / 'docs/procedencia/deducciones-2025/revisiones/contrato/casos.py')
revision = importlib.util.module_from_spec(spec)
spec.loader.exec_module(revision)


class ContratoCorregido(revision.Contrato):
    def test_positivo_historia_explicita(self):
        self.historia_corregida()
        anterior = copy.deepcopy(self.f['comparaciones'][0])
        anterior.update(resultado='diferencia', valorCodigo=90, momento='antes',
                        motivo='Diferencia anterior al cambio acreditado')
        self.f['comparaciones'].append(anterior)
        self.verificar()

    def test_historia_sin_momento_no_se_infiere_del_texto(self):
        with self.assertRaises(ValueError):
            super().test_positivo_historia_explicita()

    def test_comparacion_anterior_necesita_cambio(self):
        self.f['comparaciones'][0]['momento'] = 'antes'
        with self.assertRaisesRegex(ValueError, 'anterior sin cambio'):
            self.verificar()

    def test_comparacion_anterior_necesita_contraste_actual(self):
        self.historia_corregida()
        self.f['comparaciones'][0].update(momento='antes', resultado='diferencia')
        with self.assertRaisesRegex(ValueError, 'sin contraste actual'):
            self.verificar()

    def test_fix_de_otro_aspecto_no_oculta_diferencia_actual(self):
        self.historia_corregida()
        anterior = copy.deepcopy(self.f['comparaciones'][0])
        anterior.update(momento='antes', resultado='diferencia')
        self.f['comparaciones'].append(anterior)
        actual = copy.deepcopy(anterior)
        actual.update(momento='despues', campoCodigo='limite', motivo='Problema actual')
        self.f['comparaciones'].append(actual)
        with self.assertRaisesRegex(ValueError, 'global oculta diferencia actual'):
            self.verificar()

    def test_reserva_actual_persiste_tras_fix(self):
        self.historia_corregida()
        anterior = copy.deepcopy(self.f['comparaciones'][0])
        anterior.update(momento='antes', resultado='diferencia')
        self.f['comparaciones'].append(anterior)
        self.f['comparaciones'][0]['resultado'] = 'no_verificable'
        with self.assertRaises(ValueError):
            self.verificar()

    def test_diferencia_actual_no_se_sostiene_solo_en_historia(self):
        self.historia_corregida()
        anterior = copy.deepcopy(self.f['comparaciones'][0])
        anterior.update(momento='antes', resultado='diferencia')
        self.f['comparaciones'].append(anterior)
        self.f.update(dictamenDespues='diferencia', dictamenFicha='diferencia')
        with self.assertRaisesRegex(ValueError, 'diferencia actual sin comparación actual'):
            self.verificar()

    def test_fase_desconocida_no_oculta_comparacion(self):
        self.f['comparaciones'][0].update(momento='omitida', resultado='diferencia')
        with self.assertRaises(Exception):
            self.verificar()

    def test_contenido_compartido_no_admite_tamano_contradictorio(self):
        self.paquetes[1]['fuentes']['documentos'][1]['bytes'] += 1
        with self.assertRaisesRegex(ValueError, 'Contenido contradictorio'):
            self.verificar(self.paquetes[:2], 'parcial', cas=False)

    def test_identidades_documentales_locales_al_lote(self):
        doc = self.paquetes[1]['fuentes']['documentos'][1]
        doc.update(urlOficial='https://example.invalid/otra-adquisicion',
                   fechaRecuperacion='2026-11-01T16:00:00Z')
        self.verificar(self.paquetes[:2], 'parcial')

    def test_dos_adquisiciones_en_un_lote(self):
        extra = copy.deepcopy(self.paquetes[0]['fuentes']['documentos'][1])
        extra.update(id='manual-otra', fechaRecuperacion='2026-11-01T15:00:00Z')
        self.paquetes[0]['fuentes']['documentos'].append(extra)
        self.verificar(self.paquetes[:1], 'parcial')

    def test_parametros_credencial_decodificados_y_vacios(self):
        doc = self.paquetes[0]['fuentes']['documentos'][0]
        for query in ('%74oken=MARCADOR', 'TOKEN=', 'a=1&auth=MARCADOR', 'key',
                      'session=MARCADOR', 'signature=MARCADOR'):
            with self.subTest(query=query):
                doc['urlOficial'] = 'https://example.invalid/norma?' + query
                with self.assertRaisesRegex(ValueError, 'credenciales'):
                    self.verificar(self.paquetes[:1], 'parcial')

    def test_parametro_documental_no_es_credencial(self):
        self.paquetes[0]['fuentes']['documentos'][0]['urlOficial'] += '?id=ley-2025'
        self.verificar(self.paquetes[:1], 'parcial')

    def test_publicacion_original_de_reforma_o_correccion(self):
        for tipo in ('reforma', 'correccion'):
            with self.subTest(tipo=tipo):
                self.paquetes[0]['fuentes']['documentos'][0]['tipo'] = tipo
                self.verificar(self.paquetes[:1], 'parcial')

    def test_consolidado_no_sustituye_publicacion_original(self):
        self.paquetes[0]['fuentes']['documentos'][0]['tipo'] = 'consolidado'
        with self.assertRaisesRegex(ValueError, 'sin original/comparación'):
            self.verificar(self.paquetes[:1], 'parcial')


if __name__ == '__main__':
    unittest.main(verbosity=2)
