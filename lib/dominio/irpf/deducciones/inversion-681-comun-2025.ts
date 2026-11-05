import { Schema } from "effect"
import { Texto, Entero, SaldoCentimos, Fraccion, participacionAdmisible, Pago, exigir, ref, unicos, euros, fecha, aniversario, cobertura } from "./aragon-dos-codigos-2025/comun"
/** Hechos y validación68.1 neutrales: sin elección regional, umbral Aragón ni consumo de cuota. */
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
export const Participacion681=Schema.Struct({desde:Texto,hasta:Texto,capitalPropio:Fraccion,votoPropio:Fraccion,
 familiares:Schema.Array(Schema.Struct({id:Texto,vinculo:Schema.Literals(["conyuge","consanguinidad","afinidad"]),grado:Entero,
 capitalDirectoIndirecto:Fraccion,votoDirectoIndirecto:Fraccion})),referenciaCensoSegundoGrado:Texto})
const Grupo=Schema.Union([
 Schema.Struct({tipo:Schema.Literal("sin-grupo"),referencia:Texto}),
 Schema.Struct({tipo:Schema.Literal("grupo-art42"),entidades:Schema.Array(Texto),fondosConjuntoInicioCentimos:SaldoCentimos,referenciaBalanceConjunto:Texto}),
])
export const Inversion681=Schema.Struct({id:Texto,entidad:Texto,pago:Pago,constitucion:Texto,operacion:Schema.Literals(["constitucion","ampliacion"]),
 fechaSuscripcion:Texto,escritura:Texto,domicilioSocial:Texto,domicilioFiscal:Texto,
 inicioPeriodoSociedad:Texto,finPeriodoSociedad:Texto,fondosPropiosInicioCentimos:SaldoCentimos,referenciaBalanceInicio:Texto,grupo:Grupo,
 calificacion:Calificacion,historialEntidad:Schema.Array(EstadoEntidad),historialParticipacion:Schema.Array(Participacion681),
 actividadPrevia:Schema.Struct({naturaleza:Schema.Literals(["sin-continuidad-bajo-otra-titularidad","misma-actividad-bajo-otra-titularidad"]),descripcion:Texto,referencia:Texto}),
 certificadoEntidad:Schema.Struct({ejercicio:Schema.Literal(2025),referencia:Texto,fechaEmision:Texto}),
 vinculacion:Schema.Array(Schema.Struct({desde:Texto,hasta:Texto,rol:Schema.Literals(["sin-vinculo","consejero-no-ejecutivo","ejecutivo","direccion","laboral"]),referencia:Texto})),
 transmision:Schema.NullOr(Schema.Struct({fecha:Texto,referencia:Texto})),seguimientoFuturo:Texto,
})
export type Inversion681 = typeof Inversion681.Type
export interface Contexto681 { readonly contribuyente:string; readonly devengo:"2025-12-31" }
export interface Cartera681 { readonly contribuyente:string; readonly inversiones:readonly (Inversion681 & {readonly asignacion:{readonly estatalCentimos:number}})[] }
export function validarHechosInversion681(i:Inversion681,h:Contexto681):void {
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
 }
export function validarTenencia681(i:Inversion681,h:Contexto681):void {
 const sus=fecha(i.fechaSuscripcion)
 if(i.transmision!==null){ref(i.transmision.referencia);exigir(fecha(i.transmision.fecha)<=h.devengo,"No declarar como realizada una transmisión futura");exigir(i.transmision.fecha>aniversario(sus,3) && i.transmision.fecha<aniversario(sus,12),"Tenencia debe superar estrictamente3 y ser inferior12 años: regularización no calculada")}
}
