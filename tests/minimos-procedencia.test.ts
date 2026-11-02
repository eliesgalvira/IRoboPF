import { describe, expect, it } from "@effect/vitest"
import { obtenerMinimoContribuyente } from "../lib/dominio/irpf/minimos/minimo-contribuyente"
describe("mínimo del contribuyente", () => {
  it.each([
    [64, "5550"],
    [65, "6700"],
    [74, "6700"],
    [75, "8100"],
  ] as const)(
    "MIN-007: contribuyente con %s años cumplidos",
    (edad, esperado) => {
      expect(obtenerMinimoContribuyente({ anio: 2025, edad }).toString()).toBe(
        esperado
      )
    }
  )
  it.each([2012, 2013, 2014] as const)(
    "la API respeta %s si no se proporciona tabla",
    (anio) => {
      expect(obtenerMinimoContribuyente({ anio, edad: 40 }).toString()).toBe(
        "5151"
      )
    }
  )
})
