import json,hashlib
from pathlib import Path
import pymupdf
from bs4 import BeautifulSoup
src=Path('docs/procedencia/auditorias/trabajo-deducciones-estatales'); out=Path('docs/procedencia/revisiones/trabajo-deducciones-estatales'); scratch=Path('.cache/procedencia/revision-trabajo-deducciones-estatales')
docs={d['auditLabel']:d for d in json.loads((src/'documentos.json').read_text())}; cs=json.loads((out/'citas-refinadas.json').read_text())
for c in json.loads((src/'citas-focales.json').read_text()):
 if not c.get('boxes'):
  soup=BeautifulSoup(Path(c['localPath']).read_bytes(),'html.parser'); container=soup.select_one(c['containerSelector']['value']); paras=[p.get_text() for p in container.find_all('p')]
  cs.append({'id':c['id'],'sourceLabel':c['sourceLabel'],'documentSha256':c['documentSha256'],'containerSelector':c['containerSelector'],'matches':c['quote'] in paras,'extractedText':c['quote'] if c['quote'] in paras else None,'limitation':'Coincidencia en contenedor HTML no prueba selección de versión; puede contener redacciones históricas desplegables.'})
  (scratch/(c['sourceLabel']+'-'+c['containerSelector']['value'][1:]+'.txt')).write_text(container.get_text('\n'))
for label,pages in {'rdl5-2026':[45,46],'convalidacion2026':[1],'correccion2026':[1],'aeat2015':[144,145],'aeat2025':[26,28,1372,1373,1374],'ley16-2012':[7,8],'ley16-2013':[18]}.items():
 d=docs[label]
 with pymupdf.open(d['localPath']) as pdf:
  for p in pages:
   page=pdf[p-1]; box=list(page.rect)
   cs.append({'id':f'REV-{label}-{p}','sourceLabel':label,'documentSha256':d['sha256'],'canonicalUrl':d['canonicalUrl'],'page':p,'boxes':[box],'extractedText':page.get_text(),'extraction':'PyMuPDF '+pymupdf.VersionBind,'matches':None,'scope':'Contexto independiente ampliado; no comparación con cita del autor'})
   if label in ['rdl5-2026','convalidacion2026']:
    dest=out/f'{label}-p{p}.png'; page.get_pixmap(dpi=96,alpha=False).save(dest); cs[-1]['facsimile']={'path':dest.name,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'dpi':96,'alpha':False}
(out/'citas-refinadas.json').write_text(json.dumps(cs,ensure_ascii=False,indent=2))
print('citas finales',len(cs))
