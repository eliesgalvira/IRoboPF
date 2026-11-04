import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import { calcularCuotaPorEscala } from "../lib/dominio/irpf/cuotas/escalas-gravamen"
import { calcularAhorroConMinimos } from "../lib/dominio/irpf/cuotas/cuota-integra-ahorro"
import { calcularDerechosMinimos } from "../lib/dominio/irpf/minimos/derechos"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import { derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"

const A = Decimal.clone({ precision: 80 })
const fraccion = "0.123456789012345678901234567890123456789"

it("la cuota fija y el exceso usan la aritmética seleccionada, sin alterar la global", () => {
  const precisionGlobal = Decimal.precision
  const base = new A(100).plus(fraccion)
  const tramos = [
    [new Decimal(100), new Decimal("0.1")],
    [new Decimal(Infinity), new Decimal("0.2")],
  ] as const
  const filas = [
    [
      {
        baseInferior: new Decimal(100),
        cuota: new Decimal(10),
        tipo: new Decimal("0.2"),
      },
    ],
  ]
  const esperado = new A(fraccion).mul("0.2").plus(10)
  const anterior = calcularCuotaPorEscala({ base, tramos }).toFixed()
  expect(
    calcularCuotaPorEscala({ base, tramos, aritmetica: A }).toFixed()
  ).toBe(esperado.toFixed())
  expect(
    calcularCuotaPorEscala({
      base,
      tramos,
      escalasPublicadas: filas,
      aritmetica: A,
    }).toFixed()
  ).toBe(esperado.toFixed())
  expect(calcularCuotaPorEscala({ base, tramos }).toFixed()).toBe(anterior)
  expect(Decimal.precision).toBe(precisionGlobal)
})

it("remanentes y gravámenes del ahorro no pierden la fracción al usar mínimos globales", () => {
  const baseGeneral = new A(123).plus(fraccion)
  const base = new A(5999).plus(fraccion)
  const r = calcularAhorroConMinimos({
    anio: 2025,
    base,
    baseGeneral,
    aritmetica: A,
    minimoEstatal: new Decimal(5550),
    minimoAutonomico: new Decimal("5956.65"),
  })
  for (const [componente, minimo] of [
    [r.estatal, "5550"],
    [r.autonomico, "5956.65"],
  ] as const) {
    const remanente = new A(minimo).minus(baseGeneral)
    expect(componente.remanente.toFixed()).toBe(remanente.toFixed())
    expect(componente.bruta.toFixed()).toBe(base.mul("0.095").toFixed())
    expect(componente.despuesMinimo.toFixed()).toBe(
      base.minus(remanente).mul("0.095").toFixed()
    )
  }
})

it("el reparto familiar conserva la precisión elegida antes de componer la cuota", () => {
  const descendiente = derechos.descendientes[0]
  const caso = {
    ...derechos,
    descendientes: [
      {
        ...descendiente,
        sujetoId: "s-99",
        titulares: Array.from({ length: 7 }, (_, i) => ({
          ...descendiente.titulares[0],
          titularId: `s-${i + 1}`,
        })),
      },
    ],
  }
  const r = Effect.runSync(
    calcularDerechosMinimos(caso, MINIMOS_ESTATALES_2025, A)
  )
  expect(r.descendientes.toFixed()).toBe(new A(2400).div(7).toFixed())
  expect(r.total.toFixed()).toBe(new A(5550).plus(new A(2400).div(7)).toFixed())
})
