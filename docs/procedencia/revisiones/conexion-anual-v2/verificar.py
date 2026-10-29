from pathlib import Path
import json,gzip,hashlib,subprocess
r=Path.cwd();s=r/'.cache/conexion-anual-v2'
def meta(p):
 b=p.read_bytes();return dict(path=str(p),size=len(b),sha256=hashlib.sha256(b).hexdigest(),sha512=hashlib.sha512(b).hexdigest())
files=[r/'docs/procedencia/inventario.json',r/'docs/procedencia/inventario-datos.json.gz']
ms=[meta(p) for p in files]
a=json.loads(gzip.decompress(files[1].read_bytes()));print('Archivos del artefacto:',len(a))
(s/'integridad.json').write_text(json.dumps(ms,indent=2))
(s/'originales.json').write_text(json.dumps([meta(Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256')/h) for h in ['502aa027788673d8f653c2cd8ce87038630a7dab13b63d625c5905bd1a5ce8de','02c6e8300a7f56c8c24aa947d4c39c5657c9a9eda6f5d727d44b4112d7de15d4']],indent=2))
items=[x for name,content in a if name.startswith('inventario-pagina-') for x in json.loads(content)]
selected=[x for x in items if x['symbol']=='MADRID_2025' and x['layer']=='effective']
assert len(selected)==15
assert all(x['territories']==['madrid'] and x['years']==[2025] and x['status']=='pending' for x in selected)
(s/'madrid-inventario.json').write_text(json.dumps(selected,indent=2));print('Madrid',len(selected))
paths=subprocess.check_output(['git','ls-tree','-rz','--name-only','HEAD']).decode().split('\0');missing=[p for p in paths if p and not (r/p).exists() and not (r/p).is_symlink()]
(s/'preflight.json').write_text(json.dumps(dict(base=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip(),entradas=len([p for p in paths if p]),ausentes=missing),indent=2))
