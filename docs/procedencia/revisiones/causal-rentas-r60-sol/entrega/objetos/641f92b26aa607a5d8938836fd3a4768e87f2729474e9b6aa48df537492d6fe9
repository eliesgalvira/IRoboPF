import { Schema } from "effect"
import { Euros, GastosTrabajo } from "./contrato"
import { CasoActividad2025 } from "../actividades-economicas/contrato"

const Procedencia = Schema.String.check(Schema.isPattern(/\S/))
const Alcance = {
  ejercicio: Schema.Literal(2025),
  comunidadAutonoma: Schema.Literal("madrid"),
  edad: Schema.Number.check(
    Schema.isInt(),
    Schema.isGreaterThanOrEqualTo(18),
    Schema.isLessThanOrEqualTo(64)
  ),
  modalidad: Schema.Literal("individual"),
  residenciaTodoElAnio: Schema.Literal(true),
  devengo: Schema.Literal("2025-12-31"),
  otrasRentas: Schema.Literal("ninguna"),
  familiaresConDerechoMinimo: Schema.Literal("ninguno"),
  discapacidad: Schema.Literal("ninguna"),
  reduccionesBase: Schema.Literal("ninguna"),
  saldosAnteriores: Schema.Literal("ninguno"),
  deducciones: Schema.Literal("solo-da61-si-procede"),
  rentasExtranjeras: Schema.Literal("ninguna"),
  especialidades: Schema.Literal("ninguna"),
}
export const CasoFiscalAnualExplicito = Schema.Union([
  Schema.Struct({
    ...Alcance,
    perfil: Schema.Literal("solo-trabajo"),
    trabajo: GastosTrabajo,
    conciliacion: Schema.Struct({
      ejercicio: Schema.Literal(2025),
      estado: Schema.Literal("totales-anuales-sin-duplicados"),
      procedencia: Schema.Array(Procedencia).check(Schema.isMinLength(1)),
    }),
    retenciones: Schema.Array(
      Schema.Struct({
        operacionId: Procedencia,
        procedencia: Procedencia,
        ejercicio: Schema.Literal(2025),
        importe: Euros,
        efectiva: Schema.Literal(true),
      })
    ),
  }),
  Schema.Struct({
    ...Alcance,
    perfil: Schema.Literal("solo-actividad-eds"),
    actividad: CasoActividad2025,
  }),
])
export type CasoFiscalAnualExplicito = typeof CasoFiscalAnualExplicito.Type
