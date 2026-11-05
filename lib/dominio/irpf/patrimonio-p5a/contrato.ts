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
