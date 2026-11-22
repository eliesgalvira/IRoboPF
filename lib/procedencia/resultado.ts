import { Schema, Struct } from "effect"

import {
  ComposicionNoResuelta,
  ExcepcionCotejo,
  ExcepcionExtraccion,
  Ubicacion,
} from "./excepciones"
import {
  Clave,
  Magnitud,
  OrigenMotor,
  Sha256,
  Territorio,
  Unidad,
  Valor,
} from "./vocabulario"

const Pagina = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1))
const Indice = Schema.Int.check(Schema.isGreaterThanOrEqualTo(0))

// Una celda del árbol etiquetado del PDF: la tabla (la página donde está su
// cabecera y su índice entre las tablas de esa página, en el orden del árbol),
// la fila (índice del TR en la tabla) y la columna (índice de la celda en el
// TR).
export const PosicionPdf = Schema.Struct({
  pagina: Pagina,
  tabla: Indice,
  fila: Indice,
  columna: Indice,
})
export type PosicionPdf = typeof PosicionPdf.Type

// La celda que atestigua un valor, con las páginas donde está su contenido:
// una celda con testigo siempre tiene contenido en alguna.
export const CeldaPdf = Schema.Struct({
  ...PosicionPdf.fields,
  paginas: Schema.NonEmptyArray(Pagina),
})
export type CeldaPdf = typeof CeldaPdf.Type

export const MotivoSinTestigo = Schema.Union([
  Schema.TaggedStruct("PaginaSinEstructura", { pagina: Pagina }),
  Schema.TaggedStruct("TablaPdfNoLocalizada", { encontradas: Indice }),
  Schema.TaggedStruct("CabeceraPdfAmbigua", {
    pagina: Pagina,
    filas: Schema.Array(Indice),
  }),
  Schema.TaggedStruct("TablaPdfAnidada", { pagina: Pagina }),
  Schema.TaggedStruct("ContinuacionNoLocalizada", {
    pagina: Pagina,
    encontradas: Indice,
  }),
  Schema.TaggedStruct("ContinuacionIrregular", { pagina: Pagina }),
  Schema.TaggedStruct("FilasDistintas", { html: Indice, pdf: Indice }),
  Schema.TaggedStruct("FilaPdfNoLocalizada", {
    fila: Schema.String,
    encontradas: Indice,
  }),
  // Una columna sin resolver no tiene índice: se nombra por su literal, el
  // de la columna del HTML sin cabecera del PDF declarada o el de la cabecera
  // declarada que la tabla no tiene.
  Schema.TaggedStruct("ColumnaSinCorrespondencia", { columna: Schema.String }),
  Schema.TaggedStruct("ColumnaPdfNoLocalizada", { cabecera: Schema.String }),
  Schema.TaggedStruct("CeldaPdfInexistente", { posicion: PosicionPdf }),
  Schema.TaggedStruct("CeldaPdfVacia", { posicion: PosicionPdf }),
  Schema.TaggedStruct("TextoDistinto", {
    posicion: PosicionPdf,
    textoPdf: Schema.String,
  }),
  Schema.TaggedStruct("LiteralPdfFueraDeGramatica", {
    posicion: PosicionPdf,
    literalPdf: Schema.String,
    motivo: Schema.String,
  }),
  Schema.TaggedStruct("ValorPdfDistinto", {
    posicion: PosicionPdf,
    literalPdf: Schema.String,
    valorPdf: Valor,
  }),
])
export type MotivoSinTestigo = typeof MotivoSinTestigo.Type

// Todo testigo lleva obligatoriamente la celda que lo da. El de un valor
// remitido es la celda que remite, con el mismo texto que en el HTML; el valor
// copiado se atestigua en su celda de origen.
export const Testigo = Schema.Union([
  Schema.TaggedStruct("MismoLiteral", { celda: CeldaPdf }),
  Schema.TaggedStruct("MismoValorOtroLiteral", {
    celda: CeldaPdf,
    literalPdf: Schema.String,
  }),
  Schema.TaggedStruct("SinTestigo", { motivo: MotivoSinTestigo }),
  Schema.TaggedStruct("PorRemision", { celda: CeldaPdf }),
])
export type Testigo = typeof Testigo.Type

const Origen = Schema.Union([
  Schema.TaggedStruct("Directo", {}),
  Schema.TaggedStruct("Remision", {
    literal: Schema.String,
    ubicacionRemision: Ubicacion,
  }),
])

// El literal que justifica a qué se refiere el valor: la cabecera de su
// columna o una nota anterior de su celda, con su ubicación.
const AlcanceExtraido = Schema.Union([
  Schema.TaggedStruct("CabeceraDeColumna", { literal: Schema.String }),
  Schema.TaggedStruct("NotaAnterior", {
    literal: Schema.String,
    ubicacion: Ubicacion,
  }),
])

export const ValorExtraido = Schema.Struct({
  ubicacion: Ubicacion,
  literal: Schema.String,
  unidad: Unidad,
  valor: Valor,
  claves: Schema.Array(Clave),
  alcance: AlcanceExtraido,
  origen: Origen,
  testigo: Testigo,
})
export type ValorExtraido = typeof ValorExtraido.Type

export const ExtraccionTabla = Schema.Struct({
  tabla: Schema.String,
  // SHA-256 del archivo de especificación con el que se extrajo.
  especificacion: Sha256,
  tipo: Schema.Literals(["escala", "cuadro"]),
  magnitud: Magnitud,
  territorios: Schema.Array(Territorio),
  documento: Schema.Struct({
    sha256: Sha256,
    tablaLocalizada: Schema.NullOr(
      Schema.Struct({
        linea: Schema.Int,
        columnaFuente: Schema.Int,
        caption: Schema.NullOr(Schema.String),
      })
    ),
  }),
  testigoPdf: Schema.Struct({
    sha256: Sha256,
    paginas: Schema.Array(Schema.Int),
  }),
  valores: Schema.Array(ValorExtraido),
  notas: Schema.Array(
    Schema.Struct({ ubicacion: Ubicacion, literal: Schema.String })
  ),
  excepciones: Schema.Array(ExcepcionExtraccion),
})
export type ExtraccionTabla = typeof ExtraccionTabla.Type

export const ExtraccionTablaDesdeJson = Schema.fromJsonString(ExtraccionTabla)

export const ValorMotor = Schema.Struct({
  clave: Clave,
  unidad: Unidad,
  valor: Valor,
  origen: OrigenMotor,
  regla: Schema.String,
})
export type ValorMotor = typeof ValorMotor.Type

export const EstadoCotejo = Schema.Literals([
  "coincidente",
  "distinta",
  "unidad-distinta",
  "ambigua",
  "ausente-en-manual",
  "sin-homologo-en-motor",
  "excepcion-de-extraccion",
  "fuera-de-alcance",
])
export type EstadoCotejo = typeof EstadoCotejo.Type

// Un valor del manual es una celda leída o un valor derivado de dos celdas
// leídas por una composición declarada; el derivado lleva sus dos fuentes.
const FuenteDerivada = Schema.Struct({
  tabla: Schema.String,
  ubicacion: Ubicacion,
  valor: Valor,
  testigo: Schema.String,
})

export const ValorDelManual = Schema.Union([
  Schema.TaggedStruct("Leido", {
    tabla: Schema.String,
    unidad: Unidad,
    valor: Valor,
    ubicacion: Ubicacion,
    origen: Schema.String,
    testigo: Schema.String,
  }),
  Schema.TaggedStruct("DerivadoDelManual", {
    unidad: Unidad,
    valor: Valor,
    regla: Schema.Literals([
      "igual en los dos sumandos",
      "suma de los dos sumandos",
    ]),
    fuentes: Schema.Tuple([FuenteDerivada, FuenteDerivada]),
  }),
])
export type ValorDelManual = typeof ValorDelManual.Type

export const EntradaCotejo = Schema.Struct({
  clave: Clave,
  estado: EstadoCotejo,
  tablas: Schema.Array(Schema.String),
  manual: Schema.Array(ValorDelManual),
  motor: Schema.NullOr(ValorMotor.mapFields(Struct.omit(["clave"]))),
  excepcionesDeExtraccion: Schema.Array(Schema.String),
})
export type EntradaCotejo = typeof EntradaCotejo.Type

export const Contadores = Schema.Struct({
  valoresExtraidos: Schema.Int,
  testigoMismoLiteral: Schema.Int,
  testigoMismoValorOtroLiteral: Schema.Int,
  sinTestigo: Schema.Int,
  testigoPorRemision: Schema.Int,
  sinClaveDeMotor: Schema.Int,
  excepcionesDeExtraccion: Schema.Int,
  claves: Schema.Int,
  coincidentes: Schema.Int,
  coincidentesDerivadas: Schema.Int,
  derivadasDelManual: Schema.Int,
  distintas: Schema.Int,
  distintasDerivadas: Schema.Int,
  unidadDistinta: Schema.Int,
  ambiguas: Schema.Int,
  ausentesEnManual: Schema.Int,
  sinHomologoEnMotor: Schema.Int,
  conExcepcionDeExtraccion: Schema.Int,
})
export type Contadores = typeof Contadores.Type

const PorDocumento = Schema.Array(
  Schema.Struct({
    sha256: Sha256,
    tablas: Schema.Array(Schema.String),
    contadores: Contadores,
  })
)

export const Resumen = Schema.Struct({
  porTabla: Schema.Array(
    Schema.Struct({ tabla: Schema.String, contadores: Contadores })
  ),
  porDocumentoHtml: PorDocumento,
  porDocumentoPdf: PorDocumento,
  // Valores del manual cuya partida no tiene clave en el motor: no entran en
  // el cotejo, que va por clave, y se listan aquí con su procedencia.
  sinClaveDeMotor: Schema.Array(
    Schema.Struct({
      tabla: Schema.String,
      ubicacion: Ubicacion,
      literal: Schema.String,
      unidad: Unidad,
      valor: Valor,
      origen: Origen,
      testigo: Schema.String,
    })
  ),
  fueraDeAlcance: Schema.Array(
    Schema.Struct({
      territorio: Territorio,
      magnitud: Magnitud,
      claves: Schema.Int,
    })
  ),
  excluidosDelMotor: Schema.Array(
    Schema.Struct({ identificador: Schema.String, motivo: Schema.String })
  ),
})
export type Resumen = typeof Resumen.Type

export const ColaExcepciones = Schema.Struct({
  extraccion: Schema.Array(
    Schema.Struct({ tabla: Schema.String, excepcion: ExcepcionExtraccion })
  ),
  composicion: Schema.Array(ComposicionNoResuelta),
  cotejo: Schema.Array(ExcepcionCotejo),
})
export type ColaExcepciones = typeof ColaExcepciones.Type
