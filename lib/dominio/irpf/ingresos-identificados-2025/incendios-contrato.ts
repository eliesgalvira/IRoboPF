import { Schema } from "effect"
import { Euros } from "../trabajo-anual/contrato"
const Id = Schema.String.check(Schema.isPattern(/^\S(?:.*\S)?$/), Schema.isMaxLength(200))
const Fecha = Schema.String.check(Schema.isPattern(/^2025-\d{2}-\d{2}$/))
const Documento = Schema.Struct({ referencia: Id, emisor: Id, fecha: Fecha })
/** Sólo hechos declarados de una reparación; sin partes ni decisión fiscal del cliente. */
export const AyudaVI100BReparacion2025 = Schema.Struct({
 ayudaId: Id, beneficiario: Id,
 programa: Schema.Literal("galicia-vi100b-reparacion-2025"), administracion: Schema.Literal("igvs"),
 resolucion: Schema.Struct({referencia:Id, organismo:Schema.Literal("Dirección General del IGVS"), fecha:Fecha, importeConcedido:Euros, concepto:Schema.Literal("reparacion-vivienda-sin-ruina"), notificacion:Fecha, plazoJustificacion:Fecha}),
 cobros: Schema.Array(Schema.Struct({cobroId:Id, beneficiario:Id, ordenante:Schema.Literal("igvs"), fecha:Fecha, euros:Euros, justificante:Id})).check(Schema.isMinLength(1),Schema.isMaxLength(100)),
 inmueble: Schema.Struct({id:Id, referenciaCatastral:Id, titular:Id, derecho:Schema.Literal("pleno-dominio-exclusivo"), territorio:Schema.Literal("galicia"), uso:Schema.Literal("vivienda-habitual-propia-no-arrendada"), adquisicion:Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/)), soporteTitularidad:Documento}),
 siniestro: Schema.Struct({fecha:Fecha, causa:Schema.Literal("incendio-forestal"), informe:Documento, alcance:Schema.Literal("danos-parciales-reparables-sin-destruccion"), situacionPrevia:Schema.Literal("habitable-sin-ruina-ni-abandono")}),
 reparacion: Schema.Struct({inicio:Fecha, fin:Fecha, certificadoFin:Documento, justificacion:Documento,
  facturas:Schema.Array(Schema.Struct({id:Id,inmuebleId:Id,destinatario:Id,emisor:Id,fecha:Fecha,concepto:Schema.Literal("reparacion-danos-mismo-incendio-sin-mejora"),importe:Euros,
   pagos:Schema.Array(Schema.Struct({id:Id,pagador:Id,receptor:Id,fecha:Fecha,euros:Euros,justificante:Id})).check(Schema.isMinLength(1),Schema.isMaxLength(100))})).check(Schema.isMinLength(1),Schema.isMaxLength(100))}),
 // Vacíos sólo con declaración expresa de exhaustividad. Otros casos necesitan conciliador adicional.
 coberturas:Schema.Struct({exhaustividad:Schema.Literal("todas-polizas-indemnizaciones-y-ayudas-del-dano"),polizas:Schema.Array(Documento).check(Schema.isMaxLength(0)),indemnizaciones:Schema.Array(Documento).check(Schema.isMaxLength(0)),otrasAyudas:Schema.Array(Documento).check(Schema.isMaxLength(0))}),
 expediente:Schema.Struct({referencia:Id,exhaustividad:Schema.Literal("todas-facturas-pagos-y-cobros-del-expediente"),otrosConceptos:Schema.Array(Documento).check(Schema.isMaxLength(0))}),
})
export type AyudaVI100BReparacion2025 = typeof AyudaVI100BReparacion2025.Type
