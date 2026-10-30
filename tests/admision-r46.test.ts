import { expect, it } from 'vitest'
import Decimal from 'decimal.js'
import { DateTime } from 'effect'
import { buildCompleteAdmission, evaluateCompleteAdmission, verifyCompleteAdmission } from '../scripts/procedencia/flujo-admision-r36.mjs'
import { encodeAdmissionValue, checkRuntimeDomain } from '../scripts/procedencia/flujo-admision-r36-runtime.mjs'
import { base, derechos } from '../docs/procedencia/revisiones/admision-anual-r34-sol/fixtures.mjs'
import { synthetic } from '../docs/procedencia/correcciones/admision-r46/puertos.mjs'

const fragment = buildCompleteAdmission()
it('codec v2 conserva tipos, descriptores, huecos y alias', () => {
  const own = { visible: 7 }
  const hidden = { visible: 7 }
  Object.defineProperty(hidden, 'extra', { value: 8, enumerable: false })
  const shared = { value: 7 }
  const pairs = [
    [undefined, { kind: 'undefined' }],
    [new Decimal(7), { kind: 'Decimal', value: '7' }],
    [DateTime.toDateUtc(DateTime.makeUnsafe(0)), { kind: 'Date', value: 0 }],
    [NaN, { kind: 'number', value: 'NaN' }],
    [-0, 0], [new Decimal('-0'), new Decimal('0')],
    [own, hidden], [Array(1), [undefined]],
    [[shared, shared], [{ value: 7 }, { value: 7 }]],
    [Object.create(null), {}],
  ]
  for (const [left, right] of pairs) {
    checkRuntimeDomain(left); checkRuntimeDomain(right)
    expect(encodeAdmissionValue(left)).not.toEqual(encodeAdmissionValue(right))
  }
})
it('codec conserva propiedades adicionales de fechas y Decimal', () => {
  for (const value of [new Decimal(7), DateTime.toDateUtc(DateTime.makeUnsafe(0))]) {
    const before = encodeAdmissionValue(value)
    Object.defineProperty(value, 'extra', { value: 1, enumerable: false })
    checkRuntimeDomain(value)
    expect(encodeAdmissionValue(value)).not.toEqual(before)
  }
})
it('el dominio rechaza subclases sin convertirlas en rechazo fiscal', () => {
  class Derived extends Array<number> {}
  expect(() => checkRuntimeDomain(new Derived(1, 2))).toThrow('Subclase')
  const result = evaluateCompleteAdmission(fragment, 'liquidarIrpfAnual', [{ ...base, deducciones: new Derived() }, { modo: 'canonico' }])
  expect(result.outcome).toBe('pending')
  expect(result.sites).toEqual([])
})
const goodRow = { baseInferior: new Decimal(0), cuota: new Decimal(0), tipo: new Decimal('.1') }
for (const [label, value, expected] of [
  ['ausente', undefined, 'success'], ['válida', [goodRow], 'success'],
  ['número', 17, 'defect'], ['null', null, 'defect'], ['objeto', {}, 'defect'],
  ['fila vacía', [{}], 'defect'], ['tipo string', [{ ...goodRow, tipo: '.1' }], 'defect'],
  ['opcional inválido', [{ ...goodRow, inferiorExclusivo: 1 }], 'defect'],
] as const) it(`escala opcional: ${label}`, () => {
  let reached = false
  const result = evaluateCompleteAdmission(fragment, 'liquidarIrpfAnual', [base, { modo: 'canonico' }], synthetic({
    obtenerEscalaAutonomicaPublicada: (args: unknown[], call: { node: string }) => {
      reached = true
      return { outcome: 'success', value, node: call.node, arguments: encodeAdmissionValue(args) }
    },
  }))
  expect(reached).toBe(true)
  expect(result.outcome, result.reason).toBe(expected)
})
for (const [age, start, expected] of [
  [2, null, true], [3, null, false], [8, null, false],
  [8, '2022-12-31', false], [8, '2023-01-01', true],
  [8, '2025-12-31', true], [8, '2026-01-01', false],
] as const) it(`proyección finita de incremento ${age}/${start}`, () => {
  // Contrasta solo la expresión del selector; la admisión temporal sigue aparte.
  const child = derechos.descendientes[0]
  const holders = child.titulares.map(t => ({ ...t, vinculo: start === null ? t.vinculo : { clase: 'adopcion', fechaInicioIncremento: start } }))
  const item = { descendiente: { ...child, edadDevengo: age }, titulares: holders }
  const result = evaluateCompleteAdmission(fragment, 'seleccionarIncrementoDerechos', [item, derechos])
  expect(result.outcome, result.reason).toBe('success')
  expect(result.value).toBe(expected)
})
it('verifica anclas reales y rechaza desplazamiento sin depender de reconstrucción', () => {
  expect(verifyCompleteAdmission(fragment)).toBe(true)
  const altered = structuredClone(fragment)
  altered.graph.anchors[0].start += 1
  expect(() => verifyCompleteAdmission(altered)).toThrow('Ancla')
})
it('un recibo de la codificación anterior queda pendiente', () => {
  const b = fragment.boundaries.find(b => b.name === 'LiquidacionIrpfAnual.liquidar')
  if (b === undefined) throw Error('Frontera anual ausente')
  const instances: ReadonlyArray<{ node: string }> = b.instances
  const instance = instances[0]
  if (instance === undefined) throw Error('Instancia anual ausente')
  const result = evaluateCompleteAdmission(fragment, 'liquidarIrpfAnualDesdeServicio', [base, { modo: 'canonico' }], {
    'LiquidacionIrpfAnual.liquidar': { outcome: 'success', node: instance.node, arguments: [base, { modo: 'canonico' }], value: {} },
  })
  expect(result.outcome).toBe('pending')
  expect(result.sites).toEqual([])
})
