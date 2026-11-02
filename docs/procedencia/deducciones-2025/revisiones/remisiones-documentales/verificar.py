"""Fronteras documentales autocontenidas; no necesita originales, Git ni red."""
from pathlib import Path
import copy
import hashlib
import json
import unittest

HERE = Path(__file__).resolve().parent
DOC = HERE.parents[1]
FIX = json.loads((HERE / 'fronteras.json').read_text())


def check(cites, proposals):
    manual = {c['id']: c for c in cites if c['fuente'] == 'manual2025'}
    assert manual.keys() == FIX['manual'].keys()
    for ident, expected in FIX['manual'].items():
        c = manual[ident]
        assert {k: c[k] for k in ('paginaFisica', 'inicio', 'fin')} == {
            k: expected[k] for k in ('paginaFisica', 'inicio', 'fin')}
        assert c['fin'] - c['inicio'] == len(c['literal'])
        assert hashlib.sha256(c['literal'].encode()).hexdigest() == expected['literalSha256']
    assert {p['codigo']: [c for c in p['citas'] if c in manual] for p in proposals} == FIX['asignacion']
    assert all('gl-67' not in p['citas'] for p in proposals)
    context = next(c for c in cites if c['id'] == 'gl-67')
    assert 'contexto' in context['uso'].lower()


class Fronteras(unittest.TestCase):
    def setUp(self):
        folder = DOC / 'correcciones/g-cultura-lengua'
        self.cites = json.loads((folder / 'citas.json').read_text())['citas']
        self.props = json.loads((folder / 'propuestas-por-codigo.json').read_text())['propuestas']

    def test_pasajes_y_asignacion_actuales(self):
        check(self.cites, self.props)

    def test_rechaza_pagina_contigua(self):
        cites = copy.deepcopy(self.cites)
        next(c for c in cites if c['id'] == 'gl-71')['paginaFisica'] += 1
        with self.assertRaises(AssertionError):
            check(cites, self.props)

    def test_rechaza_desplazamiento_aunque_conserve_longitud(self):
        cites = copy.deepcopy(self.cites)
        c = next(c for c in cites if c['id'] == 'gl-78')
        c['inicio'] += 1
        c['fin'] += 1
        with self.assertRaises(AssertionError):
            check(cites, self.props)

    def test_rechaza_recorte_de_exclusion(self):
        cites = copy.deepcopy(self.cites)
        c = next(c for c in cites if c['id'] == 'gl-75')
        c['literal'] = c['literal'].replace('hasta el tercer grado', '')
        c['fin'] = c['inicio'] + len(c['literal'])
        with self.assertRaises(AssertionError):
            check(cites, self.props)

    def test_rechaza_certificado_en_gasto_propio(self):
        props = copy.deepcopy(self.props)
        next(p for p in props if p['codigo'].endswith('_titulares'))['citas'].append('gl-cert-donativos-586')
        with self.assertRaises(AssertionError):
            check(self.cites, props)

    def test_rechaza_sucesiones_como_fundamento_abonos(self):
        props = copy.deepcopy(self.props)
        next(p for p in props if p['codigo'] == 'valenciana_abonos_culturales')['citas'].append('gl-67')
        with self.assertRaises(AssertionError):
            check(self.cites, props)

    def test_reservas_clm_y_registro_comun(self):
        matrix = json.loads((DOC / 'correcciones/d-clm-remisiones/matriz.json').read_text())['deducciones']
        reserved = [r for r in matrix if r.get('reserva')]
        self.assertEqual({r['codigo'] for r in reserved}, {
            'clm_adquisicion_rehabilitacion_vivienda_zonas_rurales',
            'clm_intereses_primera_vivienda_menores_40'})
        self.assertEqual(reserved[0]['reserva'], reserved[1]['reserva'])
        common = (DOC / 'lotes/d/dictamenes.json').read_text()
        self.assertIn('anexo25 municipios', common)
        self.assertNotIn('anexo26 municipios', common)



if __name__ == '__main__':
    unittest.main()
