import json,hashlib
from pathlib import Path
import pymupdf
src=Path('docs/procedencia/auditorias/trabajo-deducciones-estatales'); out=Path('docs/procedencia/revisiones/trabajo-deducciones-estatales'); scratch=Path('.cache/procedencia/revision-trabajo-deducciones-estatales')
docs=json.loads((src/'documentos.json').read_text()); checks=[]; refined=[]
for d in docs:
 b=Path(d['localPath']).read_bytes(); checks.append({'label':d['auditLabel'],'sha256':hashlib.sha256(b).hexdigest(),'sha256Matches':hashlib.sha256(b).hexdigest()==d['sha256'],'sha512Matches':hashlib.sha512(b).hexdigest()==d['sha512'],'sizeMatches':len(b)==d['size']})
for c in json.loads((src/'citas-focales.json').read_text()):
 if c.get('boxes') and c.get('page'):
  with pymupdf.open(c['localPath']) as pdf:
   page=pdf[c['page']-1]; text=''.join(page.get_text(clip=pymupdf.Rect(box)) for box in c['boxes'])
   refined.append({'id':c['id'],'sourceLabel':c['sourceLabel'],'documentSha256':c['documentSha256'],'page':c['page'],'boxes':c['boxes'],'extractedText':text,'matches':text==c['quote']})
# Independently reread full surrounding pages of every focal PDF, not just quotes.
for d in docs:
 pages=sorted({c['page'] for c in refined if c['sourceLabel']==d['auditLabel']})
 if d['auditLabel'] in ['convalidacion2026','correccion2026','correccion2009']: pages=[1]
 if pages:
  with pymupdf.open(d['localPath']) as pdf:
   (scratch/(d['auditLabel']+'.txt')).write_text('\n'.join(f'\nPAGINA {p}\n'+pdf[p-1].get_text() for p in pages))
(out/'comprobaciones-originales.json').write_text(json.dumps(checks,indent=2))
(out/'citas-refinadas.json').write_text(json.dumps(refined,ensure_ascii=False,indent=2))
print('hashes',len(checks),'ok',all(x['sha256Matches'] and x['sha512Matches'] and x['sizeMatches'] for x in checks),'citas',len(refined),'coincidentes',sum(x['matches'] for x in refined))
