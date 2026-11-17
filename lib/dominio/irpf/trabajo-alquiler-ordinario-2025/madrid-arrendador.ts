import { Schema } from "effect"
import type { CasoTrabajoAlquilerOrdinario2025 } from "./contrato"
import { RechazoP4a } from "../inmobiliario-2025/contrato"
import { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial-esquemas"
import { fecha } from "../deducciones/territorial-f-ampliacion-2025/comun"

// Forma interna exacta que produce este adaptador. No relaja los campos Never
// del contrato territorial público ni admite otras solicitudes o auxiliares.
export const SolicitudMadridArrendadorDerivada = Schema.Struct({
 solicitudes: Schema.Array(Schema.Struct({
  lote: Schema.Literal("F-ampliado"), codigo: Schema.Literal("madrid_gastos_arrendamiento_viviendas"),
  hechos: Schema.Struct({
   viviendas: Schema.Array(Schema.Struct({id:Schema.String,territorio:Schema.Literal("madrid"),titulares:Schema.Array(Schema.String),porcentajePropiedad:Schema.Literal("100")})),
   contratos: Schema.Array(Schema.Struct({id:Schema.String,viviendaId:Schema.String,arrendador:Schema.String,desde:Schema.String,hasta:Schema.String,fianza:Schema.String})),
   pagos: Schema.Array(Schema.Struct({id:Schema.String,operacionId:Schema.String,objetoId:Schema.String,pagador:Schema.String,fecha:Schema.String,importeEUR:Schema.String,concepto:Schema.Literal("reparacion"),factura:Schema.String,soportePago:Schema.String})),
  }),
 })),
})

/** Sólo adapta hechos: la regla 8bis y el consumo de cuota siguen en territorial F. */
export function producirSolicitudMadridArrendador2025(c: CasoTrabajoAlquilerOrdinario2025): SolicitudDeduccionesTerritoriales2025 | undefined {
 const h=c.madridArrendador2025
 const fallo=(motivo:string):never=>{throw new RechazoP4a({codigo:"renta-mixta",motivo:"Madrid arrendador: "+motivo})}
 if(h===undefined) {
  if(c.otrasDeducciones!=="ninguna")fallo("falta extensión factual")
  return undefined
 }
 if(c.otrasDeducciones!=="solo-madrid-gastos-arrendamiento-viviendas" || c.comunidadAutonoma!=="madrid")fallo("alcance territorial o declaración contradictoria")
 const v=c.inmuebles[0]!, contrato=v.contrato, r=h.resguardo
 if(v.ubicacion!=="resto-espana" || h.localizacion.comunidad!=="madrid" || h.inmuebleId!==v.id || h.catastro!==v.catastro ||
  h.propietario!==c.contribuyenteId || h.propietario!==v.titular || h.titulo!==v.titulo ||
  v.titulares.length!==1 || v.titulares[0]!==h.propietario || contrato.arrendador!==h.propietario ||
  h.contratoId!==contrato.id || h.documentoContrato!==contrato.documento ||
  r.inmuebleId!==v.id || r.catastro!==v.catastro || r.contratoId!==contrato.id || r.arrendador!==contrato.arrendador ||
  r.arrendatario!==contrato.arrendatario || r.arrendatario===r.arrendador || r.referencia!==contrato.fianzaDepositada ||
  r.organismo!=="agencia-vivienda-social-comunidad-madrid" || contrato.destino!=="vivienda-permanente-persona-fisica")fallo("identidad, propiedad, contrato o resguardo AVS contradictorios")
 // Validación de calendario compartida con F; ningún consolidado de2026.
 let deposito:string, resguardo:string
 try { deposito=fecha(r.fechaDeposito,"fechaDeposito");resguardo=fecha(r.fechaResguardo,"fechaResguardo") }
 catch { return fallo("fecha de depósito/resguardo inválida") }
 if(deposito<contrato.firma || deposito>resguardo || resguardo>c.devengo || deposito>c.devengo)fallo("cronología de depósito/resguardo contradictoria")
 const ids=h.pagos.map(p=>p.gastoId), soportes=h.pagos.map(p=>p.soportePago)
 if(new Set(ids).size!==ids.length || new Set(soportes).size!==soportes.length || h.pagos.length!==v.gastos.length ||
  h.pagos.some(p=>p.pagador!==c.contribuyenteId || !v.gastos.some(g=>g.id===p.gastoId)))fallo("pagos duplicados, ajenos o censo incompleto")
 const documentos=[r.referencia,h.localizacion.documento,...soportes,
  ...c.conciliacion.procedencia,...v.exigibilidades.map(x=>x.documento),...c.retenciones.map(x=>x.documento)]
 if(new Set(documentos).size!==documentos.length)fallo("soporte reutilizado entre operaciones")
 return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes:[{
  lote:"F-ampliado",codigo:"madrid_gastos_arrendamiento_viviendas",
  hechos:{
   viviendas:[{id:v.id,territorio:"madrid",titulares:[c.contribuyenteId],porcentajePropiedad:"100"}],
   contratos:[{id:contrato.id,viviendaId:v.id,arrendador:contrato.arrendador,
    desde:contrato.desde,hasta:contrato.hasta,fianza:r.referencia}],
   pagos:v.gastos.map(g=>({id:g.id,operacionId:g.id,objetoId:v.id,pagador:c.contribuyenteId,
    fecha:g.fechaPago,importeEUR:g.importe,concepto:"reparacion",factura:g.factura,
    soportePago:h.pagos.find(p=>p.gastoId===g.id)!.soportePago})),
  },
 }]},{onExcessProperty:"error"})
}
