import { Schema } from "effect"
const Texto = Schema.String.check(Schema.isPattern(/^\S(?:.*\S)?$/))
const Euros = Schema.String.check(Schema.isPattern(/^(0|[1-9]\d*)(\.\d{1,2})?$/))
export const PagoDonativo = Schema.Struct({
  id: Texto, operacionId: Texto, fecha: Texto, pagador: Texto,
  receptorNIF: Texto, euros: Euros, documento: Texto,
  medio: Schema.Literals(["transferencia", "tarjeta", "cheque_nominativo"]),
})
export const CertificadoDonativo = Schema.Struct({
  referencia: Texto, operacionId: Texto, donante: Texto, nifDonante: Texto, entidadNIF: Texto,
  inclusionArt16: Schema.Literal("entidad_titulo_II"),
  fechaDonativo: Texto, euros: Euros, destino: Texto,
  caracter: Schema.Literal("irrevocable_puro_simple"),
  contraprestacionEUR: Euros,
})
const Historico = Schema.Struct({ ejercicio: Schema.Literals([2023, 2024]), pago: PagoDonativo, certificado: CertificadoDonativo })
const Operacion = Schema.Struct({
  operacionId: Texto,
  eleccion: Schema.Literals(["aplicar", "no_aplicar"]),
  incremento: Schema.Literals(["general_40", "reiteracion_45"]),
  entidad: Schema.Struct({
    id: Texto, nif: Texto, clase: Schema.Literals(["fundacion", "asociacion_utilidad_publica"]),
    registro: Texto, utilidadPublica: Schema.optionalKey(Texto),
    regimen: Schema.Literal("titulo_II_Ley49_2002"),
    referenciaRegimen: Texto, referenciaOpcionRegimen: Texto,
    regimenDesde: Texto, regimenHasta: Texto,
  }),
  pago: PagoDonativo, certificado: CertificadoDonativo,
  historial: Schema.optionalKey(Schema.Array(Historico)),
  historialExhaustivo: Schema.optionalKey(Schema.Literal("todos_donativos_misma_entidad_2023_2024")),
})
/** Censo de derecho/elección, no de bases ni deducciones importadas. */
export const SolicitudDonativosEstatales2025 = Schema.Struct({
  ejercicio: Schema.Literal(2025), contribuyente: Texto, nifContribuyente: Texto,
  exhaustividad: Schema.Literal("completo_68_3_y_68_5"), referenciaCenso: Texto,
  prioridad68_3: Schema.optionalKey(Schema.Array(Texto)),
  operaciones68_3: Schema.Array(Operacion),
  operaciones68_5: Schema.Array(Schema.Struct({ operacionId: Texto, documento: Texto })),
})
export type SolicitudDonativosEstatales2025 = typeof SolicitudDonativosEstatales2025.Type
export type OperacionDonativo2025 = typeof Operacion.Type
export type PagoDonativo2025 = typeof PagoDonativo.Type
export type CertificadoDonativo2025 = typeof CertificadoDonativo.Type
