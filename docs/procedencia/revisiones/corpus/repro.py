import sys,json,hashlib,copy,subprocess,os
from pathlib import Path
from unittest.mock import patch
S=Path('/home/elies/.t3/worktrees/IRoboPF/t3-5be43c93'); W=Path('/home/elies/Repos/IRoboPF/.cache/procedencia/revision-corpus');sys.path.insert(0,str(S/'tools/procedencia'))
import corpus as c, descargar as d, pymupdf as p
out={}
def test(name,fn):
 try: out[name]=fn()
 except Exception as e: out[name]={'exception':type(e).__name__,'message':str(e)[:160]}
def rejected(fn):
 try:fn();return False
 except Exception:return True
manifest=json.loads(Path('/home/elies/Repos/IRoboPF/docs/procedencia/entregas/corpus-manifiesto.json').read_text())
out['delivery_hashes']={r['path']: hashlib.sha256(Path(r['absolutePath']).read_bytes()).hexdigest()==r['sha256'] for r in manifest}
F=S/'docs/procedencia/corpus'; root=F/'fixtures'
r=json.loads((F/'bocm-firmado.manifest.json').read_text()); cit=json.loads((F/'bocm-celda.citation.json').read_text())
# No output metadata values.
out['sensitive_header_counts']={f.name:sum(k.lower() in ('cookie','set-cookie','authorization','proxy-authorization') for k in json.loads(f.read_text()).get('headers',{})) for f in F.glob('*.manifest.json')}
candidate=copy.deepcopy(cit);candidate['independentReview']={'status':'verified','reviewer':'inventado-b','author':'inventado-a','evidence':'no-existe'}; candidate['semanticValidation']={'status':'verified'}
test('fabricated_acceptance',lambda:c.verify(r,candidate,root,accepted=True))
mut=copy.deepcopy(r);mut.update(canonicalUrl='https://www.boe.es/false.pdf',finalUrl='https://www.boe.es/false.pdf',authenticity={'status':'inventado'},unexpected=True)
test('document_unknown_fields_status',lambda:(c.validate_schema(mut,'document'),'accepted')[1])
test('citation_unknown_review_fields',lambda:(c.validate_schema(candidate,'citation'),'accepted')[1])
def legacy():
 src=W/'legacy'; dst=W/'imported';(src/'sha256').mkdir(parents=True,exist_ok=True)
 (src/'sha256'/r['sha256']).write_bytes((root/'sha256'/r['sha256']).read_bytes())
 old=copy.deepcopy(r);old.pop('redirects',None); d.atomic_json(src/'urls/a.json',old)
 imported=c.ingest(src,dst)[0]
 return {'sourcePolicy':imported['sourcePolicy'],'redirects':imported['redirects']}
test('legacy_unknown_redirects',legacy)
# Synthetic records exclude sensitive original metadata.
def record(data,rt):
 (rt/'sha256').mkdir(parents=True,exist_ok=True);sha=hashlib.sha256(data).hexdigest();path=rt/'sha256'/sha;path.write_bytes(data)
 return {'sha256':sha,'sha512':d.digest(path,'sha512'),'size':len(data),'canonicalUrl':'https://www.boe.es/a.pdf','finalUrl':'https://www.boe.es/a.pdf'}
rt=W/'synthetic';doc=p.open();pg=doc.new_page(width=400,height=500);pg.insert_text((60,70),'Importe 1234,56 euros');rr=record(doc.tobytes(),rt);doc.close()
test('bool_page_direct_api',lambda:c.cite(rr,rt,True,[50,40,300,100])['page'])
out['bad_boxes_rejected']={str(b): rejected(lambda:c.cite(rr,rt,1,b)) for b in ([True,40,300,100],[0,0,float('nan'),40],[0,0,float('inf'),40],[-1,0,40,40],[4,4,2,2])}
def rotations():
 result={}
 for rotation in (0,90,180,270):
  doc=p.open();pg=doc.new_page(width=400,height=500);pg.set_mediabox(p.Rect(10,20,410,520));pg.set_cropbox(p.Rect(30,30,360,450));pg.insert_text((40,60),'Capa selectiva');pg.set_rotation(rotation)
  box=[20,30,200,90]; text=c.extract(pg,box); png=c.crop_bytes(pg,box); pix=p.Pixmap(png)
  result[rotation]={'text':text,'dimensions':[pix.width,pix.height],'pixels_nonwhite':any(x<240 for x in pix.samples),'stable':png==c.crop_bytes(pg,box)};doc.close()
 return result
test('rotations_nonzero_origin',rotations)
def no_write():
 cc=c.cite(rr,rt,1,[50,40,300,100]);fp=rt/'sha256'/cc['facsimile']['sha256'];fp.unlink();failed=rejected(lambda:c.verify(rr,cc,rt));return {'reject':failed,'not_recreated':not fp.exists()}
test('missing_crop_no_write',no_write)
def bind(text,literal,unit,value,code):
 start=text.index(literal);u=text.index(unit);return c.verify_binding(text,{'number':{'start':start,'end':start+len(literal),'literal':literal},'numberFormat':'es-ES','value':value,'unit':{'start':u,'end':u+len(unit),'literal':unit},'unitCode':code})
test('unicode_minus',lambda:bind('−8,50 %','8,50','%','8.50','percent'))
test('fraction_percent_rejected',lambda:rejected(lambda:bind('8,50 %','8,50','%','0.085','percent')))
test('unrelated_unit',lambda:bind('8,50 euros; otra columna %','8,50','%','8.50','percent'))
out['url_rejections']={u:rejected(lambda:d.check_url(u,d.DEFAULT_HOSTS)) for u in ['https://user@www.boe.es/a','https://@www.boe.es/a','https://www.boe.es:444/a','https://[::1]/a','https://www.bоe.es/a','https://www.boe.es./a','https://127.0.0.1/a','https://www.boe.es/a#x']}
for name in ('irpf-consolidado','bocm-firmado'):
 rec=json.loads((F/(name+'.manifest.json')).read_text());sig=c.signatures(rec,root);out['signature_'+name]={k:sig.get(k) for k in ('status','certificateValidations','signatureValidations','version','exitCode')}
def incremental():
 rt2=W/'incremental'; rec=record((root/'sha256'/r['sha256']).read_bytes(),rt2);path=rt2/'sha256'/rec['sha256'];doc=p.open(path);doc[0].insert_text((50,100),'UNSIGNED APPEND');doc.saveIncr();doc.close();rec=record(path.read_bytes(),rt2);sig=c.signatures(rec,rt2)
 return {'status':sig['status'],'validations':sig['signatureValidations'],'coverage_lines':[x for x in sig['report'].splitlines() if 'Total' in x or 'Range' in x or 'signed' in x]}
test('unsigned_incremental',incremental)
for output in ('Signature Validation: Signature is Valid.\nCertificate Validation: Certificate has Expired.', 'Validación de firma: válida', 'tool failure'):
 with patch('corpus.subprocess.run',return_value=subprocess.CompletedProcess([],1,output,'')):
  test('signature_parser_'+str(len(output)),lambda:c.signatures(r,root)['status'])
# URL cache can return canonical URL different from requested.
def wrong_cache():
 rt3=W/'cache'; rec=record(b'%PDF-test',rt3);rec['canonicalUrl']='https://example.org/a';rec['finalUrl']='https://example.org/a'
 key=hashlib.sha256(b'https://www.boe.es/a.pdf').hexdigest();d.atomic_json(rt3/'urls'/(key+'.json'),rec)
 return d.download('https://www.boe.es/a.pdf',rt3)['canonicalUrl']
test('wrong_cache_url',wrong_cache)
# Blob hash traversal rejected before accessing path.
out['hash_traversal_rejected']=rejected(lambda:d.verify_blob({'sha256':'../x'},rt))
(W/'results.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n');print(json.dumps(out,indent=2,ensure_ascii=False))
