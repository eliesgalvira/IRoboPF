import { describe, expect, it } from '@effect/vitest'
import { Effect, Result, Schema } from 'effect'
import entradas from './fixtures/trabajo-alquiler-ordinario-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { oracle, present, equalRational } from './trabajo-alquiler-ordinario-2025.oracle'
const canonical=(c:CasoTrabajoAlquilerOrdinario2025)=>liquidarIrpfAnual(c,{modo:'canonico'})
const apis=[canonical,liquidarIrpfAnualExplicito] as const
const decoded=(x:(typeof entradas)[number]['entrada'])=>Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)(x,{onExcessProperty:'error'})
describe('Cuatro slots mixtos ordinarios; captura y aceptación pendientes',()=>{
 for(const row of entradas)it.effect(row.id,()=>Effect.gen(function*(){
  const c=decoded(row.entrada), o=oracle(c.comunidadAutonoma)
  const a=yield* canonical(c), b=yield* liquidarIrpfAnualExplicito(c)
  // El oráculo original corresponde sólo a cotizaciones efectivas.
  // La revisión independiente comprueba la rama canónica con SS uniforme.
  for(const r of [b]){
   expect(r.rendimientoNetoTrabajo.toFixed()).toBe('26050')
   expect(r.baseImponibleGeneral.toFixed(2)).toBe(present(o.base))
   const v=r.inmuebles[0]!
   expect(equalRational(v.amortizacion,o.amortizacion)).toBe(true)
   expect(equalRational(v.neto,o.neto)).toBe(true)
   expect(equalRational(v.netoReducido,o.rnr)).toBe(true)
   expect(r.composicion.cuotaEstatalDespuesMinimo.toFixed(2)).toBe(present(o.cuotaEstatal))
   expect(r.composicion.cuotaAutonomicaGeneralDespuesMinimo.toFixed(2)).toBe(present(o.cuotaAutonomica))
   expect(r.cuotaDiferencial.toFixed(2)).toBe(present(o.diferencial))
   expect(r.cuotaDiferencialPresentada).toBe(present(o.diferencial))
   expect(r.composicion.deduccionesTerritoriales2025).toBeUndefined()
   expect(r.aceptacionFiscal).toBe('pendiente')
   expect(v.inmueble).toEqual(c.inmuebles[0])
  }
  const sinRet=yield* canonical({...c,retenciones:[]})
  expect(sinRet.baseImponibleGeneral.eq(a.baseImponibleGeneral)).toBe(true)
  expect(sinRet.cuotaDiferencial.minus(a.cuotaDiferencial).toFixed()).toBe('4200')
 }))
 it.effect('Ambas API rechazan hechos adversos y escalares en cada territorio',()=>Effect.gen(function*(){
  for(const row of entradas){
   const c=decoded(row.entrada), v=c.inmuebles[0]!
   const bad:unknown[]=[
    {...c,baseGeneral:'30350'}, {...c,cuota:'100'}, {...c,deduccion:'100'},
    {...c,deduccionesTerritoriales2025:{solicitudes:[]}},
    {...c,modalidad:'conjunta'}, {...c,ejercicio:2024}, {...c,comunidadAutonoma:'aragon'},
    {...c,inmuebles:[v,v]}, {...c,trabajo:{...c.trabajo,rendimientos:[]}},
    {...c,conciliacion:{...c.conciliacion,contribuyenteId:'ajeno'}},
    {...c,censoInmobiliario:{...c.censoInmobiliario,inmuebles:['ajeno']}},
    {...c,retenciones:c.retenciones.map(r=>({...r,contribuyenteId:'ajeno'}))},
    {...c,retenciones:c.retenciones.map(r=>({...r,id:c.trabajo.rendimientos[0]!.id}))},
    {...c,retenciones:c.retenciones.map(r=>({...r,fecha:'2026-01-01'}))},
    {...c,declaracion:{...c.declaracion,procedimientoPrevio:'comprobacion'}},
    {...c,inmuebles:[{...v,titular:'ajeno'}]},
    {...c,inmuebles:[{...v,titulares:[v.titular,'otro']}]},
    {...c,inmuebles:[{...v,contrato:{...v.contrato,desde:'2025-01-01'}}]},
    {...c,inmuebles:[{...v,contrato:{...v.contrato,firma:'2023-05-26'}}]},
    {...c,inmuebles:[{...v,usosDesdeAdquisicion:v.usosDesdeAdquisicion.slice(1)}]},
    {...c,inmuebles:[{...v,gastos:v.gastos.map(g=>({...g,importe:'13000',totalFactura:'13000'}))}]},
    {...c,inmuebles:[{...v,gastos:v.gastos.map(g=>({...g,clase:'mejora'}))}]},
    {...c,inmuebles:[{...v,exigibilidades:[...v.exigibilidades,v.exigibilidades[0]]}]},
    {...c,inmuebles:[{...v,contrato:{...v.contrato,alquilerSocial:true}}]},
    {...c,historia2024:{...c.historia2024,construccion:'900000'}},
   ]
   for(const raw of bad)for(const api of apis){
    // @ts-expect-error Entrada hostil deliberadamente sin decodificar: debe rechazarla la API pública.
    const error=yield* Effect.flip(api(raw))
    expect(error._tag).toBe('RechazoP4a')
   }
   for(const extra of [{neto:'8600'},{retenciones:[{...c.retenciones[0],ejercicio:2024}]}])
    expect(Result.isFailure(Schema.decodeUnknownResult(CasoTrabajoAlquilerOrdinario2025)({...c,...extra},{onExcessProperty:'error'}))).toBe(true)
  }
 }))
 it.effect('Modo estimado no habilita salario efectivo',()=>Effect.gen(function*(){
  const c=decoded(entradas[0]!.entrada)
  // @ts-expect-error Modo ajeno al contrato para comprobar el rechazo runtime público.
  const error=yield* Effect.flip(liquidarIrpfAnual(c,{modo:'estimacion-analitica'}))
  expect(error._tag).toBe('RechazoP4a')
 }))
})
