import { describe, expect, it } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import Decimal from 'decimal.js'
import nuevos from './fixtures/trabajo-alquiler-suelo-desconocido-2025.json'
import originales from './fixtures/trabajo-alquiler-ordinario-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { prepararTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/preparar'
import { componerLiquidacionAnual, type EntradaComposicionAnual } from '../lib/dominio/irpf/liquidacion/composicion-anual'
import { MINIMOS_ESTATALES_2025 } from '../lib/dominio/normativa/datos/minimos-autonomicos-2025'
import { igual } from './trabajo-alquiler-suelo-desconocido-2025.oracle'
import { oracle, present } from './trabajo-alquiler-ordinario-2025.oracle'
const decode=Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)
const parseOptions={onExcessProperty:'error'} as const
const resultados=['1865.42','1937.47','1579.53','1819.39']
const previos=['1865.402','1937.45','1579.52211','1819.38211']
const q=(v:Decimal)=>v.toDecimalPlaces(2,Decimal.ROUND_HALF_UP)
const entrada=(p:Effect.Success<ReturnType<typeof prepararTrabajoAlquilerOrdinario2025>>):EntradaComposicionAnual=>({
 hechosAlquilerOpen2025:p.c,inmueblesP4a:p.inm.inmuebles,
 ambito:{anio:2025,comunidadAutonoma:p.c.comunidadAutonoma,contribuyenteId:p.c.contribuyenteId,
  situacionFamiliar:{tipo:'individual',edad:p.c.edad,discapacidad:{_tag:'SinDiscapacidad'},descendientes:[],ascendientes:[]}},
 cotizaciones:{naturaleza:'efectivas',trabajador:p.cotizaciones},precision:80,politica:'decimal-hasta-salida',
 rentasTrabajoAnuales:{integroTrabajo:p.bruto,restoRentas:p.renta},serviciosLaborales:{bruto:p.bruto,netoReducido:p.neto,otrasRentas:p.renta},
 baseGeneral:p.base,baseAhorro:p.cero,basesImponiblesE38:{general:p.base,ahorro:p.cero},
 rentasAntesReducciones:p.neto.plus(p.renta),minimosEstatales:MINIMOS_ESTATALES_2025,deduccionesAutonomicasCentimos:0,
})
describe('Política operativa limitada: ocho referencias más discriminantes, sin peso ni cierre P(H)',()=>{
 for(const [i,row] of nuevos.entries())it.effect(row.id,()=>Effect.gen(function*(){
  const c=decode(row.entrada,parseOptions), r=yield* liquidarIrpfAnualExplicito(c), t=r.rastroOperativo!
  expect(r.cuotaDiferencial.toFixed(2)).toBe(resultados[i])
  expect(r.politicaOpen?.porcentaje.toFixed(2)).toBe('83.33')
  expect(r.politicaOpen?.amortizacion.toFixed(2)).toBe('2499.90')
  expect(igual(r.inmuebles[0]!.amortizacion,{n:2500n,d:1n})).toBe(true)
  expect(t.alquiler.neto.eq(t.alquiler.ingresos.minus(t.alquiler.gastos).minus(t.alquiler.amortizacion))).toBe(true)
  expect(t.base.eq(t.trabajo.neto.plus(t.alquiler.netoReducido))).toBe(true)
  const g=t.gravamenes
  expect(t.cuotaPosterior.eq(g.generalEstatal.minus(g.minimoEstatal).plus(g.generalAutonomico).minus(g.minimoAutonomico))).toBe(true)
  expect(t.diferencial.eq(t.cuotaPosterior.minus(t.retenciones))).toBe(true)
  expect(r.composicion.cuotaPosterior).toBe(t.cuotaPosterior)
  expect(r.politicaOpen).toBe(t.alquiler)
  const lineas=r.rastro!.pasos[0]!.lineasCalculo
  for(const [id,valor] of [['diferencial',r.cuotaDiferencial],['cuota-posterior',r.composicion.cuotaPosterior],
   ['general-estatal',g.generalEstatal],['minimo-estatal',g.minimoEstatal],
   ['general-autonomico',g.generalAutonomico],['minimo-autonomico',g.minimoAutonomico],['base',r.baseImponibleGeneral]] as const)
   expect(lineas.find(l=>l.origen?.siteId===`alquiler.open.${id}`)?.origen?.decimal).toBe(valor.toFixed())
  for(const v of Object.values(g))expect(v.decimalPlaces()).toBeLessThanOrEqual(2)
  // Reconstrucción previa con magnitudes legales: sus esperados207 permanecen por valor.
  const p=yield* prepararTrabajoAlquilerOrdinario2025(c), e=entrada(p)
  const legalNet=new Decimal(8500),legalBase=p.neto.plus(4250)
  const anterior=yield* componerLiquidacionAnual({...e,hechosAlquilerOpen2025:undefined,
   baseGeneral:legalBase,basesImponiblesE38:{general:legalBase,ahorro:p.cero},rentasAntesReducciones:p.neto.plus(legalNet),
   rentasTrabajoAnuales:{integroTrabajo:p.bruto,restoRentas:legalNet},serviciosLaborales:{bruto:p.bruto,netoReducido:p.neto,otrasRentas:legalNet}})
  expect(anterior.cuotaPosterior.minus(r.retenciones).toFixed()).toBe(previos[i])
  const can=yield* liquidarIrpfAnual(c,{modo:'canonico'})
  expect(can.politicaOpen).toBeUndefined()
  expect(can.baseImponibleGeneral.minus(can.rendimientoNetoTrabajo).eq(4250)).toBe(true)
  const sinRet=yield* liquidarIrpfAnualExplicito({...c,retenciones:[]})
  expect(sinRet.cuotaDiferencial.minus(r.cuotaDiferencial).eq(r.retenciones)).toBe(true)
 }))
 for(const row of originales)it.effect('Referencia previa '+row.id,()=>Effect.gen(function*(){
  const c=decode(row.entrada,parseOptions),r=yield* liquidarIrpfAnualExplicito(c)
  expect(r.politicaOpen).toBeUndefined()
  expect(r.cuotaDiferencialPresentada).toBe(present(oracle(c.comunidadAutonoma).diferencial))
  expect(igual(r.inmuebles[0]!.amortizacion,{n:2400n,d:1n})).toBe(true)
 }))
 for(const [nombre,precio,construccion,suelo,porcentaje,amort] of [
  ['199','100000','50001','9999','83.34','2500.20'],
  ['206','100000.20','50000','10000','83.33','2499.90'],
 ] as const)it.effect('Orden de operaciones '+nombre,()=>Effect.gen(function*(){
  const c=decode(nuevos[0]!.entrada,parseOptions),v=c.inmuebles[0]!
  const r=yield* liquidarIrpfAnualExplicito(decode({...c,inmuebles:[{...v,adquisicion:{...v.adquisicion,precio},catastro2025:{...v.catastro2025,construccion,suelo}}]},parseOptions))
  expect(r.politicaOpen?.porcentaje.toFixed(2)).toBe(porcentaje)
  expect(r.politicaOpen?.amortizacion.toFixed(2)).toBe(amort)
  if(nombre==='206')expect(q(q(r.politicaOpen!.costeOperativo).mul('.03')).toFixed(2)).toBe('2499.91')
 }))
 it.effect('Madrid13-v2 conocido conserva el salario propio y la ruta decimal',()=>Effect.gen(function*(){
  const c=decode(nuevos[3]!.entrada,parseOptions),v=c.inmuebles[0]!
  const conocido=decode({...c,inmuebles:[{...v,adquisicion:originales[0]!.entrada.inmuebles[0]!.adquisicion}]},parseOptions)
  const r=yield* liquidarIrpfAnualExplicito(conocido)
  expect(r.politicaOpen).toBeUndefined()
  expect(r.baseImponibleGeneral.toFixed()).toBe('32220')
  // Escalas publicadas: 3388.50 estatal + 2924.78211 autonómica - 4480 retenido.
  expect(r.cuotaDiferencial.toFixed()).toBe('1833.28211')
 }))
 it.effect('Composición rechaza flags con magnitudes o hechos contradictorios',()=>Effect.gen(function*(){
  const p=yield* prepararTrabajoAlquilerOrdinario2025(decode(nuevos[0]!.entrada,parseOptions)),e=entrada(p)
  const valido=yield* componerLiquidacionAnual(e)
  expect(valido.politicaAlquilerOpen2025?.nombre).toBe('open-alquiler-suelo-desconocido-cuatro-gravamenes-2025')
  const cambios:Partial<EntradaComposicionAnual>[]=[
   {baseGeneral:p.base.plus('.01')},{baseAhorro:new Decimal(1)},
   {rentasAntesReducciones:e.rentasAntesReducciones.plus('.01')},{cotizaciones:{naturaleza:'estimadas-perfil-uniforme',trabajador:p.cotizaciones}},
   {cotizaciones:{naturaleza:'efectivas',trabajador:p.cotizaciones.plus('.01')}},{precision:20},
   {politica:'open-empleo-madrid-2025'},{inmueblesP4a:[]},{serviciosLaborales:{bruto:p.bruto,netoReducido:p.neto.plus('.01'),otrasRentas:p.renta}},
   {rentasTrabajoAnuales:{integroTrabajo:p.bruto,restoRentas:p.renta.plus('.01')}},
   {deduccionesAutonomicasCentimos:1},{ambito:{...e.ambito,comunidadAutonoma:'madrid'}},
   {ambito:{...e.ambito,situacionFamiliar:{...e.ambito.situacionFamiliar,edad:41}}},
   {hechosAlquilerOpen2025:decode(originales[0]!.entrada,parseOptions)},
   {hechosAlquilerOpen2025:{...p.c,historia2024:{...p.c.historia2024,construccion:'36000000'}}},
   {inmueblesP4a:[{...p.inm.inmuebles[0]!,amortizacion:{n:1n,d:1n}}]},
   {inmueblesP4a:[{...p.inm.inmuebles[0]!,netoReducido:{n:1n,d:1n}}]},
   {inmueblesP4a:[{...p.inm.inmuebles[0]!,imputacion:{n:1n,d:1n}}]},
   {minimosEstatales:{...MINIMOS_ESTATALES_2025,contribuyente:{...MINIMOS_ESTATALES_2025.contribuyente,general:new Decimal(1)}}},
  ]
  for(const cambio of cambios){const fallo=yield* Effect.flip(componerLiquidacionAnual({...e,...cambio}));expect(fallo._tag).toBe('ResultadoNoSoportado')}
 }))
 it.effect('No resuelve centésimos ambiguos del 50% mediante redondeo prematuro',()=>Effect.gen(function*(){
  const c=decode(nuevos[0]!.entrada,parseOptions),v=c.inmuebles[0]!
  const ambiguo=decode({...c,inmuebles:[{...v,gastos:v.gastos.map(g=>({...g,importe:'1000.01',totalFactura:'1000.01'}))}]},parseOptions)
  const error=yield* Effect.flip(liquidarIrpfAnualExplicito(ambiguo))
  expect(error._tag).toBe('RechazoP4a');expect(error.motivo).toContain('frontera RNR/50%')
  const previa=yield* liquidarIrpfAnual(ambiguo,{modo:'canonico'})
  expect(previa.politicaOpen).toBeUndefined()
 }))
})
