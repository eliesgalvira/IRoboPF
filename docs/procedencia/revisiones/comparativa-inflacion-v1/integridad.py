"""Fijar entradas y presencia sin mutar VCS ni recorrer cachés ajenas."""
import hashlib
import json
import subprocess
import sys
from pathlib import Path
root, out = map(Path, sys.argv[1:])
base = subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
assert base == '5799bb03826719a4dd3500a962e2d6bb5124fdca'
paths = subprocess.check_output(['git','ls-tree','-rz','--name-only','HEAD'],cwd=root).decode().split('\0')[:-1]
missing = [p for p in paths if not (root/p).exists() and not (root/p).is_symlink()]
assert not missing
selected = ['Calculo_Salario_IRPF.py','lib/dominio/compatibilidad-legacy/comparativa-tabular.ts','lib/dominio/compatibilidad-legacy/progresividad-frio.ts','lib/dominio/compatibilidad-legacy/aritmetica-tabular.ts','components/auditoria.tsx','components/simulador.tsx','docs/procedencia/inventario.json','docs/procedencia/inventario-datos.json.gz']
selected += [p for p in paths if p.startswith('tests/fixtures/') or p.startswith('lib/dominio/dinero/')]
records = []
for p in selected:
    data = (root/p).read_bytes()
    old = subprocess.run(['git','show','eaed990c620b5fc4d3ff2e74dc68e0c8481c43db:'+p],cwd=root,capture_output=True)
    records.append({'path':p,'sha256':hashlib.sha256(data).hexdigest(),'size':len(data),'equalPrior':old.returncode == 0 and data == old.stdout})
(out/'integridad.json').write_text(json.dumps({'base':base,'present':len(paths),'missing':missing,'files':records},indent=2)+'\n')
