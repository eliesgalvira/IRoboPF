"""Paquete aditivo contra base exacta, con reconstrucción sin operaciones VCS."""
from pathlib import Path
import difflib,hashlib,json,subprocess
r=Path.cwd();d=r/'docs/procedencia/revisiones/anual-salarial-completo';s=r/'.cache/anual-salarial-revision/reconstruccion';s.mkdir(parents=True,exist_ok=True)
base='3af102ba5c9b02a2de7df643673f80ed34090b32'
assert subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()==base
excluded={'entrega.patch','manifiesto.json','reconstruccion.json'}
files=sorted(p for p in d.iterdir() if p.is_file() and p.name not in excluded)
chunks=[];manifest=[]
for p in files:
 rel=str(p.relative_to(r));raw=p.read_bytes();text=raw.decode();assert not text or text.endswith('\n'),rel
 mode=format(p.stat().st_mode & 0o777,'03o')
 chunks.append(f'diff --git a/{rel} b/{rel}\nnew file mode 100{mode}\n')
 chunks.extend(difflib.unified_diff([],text.splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+rel))
 manifest.append(dict(ruta=rel,sha256=hashlib.sha256(raw).hexdigest(),bytes=len(raw),modo=mode,baseSha256=None))
patch=''.join(chunks);(d/'entrega.patch').write_text(patch)
# Interpret only the additive patch grammar emitted above. Empty sections create empty files.
current=None;data=[];restored=[]
def flush():
 if current is None:return
 p=s/current;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(''.join(data));restored.append(current)
for line in patch.splitlines(keepends=True):
 if line.startswith('diff --git '):
  flush();current=line.rstrip().split(' b/',1)[1];data=[]
 elif line.startswith('+') and not line.startswith('+++'):data.append(line[1:])
flush()
for a in manifest:
 p=s/a['ruta'];p.chmod(int(a['modo'],8));assert hashlib.sha256(p.read_bytes()).hexdigest()==a['sha256']
assert sorted(restored)==sorted(a['ruta'] for a in manifest)
(d/'manifiesto.json').write_text(json.dumps(dict(base=base,payload=manifest,parcheSha256=hashlib.sha256(patch.encode()).hexdigest(),excluidosDelPayload=sorted(excluded)),indent=2)+'\n')
(d/'reconstruccion.json').write_text(json.dumps(dict(base=base,archivos=len(files),exacta=True,vacios=[a['ruta'] for a in manifest if a['bytes']==0],directorio=str(s),metodo='interpretacion de parche exclusivamente aditivo; bytes y modos cotejados',sinVcsMutante=True),indent=2)+'\n')
print(len(files),'archivos; reconstruccion exacta; vacios:',[a['ruta'] for a in manifest if a['bytes']==0])
