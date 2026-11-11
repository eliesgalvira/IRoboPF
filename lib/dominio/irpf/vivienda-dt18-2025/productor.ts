import { Schema } from "effect"
import type { HechosDerechoDT18Balears2025 } from "./balears-contrato"
import { E_ViviendaRioja } from "../deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
import { D as baseViviendaDecimal } from "../deducciones/lote-a-ampliacion-2025/comun"
import { ajustarPatrimonioP5a, conciliarCuentasP5a } from "../patrimonio-p5a/productor"
import { baseVivienda, transitorio } from "../deducciones/lote-a-ampliacion-2025/vivienda"
import type { Vivienda } from "../deducciones/lote-a-ampliacion-2025/vivienda"
import { rehabilitacion } from "../deducciones/galicia-rioja-ampliacion-2025/vivienda-galicia"
import { cero, euros, suma, mas, menos, min, max, compara, por, exige, ids, fecha, edad, moverMes, documento, serial } from "../deducciones/galicia-rioja-ampliacion-2025/comun"
import type { R } from "../deducciones/galicia-rioja-ampliacion-2025/comun"
import type { HechosDT182025, HechosDT18Murcia2025, HechosDerechoDT18Rioja2025 } from "./contrato"
import type { MagnitudesTerritorialesAnuales } from "../deducciones/anual-territorial"
import type { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial-esquemas"
export const igualViviendaDT18=Schema.toEquivalence(E_ViviendaRioja)
const InmuebleComun=Schema.Struct({...E_ViviendaRioja.fields.inmueble.fields,territorio:Schema.Literals(["galicia","la-rioja","murcia","illes-balears"])})
const igualInmueble=Schema.toEquivalence(InmuebleComun)
const igualViviendaComun=Schema.toEquivalence(Schema.Struct({...E_ViviendaRioja.fields,inmueble:InmuebleComun}))
const igualDocumento=Schema.toEquivalence(E_ViviendaRioja.fields.deduccionPre2013)
export const CODIGOS_DT18_RIOJA=["rioja_obras_rehabilitacion_vivienda_habitual","rioja_adquisicion_construccion_vivienda_jovenes","rioja_adecuacion_vivienda_discapacidad"] as const
const codigoPorOperacion={adquisicion:CODIGOS_DT18_RIOJA[1],rehabilitacion:CODIGOS_DT18_RIOJA[0],adecuacion:CODIGOS_DT18_RIOJA[2]} as const
function textoEuros(a:R):string{const n=BigInt(centimos(a));return String(n/100n)+"."+String(n%100n).padStart(2,"0")}
function igual(a:R,b:R,m:string){exige(compara(a,b)===0,"DT18: "+m)}
function centimos(a:R):number{exige(a.d===1n&&a.n>=0n&&a.n<=BigInt(Number.MAX_SAFE_INTEGER),"DT18: importe fuera del transporte entero seguro de fórmula revisada");return Number(a.n)}
type ViviendaDT18 = HechosDT182025["proyectos"][number]["vivienda"] | HechosDT18Murcia2025["proyectos"][number]["vivienda"] | HechosDerechoDT18Balears2025["proyectos"][number]["vivienda"]
type HechosComunes<V extends ViviendaDT18> = Omit<HechosDT182025,"proyectos"|"ejercicioDelDerecho"> & {
 readonly ejercicioDelDerecho: "ejercer_integramente" | "aplicar" | "no_aplicar"
 readonly proyectos: readonly (Omit<HechosDT182025["proyectos"][number],"vivienda"> & {readonly vivienda:V})[]
}
/** Núcleo estatal único; las reservas E38 sólo existen para Rioja. */
function producirDT18Comun<V extends ViviendaDT18>(h:HechosComunes<V>,caso:MagnitudesTerritorialesAnuales["caso"],solicitudes:SolicitudDeduccionesTerritoriales2025["solicitudes"],territorio:"la-rioja"|"murcia"|"illes-balears", soloDerechoRioja = false) {
 const cambioEnEjercicio = territorio === "illes-balears" || soloDerechoRioja
 exige(caso.anio===2025&&caso.comunidadAutonoma===territorio&&caso.fechaFallecimiento===undefined&&caso.situacionFamiliar.tipo==="individual"&&caso.contribuyenteId===h.persona&&edad(h.nacimiento)===caso.situacionFamiliar.edad,"DT18: ámbito individual2025/territorio/identidad/edad")
 exige(h.exhaustividad==="primera_unica_vivienda_sin_transmisiones_reinversiones_ni_otras_inversiones","DT18: faltan antecedentes patrimoniales exhaustivos")
 exige(ids(h.proyectos.map(p=>p.id))&&ids(h.proyectos.map(p=>p.operacion))&&h.proyectos.some(p=>p.operacion==="adquisicion"),"DT18: primera adquisición y proyectos únicos requeridos; construcción/ampliación requieren productor específico")
 exige(cambioEnEjercicio || h.ejercicioDelDerecho==="ejercer_integramente","DT18: ejercicio parcial o no ejercicio requiere política de aplicación separada, no acredita ausencia de derecho")
 const a=h.adquisicion,hist=h.historia
 exige(fecha(a.fecha)&&a.fecha>=h.nacimiento&&a.fecha<"2013-01-01","DT18.1a: primera adquisición anterior2013")
 documento(a.escritura);documento(a.valorCierre.documento)
 exige(a.escritura.fecha===a.fecha&&a.valorCierre.documento.fecha==="2025-12-31"&&a.vendedor!==h.persona&&a.vendedor.trim().length>0,"DT18: escritura/vendedor/cierre")
 exige(hist.desde===h.nacimiento&&hist.hasta==="2025-12-31"&&hist.derechos.length===1&&hist.anticipos.length===0,"DT18: censo vital único; anticipos/construcción/otros derechos requieren historia específica")
 documento(hist.documento);exige(hist.documento.fecha>="2025-12-31","DT18: censo vital sin cierre")
 const derecho=hist.derechos[0];exige(derecho!==undefined&&derecho.inmueble===a.inmueble&&derecho.titular===h.persona&&derecho.adquisicion===a.fecha&&derecho.transmision===null,"DT18: transmisión u otro derecho requiere productor de ganancias/reinversión y bases anteriores")
 documento(derecho.titulo)
 const anioNacimiento=Number(h.nacimiento.slice(0,4))
 exige((soloDerechoRioja ? hist.ejercicios.length===1 : hist.ejercicios.length===2025-anioNacimiento)&&new Set(hist.ejercicios.map(e=>e.anio)).size===hist.ejercicios.length,"DT18: ejercicios vitales incompletos")
 for(const e of hist.ejercicios){documento(e.documento);exige(Number.isInteger(e.anio)&&e.anio>=anioNacimiento&&e.anio<2025&&e.documento.fecha>=`${e.anio}-12-31`,"DT18: ejercicio fiscal inválido");for(const evento of e.eventos){documento(evento.documento);exige(evento.tipo==="inversion_vivienda"&&evento.inmueble===a.inmueble,"DT18: reinversión/otra vivienda requiere productor específico")}}
 conciliarCuentasP5a(h.cuentas,h.movimientos)
 const prestamos=h.proyectos.flatMap(p=>p.prestamo===null?[]:[p.prestamo])
 const censoEsperado=[...h.cuentas.map(x=>x.id),a.inmueble,...prestamos.map(x=>x.id)]
 exige(ids(censoEsperado)&&ids(h.censo.map(x=>x.id))&&h.censo.length===censoEsperado.length,"DT18: censo patrimonial incompleto/duplicado")
 for(const c of h.censo){documento(c.documento);exige(censoEsperado.includes(c.id)&&c.titular===h.persona&&c.participacion[0]===1&&c.participacion[1]===1&&c.inicio==="presente"&&c.cierre==="presente"&&c.documento.fecha>="2025-12-31"&&c.tipo===(c.id===a.inmueble?"vivienda":prestamos.some(l=>l.id===c.id)?"prestamo":"cuenta_euros"),"DT18: propiedad exclusiva/categoría/cortes no conciliados")}
 const movimientosPagados=h.movimientos.filter(m=>["amortizacion","intereses","gastos_financiacion"].includes(m.clase))
 exige(h.movimientos.every(m=>!["precio","disposicion"].includes(m.clase)),"DT18: nuevas inversiones/disposiciones2025/refinanciación requieren productor propio")
 exige(ids(h.proyectos.flatMap(p=>p.vivienda.pagos.map(x=>x.id)))&&ids(h.proyectos.flatMap(p=>p.pagosOriginales.map(x=>x.id)))&&ids(h.proyectos.flatMap(p=>p.pagosOriginales.map(x=>x.documento.referencia))),"DT18: pagos duplicados entre proyectos")
 exige(movimientosPagados.length===h.proyectos.reduce((n,p)=>n+p.vivienda.pagos.length,0),"DT18: inventario2025 no exhaustivo")
 const pagosHistoricosPrestamo=prestamos.flatMap(l=>l.amortizacionesAnteriores)
 exige(ids(pagosHistoricosPrestamo.map(x=>x.id))&&ids(pagosHistoricosPrestamo.map(x=>x.documento.referencia)),"DT18: amortización histórica reutilizada entre préstamos")
 const coste=suma(h.proyectos.map(p=>euros(p.coste)))
 const deudaInicio=suma(prestamos.map(l=>euros(l.principalInicio.importe))),deudaFinal=suma(prestamos.map(l=>euros(l.principalFinal.importe)))
 const isd=suma(h.movimientos.filter(m=>m.clase==="donacion"||m.clase==="herencia").map(m=>euros(m.importe)))
 const patrimonio=ajustarPatrimonioP5a(suma(h.cuentas.map(c=>euros(c.inicio.importe))),suma(h.cuentas.map(c=>euros(c.cierre.importe))),coste,euros(a.valorCierre.importe),coste,deudaInicio,deudaFinal,isd)
 const capital=suma(movimientosPagados.filter(m=>m.clase==="amortizacion").map(m=>euros(m.importe)))
 const cumplePatrimonio=compara(menos(patrimonio.final,patrimonio.inicial),capital)>=0
 exige(cumplePatrimonio || compara(menos(patrimonio.final,patrimonio.inicial),cero)<=0 ||
   h.proyectos.filter(p=>p.vivienda.pagos.some(x=>x.concepto==="amortizacion"&&compara(euros(x.importe),cero)>0)).length<=1,"DT18: incremento insuficiente entre varios proyectos requiere atribución explícita de capital; no se calcula importe")
 const referencia=h.proyectos[0]!.vivienda.inmueble
 const proyectos=h.proyectos.map(p=>{
  const v=p.vivienda,l=p.prestamo
  exige(v.operacion===p.operacion&&v.inmueble.id===a.inmueble&&igualInmueble(v.inmueble,referencia)&&v.inmueble.adquisicion===a.fecha&&v.inmueble.territorio===(soloDerechoRioja?"galicia":territorio)&&v.inmueble.uso==="habitual"&&v.inmueble.titulares.length===1&&v.inmueble.titulares[0]?.titular===h.persona&&v.inmueble.titulares[0]?.numerador===1&&v.inmueble.titulares[0]?.denominador===1,"DT18: inmueble/titular/uso contradictorio entre proyectos")
  igual(euros(v.inmueble.precioAdquisicion),euros(a.precio),"precio de inmueble contradictorio")
  exige(v.excepcionOcupacion===null&&v.excepcionPermanencia===null&&v.ampliacionPlazoConstruccion===null&&v.excepcion6812===null&&v.coberturaIntereses==="0","DT18: excepciones, coberturas y ampliaciones requieren productor específico; no inferir excepción de documento")
  exige(fecha(v.primeraOcupacion)&&v.primeraOcupacion>=a.fecha&&v.primeraOcupacion<=moverMes(a.fecha,12)&&v.inmueble.residencia.desde<=v.primeraOcupacion&&fecha(v.inmueble.residencia.desde)&&fecha(v.inmueble.residencia.hasta)&&(cambioEnEjercicio ? v.inmueble.residencia.hasta>="2025-01-01"&&v.inmueble.residencia.hasta<"2025-12-31"&&moverMes(v.primeraOcupacion,36)<=v.inmueble.residencia.hasta : v.inmueble.residencia.hasta>="2025-12-31"&&moverMes(v.primeraOcupacion,36)<="2025-12-31"),"DT18: ocupación/permanencia efectiva ordinaria no acreditada")
  exige(fecha(p.fechaInicio)&&fecha(p.terminacion)&&p.fechaInicio>=a.fecha&&p.fechaInicio<=p.terminacion&&p.fechaInicio<"2013-01-01"&&p.terminacion<"2017-01-01"&&v.fechaInicioInversion===p.fechaInicio&&v.finConstruccion===p.terminacion,"DT18: inicio/fin históricos contradictorios")
  documento(p.certificadoFin);exige(p.certificadoFin.fecha>=p.terminacion,"DT18: certificado fin anterior a terminación")
  exige(ids(p.pagosOriginales.map(x=>x.id))&&ids(p.pagosOriginales.map(x=>x.documento.referencia))&&p.pagosOriginales.length>0,"DT18: faltan pagos originales completos")
  for(const x of p.pagosOriginales){documento(x.documento);exige(fecha(x.fecha)&&x.fecha>=p.fechaInicio&&x.fecha<=p.terminacion&&x.documento.fecha>=x.fecha&&x.pagador===h.persona&&x.receptor.trim().length>0&&x.receptor!==h.persona&&compara(euros(x.importe),cero)>0,"DT18: pago histórico inválido")}
  igual(suma(p.pagosOriginales.map(x=>euros(x.importe))),euros(p.coste),"coste no concilia con pagos originales")
  const primero=p.pagosOriginales.reduce((a,b)=>a.fecha<b.fecha?a:b)
  exige(primero.fecha<"2013-01-01"&&(p.operacion==="adquisicion"||v.primerPagoObra===primero.fecha),"DT18.1: primer pago de obra no anterior2013")
  if(p.operacion==="adquisicion"){igual(euros(p.coste),euros(a.precio),"coste compra");exige(p.fechaInicio===a.fecha&&p.terminacion===a.fecha&&p.pagosOriginales.every(x=>x.receptor===a.vendedor),"DT18: pago compra no vinculado a vendedor/fecha")}
  if(p.operacion==="rehabilitacion"){exige(v.obra!==null&&v.obra.pagos.length===0&&v.obra.inicio===p.fechaInicio&&v.obra.fin===p.terminacion&&rehabilitacion(v.inmueble,v.obra),"DT18.1b: rehabilitación estructural no acreditada");igual(euros(v.obra.costeGlobal),euros(p.coste),"coste obra contradictorio")}
  if(p.operacion==="adecuacion"){exige(v.informeDiscapacidad!==null&&caso.situacionFamiliar.discapacidad._tag!=="SinDiscapacidad","DT18.1c: discapacidad propia/informe competente requerido");documento(v.informeDiscapacidad);exige(p.calificacionAdecuacion!==null&&p.calificacionAdecuacion.necesidad==="accesibilidad_y_comunicacion_sensorial_necesarias"&&igualDocumento(p.calificacionAdecuacion.informe,v.informeDiscapacidad),"DT18: falta conclusión técnica competente sobre necesidad de adecuación")}else exige(p.calificacionAdecuacion===null,"DT18: informe de adecuación en otra modalidad")
  const aplicacion=p.aplicacionAnterior
  documento(aplicacion.declaracionPresentada)
  exige(aplicacion.naturaleza==="deduccion_efectivamente_practicada"&&aplicacion.proyecto===p.id&&Number.isInteger(aplicacion.ejercicio)&&aplicacion.ejercicio>=Number(primero.fecha.slice(0,4))&&aplicacion.ejercicio<2013&&aplicacion.declaracionPresentada.fecha>=`${aplicacion.ejercicio}-12-31`,"DT18: constancia efectiva previa2013 ajena/ausente; no sustituir por derecho o solicitud")
  exige(hist.ejercicios.some(e=>e.anio===aplicacion.ejercicio&&e.eventos.some(x=>x.inmueble===a.inmueble&&x.tipo==="inversion_vivienda")),"DT18: aplicación no conciliada con declaración histórica censada")
  exige(v.deduccionPre2013!==null&&v.ejercicioDeduccionAnterior===aplicacion.ejercicio&&igualDocumento(v.deduccionPre2013,aplicacion.declaracionPresentada),"DT18: declaración anterior contradictoria con proyecto")
  if(l===null)exige(v.pagos.length===0,"DT18: pagos2025 sin préstamo original; precio aplazado/coste nuevo requieren productor propio")
  else{
   documento(l.contrato);documento(l.disposicion.documento);documento(l.principalInicio.documento);documento(l.principalFinal.documento)
   exige(l.exhaustividad==="original_exclusivo_sin_refinanciacion_ni_disposiciones_adicionales"&&fecha(l.fecha)&&l.fecha===p.fechaInicio&&l.contrato.fecha===l.fecha&&l.disposicion.documento.fecha===l.fecha&&l.principalInicio.documento.fecha==="2025-01-01"&&l.principalFinal.documento.fecha==="2025-12-31"&&l.acreedor!==h.persona&&l.acreedor.trim().length>0,"DT18: préstamo original no vinculado")
   const original=euros(l.disposicion.importe);exige(compara(original,cero)>0&&compara(original,euros(p.coste))<=0,"DT18: financiación mixta/excesiva")
   exige(ids(l.amortizacionesAnteriores.map(x=>x.id)),"DT18: amortizaciones históricas duplicadas")
   let ultima=l.fecha
   for(const x of l.amortizacionesAnteriores){documento(x.documento);exige(fecha(x.fecha)&&x.fecha>=ultima&&x.fecha<"2025-01-01"&&x.pagador===h.persona&&x.receptor===l.acreedor&&x.documento.fecha>=x.fecha&&compara(euros(x.importe),cero)>0,"DT18: amortización anterior inválida");ultima=x.fecha}
   const principal=menos(original,suma(l.amortizacionesAnteriores.map(x=>euros(x.importe))))
   exige(compara(principal,cero)>=0,"DT18: principal negativo")
   igual(principal,euros(l.principalInicio.importe),"principal inicial no reconstruido")
   exige(compara(menos(euros(p.coste),original),cero)>0||l.amortizacionesAnteriores.some(x=>Number(x.fecha.slice(0,4))===aplicacion.ejercicio),"DT18: aplicación anterior sin desembolso propio reconstruido; intereses históricos requieren ampliar productor")
   exige(ids(l.pagos2025)&&l.pagos2025.length===v.pagos.length&&v.pagos.every(x=>l.pagos2025.includes(x.id)),"DT18: pagos2025 no conciliados con préstamo")
   for(const x of v.pagos){const m=movimientosPagados.find(m=>m.id===x.id);exige(m!==undefined&&m.fecha===x.fecha&&m.importe===x.importe&&m.documento.referencia===x.factura&&x.pagador===h.persona&&x.receptor===l.acreedor&&x.medio!=="efectivo"&&x.subvencion==="0"&&x.especieExenta==="0"&&x.concepto===(m.clase==="gastos_financiacion"?"gastos":m.clase),"DT18: pago2025 ajeno/duplicado/no vinculado a concepto, banco y documento")}
   igual(menos(principal,suma(v.pagos.filter(x=>x.concepto==="amortizacion").map(x=>euros(x.importe)))),euros(l.principalFinal.importe),"principal cierre no concilia")
  }
  if(cambioEnEjercicio)exige(v.pagos.every(x=>fecha(x.fecha)&&x.fecha>="2025-01-01"&&x.fecha<=v.inmueble.residencia.hasta),"T06_DT18_PAGO_FUERA_HABITUAL: pago posterior al cambio o fuera2025")
  const numero=(v:R)=>centimos(v)
  const pago=(x:typeof v.pagos[number])=>({id:x.id,fecha:x.fecha,pagador:x.pagador,importeCentimos:numero(euros(x.importe)),medio:"transferencia" as const,justificante:x.factura,regimen:"personal" as const,conyuges:[]})
  const nacional:Vivienda={id:a.inmueble,adquisicion:a.fecha,terminacionObras:p.terminacion,ocupacion:v.primeraOcupacion,residenciaDesde:v.inmueble.residencia.desde,situacion:"residencia-continuada",referenciaOcupacion:a.escritura.referencia,referenciaMantenimiento:hist.documento.referencia,operacion:p.operacion==="adecuacion"?"adecuacion-discapacidad":p.operacion,anterior:"primera-vivienda",inversionAcumuladaAntes2025Centimos:numero(menos(coste,deudaInicio)),baseDeducidaViviendasAnterioresCentimos:0,gananciaExentaReinversionCentimos:0,incrementoPatrimonialComputableCentimos:numero(max(cero,menos(patrimonio.final,patrimonio.inicial))),referenciaPatrimonio:hist.documento.referencia,pagosCapitalYGastos:v.pagos.filter(x=>x.concepto!=="intereses").map(pago),pagosIntereses:v.pagos.filter(x=>x.concepto==="intereses").map(pago),coberturasInteresesPercibidasCentimos:0,rehabilitacion:{via:p.operacion==="rehabilitacion"?"reconstruccion-estructural":"no-aplica",inicio:p.fechaInicio,resolucionPlan:"",costeGlobalCentimos:numero(euros(p.coste)),valorSinSueloCentimos:numero(menos(euros(a.fecha>=moverMes(p.fechaInicio,-24)?v.inmueble.precioAdquisicion:v.inmueble.valorMercadoInicio),euros(v.inmueble.valorSuelo))),referenciaValoracion:p.certificadoFin.referencia,fechaValoracion:p.fechaInicio,naturalezaValor:a.fecha>=moverMes(p.fechaInicio,-24)?"adquisicion-dos-anios":"mercado-inicio",memoriaEstructurasFachadasCubiertas:p.certificadoFin.referencia},transitorio:{primeraInversion:primero.fecha,deduccionAntes2013:"practicada",referencia:aplicacion.declaracionPresentada.referencia,finObras:p.terminacion,resolucionAdecuacionDiscapacidad:v.informeDiscapacidad?.referencia??""}}
  transitorio(nacional)
  const ambito={ejercicio:2025 as const,modalidad:"individual" as const,devengo:"2025-12-31" as const,contribuyente:h.persona}
  // La fórmula revisada produce una sola vez la base; el censo acredita ceros de otras viviendas.
  if(p.operacion==="rehabilitacion")exige(v.inmueble.valorSuelo!=="0","DT18: suelo explícito requerido en este perfil; proporción catastral requiere transporte adicional")
  const capitalSinFinanciacion = new (baseViviendaDecimal)(textoEuros(suma(v.pagos.filter(x=>x.concepto==="amortizacion").map(x=>euros(x.importe)))))
  const base = euros(baseVivienda(nacional, ambito, true, p.operacion === "adecuacion", capitalSinFinanciacion, true).toFixed())
  return {id:p.id,operacion:p.operacion,vivienda:v,base}
 })
 const baseDerechoSinAdecuacion=min(euros("9040"),suma(proyectos.filter(p=>p.operacion!=="adecuacion").map(p=>p.base)))
 const baseDerechoAdecuacion=min(euros("12080"),suma(proyectos.filter(p=>p.operacion==="adecuacion").map(p=>p.base)))
 const baseEstatalSinAdecuacion=baseDerechoSinAdecuacion
 const baseEstatalAdecuacion=baseDerechoAdecuacion
 const generada=mas(por(baseEstatalSinAdecuacion,75,1000),por(baseEstatalAdecuacion,10,100))
 let reservaRehabilitacionAdecuacion=cero,reservaAdquisicionSegunda=cero
 const reservas=(territorio!=="la-rioja"||soloDerechoRioja?[]:solicitudes).map(s=>{
  exige(s.lote==="E38"&&CODIGOS_DT18_RIOJA.some(c=>c===s.hechos.codigo),"DT18: otros consumidores requieren coordinación por valor explícita")
  const regional=s.hechos
  exige(regional.codigo==="rioja_obras_rehabilitacion_vivienda_habitual"||regional.codigo==="rioja_adquisicion_construccion_vivienda_jovenes"||regional.codigo==="rioja_adecuacion_vivienda_discapacidad","DT18: código regional no representado")
  const codigo=regional.codigo
  const p=proyectos.find(p=>codigoPorOperacion[p.operacion]===codigo)
  exige(p!==undefined&&regional.viviendas.length===1&&regional.viviendas[0]!==undefined&&igualViviendaComun(regional.viviendas[0],p.vivienda),"DT18: solicitud regional no concilia exactamente con proyecto histórico")
  const previaRehabilitacionAdecuacion=reservaRehabilitacionAdecuacion,previaAdquisicionSegunda=reservaAdquisicionSegunda
  if(p.operacion==="adquisicion")reservaAdquisicionSegunda=mas(reservaAdquisicionSegunda,min(edad(h.nacimiento)<36?p.base:cero,menos(euros("9040"),baseEstatalSinAdecuacion)))
  else reservaRehabilitacionAdecuacion=min(euros("9040"),mas(reservaRehabilitacionAdecuacion,p.base))
  return {codigo,proyecto:p.id,previaRehabilitacionAdecuacion,previaAdquisicionSegunda}
 })
 exige((territorio!=="la-rioja"||soloDerechoRioja||reservas.length>0)&&ids(reservas.map(r=>r.codigo)),"DT18: solicitudes regionales ausentes/repetidas")
 return {hechos:h,persona:h.persona,nacimiento:h.nacimiento,proyectos,patrimonio,capital,cumplePatrimonio,baseDerechoSinAdecuacion,baseDerechoAdecuacion,baseEstatalSinAdecuacion,baseEstatalAdecuacion,generadaEstatal:generada,generadaAutonomica:generada,reservas,historiaDerivada:{inversionAnteriorDeducida:"0",gananciaExentaReinversion:"0",inversionNuevaAcumuladaAntes2025:textoEuros(menos(coste,deudaInicio))},publico:{reservaRegionalFinal:{adquisicionSegunda:serial(reservaAdquisicionSegunda),rehabilitacionAdecuacion:serial(reservaRehabilitacionAdecuacion)},patrimonio:{inicial:serial(patrimonio.inicial),final:serial(patrimonio.final),incremento:serial(menos(patrimonio.final,patrimonio.inicial)),capital:serial(capital),isdExcluido:serial(isd),variacionExcluida:serial(patrimonio.variacion)},proyectos:proyectos.map(p=>({id:p.id,operacion:p.operacion,gasto2025:serial(suma(p.vivienda.pagos.map(x=>euros(x.importe)))),baseDerecho:serial(p.base)})),cumpleCondicionPatrimonial:cumplePatrimonio,derecho:"acceso_historico_DT18_reconstruido" as const,ejercicioDelDerecho:h.ejercicioDelDerecho,baseDerechoSinAdecuacion:serial(baseDerechoSinAdecuacion),baseDerechoAdecuacion:serial(baseDerechoAdecuacion),baseEstatalSinAdecuacion:serial(baseEstatalSinAdecuacion),baseEstatalAdecuacion:serial(baseEstatalAdecuacion),reservas:reservas.map(x=>({...x,previaRehabilitacionAdecuacion:serial(x.previaRehabilitacionAdecuacion),previaAdquisicionSegunda:serial(x.previaAdquisicionSegunda)}))}}
}
export function producirDT182025(h:HechosDT182025,caso:MagnitudesTerritorialesAnuales["caso"],solicitudes:SolicitudDeduccionesTerritoriales2025["solicitudes"]){
 return {...producirDT18Comun<HechosDT182025["proyectos"][number]["vivienda"]>(h,caso,solicitudes,"la-rioja"),hechos:h,territorio:"la-rioja" as const}
}
export const CODIGO_DT18_MURCIA="murcia_regimen_transitorio_inversion_vivienda_habitual" as const
export function producirDT18Murcia2025(h:HechosDT18Murcia2025,caso:MagnitudesTerritorialesAnuales["caso"],solicitudes:SolicitudDeduccionesTerritoriales2025["solicitudes"]){
 exige(h.proyectos.length===1&&h.proyectos[0]?.operacion==="adquisicion","DT18 Murcia: sólo primera adquisición ordinaria; obras, construcción y adecuación fuera del candidato")
 exige(solicitudes.length===1&&solicitudes.every(s=>s.lote==="F-ampliado"&&s.codigo===CODIGO_DT18_MURCIA&&s.hechos.ramaTransitoria==="estatal_pre2013"),"DT18 Murcia: sólo DT primera.4; no equivale a98/99/00 ni Uno_vigente; concurrencias fuera del candidato")
 return {...producirDT18Comun<HechosDT18Murcia2025["proyectos"][number]["vivienda"]>(h,caso,solicitudes,"murcia"),hechos:h,territorio:"murcia" as const}
}
export type LibroDT182025=ReturnType<typeof producirDT182025>|ReturnType<typeof producirDT18Murcia2025>

/** Los dos censos únicos no constituyen un censo patrimonial conjunto. */
export function validarCensosViviendaRioja(s:SolicitudDeduccionesTerritoriales2025):void{
 const segunda=s.solicitudes.some(x=>x.lote==="E38"&&(x.hechos.codigo==="rioja_segunda_vivienda_medio_rural"||x.patrimonioRiojaAnterior!==undefined))
 const habitual=s.viviendaDT182025!==undefined||s.solicitudes.some(x=>x.lote==="E38"&&CODIGOS_DT18_RIOJA.some(c=>c===x.hechos.codigo))
 if(segunda&&habitual)throw new RangeError("RIOJA_CENSOS_UNICOS_INCOMPATIBLES: segunda residencia y vivienda habitual DT18 requieren censo conjunto no representado; no sumar patrimonio ni reutilizar base9040")
}

/** Determina derecho material, sin consumir cuota ni ejercer deducción estatal.
 * La elección se conserva pero no participa en baseDerecho. Sólo adquisición.
 * Calendario y renta del resto del año se concilian en el consumidor balear. */
export function determinarDerechoDT18Balears2025(h:HechosDerechoDT18Balears2025, caso:MagnitudesTerritorialesAnuales["caso"]){
 exige(h.proyectos.length===1&&h.proyectos[0]?.operacion==="adquisicion","T06_DT18_ADQUISICION_UNICA: otras modalidades necesitan historia propia")
 try {
  exige(h.proyectos.every(p=>p.vivienda.pagos.every(x=>x.concepto==="amortizacion"||x.concepto==="intereses")),"T06_DT18_PAGOS_MODALIDAD: sólo capital e intereses")
  const r=producirDT18Comun<HechosDerechoDT18Balears2025["proyectos"][number]["vivienda"]>(h,caso,[],"illes-balears")
  return {baseDerecho:r.baseDerechoSinAdecuacion,conDerecho:compara(r.baseDerechoSinAdecuacion,cero)>0,
    eleccion:h.ejercicioDelDerecho,cumplePatrimonio:r.cumplePatrimonio,patrimonio:r.patrimonio,capital:r.capital}
 } catch(error) {
  // Sólo causas de dominio reconocidas. Un TypeError/import no se promueve a
  // historia fiscal desconocida ni a un derecho negativo calculado.
  if(error instanceof Error && !(error instanceof TypeError) && /^(DT18|P5a|T06_DT18)/.test(error.message))
   throw new RangeError("T06_DT18_HISTORIA: "+error.message)
  throw error
 }
}

/** Sólo prueba del derecho estatal durante2025; ninguna cuota se consume.
 * La aplicación efectiva pre2013 y el censo civil vital bastan para esta rama:
 * no se exigen declaraciones sin hechos decisivos de cada año de vida. */
export function determinarDerechoDT18Rioja2025(h: HechosDerechoDT18Rioja2025, caso: MagnitudesTerritorialesAnuales["caso"]) {
 exige(h.proyectos.length === 1 && h.proyectos[0]?.operacion === "adquisicion" &&
   h.proyectos[0].vivienda.pagos.every(x => x.concepto === "amortizacion" || x.concepto === "intereses"),
   "RIOJA_DT18: sólo adquisición única, amortización e intereses")
 const proyecto = h.proyectos[0], ejercicio = h.historia.ejercicios[0]
 exige(proyecto !== undefined && ejercicio !== undefined &&
   ejercicio.anio === proyecto.aplicacionAnterior.ejercicio &&
   ejercicio.documento.referencia === proyecto.aplicacionAnterior.declaracionPresentada.referencia &&
   ejercicio.documento.fecha === proyecto.aplicacionAnterior.declaracionPresentada.fecha &&
   ejercicio.eventos.length === 1 && ejercicio.eventos[0]?.documento.referencia === ejercicio.documento.referencia &&
   ejercicio.eventos[0]?.documento.fecha === ejercicio.documento.fecha,
   "RIOJA_DT18: declaración de práctica efectiva no conciliada")
 const r = producirDT18Comun(h, caso, [], "la-rioja", true)
 return { conDerecho: compara(r.baseDerechoSinAdecuacion, cero) > 0,
   baseDerecho: r.baseDerechoSinAdecuacion, eleccion: h.ejercicioDelDerecho }
}
