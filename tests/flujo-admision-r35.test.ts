import { expect, it } from 'vitest'
import { Effect, Result, Schema } from 'effect'
import Decimal from 'decimal.js'
import { buildEvaluableAdmission, evaluateProgram, verifyEvaluableAdmission } from '../scripts/procedencia/flujo-admision-r35.mjs'
import { DerechosMinimos2025 } from '../lib/dominio/irpf/minimos/derechos-contrato'
import { validarDerechosMinimos, validarRentasAnualesDerechos } from '../lib/dominio/irpf/minimos/derechos'
import { derechos } from '../docs/procedencia/revisiones/admision-anual-r34-sol/fixtures.mjs'
const f = buildEvaluableAdmission()
const input = Schema.decodeUnknownSync(DerechosMinimos2025)(derechos)
it('contrato importable y sitios pendientes', () => {
  expect(verifyEvaluableAdmission(f)).toBe(true)
  expect(f.sites).toHaveLength(17)
})
it('paridad tipada de coherencia completa', () => {
  const actual = Effect.runSync(Effect.result(validarDerechosMinimos(input)))
  expect(evaluateProgram(f, 'validarDerechosMinimos', [input]).outcome).toBe(Result.isSuccess(actual) ? 'success' : 'reject')
})
for (const amount of ['0', '8000', '8000.005', 'NaN']) it(`conciliación tipada ${amount}`, () => {
  const value = new Decimal(amount)
  const actual = Effect.runSync(Effect.result(validarRentasAnualesDerechos(input, value)))
  expect(evaluateProgram(f, 'validarRentasAnualesDerechos', [input, value]).outcome).toBe(Result.isSuccess(actual) ? 'success' : 'reject')
})
