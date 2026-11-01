import json,re,zlib,hashlib,subprocess
from pathlib import Path
from decimal import Decimal as D
R=Path.cwd(); C=R/'.cache/revision-redondeo-sol'; O=R/'docs/procedencia/revisiones/redondeo-salarial-open'; A=R/'docs/procedencia/auditorias/redondeo-anual-rentaweb-open'
cases=json.loads((A/'casos.json').read_text()); oficial=json.loads((R/'docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json').read_text()); obs=json.loads((A/'observados.json').read_text())
keys=dict(zip(['0023','0025','0500','0505','0528','0529','0530','0531','0532','0533','0414','0595','0610','0670'],['TPRRT','TPTOTAL','BLGRAL','BLGGRAV','CEXGE1','CEXGA1','CEXGE2','CEXGA2','CIGEST','CIGAUT','CLDED2','CAUTLIQ','CDIF','RESULTADO']))
out=[]
for c,f,ob in zip(cases,oficial,obs,strict=True):
    assert c['id']==f['id']==ob['id']; assert c['entrada']==f['entrada']
    name=c['id']; fields=dict(re.findall(r'^\s*(\w+)~[13]~([^~\r\n]+)',zlib.decompress((A/(name+'.ses')).read_bytes()).decode('latin1'),re.M))
    text=subprocess.check_output(['pdftotext','-layout',str(A/(name+'.pdf')),'-'],text=True); (C/(name+'.txt')).write_text(text)
    hashes={ext:hashlib.sha256((A/(name+'.'+ext)).read_bytes()).hexdigest() for ext in ['pdf','ses']}; assert hashes==ob['sha256']
    r=c['entrada']['trabajo']['rendimientos']; sums={'IDII':sum(D(x['integro']) for x in r),'GSS':sum(D(v) for x in r for k,v in x['cotizaciones'].items() if k!='clase'),'IDRE':sum(D(x['importe']) for x in c['entrada']['retenciones'])}
    for key,prop in [('GCS','sindicato'),('GCC','colegio'),('GDJ','defensa')]: sums[key]=sum(D(x[prop]['importe']) for x in r)
    sums.update(IDICLDED2=sums['IDII'],GSSCLDED2=sums['GSS'])
    for k,v in sums.items(): assert D(fields.get(k,'0'))==v,(name,k)
    assert fields['EDADD']=='40' and fields['CAC_D']=='12' and fields['INDV']=='true'
    boxes={}
    for b,k in keys.items():
        m=re.findall(r'(-?[\d.]+,\d\d)\s+'+b+r'\b',text); v=m[-1].replace('.','').replace(',','.') if m else None
        assert v==f['casillas'][b],(name,b,v,f['casillas'][b])
        if v is not None: assert D(v)==D(fields[k])
        boxes[b]={'pdf':v,'ses':fields.get(k)}
    out.append({'id':name,'hashes':hashes,'entradas':{k:str(v) for k,v in sums.items()},'limites':{k:fields.get(k) for k in ['TPCP','TPGDJ']},'casillas':boxes})
(O/'originales.json').write_text(json.dumps(out,indent=2)); print('7 originales cotejados; 14 casillas por caso; null preservado')
