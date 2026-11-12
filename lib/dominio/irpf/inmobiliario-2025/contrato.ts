import { Schema } from "effect"
import { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial-esquemas"
import { InmuebleP4a } from "./hechos"
export { InmuebleP4a, RechazoP4a } from "./hechos"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
const Dinero = Schema.String.check(Schema.isPattern(/^\d{1,13}(?:\.\d{1,2})?$/))

/** Perfil exclusivo: la renta mixta necesita una conexión posterior de trabajo efectivo. */
export const CasoInmobiliarioP4a = Schema.Struct({
  perfil: Schema.Literal("solo-inmobiliario-p4a"),
  ejercicio: Schema.Literal(2025),
  contribuyenteId: Texto,
  liquidacionId: Texto,
  comunidadAutonoma: Schema.Literals(["canarias", "illes-balears", "extremadura", "galicia", "la-rioja"]),
  edad: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum: 18, maximum: 64 })),
  otrasRentas: Schema.Literal("ninguna"),
  familiares: Schema.Literal("ninguno"),
  discapacidad: Schema.Literal("ninguna"),
  reduccionesBase: Schema.Literal("ninguna"),
  inmuebles: Schema.Array(InmuebleP4a).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  deduccionesTerritoriales2025: Schema.optional(SolicitudDeduccionesTerritoriales2025),
  retenciones: Schema.Array(Schema.Struct({ id: Texto, documento: Texto, fecha: Fecha, importe: Dinero })),
})
export type CasoInmobiliarioP4a = typeof CasoInmobiliarioP4a.Type
