from pathlib import Path
from decimal import Decimal as D,getcontext
import json
getcontext().prec=120
s=Path('.cache/conexion-anual-v2')
e=[('0','0','.095'),('12450','1182.75','.12'),('20200','2112.75','.15'),('35200','4362.75','.185'),('60000','8950.75','.225'),('300000','62950.75','.245')]
m=[('0','0','.085'),('13362.22','1135.79','.107'),('19004.63','1739.53','.128'),('35425.68','3841.42','.174'),('57320.40','7651.10','.205')]
def escala(b,rows):
 l,q,t=next(row for row in reversed(rows) if b>=D(row[0]));return D(q)+(b-D(l))*D(t)
out=[]
for f in ['resultados.json','resultados-ampliados.json']:
 for c in json.loads((s/f).read_text()):
  if c['exit']['_tag']=='Failure':
   assert '"Die"' not in json.dumps(c['exit']);continue
  r=c['exit']['value'];b=max(D(0),D(r['baseLiquidableGeneral']))
  lineas={l['origen']['siteId']:l['origen']['decimal'] for p in r['rastro']['pasos'] for l in p.get('lineasCalculo',[])}
  for label,rows,minimum in [('estatal',e,'5550'),('autonomica',m,'5956.65')]:
   expected=escala(b,rows)-escala(min(b,D(minimum)),rows)
   actual=D(lineas['anual.explicito.cuota.'+label]);assert expected==actual,(c['id'],label,expected,actual)
  assert D(r['cuotaPosterior'])-D(r['retenciones'])-D(r['pagosFraccionados'])==D(r['cuotaDiferencial'])
  assert r['aceptacionFiscal']=='pendiente'
  out.append(dict(id=c['id'],base=str(b),estatal=lineas['anual.explicito.cuota.estatal'],autonomica=lineas['anual.explicito.cuota.autonomica']))
(s/'componentes.json').write_text(json.dumps(out,indent=2));print('Componentes y pagos:',len(out),'correctos')
