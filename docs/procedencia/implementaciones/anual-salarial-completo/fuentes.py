"""Relee originales conservados, comprueba hashes y extrae pasajes de trabajo 2025.
No descarga ni altera el corpus. Requiere pdftotext (Nix poppler-utils).
"""
from pathlib import Path
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
catalogo = json.loads((ROOT/'docs/procedencia/auditorias/trabajo-deducciones-estatales/documentos.json').read_text())
seleccion = {'ley26-2014': [11,12], 'reglamento-original': [16,17], 'rdl4-2024': [23], 'ley5-2025': [46,47], 'aeat2025': [254,259,260,1068,1069,1119,1120,1121,1128,1372,1373,1377,1378,1379]}
fuentes=[]
for d in catalogo:
    label=d.get('auditLabel')
    if label not in seleccion: continue
    p=Path(d['localPath']); data=p.read_bytes(); assert hashlib.sha256(data).hexdigest()==d['sha256']
    paginas=subprocess.check_output(['pdftotext','-layout',str(p),'-']).decode().split('\f')
    nums=set(seleccion[label])
    extractos=[{'paginaFisica':n,'texto':paginas[n-1]} for n in sorted(nums)]
    fuentes.append(dict(label=label,path=str(p),sha256=d['sha256'],size=len(data),url=d['canonicalUrl'],extractos=extractos,autenticacionNueva=False))
# Tabla y mínimo Madrid en la ley ya conservada por la revisión v2.
h='502aa027788673d8f653c2cd8ce87038630a7dab13b63d625c5905bd1a5ce8de'
p=Path('/home/local/Repos/IRoboPF/.cache/procedencia/sha256')/h
data=p.read_bytes(); assert hashlib.sha256(data).hexdigest()==h
texto=subprocess.check_output(['pdftotext','-f','3','-l','3','-layout',str(p),'-']).decode()
fuentes.append(dict(label='ley13-2023-madrid',path=str(p),sha256=h,size=len(data),url='https://www.boe.es/eli/es-md/l/2023/12/15/13',extractos=[dict(paginaFisica=3,texto=texto)],autenticacionNueva=False))
(OUT/'fuentes.json').write_text(json.dumps(fuentes,ensure_ascii=False,indent=2)+'\n')
print([(f['label'],[e['paginaFisica'] for e in f['extractos']]) for f in fuentes])
