import json,hashlib, pathlib,contextlib,io,time
src=pathlib.Path('/home/elies/.t3/worktrees/IRoboPF/t3-bddec546')
root=pathlib.Path(__file__).resolve().parent/'fixture'
folder=root/'docs/procedencia';folder.mkdir(parents=True,exist_ok=True)
for name in ['lib','Calculo_Salario_IRPF.py']:
 p=root/name
 if not p.exists(): p.symlink_to(src/name)
for p in (src/'docs/procedencia').glob('inventario*.json'):
 t=folder/p.name
 if not t.exists():t.symlink_to(p)
code=(src/'scripts/procedencia/inventario-validar.py').read_text().replace("root = Path(__file__).resolve().parents[2]",f"root = Path({str(root)!r})")
changed=[]
def write(name,data):
 p=folder/name
 if p.is_symlink(): p.unlink()
 p.write_text(json.dumps(data,ensure_ascii=False));changed.append(name)
def restore():
 for name in set(changed):
  p=folder/name;p.unlink(missing_ok=True);p.symlink_to(src/'docs/procedencia'/name)
 changed.clear()
def read(name):return json.loads((folder/name).read_text())
def run(label):
 buf=io.StringIO();t=time.time()
 try:
  with contextlib.redirect_stdout(buf):exec(compile(code,'validator-original','exec'),{})
  status='ACCEPTED'
 except Exception as e:status=f'REJECTED {type(e).__name__}: {str(e)[:120]}'
 print(label,status,round(time.time()-t,2),flush=True);restore()
def edit_item(mutator,rehash=True):
 m=read('inventario.json');page=m['pages'][0];data=read(page['file']);mutator(data[0]);write(page['file'],data)
 if rehash:
  page['sha256']=hashlib.sha256((folder/page['file']).read_bytes()).hexdigest();write('inventario.json',m)
run('baseline')
edit_item(lambda i:i.update(value='987654321'));run('value_with_updated_page_hash')
edit_item(lambda i:i.update(value='987654321'),False);run('value_without_updated_hash')
edit_item(lambda i:i['source'].update(sha256='0'*64));run('stale_item_source_hash')
edit_item(lambda i:i.update(evidence='verified'));run('unauthorized_evidence')
edit_item(lambda i:i['source'].update(line=999999,column=999999));run('impossible_location')
m=read('inventario.json');m['syntaxCoverage'][0]['sha256']='0'*64;m['syntaxCoverage'][0]['items']=99999;write('inventario.json',m);run('stale_coverage_and_wrong_count')
g=read('inventario-bindings.json');g[0]['dependencies']=[{'sha256':'0'*64,'file':'missing.ts'}];write('inventario-bindings.json',g);run('broken_graph')
idx=read('inventario-indice.json');p=idx[0];data=read(p['file']);data[0]['page']='missing.json';write(p['file'],data);p['sha256']=hashlib.sha256((folder/p['file']).read_bytes()).hexdigest();write('inventario-indice.json',idx);run('index_points_to_missing_page')
write('inventario-pagina-9999.json',[]);run('unlisted_page')
# Omit an unreferenced selected record and its index entry, retaining advertised counts.
m=read('inventario.json');target=None
for p in m['pages']:
 data=read(p['file']);target=next((i for i in data if i['layer']=='selected'),None)
 if target:
  data.remove(target);write(p['file'],data);p['count']-=1;p['sha256']=hashlib.sha256((folder/p['file']).read_bytes()).hexdigest();break
write('inventario.json',m);idx=read('inventario-indice.json')
for p in idx:
 data=read(p['file']);new=[i for i in data if i['id']!=target['id']]
 if len(new)!=len(data):
  write(p['file'],new);p['count']-=1;p['sha256']=hashlib.sha256((folder/p['file']).read_bytes()).hexdigest();break
write('inventario-indice.json',idx);run('omitted_selected_record')
