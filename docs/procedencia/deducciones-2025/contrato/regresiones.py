"""Regresiones del contrato; reutilizan fixtures sintéticos de la revisión.

Las pruebas originales permanecen intactas. El positivo histórico se representa
con momento=antes, sin deducir su estado de una frase libre.
"""
import copy
import importlib.util
from pathlib import Path
import sys
import unittest
from jsonschema import ValidationError

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

    def test_ruta_web_home_no_es_ruta_local(self):
        self.paquetes[0]['fuentes']['documentos'][0]['urlOficial'] = (
            'https://example.invalid/home/boletin/disposicion')
        self.verificar(self.paquetes[:1], 'parcial')

    def test_ruta_local_en_texto_sigue_rechazada(self):
        self.f['motivo'] = 'Referencia sintética /home/persona/documento'
        with self.assertRaisesRegex(ValueError, 'Contenido privado'):
            self.verificar(self.paquetes[:1], 'parcial')

    def test_manual_separa_fecha_editorial_de_publicacion_desconocida(self):
        manual = self.paquetes[0]['fuentes']['documentos'][1]
        manual.update(fechaPublicacion=None, fechaEditorial='2026-10-21',
                      reservaFechaPublicacion='Solo se conoce el pie editorial del documento')
        self.verificar(self.paquetes[:1], 'parcial')

    def test_fecha_desconocida_requiere_reserva_y_se_limita_al_manual(self):
        for indice in (0, 1):
            with self.subTest(documento=indice):
                doc = self.paquetes[0]['fuentes']['documentos'][indice]
                doc['fechaPublicacion'] = None
                if indice == 0:
                    doc['reservaFechaPublicacion'] = 'Desconocida en fixture'
                with self.assertRaises(Exception):
                    self.verificar(self.paquetes[:1], 'parcial')
                doc.update(self.docs[indice])

    def test_fecha_editorial_invalida_se_rechaza(self):
        manual = self.paquetes[0]['fuentes']['documentos'][1]
        manual.update(fechaPublicacion=None, fechaEditorial='2026-02-30',
                      reservaFechaPublicacion='Solo se conoce el pie editorial')
        with self.assertRaises(Exception):
            self.verificar(self.paquetes[:1], 'parcial')

    def test_credenciales_en_reservas_y_texto_se_rechazan(self):
        for url in ('https://user:pass@example.invalid/home/doc',
                    'https://example.invalid/home/doc?token=MARCADOR',
                    'https://example.invalid/norma?%54OKEN=',
                    'https://example.invalid/norma?session'):
            for valor in (url, 'Documento citado: ' + url):
                with self.subTest(valor=valor):
                    self.f['vigencia']['reservaURL'] = valor
                    with self.assertRaisesRegex(ValueError, 'credenciales'):
                        self.verificar(self.paquetes[:1], 'parcial')

    def test_destino_markdown_no_incluye_su_delimitador(self):
        for query in ('%54OKEN', 'session', 'key', 'auth', 'signature'):
            url = 'https://example.invalid/norma?' + query
            for texto in (f'[norma]({url})', f'({url})',
                          f'[norma]({url} "título")',
                          f'[otra](https://example.invalid/ley)[norma]({url})',
                          f'[norma](https://example.invalid/articulo(2)?{query})'):
                with self.subTest(query=query, texto=texto):
                    self.f['vigencia']['reservaURL'] = texto
                    with self.assertRaisesRegex(ValueError, 'credenciales') as error:
                        self.verificar(self.paquetes[:1], 'parcial')
                    self.assertNotIn('example.invalid', str(error.exception))

    def test_parentesis_del_destino_y_enlaces_legitimos_se_conservan(self):
        for texto in ('[norma](https://example.invalid/articulo(2)?id=ley)',
                      '[uno](https://example.invalid/1)[dos](https://example.invalid/2)',
                      'https://example.invalid/articulo(2)?id=ley'):
            with self.subTest(texto=texto):
                self.f['vigencia']['reservaURL'] = texto
                self.verificar(self.paquetes[:1], 'parcial')

    def test_schema_aislado_no_admite_fecha_nula_normativa(self):
        for tipo in ('original', 'reforma', 'correccion', 'consolidado'):
            for reserva in (None, 'Desconocida en fixture'):
                with self.subTest(tipo=tipo, reserva=reserva):
                    fuentes = copy.deepcopy(self.paquetes[0]['fuentes'])
                    documento = fuentes['documentos'][0]
                    documento.update(tipo=tipo, fechaPublicacion=None)
                    if reserva is not None:
                        documento['reservaFechaPublicacion'] = reserva
                    with self.assertRaises(ValidationError):
                        revision.v.validar_schema(fuentes, revision.v.SCHEMA['$defs']['fuentes'])

    def test_schema_aislado_exige_reserva_del_manual(self):
        for reserva in (None, '', '   '):
            with self.subTest(reserva=reserva):
                fuentes = copy.deepcopy(self.paquetes[0]['fuentes'])
                manual = fuentes['documentos'][1]
                manual['fechaPublicacion'] = None
                if reserva is not None:
                    manual['reservaFechaPublicacion'] = reserva
                with self.assertRaises(ValidationError):
                    revision.v.validar_schema(fuentes, revision.v.SCHEMA['$defs']['fuentes'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
