import hashlib,json,re
from pathlib import Path
import pymupdf
root=Path.cwd();out=root/'.cache/procedencia/revision-enlaces-v2'
p=root/'docs/procedencia/corpus/fixtures/sha256/8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660'
assert hashlib.sha256(p.read_bytes()).hexdigest()==p.name
with pymupdf.open(p) as d:
 for i in [3,11]:print('PAGE',i+1,d[i].get_text())
 d[3].get_pixmap().save(out/'madrid-p4.png')
for s in json.loads((root/'docs/procedencia/revisiones/autonomicas-2017-2021/sources.json').read_text()):
 if any(x in s['canonicalUrl'] for x in ['90376','/2021/12/15/2','BOCM-m-2010-90068']):
  raw=Path(s['localPath']).read_bytes();assert hashlib.sha256(raw).hexdigest()==s['sha256']; text=re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',raw.decode()))
  print('SOURCE',s['canonicalUrl'],s['sha256'])
  for term in ['Apreciado','53.407','2022','Artículo 1.','Entrada en vigor']:
   for match in list(re.finditer(re.escape(term),text))[-3:]:print(text[max(0,match.start()-100):match.start()+800])
print((root/'lib/dominio/normativa/datos/irpf-autonomico-2020.ts').read_text()[:5000])
