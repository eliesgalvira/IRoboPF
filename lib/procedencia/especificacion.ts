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
    )
  ),
  testigo: TestigoPdf,
})
export type EspecificacionEscala = typeof EspecificacionEscala.Type

const Partida = Schema.Struct({
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

const Remision = Schema.Struct({
  literal: LiteralCanonico,
  fila: LiteralCanonico,
})
export type Remision = typeof Remision.Type

const CeldaCuadro = Schema.Struct({
  fila: LiteralCanonico,
  columna: LiteralCanonico,
  partidas: Schema.Array(Partida),
  remisiones: Schema.Array(Remision),
  notas: Schema.Array(LiteralCanonico),
})
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
    const problemas = [
      ...especificacion.filas
        .filter((fila) => !territorios.has(fila.territorio))
        .map(
          (fila) =>
            `la fila «${fila.cabecera}» apunta a un territorio fuera de «territorios»`
        ),
      ...especificacion.celdas.flatMap((celda) => [
        ...(filas.has(celda.fila)
          ? []
          : [`la celda usa una fila no declarada «${celda.fila}»`]),
        ...(columnas.has(celda.columna)
          ? []
          : [`la celda usa una columna no declarada «${celda.columna}»`]),
        ...celda.remisiones
          .filter((remision) => !filas.has(remision.fila))
          .map(
            (remision) =>
              `la remisión «${remision.literal}» apunta a una fila no declarada «${remision.fila}»`
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
