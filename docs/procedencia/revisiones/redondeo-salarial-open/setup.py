import os, subprocess, hashlib, json, stat, shutil
from pathlib import Path
R=Path.cwd(); C=R/'.cache/revision-redondeo-sol'; O=R/'docs/procedencia/revisiones/redondeo-salarial-open'
def inventory():
    out={}
    for p in R.rglob('*'):
        s=p.relative_to(R).as_posix()
        if s=='.git' or s.startswith(('.cache/','docs/procedencia/revisiones/redondeo-salarial-open/')): continue
        st=p.lstat()
        if stat.S_ISDIR(st.st_mode): continue
        out[s]={'mode':oct(stat.S_IMODE(st.st_mode)), 'symlink':os.readlink(p) if p.is_symlink() else None,'size':st.st_size,'sha256':hashlib.sha256(os.readlink(p).encode() if p.is_symlink() else p.read_bytes()).hexdigest()}
    return out
if __name__=='__main__':
    h=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(); assert h=='f8f1e53198fb27bc6123e03ba0b084d8e1536a0e'
    inv=inventory(); (C/'initial.json').write_text(json.dumps(inv))
    ls=subprocess.check_output(['git','ls-tree','-rz',h]).split(b'\0'); issues=[]
    for item in filter(None,ls):
        meta,name=item.split(b'\t'); mode,typ,oid=meta.split(); s=name.decode(); p=R/s
        content=subprocess.check_output(['git','cat-file','blob',oid.decode()])
        actual=os.readlink(p).encode() if p.is_symlink() else p.read_bytes()
        if content!=actual or (mode==b'120000')!=p.is_symlink() or (mode!=b'120000' and (mode==b'100755')!=bool(p.lstat().st_mode & 0o111)): issues.append(s)
    assert not issues, issues
    delta=subprocess.check_output(['git','diff','--name-status','b99c6842e615e5df2ad9820ef24ad4eed17e59b6',h],text=True).splitlines()
    (O/'recepcion.json').write_text(json.dumps({'head':h,'fisicos':len(inv),'contraObjetosHEAD':'bytes/modos/symlinks iguales','cambio':{x:sum(l.startswith(x+'\t') for l in delta) for x in ['A','M','D']},'exclusiones':['.git','.cache','directorio de esta revisión']},indent=2))
    S=C/'stage'; S.mkdir(exist_ok=True)
    for d in ['lib','tests','scripts','tools/oxlint','docs/procedencia']:
        shutil.copytree(R/d,S/d,dirs_exist_ok=True,ignore=shutil.ignore_patterns('revisiones') if d=='docs/procedencia' else None)
    for f in ['package.json','tsconfig.json','vitest.config.ts','.oxlintrc.json','eslint.config.mjs']:
        if (R/f).exists(): shutil.copy2(R/f,S/f)
    (S/'node_modules').symlink_to('/home/local/Repos/IRoboPF/node_modules')
    old=subprocess.check_output(['git','show','b99c684:lib/dominio/irpf/trabajo-anual/conexion.ts'])
    (C/'conexion-anterior.ts').write_bytes(old)
    print('HEAD y físicos correctos; stage creado',len(inv),len(delta))
