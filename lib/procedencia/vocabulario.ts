import Decimal from "decimal.js"
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

export const MagnitudEscala = Schema.Literals([
  "escala-general-estatal",
  "escala-general-autonomica",
  "escala-ahorro-estatal",
  "escala-ahorro-autonomica",
  "escala-ahorro-agregada",
])
export type MagnitudEscala = typeof MagnitudEscala.Type

export const MagnitudCuadro = Schema.Literal("minimos-personales-familiares")
export type MagnitudCuadro = typeof MagnitudCuadro.Type

export const Magnitud = Schema.Literals([
  ...MagnitudEscala.literals,
  MagnitudCuadro.literal,
])
export type Magnitud = typeof Magnitud.Type

export const ColumnaEscala = Schema.Literals([
  "base-liquidable",
  "cuota-integra",
  "resto-base-liquidable",
  "tipo-aplicable",
])
export type ColumnaEscala = typeof ColumnaEscala.Type

// Cada fila del cuadro de mínimos con las columnas que tiene en el motor: una
// columna de otra fila no forma una posición.
const posicion = <
  const F extends string,
  const C extends ReadonlyArray<string>,
>(
  fila: F,
  columnas: C
) => ({ fila: Schema.Literal(fila), columna: Schema.Literals(columnas) })
const DISCAPACIDAD = [
  "grado33Hasta65",
  "grado65OMas",
  "gastosAsistencia",
] as const
const POSICIONES = {
  contribuyente: posicion("contribuyente", [
    "general",
    "adicionalMayor65",
    "adicionalMayor75",
  ]),
  descendientes: posicion("descendientes", [
    "primero",
    "segundo",
    "tercero",
    "cuartoYSiguientes",
    "adicionalMenorTres",
  ]),
  ascendientes: posicion("ascendientes", [
    "mayor65OConDiscapacidad",
    "adicionalMayor75",
  ]),
  discapacidadContribuyente: posicion(
    "discapacidad-contribuyente",
    DISCAPACIDAD
  ),
  discapacidadDescendientes: posicion(
    "discapacidad-descendientes",
    DISCAPACIDAD
  ),
  discapacidadAscendientes: posicion("discapacidad-ascendientes", DISCAPACIDAD),
}

export const PosicionMinimo = Schema.Union([
  Schema.Struct(POSICIONES.contribuyente),
  Schema.Struct(POSICIONES.descendientes),
  Schema.Struct(POSICIONES.ascendientes),
  Schema.Struct(POSICIONES.discapacidadContribuyente),
  Schema.Struct(POSICIONES.discapacidadDescendientes),
  Schema.Struct(POSICIONES.discapacidadAscendientes),
])
export type PosicionMinimo = typeof PosicionMinimo.Type

export const OrigenMotor = Schema.Literals(["almacenado", "derivado"])
export type OrigenMotor = typeof OrigenMotor.Type

export const Unidad = Schema.Literals(["EUR", "porcentaje"])
export type Unidad = typeof Unidad.Type

// Una unidad se declara con el literal que la evidencia en la cabecera o en la
// plantilla, y sólo con uno de los suyos: los que traen las tablas de 2025.
export const UnidadDeclarada = Schema.Union([
  Schema.TaggedStruct("EUR", {
    evidencia: Schema.Literals(["(euros)", "euros"]),
  }),
  Schema.TaggedStruct("porcentaje", {
    evidencia: Schema.Literals(["(%)", "porcentaje", "Porcentaje"]),
  }),
])
export type UnidadDeclarada = typeof UnidadDeclarada.Type

export const Centinela = Schema.Literals(["sin-limite"])
export type Centinela = typeof Centinela.Type

const IndiceTramo = Schema.Int.check(Schema.isGreaterThanOrEqualTo(0))

// La magnitud discrimina la clave: en una escala la fila es el índice del
// tramo y la columna una de la escala; en el cuadro, una posición de mínimo.
export const ClaveEscala = Schema.Struct({
  territorio: Territorio,
  magnitud: MagnitudEscala,
  fila: IndiceTramo,
  columna: ColumnaEscala,
})
export type ClaveEscala = typeof ClaveEscala.Type

const deMinimos = { territorio: Territorio, magnitud: MagnitudCuadro }
const ClaveMinimo = Schema.Union([
  Schema.Struct({ ...deMinimos, ...POSICIONES.contribuyente }),
  Schema.Struct({ ...deMinimos, ...POSICIONES.descendientes }),
  Schema.Struct({ ...deMinimos, ...POSICIONES.ascendientes }),
  Schema.Struct({ ...deMinimos, ...POSICIONES.discapacidadContribuyente }),
  Schema.Struct({ ...deMinimos, ...POSICIONES.discapacidadDescendientes }),
  Schema.Struct({ ...deMinimos, ...POSICIONES.discapacidadAscendientes }),
])

export const Clave = Schema.Union([ClaveEscala, ClaveMinimo])
export type Clave = typeof Clave.Type

export const textoClave = (clave: Clave): string =>
  `${clave.territorio}|${clave.magnitud}|${clave.fila}|${clave.columna}`

export const compararTexto = (a: string, b: string): number =>
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

const DecimalCanonico = Schema.String.check(
  Schema.isPattern(/^-?(0|[1-9][0-9]*)(\.[0-9]*[1-9])?$/)
)

export const Valor = Schema.Union([
  Schema.TaggedStruct("Numero", { decimal: DecimalCanonico }),
  Schema.TaggedStruct("Centinela", { centinela: Centinela }),
])
export type Valor = typeof Valor.Type

export const mismoValor = (a: Valor, b: Valor): boolean =>
  a._tag === "Numero" && b._tag === "Numero"
    ? new Decimal(a.decimal).eq(b.decimal)
    : a._tag === "Centinela" &&
      b._tag === "Centinela" &&
      a.centinela === b.centinela

export const Sha256 = Schema.String.check(Schema.isPattern(/^[0-9a-f]{64}$/))
