"""Transporte sin VCS mutante. El manifiesto excluye su propio hash circular."""
from __future__ import annotations
import gzip
import hashlib
import json
from pathlib import Path
import subprocess

OUT = Path(__file__).resolve().parent
BASE = '07c07e6376a72f229be735a904ecf36517a1b571'


def main() -> None:
    assert subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip() == BASE
    patch = bytearray()
    binaries = []
    for p in sorted(OUT.iterdir()):
        if not p.is_file() or p.name in {'manifiesto.json','entrega.patch.gz','binarios.json'}:
            continue
        data = p.read_bytes()
        relative = str(p.relative_to(Path.cwd()))
        if p.suffix == '.gz' or b'\0' in data:
            binaries.append({'path':relative,'sha256':hashlib.sha256(data).hexdigest(),'size':len(data),'baseSha256':None})
        else:
            diff=subprocess.run(['git','diff','--no-index','--no-ext-diff','--','/dev/null',relative],capture_output=True,check=False)
            assert diff.returncode in (0,1), diff.stderr.decode()
            patch.extend(diff.stdout)
    (OUT/'entrega.patch.gz').write_bytes(gzip.compress(patch,mtime=0))
    (OUT/'binarios.json').write_text(json.dumps(binaries,ensure_ascii=False,indent=2)+'\n')
    files=[]
    for p in sorted(OUT.iterdir()):
        if p.is_file() and p.name != 'manifiesto.json':
            data=p.read_bytes()
            files.append({'path':str(p.relative_to(Path.cwd())),'sha256':hashlib.sha256(data).hexdigest(),'size':len(data),'baseSha256':None})
    (OUT/'manifiesto.json').write_text(json.dumps({'head':BASE,'baseEntries':14957,'scope':str(OUT.relative_to(Path.cwd())),'selfExcluded':'manifiesto.json no se auto-hashea; todos los demás archivos incluidos, patch sin autocircularidad.','deleted':[],'files':files},ensure_ascii=False,indent=2)+'\n')
    print(len(files),'archivos manifestados; patch textual gzip y binarios por ruta/hash; cero borrados')


if __name__=='__main__':
    main()
