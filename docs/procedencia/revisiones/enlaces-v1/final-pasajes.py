import json,hashlib
from pathlib import Path
import pymupdf
for r in json.loads(Path('docs/procedencia/auditorias/seguridad-social/documentos.json').read_text()):
 if r.get('identifier') not in ['BOE-A-2018-1142','BOE-A-2018-9268']:continue
 d=pymupdf.open(r['localPath']);print(r['identifier'],r['sha256'])
 for i,p in enumerate(d):
  text=p.get_text()
  term='3.751,20' if r['identifier']=='BOE-A-2018-1142' else 'Disposición final cuadragésima sexta.'
  if term in text:
   pos=text.index(term);print('PAGE',i+1,text[max(0,pos-250):pos+1200]);break
