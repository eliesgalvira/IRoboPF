import { expect, it } from 'vitest'
import Decimal from 'decimal.js'
import { DateTime, Effect, Result, Schema } from 'effect'
import { createRequire } from 'node:module'
import { buildCompleteAdmission, evaluateCompleteAdmission, verifyCompleteAdmission } from '../../../../scripts/procedencia/flujo-admision-r36.mjs'
import { encodeAdmissionValue, checkRuntimeDomain } from '../../../../scripts/procedencia/flujo-admision-r36-runtime.mjs'
import { compilePublishedScaleSchema } from '../../../../scripts/procedencia/flujo-admision-r36-compilador.mjs'
import { calcularDerechosMinimos } from '../../../../lib/dominio/irpf/minimos/derechos'
import { DerechosMinimos2025 } from '../../../../lib/dominio/irpf/minimos/derechos-contrato'
import { MINIMOS_ESTATALES_2025 } from '../../../../lib/dominio/normativa/datos/minimos-autonomicos-2025'
import { obtenerEscalaAutonomicaPublicada } from '../../../../lib/dominio/irpf/cuotas/escalas-publicadas'
import { base, derechos } from '../admision-anual-r34-sol/fixtures.mjs'
import { synthetic } from '../../correcciones/admision-r46/puertos.mjs'
const fragment = buildCompleteAdmission()
type ControlCodec = undefined | null | number | string | boolean | Decimal | Date | ReadonlyArray<ControlCodec> | { readonly a?: number; readonly b?: number; readonly x?: number | undefined }
const encode = (value: ControlCodec) => JSON.stringify(encodeAdmissionValue(value))
for (const [left, right] of [[undefined, null], [Infinity, -Infinity], [NaN, Infinity], [NaN, 'NaN'], [-0, 0], [{}, { x: undefined }], [{ a: 1, b: 2 }, { b: 2, a: 1 }], [['undefined'], undefined]]) it(`P01 discriminante codec ${encode(left)}/${encode(right)}`, () => {
  checkRuntimeDomain(left); checkRuntimeDomain(right)
  expect(encode(left)).not.toBe(encode(right))
})
for (const flag of ['enumerable', 'configurable', 'writable']) it(`P02 descriptor ordinario ${flag}`, () => {
  const left = {}, right = {}
  Object.defineProperty(left, 'x', { value: 7, enumerable: true, configurable: true, writable: true })
  Object.defineProperty(right, 'x', { value: 7, enumerable: true, configurable: true, writable: true, [flag]: false })
  checkRuntimeDomain(left); checkRuntimeDomain(right)
  expect(encode(left)).not.toBe(encode(right))
})
it('P03 Date inválida y fecha válida se distinguen', () => {
  const invalid = DateTime.toDateUtc(DateTime.makeUnsafe(0)); invalid.setTime(NaN)
  checkRuntimeDomain(invalid)
  expect(encode(invalid)).not.toBe(encode(DateTime.toDateUtc(DateTime.makeUnsafe(0))))
})
it('P04 Decimal CJS y ESM nativos conservan equivalencia monetaria', () => {
  const require = createRequire('/home/elies/Repos/IRoboPF/package.json')
  const cjs = new (require('decimal.js'))('7')
  checkRuntimeDomain(cjs); checkRuntimeDomain(new Decimal(7))
  expect(encode(cjs)).toBe(encode(new Decimal(7)))
})
it('P05 funciones externas no entran por atribuirse origen', () => {
  const fn = Object.assign(() => 7, { r36Origin: 'inventado' })
  expect(() => checkRuntimeDomain(fn)).toThrow('Prototipo')
  expect(() => encodeAdmissionValue(() => 7)).toThrow('origen')
})
it('P06 nativos Array admitidos; Date y Decimal derivados pendientes', () => {
  for (const value of [[], [undefined], Array(2), new Decimal(0), DateTime.toDateUtc(DateTime.makeUnsafe(0))]) expect(() => checkRuntimeDomain(value)).not.toThrow()
  class DecimalDerivado extends Decimal {}
  expect(() => checkRuntimeDomain(new DecimalDerivado(1))).toThrow('Subclase')
})
it('P07 escala real derivada, positiva y dependencia registrada', () => {
  const derived = compilePublishedScaleSchema()
  expect(derived.schema.items.required).toEqual(['baseInferior', 'cuota', 'tipo'])
  expect(derived.schema.items.properties).toEqual({ baseInferior: { r36Decimal: true }, cuota: { r36Decimal: true }, tipo: { r36Decimal: true }, inferiorExclusivo: { type: 'boolean' } })
  expect(fragment.graph.sources).toContainEqual(derived.source)
  const value = obtenerEscalaAutonomicaPublicada({ anio: 2025, comunidadAutonoma: 'madrid' })
  expect(value?.length).toBeGreaterThan(0)
  const result = evaluateCompleteAdmission(fragment, 'liquidarIrpfAnual', [base, { modo: 'canonico' }], synthetic({ obtenerEscalaAutonomicaPublicada: (args: unknown[], call: { node: string }) => ({ outcome: 'success', value, node: call.node, arguments: encodeAdmissionValue(args) }) }))
  expect(result.outcome, result.reason).toBe('success')
})
for (const [age, start, expected] of [[2, null, true], [3, null, false], [8, '2022-12-31', false], [8, '2023-01-01', true], [8, '2025-12-31', true]] as const) it(`P08 API real admitida incremento ${age}/${start}`, () => {
  const seed = Schema.decodeUnknownSync(DerechosMinimos2025)(derechos)
  const child = seed.descendientes[0]
  if (child === undefined) throw Error('Falta descendiente de control')
  const input = { ...seed, descendientes: [{ ...child, fechaNacimiento: `${2025 - age}-12-31`, edadDevengo: age, titulares: child.titulares.map(t => ({ ...t, rentasNoExentasCentimos: 0, vinculo: start === null ? t.vinculo : { clase: 'adopcion', fechaInicioIncremento: start, fechaConstitucionVinculo: start, fundamento: 'inscripcion-registro-civil', historialCompleto: true } as const })) }] }
  const native = Effect.runSync(Effect.result(calcularDerechosMinimos(input, MINIMOS_ESTATALES_2025)))
  expect(Result.isSuccess(native)).toBe(true)
  if (Result.isFailure(native)) throw Error(native.failure.motivo)
  expect(native.success.atribuciones[0]?.incremento).toBe(expected)
  const selected = { descendiente: input.descendientes[0], titulares: input.descendientes[0]?.titulares }
  const projected = evaluateCompleteAdmission(fragment, 'seleccionarIncrementoDerechos', [selected, input])
  expect(projected.outcome, projected.reason).toBe('success'); expect(projected.value).toBe(expected)
  let reached = 0
  const result = evaluateCompleteAdmission(fragment, 'liquidarIrpfAnual', [{ ...base, derechosMinimos: input }, { modo: 'canonico' }], synthetic({ calcularDerechosMinimos: (args: unknown[], call: { node: string }) => { reached++; return { outcome: 'success', value: native.success, node: call.node, arguments: encodeAdmissionValue(args) } } }))
  expect(result.outcome, result.reason).toBe('success'); expect(reached).toBe(2)
})
it('P09 falta proyección queda pending en runtime crudo, sin afirmar bypass del pin', () => {
  const altered = structuredClone(fragment)
  altered.graph.roots = altered.graph.roots.filter((r: { name: string }) => r.name !== 'seleccionarIncrementoDerechos')
  const result = evaluateCompleteAdmission(altered, 'liquidarIrpfAnual', [{ ...base, derechosMinimos: { ...derechos, descendientes: derechos.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => ({ ...t, rentasNoExentasCentimos: 0 })) })) } }, { modo: 'canonico' }], synthetic({ calcularDerechosMinimos: (args: unknown[], call: { node: string }) => ({ outcome: 'success', value: { contribuyente: new Decimal(0), descendientes: new Decimal(0), ascendientes: new Decimal(0), discapacidadContribuyente: new Decimal(0), discapacidadFamiliares: new Decimal(0), total: new Decimal(0), atribuciones: [] }, node: call.node, arguments: encodeAdmissionValue(args) }) }))
  expect(result.outcome, result.reason).toBe('pending'); expect(result.reason).toContain('incremento')
})
it('P10 cada una de las 17 puertas permanece cerrada', () => {
  expect(verifyCompleteAdmission(fragment)).toBe(true)
  for (const site of fragment.sites) {
    expect(site.admissionClosed).toBe(false); expect(site.siteClosed).toBe(false)
    for (const key of ['admissionClosed', 'siteClosed'] as const) {
      const altered = structuredClone(fragment), target = altered.sites.find(s => s.siteId === site.siteId)
      if (target === undefined) throw Error('Sitio ausente')
      target[key] = true
      expect(() => verifyCompleteAdmission(altered)).toThrow()
    }
  }
})
it('P11 captura selecciona contribuyente, no primer titular; proyección aislada', () => {
  const seed = Schema.decodeUnknownSync(DerechosMinimos2025)(derechos), child = seed.descendientes[0]
  if (child === undefined) throw Error('Falta descendiente')
  const titular = child.titulares[0]
  if (titular === undefined) throw Error('Falta titular')
  const adoption = { ...titular, vinculo: { clase: 'adopcion', fechaInicioIncremento: '2023-01-01' } }
  const item = { descendiente: child, titulares: [{ ...adoption, titularId: 's-9' }, titular] }
  expect(evaluateCompleteAdmission(fragment, 'seleccionarIncrementoDerechos', [item, seed]).value).toBe(false)
  expect(evaluateCompleteAdmission(fragment, 'seleccionarIncrementoDerechos', [item, { ...seed, contribuyenteId: 's-9' }]).value).toBe(true)
  // Solo selector aislado: no se atribuye admisión a este vínculo incompleto.
})
