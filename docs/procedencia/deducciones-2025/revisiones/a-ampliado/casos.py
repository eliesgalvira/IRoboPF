#!/usr/bin/env python3
"""Regresión documental pequeña: no necesita CAS, Git ni red. Salida 1 si AAMP-01 persiste."""
import json
from pathlib import Path
import unittest

BASE = Path(__file__).resolve().parents[2]


class Atribucion(unittest.TestCase):
    def test_censo_individual(self):
        decisiones = json.loads((Path(__file__).parent / 'decisiones.json').read_text())['deducciones']
        censo = json.loads((BASE / 'censo.json').read_text())['fichas']
        self.assertEqual({d['codigo'] for d in decisiones}, {d['codigo'] for d in censo if d['lote'] == 'a'})
        self.assertEqual(len(decisiones), 49)

    def test_donativos_no_son_celiaquia(self):
        paquete = json.loads((BASE / 'lotes/a/dictamenes.json').read_text())
        expediente = next(d for d in paquete['deducciones'] if d['codigo'] == 'andalucia_donativos_finalidad_ecologica')
        # Expectativa independiente: artículo22 original BOJA (10%, máximo150);
        # diagnóstico y núcleo familiar pertenecen al22quater, nunca al22.
        ajenas = [c['id'] for c in expediente['citas']
                  if c['documentoId'] == 'andalucia' and c['articulo'] == '22'
                  and any(t in c['textoLiteral'].lower() for t in ('celíaca', 'núcleo familiar', 'diagnóstico'))]
        self.assertEqual(ajenas, [], 'AAMP-01: citas de22quater atribuidas a22')

    def test_fuente_primaria_de_donativos_se_conserva(self):
        paquete = json.loads((BASE / 'lotes/a/dictamenes.json').read_text())
        d = next(d for d in paquete['deducciones'] if d['codigo'] == 'andalucia_donativos_finalidad_ecologica')
        texto = ' '.join(c['textoLiteral'] for c in d['citas'] if c['documentoId'] == 'BOJA-dd45dbc7f39c' and c['articulo'] == '22')
        self.assertIn('10%', texto)
        self.assertIn('150 euros', texto)
        self.assertIn('fin exclusivo', texto)
        self.assertNotIn('celíaca', texto)


if __name__ == '__main__':
    unittest.main()
