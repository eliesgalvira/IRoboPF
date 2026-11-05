import Decimal from "decimal.js"
import { fecha } from "../deducciones/asturias-cantabria-hechos-2025/comun"
import { racional, type Racional } from "../deducciones/anual-territorial-racional"
import type { AyudaVI100BReparacion2025 } from "./incendios-contrato"
// Acotado a100 facturas y100 pagos/factura, euros de12 enteros y2 decimales.
// Las sumas sólo requieren18 cifras; no modifica Decimal global/composición80.
const D = Decimal.clone({precision:100})
export type AyudaIncendioNoIntegrada2025 = {
 readonly ayudaId:string; readonly beneficiario:string; readonly programa:"galicia-vi100b-reparacion-2025"
 readonly ejercicio:2025; readonly clasificacion:"no-integracion-DA5.3-reparacion"
 readonly cobrado:Racional; readonly costeReparacion:Racional; readonly excluido:Racional
 readonly nodoOrigen:string; readonly hechos:AyudaVI100BReparacion2025
 readonly obligaciones:readonly string[]
}
function exigir(b:boolean,m:string):asserts b {if(!b)throw new RangeError(m)}
/** El contrato público se decodifica cerrado antes de esta función. No recibe base ni pérdida fiscal. */
export function clasificarReparacionVI100B2025(a:AyudaVI100BReparacion2025, contribuyente:string):AyudaIncendioNoIntegrada2025 {
 exigir(a.beneficiario===contribuyente && a.inmueble.titular===contribuyente,"VI100B: titular/beneficiario ajeno")
 const fechas=[a.resolucion.fecha,a.resolucion.notificacion,a.resolucion.plazoJustificacion,a.inmueble.soporteTitularidad.fecha,a.siniestro.fecha,a.siniestro.informe.fecha,a.reparacion.inicio,a.reparacion.fin,a.reparacion.certificadoFin.fecha,a.reparacion.justificacion.fecha]
 exigir(fechas.every(f=>fecha(f)&&f.startsWith("2025-")) && fecha(a.inmueble.adquisicion),"VI100B: fecha civil/ejercicio no representado")
 exigir(a.siniestro.fecha>="2025-07-28" && a.siniestro.fecha<="2025-08-25" && a.inmueble.adquisicion<a.siniestro.fecha && a.inmueble.soporteTitularidad.fecha<=a.resolucion.fecha,"VI100B: siniestro/tenencia fuera del perfil verano2025")
 exigir(a.resolucion.fecha>="2025-09-01" && a.resolucion.fecha>=a.siniestro.informe.fecha && a.siniestro.informe.fecha>=a.siniestro.fecha && a.resolucion.notificacion>=a.resolucion.fecha,"VI100B: expediente fuera de convocatoria o cronología contradictoria")
 exigir(a.reparacion.inicio>=a.siniestro.fecha && a.reparacion.fin>=a.reparacion.inicio && a.reparacion.certificadoFin.fecha>=a.reparacion.fin && a.reparacion.justificacion.fecha>=a.reparacion.certificadoFin.fecha && a.reparacion.justificacion.fecha>=a.resolucion.notificacion && a.reparacion.justificacion.fecha<=a.resolucion.plazoJustificacion && a.reparacion.justificacion.fecha<="2025-12-15","VI100B: fin/justificación fuera del plazo declarado; no anticipos pendientes2026")
 // Todo termina2025 tras convocatoria septiembre2025: necesariamente antes de24 meses desde notificación.
 const ids=new Set<string>(),justificantes=new Set<string>()
 function unico(id:string){exigir(!ids.has(id),"VI100B: identificador económico repetido");ids.add(id)}
 let coste=new D(0)
 for(const f of a.reparacion.facturas){
  unico(f.id)
  exigir(f.inmuebleId===a.inmueble.id && f.destinatario===contribuyente && f.emisor!==contribuyente && fecha(f.fecha) && f.fecha>=a.reparacion.inicio && f.fecha<=a.reparacion.justificacion.fecha,"VI100B: factura ajena o fecha incompatible")
  const importe=new D(f.importe);exigir(importe.gt(0),"VI100B: factura sin importe positivo")
  let pagado=new D(0)
  for(const p of f.pagos){
   unico(p.id);exigir(!justificantes.has(p.justificante),"VI100B: justificante repetido");justificantes.add(p.justificante)
   exigir(p.pagador===contribuyente && p.receptor===f.emisor && fecha(p.fecha) && p.fecha>=f.fecha && p.fecha<=a.reparacion.justificacion.fecha,"VI100B: causalidad/pagador/receptor/fecha de pago incompatible")
   const euros=new D(p.euros);exigir(euros.gt(0),"VI100B: pago sin importe positivo");pagado=pagado.plus(euros)
  }
  exigir(pagado.eq(importe),"VI100B: factura/pagos sin conciliación íntegra")
  coste=coste.plus(importe)
 }
 let cobrado=new D(0)
 for(const c of a.cobros){
  unico(c.cobroId);exigir(!justificantes.has(c.justificante),"VI100B: justificante de cobro reutilizado");justificantes.add(c.justificante)
  exigir(c.beneficiario===contribuyente && fecha(c.fecha) && c.fecha>=a.resolucion.fecha && c.fecha.startsWith("2025-"),"VI100B: cobro ajeno, anterior a resolución o fuera2025")
  const euros=new D(c.euros);exigir(euros.gt(0),"VI100B: concesión sin cobro no clasifica renta");cobrado=cobrado.plus(euros)
 }
 exigir(cobrado.eq(a.resolucion.importeConcedido) && cobrado.lte(132000),"VI100B: concesión/cobro íntegro o límite habitual132000 sin conciliar")
 exigir(cobrado.lte(coste),"VI100B: ayuda superior al coste; requiere liquidación/reintegro administrativo y clasificación del exceso, no presunción de exención")
 return {ayudaId:a.ayudaId,beneficiario:contribuyente,programa:a.programa,ejercicio:2025,clasificacion:"no-integracion-DA5.3-reparacion",cobrado:racional(cobrado.toFixed()),costeReparacion:racional(coste.toFixed()),excluido:racional(cobrado.toFixed()),nodoOrigen:"motor-anual:2025:"+contribuyente+":no-integracion-DA5.3:"+a.ayudaId,hechos:a,obligaciones:["No deducir fiscalmente ni computar como mejora costes de reparación hasta el importe de la ayuda (DA5.3)","Conservar facturas, pagos, titularidad y justificación; comunicar otras coberturas/modificaciones y atender reintegros; hechos declarados no autenticados"]}
}
