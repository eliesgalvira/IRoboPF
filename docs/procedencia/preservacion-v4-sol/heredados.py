"""Ejecuta controles heredados sin escribir en carpetas históricas."""
import importlib.util
import sys
import tempfile
import unittest
from unittest.mock import patch

import edicion as e


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


def main():
    scratch = e.CACHE / 'heredados'
    scratch.mkdir(exist_ok=True)
    audit = module('auditar', e.ROOT / 'docs/procedencia/revisiones/preservacion-v3-sol/auditar.py')
    audit.SCRATCH = scratch
    module('adversos_test', e.ROOT / 'docs/procedencia/revisiones/preservacion-v3-sol/adversos_test.py')
    r21 = module('r21_adversos', e.ROOT / 'docs/procedencia/correcciones/preservacion-r21/adversos.py')
    legacy = module('legacy_preservacion', e.ROOT / 'tests/procedencia-preservacion_test.py')
    # TemporaryDirectory heredado usa el directorio propio; conserva sus residuos.
    class RetainedTemporaryDirectory:
        def __init__(self):
            self.name = tempfile.mkdtemp(dir=scratch, prefix='legacy-')
        def cleanup(self):
            pass
    suite = unittest.TestSuite()
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(r21.ContratoCompleto))
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(legacy.PreservationTests))
    with patch.object(legacy.tempfile, 'TemporaryDirectory', RetainedTemporaryDirectory):
        result = unittest.TextTestRunner(verbosity=2).run(suite)
    if not result.wasSuccessful():
        raise SystemExit(1)


if __name__ == '__main__':
    main()
