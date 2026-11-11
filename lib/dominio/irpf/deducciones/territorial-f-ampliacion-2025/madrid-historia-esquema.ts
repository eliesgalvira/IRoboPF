import { Schema } from "effect"
import { GastosTrabajo } from "../../trabajo-anual/contrato"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))
export const EconomiaHistoriaMadrid = Schema.Union([
  Schema.Struct({ perfil: Schema.Literal("sin-rentas"), censoRentasCompleto: Schema.Literal(true) }),
  Schema.Struct({ perfil: Schema.Literal("solo-trabajo"), censoRentasCompleto: Schema.Literal(true),
    otrasRentas: Schema.Literal("ninguna"), reduccionesBase: Schema.Literal("ninguna"),
    saldosAnteriores: Schema.Literal("ninguno"), trabajo: GastosTrabajo }),
])
/** Hechos por ejercicio; nunca bases ni importes deducidos por el cliente. */
export const HistoriaNacimientoMadrid = Schema.Struct({
  contribuyente: Id, referencia: Texto,
  periodos: Schema.Array(Schema.Struct({
    ejercicio: Schema.Literals([2023, 2024]), referencia: Texto,
    modalidad: Schema.Literal("individual"),
    estadoCivil: Schema.Literals(["casado", "no_casado"]), conyuge: Schema.optionalKey(Id),
    censoCompleto: Schema.Literal(true), hijosCompletos: Schema.Literal(true),
    personas: Schema.Array(Schema.Struct({ id: Id, soporte: Texto,
      residenteComunTodoEjercicio: Schema.Literal(true), vivoTodoEjercicio: Schema.Literal(true),
      residenciaAutonomica: Schema.Literals(["madrid", "otra-comunidad-comun"]),
      economia: EconomiaHistoriaMadrid,
    })).check(Schema.isMaxLength(100)),
    hijos: Schema.Array(Schema.Struct({ id: Id, nacimiento: Texto,
      progenitores: Schema.Array(Id), convivientesDevengo: Schema.Array(Id),
      vinculos: Schema.Array(Schema.Struct({ progenitor: Id,
        clase: Schema.Literals(["consanguinidad", "adopcion"]), constitucion: Schema.optionalKey(Texto) })),
      independienteConConsentimiento: Schema.Literal(false), apoyoJudicial: Schema.Literal("ninguno"), soporte: Texto,
    })),
  })).check(Schema.isMaxLength(2)),
})
export type HistoriaNacimientoMadrid = typeof HistoriaNacimientoMadrid.Type
