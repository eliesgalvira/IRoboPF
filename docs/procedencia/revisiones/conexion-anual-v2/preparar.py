from pathlib import Path
from decimal import Decimal as D, getcontext, ROUND_HALF_UP
from copy import deepcopy
import json
getcontext().prec=120
out=Path(__file__).parent
root=Path('/home/elies/.t3/worktrees/IRoboPF/t3-c26a76c1')
a=dict(ejercicio=2025,comunidadAutonoma='madrid',edad=40,modalidad='individual',residenciaTodoElAnio=True,devengo='2025-12-31',otrasRentas='ninguna',familiaresConDerechoMinimo='ninguno',discapacidad='ninguna',reduccionesBase='ninguna',saldosAnteriores='ninguno',deducciones='solo-da61-si-procede',rentasExtranjeras='ninguna',especialidades='ninguna')
def trabajo(bruto='16576.01',clase='empleo-laboral'):
 return dict(a,perfil='solo-trabajo',conciliacion=dict(ejercicio=2025,estado='totales-anuales-sin-duplicados',procedencia=['sintetico#2025']),retenciones=[],trabajo=dict(ejercicio=2025,territorio='comun',reduccionesArt18='ninguna',movilidad='ninguna',discapacidadActiva='ninguna',rendimientos=[dict(id='r1',clase=clase,integro=bruto,cotizaciones=dict(clase='efectivas',seguridadSocial='0',derechosPasivos='0',colegiosHuerfanos='0'),sindicato=dict(importe='0',satisfecho='no'),colegio=dict(importe='0',satisfecho='no',obligatorio='no',finesEsenciales='no'),defensa=dict(importe='0',satisfecho='no',litigioDirectoPagador='no'))]))
def cuota(b):
 b=max(D(0),D(b))
 def escala(x,rows):
  lo,q,t=next(r for r in reversed(rows) if x>=D(r[0])); return D(q)+(x-D(lo))*D(t)
 e=[('0','0','.095'),('12450','1182.75','.12'),('20200','2112.75','.15'),('35200','4362.75','.185'),('60000','8950.75','.225'),('300000','62950.75','.245')]
 m=[('0','0','.085'),('13362.22','1135.79','.107'),('19004.63','1739.53','.128'),('35425.68','3841.42','.174'),('57320.40','7651.10','.205')]
 return escala(b,e)-escala(min(b,D(5550)),e)+escala(b,m)-escala(min(b,D('5956.65')),m)
def expected(c):
 rs=c['trabajo']['rendimientos']; bruto=sum(D(r['integro']) for r in rs)
 ss=sum(sum(D(r['cotizaciones'][k]) for k in ['seguridadSocial','derechosPasivos','colegiosHuerfanos']) for r in rs)
 sind=sum(D(r['sindicato']['importe']) for r in rs if r['sindicato']['satisfecho']=='si')
 colegio=min(D(500),sum(D(r['colegio']['importe']) for r in rs if all(r['colegio'][k]=='si' for k in ['satisfecho','obligatorio','finesEsenciales'])))
 defensa=min(D(300),sum(D(r['defensa']['importe']) for r in rs if all(r['defensa'][k]=='si' for k in ['satisfecho','litigioDirectoPagador'])))
 previo=bruto-ss-sind-colegio-defensa; neto=previo-min(D(2000),max(D(0),previo))
 red=D(7302) if previo<=14852 else D(7302)-D('1.75')*(previo-14852) if previo<=D('17673.52') else D('2364.34')-D('1.14')*(previo-D('17673.52')) if previo<D('19747.50') else D(0)
 red=min(max(neto,D(0)),red); neto-=red
 q=cuota(neto); ded=min(q,max(D(0),D(340)-max(D(0),bruto-16576)*D('.2'))) if rs[0]['clase']!='pension' and bruto>0 else D(0)
 ret=sum(D(r['importe']) for r in c['retenciones']); diff=q-ded-ret
 return {k:format(v,'f') for k,v in dict(baseImponibleGeneral=neto,baseLiquidableGeneral=neto,reduccionArt20=red,cuotaLiquidaLegal=q,deduccionTrabajo=ded,cuotaDiferencial=diff).items()}
cases=[]
def add(id,c,reject=False,exp=None): cases.append(dict(id=id,entrada=c,rechazo=reject,esperado={} if reject else exp if exp is not None else expected(c)))
for clase in ['empleo-laboral','pension']:
 for b in ['0','0.01','14851.99','14852','14852.01','16576','16576.01','17673.52','17673.53','18275.99','18276','19747.49','19747.50','25000','60000','999999999999.99']:
  add(clase+'-'+b,trabajo(b,clase))
for edad in [17,18,64,65,18.5]:
 c=trabajo();c['edad']=edad;add('edad-'+str(edad),c,edad not in [18,64])
for k,v in dict(ejercicio=2026,modalidad='conjunta',comunidadAutonoma='andalucia',residenciaTodoElAnio=False,devengo='2025-12-30',otrasRentas='presentes',extra='x').items():
 c=trabajo();c[k]=v;add('alcance-'+k,c,True)
for k in ['conciliacion','trabajo','retenciones']:
 c=trabajo();c[k]=None;add('null-'+k,c,True)
c=trabajo();c['conciliacion']['procedencia']=[];add('sin-procedencia',c,True)
c=trabajo();c['trabajo']['rendimientos'][0]['extra']=1;add('extra-anidado',c,True)
for b in ['-1','NaN','Infinity','1e4','16576.001']:
 add('importe-'+b,trabajo(b),True)
for clase in ['pension','empleo-estatutario']:
 c=trabajo();r=deepcopy(c['trabajo']['rendimientos'][0]);r.update(id='r2',clase=clase);c['trabajo']['rendimientos'].append(r);add('mezcla-'+clase,c,clase=='pension')
c=trabajo('20000');r=c['trabajo']['rendimientos'][0];r['cotizaciones']['seguridadSocial']='1200';r['sindicato']=dict(importe='600',satisfecho='si');r['colegio']=dict(importe='400',satisfecho='si',obligatorio='si',finesEsenciales='si');r['defensa']=dict(importe='250',satisfecho='si',litigioDirectoPagador='si');r2=deepcopy(r);r2['id']='r2';c['trabajo']['rendimientos'].append(r2);add('gastos-dos-pagadores',c)
c=trabajo('0');c['trabajo']['rendimientos'][0]['cotizaciones']['seguridadSocial']='300';add('perdida',c)
c=trabajo();c['trabajo']['rendimientos'][0]['cotizaciones']['clase']='estimadas';add('ss-estimada',c,True)
for variant in ['iguales','duplicadas','estimadas','otro-ejercicio']:
 c=trabajo();c['retenciones']=[dict(operacionId='op'+str(i),procedencia='sintetico#'+str(i),ejercicio=2025,importe='100',efectiva=True) for i in range(2)]
 if variant=='duplicadas': c['retenciones'][1]['operacionId']='op0'
 if variant=='estimadas': c['retenciones'][0]['efectiva']=False
 if variant=='otro-ejercicio': c['retenciones'][0]['ejercicio']=2024
 add('ret-'+variant,c,variant!='iguales')
for clase in ['empleo-laboral','pension']:
 c=trabajo('999999999999.99',clase);r=deepcopy(c['trabajo']['rendimientos'][0]);r['id']='r2';c['trabajo']['rendimientos'].append(r);add('agregado-extremo-'+clase,c)
# Solo reutilizamos estructura de entrada anterior; expectativas de conexión nuevas.
base=json.loads((root/'docs/procedencia/revisiones/actividades-implementacion/casos-independientes.json').read_text())[0]['entrada']
for b in ['0','5550','5956.65','10000','40000','999999999999.99']:
 e=deepcopy(base);e.update(ingresos=[],gastos=[],reta=[],activos=[],retenciones=[],pagosFraccionados=[],aplicarInicio=False,aplicarRentasBajas=False)
 e['ingresos']=[dict(id='factura',justificante='factura',fecha='2025-06-01',base=b,iva='0',ivaRecuperable='0',afectacionExclusiva=True,registrado=True,categoria='servicio',clienteId='cliente',sujetoRetencion=True,rectificativa=False)]
 net=D(b)-min(D(2000),D(b)*D('.05'));q=cuota(net)
 add('eds-'+b,dict(a,perfil='solo-actividad-eds',actividad=e),exp={'baseImponibleGeneral':str(net),'cuotaLiquidaLegal':str(q)})
(out/'casos.json').write_text(json.dumps(cases,indent=2))
e=deepcopy(cases[-2]['entrada']['actividad'])
e['ingresos'][0]['base']='20000'
e['reta']=[dict(id='reta',justificante='extracto#op',fecha='2025-06-30',importe='300',tipo='ordinaria',propia=True,efectiva=True,periodo='2025-06')]
e['retenciones']=[dict(id='ret',justificante='cert',fecha='2025-12-31',operacionId='op-ret',ingresoId='factura',importe='1000',efectiva=True)]
e['pagosFraccionados']=[dict(id='pago',justificante='130',fecha='2026-01-20',operacionId='op-130',periodo='2025-4T',modelo='130',importe='100',efectivo=True)]
for opcion,inicio,net in [('gastos-dificiles',False,'18715'),('gastos-dificiles',True,'14972'),('cliente-unico',False,'17645.85'),('cliente-unico',True,'14116.68')]:
 c=dict(a,perfil='solo-actividad-eds',actividad=deepcopy(e));c['actividad'].update(opcion=opcion,aplicarInicio=inicio)
 # RN=19700; adicional 6498 - (19700-14047.5)*1.14 =54.15; R32=2054.15.
 add('eds-reta-'+opcion+'-'+str(inicio),c,exp={'baseImponibleGeneral':net,'cuotaDiferencial':str(cuota(net)-1100),'retenciones':'1000','pagosFraccionados':'100'})
for variant in ['duplicado-pago','estimada','extra','mixto','reta-duplicada']:
 c=dict(a,perfil='solo-actividad-eds',actividad=deepcopy(e))
 if variant=='duplicado-pago':c['actividad']['pagosFraccionados'][0]['operacionId']='op-ret'
 if variant=='estimada':c['actividad']['retenciones'][0]['efectiva']=False
 if variant=='extra':c['actividad']['retenciones'][0]['extra']=1
 if variant=='mixto':c['trabajo']=trabajo()['trabajo']
 if variant=='reta-duplicada':
  c['actividad']['gastos']=[dict(id='g',justificante='extracto#op',fecha='2025-06-30',base='300',iva='0',ivaRecuperable='0',afectacionExclusiva=True,registrado=True,categoria='alquiler-local',correlacion=True,rectificativa=False)]
 add('eds-rechaza-'+variant,c,True)
c=dict(a,perfil='solo-actividad-eds',actividad=deepcopy(e));c['actividad'].update(ingresos=[],retenciones=[],pagosFraccionados=[]);add('eds-perdida-reta',c,exp={'baseImponibleGeneral':'-300','cuotaDiferencial':'0'})
old=json.loads((root/'docs/procedencia/revisiones/actividades-implementacion/casos-independientes.json').read_text())
activo=next(r['entrada']['activos'][0] for r in old if r['entrada']['activos'])
c=dict(a,perfil='solo-actividad-eds',actividad=deepcopy(e));c['actividad']['activos']=[activo];add('eds-activo-excluido',c,True)
(out/'casos.json').write_text(json.dumps(cases,indent=2))
c=deepcopy(next(r['entrada'] for r in cases if r['id']=='eds-999999999999.99'))
c['actividad']['ingresos']=[dict(c['actividad']['ingresos'][0],id='i'+str(i),justificante='f'+str(i)) for i in range(10000)]
net=D('999999999999.99')*10000-2000
add('eds-10000-importes-maximos',c,exp={'baseImponibleGeneral':str(net),'cuotaLiquidaLegal':str(cuota(net))})
(out/'casos.json').write_text(json.dumps(cases,indent=2))
add('cuota-publicada-centimo',trabajo('25000.02'))
cases[-1]['esperado']['cuotaDiferencialPresentada']=str(D(cases[-1]['esperado']['cuotaDiferencial']).quantize(D('.01'),rounding=ROUND_HALF_UP))
(out/'casos.json').write_text(json.dumps(cases,indent=2))
