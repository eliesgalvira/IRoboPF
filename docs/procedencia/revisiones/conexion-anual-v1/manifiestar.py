from pathlib import Path
import os,json,hashlib,subprocess,difflib
out=Path(__file__).parent;root=Path('/home/elies/.t3/worktrees/IRoboPF/t3-f9097ac4');base='eaed990c620b5fc4d3ff2e74dc68e0c8481c43db'
sha=lambda b:hashlib.sha256(b).hexdigest()
paths=subprocess.check_output(['git','ls-tree','-r','--name-only',base],cwd=root,text=True).splitlines()
links=[{'path':p,'destino':os.readlink(root/p),'destinoExiste':(root/p).exists()} for p in paths if (root/p).is_symlink()]
pre={'base':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'archivosBase':len(paths),'ausentes':[p for p in paths if not os.path.lexists(root/p)],'enlaces':links,'gitStatus':subprocess.check_output(['git','status','--short'],cwd=root,text=True)}
assert pre['base']==base and not pre['ausentes'] and not pre['gitStatus']
(out/'preflight-final.json').write_text(json.dumps(pre,indent=2))
traces=json.loads((out/'rastro.json').read_text());sites={l['origen']['siteId'] for r in traces for l in r['lineas']};assert len(sites)==16
for r in traces:
 assert len({l['origen']['instanceId'] for l in r['lineas']})==len(r['lineas'])
 assert all(l['tipo']=='Step' for l in r['resolucionManual'])
assert next(l['origen']['decimal'] for l in traces[0]['lineas'] if l['origen']['siteId']=='anual.explicito.big')=='10291.0275'
(out/'rastro-controles.json').write_text(json.dumps({'sitiosNuevos':sorted(sites),'decimalesEInstanciasCorrectos':True,'fichasResuelven':True,'contextoAusente':all(r['contexto'] is None for r in traces),'enlacesOriginales':sum(l.get('procedencia',{}).get('estado')=='enlazada' for r in traces for l in r['lineas'])},indent=2))
sourcepaths=json.loads((root/'docs/procedencia/implementaciones/conexion-anual/manifiesto.json').read_text())['archivos'][:6]
sources=[]
for r in sourcepaths:
 p=root/r['path'];b=p.read_bytes();original=subprocess.check_output(['git','show',base+':'+r['path']],cwd=root)
 sources.append(dict(path=r['path'],sha256=sha(b),size=len(b),baseSha256=sha(original)))
(out/'fuentes-revisadas.json').write_text(json.dumps(sources,indent=2))
prefix='docs/procedencia/revisiones/conexion-anual-v1/'
patch=''
for p in sorted(out.iterdir()):
 if p.is_file() and p.suffix in ['.md','.py','.mjs','.sh']:
  rel=prefix+p.name;patch+='diff --git a/'+rel+' b/'+rel+'\nnew file mode 100644\n';patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(True),fromfile='/dev/null',tofile='b/'+rel))
(out/'entrega.patch').write_text(patch)
files=[]
for p in sorted(out.rglob('*')):
 if p.name=='node_modules' or 'node_modules' in p.parts or p==out/'manifiesto.json':continue
 if p.is_file():
  b=p.read_bytes();files.append(dict(path=prefix+str(p.relative_to(out)),sha256=sha(b),size=len(b),baseSha256=None))
(out/'manifiesto.json').write_text(json.dumps({'base':base,'archivos':files,'borrados':[],'excluidos':['manifiesto.json (autorrefencia)','checkout-validacion/node_modules (enlace a dependencias, no entrega)'],'implementacionModificada':False},indent=2))
print(json.dumps({'archivos':len(files),'bytes':sum(r['size'] for r in files),'ausentes':pre['ausentes'],'sitios':len(sites)}))
