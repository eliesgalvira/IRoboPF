import { describe, expect, it } from "@effect/vitest"
import Decimal from "decimal.js"
import { Result } from "effect"

import { proyectarEscala } from "../lib/procedencia/motor-2025"

const tramos = (
  ...pares: ReadonlyArray<readonly [number | string, number | string]>
) =>
  pares.map(
    ([limite, tipo]) => [new Decimal(limite), new Decimal(tipo)] as const
  )

const proyectar = (escala: ReturnType<typeof tramos>): unknown =>
  proyectarEscala("andalucia", "escala-general-autonomica", escala)

const esFallo = (resultado: unknown) =>
  Result.isResult(resultado) && Result.isFailure(resultado)
    ? resultado.failure
    : "sin fallo"

describe("escala del motor validada antes de proyectarla", () => {
  it("el tramo abierto es el último, con límite +Infinity, y da sin-limite", () => {
    const resultado = proyectar(tramos([12450, "0.19"], [Infinity, "0.24"]))
    expect(Result.isResult(resultado) && Result.isSuccess(resultado)).toBe(true)
    const valores = Result.isResult(resultado)
      ? (Result.getOrThrow(resultado) as ReadonlyArray<{
          clave: { fila: number; columna: string }
          valor: unknown
        }>)
      : []
    expect(
      valores.find(
        (v) => v.clave.fila === 1 && v.clave.columna === "resto-base-liquidable"
      )?.valor
    ).toEqual({ _tag: "Centinela", centinela: "sin-limite" })
  })

  it.each([
    ["un límite NaN", tramos([NaN, "0.19"], [Infinity, "0.24"])],
    ["un límite -Infinity", tramos([12450, "0.19"], [-Infinity, "0.24"])],
    [
      "un límite infinito que no es el último",
      tramos([12450, "0.19"], [Infinity, "0.24"], [30000, "0.30"]),
    ],
    [
      "límites que no crecen",
      tramos([20000, "0.19"], [12450, "0.24"], [Infinity, "0.30"]),
    ],
    [
      "un primer límite que no supera 0",
      tramos([0, "0.19"], [Infinity, "0.24"]),
    ],
    ["un último límite finito", tramos([12450, "0.19"], [20000, "0.24"])],
    ["un tipo NaN", tramos([12450, NaN], [Infinity, "0.24"])],
    ["un tipo infinito", tramos([12450, "0.19"], [Infinity, Infinity])],
    ["ningún tramo", tramos()],
  ])("%s es un error tipado, no un centinela", (_, escala) => {
    expect(esFallo(proyectar(escala))).toMatchObject({
      _tag: "EscalaDelMotorInvalida",
    })
  })
})
