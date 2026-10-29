"""Reproduce las expectativas independientes sin reescribir sus entregas."""
import importlib
from pathlib import Path
import runpy
import sys
import unittest

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'docs/procedencia/revisiones/preservacion-r21-sol'))
review = importlib.import_module('revisar')
setattr(review, 'OUT', OUT)
review.old.SCRATCH = ROOT / '.cache/orquestador-recepcion/r23/fixtures-preservacion'
review.old.SCRATCH.mkdir(parents=True, exist_ok=True)
suite = unittest.defaultTestLoader.loadTestsFromName('rojos_test')
result = unittest.TextTestRunner(verbosity=2).run(suite)
try:
    runpy.run_path(str(ROOT / 'docs/procedencia/revisiones/preservacion-r21-sol/complementos.py'))
    private_ok = True
except AssertionError as error:
    print(type(error).__name__ + ': ' + str(error))
    private_ok = False
sys.exit(0 if result.wasSuccessful() and private_ok else 1)
