import Decimal from "decimal.js"
import { describe, expect, it } from "vitest"
import { calcularCuotaPorEscala } from "../lib/dominio/irpf/cuotas/escalas-gravamen"
import {
  obtenerEscalaAutonomicaPublicada,
  ESTATAL_ORDINARIA_2012_2014,
  ESTATAL_COMPLEMENTARIA_2012_2014,
} from "../lib/dominio/irpf/cuotas/escalas-publicadas"
import { obtenerParametrosComunidadAutonoma } from "../lib/dominio/irpf/comunidades/comunidad-autonoma"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"
import type { ComunidadAutonoma } from "../lib/dominio/irpf/caso-fiscal-anual"

const cuota = (
  anio: AnioFiscal,
  comunidadAutonoma: ComunidadAutonoma,
  base: string
) => {
  const parametros = obtenerParametrosComunidadAutonoma({
    anio,
    comunidadAutonoma,
    baseLiquidableGeneral: new Decimal(base),
  })
  if (parametros._tag !== "ParametrosComunidadAutonoma")
    throw new Error("Territorio no soportado")
  const publicada = obtenerEscalaAutonomicaPublicada({
    anio,
    comunidadAutonoma,
  })
  if (publicada === undefined)
    throw new Error("Falta escala publicada para el caso")
  return calcularCuotaPorEscala({
    base: new Decimal(base),
    tramos: parametros.escalaAutonomica.tramos,
    escalasPublicadas: [publicada],
  })
}
describe("cuotas publicadas, aceptación acotada", () => {
  it.each([2012, 2013, 2014] as const)(
    "Estado %i conserva ordinaria y complemento",
    (anio) => {
      const p = obtenerParametrosComunidadAutonoma({
        anio,
        comunidadAutonoma: "madrid",
        baseLiquidableGeneral: new Decimal("17707.21"),
      })
      if (p._tag !== "ParametrosComunidadAutonoma")
        throw new Error("No soportado")
      expect(
        calcularCuotaPorEscala({
          base: new Decimal("17707.21"),
          tramos: p.escalaEstatalGeneral,
          escalasPublicadas: [
            ESTATAL_ORDINARIA_2012_2014,
            ESTATAL_COMPLEMENTARIA_2012_2014,
          ],
        }).toFixed(2)
      ).toBe("2257.66")
    }
  )
  it.each([
    [2012, "andalucia", "60000", "9458.31"],
    [2015, "andalucia", "120000", "23558.31"],
    [2014, "comunitat-valenciana", "120000.20", "22304.90"],
    [2016, "comunitat-valenciana", "175000.20", "34668.90"],
    [2020, "catalunya", "90000", "15908.31"],
    [2022, "catalunya", "21000", "2399.10"],
    [2024, "catalunya", "90000", "15902.83"],
    [2022, "madrid", "55596.90", "7421.04"],
    [2022, "murcia", "59999.99", "8625.83"],
    [2022, "murcia", "60000", "8625.83"],
    [2022, "murcia", "60000.01", "8716.67"],
    [2022, "murcia", "100000", "17796.67"],
  ] as const)("%i %s base %s", (anio, territorio, base, esperado) =>
    expect(cuota(anio, territorio, base).toFixed(2)).toBe(esperado)
  )
})

it("Murcia conserva el salto exacto y el exceso sin redondear", () => {
  expect(cuota(2022, "murcia", "59999.99").toString()).toBe("8625.831378")
  expect(cuota(2022, "murcia", "60000").toString()).toBe("8625.8332")
  expect(cuota(2022, "murcia", "60000.01").toString()).toBe("8716.67227")
})
it("mínimo y base cero usan la misma fila publicada", () => {
  expect(cuota(2012, "andalucia", "0").toString()).toBe("0")
  expect(cuota(2012, "andalucia", "-1").toString()).toBe("0")
  expect(cuota(2012, "andalucia", "5151").toString()).toBe("618.12")
  expect(cuota(2022, "catalunya", "5550").toString()).toBe("582.75")
})
it("no extiende una aceptación a otro año o a fallecimientos pendientes", () => {
  expect(
    obtenerEscalaAutonomicaPublicada({
      anio: 2025,
      comunidadAutonoma: "asturias",
    })
  ).toBeUndefined()
  expect(
    obtenerEscalaAutonomicaPublicada({
      anio: 2026,
      comunidadAutonoma: "madrid",
    })
  ).toBeUndefined()
})
it.each([
  [2012, "andalucia", "59999.99", "9458.30985"],
  [2012, "andalucia", "60000.01", "9458.31235"],
  [2014, "comunitat-valenciana", "120000.19", "22304.894252"],
  [2014, "comunitat-valenciana", "120000.21", "22304.902248"],
  [2020, "catalunya", "90000.01", "15908.31235"],
  [2022, "madrid", "55596.91", "7421.04205"],
] as const)("vecino %i %s %s", (anio, territorio, base, esperado) =>
  expect(cuota(anio, territorio, base).toString()).toBe(esperado)
)
