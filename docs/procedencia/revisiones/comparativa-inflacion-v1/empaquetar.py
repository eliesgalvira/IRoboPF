"""Validar resultados y empaquetar exclusivamente la entrega propia."""
import hashlib
import json
import sys
from pathlib import Path
root, out = map(Path, sys.argv[1:])
r = json.loads((out/'resultados.json').read_text())
o = json.loads((out/'oracle.json').read_text())
assert r['counts'] == {'K':15,'L':53,'J':1}
assert all(not r[k] for k in ['currentPython','currentXml','pythonXml','boundaries'])
assert all(t['header'] and not t['differences'] for t in r['controls']) and r['headers']
assert all(f['actual'] == f['expected'] for f in r['factors'])
assert all(c['actualPython'] == c['python'] and c['actualNumpy'] == c['numpy'] for c in r['rounds'])
assert o['prior330Equal'] and len(o['boundaries']) == 450
prior = json.loads((root/'docs/procedencia/implementaciones/comparativa-inflacion/diferencias-antes.json').read_text())
assert r['baseline'] == [{'cell':chr(64+d['columna'])+str(d['fila']),'actual':d['actual'],'expected':d['python']} for d in prior['diferencias']]
files = sorted(p for p in out.iterdir() if p.is_file() and p.name not in ['MANIFIESTO.json','entrega.patch','empaquetado.log'])
patch = []
for p in files:
    assert not (p.suffix == '.log' and p.stat().st_size > 1000000)
    name = 'docs/procedencia/revisiones/comparativa-inflacion-v1/'+p.name
    content = p.read_text().splitlines()
    if content:
        patch.append(f'diff --git a/{name} b/{name}\nnew file mode 100644\n--- /dev/null\n+++ b/{name}\n@@ -0,0 +1,{len(content)} @@\n'+''.join('+'+line+'\n' for line in content))
    else:
        patch.append(f'diff --git a/{name} b/{name}\nnew file mode 100644\nindex 0000000..e69de29\n')
(out/'entrega.patch').write_text(''.join(patch))
files.append(out/'entrega.patch')
entries = [{'path':'docs/procedencia/revisiones/comparativa-inflacion-v1/'+p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'size':p.stat().st_size,'baseSha256':None} for p in files]
(out/'MANIFIESTO.json').write_text(json.dumps({'base':'5799bb03826719a4dd3500a962e2d6bb5124fdca','reviewerAgent':'/root','reviewerCheckout':str(root),'deletions':[],'files':entries,'excluded':['MANIFIESTO.json (sin autorreferencia)','empaquetado.log (salida del propio empaquetado)']},indent=2)+'\n')
print(f'PASS: {len(entries)} archivos; 69 coordenadas idénticas; cero diferencias nuevas; cero borrados.')
