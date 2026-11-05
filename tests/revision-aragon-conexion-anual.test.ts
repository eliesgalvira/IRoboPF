import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { describe, expect, it } from "vitest"
import datos from "./fixtures/aragon-conexion-anual-20261105.json"
import { aplicarDeduccionesTerritoriales2025, SolicitudDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"

const inversion=()=>structuredClone(datos.inversion)
const social=()=>structuredClone(datos.social)
const solicitud=(solicitudes: readonly Schema.Json[])=>Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes},{onExcessProperty:"error"})
function contexto(cuota="5000"): MagnitudesTerritorialesAnuales {
 return {caso:{anio:2025,comunidadAutonoma:"aragon",contribuyenteId:"t",situacionFamiliar:{tipo:"individual",edad:30,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},
  basesLiquidables:{general:new Decimal(40000),ahorro:new Decimal(0)},baseGeneral:new Decimal(40000),baseAhorro:new Decimal(0),minimoPersonalFamiliar:new Decimal(5550),cuotaAutonomica:new Decimal(cuota),sujetosConMinimo:[],atribucionesMinimo:[],componentesMinimoEstatal:{contribuyente:new Decimal(5550),descendientes:new Decimal(0)},rentasTrabajoAnuales:{integroTrabajo:new Decimal(40000),restoRentas:new Decimal(0)}}
}
function tecnica(s: SolicitudDeduccionesTerritoriales2025, brutoCentimos=4000000): CasoFiscalAnual {
 return {anio:2025,comunidadAutonoma:"aragon",contribuyenteId:"t",situacionFamiliar:{tipo:"individual",edad:30,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:brutoCentimos}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:10000,pagosACuentaCentimos:20000,deduccionesTerritoriales2025:s}
}
function efectiva(s: SolicitudDeduccionesTerritoriales2025): CasoFiscalAnualExplicito {
 return {ejercicio:2025,comunidadAutonoma:"aragon",contribuyenteId:"t",edad:30,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado-sintetico"]},
 trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"trabajo",clase:"empleo-laboral",integro:"40000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[{ejercicio:2025,operacionId:"retencion-unica",procedencia:"certificado",importe:"100",efectiva:true}]}
}

// Oráculos de esta revisión: enteros/BigInt, sin consultar evaluaciones para generar esperados.
function baseRegional(centimos: number) {
 const s=inversion(); const i=s.hechos.inversiones[1]
 i.pago.importeCentimos=5000000+centimos;i.asignacion.aragonCentimos=centimos;i.asignacion.sinDeduccionCentimos=5000000
 return s
}
function fallo(s: SolicitudDeduccionesTerritoriales2025, api: "tecnica"|"efectiva") {
 const r=api==="tecnica"?Effect.runSync(Effect.result(liquidarIrpfAnual(tecnica(s),{modo:"canonico"}))):Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(efectiva(s))))
 expect(r._tag).toBe("Failure")
 if(r._tag!=="Failure") throw new Error("Anual aceptada indebidamente")
 return r.failure
}
describe("Revisión independiente de conexión anual Aragón2",()=>{
 for(const c of [0,1,2,3,7,999999,1000000,1999999,2000000,2000001,4000000]) it("20% y tope4000: base céntimos "+c,()=>{
  const r=aplicarDeduccionesTerritoriales2025(solicitud([baseRegional(c)]),contexto("50000"))
  const n=BigInt(c)>2000000n?2000000n:BigInt(c)
  expect(r.total).toEqual(racional(n.toString(),"500"))
  expect(r.evaluaciones[0].resultado).toMatchObject({baseEstatalAsignadaEuros:"0",aceptacionFiscal:"pendiente"})
 })
 for(const api of ["tecnica","efectiva"] as const){
  it(api+": oracle2000 sin estatal aplicada y pagos finales",()=>{
   const a=solicitud([inversion()]),vacio=solicitud([])
   if(api==="tecnica"){
    const b=Effect.runSync(liquidarIrpfAnual(tecnica(vacio),{modo:"canonico"})),r=Effect.runSync(liquidarIrpfAnual(tecnica(a),{modo:"canonico"}))
    expect(b.cuotaLiquidaCentimos-r.cuotaLiquidaCentimos).toBe(200000)
    expect(r.cuotaLiquidaCentimos-r.cuotaDiferencialCentimos).toBe(30000)
   }else{
    const b=Effect.runSync(liquidarIrpfAnualExplicito(efectiva(vacio))),r=Effect.runSync(liquidarIrpfAnualExplicito(efectiva(a)))
    expect(new Decimal(b.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal).toFixed()).toBe("2000")
    expect(new Decimal(r.cuotaLiquidaLegal).minus(r.cuotaDiferencial).toFixed()).toBe("100")
   }
  })
  for(const campo of ["pagador","entidad","fecha","censo","asignacion","fraccion50","fraccion100"] as const) it(api+": rechazo independiente "+campo,()=>{
   const s=inversion(),i=s.hechos.inversiones[1]
   if(campo==="pagador")i.pago.pagador="ajeno"
   if(campo==="entidad")i.entidad="t"
   if(campo==="fecha")i.pago.fecha="2026-01-01"
   if(campo==="censo")s.hechos.censoInversionesEstatales2025=" "
   if(campo==="asignacion")i.asignacion.sinDeduccionCentimos++
   if(campo==="fraccion50"||campo==="fraccion100")i.historialParticipacion[0].capitalPropio={numerador:1,denominador:campo==="fraccion50"?2:1}
   expect(fallo(solicitud([s]),api)._tag).toBe("ResultadoNoSoportado")
  })
  for(const positiva of [1,10000000])it(api+": estatal positiva conserva dependencia "+positiva,()=>{
   const s=inversion();s.hechos.inversiones[0].pago.importeCentimos=positiva;s.hechos.inversiones[0].asignacion={estatalCentimos:positiva,aragonCentimos:0,sinDeduccionCentimos:0}
   // Mantener el censo >=110000 para probar el contrato estatal, no un fallo previo de exceso.
   s.hechos.inversiones[1].pago.importeCentimos=11000000;s.hechos.inversiones[1].asignacion={estatalCentimos:0,aragonCentimos:1000000,sinDeduccionCentimos:10000000}
   expect(fallo(solicitud([s]),api)).toMatchObject({dependenciaAragon:{tipo:"ARAGON_68_1_ESTATAL_SIN_PRODUCTOR"}})
  })
  it(api+":38.2 mantiene error específico",()=>expect(fallo(solicitud([datos.reinversionCero]),api)).toMatchObject({dependenciaAragon:{tipo:"ARAGON_38_2_SIN_PRODUCTOR"}}))
  for(const cero of [false,true])it(api+": social sin importe; neto0="+cero,()=>{
   const s=social();if(cero){const x=s.hechos.viviendas[0].rendimientos[0];x.netoAntesReduccionesEuros="0";x.reduccionArt23_2Euros="0";x.netoReducidoEuros="0"}
   const e=fallo(solicitud([s]),api)
   expect(e).toMatchObject({dependenciaAragon:{tipo:"ARAGON_SOCIAL_SIN_PRODUCTORES_ANUALES",formula:{numerador:3,denominador:10},peticion:{casoAnual:"anual:2025:aragon:t",contribuyente:"t"}}})
   expect(JSON.stringify(e)).not.toMatch(/importeExacto|importePresentado|cuotaAtribuibleEuros/)
  })
  for(const inverso of [false,true]) for(const doc of [false,true])it(api+": mismo pago dos lotes; inverso="+inverso+" documento="+doc,()=>{
   const i=inversion(),pagoId=i.hechos.inversiones[1].pago.id
   const b=structuredClone(datos.a40.aragon_inversion_economia_social)
   if(doc)b.hechos.inversiones[0].pago.justificante=i.hechos.inversiones[1].pago.justificante
   else b.hechos.inversiones[0].pago.id=pagoId
   expect(fallo(solicitud(inverso?[b,i]:[i,b]),api)._tag).toBe("ResultadoNoSoportado")
  })
 }
 for(const orden of [false,true])it("cuota baja,80 decimales y orden="+orden,()=>{
  const d=structuredClone(datos.a40.aragon_donaciones_ecologicas_idi),i=baseRegional(3)
  const q="0."+"0".repeat(79)+"7"
  const r=aplicarDeduccionesTerritoriales2025(solicitud(orden?[d,i]:[i,d]),contexto(q))
  expect(r.total).toEqual(racional("7","1"+"0".repeat(80)))
  expect(r.disponible).toEqual(racional("0"))
 })
 for(const campo of ["baseGeneral","cuotaAutonomica","casoAnual","contribuyente","elecciones"])it("cierre anidado: "+campo,()=>{
  const s=inversion();expect(()=>solicitud([{...s,hechos:{...s.hechos,[campo]:"externo"}}])).toThrow()
 })
 it("estatal0 debe estar explícita",()=>{
  const s=inversion();const texto=JSON.stringify(s).replaceAll('"estatalCentimos":0,',"")
  expect(()=>solicitud([JSON.parse(texto)])).toThrow()
 })
})

for(const api of ["tecnica","efectiva"] as const){
 for(const fraccion of [{numerador:2,denominador:5},{numerador:1,denominador:3}])it(api+": fracción admisible se transporta íntegra "+fraccion.denominador,()=>{
  const s=inversion();for(const i of s.hechos.inversiones)for(const p of i.historialParticipacion){p.capitalPropio=fraccion;p.votoPropio=fraccion}
  const a=solicitud([s])
  if(api==="tecnica")expect(Effect.runSync(liquidarIrpfAnual(tecnica(a),{modo:"canonico"})).deduccionesAutonomicasCentimos).toBe(200000)
  else expect(Effect.runSync(liquidarIrpfAnualExplicito(efectiva(a)))).toMatchObject({deduccionesTerritoriales2025:{total:racional("2000")}})
 })
 for(const denominador of [1,2])it(api+": fundador emergente al50/100 conserva2000; denominador="+denominador,()=>{
  const s=inversion()
  const inversiones=s.hechos.inversiones.map(i=>({...i,calificacion:{tipo:"emergente-Ley28",certificacionInnovacionENISA:"enisa",registroMercantil:"registro",inscripcion:"2025-01-01",vigenteDesde:"2025-01-01",vigenteHasta:"2025-12-31",antiguedadArt3:"general-cinco",sector:"sector",fundadoresEscritura:["t"],escrituraFundacion:"fundacion"},historialParticipacion:i.historialParticipacion.map(p=>({...p,capitalPropio:{numerador:1,denominador},votoPropio:{numerador:1,denominador}}))}))
  const a=solicitud([{...s,hechos:{...s.hechos,inversiones}}])
  if(api==="tecnica")expect(Effect.runSync(liquidarIrpfAnual(tecnica(a),{modo:"canonico"})).deduccionesAutonomicasCentimos).toBe(200000)
  else expect(Effect.runSync(liquidarIrpfAnualExplicito(efectiva(a)))).toMatchObject({deduccionesTerritoriales2025:{total:racional("2000")}})
 })
 for(const orden of [false,true])it(api+": escritura/entidad compartida con pagos diferentes; orden="+orden,()=>{
  const i=inversion(),a=structuredClone(datos.a40.aragon_inversion_economia_social)
  a.hechos.inversiones[0].entidad=i.hechos.inversiones[1].entidad;a.hechos.inversiones[0].escritura=i.hechos.inversiones[1].escritura
  expect(fallo(solicitud(orden?[a,i]:[i,a]),api)).toMatchObject({motivo:expect.stringMatching(/MAB\/economía social/)})
 })
}
