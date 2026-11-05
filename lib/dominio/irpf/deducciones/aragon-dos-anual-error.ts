import { Schema } from "effect"

const Texto = Schema.String
const PeticionSocial = Schema.Struct({
 tipo: Schema.Literal("atribuir-cuota-autonomica-BLG-arrendamientos-Plan-Aragon"),
 ejercicio: Schema.Literal(2025), territorio: Schema.Literal("aragon"), modalidad: Schema.Literal("individual"),
 devengo: Schema.Literal("2025-12-31"), contribuyente: Texto, casoAnual: Texto,
 rendimientos: Schema.Array(Schema.Struct({vivienda:Texto,rendimiento:Texto,productor:Texto,netoReducidoEuros:Texto})),
 sumaNetoReducidoEuros: Texto,
 magnitudSolicitada: Schema.Literal("cuota-integra-autonomica-correspondiente-a-BLG-derivada-de-estos-rendimientos"),
 metodoAtribucion: Schema.Literal("pendiente-especificacion-oficial-o-salida-contraste"),
})
const FormulaSocial = Schema.Struct({
 operacion: Schema.Literal("multiplicar"), numerador: Schema.Literal(3), denominador: Schema.Literal(10),
 operando: Schema.Literal("cuota-integra-autonomica-derivada-resuelta-por-nucleo"),
})
export const DependenciaAragonAnual2025 = Schema.Union([
 Schema.Struct({tipo:Schema.Literal("ARAGON_68_1_ESTATAL_SIN_PRODUCTOR"),codigo:Schema.Literal("aragon_inversion_entidades_nuevas_reciente_creacion"),baseEstatalElegidaEuros:Texto,inversiones:Schema.Array(Texto)}),
 Schema.Struct({tipo:Schema.Literal("ARAGON_38_2_SIN_PRODUCTOR"),codigo:Schema.Literal("aragon_inversion_entidades_nuevas_reciente_creacion"),inversiones:Schema.Array(Texto)}),
 Schema.Struct({tipo:Schema.Literal("ARAGON_SOCIAL_SIN_PRODUCTORES_ANUALES"),codigo:Schema.Literal("aragon_arrendamiento_vivienda_social_arrendador"),peticion:PeticionSocial,formula:FormulaSocial,
  nodosPendientes:Schema.Array(Schema.Literals(["neto-reducido-inmobiliario-23.2-23.3","BLG-derivada-Plan","cuota-autonomica-derivada-metodo-contrastado"]))}),
])
export type DependenciaAragonAnual2025 = typeof DependenciaAragonAnual2025.Type
/** Error interno tipado; composición lo transporta al ResultadoNoSoportado común sin perder la petición. */
export class RechazoAragonAnual extends Schema.TaggedErrorClass<RechazoAragonAnual>()("RechazoAragonAnual",{
 motivo:Schema.String, dependencia:DependenciaAragonAnual2025,
}) {}
