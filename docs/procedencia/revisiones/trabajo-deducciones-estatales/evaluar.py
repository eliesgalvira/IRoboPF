import json
from decimal import Decimal as D
from pathlib import Path
p=Path('docs/procedencia/revisiones/trabajo-deducciones-estatales'); data=json.loads((p/'casos-resultados.json').read_text()); checks=[]
def add(id,case,field,actual,expected,scope):
 checks.append(dict(id=id,case=case,field=field,actual=actual,expected=expected,result='green' if actual==expected else 'red',scope=scope))
for i,c in enumerate(data['casos']):
 a=c['actual']; y=c['input']['anio']; bruto=c['input']['rendimientos']['trabajo'][0]['importeIntegroCentimos']; other=c['input']['rendimientos']['gananciasPatrimoniales'][0]['importeGananciaCentimos']
 if bruto==900000:
  if other>650000:
   expected=265200 if y<=2014 else 0
   add('TDE-09' if y<=2014 else 'TDE-10',i,'reduccionRendimientosTrabajoCentimos',a['reduccionRendimientosTrabajoCentimos'],expected,'Reducción aplicable con saldo suficiente; ganancias no exentas. No acredita cuota completa.')
  elif y<=2014:
   add('CONTROL-6500',i,'reduccionRendimientosTrabajoCentimos',a['reduccionRendimientosTrabajoCentimos'],408000,'Otras rentas iguales al límite sí mantienen reducción general.')
 if bruto==0 and other==0:
  add('TDE-19',i,'reduccionRendimientosTrabajoCentimos',a['reduccionRendimientosTrabajoCentimos'],0,'Cuantía aplicada; la teórica debe tener otro nombre.')
  if y>=2015: add('TDE-04',i,'gastosDeduciblesTrabajoCentimos',a['gastosDeduciblesTrabajoCentimos'],0,'Cuantía aplicada limitada al rendimiento disponible.')
 if bruto==1200000 and other==0 and y<=2014:
  assert a['baseImponibleGeneralCentimos']<=800000 and a['cuotaLiquidaCentimos']>40000
  add('TDE-23',i,'cuotaDiferencialCentimos',a['cuotaDiferencialCentimos'],a['cuotaLiquidaCentimos']-40000,'Solo omisión 80bis aislada: BI<=8000, cuota positiva >400, todo trabajo sin renta extranjera ni reducción base. No valida escalas/minimos.')
 if bruto==1657600 and other==0 and y==2025:
  add('TDE-20',i,'cuotaDiferencialCentimos',a['cuotaDiferencialCentimos'],max(0,a['cuotaLiquidaCentimos']-34000),'Empleo efectivo y única renta: límite cuota proporcional; DA61 después de cuota líquida/art80 y antes de retenciones. No modificar cuota líquida legal.')
for i,c in enumerate(data['reducciones']):
 if c['input']['anio']>=2024 and c['input']['rendimientoPrevioNeto']==19747.5: add('TDE-18','reducciones/'+str(i),'actual',c['actual'],'0','Exactitud de etapa Decimal; no demuestra céntimo en cuota final.')
(p/'casos-verificados.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n')
print('comprobaciones',len(checks),'rojas',sum(x['result']=='red' for x in checks),'controles verdes',sum(x['result']=='green' for x in checks))
for c in checks:
 if c['id'] in ['TDE-23','TDE-20']: print(c)
