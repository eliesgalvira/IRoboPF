"""Dos expectativas del contrato v2 que deben fallar antes de cualquier fix."""
import copy
import importlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, '/home/elies/.t3/worktrees/IRoboPF/t3-9491a8b7/tools/procedencia')
p = importlib.import_module('preservacion')
OUTPUT = Path(__file__).parent


class Residuales(unittest.TestCase):
    def test_rechaza_zona_con_minutos_imposibles(self):
        value = copy.deepcopy(json.loads((OUTPUT/'scratch/manifest.json').read_bytes()))
        value['blobs'][0]['acquisitions'][0]['retrievedAt'] = '2026-01-01T00:00:00+00:99'
        with self.assertRaises(ValueError):
            p.validate(value)

    def test_fallo_final_no_deja_marcador_segun_informe(self):
        with tempfile.TemporaryDirectory(dir=OUTPUT) as temp:
            dest = Path(temp)/'package'
            actual = p.sync_directory

            def fail(path):
                if Path(path) == dest and (dest/'manifest.json').exists():
                    raise OSError('fallo fsync después de enlazar marcador')
                actual(path)

            with patch.object(p, 'sync_directory', fail):
                with self.assertRaises(OSError):
                    p.transfer(OUTPUT/'scratch/manifest.json', OUTPUT/'scratch', dest)
            self.assertFalse((dest/'manifest.json').exists())


if __name__ == '__main__':
    unittest.main()
