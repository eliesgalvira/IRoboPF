from pathlib import Path
import json,hashlib,html.parser
import pymupdf
root=Path('/home/elies/.t3/worktrees/IRoboPF/t3-fdd037ef')
out=Path('/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/alimentos-sin-minimo-sol')
class Text(html.parser.HTMLParser):
 def __init__(self): super().__init__();self.parts=[]
 def handle_data(self,d): self.parts.append(d)
sources=json.loads((root/'docs/procedencia/revisiones/minimos-derechos-v2-sol/fuentes-verificadas.json').read_text())
law=json.loads((root/'docs/procedencia/revisiones/minimos-derechos-v2-sol/original-ley.json').read_text());law['path']=str(root/'docs/procedencia/revisiones/correcciones-x-v1'/law['sha256']);sources.append(law)
rows=[]
for s in sources:
 p=Path(s['path']);b=p.read_bytes();h=hashlib.sha256(b).hexdigest();h5=hashlib.sha512(b).hexdigest();assert h==s['sha256'] and h5==s['sha512'] and len(b)==s['size']
 rows.append({'path':str(p),'sha256':h,'sha512':h5,'size':len(b),'url':s.get('url'),'integrity':True,'historicalAuthenticity':'not-validated'})
 if h.startswith('a5c98'):
  t=Text();t.feed(b.decode());text='\n'.join(x.strip() for x in t.parts if x.strip());(root/'.cache/alimentos-sol/manual.txt').write_text(text);print(text)
doc=pymupdf.open(law['path']);citations=[]
for page in [36,37,38,45]:
 p=doc[page-1];text=p.get_text();(root/f'.cache/alimentos-sol/ley-{page}.txt').write_text(text)
 pix=p.get_pixmap(matrix=pymupdf.Matrix(100/72,100/72),alpha=False);data=pix.tobytes('png');h=hashlib.sha256(data).hexdigest();(out/(h+'.png')).write_bytes(data)
 citations.append({'originalSha256':law['sha256'],'physicalPage':page,'bbox':list(p.rect),'extraction':'PDF text layer','facsimile':h+'.png','sha256':h,'dpi':100,'renderer':'PyMuPDF '+pymupdf.VersionBind})
 print('\nPAGE',page,'\n',text)
(out/'fuentes-verificadas.json').write_text(json.dumps(rows,indent=2));(out/'facsimiles.json').write_text(json.dumps(citations,indent=2))
