import { describe, expect, it } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import casos from './fixtures/alquiler-prospectivo-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'

describe('Tres predicciones previas de alquiler: regresión separada de la muestra original', () => {
  for (const caso of casos) it.effect(caso.id, () => Effect.gen(function* () {
    const entrada = Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)(caso.entrada, { onExcessProperty: 'error' })
    const r = yield* liquidarIrpfAnualExplicito(entrada)
    const esperado = caso.referenciaPrevia
    expect(r.cuotaDiferencial.eq(esperado.diferencial)).toBe(true)
    expect(r.cuotaDiferencialPresentada).toBe(esperado.diferencial)
    expect(r.baseImponibleGeneral.eq(esperado.base)).toBe(true)
    expect(r.rendimientoNetoTrabajo.eq(esperado.trabajo)).toBe(true)
    expect(r.retenciones.eq(esperado.retenciones)).toBe(true)
    expect(r.politicaOpen?.porcentaje.eq(esperado.porcentaje)).toBe(true)
    expect(r.politicaOpen?.amortizacion.eq(esperado.amortizacion)).toBe(true)
    expect(r.politicaOpen?.netoReducido.eq(esperado.rnr)).toBe(true)
    expect(r.composicion.deduccionesAutonomicasAplicadas.eq(esperado.deduccionMadrid)).toBe(true)
    expect(r.rastroOperativo).toBeDefined()
    if (r.rastroOperativo === undefined) throw new Error('Rastro operativo ausente')
    const g = r.rastroOperativo.gravamenes
    expect(g.generalEstatal.eq(esperado.gravamenes.generalEstatal)).toBe(true)
    expect(g.minimoEstatal.eq(esperado.gravamenes.minimoEstatal)).toBe(true)
    expect(g.generalAutonomico.eq(esperado.gravamenes.generalAutonomico)).toBe(true)
    expect(g.minimoAutonomico.eq(esperado.gravamenes.minimoAutonomico)).toBe(true)
    expect(r.rastroOperativo.diferencial.eq(esperado.diferencial)).toBe(true)
  }))
})
