"""Preparar reproducciones propias sin ejecutar ni modificar historia."""
from pathlib import Path
import subprocess

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/tecnica-r23-sol'
scratch = OUT / 'scratch'
scratch.mkdir(exist_ok=True)
old = subprocess.check_output(['git', 'show', '341e88f3:scripts/procedencia/explicacion-version.mjs']).decode()
old = old.replace('../../lib/procedencia/verificador.ts', (ROOT / 'lib/procedencia/verificador.ts').as_posix())
(scratch / 'anterior.mjs').write_text(old)
test = (ROOT / 'docs/procedencia/revisiones/contratos-r21-sol/ast.test.mjs').read_text()
(scratch / 'anterior.test.mjs').write_text(test.replace('../../../../scripts/procedencia/explicacion-version.mjs', './anterior.mjs'))
(OUT / 'ast.test.mjs').write_text(test)
identity = (ROOT / 'docs/procedencia/revisiones/contratos-r21-sol/identidades.py').read_text().replace("revisiones/contratos-r21-sol'", "revisiones/tecnica-r23-sol'")
(OUT / 'identidades.py').write_text(identity)
routes = (ROOT / 'docs/procedencia/revisiones/contratos-r21-sol/rutas.mjs').read_text().replace('082bfc98eb13469b45e456a3d6cc65ebe811a748c1535d606efc3b06e78370ad','57377f076ca1050c368c7b57934d1f8edce13104a27258409ebf7f1a8f58d146').replace('a257e37f24d5a8c2f9306d64b1b706c658de067e501128652db550a7e485280f','a0c7d768c664677bffb583a84f3afb11deda0cf92924480e8b0afd97cde8b34f').replace('.cache/contratos-r21-sol/', 'docs/procedencia/revisiones/tecnica-r23-sol/scratch/')
(OUT / 'rutas.mjs').write_text(routes)
pack = (ROOT / 'docs/procedencia/revisiones/contratos-r21-sol/empaquetar.py').read_text().replace('960773f909d4ecff290edfa3d7a7b2699a8445d3', '07c07e6376a72f229be735a904ecf36517a1b571')
# Scratch no se transporta: solo fuentes mínimas históricas y objetos alterados locales.
pack = pack.replace("and 'binarios' not in p.relative_to(OUT).parts", "and 'binarios' not in p.relative_to(OUT).parts and 'scratch' not in p.relative_to(OUT).parts")
(OUT / 'empaquetar.py').write_text(pack)
