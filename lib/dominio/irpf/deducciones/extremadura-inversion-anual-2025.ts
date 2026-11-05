import { Schema } from "effect"
import { HechosInversionExt2025 } from "./extremadura-inversion-contrato-2025"
import { validarHechosInversion681, validarTenencia681, Inversion681 } from "./inversion-681-comun-2025"
import { producirEstatal681 } from "./inversion-681-2025"
import { inversionMercantilExt } from "./extremadura-hechos-2025"
import { cobertura, exigir, fecha, ref, unicos, participacionAdmisible, euros } from "./aragon-dos-codigos-2025/comun"
import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"

/** Una fuente monetaria. Documentos declarados, nunca autenticados por el adaptador. */
export function evaluarInversionExt2025(entrada:HechosInversionExt2025,m:MagnitudesTerritorialesAnuales) {
 const h=Schema.decodeUnknownSync(HechosInversionExt2025)(entrada,{onExcessProperty:"error"})
 const c=m.caso,propio=c.contribuyenteId
 exigir(c.anio===2025 && c.comunidadAutonoma==="extremadura" && c.situacionFamiliar.tipo==="individual" && c.fechaFallecimiento===undefined && propio!==undefined,"EXT inversión: sólo2025 individual ordinaria con identidad")
 ref(propio);ref(h.censoInversionesEstatales2025)
 const x=h.inversion
 exigir(x.operacion==="constitucion" && x.constitucion.startsWith("2025-") && x.calificacion.tipo==="ordinaria" && x.grupo.tipo==="sin-grupo" && x.transmision===null,"EXT inversión: perfil excluye ampliación, emergentes, grupo y transmisión; no equivale a cero")
 exigir(x.domicilioSocial==="extremadura" && x.domicilioFiscal==="extremadura","EXT inversión: ambos domicilios deben ser extremeños")
 exigir(x.pago.pagador===propio && fecha(x.pago.fecha).startsWith("2025-") && x.pago.medio!=="efectivo","EXT inversión: pago propio2025 y bancario; restricción documental de este perfil")
 exigir(x.pago.importeCentimos>0,"EXT inversión: falta desembolso positivo de suscripción")
 const a=x.eleccion
 exigir(BigInt(a.estatalCentimos)+BigInt(a.extremaduraCentimos)===BigInt(x.pago.importeCentimos),"EXT inversión: S+E no particiona P")
 exigir(a.estatalCentimos<=10000000 && a.extremaduraCentimos<=2000000,"EXT inversión: máximo estatal100000 o perfil regional20000 excedido; sin prioridad aragonesa")
 const e=h.escrituraPublica,r=h.inscripcion
 ref(e.id);
 ref(e.notario);ref(e.protocolo);ref(e.referencia);ref(r.registro);ref(r.asiento);ref(r.referencia)
 exigir(e.id===x.escritura && e.entidad===x.entidad && fecha(e.fecha)===x.constitucion,"EXT inversión: escritura pública/entidad/constitución no conciliadas")
 unicos(e.inversores.map(v=>v.persona))
 const capital=e.inversores.reduce((total,v)=>total+BigInt(v.importeCentimos),0n)
 exigir(capital>0n && capital===BigInt(e.capitalSocialCentimos),"EXT inversión: capital social y censo notarial de suscriptores contradictorios")
 // LSC4: la constitución ordinaria declarada debe respetar el mínimo de su forma.
 exigir(capital>=(r.forma==="SA"?6000000n:100n),"EXT inversión: capital mínimo de constitución SA60000/SL1 euros no alcanzado")
 const titular=e.inversores.find(v=>v.persona===propio)
 exigir(titular!==undefined && titular.importeCentimos===x.pago.importeCentimos,"EXT inversión: importe propio en escritura no coincide con pago")
 exigir(r.entidad===x.entidad && fecha(r.fecha)>=x.constitucion && r.fecha<="2025-12-31","EXT inversión: inscripción no conciliada antes del devengo")
 cobertura(x.historialParticipacionTercero,x.constitucion,"2025-12-31")
 for(const t of x.historialParticipacionTercero){
  ref(t.referenciaCensoTercerGrado);unicos(t.familiares.map(v=>v.id))
  for(const f of t.familiares){
   exigir(f.id!==propio,"EXT inversión: inversor repetido como familiar")
   exigir(f.vinculo==="conyuge"?f.grado===0:f.grado>=1 && f.grado<=3,"EXT inversión: parentesco incoherente o fuera de tercer grado")
  }
  const propia=BigInt(x.pago.importeCentimos)
  exigir(BigInt(t.capitalPropio.numerador)*capital===propia*BigInt(t.capitalPropio.denominador) && BigInt(t.votoPropio.numerador)*capital===propia*BigInt(t.votoPropio.denominador),"EXT inversión: participación propia contradice escritura de una clase sin cambios")
  for(const f of t.familiares){
   const importe=BigInt(e.inversores.find(v=>v.persona===f.id)?.importeCentimos??0)
   exigir(BigInt(f.capitalDirectoIndirecto.numerador)*capital===importe*BigInt(f.capitalDirectoIndirecto.denominador) && BigInt(f.votoDirectoIndirecto.numerador)*capital===importe*BigInt(f.votoDirectoIndirecto.denominador),"EXT inversión: participación familiar contradice censo notarial; indirectas/cambios fuera del perfil")
  }
  participacionAdmisible([t.capitalPropio,...t.familiares.map(f=>f.capitalDirectoIndirecto)],false)
  participacionAdmisible([t.votoPropio,...t.familiares.map(f=>f.votoDirectoIndirecto)],false)
 }
 // Sólo proyectar después de comparar exactamente capital y voto de tercer grado.
 const {historialParticipacionTercero,eleccion,...hechosComunes}=x
 const i=Schema.decodeUnknownSync(Inversion681)({...hechosComunes,historialParticipacion:historialParticipacionTercero.map(t=>({
  desde:t.desde,hasta:t.hasta,capitalPropio:t.capitalPropio,votoPropio:t.votoPropio,
  familiares:t.familiares.filter(f=>f.grado<=2),referenciaCensoSegundoGrado:t.referenciaCensoTercerGrado,
 }))},{onExcessProperty:"error"})
 const contexto={contribuyente:propio,devengo:"2025-12-31" as const}
 validarHechosInversion681(i,contexto);validarTenencia681(i,contexto)
 exigir(i.historialEntidad.every(t=>t.forma===r.forma),"EXT inversión: forma SA/SL de inscripción e historia contradictorias")
 exigir(i.vinculacion.every(v=>v.rol!=="ejecutivo" && v.rol!=="direccion"),"EXT inversión: funciones ejecutivas/dirección incompatibles")
 const emp=h.empleo
 ref(emp.persona);ref(emp.contrato);ref(emp.altaSS);ref(emp.referencia)
 exigir(emp.empleador===i.entidad && emp.persona!==propio && fecha(emp.inicio)===i.constitucion && fecha(emp.fechaAltaSS)===emp.inicio && fecha(emp.finObservado)==="2025-12-31","EXT inversión: empleo y altaSS deben cubrir constitución/devengo; no cumplimiento futuro inventado")
 exigir(emp.jornadaCompletaMinutosSemanales>0 && emp.jornadaMinutosSemanales===emp.jornadaCompletaMinutosSemanales,"EXT inversión: corte de un empleado a jornada completa; parciales fuera del perfil")
 exigir(i.historialEntidad.every(t=>t.mediosPersonales.tipo==="empleados" && t.mediosPersonales.personas===1 && t.mediosPersonales.referencia===emp.contrato),"EXT inversión: censo laboral y medios personales contradictorios; perfil un empleado")
 ref(h.actividad.descripcion);unicos(h.actividad.contratosClientes);unicos(h.actividad.facturasClientes)
 exigir(h.actividad.contratosClientes.length>0 && h.actividad.facturasClientes.length>0,"EXT inversión: faltan hechos de actividad real")
 cobertura(h.actividad.contabilidad,i.constitucion,"2025-12-31")
 for(const b of h.actividad.contabilidad){
  ref(b.referenciaBalance);unicos(b.activos.map(v=>v.id))
  let total=0n,operativo=0n
  for(const v of b.activos){ref(v.descripcion);ref(v.documento);ref(v.usoActividad);total+=BigInt(v.valorContableCentimos)
   if(v.clase!=="otro-no-afecto-conservador")operativo+=BigInt(v.valorContableCentimos)
  }
  exigir(total===BigInt(b.totalActivoCentimos) && total>0n,"EXT inversión: contabilidad incompleta o activo vacío")
  exigir(operativo*2n>=total,"EXT inversión: fuera de perfil contable conservador IP; no resolver excepciones ni inventar cero")
 }
 for(const v of [h.seguimiento.tenencia,h.seguimiento.empleo24Meses,h.seguimiento.entidadYParticipacion])ref(v)
 exigir(h.estatal681.censo===h.censoInversionesEstatales2025,"EXT inversión: censo patrimonial distinto de inversión única")
 const estatal681=producirEstatal681({contribuyente:propio,inversiones:[{...i,asignacion:{estatalCentimos:eleccion.estatalCentimos}}]},h.estatal681)
 exigir(estatal681.inversiones.length===1 && estatal681.inversiones[0]===i.id && euros(eleccion.estatalCentimos).eq(estatal681.baseEuros),"EXT inversión: base estatal no identificada exactamente")
 const marco={ejercicio:2025,territorio:"extremadura",contribuyente:propio,declarantes:[propio],modalidad:"individual",baseGeneral:m.baseGeneral.toFixed(),baseAhorro:m.baseAhorro.toFixed(),minimoPersonalFamiliar:m.minimoPersonalFamiliar.toFixed()}
 const regional=inversionMercantilExt(marco,{
  pagos:[{id:i.pago.id,fecha:i.pago.fecha,pagador:propio,importe:euros(i.pago.importeCentimos).toFixed()}],
  // Cota superior demostrada con fracciones exactas, no máximo aproximado del censo.
  participacionFamiliarMaxima:"40",domicilioSocial:"extremadura",domicilioFiscal:"extremadura",direccionEjecutiva:"no",
  baseEstatalMismaInversion:{ejercicio:2025,declarantes:[propio],concepto:"base_estatal_misma_inversion",valor:estatal681.baseEuros},
  fechaEscritura:e.fecha,exhaustividad:"completa",
 })
 exigir(regional.estado==="calculo_parcial",regional.estado==="no_soportado"?regional.motivo:"EXT: generación regional ausente")
 return {...regional,estatal681,pendientes:[
  "Documentos, censos, uso de activos y exhaustividad declarados; sin autenticación automática.",
  "Mantener tenencia mínima3años y condiciones estatales3–12, empleo24meses y entidad/participación; obligaciones futuras no certificadas; regularización posterior no calculada.",
  "Cuotas consumidas exclusivamente por los libros comunes; sin arrastres automáticos.",
 ]}
}
