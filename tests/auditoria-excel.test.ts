import { existsSync } from "node:fs"
import { resolve } from "node:path"

import ExcelJS from "exceljs"
import type { CellValue } from "exceljs"
import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  auditarRangoSalarial,
  type AnioFiscal,
} from "../lib/domain/progresividad"
import { construirLibroAuditoriaCompatible } from "../lib/export/auditoria-excel"

const HOJA_COMPARATIVA_INFLACION = "COMPARATIVA_INFLACION"
const ARCHIVO_LEGACY_EXCEL =
  "Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx"
const COMANDO_REGENERACION_LEGACY =
  "uv run --with-requirements requirements.txt python Calculo_Salario_IRPF.py"
const ANIOS_LEGACY = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  2025, 2026,
] as const satisfies ReadonlyArray<AnioFiscal>

const CABECERAS_COMPARATIVA_INFLACION = [
  "Año a Comparar",
  "Salario Equivalente (2026)",
  "Multiplicador IPC Acum.",
  "IPC Acumulado (%)",
  "Salario Bruto Nominal",
  "Coste Lab. (Euros 2026)",
  "SS Emp. (Euros 2026)",
  "SS Tra. (Euros 2026)",
  "IRPF (Euros 2026)",
  "Neto Real en su Año",
  "Neto Real en 2026",
  "Variación Poder Adquisitivo Mensual vs 2026 (12 pagas)",
  "Pérdida/Ganancia Anual Poder Adq.",
] as const

type FilaTabular = ReadonlyArray<number | string>

const rutaLegacyExcel = resolve(process.cwd(), ARCHIVO_LEGACY_EXCEL)

const regenerarFixtureLegacyExcelSiFalta = () => {
  if (existsSync(rutaLegacyExcel)) {
    return
  }

  throw new Error(
    `Falta el fixture legacy Excel ${ARCHIVO_LEGACY_EXCEL}. Regeneralo con: ${COMANDO_REGENERACION_LEGACY}`
  )
}

const obtenerHojaComparativa = (
  libro: ExcelJS.Workbook,
  origen: "legacy" | "compatible"
) => {
  const hoja = libro.getWorksheet(HOJA_COMPARATIVA_INFLACION)

  if (hoja === undefined) {
    throw new Error(
      `Falta la hoja ${HOJA_COMPARATIVA_INFLACION} en la exportacion ${origen}`
    )
  }

  return hoja
}

const valorCelda = (valor: CellValue): number | string => {
  if (valor === null || valor === undefined) {
    return ""
  }

  if (typeof valor === "number") {
    return Number(valor.toFixed(2))
  }

  if (typeof valor === "string") {
    return valor
  }

  if (valor instanceof Date) {
    return valor.toISOString()
  }

  if (typeof valor === "object" && "result" in valor) {
    return valorCelda(valor.result)
  }

  if (typeof valor === "object" && "text" in valor) {
    return valor.text
  }

  return String(valor)
}

const valoresFila = (
  hoja: ExcelJS.Worksheet,
  numeroFila: number
): FilaTabular =>
  CABECERAS_COMPARATIVA_INFLACION.map((_, indice) =>
    valorCelda(hoja.getRow(numeroFila).getCell(indice + 1).value)
  )

const filasDatos = (hoja: ExcelJS.Worksheet): ReadonlyArray<FilaTabular> => {
  const filas: Array<FilaTabular> = []

  for (let numeroFila = 2; numeroFila <= hoja.rowCount; numeroFila++) {
    const fila = valoresFila(hoja, numeroFila)
    if (fila.some((valor) => valor !== "")) {
      filas.push(fila)
    }
  }

  return filas
}

const construirFilasCompatibles = Effect.fn(
  "tests.auditoriaExcel.construirFilasCompatibles"
)(function* () {
  const filas: Array<FilaTabular> = []

  for (const anioComparado of ANIOS_LEGACY) {
    const auditoria = yield* auditarRangoSalarial({
      salarioBrutoAnualMinimoCentimos: 1_500_000,
      salarioBrutoAnualMaximoCentimos: 10_000_000,
      pasoCentimos: 100_000,
      anioComparado,
      anioReferencia: 2026,
    })
    const libro = construirLibroAuditoriaCompatible(auditoria)
    const hoja = obtenerHojaComparativa(libro, "compatible")

    expect(valoresFila(hoja, 1)).toEqual(CABECERAS_COMPARATIVA_INFLACION)
    filas.push(...filasDatos(hoja))
  }

  return filas
})

const cargarFilasLegacy = async () => {
  regenerarFixtureLegacyExcelSiFalta()

  const libro = new ExcelJS.Workbook()
  await libro.xlsx.readFile(rutaLegacyExcel)
  const hoja = obtenerHojaComparativa(libro, "legacy")

  expect(valoresFila(hoja, 1)).toEqual(CABECERAS_COMPARATIVA_INFLACION)
  return filasDatos(hoja)
}

const compararCeldaTabular = (
  fila: number,
  columna: number,
  compatible: number | string,
  legacy: number | string
) => {
  const nombreColumna = CABECERAS_COMPARATIVA_INFLACION[columna]
  const posicion = `fila ${fila + 2}, columna "${nombreColumna}"`

  if (typeof compatible !== typeof legacy) {
    throw new Error(
      `Tipo distinto en ${posicion}: compatible=${typeof compatible}, legacy=${typeof legacy}`
    )
  }

  if (typeof compatible === "number" && typeof legacy === "number") {
    const diferenciaCentimos = Math.abs(
      Math.round(compatible * 100) - Math.round(legacy * 100)
    )
    if (diferenciaCentimos > 1) {
      throw new Error(
        `Valor distinto en ${posicion}: compatible=${compatible}, legacy=${legacy}, diferenciaCentimos=${diferenciaCentimos}`
      )
    }
    return
  }

  expect(compatible, posicion).toBe(legacy)
}

const compararFilasTabulares = (
  compatibles: ReadonlyArray<FilaTabular>,
  legacy: ReadonlyArray<FilaTabular>
) => {
  expect(compatibles).toHaveLength(ANIOS_LEGACY.length * 86)
  expect(compatibles).toHaveLength(legacy.length)

  compatibles.forEach((filaCompatible, indiceFila) => {
    const filaLegacy = legacy[indiceFila]

    if (filaLegacy === undefined) {
      throw new Error(`Falta la fila legacy esperada ${indiceFila + 2}`)
    }

    expect(filaCompatible).toHaveLength(CABECERAS_COMPARATIVA_INFLACION.length)
    expect(filaCompatible).toHaveLength(filaLegacy.length)

    filaCompatible.forEach((celdaCompatible, indiceColumna) => {
      const celdaLegacy = filaLegacy[indiceColumna]
      if (celdaLegacy === undefined) {
        throw new Error(
          `Falta la celda legacy en fila ${indiceFila + 2}, columna ${indiceColumna + 1}`
        )
      }

      compararCeldaTabular(
        indiceFila,
        indiceColumna,
        celdaCompatible,
        celdaLegacy
      )
    })
  })
}

describe("construirLibroAuditoriaCompatible", () => {
  it.effect(
    "mantiene equivalencia tabular con el fixture legacy Excel en COMPARATIVA_INFLACION",
    () =>
      Effect.gen(function* () {
        const filasLegacy = yield* Effect.promise(cargarFilasLegacy)
        const filasCompatibles = yield* construirFilasCompatibles()

        compararFilasTabulares(filasCompatibles, filasLegacy)
      }),
    120_000
  )
})
