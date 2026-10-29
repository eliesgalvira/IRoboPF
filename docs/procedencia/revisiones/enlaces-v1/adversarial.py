import sys,json,importlib.util,hashlib
from pathlib import Path
import pymupdf
root=Path.cwd(); out=root/'.cache/procedencia/revision-enlaces-v1'
sys.path.insert(0,str(root/'tools/procedencia'))
import corpus,enlaces
font='/nix/store/1nnsca2xfhhz8xkadcpy4hv2kwffs0zy-dejavu-fonts-minimal-2.37/share/fonts/truetype/DejaVuSans.ttf'
for name,text in [('super','⁻8,50 euros'),('sub','₋8,50 euros'),('space','− 8,50 euros'),('thin','−\u20098,50 euros'),('emspace','−\u20038,50 euros'),('mark','−\u0301 8,50 euros')]:
 doc=pymupdf.open();p=doc.new_page(width=300,height=90);p.insert_font(fontname='dv',fontfile=font);p.insert_text((20,45),text,fontname='dv',fontsize=20);doc.save(out/(name+'.pdf'));doc.close()
 with pymupdf.open(out/(name+'.pdf')) as doc:
  t=doc[0].get_text(flags=0);doc[0].get_pixmap().save(out/(name+'.png'))
 n=t.index('8,50');u=t.index('euros');b={'number':{'start':n,'end':n+4,'literal':'8,50'},'numberFormat':'es-ES','value':'8.50','unit':{'start':u,'end':u+5,'literal':'euros'},'unitCode':'EUR'}
 try: corpus.verify_binding(t,b); result='ACCEPTED POSITIVE'
 except ValueError as e: result='REJECTED '+str(e)
 print(name,repr(t),result)
spec=importlib.util.spec_from_file_location('bridge_tests',root/'tests/procedencia-enlaces_test.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);m.BindingTest.setUpClass()
t=m.BindingTest();t.setUp();t.attest();original=enlaces.verify
# Instrumento determinista: modificación persistente después de haber leído payload.
def mutate(*args,**kw):
 result=original(*args,**kw)
 target=t.root/m.PAYLOAD;target.write_text(target.read_text().replace('53407','99999'))
 return result
enlaces.verify=mutate
print('persistent-payload-change',enlaces.verify_evidence(t.root,t.context)['evidence'][0]['bindingReview'])
print('payload-hash-no-longer-matches',enlaces.sha((t.root/m.PAYLOAD).read_bytes())!=t.attestation['payloadSha256'])
enlaces.verify=original;t.doCleanups()
t=m.BindingTest();t.setUp()
f=t.payload['document']['path'];d=json.loads((t.root/f).read_text());d['headers']['set-cookie']='SYNTHETIC-NOT-A-SECRET';t.payload['document']=t.write(f,d);t.change_payload()
try: print('private-header',enlaces.verify_evidence(t.root,t.context)['evidence'][0]['integrity'])
except Exception as e: print('private-header-rejected',str(e))
t.doCleanups()
cas=out/'cas';(cas/'sha256').mkdir(parents=True,exist_ok=True)
data=(out/'mark.pdf').read_bytes();h=hashlib.sha256(data).hexdigest();(cas/'sha256'/h).write_bytes(data)
record={'canonicalUrl':'https://www.boe.es/synthetic-review.pdf','finalUrl':'https://www.boe.es/synthetic-review.pdf','sha256':h,'sha512':hashlib.sha512(data).hexdigest(),'size':len(data),'retrievedAt':'2026-10-29T10:00:00Z','httpStatus':200,'headers':{},'mimeType':'application/pdf','authenticity':{'status':'not-validated'}}
citation=corpus.cite(record,cas,1,[0,0,300,90],b)
print('mark-full-pdf-roundtrip',corpus.verify(record,citation,cas))
(out/'mark.citation.json').write_text(json.dumps(citation,ensure_ascii=False,indent=2))
(out/'mark.manifest.json').write_text(json.dumps(record,ensure_ascii=False,indent=2))
