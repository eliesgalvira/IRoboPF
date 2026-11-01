import os,json,hashlib,base64,gzip,stat,subprocess
from pathlib import Path
from setup import inventory
R=Path.cwd(); C=R/'.cache/revision-redondeo-sol'; O=R/'docs/procedencia/revisiones/redondeo-salarial-open'; head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(); assert head=='f8f1e53198fb27bc6123e03ba0b084d8e1536a0e'
initial=json.loads((C/'initial.json').read_text()); final=inventory(); assert initial==final,[(k,initial.get(k),final.get(k)) for k in set(initial)|set(final) if initial.get(k)!=final.get(k)]
(O/'cierre.json').write_text(json.dumps({'head':head,'lock':'/tmp/irobopf-recepcion-acotada.lock','archivosFisicosFueraDeAmbito':len(final),'bytesModosSymlinks':'idénticos al inicio','archivosBorrados':0,'VCS':'solo lectura'},indent=2))
(O/'logs.json').write_text(json.dumps({f.name:f.read_text() for f in O.glob('*.log')},indent=2))
excluded=['manifiesto.json','transporte.json','transporte-ensayo.json']
entries=[]; payload=[]
for p in sorted(O.iterdir()):
    if p.name in excluded: continue
    data=p.read_bytes(); m=stat.S_IMODE(p.lstat().st_mode); path=p.relative_to(R).as_posix()
    item={'ruta':path,'sha256':hashlib.sha256(data).hexdigest(),'tamano':len(data),'modo':f'{m:04o}','base':{'head':head,'estado':'ausente'},'symlink':None}; entries.append(item); payload.append({**item,'gzipBase64':base64.b64encode(gzip.compress(data,mtime=0)).decode()})
manifest={'base':head,'excluidosAutorreferentes':excluded,'archivos':entries}; (O/'manifiesto.json').write_text(json.dumps(manifest,indent=2))
(O/'transporte.json').write_text(json.dumps({'formato':'adiciones gzip+base64 por archivo; modo POSIX; rutas relativas a raíz, sin borrados','base':head,'archivos':payload},separators=(',',':')))
# Ensayo lee de nuevo el transporte serializado, sin usar los bytes de origen como payload.
rest=C/'transporte-restaurado'; rest.mkdir(exist_ok=True)
for item in json.loads((O/'transporte.json').read_text())['archivos']:
    p=rest/item['ruta']; p.parent.mkdir(parents=True,exist_ok=True); p.write_bytes(gzip.decompress(base64.b64decode(item['gzipBase64']))); p.chmod(int(item['modo'],8))
    assert p.read_bytes()==(R/item['ruta']).read_bytes(); assert hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256']; assert len(p.read_bytes())==item['tamano']; assert stat.S_IMODE(p.stat().st_mode)==int(item['modo'],8)
(O/'transporte-ensayo.json').write_text(json.dumps({'resultado':'reconstrucción exacta verificada: bytes, SHA256, tamaño y modo','base':head,'archivos':len(entries),'vacios':[e['ruta'] for e in entries if e['tamano']==0],'exclusiones':excluded,'transporteSha256':hashlib.sha256((O/'transporte.json').read_bytes()).hexdigest(),'manifiestoSha256':hashlib.sha256((O/'manifiesto.json').read_bytes()).hexdigest()},indent=2))
print('Cierre físico idéntico; entrega ensayada',len(entries))
