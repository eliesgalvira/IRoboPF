import { Schema } from "effect"
import { HechosDT182025 } from "./contrato"
// Reutiliza hechos estatales (patrimonio, historia, préstamo, aplicación previa),
// no un expediente ni un código regional de Rioja/Murcia. Ámbito balear propio.
const ViviendaBase = HechosDT182025.fields.proyectos.schema.fields.vivienda
const ViviendaAdquisicionBalears = Schema.Struct({
  ...ViviendaBase.fields,
  inmueble: Schema.Struct({ ...ViviendaBase.fields.inmueble.fields, territorio: Schema.Literal("illes-balears") }),
  operacion: Schema.Literal("adquisicion"),
})
export const HechosDerechoDT18Balears2025 = Schema.Struct({
  ...HechosDT182025.fields,
  // Solicitud de ejercicio separada del derecho. Esta entrada sólo determina
  // incompatibilidad con alquiler; no concede ni consume la deducción estatal.
  alcance: Schema.Literal("solo_determinar_incompatibilidad_art3bis"),
  ejercicioDelDerecho: Schema.Literals(["aplicar", "no_aplicar"]),
  hogar: Schema.Struct({
    estadoCivil: Schema.Literal("soltero"), desde: Schema.String, hasta: Schema.String,
    miembros: Schema.Array(Schema.String), documento: Schema.String,
  }),
  proyectos: Schema.Array(Schema.Struct({
    ...HechosDT182025.fields.proyectos.schema.fields,
    vivienda: ViviendaAdquisicionBalears,
    operacion: Schema.Literal("adquisicion"),
  })),
})
export type HechosDerechoDT18Balears2025 = typeof HechosDerechoDT18Balears2025.Type
