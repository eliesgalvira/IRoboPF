import { expect, it } from 'vitest'
import Decimal from 'decimal.js'
import { checkRuntimeDomain, encodeAdmissionValue } from '../../../../scripts/procedencia/flujo-admision-r36-runtime.mjs'
for (const flag of ['enumerable', 'configurable', 'writable'] as const) it(`R47-N01 Decimal.constructor conserva descriptor ${flag}`, () => {
  const original = new Decimal(7), changed = new Decimal(7)
  Object.defineProperty(changed, 'constructor', { [flag]: false })
  checkRuntimeDomain(original); checkRuntimeDomain(changed)
  expect(Object.getOwnPropertyDescriptor(original, 'constructor')?.[flag]).toBe(true)
  expect(Object.getOwnPropertyDescriptor(changed, 'constructor')?.[flag]).toBe(false)
  expect(encodeAdmissionValue(original)).not.toEqual(encodeAdmissionValue(changed))
})
