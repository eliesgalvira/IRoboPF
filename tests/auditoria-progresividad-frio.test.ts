import { Effect } from "effect"
import { expect, it } from "vitest"
import { calcularSalario } from "../lib/dominio/analisis-salarial/calculo-salario"
import { construirPuntosAuditoriaAnioAjustado } from "../lib/dominio/auditoria/auditoria-progresividad-frio"

it("el análisis conserva las cuotas anuales sin aplicar un segundo límite de retención", () => {
  const puntos = Effect.runSync(
    construirPuntosAuditoriaAnioAjustado({
      salarioBrutoAnualMinimoCentimos: 1860000,
      salarioBrutoAnualMaximoCentimos: 1870000,
      pasoCentimos: 10000,
      anio: 2025,
      anioReferencia: 2025,
      comunidadAutonoma: "simulada-estatal",
    })
  )
  expect(puntos).toHaveLength(2)
  for (const punto of puntos) {
    const anual = Effect.runSync(
      calcularSalario({
        anio: 2025,
        salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
        comunidadAutonoma: "simulada-estatal",
      })
    )
    expect(punto.comparacion.referencia.irpfFinalCentimos).toBe(
      anual.irpfFinalCentimos
    )
    expect(punto.comparacion.referencia.irpfFinalCentimos).toBe(
      anual.irpfFinalCentimos
    )
    expect(punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos).toBe(
      0
    )
  }
})
it("el análisis no inventa precisión por debajo de las casillas anuales", () => {
  const puntos = Effect.runSync(
    construirPuntosAuditoriaAnioAjustado({
      salarioBrutoAnualMinimoCentimos: 1690000,
      salarioBrutoAnualMaximoCentimos: 1690500,
      pasoCentimos: 100,
      anio: 2025,
      anioReferencia: 2025,
      comunidadAutonoma: "simulada-estatal",
    })
  )
  expect(puntos).toHaveLength(6)
  for (const punto of puntos) {
    const cuota = punto.comparacion.referencia
    expect(Number(cuota.irpfFinalPrecisoEuros) * 100).toBeCloseTo(
      cuota.irpfFinalCentimos,
      8
    )
    expect(cuota.rastro?.pasos.length).toBeGreaterThan(0)
  }
})
