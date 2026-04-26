import { createHash } from "node:crypto"

import {
  aniosFiscalesLegacy,
  construirTablaComparativaInflacionCompatible,
  construirTablaControlGeneralCompatible,
  construirTablaControlTramosIrpfCompatible,
  construirTablaDetalleAnualCompatible,
  type AnioFiscal,
  type TablaCompatible,
  type ValorCeldaCompatible,
} from "../../lib/domain/progresividad"

export type { ValorCeldaCompatible } from "../../lib/domain/progresividad"

export const ARCHIVO_LEGACY_EXCEL =
  "Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx"

export const HOJAS_LEGACY_COMPLETAS = [
  "CONTROL_GENERAL",
  "CONTROL_TRAMOS_IRPF",
  "COMPARATIVA_INFLACION",
  ...aniosFiscalesLegacy.map((anio) => `DAT_${anio}`),
] as const

export interface HashHojaLegacyDerivada {
  readonly name: string
  readonly columns: number
  readonly dataRows: number
  readonly headerHash: string
  readonly dataHash: string
  readonly tolerancePatches?: ReadonlyArray<PatchToleranciaCentimo>
}

export interface PatchToleranciaCentimo {
  readonly row: number
  readonly column: number
  readonly legacyCents: number
}

export interface FixtureLegacyDerivado {
  readonly schemaVersion: 1
  readonly source: string
  readonly canonicalization: string
  readonly sheets: ReadonlyArray<HashHojaLegacyDerivada>
}

export interface AcumuladorHashTabular {
  readonly anadirFilaDatos: (fila: ReadonlyArray<ValorCeldaCompatible>) => void
  readonly finalizar: () => Omit<HashHojaLegacyDerivada, "name">
}

const normalizarValor = (valor: ValorCeldaCompatible) => {
  if (typeof valor === "number") {
    return `n:${valorACentimos(valor)}`
  }

  return `s:${valor.length}:${valor}`
}

export const valorACentimos = (valor: number) =>
  Math.round(Number(valor.toFixed(2)) * 100)

const anadirFila = (
  hash: ReturnType<typeof createHash>,
  fila: ReadonlyArray<ValorCeldaCompatible>
) => {
  hash.update(`r:${fila.length}\n`)
  for (const valor of fila) {
    hash.update(normalizarValor(valor))
    hash.update("\u001f")
  }
  hash.update("\n")
}

export const hashFilasTabulares = (
  cabeceras: ReadonlyArray<ValorCeldaCompatible>,
  filas: Iterable<ReadonlyArray<ValorCeldaCompatible>>
): HashHojaLegacyDerivada => {
  const acumulador = crearAcumuladorHashTabular(cabeceras)
  for (const fila of filas) {
    acumulador.anadirFilaDatos(fila)
  }

  return {
    name: "",
    ...acumulador.finalizar(),
  }
}

export const crearAcumuladorHashTabular = (
  cabeceras: ReadonlyArray<ValorCeldaCompatible>
): AcumuladorHashTabular => {
  const headerHash = createHash("sha256")
  const dataHash = createHash("sha256")
  let dataRows = 0

  anadirFila(headerHash, cabeceras)

  return {
    anadirFilaDatos: (fila) => {
      anadirFila(dataHash, fila)
      dataRows += 1
    },
    finalizar: () => ({
      columns: cabeceras.length,
      dataRows,
      headerHash: headerHash.digest("hex"),
      dataHash: dataHash.digest("hex"),
    }),
  }
}

export const tablaEsperadaPorHoja = (nombreHoja: string): TablaCompatible => {
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

export const hashTablaCompatible = (
  nombreHoja: string,
  tabla: TablaCompatible
): HashHojaLegacyDerivada => ({
  ...hashFilasTabulares(tabla.cabeceras, tabla.filas),
  name: nombreHoja,
})

const aplicarParchesTolerancia = (
  nombreHoja: string,
  fila: ReadonlyArray<ValorCeldaCompatible>,
  numeroFilaDatos: number,
  parches: ReadonlyMap<string, PatchToleranciaCentimo>
) =>
  fila.map((valor, indice) => {
    const parche = parches.get(`${numeroFilaDatos}:${indice + 1}`)
    if (parche === undefined) {
      return valor
    }
    if (typeof valor !== "number") {
      throw new Error(
        `Parche de tolerancia numerica aplicado a celda no numerica en ${nombreHoja} fila ${numeroFilaDatos}, columna ${indice + 1}`
      )
    }
    const diferenciaCentimos = Math.abs(
      valorACentimos(valor) - parche.legacyCents
    )
    if (diferenciaCentimos > 1) {
      throw new Error(
        `Parche de tolerancia excedido en ${nombreHoja} fila ${numeroFilaDatos}, columna ${indice + 1}: esperado=${parche.legacyCents}, actual=${valorACentimos(valor)}`
      )
    }
    return parche.legacyCents / 100
  })

export const hashTablaCompatibleConParches = (
  nombreHoja: string,
  tabla: TablaCompatible,
  parches: ReadonlyArray<PatchToleranciaCentimo> = []
): HashHojaLegacyDerivada => {
  const parchesPorCelda = new Map(
    parches.map((parche) => [`${parche.row}:${parche.column}`, parche])
  )
  const acumulador = crearAcumuladorHashTabular(tabla.cabeceras)
  let numeroFilaDatos = 0

  for (const fila of tabla.filas) {
    numeroFilaDatos += 1
    acumulador.anadirFilaDatos(
      aplicarParchesTolerancia(
        nombreHoja,
        fila,
        numeroFilaDatos,
        parchesPorCelda
      )
    )
  }

  return {
    name: nombreHoja,
    ...acumulador.finalizar(),
    ...(parches.length > 0 ? { tolerancePatches: parches } : {}),
  }
}

export const construirFixtureDerivadoDesdeTablasEffect =
  (): FixtureLegacyDerivado => ({
    schemaVersion: 1,
    source: ARCHIVO_LEGACY_EXCEL,
    canonicalization: "tipo+valor-tabular-normalizado-a-2-decimales-v1",
    sheets: HOJAS_LEGACY_COMPLETAS.map((nombreHoja) =>
      hashTablaCompatible(nombreHoja, tablaEsperadaPorHoja(nombreHoja))
    ),
  })
