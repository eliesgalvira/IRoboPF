import { existsSync } from "node:fs"
import { resolve } from "node:path"

import ExcelJS from "exceljs"
import type { CellValue } from "exceljs"
import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  aniosFiscalesLegacy,
  construirTablaComparativaInflacionCompatible,
  construirTablaControlGeneralCompatible,
  construirTablaControlTramosIrpfCompatible,
  construirTablaDetalleAnualCompatible,
  type AnioFiscal,
  type TablaCompatible,
} from "../lib/domain/progresividad"

const ARCHIVO_LEGACY_EXCEL =
  "Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx"
const COMANDO_REGENERACION_LEGACY =
  "uv run --with-requirements requirements.txt python Calculo_Salario_IRPF.py"
const EJECUTAR_VALIDACION_PESADA =
  process.env.IROBOPF_VALIDACION_LEGACY_COMPLETA === "1"

const rutaLegacyExcel = resolve(process.cwd(), ARCHIVO_LEGACY_EXCEL)

const HOJAS_LEGACY_COMPLETAS = [
  "CONTROL_GENERAL",
  "CONTROL_TRAMOS_IRPF",
  "COMPARATIVA_INFLACION",
  ...aniosFiscalesLegacy.map((anio) => `DAT_${anio}`),
] as const

type ValorTabular = number | string
type HojaLegacy = ExcelJS.stream.xlsx.WorksheetReader & {
  readonly name: string
}

const valorCelda = (valor: CellValue): ValorTabular => {
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
  fila: ExcelJS.Row,
  numeroColumnas: number
): ReadonlyArray<ValorTabular> =>
  Array.from({ length: numeroColumnas }, (_, indice) =>
    valorCelda(fila.getCell(indice + 1).value)
  )

const normalizarEsperado = (valor: ValorTabular): ValorTabular => {
  if (typeof valor === "number") {
    return Number(valor.toFixed(2))
  }

  return valor
}

const compararCelda = (
  hoja: string,
  fila: number,
  columna: number,
  legacy: ValorTabular,
  esperado: ValorTabular
) => {
  const posicion = `${hoja} fila ${fila}, columna ${columna}`

  if (typeof legacy !== typeof esperado) {
    throw new Error(
      `Tipo distinto en ${posicion}: legacy=${typeof legacy}, esperado=${typeof esperado}, legacyValor=${legacy}, esperadoValor=${esperado}`
    )
  }

  if (typeof legacy === "number" && typeof esperado === "number") {
    const diferenciaCentimos = Math.abs(
      Math.round(legacy * 100) - Math.round(esperado * 100)
    )
    if (diferenciaCentimos > 1) {
      throw new Error(
        `Valor distinto en ${posicion}: legacy=${legacy}, esperado=${esperado}, diferenciaCentimos=${diferenciaCentimos}`
      )
    }
    return
  }

  expect(legacy, posicion).toBe(esperado)
}

const tablaEsperadaPorHoja = (nombreHoja: string): TablaCompatible => {
  if (nombreHoja === "CONTROL_GENERAL") {
    return construirTablaControlGeneralCompatible()
  }

  if (nombreHoja === "CONTROL_TRAMOS_IRPF") {
    return construirTablaControlTramosIrpfCompatible()
  }

  if (nombreHoja === "COMPARATIVA_INFLACION") {
    return construirTablaComparativaInflacionCompatible()
  }

  if (nombreHoja.startsWith("DAT_")) {
    return construirTablaDetalleAnualCompatible(
      Number(nombreHoja.slice(4)) as AnioFiscal
    )
  }

  throw new Error(`Hoja legacy no esperada: ${nombreHoja}`)
}

const compararFila = (
  hoja: string,
  numeroFila: number,
  legacy: ReadonlyArray<ValorTabular>,
  esperada: ReadonlyArray<ValorTabular>
) => {
  expect(legacy, `${hoja} fila ${numeroFila}`).toHaveLength(esperada.length)

  esperada.forEach((valorEsperado, indice) => {
    compararCelda(
      hoja,
      numeroFila,
      indice + 1,
      legacy[indice] ?? "",
      normalizarEsperado(valorEsperado)
    )
  })
}

const compararHoja = async (hojaLegacy: HojaLegacy) => {
  const tablaEsperada = tablaEsperadaPorHoja(hojaLegacy.name)
  const filasEsperadas = tablaEsperada.filas[Symbol.iterator]()
  let numeroFila = 0
  let filasDatos = 0

  for await (const filaLegacy of hojaLegacy) {
    numeroFila += 1

    if (numeroFila === 1) {
      compararFila(
        hojaLegacy.name,
        numeroFila,
        valoresFila(filaLegacy, tablaEsperada.cabeceras.length),
        tablaEsperada.cabeceras
      )
      continue
    }

    const siguienteEsperada = filasEsperadas.next()
    if (siguienteEsperada.done === true) {
      throw new Error(
        `La hoja ${hojaLegacy.name} tiene mas filas legacy que filas Effect esperadas`
      )
    }

    filasDatos += 1
    compararFila(
      hojaLegacy.name,
      numeroFila,
      valoresFila(filaLegacy, tablaEsperada.cabeceras.length),
      siguienteEsperada.value
    )
  }

  const sobrante = filasEsperadas.next()
  if (sobrante.done !== true) {
    throw new Error(
      `La hoja ${hojaLegacy.name} tiene menos filas legacy que filas Effect esperadas`
    )
  }

  return filasDatos
}

const hojaConNombreLegacy = (
  hojaLegacy: ExcelJS.stream.xlsx.WorksheetReader,
  nombreHoja: string
): HojaLegacy => {
  Object.assign(hojaLegacy, { name: nombreHoja })
  return hojaLegacy as HojaLegacy
}

const validarFixtureLegacyCompleto = Effect.fn(
  "tests.auditoriaExcelPesada.validarFixtureLegacyCompleto"
)(function* () {
  if (!existsSync(rutaLegacyExcel)) {
    throw new Error(
      `Falta el fixture legacy Excel ${ARCHIVO_LEGACY_EXCEL}. Regeneralo con: ${COMANDO_REGENERACION_LEGACY}`
    )
  }

  yield* Effect.promise(async () => {
    const hojasLeidas = new Array<string>()
    const filasPorHoja = new Map<string, number>()
    const lector = new ExcelJS.stream.xlsx.WorkbookReader(rutaLegacyExcel, {
      worksheets: "emit",
      sharedStrings: "cache",
      styles: "ignore",
      hyperlinks: "ignore",
    })

    for await (const hojaLegacy of lector) {
      const nombreEsperado = HOJAS_LEGACY_COMPLETAS[hojasLeidas.length]
      if (nombreEsperado === undefined) {
        throw new Error("El fixture legacy contiene mas hojas de las esperadas")
      }

      const hoja = hojaConNombreLegacy(hojaLegacy, nombreEsperado)
      hojasLeidas.push(nombreEsperado)
      const filas = await compararHoja(hoja)
      filasPorHoja.set(nombreEsperado, filas)
    }

    expect(hojasLeidas).toEqual(HOJAS_LEGACY_COMPLETAS)
    expect(filasPorHoja.get("CONTROL_GENERAL")).toBe(15)
    expect(filasPorHoja.get("COMPARATIVA_INFLACION")).toBe(1_290)
    expect(filasPorHoja.get("DAT_2012")).toBe(100_001)
    expect(filasPorHoja.get("DAT_2026")).toBe(100_001)
  })
})

const pruebaPesada = EJECUTAR_VALIDACION_PESADA ? it.effect : it.effect.skip

describe("validacion pesada de equivalencia tabular legacy", () => {
  pruebaPesada(
    "compara el fixture Excel completo contra las tablas Effect",
    () => validarFixtureLegacyCompleto(),
    900_000
  )
})
