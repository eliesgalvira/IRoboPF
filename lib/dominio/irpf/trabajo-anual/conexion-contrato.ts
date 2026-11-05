import { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial"
import { Schema } from "effect"
import { SolicitudDeduccionesValencianasAnual2025 } from "../deducciones/valenciana-2025/anual"
import {
  DerechosMinimosAnuales,
  TerritorioMinimosComun,
} from "../minimos/derechos-contrato"
import { Euros, GastosTrabajo } from "./contrato"
import { CasoActividad2025 } from "../actividades-economicas/contrato"

const Procedencia = Schema.String.check(Schema.isPattern(/\S/))
const Alcance = {
  deduccionesTerritoriales2025: Schema.optional(
    SolicitudDeduccionesTerritoriales2025
  ),
  contribuyenteId: Schema.optional(Schema.String),
  deduccionesValencianas2025: Schema.optional(
    SolicitudDeduccionesValencianasAnual2025
  ),
  ejercicio: Schema.Literal(2025),
  comunidadAutonoma: TerritorioMinimosComun,
  edad: Schema.Number.check(
    Schema.isInt(),
    Schema.isGreaterThanOrEqualTo(18),
    Schema.isLessThanOrEqualTo(150)
  ),
  modalidad: Schema.Literal("individual"),
  residenciaTodoElAnio: Schema.Literal(true),
  devengo: Schema.Literal("2025-12-31"),
  otrasRentas: Schema.Literal("ninguna"),
  familiaresConDerechoMinimo: Schema.Literals(["ninguno", "segun-derechos"]),
  derechosMinimos: Schema.optional(DerechosMinimosAnuales),
  discapacidad: Schema.Literal("ninguna"),
  reduccionesBase: Schema.Literal("ninguna"),
  saldosAnteriores: Schema.Literals([
    "ninguno",
    "solo-deducciones-valencianas",
  ]),
  deducciones: Schema.Literals([
    "solo-da61-si-procede",
    "valencianas-por-hechos-y-da61",
    "territoriales-por-hechos-y-da61",
  ]),
  rentasExtranjeras: Schema.Literal("ninguna"),
  especialidades: Schema.Literal("ninguna"),
}
// Perfil efectivo acotado para cotejar Open histórico: empleo Madrid sin familia.
const EjercicioHistorico = Schema.Literals([
  2018, 2019, 2020, 2021, 2022, 2023, 2024,
])
const CasosTrabajoHistorico = (
  [2018, 2019, 2020, 2021, 2022, 2023, 2024] as const
).map((ejercicio) =>
  Schema.Struct({
    ...Alcance,
    contribuyenteId: Schema.optional(Schema.Never),
    deduccionesTerritoriales2025: Schema.optional(Schema.Never),
    deduccionesValencianas2025: Schema.optional(Schema.Never),
    ejercicio: Schema.Literal(ejercicio),
    comunidadAutonoma: Schema.Literal("madrid"),
    edad: Schema.Number.check(
      Schema.isInt(),
      Schema.isGreaterThanOrEqualTo(18),
      Schema.isLessThanOrEqualTo(64)
    ),
    devengo: Schema.Literal(`${ejercicio}-12-31`),
    familiaresConDerechoMinimo: Schema.Literal("ninguno"),
    derechosMinimos: Schema.optional(Schema.Never),
    deducciones: Schema.Literal("ninguna"),
    saldosAnteriores: Schema.Literal("ninguno"),
    perfil: Schema.Literal("solo-trabajo"),
    trabajo: GastosTrabajo,
    conciliacion: Schema.Struct({
      ejercicio: EjercicioHistorico,
      estado: Schema.Literal("totales-anuales-sin-duplicados"),
      procedencia: Schema.Array(Procedencia).check(Schema.isMinLength(1)),
    }),
    retenciones: Schema.Array(
      Schema.Struct({
        operacionId: Procedencia,
        procedencia: Procedencia,
        ejercicio: EjercicioHistorico,
        importe: Euros,
        efectiva: Schema.Literal(true),
      })
    ),
  })
)
export const CasoFiscalAnualExplicito = Schema.Union([
  ...CasosTrabajoHistorico,
  Schema.Struct({
    ...Alcance,
    perfil: Schema.Literal("solo-trabajo"),
    trabajo: GastosTrabajo,
    conciliacion: Schema.Struct({
      contribuyenteId: Schema.optional(Schema.String),
      deduccionesValencianas2025: Schema.optional(
        SolicitudDeduccionesValencianasAnual2025
      ),
      ejercicio: Schema.Literal(2025),
      estado: Schema.Literal("totales-anuales-sin-duplicados"),
      procedencia: Schema.Array(Procedencia).check(Schema.isMinLength(1)),
    }),
    retenciones: Schema.Array(
      Schema.Struct({
        operacionId: Procedencia,
        procedencia: Procedencia,
        contribuyenteId: Schema.optional(Schema.String),
        deduccionesValencianas2025: Schema.optional(
          SolicitudDeduccionesValencianasAnual2025
        ),
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
