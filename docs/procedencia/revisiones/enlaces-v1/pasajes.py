import json,re,hashlib
from pathlib import Path
import pymupdf
for r in json.loads(Path('docs/procedencia/auditorias/seguridad-social/documentos.json').read_text()):
 pages={'BOE-A-2018-919':[2],'BOE-A-2018-9268':[168,371],'BOE-A-2025-3780':[16,17],'BOE-A-2026-7296':[16]}.get(r.get('identifier'))
 if pages:
  print(r['identifier'],r['sha256']); d=pymupdf.open(r['localPath'])
  for page in pages:print('PAGE',page,d[page-1].get_text())
r=json.loads(Path('docs/procedencia/revisiones/autonomicas-2017-2021/sources.json').read_text())
for s in r:
 if '90376' in s['canonicalUrl']:
  t=re.sub('<[^>]+>',' ',Path(s['localPath']).read_text()); t=re.sub(r'\s+',' ',t);i=t.find('Apreciado');print(t[i:i+1500])
