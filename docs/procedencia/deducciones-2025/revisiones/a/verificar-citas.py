"""Reextrae citas de revisión. --cas puede repetirse; root plano o root/sha256.
Python con pymupdf1.26.7 y beautifulsoup4 4.14.3. Solo lee originales.
"""
import argparse
import hashlib
import json
from pathlib import Path
import fitz
from bs4 import BeautifulSoup
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--cas',action='append',type=Path,required=True)
a=p.parse_args()
here=Path(__file__).resolve().parent
base=here.parents[1]/'lotes/a'
docs=json.loads((base/'fuentes.json').read_text())['documentos']+json.loads((here/'fuentes-complementarias.json').read_text())['documentos']
docs={d['id']:d for d in docs}
citas=json.loads((here/'citas-refinadas.json').read_text())['citas']
for c in citas:
 d=docs[c['documentoId']];h=d['sha256']
 archivo=next(p for r in a.cas for p in [r/h,r/'sha256'/h] if p.is_file())
 b=archivo.read_bytes()
 assert len(b)==d['bytes'] and hashlib.sha256(b).hexdigest()==h and hashlib.sha512(b).hexdigest()==d['sha512']
 loc=c['localizador']
 if loc['tipo']=='pdf':
  with fitz.open(archivo) as pdf:t=pdf[loc['paginaFisica']-1].get_text(clip=fitz.Rect(loc['bbox']),sort=False)
 else:
  s=BeautifulSoup(b,'html.parser');t=s.select(loc['selector'])[loc['indice']].get_text('\n',strip=True)[loc['inicio']:loc['fin']]
 assert t==c['textoLiteral'],c['id']
print(len(citas),'citas complementarias reextraídas; no certifica interpretación ni vigencia completa.')
