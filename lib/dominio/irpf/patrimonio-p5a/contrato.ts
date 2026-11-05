import { Schema } from "effect"
const Documento = Schema.Struct({referencia:Schema.String,fecha:Schema.String,emisor:Schema.String})
const Corte = Schema.Struct({importe:Schema.String,documento:Documento})
export const PatrimonioP5a = Schema.Struct({
 ejercicio:Schema.Literal(2025), persona:Schema.String,
 exhaustividad:Schema.Literal("todos_activos_deudas_derechos_y_movimientos"),
 censo:Schema.Array(Schema.Struct({id:Schema.String,tipo:Schema.Literals(["cuenta_euros","vivienda","prestamo","otro"]),titular:Schema.String,participacion:Schema.Tuple([Schema.Number,Schema.Number]),inicio:Schema.Literals(["presente","ausente"]),cierre:Schema.Literals(["presente","ausente"]),documento:Documento})),
 cuentas:Schema.Array(Schema.Struct({id:Schema.String,inicio:Corte,cierre:Corte})),
 movimientos:Schema.Array(Schema.Struct({id:Schema.String,cuenta:Schema.String,fecha:Schema.String,importe:Schema.String,sentido:Schema.Literals(["entrada","salida"]),clase:Schema.Literals(["ingreso","consumo","donacion","herencia","disposicion","precio","amortizacion","intereses","gastos_financiacion"]),documento:Documento})),
 adquisicion:Schema.Struct({inmueble:Schema.String,fecha:Schema.String,vendedor:Schema.String,precio:Schema.String,escritura:Documento,valorCierre:Corte}),
 prestamo:Schema.Union([Schema.Null,Schema.Struct({id:Schema.String,fecha:Schema.String,acreedor:Schema.String,inmueble:Schema.String,contrato:Documento,principalCierre:Corte})]),
 historia:Schema.Struct({desde:Schema.String,hasta:Schema.String,documento:Documento,
 derechos:Schema.Array(Schema.Struct({inmueble:Schema.String,titular:Schema.String,adquisicion:Schema.String,transmision:Schema.Union([Schema.String,Schema.Null]),titulo:Documento})),
 anticipos:Schema.Array(Schema.Struct({inmueble:Schema.String,fecha:Schema.String,importe:Schema.String,documento:Documento})),
 ejercicios:Schema.Array(Schema.Struct({anio:Schema.Number,documento:Documento,eventos:Schema.Array(Schema.Struct({tipo:Schema.Literals(["inversion_vivienda","reinversion"]),inmueble:Schema.String,documento:Documento}))}))}),
})
export type PatrimonioP5a = typeof PatrimonioP5a.Type

/** Sólo préstamo original aplicado íntegramente a segunda residencia adquirida antes de2013.
 * No saldo fiscal: reconstrucción bancaria del principal desde la disposición original.
 */
export const PatrimonioRiojaAnterior = Schema.Struct({
 ...PatrimonioP5a.fields,
 financiacionAnterior: Schema.Struct({
  exhaustividad: Schema.Literal("trayectoria_completa_sin_refinanciacion_ni_disposiciones_adicionales"),
  pagoPrecio: Schema.Struct({fecha:Schema.String,importe:Schema.String,receptor:Schema.String,documento:Documento}),
  disposicion: Corte,
  amortizaciones: Schema.Array(Schema.Struct({id:Schema.String,fecha:Schema.String,importe:Schema.String,documento:Documento})),
  principalInicio: Corte,
  usoDesdeAdquisicion: Schema.Literal("segunda_residencia_sin_uso_habitual"),
 }),
})
export type PatrimonioRiojaAnterior = typeof PatrimonioRiojaAnterior.Type
