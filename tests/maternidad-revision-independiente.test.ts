import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import Decimal from 'decimal.js'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { hechos81 } from './maternidad-guarderia-fixtures'
import { clasica, explicita, censo } from './productores-anuales-fixtures'

function caso(h = hechos81(), donativo = censo()) {
 const c=clasica(h),e=explicita(h)
 if (c.derechosMinimos === undefined || e.derechosMinimos === undefined) throw new Error('mínimos fixture')
 const solicitudes={solicitudes:[],donativosEstatales2025:donativo}
 return {
  clasica:{...c,comunidadAutonoma:'murcia' as const,derechosMinimos:{...c.derechosMinimos,territorio:'murcia' as const},deduccionesTerritoriales2025:solicitudes},
  explicita:{...e,comunidadAutonoma:'murcia' as const,derechosMinimos:{...e.derechosMinimos,territorio:'murcia' as const},deduccionesTerritoriales2025:solicitudes},
 }
}
function run(api:'clasica'|'explicita',h=hechos81(),d=censo()) {
 const c=caso(h,d)
 return api==='clasica'?Effect.runSync(liquidarIrpfAnual(c.clasica,{modo:'canonico'})):Effect.runSync(liquidarIrpfAnualExplicito(c.explicita))
}
function fail(api:'clasica'|'explicita',h=hechos81(),d=censo()) {
 const c=caso(h,d)
 return api==='clasica'?Effect.runSync(Effect.flip(liquidarIrpfAnual(c.clasica,{modo:'canonico'}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(c.explicita)))
}
function rat(x:{numeradorEuros:string,divisor:string}|undefined,n:bigint,d=1n){if(x===undefined)throw new Error('libro ausente');expect(BigInt(x.numeradorEuros)*d).toBe(n*BigInt(x.divisor))}
for(const api of ['clasica','explicita'] as const) describe(api,()=>{
 it.each([1,2,3,4,6,8,9,10,11,12])('meses completos %i: racional exacto y maternidad independiente',meses=>{
  const r=run(api,hechos81(meses,120000));rat(r.maternidad2025?.incremento,BigInt(1000*meses),12n);rat(r.maternidad2025?.maternidad,1200n)
 })
 it('ayuda deja 40 EUR netos, límite anual por niño',()=>{
  const h=hechos81(1,10000),n=h.hijos[0];rat(run(api,{...h,hijos:[{...n,ayudas:[{id:'ayuda',beneficiario:'s-1',fechaCobro:'2025-05-01',programa:'ordinaria',atribucion:'nominal',importe:'60',facturas:[{id:'factura1',importe:'60'}]}]}]}).maternidad2025?.incremento,40n)
 })
 it('anticipo140 tras pagos suma exactamente 100',()=>{
  const h=hechos81(),n=h.hijos[0],a=run(api,h),b=run(api,{...h,hijos:[{...n,anticipos140:[{id:'cobro140',beneficiaria:'s-1',fechaCobro:'2025-03-01',periodo:'2025-02-01',importe:'100'}]}]})
  const euros=(r:typeof a)=>'cuotaDiferencialCentimos' in r?new Decimal(r.cuotaDiferencialCentimos).div(100):new Decimal(r.cuotaDiferencial)
  expect(euros(b).minus(euros(a)).toFixed()).toBe('100')
 })
 it.each(['pago','factura','empresa'] as const)('rechaza doble uso nominal %s',clase=>{
  const h=hechos81(),d=censo(),op=d.operaciones68_3[0],n=h.hijos[0]
  const id=clase==='factura'?'factura1':clase==='pago'?'pago1':'pagoEmpresa'
  const nuevo=clase!=='empresa'?h:{...h,hijos:[{...n,facturas:n.facturas.map((f,i)=>i!==0?f:{...f,pagosEmpresa:[{id,fecha:'2025-01-31',empresa:'empresa1',empleado:'s-1',importe:'10',forma:'contratacion_directa_custodia' as const,contratoServicio:'directo',nomina:'nomina'}]})}]}
  const error=fail(api,nuevo,{...d,operaciones68_3:[{...op,pago:clase==='factura'?{...op.pago,documento:id}:{...op.pago,id}}]});expect(error.motivo).toMatch(/reutilizad/)
 })
 it.each(['calendario','fecha','censo','ayuda','pago'] as const)('rechaza inconsistencia %s',tipo=>{
  const h=hechos81(),n=h.hijos[0]
  const hijo=tipo==='calendario'?{...n,calendario:n.calendario.slice(1)}:tipo==='fecha'?{...n,facturas:n.facturas.map((f,i)=>i!==0?f:{...f,pagos:f.pagos.map(p=>({...p,fecha:'2025-02-29'}))})}:tipo==='pago'?{...n,facturas:[...n.facturas,n.facturas[0]]}:tipo==='ayuda'?{...n,ayudas:[{id:'ayuda',beneficiario:'s-1',fechaCobro:'2025-01-01',programa:'ordinaria' as const,atribucion:'nominal' as const,importe:'101',facturas:[{id:'factura1',importe:'101'}]}]}:n
  expect(fail(api,{...h,hijos:tipo==='censo'?[]:[hijo]})._tag).toBe('ResultadoNoSoportado')
 })
 it.each(Array.from({length:12},(_,i)=>i+1))('CAPI mes %i: resta100 y1000/12',mes=>{
  const h=hechos81(),n=h.hijos[0],fecha=`2025-${String(mes).padStart(2,'0')}-15`
  const r=run(api,{...h,hijos:[{...n,calendario:n.calendario.map(m=>m.mes!==mes?m:{...m,complementoInfancia:[{id:'capi',perceptor:'s-1',resolucion:'capi',fechaCobro:fecha,importe:'100'}]})}]})
  rat(r.maternidad2025?.maternidad,1100n);rat(r.maternidad2025?.incremento,2750n,3n)
 })
 it('CyL: ayudaordinaria100 resta base e incremento500 de una cuota',()=>{
  const h=hechos81(6,150000),n=h.hijos[0],conAyuda={...h,hijos:[{...n,ayudas:[{id:'ayuda',beneficiario:'s-1',fechaCobro:'2025-05-01',programa:'ordinaria' as const,atribucion:'nominal' as const,importe:'100',facturas:[{id:'factura1',importe:'100'}]}]}]}
  const solicitudes={solicitudes:[{lote:'CYL81' as const,codigo:'cyl_cuidado_hijos_menores' as const,hechos:{hijo:'s-2',eleccion:'centro' as const}}]}
  const r=api==='clasica'?Effect.runSync(liquidarIrpfAnual({...clasica(conAyuda),deduccionesTerritoriales2025:solicitudes},{modo:'canonico'})):Effect.runSync(liquidarIrpfAnualExplicito({...explicita(conAyuda),deduccionesTerritoriales2025:solicitudes}))
  rat(r.maternidad2025?.incremento,500n);rat(r.deduccionesTerritoriales2025?.total,820n)
 })
 it('dos hijos: límites individuales y censo completo, total2400+2000',()=>{
  const h=hechos81(),n=h.hijos[0],segundo={...n,id:'s-3',facturas:n.facturas.map(f=>({...f,id:f.id+'-2',pagos:f.pagos.map(p=>({...p,id:p.id+'-2'}))}))}
  const c=caso({...h,hijos:[n,segundo]})
  const cc={...c.clasica,derechosMinimos:{...c.clasica.derechosMinimos,descendientes:[...c.clasica.derechosMinimos.descendientes,{...c.clasica.derechosMinimos.descendientes[0],sujetoId:'s-3'}]}}
  const ee={...c.explicita,derechosMinimos:{...c.explicita.derechosMinimos,descendientes:[...c.explicita.derechosMinimos.descendientes,{...c.explicita.derechosMinimos.descendientes[0],sujetoId:'s-3'}]}}
  const r=api==='clasica'?Effect.runSync(liquidarIrpfAnual(cc,{modo:'canonico'})):Effect.runSync(liquidarIrpfAnualExplicito(ee))
  rat(r.maternidad2025?.maternidad,2400n);rat(r.maternidad2025?.incremento,2000n)
 })
 it.skip('H1: gasto posterior al inicio escolar no financia incremento enero-agosto',()=>{
  const h=hechos81(),n=h.hijos[0],nacimiento='2022-01-01'
  const c=caso({...h,hijos:[{...n,nacimiento,segundoCiclo:{calendario:'ordinario_septiembre2025',inicio:'2025-09-08',referencia:'calendario'},facturas:n.facturas.map(f=>({...f,pagos:f.pagos.map(p=>({...p,importe:f.mes<=8?'0.01':'1000'}))}))}]})
  const cc={...c.clasica,derechosMinimos:{...c.clasica.derechosMinimos,descendientes:c.clasica.derechosMinimos.descendientes.map(p=>({...p,fechaNacimiento:nacimiento,edadDevengo:3}))}}
  const ee={...c.explicita,derechosMinimos:{...c.explicita.derechosMinimos,descendientes:c.explicita.derechosMinimos.descendientes.map(p=>({...p,fechaNacimiento:nacimiento,edadDevengo:3}))}}
  const r=api==='clasica'?Effect.runSync(liquidarIrpfAnual(cc,{modo:'canonico'})):Effect.runSync(liquidarIrpfAnualExplicito(ee))
  rat(r.maternidad2025?.incremento,8n,100n)
 })
 it('H2: etiquetas coincidentes de operaciones distintas no eliminan 2420 EUR',()=>{
  const d=censo(),op=d.operaciones68_3[0]
  // Transferencia300 del1junio a fundación; pago guardería100 del31enero: hechos distintos.
  const nuevo={...d,operaciones68_3:[{...op,operacionId:'pago1',pago:{...op.pago,operacionId:'pago1'},certificado:{...op.certificado,operacionId:'pago1'}}]}
  rat(run(api,hechos81(),nuevo).maternidad2025?.incremento,1000n)
 })
})
