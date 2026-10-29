import { Schema } from "effect"

export const Hash = Schema.String.check(Schema.isPattern(/^[a-f0-9]{64}$/))
export const Id = Schema.String.check(
  Schema.isPattern(/^[a-z][a-z0-9.-]{0,159}$/)
)
const Texto = Schema.String.check(Schema.isMinLength(1))
export const Referencia = Schema.Struct({ id: Id, revision: Hash })
export const Ambito = Schema.Union([
  Schema.Struct({ estado: Schema.Literal("desconocido"), motivo: Texto }),
  Schema.Struct({
    estado: Schema.Literal("conocido"),
    desde: Texto,
    hasta: Texto,
    territorio: Id,
    regimen: Id,
    baseTemporal: Id,
    predicadoVersion: Id,
  }),
])
export type Ambito = typeof Ambito.Type
const Seccion = Schema.Struct({
  estado: Schema.Literals(["pendiente", "candidata", "no-aplica"]),
  texto: Texto,
})
export const Arista = Schema.Struct({
  relacion: Schema.Literals([
    "formula",
    "entrada",
    "derivacion",
    "norma",
    "evidencia",
    "documento",
    "captura",
    "dependencia",
  ]),
  destino: Referencia,
})
export const Fuente = Schema.Struct({
  archivo: Texto,
  sha256: Hash,
  localizador: Texto,
})
const Decimal = Schema.String.check(
  Schema.isPattern(/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/)
)
export const Resultado = Schema.Union([
  Schema.Struct({
    estado: Schema.Literal("aplicada"),
    decimal: Decimal,
    unidad: Texto,
  }),
  Schema.Struct({
    estado: Schema.Literals(["no-soportada", "no-aplica"]),
    motivo: Texto,
  }),
])
const base = {
  version: Schema.Literal(1),
  id: Id,
  identidad: Schema.Literals(["ocurrencia", "concepto"]),
  titulo: Texto,
  ambito: Ambito,
  fuentes: Schema.Array(Fuente),
  aristas: Schema.Array(Arista),
  estados: Schema.Struct({
    integridad: Schema.Literal("por-comprobar"),
    autenticidad: Schema.Literal("pendiente"),
    interpretacion: Schema.Literal("pendiente"),
    contrarrevision: Schema.Literal("pendiente"),
    ejecucion: Schema.Literals(["catalogada", "no-soportada"]),
  }),
  secciones: Schema.Struct({
    formula: Seccion,
    derivacion: Seccion,
    norma: Seccion,
    evidencia: Seccion,
    bordes: Seccion,
  }),
}
const calculo = {
  expresion: Schema.String,
  valorObservado: Schema.NullOr(Schema.String),
  unidadCandidata: Texto,
  ejerciciosCandidatos: Schema.Array(Schema.Int),
  territoriosCandidatos: Schema.Array(Schema.String),
  claseInventario: Texto,
}
export const Selector = Schema.Union([
  Schema.Struct({
    tipo: Schema.Literal("pdf"),
    pagina: Schema.Int.check(Schema.isGreaterThan(0)),
    ancho: Schema.Number,
    alto: Schema.Number,
    caja: Schema.Tuple([
      Schema.Number,
      Schema.Number,
      Schema.Number,
      Schema.Number,
    ]),
    coordenadas: Schema.Literal("pymupdf-cropbox-sin-rotar"),
    extraccion: Schema.Literals(["text-layer", "ocr"]),
    receta: Hash,
    texto: Texto,
  }),
  Schema.Struct({
    tipo: Schema.Literal("html"),
    selector: Texto,
    algoritmo: Texto,
    texto: Texto,
  }),
  Schema.Struct({
    tipo: Schema.Literal("texto"),
    encoding: Texto,
    inicioByte: Schema.Int,
    finByte: Schema.Int,
    texto: Texto,
  }),
  Schema.Struct({
    tipo: Schema.Literal("csv"),
    encoding: Texto,
    separador: Texto,
    comilla: Texto,
    salto: Texto,
    cabecera: Schema.Boolean,
    fila: Schema.Int,
    columna: Schema.Int,
    texto: Texto,
  }),
])
export const Entidad = Schema.Union([
  Schema.Struct({
    ...base,
    tipo: Schema.Literals(["Parameter", "Formula", "Step", "Derivation"]),
    ...calculo,
  }),
  Schema.Struct({ ...base, tipo: Schema.Literal("Rule"), proposicion: Texto }),
  Schema.Struct({
    ...base,
    tipo: Schema.Literal("Document"),
    original: Hash,
    mime: Schema.Literals([
      "application/pdf",
      "text/html",
      "text/plain",
      "text/csv",
    ]),
    url: Texto,
  }),
  Schema.Struct({
    ...base,
    tipo: Schema.Literal("Citation"),
    selector: Selector,
  }),
  Schema.Struct({
    ...base,
    tipo: Schema.Literal("Facsimile"),
    imagen: Hash,
    receta: Hash,
    transcripcion: Texto,
  }),
])
export type Entidad = typeof Entidad.Type
export const Paquete = Schema.Array(
  Schema.Struct({ revision: Hash, entidad: Entidad })
)
const snapshotBase = {
  inventario: Hash,
  contrato: Hash,
  generador: Hash,
  politica: Schema.Literal("candidata"),
  versiones: Schema.Struct({
    algoritmo: Hash,
    datos: Hash,
    explicacion: Texto,
  }),
  paquetes: Schema.Array(
    Schema.Struct({
      prefijo: Schema.String.check(Schema.isPattern(/^[a-f0-9]{2}$/)),
      hash: Hash,
      indice: Hash,
      bytes: Schema.Int,
      cantidad: Schema.Int,
    })
  ),
  auxiliares: Schema.Array(Hash),
  cantidad: Schema.Int,
}
export const EstadoEvidencia = Schema.Struct({
  sujeto: Referencia,
  recibo: Hash,
  payload: Hash,
  manifiesto: Hash,
  integridad: Schema.Literal("verified"),
  exactitudNumerica: Schema.Literal("verified"),
  autenticidad: Schema.Struct({
    estado: Schema.Literals([
      "not-validated",
      "unsigned",
      "invalid",
      "trust-indeterminate",
    ]),
    fecha: Texto,
    limites: Texto,
  }),
  interpretacion: Schema.Literal("candidata"),
  revisionBinding: Schema.Literal("pending"),
  aceptacionFiscalCompleta: Schema.Literal(false),
})
export const IndiceBusqueda = Schema.Array(
  Schema.Struct({
    id: Id,
    revision: Hash,
    titulo: Texto,
    ejercicios: Schema.Array(Schema.Int),
    territorios: Schema.Array(Schema.String),
  })
)
export const Snapshot = Schema.Union([
  Schema.Struct({ version: Schema.Literal(1), ...snapshotBase }),
  Schema.Struct({
    version: Schema.Literal(2),
    ...snapshotBase,
    busqueda: Hash,
    catalogo: Hash,
    evidencias: Schema.Array(EstadoEvidencia),
    publicos: Schema.Array(
      Schema.Struct({
        hash: Hash,
        bytes: Schema.Int.check(Schema.isGreaterThan(0)),
        mime: Schema.Literals(["application/pdf", "image/png"]),
      })
    ),
    dependencias: Schema.Array(
      Schema.Struct({
        hash: Hash,
        bytes: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
      })
    ),
  }),
])
export type Snapshot = typeof Snapshot.Type
export const RevisionExterna = Schema.Struct({
  sujeto: Referencia,
  informe: Hash,
  proposicion: Texto,
  fuentes: Schema.Array(Hash),
  ambito: Ambito,
  independencia: Schema.Literal("pendiente-de-acreditar"),
})
export function leerEntidad(texto: string) {
  return Schema.decodeUnknownSync(Schema.fromJsonString(Entidad))(texto, {
    onExcessProperty: "error",
  })
}
