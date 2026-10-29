"""Rojos contra afirmaciones documentales candidatas, nunca contra AEAT."""
import hashlib
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[4]
SCRATCH = ROOT / '.cache/contraste-s1516'


class ContrasteNuevo(unittest.TestCase):
    def test_cambio_visual_64_entre_2015_y_2016(self) -> None:
        """S1516-03 afirma que 2016 cambia <64 a <=64; el recorte es idéntico."""
        antes = (SCRATCH / '2015-enero-revision-edad.png').read_bytes()
        despues = (SCRATCH / '2016-anual-edad.png').read_bytes()
        self.assertNotEqual(hashlib.sha256(antes).hexdigest(), hashlib.sha256(despues).hexdigest(), 'No hay cambio visual en este pasaje: ambos muestran ≤64')

    def test_anualidad_impide_aumento_aunque_crezca_diferencia(self) -> None:
        """Subpaso hipotético: la condición resumida en 43 ramas omite alternativa 87.5."""
        anterior_diferencia, nueva_diferencia = 10000, 11000
        anterior_tipo, nuevo_tipo = 12, 18
        # Traducción de la rama 87.5-no-aumento propuesta, con aumento de diferencia.
        resumen_candidato = min(anterior_tipo, nuevo_tipo) if nueva_diferencia <= anterior_diferencia else nuevo_tipo
        # RIRPF87.5 añade OR por nueva obligación judicial de alimentos con 85.2.
        self.assertEqual(resumen_candidato, 12, 'La obligación judicial nueva requiere guardia propia de no aumento')


if __name__ == '__main__':
    unittest.main()
