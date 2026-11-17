import { describe, expect, it } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import Decimal from 'decimal.js'
import casos from './fixtures/trabajo-alquiler-suelo-desconocido-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { prepararTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/preparar'
import { seleccionarPoliticaAlquilerOpen2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/seleccion-open'
import { componerLiquidacionAnual, type EntradaComposicionAnual } from '../lib/dominio/irpf/liquidacion/composicion-anual'
import { MINIMOS_ESTATALES_2025 } from '../lib/dominio/normativa/datos/minimos-autonomicos-2025'

// Controles de contrato y conciliación; no son nuevas observaciones oficiales.
const decode = Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)
describe('Revisión independiente: identidad de contenido y conciliación operativa', () => {
 for (const row of casos) it.effect(row.id, () => Effect.gen(function* () {
  const p = yield* prepararTrabajoAlquilerOrdinario2025(decode(row.entrada, { onExcessProperty: 'error' }))
  const e: EntradaComposicionAnual = {
   hechosAlquilerOpen2025: p.c, inmueblesP4a: p.inm.inmuebles,
   ambito: { anio: 2025, comunidadAutonoma: p.c.comunidadAutonoma, contribuyenteId: p.c.contribuyenteId,
    situacionFamiliar: { tipo: 'individual', edad: p.c.edad, discapacidad: { _tag: 'SinDiscapacidad' }, descendientes: [], ascendientes: [] } },
   cotizaciones: { naturaleza: 'efectivas', trabajador: p.cotizaciones }, precision: 80, politica: 'decimal-hasta-salida',
   baseGeneral: p.base, baseAhorro: p.cero, basesImponiblesE38: { general: p.base, ahorro: p.cero },
   rentasAntesReducciones: p.neto.plus(p.renta), minimosEstatales: MINIMOS_ESTATALES_2025,
   rentasTrabajoAnuales: { integroTrabajo: p.bruto, restoRentas: p.renta },
   serviciosLaborales: { bruto: p.bruto, netoReducido: p.neto, otrasRentas: p.renta }, deduccionesAutonomicasCentimos: 0,
  }
  const v = p.inm.inmuebles[0]!
  // Un clon pierde identidad de objeto pero conserva los hechos y debe admitirse.
  const cloned = { ...v, inmueble: structuredClone(v.inmueble), seguimiento: [...v.seguimiento] }
  const admitted = yield* seleccionarPoliticaAlquilerOpen2025({ ...e, inmueblesP4a: [cloned] })
  expect(admitted.amortizacion.eq(p.politicaOpen!.amortizacion)).toBe(true)
  const mutations = [
   { ...cloned, inmueble: { ...cloned.inmueble, catastro: 'referencia-distinta' } },
   { ...cloned, inmueble: { ...cloned.inmueble, adquisicion: { ...cloned.inmueble.adquisicion, escritura: 'otra-escritura' } } },
   { ...cloned, inmueble: { ...cloned.inmueble, contrato: { ...cloned.inmueble.contrato, documento: 'otro-contrato' } } },
   { ...cloned, inmueble: { ...cloned.inmueble, gastos: cloned.inmueble.gastos.map(g => ({ ...g, prestadorNif: 'otro-prestador' })) } },
   { ...cloned, seguimiento: ['rastro-inyectado'] },
   { ...cloned, diasAlquilados: 364 },
  ]
  for (const x of mutations) {
   const failure = yield* Effect.flip(seleccionarPoliticaAlquilerOpen2025({ ...e, inmueblesP4a: [x] }))
   expect(failure._tag).toBe('RechazoP4a')
  }
  for (const key of ['integro','gastosLimitados','excesoNoAplicado','otrosGastos','amortizacion','neto','reduccion','netoReducido','imputacion'] as const) {
   const failure = yield* Effect.flip(seleccionarPoliticaAlquilerOpen2025({ ...e, inmueblesP4a: [{ ...v, [key]: { n: v[key].n + v[key].d, d: v[key].d } }] }))
   expect(failure._tag).toBe('RechazoP4a')
  }
  const r = yield* componerLiquidacionAnual(e)
  const pairs = [
   [r.desgloseCuotaIntegraGeneralEstatal, r.cuotaIntegraGeneralEstatal],
   [r.desgloseCuotaIntegraGeneralAutonomica, r.cuotaIntegraGeneralAutonomica],
   [r.desgloseCuotaMinimoPersonalEstatal, r.cuotaMinimoPersonalEstatal],
   [r.desgloseCuotaMinimoPersonalAutonomica, r.cuotaMinimoPersonalAutonomica],
  ] as const
  for (const [lines, total] of pairs) {
   const raw = lines.reduce((a, line) => a.plus(line.cuota), new Decimal(0))
   expect(raw.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).eq(total)).toBe(true)
  }
 }))
})
