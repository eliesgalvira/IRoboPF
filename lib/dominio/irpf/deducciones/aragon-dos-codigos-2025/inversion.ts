import type Decimal from "decimal.js"
import { Schema } from "effect"
import { D, Texto, Centimos, Contexto, exigir, ref, unicos, euros, fecha, aniversario, pago, type Rechazo } from "./comun"
import { Inversion681, validarHechosInversion681, validarTenencia681 } from "../inversion-681-comun-2025"

const Inversion=Schema.Struct({...Inversion681.fields,
 asignacion:Schema.Struct({estatalCentimos:Centimos,aragonCentimos:Centimos,sinDeduccionCentimos:Centimos}),
})
const Reinversion=Schema.Union([
 Schema.Struct({tipo:Schema.Literal("sin-exencion38.2")}),
 Schema.Struct({tipo:Schema.Literal("exencion38.2"),transmisiones:Schema.Array(Schema.Struct({id:Texto,fecha:Texto,
 importeTotalObtenidoCentimos:Centimos,referenciaExencion:Texto})),inversionesDestino:Schema.Array(Texto),referenciaAsignacionFondos:Texto}),
])
export const SolicitudInversionAragonesa2025=Schema.Struct({...Contexto,
 codigo:Schema.Literal("aragon_inversion_entidades_nuevas_reciente_creacion"),
 censoInversionesEstatales2025:Texto,inversiones:Schema.Array(Inversion),reinversion:Reinversion,
 elecciones:Schema.Array(Schema.Struct({codigo:Texto,inversion:Texto})),
})
export type SolicitudInversionAragonesa2025=typeof SolicitudInversionAragonesa2025.Type
export type ResultadoInversionAragonesa2025=Rechazo | {
 readonly estado:"calculo_parcial";readonly codigo:"aragon_inversion_entidades_nuevas_reciente_creacion";
 readonly contribuyente:string;readonly casoAnual:string;readonly importeExactoEuros:string;readonly importePresentadoCentimos:number;
 readonly baseEstatalAsignadaEuros:string;readonly baseAragonesaAsignadaEuros:string;readonly excesoSobreMaximoEstatalEuros:string;
 readonly asignaciones:readonly {readonly inversion:string;readonly estatalEuros:string;readonly aragonEuros:string;readonly sinDeduccionEuros:string}[];
 readonly obligaciones:readonly {readonly inversion:string;readonly transmisionDespuesDe:string;readonly transmisionAntesDe:string;readonly seguimiento:string}[];
 readonly aceptacionFiscal:"pendiente";readonly citas:readonly string[];readonly reservas:readonly string[];
}
function validarInversion(i: typeof Inversion.Type,h: SolicitudInversionAragonesa2025): Decimal {
 validarHechosInversion681(i,h)
 if(i.asignacion.aragonCentimos>0){exigir(i.domicilioSocial==="aragon" && i.domicilioFiscal==="aragon","Inversión regional sin ambos domicilios en Aragón")
  exigir(i.vinculacion.every(v=>v.rol==="sin-vinculo" || v.rol==="consejero-no-ejecutivo"),"Inversión regional con funciones ejecutivas/dirección/relación laboral")
  exigir(!h.elecciones.some(e=>e.inversion===i.id && ["aragon_inversion_acciones_mab","aragon_inversion_economia_social"].includes(e.codigo)),"Resolver incompatibilidad MAB/economía social para la misma inversión")}
 validarTenencia681(i,h)
 const total=pago(i.pago,h);const a=i.asignacion
 exigir(euros(a.estatalCentimos).plus(euros(a.aragonCentimos)).plus(euros(a.sinDeduccionCentimos)).eq(total),"Asignación estatal/autonómica/sin deducción no particiona exactamente el desembolso")
 return total
}
/** Cuantía regional generada; valida la asignación estatal pero no liquida su deducción. */
export function evaluarInversionAragonesa2025(entrada: SolicitudInversionAragonesa2025): ResultadoInversionAragonesa2025 {
 try{
  const h=Schema.decodeUnknownSync(SolicitudInversionAragonesa2025)(entrada,{onExcessProperty:"error"});ref(h.contribuyente);ref(h.casoAnual);ref(h.censoInversionesEstatales2025)
  unicos(h.inversiones.map(i=>i.id));unicos(h.inversiones.map(i=>i.pago.id))
  let total=new D(0),estatal=new D(0),regional=new D(0)
  for(const i of h.inversiones){total=total.plus(validarInversion(i,h));estatal=estatal.plus(euros(i.asignacion.estatalCentimos));regional=regional.plus(euros(i.asignacion.aragonCentimos))}
  const exceso=D.max(0,total.minus(100000));exigir(estatal.lte(100000),"Asignación estatal supera base máxima anual100000")
  exigir(regional.lte(exceso),"Asignación aragonesa supera exceso anual sobre100000; no se duplica base estatal")
  if(h.reinversion.tipo==="exencion38.2"){
   const r=h.reinversion;ref(r.referenciaAsignacionFondos);unicos(r.transmisiones.map(t=>t.id));unicos(r.inversionesDestino)
   exigir(r.transmisiones.length>0 && r.inversionesDestino.length>0,"Reinversión sin transmisiones o destinos identificados")
   exigir(r.inversionesDestino.every(id=>h.inversiones.some(i=>i.id===id)),"Destino de reinversión no incluido en el censo")
   exigir(r.inversionesDestino.length===h.inversiones.length,"Cartera mixta con inversiones ordinarias y reinvertidas: individualizar coordinación antes de agregar")
   let obtenido=new D(0);for(const t of r.transmisiones){ref(t.referenciaExencion);exigir(fecha(t.fecha)<=h.devengo,"Transmisión posterior al devengo");obtenido=obtenido.plus(euros(t.importeTotalObtenidoCentimos))}
   exigir(regional.eq(0) && estatal.eq(0),"Reinversión38.2 con bases positivas asignadas: falta resolver coordinación de umbral100000, importes obtenidos y exclusión de base autonómica68.1.1")
   exigir(total.lte(obtenido),"Reinversión con excedente positivo: no se inventa orden entre38.2 y máximo100000; requiere coordinación primaria adicional")
  }
  const importe=D.min(regional.times("0.20"),4000);const presentado=importe.times(100).toDecimalPlaces(0,D.ROUND_HALF_UP)
  return {estado:"calculo_parcial",codigo:h.codigo,contribuyente:h.contribuyente,casoAnual:h.casoAnual,
   importeExactoEuros:importe.toFixed(),importePresentadoCentimos:presentado.toNumber(),baseEstatalAsignadaEuros:estatal.toFixed(),
   baseAragonesaAsignadaEuros:regional.toFixed(),excesoSobreMaximoEstatalEuros:exceso.toFixed(),
   asignaciones:h.inversiones.map(i=>({inversion:i.id,estatalEuros:euros(i.asignacion.estatalCentimos).toFixed(),aragonEuros:euros(i.asignacion.aragonCentimos).toFixed(),sinDeduccionEuros:euros(i.asignacion.sinDeduccionCentimos).toFixed()})),
   obligaciones:h.inversiones.map(i=>({inversion:i.id,transmisionDespuesDe:aniversario(i.fechaSuscripcion,3),transmisionAntesDe:aniversario(i.fechaSuscripcion,12),seguimiento:i.seguimientoFuturo})),
   aceptacionFiscal:"pendiente",citas:["CA-aragon-206","CA-aragon-207","CA-aragon-208","CA-aragon-209","CA-aragon-211","CA-aragon-212","LIRPF-a68-10-p4","LIRPF-a68-10-p5","LIRPF-a68-10-p7","LIRPF-a68-10-p8","LIRPF-a68-10-p9","LIRPF-a68-10-p10","LIRPF-a68-10-p11","LIRPF-a68-10-p13","LIRPF-a68-10-p14","LIRPF-a68-10-p15","LIRPF-a68-10-p16","LIRPF-a68-10-p17"],
   reservas:["Importe regional antes de cuota. HALF_UP sólo presentación; exacto preservado.","Las referencias/censos y la calificación jurídica emergente son hechos aportados, no certificados por el motor.","Seguir forma, no cotización, actividad, participación y tenencia durante los años futuros; no se declaran ya cumplidos ni se liquida regularización59RIRPF."]}
 }catch(cause){return {estado:"no_soportado",motivo:cause instanceof Error?cause.message:"Hechos de inversión no conformes al esquema"}}
}
