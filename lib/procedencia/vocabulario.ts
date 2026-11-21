import { Schema } from "effect"

import type { ComunidadAutonoma } from "../dominio/irpf/caso-fiscal-anual"

export const TERRITORIOS_AUTONOMICOS = [
  "andalucia",
  "aragon",
  "asturias",
  "illes-balears",
  "canarias",
  "cantabria",
  "castilla-la-mancha",
  "castilla-y-leon",
  "catalunya",
  "extremadura",
  "galicia",
  "madrid",
  "murcia",
  "la-rioja",
  "comunitat-valenciana",
  "ceuta",
  "melilla",
] as const satisfies ReadonlyArray<ComunidadAutonoma>

type TerritorioAutonomicoSinCubrir = Exclude<
  ComunidadAutonoma,
  "simulada-estatal" | (typeof TERRITORIOS_AUTONOMICOS)[number]
>
const coberturaTerritorial: [TerritorioAutonomicoSinCubrir] extends [never]
  ? true
  : never = true
void coberturaTerritorial

export const Territorio = Schema.Literals([
  "estatal",
  ...TERRITORIOS_AUTONOMICOS,
])
export type Territorio = typeof Territorio.Type

export const Magnitud = Schema.Literals([
  "escala-general-estatal",
  "escala-general-autonomica",
  "escala-ahorro-estatal",
  "escala-ahorro-autonomica",
  "escala-ahorro-agregada",
  "minimos-personales-familiares",
])
export type Magnitud = typeof Magnitud.Type

export const ColumnaEscala = Schema.Literals([
  "base-liquidable",
  "cuota-integra",
  "resto-base-liquidable",
  "tipo-aplicable",
])
export type ColumnaEscala = typeof ColumnaEscala.Type

export const FilaMinimo = Schema.Literals([
  "contribuyente",
  "descendientes",
  "ascendientes",
  "discapacidad-contribuyente",
  "discapacidad-descendientes",
  "discapacidad-ascendientes",
])
export type FilaMinimo = typeof FilaMinimo.Type

export const ColumnaMinimo = Schema.Literals([
  "general",
  "adicionalMayor65",
  "adicionalMayor75",
  "primero",
  "segundo",
  "tercero",
  "cuartoYSiguientes",
  "adicionalMenorTres",
  "mayor65OConDiscapacidad",
  "grado33Hasta65",
  "grado65OMas",
  "gastosAsistencia",
])
export type ColumnaMinimo = typeof ColumnaMinimo.Type

export const OrigenMotor = Schema.Literals(["almacenado", "derivado"])
export type OrigenMotor = typeof OrigenMotor.Type

export const Unidad = Schema.Literals(["EUR", "porcentaje"])
export type Unidad = typeof Unidad.Type

export const Centinela = Schema.Literals(["sin-limite"])
export type Centinela = typeof Centinela.Type

// En una escala la fila es el índice del tramo; en un cuadro, su nombre.
export const IndiceTramo = Schema.Int.check(Schema.isGreaterThanOrEqualTo(0))

export const Clave = Schema.Struct({
  territorio: Territorio,
  magnitud: Magnitud,
  fila: Schema.Union([IndiceTramo, FilaMinimo]),
  columna: Schema.String,
})
export type Clave = typeof Clave.Type

export const textoClave = (clave: Clave): string =>
  `${clave.territorio}|${clave.magnitud}|${clave.fila}|${clave.columna}`

const compararTexto = (a: string, b: string): number =>
  a < b ? -1 : a > b ? 1 : 0

const compararFila = (a: Clave["fila"], b: Clave["fila"]): number =>
  typeof a === "number"
    ? typeof b === "number"
      ? a - b
      : -1
    : typeof b === "number"
      ? 1
      : compararTexto(a, b)

export const compararClaves = (a: Clave, b: Clave): number =>
  compararTexto(a.territorio, b.territorio) ||
  compararTexto(a.magnitud, b.magnitud) ||
  compararFila(a.fila, b.fila) ||
  compararTexto(a.columna, b.columna)

export const DecimalCanonico = Schema.String.check(
  Schema.isPattern(/^-?(0|[1-9][0-9]*)(\.[0-9]*[1-9])?$/)
)

export const Valor = Schema.Union([
  Schema.TaggedStruct("Numero", { decimal: DecimalCanonico }),
  Schema.TaggedStruct("Centinela", { centinela: Centinela }),
])
export type Valor = typeof Valor.Type

export const Sha256 = Schema.String.check(Schema.isPattern(/^[0-9a-f]{64}$/))
