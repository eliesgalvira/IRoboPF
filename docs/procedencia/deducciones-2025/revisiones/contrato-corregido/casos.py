"""Contraste acotado independiente; reutiliza solo fixtures sintéticos anteriores.

Ejecutar con REVIEW_TMP externo y uv run --no-project --python python3
--no-managed-python --with jsonschema==4.26.0 python <este archivo>.
No descarga originales ni modifica producto o paquetes recibidos.
"""
import copy
import importlib.util
from pathlib import Path
import sys
import unittest

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location(
    'revision_previa', Path(__file__).parents[1] / 'contrato/casos.py')
revision = importlib.util.module_from_spec(spec)
spec.loader.exec_module(revision)


class Contraste(unittest.TestCase):
    setUp = revision.Contrato.setUp
    verificar = revision.Contrato.verificar
    historia_corregida = revision.Contrato.historia_corregida
    contraejemplo = revision.Contrato.contraejemplo

    def test_R01_migracion_conserva_todo_solo_anade_fase(self):
        self.historia_corregida()
        anterior = copy.deepcopy(self.f['comparaciones'][0])
        anterior.update(resultado='diferencia',
                        motivo='Histórica, corregida; no es comparación actual')
        self.f['comparaciones'].append(anterior)
        ambiguo = copy.deepcopy(self.paquetes)
        with self.assertRaisesRegex(ValueError, 'global oculta diferencia actual'):
            self.verificar(self.paquetes[:1], 'parcial')
        anterior['momento'] = 'antes'
        self.verificar(self.paquetes[:1], 'parcial')
        restaurado = copy.deepcopy(self.paquetes)
        del restaurado[0]['dictamenes']['deducciones'][0]['comparaciones'][1]['momento']
        self.assertEqual(restaurado, ambiguo)

    def test_R01_contraste_de_otro_campo_no_suple_actual(self):
        self.historia_corregida()
        self.f['comparaciones'][0].update(momento='antes', resultado='diferencia')
        otra = copy.deepcopy(self.f['comparaciones'][0])
        otra.update(campoCodigo='limite', momento='despues', resultado='coincide')
        self.f['comparaciones'].append(otra)
        with self.assertRaisesRegex(ValueError, 'sin contraste actual del mismo aspecto'):
            self.verificar(self.paquetes[:1], 'parcial')

    def test_R01_diferencia_y_reserva_actuales_preservadas(self):
        self.f.update(dictamenAntes='diferencia', dictamenDespues='diferencia',
                      dictamenFicha='diferencia')
        self.f['contraejemplos'] = [self.contraejemplo()]
        self.f['comparaciones'][0].update(resultado='diferencia', momento='despues')
        reserva = copy.deepcopy(self.f['comparaciones'][0])
        reserva.update(campoCodigo='limite', resultado='no_verificable')
        self.f['comparaciones'].append(reserva)
        with self.assertRaisesRegex(ValueError, 'global oculta reserva actual'):
            self.verificar(self.paquetes[:1], 'parcial')
        self.f['pendientes'] = [dict(causa='Remisión sintética sin original',
            actuacionesRealizadas=['Cotejo sintético del apartado'],
            evidenciaNecesaria='Original de la remisión sintética')]
        self.verificar(self.paquetes[:1], 'parcial')
        self.f['dictamenFicha'] = 'coincide'
        with self.assertRaisesRegex(ValueError, 'global oculta diferencia actual'):
            self.verificar(self.paquetes[:1], 'parcial')

    def test_R02_adquisiciones_no_mutadas_y_citas_locales(self):
        doc = self.paquetes[1]['fuentes']['documentos'][1]
        doc.update(id='manual-local', urlOficial='https://example.invalid/manual-copia',
                   fechaRecuperacion='2026-11-01T18:00:00Z', identificador='copia-independiente')
        for f in self.paquetes[1]['dictamenes']['deducciones']:
            f['manual']['documentoId'] = 'manual-local'
            f['citas'][1]['documentoId'] = 'manual-local'
        antes = copy.deepcopy(self.paquetes)
        self.verificar(self.paquetes[:2], 'parcial')
        self.assertEqual(self.paquetes, antes)
        # El documento sigue existiendo en otro lote; no satisface la cita local.
        self.paquetes[0]['dictamenes']['deducciones'][0]['citas'][1]['documentoId'] = 'manual-local'
        with self.assertRaisesRegex(ValueError, 'Documento no declarado'):
            self.verificar(self.paquetes[:2], 'parcial')

    def test_R02_contenido_compartido_sha512_y_mime(self):
        doc = self.paquetes[1]['fuentes']['documentos'][1]
        original = copy.deepcopy(doc)
        for campo, valor in [('sha512', '0' * 128), ('mimeType', 'application/pdf')]:
            with self.subTest(campo=campo):
                doc.update(original)
                doc[campo] = valor
                with self.assertRaisesRegex(ValueError, 'Contenido contradictorio'):
                    self.verificar(self.paquetes[:2], 'parcial', cas=False)

    def test_R02_id_duplicado_local_sigue_prohibido(self):
        docs = self.paquetes[0]['fuentes']['documentos']
        docs.append(copy.deepcopy(docs[1]))
        with self.assertRaisesRegex(ValueError, 'Documentos: duplicados'):
            self.verificar(self.paquetes[:1], 'parcial')

    def test_R03_posicion_codificacion_y_vacios(self):
        doc = self.paquetes[0]['fuentes']['documentos'][0]
        for query in ('%54oKeN', 'id=ley&%6Bey=', 'id=ley&AUTH&pagina=2',
                      'id=ley&SeSsIoN=MARCADOR_SINTETICO', '%73ignature=&id=ley'):
            with self.subTest(query=query):
                doc['urlOficial'] = 'https://example.invalid/norma?' + query
                with self.assertRaisesRegex(ValueError, 'credenciales'):
                    self.verificar(self.paquetes[:1], 'parcial')
        doc['urlOficial'] = 'https://example.invalid/norma?id=ley&pagina=&id=anexo'
        self.verificar(self.paquetes[:1], 'parcial')


if __name__ == '__main__':
    unittest.main(verbosity=2)
