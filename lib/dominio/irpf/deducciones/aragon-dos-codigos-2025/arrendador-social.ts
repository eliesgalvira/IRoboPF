import { Schema } from "effect"
import { D, Texto, Puntos, Contexto, exigir, ref, unicos, fecha, type Rechazo } from "./comun"

// EUR del productor de rendimientos: precisión decimal preservada, nunca un importe de deducción.
const Euros=Schema.String.check(Schema.isPattern(/^-?(?:0|[1-9]\d{0,12})(?:\.\d{1,60})?$/))
const Rendimiento=Schema.Struct({id:Texto,desde:Texto,hasta:Texto,contribuyente:Texto,
 procedencia:Schema.Struct({tipo:Schema.Literal("productor-rendimientos-inmobiliarios"),calculo:Texto,referencia:Texto}),
 // Magnitudes ya individualizadas al titular; no se vuelve a multiplicar la participación.
 netoAntesReduccionesEuros:Euros,reduccionArt23_2Euros:Euros,reduccionArt23_3Euros:Euros,netoReducidoEuros:Euros,
 referenciaCalificacionReducciones:Texto,
})
const Vivienda=Schema.Struct({id:Texto,titular:Texto,participacionPuntosBasicos:Puntos,tituloTenencia:Texto,
 gestor:Schema.Struct({clase:Schema.Literals(["Gobierno-Aragon","entidad-gestora-Plan"]),entidad:Texto,habilitacionPlan:Texto}),
 cesion:Schema.Struct({desde:Texto,hasta:Texto,actaPuestaDisposicion:Texto}),rendimientos:Schema.Array(Rendimiento)})
export const SolicitudArrendadorSocial2025=Schema.Struct({...Contexto,
 codigo:Schema.Literal("aragon_arrendamiento_vivienda_social_arrendador"),viviendas:Schema.Array(Vivienda)})
export type SolicitudArrendadorSocial2025=typeof SolicitudArrendadorSocial2025.Type
/** Contrato propio para el núcleo; no es cuota externa ni un resultado de deducción. */
export type PeticionAtribucionSocial2025={
 readonly tipo:"atribuir-cuota-autonomica-BLG-arrendamientos-Plan-Aragon";
 readonly ejercicio:2025;readonly territorio:"aragon";readonly modalidad:"individual";readonly devengo:"2025-12-31";
 readonly contribuyente:string;readonly casoAnual:string;
 readonly rendimientos:readonly {readonly vivienda:string;readonly rendimiento:string;readonly productor:string;readonly netoReducidoEuros:string}[];
 readonly sumaNetoReducidoEuros:string;
 readonly magnitudSolicitada:"cuota-integra-autonomica-correspondiente-a-BLG-derivada-de-estos-rendimientos";
 readonly metodoAtribucion:"pendiente-especificacion-oficial-o-salida-contraste";
}
/** Salida que tendrá que construir el núcleo, con método contrastado y enlace a la petición concreta.
 * No hay evaluador público que acepte esta magnitud como consignación del contribuyente.
 */
export type AtribucionSocialDelNucleo2025={
 readonly tipo:"atribucion-social-calculada-por-nucleo";readonly peticion:PeticionAtribucionSocial2025;
 readonly procedencia:{readonly productor:"composicion-anual";readonly ejecucion:string;readonly metodo:string;readonly referenciaOficial:string};
 readonly baseLiquidableDerivadaEuros:string;readonly cuotaIntegraAutonomicaDerivadaEuros:string;
}
export type ResultadoArrendadorSocial2025=Rechazo | {
 readonly estado:"requiere_atribucion_anual";readonly codigo:"aragon_arrendamiento_vivienda_social_arrendador";
 readonly motivo:string;readonly peticion:PeticionAtribucionSocial2025;
 readonly formula:{readonly operacion:"multiplicar";readonly numerador:3;readonly denominador:10;
  readonly operando:"cuota-integra-autonomica-derivada-resuelta-por-nucleo"};
 readonly citas:readonly string[];readonly reservas:readonly string[];
}
/** Valida cesión al Plan y concilia el neto reducido; nunca inventa tipo medio/marginal ni un impuesto cero. */
export function prepararArrendadorSocial2025(entrada: SolicitudArrendadorSocial2025): ResultadoArrendadorSocial2025 {
 try{
  const h=Schema.decodeUnknownSync(SolicitudArrendadorSocial2025)(entrada,{onExcessProperty:"error"});ref(h.contribuyente);ref(h.casoAnual)
  unicos(h.viviendas.map(v=>v.id));exigir(h.viviendas.length>0,"Sin viviendas identificadas puestas a disposición del Plan; no se solicita cuota ficticia")
  unicos(h.viviendas.flatMap(v=>v.rendimientos.map(r=>r.id)))
  let suma=new D(0)
  const rendimientos: {vivienda:string;rendimiento:string;productor:string;netoReducidoEuros:string}[]=[]
  for(const v of h.viviendas){exigir(v.titular===h.contribuyente && v.participacionPuntosBasicos>0,"Titularidad ajena o participación nula");ref(v.tituloTenencia);ref(v.gestor.entidad);ref(v.gestor.habilitacionPlan);ref(v.cesion.actaPuestaDisposicion)
   const inicio=fecha(v.cesion.desde),fin=fecha(v.cesion.hasta);exigir(inicio<=fin && inicio<=h.devengo && fin>="2025-01-01","Cesión sin intersección con2025 o cronología invertida")
   exigir(v.rendimientos.length>0,"Falta rendimiento neto reducido individualizado, incluso cuando es cero")
   let anterior=""
   for(const r of v.rendimientos){ref(r.procedencia.calculo);ref(r.procedencia.referencia);ref(r.referenciaCalificacionReducciones)
    exigir(r.contribuyente===h.contribuyente,"Rendimiento atribuido a otro titular")
    exigir(fecha(r.desde).startsWith("2025-") && fecha(r.hasta).startsWith("2025-") && r.desde<=r.hasta && r.desde>=inicio && r.hasta<=fin,"Rendimiento fuera2025 o fuera del período cedido al Plan")
    exigir(anterior==="" || r.desde>anterior,"Periodos de rendimiento solapados o desordenados");anterior=r.hasta
    const neto=new D(r.netoAntesReduccionesEuros),r2=new D(r.reduccionArt23_2Euros),r3=new D(r.reduccionArt23_3Euros),reducido=new D(r.netoReducidoEuros)
    exigir(r2.gte(0) && r3.gte(0) && r2.plus(r3).lte(D.max(0,neto)),"Reducciones negativas o superiores al rendimiento neto positivo")
    exigir(neto.minus(r2).minus(r3).eq(reducido),"Rendimiento reducido no concilia con neto y reducciones23.2/3")
    suma=suma.plus(reducido);rendimientos.push({vivienda:v.id,rendimiento:r.id,productor:r.procedencia.calculo,netoReducidoEuros:reducido.toFixed()})
   }
  }
  return {estado:"requiere_atribucion_anual",codigo:h.codigo,
   motivo:"Falta cuota íntegra autonómica atribuible a la BLG derivada de estos rendimientos y método contrastado del núcleo. El manual de cumplimentación pide el neto reducido; no determina aquí una regla de tipo medio o marginal.",
   peticion:{tipo:"atribuir-cuota-autonomica-BLG-arrendamientos-Plan-Aragon",ejercicio:h.ejercicio,territorio:h.territorio,modalidad:h.modalidad,devengo:h.devengo,contribuyente:h.contribuyente,casoAnual:h.casoAnual,rendimientos,sumaNetoReducidoEuros:suma.toFixed(),
    magnitudSolicitada:"cuota-integra-autonomica-correspondiente-a-BLG-derivada-de-estos-rendimientos",metodoAtribucion:"pendiente-especificacion-oficial-o-salida-contraste"},
   formula:{operacion:"multiplicar",numerador:3,denominador:10,operando:"cuota-integra-autonomica-derivada-resuelta-por-nucleo"},
   citas:["CA-aragon-286","CA-aragon-287","CA-AEAT-78-8","AEAT2025-cumplimentacion-10.2.12"],
   reservas:["No hay importe de deducción, ni siquiera cuando la suma del neto reducido es cero o negativa: todavía se requiere la atribución anual.","Los rendimientos son aportes del productor inmobiliario conciliados aritméticamente; no se certifica su clasificación23.2/3 ni la cesión administrativa.","La participación sólo comprueba titularidad: los rendimientos de entrada ya pertenecen al contribuyente; no se prorratean dos veces."]}
 }catch(cause){return {estado:"no_soportado",motivo:cause instanceof Error?cause.message:"Hechos del arrendador social no conformes al esquema"}}
}
