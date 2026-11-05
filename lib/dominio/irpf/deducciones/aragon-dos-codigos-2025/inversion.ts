import type Decimal from "decimal.js"
import { Schema } from "effect"
import { D, Texto, Entero, Centimos, SaldoCentimos, Fraccion, participacionAdmisible, Contexto, Pago, exigir, ref, unicos, euros, fecha, aniversario, cobertura, pago, type Rechazo } from "./comun"

const Calificacion = Schema.Union([
 Schema.Struct({tipo:Schema.Literal("ordinaria")}),
 Schema.Struct({tipo:Schema.Literal("emergente-Ley28"),certificacionInnovacionENISA:Texto,registroMercantil:Texto,
   inscripcion:Texto,vigenteDesde:Texto,vigenteHasta:Texto,antiguedadArt3:Schema.Literals(["general-cinco","sector-siete"]),
   sector:Texto,fundadoresEscritura:Schema.Array(Texto),escrituraFundacion:Texto}),
])
const EstadoEntidad=Schema.Struct({desde:Texto,hasta:Texto,forma:Schema.Literals(["SA","SL","SAL","SLL","otra"]),
 mercado:Schema.Literals(["no-admitida","regulado","multilateral"]),actividad:Schema.Literals(["economica","preparatoria","patrimonial"]),
 mediosPersonales:Schema.Struct({tipo:Schema.Literals(["empleados","socios-activos","servicios-externos","ninguno"]),personas:Entero,referencia:Texto}),
 mediosMateriales:Schema.Struct({tipo:Schema.Literals(["propios","arrendados","cedidos","ninguno"]),descripcion:Texto,referencia:Texto}),referencia:Texto})
const Participacion=Schema.Struct({desde:Texto,hasta:Texto,capitalPropio:Fraccion,votoPropio:Fraccion,
 familiares:Schema.Array(Schema.Struct({id:Texto,vinculo:Schema.Literals(["conyuge","consanguinidad","afinidad"]),grado:Entero,
 capitalDirectoIndirecto:Fraccion,votoDirectoIndirecto:Fraccion})),referenciaCensoSegundoGrado:Texto})
const Grupo=Schema.Union([
 Schema.Struct({tipo:Schema.Literal("sin-grupo"),referencia:Texto}),
 Schema.Struct({tipo:Schema.Literal("grupo-art42"),entidades:Schema.Array(Texto),fondosConjuntoInicioCentimos:SaldoCentimos,referenciaBalanceConjunto:Texto}),
])
const Inversion=Schema.Struct({id:Texto,entidad:Texto,pago:Pago,constitucion:Texto,operacion:Schema.Literals(["constitucion","ampliacion"]),
 fechaSuscripcion:Texto,escritura:Texto,domicilioSocial:Texto,domicilioFiscal:Texto,
 inicioPeriodoSociedad:Texto,finPeriodoSociedad:Texto,fondosPropiosInicioCentimos:SaldoCentimos,referenciaBalanceInicio:Texto,grupo:Grupo,
 calificacion:Calificacion,historialEntidad:Schema.Array(EstadoEntidad),historialParticipacion:Schema.Array(Participacion),
 actividadPrevia:Schema.Struct({naturaleza:Schema.Literals(["sin-continuidad-bajo-otra-titularidad","misma-actividad-bajo-otra-titularidad"]),descripcion:Texto,referencia:Texto}),
 certificadoEntidad:Schema.Struct({ejercicio:Schema.Literal(2025),referencia:Texto,fechaEmision:Texto}),
 vinculacion:Schema.Array(Schema.Struct({desde:Texto,hasta:Texto,rol:Schema.Literals(["sin-vinculo","consejero-no-ejecutivo","ejecutivo","direccion","laboral"]),referencia:Texto})),
 transmision:Schema.NullOr(Schema.Struct({fecha:Texto,referencia:Texto})),seguimientoFuturo:Texto,
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
 ref(i.entidad);exigir(i.entidad!==h.contribuyente,"Entidad mercantil coincide con persona contribuyente");ref(i.escritura);ref(i.seguimientoFuturo);const sus=fecha(i.fechaSuscripcion);const constitucion=fecha(i.constitucion)
 exigir(sus.startsWith("2025-") && fecha(i.pago.fecha)>=sus && constitucion<=sus,"Suscripción/pago no conciliados o anteriores a constitución")
 exigir(fecha(i.inicioPeriodoSociedad)<=sus && i.inicioPeriodoSociedad>=constitucion && fecha(i.finPeriodoSociedad)>=sus && i.finPeriodoSociedad>=i.inicioPeriodoSociedad,"Inicio del período de sociedad no conciliado con adquisición2025")
 if(i.operacion==="constitucion")exigir(sus===constitucion,"Suscripción por constitución en otra fecha")
 let emergente=false
 if(i.calificacion.tipo==="emergente-Ley28"){
  const c=i.calificacion;ref(c.certificacionInnovacionENISA);ref(c.registroMercantil);ref(c.escrituraFundacion);ref(c.sector);unicos(c.fundadoresEscritura)
  exigir(fecha(c.inscripcion)>=constitucion && c.inscripcion<=sus,"Inscripción emergente no concilia con constitución/suscripción")
  exigir(fecha(c.vigenteDesde)>=c.inscripcion && c.vigenteDesde<=sus && fecha(c.vigenteHasta)>=h.devengo,"Calificación emergente no cubre suscripción/devengo")
  exigir(h.devengo<=aniversario(c.inscripcion,c.antiguedadArt3==="sector-siete"?7:5),"Emergente fuera de antigüedad legal de art3")
  emergente=true
 }
 if(i.operacion==="ampliacion")exigir(sus<=aniversario(constitucion,emergente?7:5),"Ampliación fuera de cinco/siete años de constitución")
 cobertura(i.historialEntidad,constitucion,h.devengo)
 for(const p of i.historialEntidad){ref(p.referencia)
  exigir(p.actividad!=="patrimonial","Actividad patrimonial en período de la entidad anterior a transmisión")
  if(p.hasta>=sus){ref(p.mediosPersonales.referencia);ref(p.mediosMateriales.referencia);ref(p.mediosMateriales.descripcion)
   exigir(p.mediosPersonales.tipo!=="ninguno" && p.mediosPersonales.personas>0 && p.mediosMateriales.tipo!=="ninguno","Actividad sin medios personales/materiales concretos")
   exigir(p.forma!=="otra" && p.mercado==="no-admitida" && p.actividad==="economica","Forma/mercado/actividad no admisible durante tenencia68.1; no se exige plantilla mínima ajena a este artículo")}
 }

 ref(i.referenciaBalanceInicio);let fondos=euros(i.fondosPropiosInicioCentimos)
 if(i.grupo.tipo==="grupo-art42"){unicos(i.grupo.entidades);exigir(i.grupo.entidades.includes(i.entidad),"Entidad fuera del censo de grupo42");ref(i.grupo.referenciaBalanceConjunto);fondos=euros(i.grupo.fondosConjuntoInicioCentimos)}else ref(i.grupo.referencia)
 exigir(fondos.lte(400000),"Fondos propios iniciales de entidad/grupo superiores400000")
 const inicio=constitucion>"2025-01-01"?constitucion:"2025-01-01";cobertura(i.historialParticipacion,inicio,h.devengo)
 const fundador=i.calificacion.tipo==="emergente-Ley28" && i.calificacion.fundadoresEscritura.includes(h.contribuyente)
 for(const p of i.historialParticipacion){ref(p.referenciaCensoSegundoGrado);unicos(p.familiares.map(f=>f.id));const capital=[p.capitalPropio];const votos=[p.votoPropio]
  for(const f of p.familiares){exigir(f.id!==h.contribuyente,"Inversor repetido como familiar");exigir(f.vinculo==="conyuge"?f.grado===0:f.grado===1 || f.grado===2,"Parentesco fuera de segundo grado o incoherente");capital.push(f.capitalDirectoIndirecto);votos.push(f.votoDirectoIndirecto)}
  participacionAdmisible(capital,fundador);participacionAdmisible(votos,fundador)}
 ref(i.actividadPrevia.descripcion);ref(i.actividadPrevia.referencia);exigir(i.actividadPrevia.naturaleza==="sin-continuidad-bajo-otra-titularidad","Continuidad de la misma actividad bajo otra titularidad")
 ref(i.certificadoEntidad.referencia);exigir(fecha(i.certificadoEntidad.fechaEmision)>=sus,"Certificado anterior a suscripción: no acredita el ejercicio de adquisición")
 cobertura(i.vinculacion,sus,h.devengo);i.vinculacion.forEach(v=>ref(v.referencia))
 if(i.asignacion.aragonCentimos>0){exigir(i.domicilioSocial==="aragon" && i.domicilioFiscal==="aragon","Inversión regional sin ambos domicilios en Aragón")
  exigir(i.vinculacion.every(v=>v.rol==="sin-vinculo" || v.rol==="consejero-no-ejecutivo"),"Inversión regional con funciones ejecutivas/dirección/relación laboral")
  exigir(!h.elecciones.some(e=>e.inversion===i.id && ["aragon_inversion_acciones_mab","aragon_inversion_economia_social"].includes(e.codigo)),"Resolver incompatibilidad MAB/economía social para la misma inversión")}
 if(i.transmision!==null){ref(i.transmision.referencia);exigir(fecha(i.transmision.fecha)<=h.devengo,"No declarar como realizada una transmisión futura");exigir(i.transmision.fecha>aniversario(sus,3) && i.transmision.fecha<aniversario(sus,12),"Tenencia debe superar estrictamente3 y ser inferior12 años: regularización no calculada")}
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
