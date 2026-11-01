"""Oracle de prueba racional; no importa ni ejecuta el motor ni su intérprete.
Solo genera entradas sintéticas y expectativas estáticas para Vitest.
Reglas y reservas: INFORME.md y fuentes.json. Python estándar, sin dependencias.
"""
from fractions import Fraction as F
from decimal import Decimal, localcontext, ROUND_HALF_UP
from pathlib import Path
import json

OUT = Path.cwd() / 'docs/procedencia/implementaciones/redondeo-salarial-open'

def decimal(x):
    with localcontext() as ctx:
        ctx.prec = 80
        return format(Decimal(x.numerator) / Decimal(x.denominator), 'f').rstrip('0').rstrip('.') if x.denominator != 1 else str(x.numerator)

def centimos(x):
    with localcontext() as ctx:
        ctx.prec = 80
        return format((Decimal(x.numerator)/Decimal(x.denominator)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP), '.2f')

def rendimiento(id, bruto, ss, sindicato='0', colegio='0', defensa='0'):
    return dict(id=id, clase='empleo-laboral', integro=bruto,
        cotizaciones=dict(clase='efectivas', seguridadSocial=ss, derechosPasivos='0', colegiosHuerfanos='0'),
        sindicato=dict(importe=sindicato, satisfecho='si'),
        colegio=dict(importe=colegio, satisfecho='si', obligatorio='si', finesEsenciales='si'),
        defensa=dict(importe=defensa, satisfecho='si', litigioDirectoPagador='si'))

def caso(nombre, rendimientos, retenciones):
    entrada=dict(ejercicio=2025, comunidadAutonoma='madrid', edad=40, modalidad='individual', residenciaTodoElAnio=True,
        devengo='2025-12-31', otrasRentas='ninguna', familiaresConDerechoMinimo='ninguno', discapacidad='ninguna',
        reduccionesBase='ninguna', saldosAnteriores='ninguno', deducciones='solo-da61-si-procede', rentasExtranjeras='ninguna', especialidades='ninguna',
        perfil='solo-trabajo', conciliacion=dict(ejercicio=2025, estado='totales-anuales-sin-duplicados', procedencia=['sintetico:datos-fiscales-2025', 'sintetico:certificados-pagadores']),
        trabajo=dict(ejercicio=2025, territorio='comun', reduccionesArt18='ninguna', movilidad='ninguna', discapacidadActiva='ninguna', rendimientos=rendimientos),
        retenciones=[dict(operacionId=f'ret-{i}', procedencia=f'sintetico:certificado-{i}', ejercicio=2025, importe=v, efectiva=True) for i,v in enumerate(retenciones)])
    bruto=sum(F(r['integro']) for r in rendimientos)
    ae=sum(F(r['cotizaciones']['seguridadSocial'])+F(r['sindicato']['importe']) for r in rendimientos)+min(500,sum(F(r['colegio']['importe']) for r in rendimientos))+min(300,sum(F(r['defensa']['importe']) for r in rendimientos))
    previo=bruto-ae; gasto=min(2000,max(0,previo)); art19=previo-gasto
    if previo<=14852: teorica=F(7302)
    elif previo<=F('17673.52'): teorica=7302-F('1.75')*(previo-14852)
    elif previo<F('19747.50'): teorica=F('2364.34')-F('1.14')*(previo-F('17673.52'))
    else: teorica=F(0)
    reduccion=F(centimos(min(max(0,art19),teorica))); neto=art19-reduccion; base=max(0,neto)
    # Estatal: integración marginal directa del art63, sin usar helpers del motor.
    def estatal(b):
        cortes=[0,12450,20200,35200,60000,300000]; tipos=['.095','.12','.15','.185','.225','.245']
        return sum(max(0,min(b, F(cortes[i+1]) if i+1<len(cortes) else b)-c)*F(tipos[i]) for i,c in enumerate(cortes))
    # Madrid: cuotas fijas PUBLICADAS, no reconstruidas acumulando tramos.
    def madrid(b):
        filas=[('0','0','.085'),('13362.22','1135.79','.107'),('19004.63','1739.53','.128'),('35425.68','3841.42','.174'),('57320.40','7651.10','.205')]
        c,q,t=next((F(c),F(q),F(t)) for c,q,t in reversed(filas) if b>=F(c))
        return q+(b-c)*t
    ce=F(centimos(estatal(base)))-F(centimos(estatal(min(base,5550)))); ca=F(centimos(madrid(base)))-F(centimos(madrid(min(base,F('5956.65')))))
    liquida=ce+ca; da=min(max(0,340-max(0,bruto-16576)*F('.2')) if bruto else 0,liquida)
    da=F(centimos(da)); posterior=liquida-da; ret=sum(map(F,retenciones)); diferencial=posterior-ret
    sufijos=['trabajo.integro','trabajo.gastos-a-e','trabajo.gasto-f','trabajo.art19','trabajo.art20','big','blg','cuota.estatal','cuota.autonomica','cuota.liquida-legal','da61','cuota.posterior','retenciones','pagos','diferencial']
    valores=[bruto,ae,gasto,art19,reduccion,neto,neto,ce,ca,liquida,da,posterior,ret,F(0),diferencial]
    salida=dict(rendimientoNetoReducido=decimal(neto),baseImponibleGeneral=decimal(neto),baseLiquidableGeneral=decimal(neto),baseLiquidableAhorro='0',reduccionArt20=decimal(reduccion),cuotaLiquidaLegal=decimal(liquida),deduccionTrabajo=decimal(da),cuotaPosterior=decimal(posterior),retenciones=decimal(ret),pagosFraccionados='0',cuotaDiferencial=decimal(diferencial),cuotaDiferencialPresentada=centimos(diferencial))
    return dict(nombre=nombre,entrada=entrada,esperado=salida,lineas=[dict(siteId='anual.explicito.'+s,decimal=decimal(v),presentado=centimos(v)+' euros') for s,v in zip(sufijos,valores)],control=dict(minimoEstatal='5550',minimoMadrid='5956.65',previoArt20=decimal(previo)))

casos=[caso('ingresar-dos-pagadores-limites-anuales',[rendimiento('a','18000','1200','60','400','200'),rendimiento('b','12000','800','40','200','200')],['1500','1500']),caso('devolver-da61-ss-efectiva',[rendimiento('a','17576.01','1000')],['1000']),caso('cero',[rendimiento('a','0','0')],[]),caso('perdida',[rendimiento('a','0','100')],[]),caso('deduccion-limitada-por-cuota',[rendimiento('a','16000','1000')],['50'])]
casos.append(caso('base-entre-minimos',[rendimiento('a','15900','1000')],['50']))
for frontera in ['14852','17673.52','19747.50']:
    for delta in ['-.01','0','.01']:
        neto=F(frontera)+F(delta)
        casos.append(caso('art20-'+decimal(neto),[rendimiento('a',decimal(neto+1000),'1000')],['100']))
for frontera in ['16576','18276']:
    for delta in ['-.01','0','.01']:
        bruto=F(frontera)+F(delta)
        casos.append(caso('da61-'+decimal(bruto),[rendimiento('a',decimal(bruto),'1000')],['100']))
# Umbrales de escalas y mínimos, después del gasto general; art20 ya nulo.
for base in ['19004.62','19004.63','19004.64','20200','35425.68','57320.40','60000','300000','300000.01']:
    casos.append(caso('escala-'+base,[rendimiento('a',decimal(F(base)+3000),'1000')],['100']))
(OUT/'recorridos.json').write_text(json.dumps(casos,ensure_ascii=False,indent=2)+'\n')
print(len(casos),'casos generados')
for c in casos[:5]: print(c['nombre'],c['esperado'])
