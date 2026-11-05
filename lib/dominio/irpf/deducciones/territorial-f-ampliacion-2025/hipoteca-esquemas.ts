import { Schema } from "effect"
/** Hechos económicos y documentos, nunca una base, exceso o cuota fiscal. */
export const ContratoHipotecaMadrid = Schema.Struct({
  indice: Schema.Literal("euribor_12_meses"),
  documento: Schema.String,
  saldoInicio2025EUR: Schema.String,
  certificadoSaldo: Schema.String,
  mesesPendientesInicio2025: Schema.Number,
  diaRecibo: Schema.Number,
  revision: Schema.Literals(["enero_anual", "enero_julio"]),
  sistema: Schema.Literal("frances"),
  computo: Schema.Literal("tin_dividido_12"),
  redondeo: Schema.Literal("centimo_comercial_cuota_e_interes"),
  prestatarios: Schema.Array(Schema.String),
  destino: Schema.Literal("adquisicion_integra_vivienda"),
  situacionAplicacion: Schema.Literal("sigue_habitual"),
  referenciaHabitualAplicacion: Schema.String,
  incidencias2025: Schema.Array(Schema.String),
  diferencialPorcentaje: Schema.String,
  desfaseIndiceMeses: Schema.Number,
  recibos: Schema.Array(Schema.Struct({ mes: Schema.Number, cuotaSatisfechaEUR: Schema.String, soporte: Schema.String })),
  revisiones: Schema.Array(Schema.Struct({
    mes: Schema.Number,
    mesIndice: Schema.String,
    euriborPorcentaje: Schema.String,
    documento: Schema.String,
  })),
})
