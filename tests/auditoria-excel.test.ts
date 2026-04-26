import ExcelJS from "exceljs"
import type { CellValue } from "exceljs"
import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  auditarRangoSalarial,
  type AnioFiscal,
} from "../lib/domain/progresividad"
import {
  construirBlobXlsxCompatibleConProgreso,
  construirLibroAuditoriaCompatible,
  construirLibroAuditoriaCompatibleConProgreso,
  type ProgresoExportacionCompatible,
} from "../lib/export/auditoria-excel"

const HOJA_COMPARATIVA_INFLACION = "COMPARATIVA_INFLACION"
const ANIOS_LEGACY = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  2025, 2026,
] as const satisfies ReadonlyArray<AnioFiscal>

const HOJAS_LEGACY_COMPLETAS = [
  "CONTROL_GENERAL",
  "CONTROL_TRAMOS_IRPF",
  HOJA_COMPARATIVA_INFLACION,
  ...ANIOS_LEGACY.map((anio) => `DAT_${anio}`),
] as const

const OPCIONES_FIXTURE_RAPIDO = {
  detalle: {
    salarioMaximoEuros: 2,
  },
} as const

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
  const auditoria = yield* auditarRangoSalarial({
    salarioBrutoAnualMinimoCentimos: 1_500_000,
    salarioBrutoAnualMaximoCentimos: 1_500_000,
    pasoCentimos: 100_000,
    anioComparado: 2012,
    anioReferencia: 2026,
  })
  const libro = construirLibroAuditoriaCompatible(
    auditoria,
    OPCIONES_FIXTURE_RAPIDO
  )
  const hoja = obtenerHojaComparativa(libro, "compatible")

  expect(valoresFila(hoja, 1)).toEqual(CABECERAS_COMPARATIVA_INFLACION)
  return filasDatos(hoja)
})

describe("construirLibroAuditoriaCompatible", () => {
  it.effect("genera la estructura completa de hojas del Excel legacy", () =>
    Effect.gen(function* () {
      const auditoria = yield* auditarRangoSalarial({
        salarioBrutoAnualMinimoCentimos: 1_500_000,
        salarioBrutoAnualMaximoCentimos: 1_500_000,
        pasoCentimos: 100_000,
        anioComparado: 2012,
        anioReferencia: 2026,
      })
      const libro = construirLibroAuditoriaCompatible(
        auditoria,
        OPCIONES_FIXTURE_RAPIDO
      )

      expect(libro.worksheets.map((hoja) => hoja.name)).toEqual(
        HOJAS_LEGACY_COMPLETAS
      )
    })
  )

  it.effect(
    "genera la estructura completa de forma incremental con progreso",
    () =>
      Effect.gen(function* () {
        const auditoria = yield* auditarRangoSalarial({
          salarioBrutoAnualMinimoCentimos: 1_500_000,
          salarioBrutoAnualMaximoCentimos: 1_500_000,
          pasoCentimos: 100_000,
          anioComparado: 2012,
          anioReferencia: 2026,
        })
        const eventos: Array<ProgresoExportacionCompatible> = []
        const libro = yield* construirLibroAuditoriaCompatibleConProgreso(
          auditoria,
          {
            ...OPCIONES_FIXTURE_RAPIDO,
            filasPorBloque: 500,
            onProgreso: (progreso) => eventos.push(progreso),
          }
        )

        expect(libro.worksheets.map((hoja) => hoja.name)).toEqual(
          HOJAS_LEGACY_COMPLETAS
        )
        expect(eventos.some((evento) => evento.hoja === "DAT_2026")).toBe(true)
        expect(eventos.at(-1)?.porcentaje).toBe(100)
      })
  )

  it.effect(
    "genera un XLSX compatible progresivo sin retener un Workbook ExcelJS",
    () =>
      Effect.gen(function* () {
        const eventos: Array<ProgresoExportacionCompatible> = []
        const archivo = yield* construirBlobXlsxCompatibleConProgreso(
          {
            ...OPCIONES_FIXTURE_RAPIDO,
            filasPorBloque: 2,
            onProgreso: (progreso) => eventos.push(progreso),
          },
          0
        )
        const libro = new ExcelJS.Workbook()
        yield* Effect.promise(() => archivo.arrayBuffer()).pipe(
          Effect.flatMap((buffer) =>
            Effect.promise(() => libro.xlsx.load(buffer))
          )
        )

        expect(libro.worksheets.map((hoja) => hoja.name)).toEqual(
          HOJAS_LEGACY_COMPLETAS
        )
        expect(libro.getWorksheet("DAT_2026")?.rowCount).toBe(4)
        expect(eventos.at(-1)?.porcentaje).toBe(100)
        expect(
          eventos.at(-1)?.milisegundosTranscurridos
        ).toBeGreaterThanOrEqual(0)
      })
  )

  it.effect(
    "incluye hojas de control normativo compatibles con el legacy",
    () =>
      Effect.gen(function* () {
        const auditoria = yield* auditarRangoSalarial({
          salarioBrutoAnualMinimoCentimos: 1_500_000,
          salarioBrutoAnualMaximoCentimos: 1_500_000,
          pasoCentimos: 100_000,
          anioComparado: 2012,
          anioReferencia: 2026,
        })
        const libro = construirLibroAuditoriaCompatible(
          auditoria,
          OPCIONES_FIXTURE_RAPIDO
        )
        const controlGeneral = libro.getWorksheet("CONTROL_GENERAL")
        const controlTramos = libro.getWorksheet("CONTROL_TRAMOS_IRPF")

        expect(controlGeneral?.getRow(1).values).toEqual([
          ,
          "Año",
          "Base Máx. Anual",
          "SS Empleador %",
          "SS Empleado %",
          "MEI Empleador %",
          "MEI Empleado %",
          "Gastos Fijos Art.19",
          "Mín. Contribuyente",
          "Mín. Exento Retención",
          "Art.20 Umbral Inf",
          "Art.20 Red. Máxima",
          "Art.20 Umbral Sup",
          "Art.20 Red. Mínima",
        ])
        expect(controlGeneral?.getRow(2).values).toEqual([
          ,
          2012,
          39150,
          31.4,
          6.35,
          0,
          0,
          0,
          5151,
          11162,
          9180,
          4080,
          13260,
          2652,
        ])
        expect(controlGeneral?.getRow(8).getCell(10).value).toBe("Transitorio")

        expect(controlTramos?.getRow(1).values).toEqual([
          ,
          "Año",
          "Nº Tramo",
          "Hasta Base",
          "Tipo %",
        ])
        expect(controlTramos?.getRow(2).values).toEqual([
          ,
          2012,
          1,
          17707,
          24.75,
        ])
        expect(controlTramos?.getRow(8).values).toEqual([
          ,
          2012,
          7,
          "En adelante",
          52,
        ])
      })
  )

  it.effect(
    "incluye las columnas detalladas DAT_YYYY con granularidad anual legacy",
    () =>
      Effect.gen(function* () {
        const auditoria = yield* auditarRangoSalarial({
          salarioBrutoAnualMinimoCentimos: 1_500_000,
          salarioBrutoAnualMaximoCentimos: 1_500_000,
          pasoCentimos: 100_000,
          anioComparado: 2012,
          anioReferencia: 2026,
        })
        const libro = construirLibroAuditoriaCompatible(
          auditoria,
          OPCIONES_FIXTURE_RAPIDO
        )
        const hoja2026 = libro.getWorksheet("DAT_2026")

        expect(hoja2026?.rowCount).toBe(4)
        expect(hoja2026?.getRow(1).values).toEqual([
          ,
          "Salario Bruto",
          "Cot. Soc. Empresa",
          "Coste Laboral",
          "Cot. Soc. Trab.",
          "Ren. Previo",
          "Gastos Fijos",
          "Red. Ren. Trab.",
          "Base Imponible",
          "T1 (19.0%)",
          "T2 (24.0%)",
          "T3 (30.0%)",
          "T4 (37.0%)",
          "T5 (45.0%)",
          "T6 (47.0%)",
          "Cuota Íntegra",
          "Cuota Mínimo Personal",
          "Cuota Teórica",
          "Deducción SMI",
          "Cuota tras SMI",
          "Límite 43% (Art 85.3)",
          "IRPF Final",
          "Salario Neto",
        ])
        expect(hoja2026?.getRow(2).values).toEqual([
          ,
          0,
          0,
          0,
          0,
          0,
          2000,
          7302,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          1054.5,
          0,
          590.89,
          0,
          0,
          0,
          0,
        ])
      })
  )

  it.effect("mantiene la granularidad legacy en COMPARATIVA_INFLACION", () =>
    Effect.gen(function* () {
      const filasCompatibles = yield* construirFilasCompatibles()

      expect(filasCompatibles).toHaveLength(ANIOS_LEGACY.length * 86)
      expect(filasCompatibles[0]).toHaveLength(
        CABECERAS_COMPARATIVA_INFLACION.length
      )
    })
  )
})
