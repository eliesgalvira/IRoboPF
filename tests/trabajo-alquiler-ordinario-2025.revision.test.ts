// Controles independientes conservados tras integrar el candidato.
import { describe, expect, it } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import entradas from './fixtures/trabajo-alquiler-ordinario-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'

const decoded = (x: (typeof entradas)[number]['entrada']) => Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)(x, { onExcessProperty: 'error' })
const canonical = (c: CasoTrabajoAlquilerOrdinario2025) => liquidarIrpfAnual(c, { modo: 'canonico' })
// Expectativas de contrato: canónica con perfil uniforme; explícita con SS efectiva.
// Estos literales se deducen en papel, sin importar el oráculo del candidato.
const diferenciales = {
  asturias: { canonica: '1881.64', explicita: '1879.90' },
  andalucia: { canonica: '1954.25', explicita: '1952.45' },
  madrid: { canonica: '1595.09', explicita: '1593.42' },
} as const

describe('Revisión estática: contratos de API y guardas mixtas', () => {
  for (const row of entradas) {
    it.effect(`${row.id}: SS por API y hechos inmobiliarios intactos`, () => Effect.gen(function* () {
      const c = decoded(row.entrada)
      const a = yield* canonical(c)
      const b = yield* liquidarIrpfAnualExplicito(c)
      expect(a.composicion.cotizaciones.naturaleza).toBe('estimadas-perfil-uniforme')
      expect(a.composicion.cotizaciones.trabajador.toFixed(2)).toBe('1944.00')
      expect(b.composicion.cotizaciones.naturaleza).toBe('efectivas')
      expect(b.composicion.cotizaciones.trabajador.toFixed(2)).toBe('1950.00')
      expect(a.rendimientoNetoTrabajo.toFixed(2)).toBe('26056.00')
      expect(b.rendimientoNetoTrabajo.toFixed(2)).toBe('26050.00')
      expect(a.baseImponibleGeneral.toFixed(2)).toBe('30356.00')
      expect(b.baseImponibleGeneral.toFixed(2)).toBe('30350.00')
      expect(a.cuotaDiferencial.toFixed(2)).toBe(diferenciales[c.comunidadAutonoma].canonica)
      expect(b.cuotaDiferencial.toFixed(2)).toBe(diferenciales[c.comunidadAutonoma].explicita)
      for (const r of [a, b]) {
        expect(r.inmuebles[0]!.inmueble).toEqual(c.inmuebles[0])
        expect(r.retenciones.toFixed(2)).toBe('4200.00')
        expect(r.inmuebles[0]!.regimen).toBe('art23-50')
      }
      for (const api of [canonical, liquidarIrpfAnualExplicito]) {
        const conRet = yield* api(c)
        const sinRet = yield* api({ ...c, retenciones: [] })
        expect(sinRet.cuotaDiferencial.minus(conRet.cuotaDiferencial).toFixed(2)).toBe('4200.00')
      }
    }))
    it.effect(`${row.id}: renta anterior a reducción discrimina art20 y DA61`, () => Effect.gen(function* () {
      const c = decoded(row.entrada)
      // Vector derivado; no reemplaza ninguno de los cuatro hechos originales.
      const bajo = { ...c, trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, integro: '17000.00' })) } }
      const a = yield* canonical(bajo)
      const b = yield* liquidarIrpfAnualExplicito(bajo)
      expect(a.baseImponibleGeneral.toFixed(2)).toBe('18198.40')
      expect(b.baseImponibleGeneral.toFixed(2)).toBe('17350.00')
      // Neto inmobiliario 8600 >6500; reducido 4300 <6500. No hay DA61.
      for (const r of [a, b]) expect(r.composicion.deduccionTrabajo.toFixed(2)).toBe('0.00')
    }))
    it.effect(`${row.id}: partidas distintas de la misma factura conservan el gasto`, () => Effect.gen(function* () {
      const c = decoded(row.entrada), v = c.inmuebles[0]!, g = v.gastos[0]!
      const dividido = { ...c, inmuebles: [{ ...v, gastos: [
        { ...g, id: 'REP-1', lineaFactura: '1', importe: '400.00' },
        { ...g, id: 'REP-2', lineaFactura: '2', importe: '600.00' },
      ] }] }
      for (const api of [canonical, liquidarIrpfAnualExplicito]) {
        const original = yield* api(c)
        const partidas = yield* api(dividido)
        expect(partidas.cuotaDiferencial.eq(original.cuotaDiferencial)).toBe(true)
      }
    }))
    it.effect(`${row.id}: historia, SS, identidad y retenciones adversas`, () => Effect.gen(function* () {
      const c = decoded(row.entrada), v = c.inmuebles[0]!
      const adversas = [
        { ...c, historia2024: undefined },
        { ...c, historia2024: { ...c.historia2024, construccion: '80000.01' } },
        { ...c, inmuebles: [{ ...v, catastro2025: { ...v.catastro2025, construccion: '80000.01' } }] },
        { ...c, inmuebles: [{ ...v, adquisicion: { ...v.adquisicion, sueloPrecio: '100000.01' } }] },
        { ...c, trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, cotizaciones: { ...r.cotizaciones, clase: 'estimadas' } })) } },
        { ...c, retenciones: [...c.retenciones, c.retenciones[0]] },
        { ...c, retenciones: c.retenciones.map(r => ({ ...r, documento: c.conciliacion.procedencia[0] })) },
        { ...c, retenciones: c.retenciones.map(r => ({ ...r, ejercicio: 2024 })) },
        { ...c, retenciones: c.retenciones.map(r => ({ ...r, fecha: '2025-02-30' })) },
        { ...c, modalidad: 'conjunta' },
      ]
      for (const raw of adversas) for (const api of [canonical, liquidarIrpfAnualExplicito]) {
        // @ts-expect-error Contradicciones deliberadas enviadas sin sanitizar a la frontera pública.
        const error = yield* Effect.flip(api(raw))
        expect(error._tag).toBe('RechazoP4a')
      }
    }))
  }
})
