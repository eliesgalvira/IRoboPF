from fractions import Fraction as F
# LIRPF63/74: escala menos mínimo estatal5550 y gallego5789.
# Tipos medios expresados con dos decimales por defecto; art63.2 y74.2.
def escala(x,limites,tipos):
 total=F(0);anterior=F(0)
 for limite,tipo in zip(limites,tipos):
  hasta=min(x,F(limite));total+=max(F(0),hasta-anterior)*F(tipo)/100;anterior=F(limite)
 return total
def rat(x):return {'numeradorEuros':str(x.numerator),'divisor':str(x.denominator)}
def oracle(s):
 x=F(s);e= lambda v:escala(v,['12450','20200','35200','60000','300000','999999999999'],['9.5','12','15','18.5','22.5','24.5'])
 # Art4 DL1/2011: cuotas de entrada literales de la tabla BOE, no suma de tramos.
 def a(v):
  filas=[('0','0','9'),('12985.35','1168.68','11.65'),('21068.60','2110.38','14.9'),('35200','4215.96','18.4'),('60000','8779.16','22.5')]
  b,q,t=next(row for row in reversed(filas) if v>=F(row[0]))
  return F(q)+(v-F(b))*F(t)/100
 qe=max(F(0),e(x)-e(min(x,F(5550))));qa=max(F(0),a(x)-a(min(x,F(5789))))
 te=(qe*10000//x);ta=(qa*10000//x);g=x*(te+ta)/10000;ap=min(g,qa)
 return dict(importe=s,base=rat(x),qe=rat(qe),qa=rat(qa),te=f'{te//100}.{te%100:02d}',ta=f'{ta//100}.{ta%100:02d}',generado=rat(g),aplicado=rat(ap),pendiente=rat(g-ap),con=int((qe+qa-ap)*100+F(1,2)),sin=int((qe+qa)*100+F(1,2)))
