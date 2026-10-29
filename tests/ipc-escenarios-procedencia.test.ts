import { Effect } from "effect"
import { expect, it } from "@effect/vitest"
import { IPC_ANUAL_DICIEMBRE } from "../lib/dominio/normativa/datos/ipc-2012-2026"
import { compararAjustadoPorIpc } from "../lib/dominio/compatibilidad-legacy/progresividad-frio"
import { calcularFactorIpcDiciembre } from "../lib/dominio/inflacion/factor-ipc"

it("IPC-AUSENCIA rechaza datos ausentes y conserva la identidad del año base", () => {
  expect(() =>
    calcularFactorIpcDiciembre({ anioBase: 2025, anioReferencia: 2026 })
  ).toThrow("ausente")
  for (const anio of [2011, 2027, NaN, 2024.5])
    expect(() =>
      calcularFactorIpcDiciembre({ anioBase: anio, anioReferencia: 2025 })
    ).toThrow()
  expect(
    calcularFactorIpcDiciembre({
      anioBase: 2012,
      anioReferencia: 2012,
    }).factor.toString()
  ).toBe("1")
  const r = calcularFactorIpcDiciembre({ anioBase: 2012, anioReferencia: 2025 })
  expect(r.factor.toFixed(18)).toBe("1.270974585050486217")
  expect(r.procedencia.estado).toBe("observado")
  expect(r.procedencia.escenario).toBeNull()
})

it("IPC-2026 no se publica como observación de diciembre", () => {
  expect(IPC_ANUAL_DICIEMBRE[2026]).toBeUndefined()
})
it.effect("IPC-INVERSO obtiene un recíproco, no el producto vacío", () =>
  Effect.gen(function* () {
    const r = yield* compararAjustadoPorIpc({
      salarioBrutoAnualReferenciaCentimos: 3000000,
      anioComparado: 2025,
      anioReferencia: 2024,
    })
    expect(r.factorIpc).toBe("0.971817298348")
  })
)
it.effect("IPC-ESCENARIO conserva la hipótesis y declara su procedencia", () =>
  Effect.gen(function* () {
    const r = yield* compararAjustadoPorIpc({
      salarioBrutoAnualReferenciaCentimos: 3000000,
      anioComparado: 2025,
      anioReferencia: 2026,
    })
    expect(r.factorIpc).toBe("1.030000000000")
    expect(r).toHaveProperty("procedenciaIpc.estado", "incluye-escenario")
    expect(r).toHaveProperty("procedenciaIpc.escenario.horizonte", "2026-12")
  })
)
