"""Cotejo físico sin índice y entrega textual; no muta VCS ni borra archivos."""
from pathlib import Path
import difflib
import hashlib
import json
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
BASE = 'abefb125f655a824e201416da5ee64276c5465c6'
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()==BASE
entries=subprocess.check_output(['git','ls-tree','-rz',BASE],cwd=ROOT).split(b'\0')
proc=subprocess.Popen(['git','cat-file','--batch'],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE)
diferencias=[]; borrados=[]; count=0
for entry in entries:
    if not entry: continue
    meta,name=entry.split(b'\t'); mode,kind,oid=meta.split(); path=ROOT/name.decode()
    proc.stdin.write(oid+b'\n'); proc.stdin.flush()
    size=int(proc.stdout.readline().split()[-1]); original=proc.stdout.read(size); proc.stdout.read(1)
    count+=1
    if not path.exists() and not path.is_symlink(): borrados.append(name.decode()); continue
    actual=path.readlink().as_posix().encode() if path.is_symlink() else path.read_bytes()
    modoFisico = b"120000" if path.is_symlink() else b"100755" if path.stat().st_mode & 0o111 else b"100644"
    if actual!=original or modoFisico!=mode: diferencias.append(name.decode())
proc.stdin.close(); proc.wait()
assert not diferencias and not borrados, (diferencias,borrados)
# El sobre queda fuera del payload para evitar identidad autorreferencial.
sobre={'entrega.patch','manifiesto.json','reconstruccion.json'}
files=sorted([ROOT/'tests/anual-salarial-completo.test.ts']+[p for p in OUT.iterdir() if p.is_file() and p.name not in sobre])
sha=lambda b:hashlib.sha256(b).hexdigest()
manifest=[]; patches=[]
for path in files:
    data=path.read_bytes(); rel=path.relative_to(ROOT).as_posix()
    manifest.append(dict(ruta=rel,baseSha256=None,nuevoSha256=sha(data),tamano=len(data)))
    patches.extend(difflib.unified_diff([],data.decode().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+rel))
patch=''.join(patches).encode(); (OUT/'entrega.patch').write_bytes(patch)
scratch=Path(tempfile.mkdtemp(prefix='reconstruccion-',dir=ROOT/'.cache/anual-salarial-completo'))
subprocess.run(['patch','-p1','--directory',str(scratch)],input=patch,check=True,stdout=subprocess.DEVNULL)
for item in manifest:
    path=scratch/item['ruta']
    if item['tamano']==0: path.parent.mkdir(parents=True,exist_ok=True); path.touch()
    assert sha(path.read_bytes())==item['nuevoSha256']
(OUT/'manifiesto.json').write_text(json.dumps(dict(base=BASE,archivos=manifest,binarios=[],borrados=[],patchSha256=sha(patch),sobreExcluido=sorted(sobre)),indent=2)+'\n')
(OUT/'reconstruccion.json').write_text(json.dumps(dict(base=BASE,versionadosFisicos=count,diferenciasVersionadas=diferencias,borrados=borrados,payloadArchivos=len(manifest),reconstruccionVerificada=True,patchSha256=sha(patch),exclusionesNoEntregadas=['.git','.cache/anual-salarial-completo','node_modules (enlace de lectura a dependencias existentes)']),indent=2)+'\n')
print(count,'versionados cotejados;',len(files),'archivos nuevos reconstruidos; cero borrados')
