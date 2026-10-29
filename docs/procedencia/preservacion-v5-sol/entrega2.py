"""Manifiesto de entrega sin circularidad, patch textual gzip y binarios por ruta/hash."""
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import subprocess
from typing import Any

ROOT=Path.cwd()
HERE=ROOT/'docs/procedencia/preservacion-v5-sol'
BASE='6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9'


def fp(path) -> dict[str, Any]:
    a=hashlib.sha256()
    size=0
    with path.open('rb') as stream:
        for block in iter(lambda:stream.read(1024*1024),b''):
            a.update(block)
            size+=len(block)
    return {'sha256':a.hexdigest(),'size':size}


def main():
    assert subprocess.check_output(['git','rev-parse','HEAD']).decode().strip()==BASE
    assert subprocess.check_output(['git','diff',BASE,'--name-only'])==b''
    excluded={'MANIFIESTO.json','binarios.json','entrega.patch.gz'}
    binary: list[dict[str, Any]]=[]
    with gzip.open(HERE/'entrega.patch.gz','wt') as patch:
        for path in sorted(HERE.rglob("*")):
            if not path.is_file() or path.name in excluded:
                continue
            name=path.relative_to(ROOT).as_posix()
            if path.suffix=='.gz':
                binary.append({'path':name,**fp(path),'baseSha256':None})
                continue
            try:
                text=path.read_text()
            except UnicodeError:
                binary.append({'path':name,**fp(path),'baseSha256':None})
                continue
            patch.writelines(difflib.unified_diff([],text.splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+name))
    (HERE/'binarios.json').write_text(json.dumps(binary,indent=2)+'\n')
    rows: list[dict[str, Any]]=[{'path':p.relative_to(ROOT).as_posix(),**fp(p),'baseSha256':None} for p in sorted(HERE.rglob("*")) if p.is_file() and p.name!='MANIFIESTO.json']
    (HERE/'MANIFIESTO.json').write_text(json.dumps({'head':BASE,'baseEntries':15456,'files':rows,'selfExcluded':'MANIFIESTO.json por circularidad','patchExclusions':sorted(excluded),'trackedDiff':[]},indent=2)+'\n')
    print({'files':len(rows),'binary':len(binary),'maxBytes':max(r['size'] for r in rows)})


if __name__=='__main__':
    main()
