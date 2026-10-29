import sys, json, importlib.util, shutil
from pathlib import Path
from unittest.mock import patch
import pymupdf
root=Path.cwd(); out=root/'.cache/procedencia/revision-enlaces-v2'
sys.path.insert(0,str(root/'tools/procedencia'))
import enlaces, corpus
spec=importlib.util.spec_from_file_location('bt',root/'tests/procedencia-enlaces_test.py'); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m);m.BindingTest.setUpClass()
def fixture():
 t=m.BindingTest();t.setUp();t.attest();return t
base=fixture(); deps=enlaces.verify_evidence(base.root,base.context)['documentaryDependencies'];base.doCleanups()
print('DEPENDENCIES',json.dumps(deps))
original=enlaces.DocumentaryReadSet.finish
for dep in deps:
 for mode in ['append','delete','symlink']:
  t=fixture(); path=t.root/dep['path']
  def finish(reader):
   if mode=='append':path.write_bytes(path.read_bytes()+b' ')
   elif mode=='delete':path.unlink()
   else:
    copy=path.with_name(path.name+'.copy');copy.write_bytes(path.read_bytes());path.unlink();path.symlink_to(copy)
   return original(reader)
  with patch.object(enlaces.DocumentaryReadSet,'finish',finish):
   try:enlaces.verify_evidence(t.root,t.context); print('UNEXPECTED ACCEPT',mode,dep['path'])
   except (ValueError,OSError) as e:print('REJECT',mode,dep['path'],type(e).__name__)
  t.doCleanups()
# Original ENV1-02 timing, mutation remains on disk.
t=fixture(); verify=enlaces.verify
def mutate(*a,**kw):
 r=verify(*a,**kw);p=t.root/m.PAYLOAD;p.write_bytes(p.read_bytes()+b' ');return r
with patch('enlaces.verify',mutate):
 try:enlaces.verify_evidence(t.root,t.context); print('UNEXPECTED ACCEPT ENV1-02')
 except ValueError as e:print('ENV1-02 REJECT',e)
t.doCleanups()
# Only synthetic non-secret input; do not print header content.
t=fixture();p=t.payload['document']['path'];d=json.loads((t.root/p).read_text());d['headers']['set-cookie']='synthetic';t.payload['document']=t.write(p,d);t.change_payload()
try:enlaces.verify_evidence(t.root,t.context);print('UNEXPECTED ACCEPT ENV1-03')
except ValueError as e:print('ENV1-03 REJECT',e)
t.doCleanups()
font='/nix/store/1nnsca2xfhhz8xkadcpy4hv2kwffs0zy-dejavu-fonts-minimal-2.37/share/fonts/truetype/DejaVuSans.ttf'
for name,text in [('mark','−\u0301 8,50 euros'),('format','−\u200e 8,50 euros'),('plain','8,50 euros'),('tab','−\u0301\t8,50 euros'),('newline','−\n8,50 euros')]:
 doc=pymupdf.open();p=doc.new_page(width=300,height=110);p.insert_font(fontname='dv',fontfile=font);p.insert_text((20,40),text,fontname='dv',fontsize=20);doc.save(out/(name+'.pdf'));doc.close()
 with pymupdf.open(out/(name+'.pdf')) as doc:
  text=doc[0].get_text(flags=0);doc[0].get_pixmap().save(out/(name+'.png'))
 n=text.index('8,50');u=text.index('euros');b={'number':{'start':n,'end':n+4,'literal':'8,50'},'numberFormat':'es-ES','value':'8.50','unit':{'start':u,'end':u+5,'literal':'euros'},'unitCode':'EUR'}
 cas=out/'cas';(cas/'sha256').mkdir(parents=True,exist_ok=True);data=(out/(name+'.pdf')).read_bytes();h=enlaces.sha(data);(cas/'sha256'/h).write_bytes(data)
 import hashlib
 record={'canonicalUrl':'https://www.boe.es/synthetic-review.pdf','finalUrl':'https://www.boe.es/synthetic-review.pdf','sha256':h,'sha512':hashlib.sha512(data).hexdigest(),'size':len(data),'retrievedAt':'2026-10-29T10:00:00Z','httpStatus':200,'headers':{},'mimeType':'application/pdf','authenticity':{'status':'not-validated'}}
 try:
  c=corpus.cite(record,cas,1,[0,0,300,110],b);corpus.verify(record,c,cas);print('PDF ACCEPT',name,repr(text))
 except ValueError as e:print('PDF REJECT',name,repr(text),str(e))
