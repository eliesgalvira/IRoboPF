from pathlib import Path
import subprocess,hashlib,json
out=Path(__file__).parent
root=Path('/home/elies/.t3/worktrees/IRoboPF/t3-f9097ac4')
cas=Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256')
records=json.loads((root/'docs/procedencia/revisiones/actividades-implementacion/primarias.json').read_text())
records=[r for r in records if r['id'] in ['ley26-2014','ley31-2022','lirpf-original','rd633-2015','ley11-2013']]
records[0]['paginas']=[[11,12],[17,19]]
records += [dict(id='da61',sha256='9657d0c565a0b0017bee94f8544da006109f54f06286c15a0496ed4f1a3e38ac',paginas=[[46,47]])]
records += [dict(id='madrid-ley13-2023',sha256='502aa027788673d8f653c2cd8ce87038630a7dab13b63d625c5905bd1a5ce8de',paginas=[[2,5],[14,14]])]
manifest=[]
for r in records:
 p=cas/r['sha256']; data=p.read_bytes();assert hashlib.sha256(data).hexdigest()==r['sha256']
 for lo,hi in r['paginas']:
  target=out/f"original-{r['id']}-{lo}-{hi}.txt"
  subprocess.run(['pdftotext','-layout','-f',str(lo),'-l',str(hi),str(p),str(target)],check=True)
 manifest.append(dict(r,size=len(data),sha512=hashlib.sha512(data).hexdigest(),path=str(p)))
(out/'originales-reabiertos.json').write_text(json.dumps(manifest,indent=2))
