import { describe, expect, it } from "@effect/vitest"
import { Result } from "effect"

import {
  leerLiteral,
  normalizar,
  type GramaticaNumero,
} from "../lib/procedencia/literales"

const euros: GramaticaNumero = { decimales: [2], centinelas: [] }
const porcentaje: GramaticaNumero = {
  decimales: [2],
  sufijo: "%",
  centinelas: [],
}

const valor = (literal: string, gramatica: GramaticaNumero) =>
  Result.match(leerLiteral(literal, gramatica), {
    onSuccess: (leido) => leido,
    onFailure: () => "rechazado" as const,
  })

describe("gramática de literales", () => {
  it.each([
    ["0,00", "0"],
    ["13.000,00", "13000"],
    ["1.235,00", "1235"],
    ["300.000,50", "300000.5"],
  ])("lee el importe %s como %s", (literal, decimal) => {
    expect(valor(literal, euros)).toEqual({ _tag: "Numero", decimal })
  })

  it.each([
    "13000,00",
    "13.000",
    "1.23,00",
    "013,00",
    "-1,00",
    "1.000,5",
    "13.000,00 ",
    "13 000,00",
    "9,50%",
    "En adelante",
  ])("rechaza %s como importe con dos decimales", (literal) => {
    expect(valor(literal, euros)).toBe("rechazado")
  })

  it("exige el sufijo declarado y no admite otro", () => {
    expect(valor("9,50%", porcentaje)).toEqual({
      _tag: "Numero",
      decimal: "9.5",
    })
    expect(valor("9,50", porcentaje)).toBe("rechazado")
    expect(valor("9,50 %", porcentaje)).toBe("rechazado")
  })

  it("admite sólo los decimales y centinelas declarados", () => {
    const ahorro: GramaticaNumero = {
      decimales: [0, 2],
      centinelas: [{ literal: "En adelante", centinela: "sin-limite" }],
    }
    expect(valor("6.000", ahorro)).toEqual({ _tag: "Numero", decimal: "6000" })
    expect(valor("6.000,00", ahorro)).toEqual({
      _tag: "Numero",
      decimal: "6000",
    })
    expect(valor("6.000,0", ahorro)).toBe("rechazado")
    expect(valor("En adelante", ahorro)).toEqual({
      _tag: "Centinela",
      centinela: "sin-limite",
    })
    expect(valor("en adelante", ahorro)).toBe("rechazado")
  })
})

describe("normalización", () => {
  it("sólo convierte espacio duro, colapsa espacios HTML y recorta", () => {
    expect(normalizar("  5.790\u00a0euros \n anuales ")).toBe(
      "5.790 euros anuales"
    )
    expect(normalizar("a\u202fb")).toBe("a\u202fb")
  })

  it("aplica las mismas reglas en los extremos que en el interior", () => {
    expect(normalizar("\u202f9,50\u202f")).toBe("\u202f9,50\u202f")
    expect(normalizar("9,\u202f50")).toBe("9,\u202f50")
    expect(normalizar("\u00a0\t9,50 \n")).toBe("9,50")
  })
})
