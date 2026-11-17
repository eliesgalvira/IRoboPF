import Decimal from "decimal.js"
import { Schema } from "effect"
import type { CasoTrabajoAlquilerOrdinario2025 } from "./contrato"
import { RechazoP4a } from "../inmobiliario-2025/contrato"
import { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial-esquemas"
import { ExclusionTipologicaAsturias2025, validarExclusionTipologica } from "../deducciones/asturias-cantabria-ampliacion-2025/exclusion-tipologica"
const Documento = Schema.Struct({referencia:Schema.String,organismo:Schema.String,fecha:Schema.String})
// Forma emitida sin Never; la frontera pública B sigue siendo la autoridad de I/O.
export const SolicitudAsturiasArrendadorDerivada = Schema.Struct({solicitudes:Schema.Array(Schema.Struct({
 lote:Schema.Literal("B-ampliado"), hechos:Schema.Struct({
  codigo:Schema.Literal("asturias_gastos_arrendamiento_viviendas"),
  contratos:Schema.Array(Schema.Struct({id:Schema.String,
   inmueble:Schema.Struct({id:Schema.String,municipio:Schema.String,titulo:Schema.Literal("propiedad"),fechaTitulo:Schema.String,
    ocupacion:Schema.Struct({inicio:Schema.String,fin:Schema.String}),destino:Schema.Literal("habitual"),contrato:Documento}),
   arrendatario:Schema.String,rentaMensual:Schema.String,referencia:ExclusionTipologicaAsturias2025,
   ingresosCapitalInmobiliario:Schema.String,
   gastos:Schema.Array(Schema.Struct({id:Schema.String,pagador:Schema.String,receptor:Schema.String,fecha:Schema.String,
    euros:Schema.String,documento:Schema.String,medio:Schema.Literal("transferencia"),concepto:Schema.Literal("conservacion_reparacion")})),
  })),
 }),
}))})
/** Adapta hechos; ni calcula la deducción ni consume cuota. */
export function producirSolicitudAsturiasArrendador2025(c:CasoTrabajoAlquilerOrdinario2025):SolicitudDeduccionesTerritoriales2025|undefined {
 const h=c.asturiasArrendador2025
 const fallo=(motivo:string):never=>{throw new RechazoP4a({codigo:"renta-mixta",motivo:"Asturias arrendador: "+motivo})}
 if(h===undefined) {
  if(c.otrasDeducciones==="solo-asturias-gastos-arrendamiento-viviendas")fallo("falta extensión factual")
  return undefined
 }
 if(c.comunidadAutonoma!=="asturias" || c.otrasDeducciones!=="solo-asturias-gastos-arrendamiento-viviendas" || c.madridArrendador2025!==undefined)fallo("territorio o declaración contradictorios")
 const v=c.inmuebles[0]!, k=v.contrato, hk=h.contrato
 if(v.derecho!=="propiedad" || v.titulares.length!==1 || v.titulares[0]!==c.contribuyenteId ||
  v.titular!==c.contribuyenteId || h.propietario!==c.contribuyenteId || h.inmuebleId!==v.id || h.catastro!==v.catastro || h.titulo!==v.titulo ||
  hk.id!==k.id || hk.documento!==k.documento || hk.firma!==k.firma || hk.desde!==k.desde || hk.hasta!==k.hasta ||
  hk.destino!==k.destino || !new Decimal(k.repercusionObras).isZero() || k.arrendador!==h.propietario || k.arrendatario===h.propietario ||
  v.exigibilidades.length!==12 || h.precio.mensualidades.some((x,i)=> {
   const a=v.exigibilidades[i];return a===undefined || a.id!==x.id || a.fecha!==x.fecha || a.importe!==x.importe
  }) || v.gastos.length!==1 || v.gastos.some(g=>g.clase!=="reparacion"))fallo("identidad, contrato, rentas o gasto contradictorios")
 const docs=[h.documento.referencia,h.acreditacion.documento.referencia,h.localizacion.documento.referencia,h.censo.documento.referencia,
  ...h.pagos.map(p=>p.soportePago),...v.gastos.map(g=>g.factura),...v.exigibilidades.map(x=>x.documento),...c.conciliacion.procedencia,...c.retenciones.map(x=>x.documento)]
 if(new Set(docs).size!==docs.length)fallo("soportes documentales reutilizados")
 const contrato={id:k.id,inmueble:{id:v.id,municipio:h.municipio,titulo:"propiedad" as const,fechaTitulo:v.adquisicion.fecha,
  ocupacion:{inicio:k.desde,fin:k.hasta},destino:"habitual" as const,contrato:{referencia:k.documento,organismo:"partes-contratantes",fecha:k.firma}},
  arrendatario:k.arrendatario,rentaMensual:h.precio.rentaMensual,referencia:h,
  // Total de rentas exigibles del censo; no es una base ni una cuota recibida.
  ingresosCapitalInmobiliario:v.exigibilidades.reduce((s,x)=>s.plus(x.importe),new Decimal(0)).toFixed(),
  gastos:v.gastos.map(g=>({id:g.id,pagador:h.pagos[0]!.pagador,receptor:g.prestadorNif,fecha:g.fechaPago,euros:g.importe,
   documento:h.pagos[0]!.soportePago,medio:h.pagos[0]!.medio,concepto:"conservacion_reparacion" as const})),
 }
 if(h.pagos[0]?.gastoId!==v.gastos[0]?.id)fallo("pago no corresponde al gasto")
 validarExclusionTipologica({ejercicio:2025,territorio:"asturias",modalidad:"individual",contribuyente:c.contribuyenteId,
  declarantes:[c.contribuyenteId],baseGeneral:"0",baseAhorro:"0",exhaustividad:"completa"},h,contrato)
 return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes:[{lote:"B-ampliado",hechos:{codigo:"asturias_gastos_arrendamiento_viviendas",contratos:[contrato]}}]},{onExcessProperty:"error"})
}
