import { Schema, Struct } from "effect"

import { ExcepcionCotejo, ExcepcionExtraccion, Ubicacion } from "./excepciones"
import {
  Clave,
  Magnitud,
  OrigenMotor,
  Sha256,
  Territorio,
  Unidad,
  Valor,
} from "./vocabulario"

export const Aparicion = Schema.Struct({
  pagina: Schema.Int,
  elemento: Schema.Int,
  ocurrencia: Schema.Int,
  x: Schema.Number,
  y: Schema.Number,
})
export type Aparicion = typeof Aparicion.Type

// `apariciones` son las candidatas: todas las del literal en las páginas que
// declara la tabla. No hay asignación de una aparición a una celda.
export const Testigo = Schema.Union([
  Schema.TaggedStruct("ConTestigo", {
    literal: Schema.String,
    apariciones: Schema.Array(Aparicion),
  }),
  Schema.TaggedStruct("SinTestigo", {
    literal: Schema.String,
    motivo: Schema.String,
    tablas: Schema.Array(Schema.String),
    celdas: Schema.Int,
    aparicionesDisponibles: Schema.Int,
    cubiertas: Schema.Int,
    apariciones: Schema.Array(Aparicion),
  }),
  Schema.TaggedStruct("PorRemision", {}),
])
export type Testigo = typeof Testigo.Type

export const Origen = Schema.Union([
  Schema.TaggedStruct("Directo", {}),
  Schema.TaggedStruct("Remision", {
    literal: Schema.String,
    ubicacionRemision: Ubicacion,
  }),
])
export type Origen = typeof Origen.Type

export const ValorExtraido = Schema.Struct({
  ubicacion: Ubicacion,
  literal: Schema.String,
  unidad: Unidad,
  valor: Valor,
  claves: Schema.Array(Clave),
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

export const EntradaCotejo = Schema.Struct({
  clave: Clave,
  estado: EstadoCotejo,
  tablas: Schema.Array(Schema.String),
  manual: Schema.Array(
    Schema.Struct({
      tabla: Schema.String,
      unidad: Unidad,
      valor: Valor,
      ubicacion: Ubicacion,
      origen: Schema.String,
      testigo: Schema.String,
    })
  ),
  motor: Schema.NullOr(ValorMotor.mapFields(Struct.omit(["clave"]))),
  excepcionesDeExtraccion: Schema.Array(Schema.String),
})
export type EntradaCotejo = typeof EntradaCotejo.Type

export const Contadores = Schema.Struct({
  valoresExtraidos: Schema.Int,
  conTestigo: Schema.Int,
  sinTestigo: Schema.Int,
  testigoPorRemision: Schema.Int,
  sinClaveDeMotor: Schema.Int,
  excepcionesDeExtraccion: Schema.Int,
  claves: Schema.Int,
  coincidentes: Schema.Int,
  coincidentesDerivadas: Schema.Int,
  distintas: Schema.Int,
  distintasDerivadas: Schema.Int,
  unidadDistinta: Schema.Int,
  ambiguas: Schema.Int,
  ausentesEnManual: Schema.Int,
  sinHomologoEnMotor: Schema.Int,
  conExcepcionDeExtraccion: Schema.Int,
})
export type Contadores = typeof Contadores.Type

export const Resumen = Schema.Struct({
  porTabla: Schema.Array(
    Schema.Struct({ tabla: Schema.String, contadores: Contadores })
  ),
  porDocumentoHtml: Schema.Array(
    Schema.Struct({
      sha256: Sha256,
      tablas: Schema.Array(Schema.String),
      contadores: Contadores,
    })
  ),
  porDocumentoPdf: Schema.Array(
    Schema.Struct({
      sha256: Sha256,
      tablas: Schema.Array(Schema.String),
      contadores: Contadores,
    })
  ),
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
  cotejo: Schema.Array(ExcepcionCotejo),
})
export type ColaExcepciones = typeof ColaExcepciones.Type
