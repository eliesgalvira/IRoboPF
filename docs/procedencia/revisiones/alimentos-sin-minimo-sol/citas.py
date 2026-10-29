from pathlib import Path
import pymupdf,json
r=Path('/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/alimentos-sin-minimo-sol')
sources=json.loads((r/'fuentes-verificadas.json').read_text());law=sources[-1];d=pymupdf.open(law['path']);cit=[]
for page,need in [(36,'8.000'),(37,'1.800'),(37,'grado más cercano'),(38,'Los contribuyentes que satisfagan'),(45,'Los contribuyentes que satisfagan')]:
 for b in d[page-1].get_text('blocks'):
  if need in b[4]:cit.append({'originalSha256':law['sha256'],'physicalPage':page,'bbox':list(b[:4]),'exactText':b[4],'method':'PyMuPDF get_text blocks; sin OCR','selector':need})
(r/'citas.json').write_text(json.dumps(cit,ensure_ascii=False,indent=2));print(len(cit),'citas reextraídas del original')
