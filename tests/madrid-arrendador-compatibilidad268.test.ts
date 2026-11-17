import { describe, expect, it } from '@effect/vitest'
import { Effect, Result, Schema } from 'effect'
import casos from './fixtures/trabajo-alquiler-suelo-desconocido-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { SolicitudMadridArrendadorDerivada } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/madrid-arrendador'

describe('Compatibilidad del rastro y formato interno derivado', () => {
 for (const caso of casos) it.effect('Rastro anterior sin extensión: '+caso.id,()=>Effect.gen(function*(){
  const c=Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)(caso.entrada,{onExcessProperty:'error'})
  const r=yield* liquidarIrpfAnualExplicito(c)
  expect(r.rastroOperativo).not.toHaveProperty('deducciones')
  expect(r.rastroOperativo).not.toHaveProperty('deduccionesAutonomicasAplicadas')
  expect(r.rastro!.pasos[0]!.lineasCalculo.some(l=>l.origen?.siteId==='alquiler.open.deduccion-autonomica')).toBe(false)
 }))
 it('No relaja campos prohibidos de F ni recibe auxiliares libres',()=>{
  const solicitud={lote:'F-ampliado',codigo:'madrid_gastos_arrendamiento_viviendas',hechos:{viviendas:[],contratos:[],pagos:[]}}
  const decode=Schema.decodeUnknownResult(SolicitudMadridArrendadorDerivada)
  for(const campo of ['bases','liquidableGeneralEUR','liquidableAhorroEUR','minimoPersonalFamiliarEUR']) {
   expect(Result.isFailure(decode({solicitudes:[{...solicitud,hechos:{...solicitud.hechos,[campo]:'100'}}]},{onExcessProperty:'error'}))).toBe(true)
  }
  expect(Result.isFailure(decode({solicitudes:[solicitud],donativosEstatales2025:{}},{onExcessProperty:'error'}))).toBe(true)
  expect(Result.isFailure(decode({solicitudes:[{...solicitud,auxiliares:{}}]},{onExcessProperty:'error'}))).toBe(true)
 })
})
