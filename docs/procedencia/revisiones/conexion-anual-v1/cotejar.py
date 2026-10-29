from pathlib import Path
import hashlib,json,subprocess
root=Path('/home/elies/.t3/worktrees/IRoboPF/t3-f9097ac4');out=Path(__file__).parent
m=json.loads((root/'docs/procedencia/implementaciones/conexion-anual/manifiesto.json').read_text())
result=[]
for r in m['archivos']:
 p=root/r['path'];b=p.read_bytes();h=hashlib.sha256(b).hexdigest()
 result.append(dict(path=r['path'],entregado=r['sha256'],integrado=h,size=len(b),coincide=h==r['sha256']))
p=root/'lib/dominio/irpf/trabajo-anual/conexion.ts'
b=p.read_text().replace('instancia: instancia,','instancia,').encode()
result.append(dict(prueba='única diferencia conexion.ts es instancia explícita',coincide=hashlib.sha256(b).hexdigest()==next(r['sha256'] for r in m['archivos'] if r['path'].endswith('/conexion.ts'))))
(out/'cotejo-entrega.json').write_text(json.dumps(result,indent=2))
cat=json.loads((root/'lib/procedencia/rastro-generado.json').read_text());print('Bindings:',len(cat['bindings']),'nuevos:',sum(b['siteId'].startswith('anual.explicito.') for b in cat['bindings']))
print([r for r in result if not r['coincide']])
