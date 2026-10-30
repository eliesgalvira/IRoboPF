import { expect, it } from 'vitest'
import Decimal from 'decimal.js'
import { createRequire } from 'node:module'
import { checkRuntimeDomain, encodeAdmissionValue } from '../scripts/procedencia/flujo-admision-r36-runtime.mjs'
import { buildCompleteAdmission, evaluateCompleteAdmission } from '../scripts/procedencia/flujo-admision-r36.mjs'
import { base } from '../docs/procedencia/revisiones/admision-anual-r34-sol/fixtures.mjs'
import { synthetic } from '../docs/procedencia/correcciones/admision-r46/puertos.mjs'

for (const flag of ['enumerable', 'configurable', 'writable'] as const) it(`R47-N01 conserva ${flag} de Decimal.constructor`, () => {
  const original = new Decimal(7), changed = new Decimal(7)
  Object.defineProperty(changed, 'constructor', { [flag]: false })
  checkRuntimeDomain(original); checkRuntimeDomain(changed)
  expect(Object.getOwnPropertyDescriptor(original, 'constructor')?.[flag]).toBe(true)
  expect(Object.getOwnPropertyDescriptor(changed, 'constructor')?.[flag]).toBe(false)
  expect(encodeAdmissionValue(original)).not.toEqual(encodeAdmissionValue(changed))
})
it('las ocho combinaciones de atributos se distinguen y conservan equivalencia CJS/ESM', () => {
  const require = createRequire(import.meta.url)
  const DecimalCjs: typeof Decimal = require('decimal.js')
  const encodings = new Set<string>()
  for (let bits = 0; bits < 8; bits++) {
    const descriptor = { enumerable: Boolean(bits & 1), configurable: Boolean(bits & 2), writable: Boolean(bits & 4) }
    const esm = new Decimal(7), cjs = new DecimalCjs(7)
    Object.defineProperty(esm, 'constructor', descriptor)
    Object.defineProperty(cjs, 'constructor', descriptor)
    checkRuntimeDomain(esm); checkRuntimeDomain(cjs)
    const encoded = encodeAdmissionValue(esm)
    expect(encoded.codec).toBe('admission-value-v3')
    expect(encoded).toEqual(encodeAdmissionValue(cjs))
    encodings.add(JSON.stringify(encoded))
  }
  expect(encodings.size).toBe(8)
})
it('conserva presencia y orden del campo constructor', () => {
  const original = new Decimal(7), absent = new Decimal(7), reordered = new Decimal(7)
  const descriptor = Object.getOwnPropertyDescriptor(reordered, 'constructor')
  if (descriptor === undefined) throw Error('Constructor propio ausente en el control')
  expect(Reflect.deleteProperty(absent, 'constructor')).toBe(true)
  expect(Reflect.deleteProperty(reordered, 'constructor')).toBe(true)
  Object.defineProperty(reordered, 'constructor', descriptor)
  for (const value of [original, absent, reordered]) checkRuntimeDomain(value)
  expect(new Set([original, absent, reordered].map(value => JSON.stringify(encodeAdmissionValue(value)))).size).toBe(3)
})
it('un dato ordinario no suplanta el marcador de constructor nativo', () => {
  const native = new Decimal(7), ordinary = new Decimal(7)
  Object.defineProperty(ordinary, 'constructor', { value: ['native-constructor', 'Decimal'] })
  checkRuntimeDomain(native); checkRuntimeDomain(ordinary)
  expect(encodeAdmissionValue(native)).not.toEqual(encodeAdmissionValue(ordinary))
})
const fragment = buildCompleteAdmission()
for (const [codec, expected] of [['admission-value-v2', 'pending'], ['admission-value-v3', 'success']] as const) it(`frontera anual con recibo ${codec}: ${expected}`, () => {
  let reached = false
  const result = evaluateCompleteAdmission(fragment, 'liquidarIrpfAnual', [base, { modo: 'canonico' }], synthetic({
    obtenerEscalaAutonomicaPublicada: (args: unknown[], call: { node: string }) => {
      reached = true
      return { outcome: 'success', value: undefined, node: call.node, arguments: { ...encodeAdmissionValue(args), codec } }
    },
  }))
  expect(reached).toBe(true)
  expect(result.outcome, result.reason).toBe(expected)
  if (expected === 'pending') expect(result.sites).toEqual([])
  // Puertos sintéticos: solo prueba compatibilidad del recibo, no liquidación fiscal.
})
