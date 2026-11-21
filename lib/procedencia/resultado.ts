import { Schema, Struct } from "effect"

import { RedondeoDeclarado } from "./especificacion"
import { ExcepcionCotejo, ExcepcionExtraccion, Ubicacion } from "./excepciones"
import { Clave, Magnitud, Sha256, Territorio, Unidad, Valor } from "./vocabulario"

export const Aparicion = Schema.Struct({
  pagina: Schema.Int,
  elemento: Schema.Int,
  x: Schema.Number,
  y: Schema.Number,
})
export type Aparicion = typeof Aparicion.Type

export const Testigo = Schema.Union([
  Schema.TaggedStruct("ConTestigo", {
    literal: Schema.String,
    apariciones: Schema.Array(Aparicion),
  }),
  Schema.TaggedStruct("SinTestigo", {
    literal: Schema.String,
    motivo: Schema.String,
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
  redondeoDeclarado: Schema.optionalKey(RedondeoDeclarado),
  origen: Origen,
  testigo: Testigo,
})
export type ValorExtraido = typeof ValorExtraido.Type

export const ExtraccionTabla = Schema.Struct({
  tabla: Schema.String,
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
  origen: Schema.Literals(["almacenado", "derivado"]),
  regla: Schema.String,
})
export type ValorMotor = typeof ValorMotor.Type

export const EstadoCotejo = Schema.Literals([
  "coincidente",
  "coincidente-con-redondeo-declarado",
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
  motorRedondeado: Schema.optionalKey(Valor),
  excepcionesDeExtraccion: Schema.Array(Schema.String),
})
export type EntradaCotejo = typeof EntradaCotejo.Type

export const Contadores = Schema.Struct({
  valoresExtraidos: Schema.Int,
  conTestigo: Schema.Int,
  sinTestigo: Schema.Int,
  testigoPorRemision: Schema.Int,
  excepcionesDeExtraccion: Schema.Int,
  claves: Schema.Int,
  coincidentes: Schema.Int,
  coincidentesConRedondeoDeclarado: Schema.Int,
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
