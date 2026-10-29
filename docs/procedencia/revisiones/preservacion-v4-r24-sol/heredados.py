"""Dos controles pertinentes R21 sobre el consumidor v3 actual, sin modificar históricos."""
import importlib.util
from pathlib import Path
import sys
import unittest

ROOT = Path.cwd()
CACHE = ROOT / '.cache/preservacion-v4-r24-sol/heredados'


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


def main():
    CACHE.mkdir(exist_ok=True)
    audit = module('auditar', ROOT / 'docs/procedencia/revisiones/preservacion-v3-sol/auditar.py')
    audit.SCRATCH = CACHE
    module('adversos_test', ROOT / 'docs/procedencia/revisiones/preservacion-v3-sol/adversos_test.py')
    r21 = module('r21_cases', ROOT / 'docs/procedencia/correcciones/preservacion-r21/adversos.py')
    names = ['test_cierre_recursivo_y_diagnostico_sin_valores', 'test_fuentes_portables_antes_de_crear_destino']
    suite = unittest.TestSuite(r21.ContratoCompleto(n) for n in names)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    raise SystemExit(0 if result.wasSuccessful() else 1)

if __name__ == '__main__':
    main()
