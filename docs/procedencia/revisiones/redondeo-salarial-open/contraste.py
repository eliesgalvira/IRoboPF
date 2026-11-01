import json
from fractions import Fraction as F
from pathlib import Path
R=Path.cwd(); O=R/'docs/procedencia/revisiones/redondeo-salarial-open'
def q(x):
    assert x>=0
    return F((x*100+F(1,2)).numerator//(x*100+F(1,2)).denominator,100)
def escala(b,filas):
    c,a,t=next((F(c),F(a),F(t)) for c,a,t in reversed(filas) if b>=F(c))
    return a+(b-c)*t
es=[('0','0','.095'),('12450','1182.75','.12'),('20200','2112.75','.15'),('35200','4362.75','.185'),('60000','8950.75','.225'),('300000','62950.75','.245')]
au=[('0','0','.085'),('13362.22','1135.79','.107'),('19004.63','1739.53','.128'),('35425.68','3841.42','.174'),('57320.40','7651.10','.205')]
old=json.loads((O/'anterior.json').read_text()); now=json.loads((O/'actual.json').read_text()); decisions=[]
for a,b in zip(old,now,strict=True):
    c=b['entrada']; r=c['trabajo']['rendimientos']; m=b['monetario']
    if r[0]['clase']=='pension':
        assert a['monetario']==m
        assert [(x['siteId'],x['decimal']) for x in a['lineas']]==[(x['siteId'],x['decimal']) for x in b['lineas']]
        decisions.append({'id':b['id'],'decision':'pension monetaria idéntica a base'}); continue
    bruto=sum(F(x['integro']) for x in r); ss=sum(F(v) for x in r for k,v in x['cotizaciones'].items() if k!='clase')
    gastos=ss+sum(F(x['sindicato']['importe']) for x in r)+min(500,sum(F(x['colegio']['importe']) for x in r))+min(300,sum(F(x['defensa']['importe']) for x in r))
    previo=bruto-gastos; art19=previo-min(2000,max(0,previo))
    art20=F(7302) if previo<=14852 else F(7302)-F('1.75')*(previo-14852) if previo<=F('17673.52') else F('2364.34')-F('1.14')*(previo-F('17673.52')) if previo<F('19747.50') else F(0)
    art20=q(min(max(0,art19),art20)); neto=art19-art20; base=max(0,neto)
    ge=q(escala(base,es)); gm=q(escala(min(base,5550),es)); ga=q(escala(base,au)); gam=q(escala(min(base,F('5956.65')),au))
    cuota=ge-gm+ga-gam; ded=q(min(cuota,max(0,340-max(0,bruto-16576)/5))) if bruto>0 else F(0)
    ret=sum(F(x['importe']) for x in c['retenciones']); posterior=cuota-ded
    checks={'reduccionArt20':art20,'rendimientoNetoReducido':neto,'baseImponibleGeneral':neto,'baseLiquidableGeneral':neto,'cuotaLiquidaLegal':cuota,'deduccionTrabajo':ded,'cuotaPosterior':posterior,'retenciones':ret,'cuotaDiferencial':posterior-ret}
    for k,v in checks.items(): assert F(m[k])==v,(b['id'],k,m[k],str(v))
    lines={x['siteId']:x for x in b['lineas']}
    assert F(lines['anual.explicito.cuota.estatal']['decimal'])==ge-gm
    assert F(lines['anual.explicito.cuota.autonomica']['decimal'])==ga-gam
    for k,x,y in [('estatal',ge,gm),('autonomica',ga,gam)]:
        assert f'{float(x):.2f} − {float(y):.2f}' in lines['anual.explicito.cuota.'+k]['formula']
    decisions.append({'id':b['id'],'decision':'expectativas racionales propias exactas coinciden','antes':a['monetario']['cuotaDiferencialPresentada'],'ahora':m['cuotaDiferencialPresentada'],'art20Exacto':str(art20),'cuota':str(cuota),'da61':str(ded)})
historico='docs/procedencia/implementaciones/anual-salarial-completo/casos.json'
import subprocess,hashlib
assert (R/historico).read_bytes()==subprocess.check_output(['git','show','b99c684:'+historico])
(O/'decisiones.json').write_text(json.dumps({'criterio':'Fracciones propias, escalas con cuotas publicadas, comparación sin toFixed ni importación del generador del autor','casos':decisions,'historicoConservadoSha256':hashlib.sha256((R/historico).read_bytes()).hexdigest(),'sinteticos':'No son nuevas ejecuciones oficiales'},indent=2))
print(len(decisions),'contrastes exactos propios, incluidos dos controles de pensión')
