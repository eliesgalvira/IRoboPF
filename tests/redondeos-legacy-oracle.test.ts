import { describe, expect, it } from "@effect/vitest"
import { construirTablaDetalleAnualCompatible } from "../lib/dominio/compatibilidad-legacy/progresividad-frio"

const fila = (salario: number) =>
  Array.from(
    construirTablaDetalleAnualCompatible(2012, {
      salarioMinimoEuros: salario,
      salarioMaximoEuros: salario,
      pasoEuros: 1,
    }).filas
  )[0]

describe("contraejemplos independientes Excel (valores, no fórmulas)", () => {
  it("D32: NumPy 30 × 0,0635", () => expect(fila(30)[3]).toBe(1.9))
  it("E12: resta antes de redondear", () =>
    expect(fila(10)[4]).toBeCloseTo(9.359999999999999, 12))
  it("W12: neto antes de redondear", () =>
    expect(fila(10)[22]).toBeCloseTo(9.359999999999999, 12))
  it("Q2: control que ya coincide", () => expect(fila(0)[16]).toBe(1274.87))
})

import excel from "../docs/procedencia/implementaciones/redondeos-legacy/excel.json"
import {
  construirTablaControlGeneralCompatible,
  construirTablaControlTramosIrpfCompatible,
} from "../lib/dominio/compatibilidad-legacy/progresividad-frio"

it("conserva cabeceras y las 543 celdas de control del original", () => {
  let celdas = 0
  for (const [tabla, original] of [
    [construirTablaControlGeneralCompatible(), excel.hojas.CONTROL_GENERAL],
    [
      construirTablaControlTramosIrpfCompatible(),
      excel.hojas.CONTROL_TRAMOS_IRPF,
    ],
  ] as const) {
    expect(tabla.cabeceras).toEqual(original[0])
    expect(Array.from(tabla.filas)).toEqual(original.slice(1))
    celdas += original.slice(1).reduce((n, row) => n + row.length, 0)
  }
  expect(celdas).toBe(543)
})

it("reproduce todas las celdas de DAT_2012, salarios 0–100, sin tolerancia de céntimo", () => {
  const tabla = construirTablaDetalleAnualCompatible(2012, {
    salarioMinimoEuros: 0,
    salarioMaximoEuros: 100,
    pasoEuros: 1,
  })
  expect(tabla.cabeceras).toEqual(excel.hojas.DAT_2012[0])
  const filas = Array.from(tabla.filas)
  expect(filas.length).toBe(101)
  for (const [i, row] of filas.entries()) {
    for (const [j, value] of row.entries()) {
      const original = excel.hojas.DAT_2012[i + 1][j]
      expect(Number(value), `fila ${i + 2}, columna ${j + 1}`).toBeCloseTo(
        Number(original),
        10
      )
    }
  }
})

import python from "../docs/procedencia/implementaciones/redondeos-legacy/python-oracle.json"
import { aniosFiscalesLegacy } from "../lib/dominio/compatibilidad-legacy/progresividad-frio"

it("contrasta 15 años con cuerpos Python originales ejecutados en rango acotado", () => {
  for (const anio of aniosFiscalesLegacy) {
    for (const [i, salario] of python.salarios.entries()) {
      const tabla = construirTablaDetalleAnualCompatible(anio, {
        salarioMinimoEuros: salario,
        salarioMaximoEuros: salario,
        pasoEuros: 1,
      })
      const original = python.filas[anio][i]
      expect(tabla.cabeceras).toEqual(Object.keys(original))
      expect(Array.from(tabla.filas)[0], `${anio}, salario ${salario}`).toEqual(
        Object.values(original)
      )
    }
  }
})

import ampliado from "../docs/procedencia/implementaciones/redondeos-legacy/excel-ampliado.json"

it("contrasta el desacuerdo de caracterización con la fila 20002 del libro", () => {
  expect(fila(20000)).toEqual(ampliado.hojas.DAT_2012.at(-1))
})
