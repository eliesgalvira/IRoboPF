exec(open('/home/elies/Repos/IRoboPF/.cache/procedencia/revision-corpus/repro.py').read().split('manifest=json.loads')[0])
from email.message import Message
class Response:
 status=200;url='https://www.boe.es/x.pdf'
 def __init__(self,data,headers):
  self.data=data;self.headers=Message()
  for k,v in headers.items():self.headers[k]=v
 def __enter__(self):return self
 def __exit__(self,*args):return False
 def read1(self,n):value,self.data=self.data,b'';return value
for name,data,headers in [('error200',b'<html>error</html>',{'Content-Type':'application/pdf'}),('truncated',b'%PDF-x',{'Content-Length':'12'}),('encoding',b'%PDF-x',{'Content-Encoding':'gzip'}),('oversize',b'%PDF-'+b'x'*40,{}),('empty',b'',{})]:
 rt=W/('net-'+name)
 with patch('descargar.urllib.request.build_opener') as op,patch('descargar.time.sleep'):
  op.return_value.open.return_value=Response(data,headers)
  out[name]={'rejected':rejected(lambda:d.download(Response.url,rt,max_bytes=20)), 'published':len(list((rt/'urls').glob('*.json'))),'temporary_files':len(list(rt.glob('tmp*')))}
with patch('descargar.urllib.request.build_opener') as op,patch('descargar.time.sleep'):
 op.return_value.open.side_effect=TimeoutError('synthetic');out['timeout']={'reject':rejected(lambda:d.download(Response.url,W/'timeout')),'attempts':op.return_value.open.call_count}
with patch('descargar.time.sleep'):
 handler=d.Redirects(d.DEFAULT_HOSTS);req=d.urllib.request.Request('https://www.boe.es/a')
 out['redirect_outside']=rejected(lambda:handler.redirect_request(req,None,302,'',{},'https://example.org/a'))
 out['redirect_other_allowed']=handler.redirect_request(req,None,302,'',{},'https://www.bocm.es/a').full_url
 out['redirect_limit']=[rejected(lambda:handler.redirect_request(req,None,302,'',{},'https://www.bocm.es/a')) for _ in range(5)]
# Whole page vs clip pixel correspondence at integer crop bounds, including rotations.
def pixels():
 result={}
 for rotation in (0,90,180,270):
  doc=p.open();page=doc.new_page(width=400,height=500);page.set_cropbox(p.Rect(20,30,350,450));page.insert_text((40,60),'Capa selectiva');page.set_rotation(rotation)
  box=[20,30,200,90];clip=c.rect_checked(page,box)*page.rotation_matrix;whole=page.get_pixmap(dpi=144,colorspace=p.csRGB,alpha=False,annots=False);crop=p.Pixmap(c.crop_bytes(page,box));x,y=int(clip.x0*2),int(clip.y0*2)
  expected=b''.join(whole.samples[(y+j)*whole.stride+x*3:(y+j)*whole.stride+(x+crop.width)*3] for j in range(crop.height));result[rotation]=crop.samples==expected;doc.close()
 return result
test('pixel_correspondence',pixels)
# Base tree file comparison; read-only Git, no index involved.
base_paths=subprocess.check_output(['git','ls-tree','-r','--name-only','d4d708f6'],text=True).splitlines();out['base_files_missing']=[x for x in base_paths if not (S/x).exists()]
base=subprocess.check_output(['git','show','d4d708f6:tools/procedencia/descargar.py']);out['base_helper_sha256']=hashlib.sha256(base).hexdigest();out['parent_helper_sha256']=hashlib.sha256(Path('/home/elies/Repos/IRoboPF/tools/procedencia/descargar.py').read_bytes()).hexdigest()
listing=json.loads((S/'.cache/procedencia-entrega.json').read_text());out['delivery_listing_type']=type(listing).__name__
(W/'network-results.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
