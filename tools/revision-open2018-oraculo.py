"""Oráculo stdlib independiente: valida resultados, no importa código del motor.
float CPython IEEE754 binary64; str(float) decimal shortest. No emula SES.
Decimal80 + HALF_UP sobre decimal corto.
Actualización12/11: resta binaria entre parciales, contrastada con PDF/SES15449.99;
los dos esperados sintéticos previos se preservan en la entrega del ajuste. Cifras explícitas de las tablas.
Las entradas son discriminantes sintéticos, nunca nuevas referencias oficiales.
"""
from decimal import Decimal as D, ROUND_HALF_UP, getcontext
from pathlib import Path
import json
getcontext().prec=80
q=lambda n:D(n).quantize(D('.01'),rounding=ROUND_HALF_UP)
def calc(g,e):
 n=float(g)-float(e)
 r1=3700. if n<=11250 else (3700.-1.15625*(n-11250) if n<=14450 else 0.)
 r2=5565. if n<=13115 else (max(0.,5565.-1.5*(n-13115)) if n<=16825 else 0.)
 a,b=q(str(r1)),q(str(r2));mixed=q(a+max(D(0),D(str(float(b)-float(a))))/2)
 net=max(D(0),D(g)-D(e)-2000);red=min(net,mixed);base=net-red
 def state(v):
  total=0.;lo=0.
  for hi,rate in [(12450,.095),(20200,.12),(35200,.15),(60000,.185),(1000001,.225)]:
   total+=max(0.,min(float(v),hi)-lo)*rate;lo=float(hi)
  return q(str(total))
 def madrid(v):
  table=[('0','0','.09'),('12450','1120.50','.112'),('17707.20','1709.31','.133'),('33007.20','3744.21','.179'),('53407.20','7395.81','.21')]
  lo,f,t=next(r for r in reversed(table) if v>=D(r[0]))
  return q(D(f)+(v-D(lo))*D(t))
 se,sa=state(base),madrid(base);me,ma=state(min(base,D(5550))),madrid(min(base,D(5550)))
 return dict(g=g,e=e,red=str(red),base=str(base),state=str(se),aut=str(sa),minState=str(me),minAut=str(ma),quota=str(se+sa-me-ma))
rows=json.loads((Path(__file__).resolve().parent.parent/'tests/fixtures/open-2018-oraculo-independiente.json').read_text())
assert all(calc(r['g'],r['e'])==r for r in rows)
c300=calc('15876.02','0');assert c300['red']=='711.74'
print(json.dumps({'validated':len(rows),'15876.01':calc('15876.01','1000'),'C300_mutacion2018':c300},indent=2))
