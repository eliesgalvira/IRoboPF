import json,hashlib
from pathlib import Path
import pymupdf
p=Path('docs/procedencia/revisiones/trabajo-deducciones-estatales'); d=json.loads((p/'adquisicion-correccion2025.json').read_text()); b=Path(d['localPath']).read_bytes(); assert hashlib.sha256(b).hexdigest()==d['sha256']
cs=json.loads((p/'citas-refinadas.json').read_text())
with pymupdf.open(d['localPath']) as pdf:
 for i,page in enumerate(pdf):
  t=page.get_text(); print(t); cs.append({'id':f'REV-correccion2025-{i+1}','documentSha256':d['sha256'],'canonicalUrl':d['canonicalUrl'],'page':i+1,'boxes':[list(page.rect)],'extractedText':t,'scope':'Corrección íntegra para revisar si altera art96'})
(p/'citas-refinadas.json').write_text(json.dumps(cs,ensure_ascii=False,indent=2))
