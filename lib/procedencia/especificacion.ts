import { Schema } from "effect"

import { caracterNoAdmitido, normalizar } from "./literales"
import {
  Centinela,
  ColumnaEscala,
  MagnitudCuadro,
  MagnitudEscala,
  PosicionMinimo,
  Sha256,
  Territorio,
  UnidadDeclarada,
} from "./vocabulario"

export const HUECO_IMPORTE = "{importe}"

const LiteralCanonico = Schema.String.check(
  Schema.makeFilter((texto: string) => {
    if (texto === "" || normalizar(texto) !== texto) {
      return "el literal debe estar no vacío y en forma normalizada (sin espacios duros, sin espacios repetidos ni en los extremos)"
    }
    const caracter = caracterNoAdmitido(texto)
    return caracter === undefined
      ? undefined
      : `el literal contiene ${caracter}, que no es un carácter admitido`
  })
)

const IdTabla = Schema.String.check(
  Schema.isPattern(/^[a-z0-9]+(-[a-z0-9]+)*$/)
)

const Pagina = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1))

const Gramatica = Schema.Struct({
  decimales: Schema.NonEmptyArray(
    Schema.Int.check(Schema.isGreaterThanOrEqualTo(0))
  ),
  sufijo: Schema.optionalKey(LiteralCanonico),
  centinelas: Schema.Array(
    Schema.Struct({ literal: LiteralCanonico, centinela: Centinela })
  ),
})

const LocalizadorTabla = Schema.Union([
  Schema.TaggedStruct("UnicaTablaDelDocumento", {}),
  Schema.TaggedStruct("Caption", { literal: LiteralCanonico }),
])
export type LocalizadorTabla = typeof LocalizadorTabla.Type

const DocumentoHtml = Schema.Struct({
  sha256: Sha256,
  localizador: LocalizadorTabla,
})

const sinRepetidos =
  <T>(nombre: string, clave: (elemento: T) => string) =>
  (elementos: ReadonlyArray<T>) =>
    new Set(elementos.map(clave)).size === elementos.length
      ? undefined
      : `${nombre} repetido`

const TestigoPdf = Schema.Struct({
  sha256: Sha256,
  paginas: Schema.NonEmptyArray(Pagina).check(
    Schema.makeFilter(
      sinRepetidos("número de página", (p: number) => String(p))
    )
  ),
})

// La evidencia ha de aparecer entera en el texto fijo, sin una letra ni una
// cifra pegada a ningún lado: «euros.» la contiene, «eurosistema» no.
const LETRA_O_CIFRA = /[\p{L}\p{N}]/u
const tienePalabra = (texto: string, palabra: string): boolean => {
  for (
    let indice = texto.indexOf(palabra);
    indice !== -1;
    indice = texto.indexOf(palabra, indice + 1)
  ) {
    if (
      !LETRA_O_CIFRA.test(texto.charAt(indice - 1)) &&
      !LETRA_O_CIFRA.test(texto.charAt(indice + palabra.length))
    ) {
      return true
    }
  }
  return false
}

const ColumnaEscalaDeclarada = Schema.Struct({
  cabecera: LiteralCanonico,
  columna: ColumnaEscala,
  unidad: UnidadDeclarada,
  gramatica: Gramatica,
}).check(
  Schema.makeFilter((columna) =>
    tienePalabra(columna.cabecera, columna.unidad.evidencia)
      ? undefined
      : `la evidencia de unidad «${columna.unidad.evidencia}» no es una palabra de la cabecera «${columna.cabecera}»`
  )
)

export const EspecificacionEscala = Schema.Struct({
  tipo: Schema.Literal("escala"),
  tabla: IdTabla,
  magnitud: MagnitudEscala,
  territorios: Schema.NonEmptyArray(Territorio).check(
    Schema.makeFilter(sinRepetidos("territorio", (t: string) => t))
  ),
  documento: DocumentoHtml,
  columnas: Schema.NonEmptyArray(ColumnaEscalaDeclarada).check(
    Schema.makeFilter(
      sinRepetidos("cabecera", (c: { readonly cabecera: string }) => c.cabecera)
    ),
    Schema.makeFilter(
      sinRepetidos("columna", (c: { readonly columna: string }) => c.columna)
    ),
    // Sin base y resto no se puede comprobar que los tramos encadenan.
    Schema.makeFilter(
      (columnas: ReadonlyArray<{ readonly columna: string }>) =>
        ["base-liquidable", "resto-base-liquidable"].every((requerida) =>
          columnas.some((c) => c.columna === requerida)
        )
          ? undefined
          : "una escala ha de declarar las columnas base-liquidable y resto-base-liquidable"
    )
  ),
  testigo: TestigoPdf,
})
export type EspecificacionEscala = typeof EspecificacionEscala.Type

const IdNota = Schema.String.check(Schema.isPattern(/^[a-z0-9]+(-[a-z0-9]+)*$/))

// De dónde sale a qué beneficiario y condición se refiere un importe: de la
// cabecera de su columna o de una nota anterior de la misma celda.
const Alcance = Schema.Union([
  Schema.TaggedStruct("CabeceraDeColumna", {}),
  Schema.TaggedStruct("NotaAnterior", { nota: IdNota }),
])

const Partida = Schema.TaggedStruct("Partida", {
  plantilla: LiteralCanonico.check(
    Schema.makeFilter((plantilla: string) =>
      plantilla.split(HUECO_IMPORTE).length === 2
        ? undefined
        : `la plantilla debe contener exactamente un hueco ${HUECO_IMPORTE}`
    )
  ),
  unidad: UnidadDeclarada,
  gramatica: Gramatica,
  // Vacío cuando el manual da un importe que no tiene magnitud en el motor:
  // se extrae y lleva testigo, pero no hay clave que cotejar.
  claves: Schema.Array(PosicionMinimo),
  alcance: Alcance,
}).check(
  Schema.makeFilter((partida) => {
    const [prefijo = "", sufijo = ""] = partida.plantilla.split(HUECO_IMPORTE)
    return tienePalabra(prefijo, partida.unidad.evidencia) ||
      tienePalabra(sufijo, partida.unidad.evidencia)
      ? undefined
      : `la evidencia de unidad «${partida.unidad.evidencia}» no es una palabra del texto fijo de «${partida.plantilla}»`
  })
)
export type Partida = typeof Partida.Type

const Remision = Schema.TaggedStruct("Remision", {
  literal: LiteralCanonico,
  fila: LiteralCanonico,
})

const Nota = Schema.TaggedStruct("Nota", {
  literal: LiteralCanonico,
  id: Schema.optionalKey(IdNota),
})

const BloqueDeclarado = Schema.Union([Partida, Remision, Nota])
export type BloqueDeclarado = typeof BloqueDeclarado.Type

// La celda es la secuencia completa y ordenada de sus bloques: el HTML ha de
// traer exactamente esos, en ese orden. El alcance de una partida que viene de
// una nota apunta a una nota anterior de la misma celda.
const CeldaCuadro = Schema.Struct({
  fila: LiteralCanonico,
  columna: LiteralCanonico,
  bloques: Schema.Array(BloqueDeclarado),
}).check(
  Schema.makeFilter((celda) => {
    const anteriores = new Set<string>()
    const problemas: Array<string> = []
    for (const bloque of celda.bloques) {
      if (bloque._tag === "Nota" && bloque.id !== undefined) {
        if (anteriores.has(bloque.id)) {
          problemas.push(`la nota «${bloque.id}» está repetida`)
        }
        anteriores.add(bloque.id)
      }
      if (
        bloque._tag === "Partida" &&
        bloque.alcance._tag === "NotaAnterior" &&
        !anteriores.has(bloque.alcance.nota)
      ) {
        problemas.push(
          `el alcance de «${bloque.plantilla}» apunta a «${bloque.alcance.nota}», que no es una nota anterior de la celda`
        )
      }
    }
    return problemas.length === 0 ? undefined : problemas.join("; ")
  })
)
export type CeldaCuadro = typeof CeldaCuadro.Type

const FilaCuadro = Schema.Struct({
  cabecera: LiteralCanonico,
  territorio: Territorio,
})

export const EspecificacionCuadro = Schema.Struct({
  tipo: Schema.Literal("cuadro"),
  tabla: IdTabla,
  magnitud: MagnitudCuadro,
  territorios: Schema.NonEmptyArray(Territorio).check(
    Schema.makeFilter(sinRepetidos("territorio", (t: string) => t))
  ),
  documento: DocumentoHtml,
  cabeceraDeFilas: LiteralCanonico,
  columnas: Schema.NonEmptyArray(LiteralCanonico).check(
    Schema.makeFilter(sinRepetidos("columna", (c: string) => c))
  ),
  filas: Schema.NonEmptyArray(FilaCuadro).check(
    Schema.makeFilter(
      sinRepetidos("fila", (f: { readonly cabecera: string }) => f.cabecera)
    )
  ),
  celdas: Schema.Array(CeldaCuadro).check(
    Schema.makeFilter(
      sinRepetidos(
        "celda",
        (c: { readonly fila: string; readonly columna: string }) =>
          `${c.fila}\u0000${c.columna}`
      )
    )
  ),
  testigo: TestigoPdf,
}).check(
  Schema.makeFilter((especificacion) => {
    const filas = new Set(especificacion.filas.map((fila) => fila.cabecera))
    const columnas = new Set(especificacion.columnas)
    const territorios = new Set<string>(especificacion.territorios)
    const declaradas = new Set(
      especificacion.celdas.map(
        (celda) => `${celda.fila}\u0000${celda.columna}`
      )
    )
    const problemas = [
      ...especificacion.filas
        .filter((fila) => !territorios.has(fila.territorio))
        .map(
          (fila) =>
            `la fila «${fila.cabecera}» apunta a un territorio fuera de «territorios»`
        ),
      // Cada celda de la tabla está declarada: una sin declarar no podría
      // decir que está vacía.
      ...especificacion.filas.flatMap((fila) =>
        especificacion.columnas
          .filter(
            (columna) => !declaradas.has(`${fila.cabecera}\u0000${columna}`)
          )
          .map(
            (columna) =>
              `falta la celda de la fila «${fila.cabecera}» y la columna «${columna}»`
          )
      ),
      ...especificacion.celdas.flatMap((celda) => [
        ...(filas.has(celda.fila)
          ? []
          : [`la celda usa una fila no declarada «${celda.fila}»`]),
        ...(columnas.has(celda.columna)
          ? []
          : [`la celda usa una columna no declarada «${celda.columna}»`]),
        ...celda.bloques.flatMap((bloque) =>
          bloque._tag === "Remision" && !filas.has(bloque.fila)
            ? [
                `la remisión «${bloque.literal}» apunta a una fila no declarada «${bloque.fila}»`,
              ]
            : []
        ),
      ]),
    ]
    return problemas.length === 0 ? undefined : problemas.join("; ")
  })
)
export type EspecificacionCuadro = typeof EspecificacionCuadro.Type

export const Especificacion = Schema.Union([
  EspecificacionEscala,
  EspecificacionCuadro,
])
export type Especificacion = typeof Especificacion.Type

export const EspecificacionDesdeJson = Schema.fromJsonString(Especificacion)

export const DocumentoManifiesto = Schema.Struct({
  sha256: Sha256,
  url: Schema.String,
  bytes: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
  tipo: Schema.Literals(["html", "pdf"]),
  obtenidoEl: Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/)),
})
export type DocumentoManifiesto = typeof DocumentoManifiesto.Type

export const Manifiesto = Schema.Struct({
  documentos: Schema.Array(DocumentoManifiesto),
})
export type Manifiesto = typeof Manifiesto.Type

export const ManifiestoDesdeJson = Schema.fromJsonString(Manifiesto)
