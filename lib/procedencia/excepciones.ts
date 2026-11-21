import { Schema } from "effect"

import { Clave, Sha256, Unidad, Valor } from "./vocabulario"

// Procedencia de un elemento del HTML. «fila» y «columna» son los
// identificadores declarados (índice de fila o literal de su cabecera y
// literal de la cabecera de columna); línea y columna del fuente sólo sirven
// para encontrarlo, nunca para identificarlo.
export const Ubicacion = Schema.Struct({
  fila: Schema.String,
  columna: Schema.String,
  linea: Schema.Int,
  columnaFuente: Schema.Int,
})
export type Ubicacion = typeof Ubicacion.Type

const deTabla = { tabla: Schema.String }

export class TablaNoLocalizada extends Schema.TaggedErrorClass<TablaNoLocalizada>()(
  "TablaNoLocalizada",
  { ...deTabla, localizador: Schema.String, encontradas: Schema.Int }
) {}

export class TablaAmbigua extends Schema.TaggedErrorClass<TablaAmbigua>()(
  "TablaAmbigua",
  { ...deTabla, localizador: Schema.String, encontradas: Schema.Int }
) {}

export class CabeceraNoLocalizada extends Schema.TaggedErrorClass<CabeceraNoLocalizada>()(
  "CabeceraNoLocalizada",
  {
    ...deTabla,
    cabecerasDeclaradas: Schema.Array(Schema.String),
    filasDeLaTabla: Schema.Array(Schema.Array(Schema.String)),
  }
) {}

export class CabeceraAmbigua extends Schema.TaggedErrorClass<CabeceraAmbigua>()(
  "CabeceraAmbigua",
  { ...deTabla, lineas: Schema.Array(Schema.Int) }
) {}

export class EstructuraNoAdmitida extends Schema.TaggedErrorClass<EstructuraNoAdmitida>()(
  "EstructuraNoAdmitida",
  {
    ...deTabla,
    linea: Schema.Int,
    columnaFuente: Schema.Int,
    motivo: Schema.String,
  }
) {}

export class FilaIrregular extends Schema.TaggedErrorClass<FilaIrregular>()(
  "FilaIrregular",
  {
    ...deTabla,
    fila: Schema.String,
    linea: Schema.Int,
    celdas: Schema.Int,
    esperadas: Schema.Int,
    claves: Schema.Array(Clave),
  }
) {}

export class FilaNoDeclarada extends Schema.TaggedErrorClass<FilaNoDeclarada>()(
  "FilaNoDeclarada",
  { ...deTabla, literal: Schema.String, linea: Schema.Int }
) {}

export class UnidadNoDeclarada extends Schema.TaggedErrorClass<UnidadNoDeclarada>()(
  "UnidadNoDeclarada",
  {
    ...deTabla,
    donde: Schema.String,
    evidencia: Schema.String,
    claves: Schema.Array(Clave),
  }
) {}

export class LiteralFueraDeGramatica extends Schema.TaggedErrorClass<LiteralFueraDeGramatica>()(
  "LiteralFueraDeGramatica",
  {
    ...deTabla,
    ubicacion: Ubicacion,
    literal: Schema.String,
    motivo: Schema.String,
    claves: Schema.Array(Clave),
  }
) {}

export class CeldaAusente extends Schema.TaggedErrorClass<CeldaAusente>()(
  "CeldaAusente",
  {
    ...deTabla,
    fila: Schema.String,
    columna: Schema.String,
    buscado: Schema.String,
    claves: Schema.Array(Clave),
  }
) {}

export class CeldaAmbigua extends Schema.TaggedErrorClass<CeldaAmbigua>()(
  "CeldaAmbigua",
  {
    ...deTabla,
    fila: Schema.String,
    columna: Schema.String,
    buscado: Schema.String,
    coincidencias: Schema.Array(Ubicacion),
    claves: Schema.Array(Clave),
  }
) {}

export class ContenidoNoDeclarado extends Schema.TaggedErrorClass<ContenidoNoDeclarado>()(
  "ContenidoNoDeclarado",
  { ...deTabla, ubicacion: Ubicacion, literal: Schema.String }
) {}

export class PaginaInexistente extends Schema.TaggedErrorClass<PaginaInexistente>()(
  "PaginaInexistente",
  { ...deTabla, pagina: Schema.Int, paginasDelDocumento: Schema.Int }
) {}

export class ClaveDuplicada extends Schema.TaggedErrorClass<ClaveDuplicada>()(
  "ClaveDuplicada",
  { clave: Clave, tablas: Schema.Array(Schema.String) }
) {}

export class ValorDistinto extends Schema.TaggedErrorClass<ValorDistinto>()(
  "ValorDistinto",
  { clave: Clave, tabla: Schema.String, manual: Valor, motor: Valor }
) {}

export class UnidadDistinta extends Schema.TaggedErrorClass<UnidadDistinta>()(
  "UnidadDistinta",
  { clave: Clave, tabla: Schema.String, manual: Unidad, motor: Unidad }
) {}

export class AusenteEnManual extends Schema.TaggedErrorClass<AusenteEnManual>()(
  "AusenteEnManual",
  { clave: Clave, tablas: Schema.Array(Schema.String) }
) {}

export class SinHomologoEnMotor extends Schema.TaggedErrorClass<SinHomologoEnMotor>()(
  "SinHomologoEnMotor",
  { clave: Clave, tabla: Schema.String }
) {}

export const ExcepcionExtraccion = Schema.Union([
  TablaNoLocalizada,
  TablaAmbigua,
  CabeceraNoLocalizada,
  CabeceraAmbigua,
  EstructuraNoAdmitida,
  FilaIrregular,
  FilaNoDeclarada,
  UnidadNoDeclarada,
  LiteralFueraDeGramatica,
  CeldaAusente,
  CeldaAmbigua,
  ContenidoNoDeclarado,
  PaginaInexistente,
])
export type ExcepcionExtraccion = typeof ExcepcionExtraccion.Type

export type ExcepcionTabla =
  | TablaNoLocalizada
  | TablaAmbigua
  | CabeceraNoLocalizada
  | CabeceraAmbigua
  | EstructuraNoAdmitida
  | PaginaInexistente

export const ExcepcionCotejo = Schema.Union([
  ClaveDuplicada,
  ValorDistinto,
  UnidadDistinta,
  AusenteEnManual,
  SinHomologoEnMotor,
])
export type ExcepcionCotejo = typeof ExcepcionCotejo.Type

// Fallos del entorno o del autor, no de los datos: abortan la ejecución.
export class EspecificacionInvalida extends Schema.TaggedErrorClass<EspecificacionInvalida>()(
  "EspecificacionInvalida",
  { archivo: Schema.String, detalle: Schema.String }
) {}

export class DocumentoNoDisponible extends Schema.TaggedErrorClass<DocumentoNoDisponible>()(
  "DocumentoNoDisponible",
  { sha256: Sha256, motivo: Schema.String }
) {}

export class ResultadoIlegible extends Schema.TaggedErrorClass<ResultadoIlegible>()(
  "ResultadoIlegible",
  { archivo: Schema.String, detalle: Schema.String }
) {}

export class PdfIlegible extends Schema.TaggedErrorClass<PdfIlegible>()(
  "PdfIlegible",
  { sha256: Sha256, cause: Schema.Defect }
) {}

export class DescargaFallida extends Schema.TaggedErrorClass<DescargaFallida>()(
  "DescargaFallida",
  { url: Schema.String, cause: Schema.Defect }
) {}
