import { construirTablaControlGeneralCompatible } from "../../lib/dominio/analisis-salarial/progresividad-frio"
import { createHash } from "node:crypto"

import { Match, Schema } from "effect"

import {
  aniosFiscalesLegacy,
  type TablaCompatible,
  type ValorCeldaCompatible,
} from "../../lib/dominio/analisis-salarial/progresividad-frio"

export type { ValorCeldaCompatible } from "../../lib/dominio/analisis-salarial/progresividad-frio"

export const ARCHIVO_LEGACY_EXCEL =
  "Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx"

export const HOJAS_LEGACY_COMPLETAS = [
  "CONTROL_GENERAL",
  "CONTROL_TRAMOS_IRPF",
  "COMPARATIVA_INFLACION",
  ...aniosFiscalesLegacy.map((anio) => `DAT_${anio}`),
] as const

export const HashHojaCanonicaSchema = Schema.Struct({
  name: Schema.String,
  columns: Schema.Number,
  dataRows: Schema.Number,
  headerHash: Schema.String,
  dataHash: Schema.String,
})
export type HashHojaCanonica = typeof HashHojaCanonicaSchema.Type
export const FixtureCanonicoTabularSchema = Schema.Struct({
  schemaVersion: Schema.Literal(1),
  source: Schema.String,
  canonicalization: Schema.String,
  sheets: Schema.Array(HashHojaCanonicaSchema),
})
export type FixtureCanonicoTabular = typeof FixtureCanonicoTabularSchema.Type

export interface AcumuladorHashTabular {
  readonly anadirFilaDatos: (fila: ReadonlyArray<ValorCeldaCompatible>) => void
  readonly finalizar: () => Omit<HashHojaCanonica, "name">
}

const normalizarValor = (valor: ValorCeldaCompatible) => {
  if (Match.number(valor)) {
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
): HashHojaCanonica => {
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

export const hashTablaCompatible = (
  nombreHoja: string,
  tabla: TablaCompatible
): HashHojaCanonica => ({
  ...hashFilasTabulares(tabla.cabeceras, tabla.filas),
  name: nombreHoja,
})

export const hashTablaCompatibleExacta = (
  nombreHoja: string,
  tabla: TablaCompatible
): HashHojaCanonica => {
  const acumulador = crearAcumuladorHashTabular(tabla.cabeceras)

  for (const fila of tabla.filas) {
    acumulador.anadirFilaDatos(fila)
  }

  return {
    name: nombreHoja,
    ...acumulador.finalizar(),
  }
}

/** Solo metadatos: las hojas salariales históricas ya no se regeneran. */
export const tablaEsperadaPorHoja = (nombre: string): TablaCompatible => {
  if (nombre === "CONTROL_GENERAL")
    return construirTablaControlGeneralCompatible()
  throw new Error("La tabulación salarial histórica está retirada")
}
