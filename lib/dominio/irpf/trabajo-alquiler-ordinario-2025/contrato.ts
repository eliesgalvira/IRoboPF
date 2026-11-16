import { Schema } from "effect"
import { InmuebleP4a } from "../inmobiliario-2025/contrato"
import { GastosTrabajo } from "../trabajo-anual/contrato"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
/** Censo completo de derechos; ningún neto, base, cuota ni deducción son entradas. */
export const CasoTrabajoAlquilerOrdinario2025 = Schema.Struct({
 perfil: Schema.Literal("trabajo-alquiler-ordinario-2025"), ejercicio: Schema.Literal(2025),
 comunidadAutonoma: Schema.Literals(["asturias", "andalucia", "madrid"]), modalidad: Schema.Literal("individual"), periodo: Schema.Literal("ordinario-2025"),
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
 declaracion: Schema.Struct({ contexto: Schema.Literal("ordinaria-voluntaria"), ingresos: Schema.Literal("todos-los-exigibles-declarados"), procedimientoPrevio: Schema.Literal("ninguno"), amortizacion: Schema.Literal("maximo-efectivo-3-por-ciento") }),
 trabajo: GastosTrabajo,
 conciliacion: Schema.Struct({ contribuyenteId: Texto, ejercicio: Schema.Literal(2025),
  estado: Schema.Literal("totales-anuales-sin-duplicados"), procedencia: Schema.Array(Texto).check(Schema.isMinLength(1)) }),
 retenciones: Schema.Array(Schema.Struct({ id:Texto,documento:Texto,contribuyenteId:Texto,
  ejercicio:Schema.Literal(2025),fecha:Schema.String,importe:Schema.String.check(Schema.isPattern(/^\d{1,13}(?:\.\d{1,2})?$/)) })),
 historia2024: Schema.Struct({ documento: Texto, construccion: Schema.String.check(Schema.isPattern(/^\d{1,13}(?:\.\d{1,2})?$/)), mejoras: Schema.Literal("ninguna") }),
})
export type CasoTrabajoAlquilerOrdinario2025 = typeof CasoTrabajoAlquilerOrdinario2025.Type
