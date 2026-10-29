"""Reproduce esperados originales sobre software anterior y actual en scratch propio."""
import hashlib
import importlib
import json
from pathlib import Path
import subprocess
import sys
import types
import unittest

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
CACHE = ROOT / '.cache/preservacion-v4-r26-sol'
OLD = '6207b0bb1baafc8dfec8e4617b406a459dcd0f4d'
mode = sys.argv[1]
source = ROOT / 'docs/procedencia/preservacion-v4-sol'
sys.path.insert(0, str(source))
if mode == 'antes':
    scratch = CACHE / 'anterior'
    scratch.mkdir(parents=True, exist_ok=True)
    for name in ('edicion.py', 'schema.json', 'urls-exactas.json', 'materializar.py'):
        data = subprocess.check_output(['git', 'show', f'{OLD}:docs/procedencia/preservacion-v4-sol/{name}'])
        (scratch / name).write_bytes(data)
    e = types.ModuleType('edicion')
    e.__file__ = str(source / 'edicion.py')
    sys.modules['edicion'] = e
    exec(compile((scratch / 'edicion.py').read_bytes(), e.__file__, 'exec'), e.__dict__)
    setattr(e, 'HERE', scratch)
else:
    e = importlib.import_module('edicion')
sys.path.insert(0, str(ROOT / 'docs/procedencia/revisiones/preservacion-v4-r24-sol'))
rojos = importlib.import_module('rojos')
sys.path.insert(0, str(ROOT / 'docs/procedencia/correcciones/preservacion-v4-r26'))
controles = importlib.import_module('controles')
setattr(e, 'CACHE', CACHE / mode)
e.CACHE.mkdir(parents=True, exist_ok=True)
results = []
for cls, prefix in ((rojos.Rojos, 'test_r24_'), (controles.Adicionales, 'test_r26_'), (importlib.import_module('adversos').EditionTests, 'test_')):
    names = [n for n in unittest.defaultTestLoader.getTestCaseNames(cls) if n.startswith(prefix)]
    result = unittest.TextTestRunner(verbosity=2).run(unittest.TestSuite(cls(n) for n in names))
    results.append({'class': cls.__name__, 'tests': result.testsRun, 'failures': [n.id() for n, _ in result.failures], 'errors': [n.id() for n, _ in result.errors]})
(OUT / f'repro-{mode}.json').write_text(json.dumps({'mode': mode, 'sourceSha256': hashlib.sha256((CACHE / 'anterior/edicion.py' if mode == 'antes' else source / 'edicion.py').read_bytes()).hexdigest(), 'results': results}, indent=2) + '\n')
raise SystemExit(int(any(r['failures'] or r['errors'] for r in results)))
