from pathlib import Path
import json,hashlib,subprocess
out=Path(__file__).parent;root=Path('/home/elies/.t3/worktrees/IRoboPF/t3-f9097ac4')
sha=lambda b:hashlib.sha256(b).hexdigest()
results=json.loads((out/'resultados.json').read_text())
summary={'total':len(results),'coinciden':sum(r['ok'] for r in results),'discrepancias':[r['id'] for r in results if not r['ok']],'dies':[r['id'] for r in results if '"Die"' in json.dumps(r['exit'])],'rechazosTipados':[r['id'] for r in results if r['exit']['_tag']=='Failure' and 'ResultadoNoSoportado' in json.dumps(r['exit'])]}
(out/'resumen.json').write_text(json.dumps(summary,indent=2))
copychecks=[]
for p in (out/'checkout-validacion').rglob('*'):
 if p.is_symlink() or not p.is_file():continue
 rel=p.relative_to(out/'checkout-validacion');orig=root/rel
 if orig.is_file():copychecks.append({'path':str(rel),'coincide':sha(p.read_bytes())==sha(orig.read_bytes())})
(out/'copias-verificadas.json').write_text(json.dumps(copychecks,indent=2))
p=Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256/02c6e8300a7f56c8c24aa947d4c39c5657c9a9eda6f5d727d44b4112d7de15d4');b=p.read_bytes();assert sha(b)==p.name
(out/'manual-integridad.json').write_text(json.dumps({'path':str(p),'sha256':sha(b),'sha512':hashlib.sha512(b).hexdigest(),'size':len(b),'url':'https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/ManualRenta2025Parte1_es_es.pdf','paginasLeidas':[254,255,259,260,430,1001,1090,1128,1372,1373,1374]},indent=2))
print(json.dumps(summary)); print('Copias diferentes:',[r for r in copychecks if not r['coincide']])
