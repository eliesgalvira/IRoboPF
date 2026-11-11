import { Schema } from "effect"
import { EconomiaHistoriaMadrid } from "./madrid-historia-esquema"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))
/** Art13: compra identificada y hechos anuales; no historia del incentivo art4. */
export const HistoriaViviendaMadrid = Schema.Struct({
  contribuyente: Id, viviendaId: Texto, adquisicion: Texto, referencia: Texto,
  modalidadAdquisicion: Schema.Literal("compraventa-terminada"),
  unidadHabitualDesde: Texto, unidadHabitualHasta: Texto,
  periodos: Schema.Array(Schema.Struct({
    ejercicio: Schema.Literals([2023, 2024]), referencia: Texto,
    modalidad: Schema.Literal("individual"),
    estadoCivil: Schema.Literals(["casado-no-separado", "sin-vinculo"]), conyuge: Schema.optionalKey(Id),
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
      independienteConConsentimiento: Schema.Literal(false), apoyoJudicial: Schema.Literal("ninguno"),
      declaracion: Schema.Literal("no-presenta"), soporte: Texto,
    })),
  })).check(Schema.isMaxLength(2)),
})
export type HistoriaViviendaMadrid = typeof HistoriaViviendaMadrid.Type
