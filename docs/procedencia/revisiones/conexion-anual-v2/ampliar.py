exec(open('.cache/conexion-anual-v2/preparar.py').read().split('cases=[]')[0])
cases=[]
for clase in ['empleo-laboral','pension']:
 for limite in ['14852','16576','17673.52','18276','19747.50','15362.22','21004.63','37425.68','59320.40','14450','22200','37200','62000','302000']:
  for delta in ['-.01','0','.01']:
   c=trabajo(str(D(limite)+D(delta)),clase)
   cases.append(dict(id=f'{clase}-{limite}-{delta}',entrada=c,rechazo=False,esperado=expected(c)))
 for n in [0,1,99,100,101]:
  c=trabajo('999999999999.99',clase);r=c['trabajo']['rendimientos'][0];c['trabajo']['rendimientos']=[dict(deepcopy(r),id=str(i)) for i in range(n)]
  cases.append(dict(id=f'cota-{clase}-{n}',entrada=c,rechazo=n in [0,101],esperado=expected(c) if n not in [0,101] else {}))
 c=trabajo('1000000000000',clase);cases.append(dict(id=f'desborde-{clase}',entrada=c,rechazo=True,esperado={}))
old=json.loads(Path('docs/procedencia/revisiones/conexion-anual-v1/casos.json').read_text())
for target in ['0','5550','5956.65','13362.22','19004.63','35425.68','57320.40']:
 for delta in ['-.01','0','.01']:
  v=D(target)+D(delta)
  if v<0:continue
  bruto=(v/D('.95')).quantize(D('.01')) if v<38000 else v+2000
  c=deepcopy(next(c['entrada'] for c in old if c['id']=='eds-10000'));c['actividad']['ingresos'][0]['base']=str(bruto)
  net=bruto-min(D(2000),bruto*D('.05'))
  cases.append(dict(id=f'eds-minimo-{target}-{delta}',entrada=c,rechazo=False,esperado={'baseImponibleGeneral':str(net),'cuotaLiquidaLegal':str(cuota(net))}))
Path('.cache/conexion-anual-v2/casos-ampliados.json').write_text(json.dumps(cases,indent=2))
