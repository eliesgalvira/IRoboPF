import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { CasoAragonSocialMixto2025 } from "./contrato"
import { producirCensoInmuebles2025, type ExactoP4a } from "../inmobiliario-2025/productor"
import { RechazoP4a } from "../inmobiliario-2025/contrato"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import { componerLiquidacionAnual } from "../liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../../normativa/datos/minimos-autonomicos-2025"
const D = Decimal.clone({ precision:80 })
const decimal = (r: ExactoP4a) => new D(r.n.toString()).div(r.d.toString())
const rechazo = (motivo:string) => new RechazoP4a({codigo:"renta-mixta", motivo})
/** Ambas API despachan aquí. Integración, cuotas, deducciones y retenciones una sola vez. */
export const liquidarAragonSocialMixto2025 = Effect.fn("Aragon.socialMixto2025")(function* (entrada: CasoAragonSocialMixto2025) {
 const decoded = Schema.decodeUnknownResult(CasoAragonSocialMixto2025)(entrada,{onExcessProperty:"error"})
 if(Result.isFailure(decoded)) return yield* rechazo("Social mixto: esquema fuera del alcance 2025 Aragón individual 18–64, sin familia/discapacidad/ahorro/reducciones/compensaciones/otras deducciones: "+String(decoded.failure))
 const c=decoded.success, v=c.inmuebles[0]!
 if(c.censoInmobiliario.inmuebles[0]!==v.id || v.ubicacion!=="aragon" || v.primerAlquiler2025!==undefined || v.vaciaExt2025!==undefined || v.contrato.firma<="2023-05-26")
  return yield* rechazo("Social: censo mundial completo de un inmueble pleno en Aragón, contrato posterior26/05/2023 y anual sin perfiles P4b/EXT")
 const s=c.deduccionesTerritoriales2025
 if(s.solicitudes.length!==1 || s.solicitudes[0]?.lote!=="A-aragon-dos" || s.solicitudes[0].codigo!=="aragon_arrendamiento_vivienda_social_arrendador" || !("viviendasPlan" in s.solicitudes[0].hechos) || s.vehiculoDA582025!==undefined || s.donativosEstatales2025!==undefined)
  return yield* rechazo("Social: una sola solicitud del Plan desde hechos; sin combinaciones ni rendimientos externos")
 if(c.retenciones.some(r=>r.contribuyenteId!==c.contribuyenteId) || c.trabajo.discapacidadActiva!=="ninguna" || c.conciliacion.contribuyenteId!==c.contribuyenteId || c.trabajo.ejercicio!==2025 || c.trabajo.rendimientos.length===0 || c.trabajo.rendimientos.some(r=>!["empleo-laboral","empleo-estatutario","pension"].includes(r.clase)))
  return yield* rechazo("Social: identidad/año laboral incompatible o clase distinta de trabajo/pensión ordinarios")
 const ids=[...c.trabajo.rendimientos.map(r=>r.id),...v.exigibilidades.map(r=>r.id),...v.gastos.map(g=>g.id),...c.retenciones.map(r=>r.id)]
 const docs=[...c.conciliacion.procedencia,...v.exigibilidades.map(r=>r.documento),...c.retenciones.map(r=>r.documento)]
 if(new Set(ids).size!==ids.length || new Set(docs).size!==docs.length) return yield* rechazo("Social: operación/procedencia duplicada entre trabajo, renta, gastos y retenciones")
 const inm=yield* producirCensoInmuebles2025(c)
 const x=inm.inmuebles[0]!
 // Las capturas no identifican políticas de etapas inmobiliarias fraccionarias. Delimitación explícita, sin ceros ficticios.
 if([x.amortizacion,x.neto,x.reduccion,x.netoReducido].some(r=>(r.n*100n)%r.d!==0n) || x.netoReducido.n<=0n || x.excesoNoAplicado.n!==0n || x.imputacion.n!==0n || x.regimen!=="art23-50")
  return yield* rechazo("Social: RNR positivo 50%, sin exceso/imputación; etapas inmobiliarias fraccionarias pendientes de contraste")
 const t=adaptarTrabajoAnual(c.trabajo)
 if(t.estado!=="aporte-disponible") return yield* rechazo("Social: trabajo fuera del productor art19")
 const neto=new D(t.rendimientoAntesArt20), renta=decimal(inm.neto), rnr=decimal(inm.netoReducido)
 const reduccion=calcularReduccionTrabajoConOtrasRentas({anio:2025,rendimientoPrevioNeto:new D(t.argumentoArt20),otrasRentasNoExentas:renta})
 if(!reduccion.isZero() || neto.lt(0)) return yield* rechazo("Social: reducción art20 o trabajo negativo fuera del perfil sin reducciones")
 const base=neto.plus(rnr), cero=new D(0)
 const bruto=new D(t.gastos.integro), cotizaciones=c.trabajo.rendimientos.reduce((a,r)=>a.plus(r.cotizaciones.seguridadSocial).plus(r.cotizaciones.derechosPasivos).plus(r.cotizaciones.colegiosHuerfanos),cero)
 const empleo=c.trabajo.rendimientos.every(r=>r.clase!=="pension")
 if(!empleo && c.trabajo.rendimientos.some(r=>r.clase!=="pension")) return yield* rechazo("Social: mezcla empleo/pensión requiere conciliación de servicios DA61")
 const composicion=yield* componerLiquidacionAnual({
  aragonSocialMixto2025:true, inmueblesP4a:inm.inmuebles,
  ambito:{anio:2025,comunidadAutonoma:"aragon",contribuyenteId:c.contribuyenteId,situacionFamiliar:{tipo:"individual",edad:c.edad,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},
  cotizaciones:{naturaleza:"efectivas",trabajador:cotizaciones},precision:80,
  politica:"open-cuotas-empleo-territorios-2025",
  rentasTrabajoAnuales:{integroTrabajo:bruto,restoRentas:renta},
  serviciosLaborales:empleo?{bruto,netoReducido:neto,otrasRentas:renta}:undefined,
  basesImponiblesE38:{general:base,ahorro:cero},baseGeneral:base,baseAhorro:cero,
  rentasAntesReducciones:neto.plus(renta),minimosEstatales:MINIMOS_ESTATALES_2025,
  deduccionesAutonomicasCentimos:0,deduccionesTerritoriales2025:s,
 })
 const retenciones=c.retenciones.reduce((a,r)=>a.plus(r.importe),cero)
 return {_tag:"LiquidacionAragonSocialMixta2025" as const,perfil:c.perfil,ejercicio:2025 as const,contribuyenteId:c.contribuyenteId,liquidacionId:c.liquidacionId,
  inmuebles:inm.inmuebles,rendimientoNetoTrabajo:neto,baseImponibleGeneral:base,composicion,retenciones,
  cuotaDiferencial:composicion.cuotaPosterior.minus(retenciones),legalRuleSelected:null,aceptacionFiscal:"pendiente" as const,
 }
})
