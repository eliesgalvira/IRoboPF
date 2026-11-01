"""Contraste independiente: Decimal exacto y cuotas estatales fijas publicadas."""
from decimal import Decimal as D, ROUND_HALF_UP
from pathlib import Path
import json, copy
ROOT=Path(__file__).resolve().parents[4]
OUT=ROOT/'.cache/anual-salarial-revision'
def q(x): return x.quantize(D('.01'),rounding=ROUND_HALF_UP)
def calc(e, policy='exacta'):
    rs=e['trabajo']['rendimientos']; z=D(0)
    bruto=sum((D(r['integro']) for r in rs),z)
    ae=sum((sum((D(v) for k,v in r['cotizaciones'].items() if k!='clase'),z)+(D(r['sindicato']['importe']) if r['sindicato']['satisfecho']=='si' else z) for r in rs),z)
    for name,cap,flags in [('colegio',500,['satisfecho','obligatorio','finesEsenciales']),('defensa',300,['satisfecho','litigioDirectoPagador'])]:
        ae+=min(D(cap),sum((D(r[name]['importe']) for r in rs if all(r[name][k]=='si' for k in flags)),z))
    previo=bruto-ae; art19=previo-min(D(2000),max(z,previo))
    # Descenso por segmentos, a partir del máximo; segundo segmento tiene origen legal propio.
    red=D(7302)-D('1.75')*max(z,min(previo,D('17673.52'))-D(14852))
    if previo>D('17673.52'): red=D('2364.34')-D('1.14')*(previo-D('17673.52'))
    if previo>=D("19747.50"): red=z
    red=min(max(z,red),max(z,art19))
    if policy in ('art20','todas'): red=q(red)
    neto=art19-red; b=max(z,neto)
    def tariff(v,rows):
        for a,c,t in reversed(rows):
            if v>=D(a): return D(c)+(v-D(a))*D(t)
        raise AssertionError(v)
    state=[('0','0','.095'),('12450','1182.75','.12'),('20200','2112.75','.15'),('35200','4362.75','.185'),('60000','8950.75','.225'),('300000','62950.75','.245')]
    mad=[('0','0','.085'),('13362.22','1135.79','.107'),('19004.63','1739.53','.128'),('35425.68','3841.42','.174'),('57320.40','7651.10','.205')]
    parts=[]
    for minimum,rows in [('5550',state),('5956.65',mad)]:
        upper=tariff(b,rows); lower=tariff(min(b,D(minimum)),rows)
        if policy=='gravamen': upper,lower=q(upper),q(lower)
        part=upper-lower
        if policy in ('componentes','todas'): part=q(part)
        parts.append(part)
    cuota=sum(parts,z); da=min(cuota,max(z,D(340)-max(z,bruto-D(16576))*D('.2'))) if bruto else z
    if policy in ('da61','todas'): da=q(da)
    posterior=cuota-da
    if policy=='posterior': posterior=q(posterior)
    ret=sum((D(r['importe']) for r in e['retenciones']),z); diff=posterior-ret
    return dict(reduccionArt20=str(red),baseLiquidableGeneral=str(neto),cuotaLiquidaLegal=str(cuota),deduccionTrabajo=str(da),cuotaPosterior=str(posterior),retenciones=str(ret),cuotaDiferencial=str(diff),cuotaDiferencialPresentada=format(q(diff),'.2f'),estatal=str(parts[0]),madrid=str(parts[1]))
cs=json.loads((ROOT/'docs/procedencia/implementaciones/anual-salarial-completo/casos.json').read_text())
inputs=[dict(nombre=c['nombre'],entrada=c['entrada']) for c in cs]
for cents in range(1700000,1701000,7):
    e=copy.deepcopy(cs[1]['entrada']); e['trabajo']['rendimientos'][0]['integro']=str(D(cents)/100)
    inputs.append(dict(nombre=f'rejilla-{cents}',entrada=e))
# Altas bases y fronteras adicionales sin reducción.
for b in ['12449.99','12450','12450.01','13362.21','13362.22','13362.23','35200','35200.01']:
    e=copy.deepcopy(cs[1]['entrada']); e['trabajo']['rendimientos'][0]['integro']=str(D(b)+3000)
    # SS mayor para mantener art20 cero cuando la base baja no lo permita no se fuerza: oracle resuelve el caso real.
    inputs.append(dict(nombre='adicional-'+b,entrada=e))
e=copy.deepcopy(cs[1]['entrada']); e['trabajo']['rendimientos'][0]['integro']='17000.95'
inputs.append(dict(nombre='empate-negativo-17000.95',entrada=e))
for c in inputs: c['esperado']=calc(c['entrada'])
assert all(all(D(c['esperado'][k])==D(v) for k,v in old['esperado'].items() if k in c['esperado']) for c,old in zip(inputs,cs))
(OUT/'entradas.json').write_text(json.dumps(inputs,indent=2))
witness={}
for p in ['art20','componentes','gravamen','da61','posterior','todas']:
    ds=[]
    for c in inputs:
        alternative=calc(c['entrada'],p)
        if alternative['cuotaDiferencialPresentada']!=c['esperado']['cuotaDiferencialPresentada']:
            ds.append(dict(nombre=c['nombre'],entrada=c['entrada'],exacta=c['esperado'],alternativa=alternative))
    witness[p]=dict(diferencias=len(ds),ejemplos=ds[:3],normativaAcreditada=False)
(OUT/'discriminantes.json').write_text(json.dumps(witness,indent=2))
print(len(inputs),'expectativas independientes; diferencias', {k:v['diferencias'] for k,v in witness.items()})
