import { describe, expect, it } from "@effect/vitest"

import {
  discapacidad33a64,
  sinDiscapacidad,
} from "../lib/dominio/irpf/caso-fiscal-anual"
import { obtenerMinimoContribuyente } from "../lib/dominio/irpf/minimos/minimo-contribuyente"
import { obtenerMinimoDescendientes } from "../lib/dominio/irpf/minimos/minimo-descendientes"
import { obtenerMinimoAscendientes } from "../lib/dominio/irpf/minimos/minimo-ascendientes"

describe("mínimos: condiciones acotadas por contrarrevisión", () => {
  it("MIN-001: excluye 25 años sin discapacidad antes de asignar orden", () => {
    expect(
      obtenerMinimoDescendientes([
        { edad: 25, discapacidad: sinDiscapacidad },
      ]).toString()
    ).toBe("0")
    expect(
      obtenerMinimoDescendientes([
        { edad: 30, discapacidad: sinDiscapacidad },
        { edad: 10, discapacidad: sinDiscapacidad },
      ]).toString()
    ).toBe("2400")
  })
  it("MIN-001: conserva menor de 25 y excepción por discapacidad", () => {
    expect(
      obtenerMinimoDescendientes([
        { edad: 24, discapacidad: sinDiscapacidad },
      ]).toString()
    ).toBe("2400")
    expect(
      obtenerMinimoDescendientes([
        { edad: 30, discapacidad: discapacidad33a64() },
        { edad: 10, discapacidad: sinDiscapacidad },
      ]).toString()
    ).toBe("5100")
  })
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
  it.each([
    [64, "0"],
    [65, "1150"],
    [74, "1150"],
    [75, "2550"],
  ] as const)(
    "MIN-007: ascendiente con %s años cumplidos",
    (edad, esperado) => {
      expect(
        obtenerMinimoAscendientes([
          { edad, discapacidad: sinDiscapacidad },
        ]).toString()
      ).toBe(esperado)
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
