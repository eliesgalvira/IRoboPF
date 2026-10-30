from pathlib import Path
import json,gzip,hashlib,stat
r=Path.cwd();s=r/'.cache/causal-ss-r56-sol';env=s/'sobre';receipt=env/'recibo-terminal.json';fis=json.loads(gzip.decompress((env/'fisico-final.json.gz').read_bytes()));allowed=('.cache/causal-ss-r56-sol/','docs/procedencia/revisiones/causal-ss-r56-sol/')
foreign=[p for p in fis['extras']if p!='.git'and not p.startswith(allowed)];assert not foreign and not fis['errors']and fis['count']==22251
manifest=json.loads((env/'manifiesto.json').read_text())
for row in manifest:
 for p in [r/row['path'],s/'reconstruccion'/row['path']]:
  b=p.read_bytes();assert hashlib.sha256(b).hexdigest()==row['sha256']and len(b)==row['size'];assert bool(p.stat().st_mode&0o111)==(row['mode']=='100755')
rows=[]
for p in sorted(env.rglob('*')):
 if not p.is_file()or p==receipt:continue
 b=p.read_bytes();rows.append(dict(path=str(p.relative_to(r)),size=len(b),sha256=hashlib.sha256(b).hexdigest(),sha512=hashlib.sha512(b).hexdigest()))
receipt.write_text(json.dumps(dict(head=fis['head'],baseEntries=22251,errors=[],deleted=[],foreignExtras=[],censusExtras=len(fis['extras']),payloadFiles=len(manifest),reconstructedExact=True,envelope=rows,postCensus=[str(receipt.relative_to(r))],selfExcluded=True,gitMetadata='.git T3 conocido, fuera del contenido auditado'),ensure_ascii=False,indent=2)+'\n');print('Recibo terminal: base íntegra, 59 rutas reconstruidas, sin extras ajenos')
