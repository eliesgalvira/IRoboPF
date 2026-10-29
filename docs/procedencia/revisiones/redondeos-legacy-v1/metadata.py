"""Fija originales, fuentes revisadas y presencia de archivos de base."""
import hashlib
import json
import subprocess
from pathlib import Path

root = Path('/home/elies/.t3/worktrees/IRoboPF/t3-dc46a039')
out = Path(__file__).parent
base = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
files = subprocess.check_output(['git', '-C', str(root), 'ls-tree', '-r', '--name-only', base], text=True).splitlines()
def digest(path):
    with path.open('rb') as stream:
        sha256 = hashlib.file_digest(stream, 'sha256').hexdigest()
    with path.open('rb') as stream:
        sha512 = hashlib.file_digest(stream, 'sha512').hexdigest()
    return {'path': str(path), 'sha256': sha256, 'sha512': sha512, 'size': path.stat().st_size}
inputs = [root / p for p in files if p.startswith(('lib/dominio/compatibilidad-legacy/', 'docs/procedencia/implementaciones/redondeos-legacy/', 'docs/procedencia/correcciones/integracion-ronda10/'))]
inputs += [root / p for p in ['Calculo_Salario_IRPF.py', 'tests/helpers/canonical-tabular-hashes.ts', 'tests/fixtures/canonical-tabular-hashes.json', 'tests/fixtures/caracterizacion-legacy.json', 'tests/progresividad-caracterizacion-legacy.test.ts', 'tests/redondeos-legacy-oracle.test.ts', 'tests/dinero.test.ts']]
inputs.append(Path('/home/elies/Repos/IRoboPF/Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx'))
(out / 'integridad.json').write_text(json.dumps({'base': base, 'baseFiles': len(files), 'missing': [p for p in files if not (root/p).exists() and not (root/p).is_symlink()], 'nonRegular': [p for p in files if not (root/p).is_file()], 'inputs': [digest(p) for p in inputs]}, indent=2))
