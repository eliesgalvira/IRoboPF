import Decimal from "decimal.js"
import { Result } from "effect"

import type { Centinela, Valor } from "./vocabulario"

const ESPACIO_DURO = /\u00a0/g
const ESPACIOS_HTML = /[ \t\n\f\r]+/g
const ESPACIO_EN_EXTREMO = /^ | $/g
const NO_ADMITIDO = /(?! )[\p{White_Space}\p{Cc}\p{Cf}]/u

// Normalización canónica: espacio duro a espacio, cada corrida de espacios
// HTML a un espacio y, en los extremos, sin ese espacio. Nada más: cualquier
// otro carácter, también en los extremos, queda como está. Las entidades ya
// llegan decodificadas por el analizador.
export const normalizar = (texto: string): string =>
  texto
    .replace(ESPACIO_DURO, " ")
    .replace(ESPACIOS_HTML, " ")
    .replace(ESPACIO_EN_EXTREMO, "")

// Un literal normalizado no admite otro espacio Unicode ni caracteres de
// control o de formato; devuelve el primero que encuentra como U+XXXX.
export const caracterNoAdmitido = (texto: string): string | undefined => {
  const encontrado = NO_ADMITIDO.exec(texto)?.[0]
  return encontrado === undefined
    ? undefined
    : `U+${(encontrado.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`
}

export interface GramaticaNumero {
  readonly decimales: ReadonlyArray<number>
  readonly sufijo?: string | undefined
  readonly centinelas: ReadonlyArray<{
    readonly literal: string
    readonly centinela: Centinela
  }>
}

export interface LiteralLeido {
  readonly valor: Valor
  readonly literalTestigo: string
}

const NUMERO_ESPANOL = /^(0|[1-9][0-9]{0,2}(?:\.[0-9]{3})*)(?:,([0-9]+))?$/

export const leerLiteral = (
  literal: string,
  gramatica: GramaticaNumero
): Result.Result<LiteralLeido, string> => {
  const centinela = gramatica.centinelas.find(
    (declarado) => declarado.literal === literal
  )
  if (centinela !== undefined) {
    return Result.succeed({
      valor: { _tag: "Centinela", centinela: centinela.centinela },
      literalTestigo: literal,
    })
  }
  const sufijo = gramatica.sufijo ?? ""
  if (!literal.endsWith(sufijo)) {
    return Result.fail(`falta el sufijo declarado «${sufijo}»`)
  }
  const numero = literal.slice(0, literal.length - sufijo.length)
  const partes = NUMERO_ESPANOL.exec(numero)
  if (partes === null) {
    return Result.fail(
      sufijo === ""
        ? "no es un número en formato español estricto sin sufijo"
        : "no es un número en formato español estricto seguido del sufijo declarado"
    )
  }
  const entera = partes[1] ?? ""
  const fraccion = partes[2] ?? ""
  if (!gramatica.decimales.includes(fraccion.length)) {
    return Result.fail(
      `tiene ${fraccion.length} decimales y la gramática admite ${gramatica.decimales.join(" o ")}`
    )
  }
  const decimal = new Decimal(
    `${entera.replaceAll(".", "")}${fraccion === "" ? "" : `.${fraccion}`}`
  )
  return Result.succeed({
    valor: { _tag: "Numero", decimal: decimal.toFixed() },
    literalTestigo: numero,
  })
}

const TOKEN_NUMERICO = /[0-9](?:[0-9.,]*[0-9])?/g

// Un token numérico es una secuencia maximal de dígitos con «.» o «,»
// interiores; un literal sólo cuenta si coincide con un token entero.
export const tokensNumericos = (texto: string): ReadonlyArray<string> =>
  Array.from(texto.matchAll(TOKEN_NUMERICO), (coincidencia) => coincidencia[0])
