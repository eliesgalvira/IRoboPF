import { expect, it } from "vitest"
import { DecimalIngreso2025 as D } from "../lib/dominio/irpf/ingresos-identificados-2025/productor"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

it("18 enteros y decimal80 sobreviven a sumar4000; constructor no es prueba de operación exacta", () => {
  const base = "123456789012345678." + "0".repeat(79) + "1"
  const suma = new D(base).plus("4000")
  const esperado = { numeradorEuros: (123456789012349678n * 10n ** 80n + 1n).toString(), divisor: (10n ** 80n).toString() }
  expect(racional(suma.toFixed())).toEqual(esperado)
  expect(suma.minus("123456789012349678").toFixed()).toBe("0." + "0".repeat(79) + "1")
  const OchentaSignificativas = D.clone({ precision: 80 })
  expect(new OchentaSignificativas(base).plus("4000").toFixed()).toBe("123456789012349678")
})
it("hasta100 sumandos internos de18 enteros y80 posiciones caben sin perder el último decimal", () => {
  const importe = "999999999999999999." + "9".repeat(80)
  let acumulado = new D("0")
  for (let i = 0; i < 100; i++) acumulado = acumulado.plus(importe)
  const numerador = ((10n ** 98n - 1n) * 100n).toString()
  expect(racional(acumulado.toFixed())).toEqual(racional(numerador, (10n ** 80n).toString()))
})
