import { Schema } from "effect"
import { E_ViviendaRioja } from "../deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
import { PatrimonioP5a } from "../patrimonio-p5a/contrato"
const Documento=Schema.Struct({referencia:Schema.String,fecha:Schema.String,emisor:Schema.String})
const Corte=Schema.Struct({importe:Schema.String,documento:Documento})
const PagoHistorico=Schema.Struct({id:Schema.String,fecha:Schema.String,importe:Schema.String,pagador:Schema.String,receptor:Schema.String,documento:Documento})
export const HechosDT182025=Schema.Struct({
 ejercicio:Schema.Literal(2025),persona:Schema.String,nacimiento:Schema.String,
 ejercicioDelDerecho:Schema.Literal("ejercer_integramente"),
 exhaustividad:Schema.Literal("primera_unica_vivienda_sin_transmisiones_reinversiones_ni_otras_inversiones"),
 censo:PatrimonioP5a.fields.censo,cuentas:PatrimonioP5a.fields.cuentas,movimientos:PatrimonioP5a.fields.movimientos,
 adquisicion:PatrimonioP5a.fields.adquisicion,
 historia:PatrimonioP5a.fields.historia,
 proyectos:Schema.Array(Schema.Struct({
  vivienda:E_ViviendaRioja,
  id:Schema.String,operacion:Schema.Literals(["adquisicion","rehabilitacion","adecuacion"]),
  fechaInicio:Schema.String,terminacion:Schema.String,coste:Schema.String,
  calificacionAdecuacion:Schema.Union([Schema.Null,Schema.Struct({necesidad:Schema.Literal("accesibilidad_y_comunicacion_sensorial_necesarias"),informe:Documento})]),
  certificadoFin:Documento,pagosOriginales:Schema.Array(PagoHistorico),
  aplicacionAnterior:Schema.Struct({ejercicio:Schema.Number,proyecto:Schema.String,naturaleza:Schema.Literal("deduccion_efectivamente_practicada"),declaracionPresentada:Documento}),
  prestamo:Schema.Union([Schema.Null,Schema.Struct({id:Schema.String,acreedor:Schema.String,fecha:Schema.String,contrato:Documento,
   exhaustividad:Schema.Literal("original_exclusivo_sin_refinanciacion_ni_disposiciones_adicionales"),
   disposicion:Corte,amortizacionesAnteriores:Schema.Array(PagoHistorico),principalInicio:Corte,principalFinal:Corte,
   pagos2025:Schema.Array(Schema.String),
  })]),
 })),
})
export type HechosDT182025=typeof HechosDT182025.Type

/** Sólo adquisición ordinaria: DT primera.4 Murcia no acredita aplicación regional98–2000. */
export const ViviendaDT18Murcia2025 = Schema.Struct({
 ...E_ViviendaRioja.fields,
 inmueble: Schema.Struct({...E_ViviendaRioja.fields.inmueble.fields, territorio: Schema.Literal("murcia")}),
 operacion: Schema.Literal("adquisicion"),
})
const ProyectoMurcia = Schema.Struct({
 ...HechosDT182025.fields.proyectos.schema.fields,
 vivienda: ViviendaDT18Murcia2025,
 operacion: Schema.Literal("adquisicion"),
})
export const HechosDT18Murcia2025 = Schema.Struct({
 ...HechosDT182025.fields,
 proyectos: Schema.Array(ProyectoMurcia),
})
export type HechosDT18Murcia2025 = typeof HechosDT18Murcia2025.Type
export const HechosDT18Territoriales2025 = Schema.Union([HechosDT182025, HechosDT18Murcia2025])
