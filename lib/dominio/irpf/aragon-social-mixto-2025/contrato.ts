import { Schema } from "effect"
import { InmuebleP4a } from "../inmobiliario-2025/contrato"
import { GastosTrabajo } from "../trabajo-anual/contrato"
import { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial-esquemas"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
/** Censo completo de derechos; ningún neto, base, cuota ni deducción son entradas. */
export const CasoAragonSocialMixto2025 = Schema.Struct({
 perfil: Schema.Literal("aragon-social-mixto-2025"), ejercicio: Schema.Literal(2025),
 comunidadAutonoma: Schema.Literal("aragon"), modalidad: Schema.Literal("individual"),
 devengo: Schema.Literal("2025-12-31"), residenciaTodoElAnio: Schema.Literal(true),
 contribuyenteId: Texto, liquidacionId: Texto,
 edad: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum:18, maximum:64 })),
 familiares: Schema.Literal("ninguno"), discapacidad: Schema.Literal("ninguna"),
 otrasRentas: Schema.Literal("ninguna"), reduccionesBase: Schema.Literal("ninguna"),
 compensaciones: Schema.Literal("ninguna"), otrasDeducciones: Schema.Literal("ninguna"),
 censoInmobiliario: Schema.Struct({ documento: Texto,
  cobertura: Schema.Literal("mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025"),
  inmuebles: Schema.Array(Texto).check(Schema.isMinLength(1), Schema.isMaxLength(1)) }),
 inmuebles: Schema.Array(InmuebleP4a).check(Schema.isMinLength(1), Schema.isMaxLength(1)),
 trabajo: GastosTrabajo,
 conciliacion: Schema.Struct({ contribuyenteId: Texto, ejercicio: Schema.Literal(2025),
  estado: Schema.Literal("totales-anuales-sin-duplicados"), procedencia: Schema.Array(Texto).check(Schema.isMinLength(1)) }),
 retenciones: Schema.Array(Schema.Struct({ id:Texto,documento:Texto,contribuyenteId:Texto,
  ejercicio:Schema.Literal(2025),fecha:Schema.String,importe:Schema.String.check(Schema.isPattern(/^\d{1,13}(?:\.\d{1,2})?$/)) })),
 deduccionesTerritoriales2025: SolicitudDeduccionesTerritoriales2025,
})
export type CasoAragonSocialMixto2025 = typeof CasoAragonSocialMixto2025.Type
