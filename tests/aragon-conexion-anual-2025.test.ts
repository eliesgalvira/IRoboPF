import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { describe, expect, it } from "vitest"
import datos from "./fixtures/aragon-conexion-anual-20261105.json"
import { aplicarDeduccionesTerritoriales2025, SolicitudDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { RechazoAragonAnual } from "../lib/dominio/irpf/deducciones/aragon-dos-anual-error"
import { SolicitudAragonDosAnual2025 } from "../lib/dominio/irpf/deducciones/aragon-dos-anual-esquemas"
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
describe("Aragón2 conectado a anual común sin duplicar fórmulas",()=>{
 it("ramo regional estatal0 conserva el censo110000 y genera2000",()=>{
  const s=solicitud([inversion()]);const r=aplicarDeduccionesTerritoriales2025(s,contexto())
  expect(r.total).toEqual(racional("2000"));expect(r.disponible).toEqual(racional("3000"))
  expect(r.evaluaciones[0].resultado).toMatchObject({baseEstatalAsignadaEuros:"0",baseAragonesaAsignadaEuros:"10000",excesoSobreMaximoEstatalEuros:"10000",casoAnual:"anual:2025:aragon:t"})
 })
 for(const cuota of ["0","0.003","1000.003","2000","5000"])it("consume sólo la cuota común "+cuota,()=>{
  const r=aplicarDeduccionesTerritoriales2025(solicitud([inversion()]),contexto(cuota))
  const esperado=cuota==="5000"?"2000":cuota
  expect(r.total).toEqual(racional(esperado));expect(r.aplicaciones[0].generado).toEqual(racional("2000"))
 })
 it("conserva80 decimales de cuota y su pendiente sin cambiar Decimal global",()=>{
  const precision=Decimal.precision
  const cuota="1999."+"9".repeat(79)+"7"
  const r=aplicarDeduccionesTerritoriales2025(solicitud([inversion()]),contexto(cuota))
  expect(r.total).toEqual(racional(cuota))
  expect(r.aplicaciones[0].pendiente).toEqual(racional("0."+"0".repeat(79)+"3"))
  expect(Decimal.precision).toBe(precision)
 })
 it("comparte cuota con A40 sin sumarla otra vez",()=>{
  const d=structuredClone(datos.a40.aragon_donaciones_ecologicas_idi)
  const r=aplicarDeduccionesTerritoriales2025(solicitud([inversion(),d]),contexto("1000.003"))
  expect(r.total).toEqual(racional("1000.003"));expect(r.aplicaciones[1].aplicado).toEqual(racional("0"));expect(r.aplicaciones[0].pendiente).toEqual(racional("999.997"))
 })
 it("orden inverso conserva una cuota y el exacto del límiteA40",()=>{
  const d=structuredClone(datos.a40.aragon_donaciones_ecologicas_idi)
  const r=aplicarDeduccionesTerritoriales2025(solicitud([d,inversion()]),contexto("1000.003"))
  expect(r.total).toEqual(racional("1000.003"));expect(r.aplicaciones[0].aplicado).toEqual(racional("100.0003"));expect(r.aplicaciones[1].aplicado).toEqual(racional("900.0027"))
 })
 it("no usa los céntimos presentados del evaluador como importe exacto",()=>{
  const s=inversion();s.hechos.inversiones[1].pago.importeCentimos=5000003;s.hechos.inversiones[1].asignacion.aragonCentimos=3
  const r=aplicarDeduccionesTerritoriales2025(solicitud([s]),contexto())
  expect(r.total).toEqual(racional("0.006"))
 })
 it("base estatal elegida positiva rechaza con dependencia tipada",()=>{
  const s=inversion();s.hechos.inversiones[0].asignacion.estatalCentimos=1;s.hechos.inversiones[0].asignacion.sinDeduccionCentimos-=1
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),contexto())).toThrow(RechazoAragonAnual)
 })
 it("reinversión con regional aislado0 no habilita omitir la exención38.2 en anual",()=>{
  try{aplicarDeduccionesTerritoriales2025(solicitud([datos.reinversionCero]),contexto());throw new Error("Faltó rechazo")}
  catch(e){expect(Schema.is(RechazoAragonAnual)(e)).toBe(true);if(Schema.is(RechazoAragonAnual)(e))expect(e.dependencia.tipo).toBe("ARAGON_38_2_SIN_PRODUCTOR")}
 })
 it("código duplicado no aplica dos veces",()=>expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([inversion(),inversion()]),contexto())).toThrow(/duplicado/))
 it("pagador ajeno rechaza",()=>{
  const s=inversion();s.hechos.inversiones[1].pago.pagador="otro"
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),contexto())).toThrow(/otro contribuyente/)
 })
 it("identidad anual ajena no se toma del hecho",()=>{
  const m={...contexto(),caso:{...contexto().caso,contribuyenteId:"otro"}}
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([inversion()]),m)).toThrow(/otro contribuyente/)
 })
 it("justificante repetido dentro del censo se rechaza aunque cambie el id",()=>{
  const s=inversion();s.hechos.inversiones[1].pago.justificante=s.hechos.inversiones[0].pago.justificante
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),contexto())).toThrow(/justificante.*repetido/)
 })
 for(const codigo of ["aragon_inversion_acciones_mab","aragon_inversion_economia_social"] as const){
  it("elecciónA40 de la misma escritura/inversión rechaza "+codigo,()=>{
   const s=inversion(),a=structuredClone(datos.a40[codigo]);a.hechos.inversiones[0].entidad=s.hechos.inversiones[1].entidad;a.hechos.inversiones[0].escritura=s.hechos.inversiones[1].escritura
   expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s,a]),contexto())).toThrow(/MAB\/economía social/)
  })
  it("A40 de otra entidad no es la misma inversión "+codigo,()=>{
   const a=structuredClone(datos.a40[codigo]);const r=aplicarDeduccionesTerritoriales2025(solicitud([inversion(),a]),contexto("50000"))
   expect(r.codigos.length).toBe(2);expect(r.aplicaciones[0].generado).toEqual(racional("2000"))
  })
 }
 it("mismo emisor y escritura distinta no se trata como incompatibilidad global por entidad",()=>{
  const s=inversion(),a=structuredClone(datos.a40.aragon_inversion_economia_social)
  a.hechos.inversiones[0].entidad=s.hechos.inversiones[1].entidad;a.hechos.inversiones[0].escritura="otra-escritura"
  expect(aplicarDeduccionesTerritoriales2025(solicitud([s,a]),contexto("50000")).codigos.length).toBe(2)
 })
 it("un pago compartido con A40 no se duplica con otro id de inversión",()=>{
  const s=inversion(),a=structuredClone(datos.a40.aragon_inversion_economia_social)
  a.hechos.inversiones[0].pago.id=s.hechos.inversiones[1].pago.id
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s,a]),contexto())).toThrow(/compartido|duplicado/)
 })
 for(const prueba of [
  {campo:"contribuyente",valor:"t"},{campo:"casoAnual",valor:"anual:externa"},{campo:"ejercicio",valor:2025},
  {campo:"territorio",valor:"aragon"},{campo:"modalidad",valor:"individual"},{campo:"devengo",valor:"2025-12-31"},
  {campo:"elecciones",valor:[]},{campo:"cuotaAutonomica",valor:"5000"},{campo:"importeExactoEuros",valor:"2000"},
 ])it("schema anual cerrado rechaza "+prueba.campo,()=>{
  expect(()=>solicitud([{...inversion(),[prueba.campo]:prueba.valor}])).toThrow()
 })
 it("no acepta un selector estatal externo en lugar de la asignación real",()=>expect(()=>solicitud([{...inversion(),hechos:{...inversion().hechos,cumple68_1:true}}])).toThrow())
 it("el discriminante de ambos contratos permanece único",()=>{
  const s=Schema.decodeUnknownSync(SolicitudAragonDosAnual2025)(inversion());expect(s.codigo).toBe("aragon_inversion_entidades_nuevas_reciente_creacion")
  expect(()=>Schema.decodeUnknownSync(SolicitudAragonDosAnual2025)({...social(),codigo:s.codigo})).toThrow()
 })
 it("social conserva petición3/10 y no inventa importe",()=>{
  const s=solicitud([social()])
  try{aplicarDeduccionesTerritoriales2025(s,contexto());throw new Error("Faltó rechazo")}
  catch(e){expect(Schema.is(RechazoAragonAnual)(e)).toBe(true);if(Schema.is(RechazoAragonAnual)(e)){expect(e.dependencia.tipo).toBe("ARAGON_SOCIAL_SIN_PRODUCTORES_ANUALES");if(e.dependencia.tipo==="ARAGON_SOCIAL_SIN_PRODUCTORES_ANUALES"){expect(e.dependencia.peticion.sumaNetoReducidoEuros).toBe("4000");expect(e.dependencia.formula.numerador).toBe(3);expect(e.dependencia.formula.denominador).toBe(10)}expect("importeExactoEuros" in e.dependencia).toBe(false)}}
 })
 it("neto social0 mantiene petición y ausencia de importe",()=>{
  const s=social();const renta=s.hechos.viviendas[0].rendimientos[0];renta.netoAntesReduccionesEuros="0";renta.reduccionArt23_2Euros="0";renta.netoReducidoEuros="0"
  try{aplicarDeduccionesTerritoriales2025(solicitud([s]),contexto());throw new Error("Faltó rechazo")}
  catch(e){expect(Schema.is(RechazoAragonAnual)(e)).toBe(true);if(Schema.is(RechazoAragonAnual)(e) && e.dependencia.tipo==="ARAGON_SOCIAL_SIN_PRODUCTORES_ANUALES"){expect(e.dependencia.peticion.sumaNetoReducidoEuros).toBe("0");expect("importeExactoEuros" in e.dependencia).toBe(false)}}
 })
 it("social de otro titular no alcanza la dependencia del núcleo",()=>{
  const s=social();s.hechos.viviendas[0].titular="otro"
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),contexto())).toThrow(/Titularidad/)
 })
 it("rechaza cuota social externa en el schema",()=>expect(()=>solicitud([{...social(),hechos:{...social().hechos,cuotaAtribuibleEuros:"1000"}}])).toThrow())
 it("API técnica aplica2000 una sola vez y conserva pagos anuales",()=>{
  const base=Effect.runSync(liquidarIrpfAnual(tecnica(solicitud([])),{modo:"canonico"}))
  const r=Effect.runSync(liquidarIrpfAnual(tecnica(solicitud([inversion()])),{modo:"canonico"}))
  expect(r.deduccionesAutonomicasCentimos).toBe(200000);expect(base.cuotaLiquidaCentimos-r.cuotaLiquidaCentimos).toBe(200000)
  expect(base.cuotaDiferencialCentimos-r.cuotaDiferencialCentimos).toBe(200000);expect(r.retencionesYPagosACuentaCentimos).toBe(30000)
 })
 it("API técnica no mezcla consignación agregada con hechos",()=>{
  const c={...tecnica(solicitud([inversion()])),deduccionAutonomicaAgregadaCentimos:1}
  const r=Effect.runSync(Effect.result(liquidarIrpfAnual(c,{modo:"canonico"})));expect(Result.isFailure(r)).toBe(true)
 })
 it("API efectiva aplica2000 una sola vez",()=>{
  const base=Effect.runSync(liquidarIrpfAnualExplicito(efectiva(solicitud([]))))
  const r=Effect.runSync(liquidarIrpfAnualExplicito(efectiva(solicitud([inversion()]))))
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("2000"))
  expect(new Decimal(base.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal).toFixed()).toBe("2000")
  expect(new Decimal(base.cuotaDiferencial).minus(r.cuotaDiferencial).toFixed()).toBe("2000")
 })
 for(const api of ["tecnica","efectiva"] as const){
  it(api+": no omite la estatal positiva elegida",()=>{
   const s=inversion();s.hechos.inversiones[0].asignacion.estatalCentimos=1;s.hechos.inversiones[0].asignacion.sinDeduccionCentimos-=1
   const solicitudAnual=solicitud([s]);const r=api==="tecnica"?Effect.runSync(Effect.result(liquidarIrpfAnual(tecnica(solicitudAnual),{modo:"canonico"}))):Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(efectiva(solicitudAnual))))
   expect(r._tag).toBe("Failure");if(r._tag==="Failure")expect(r.failure).toMatchObject({_tag:"ResultadoNoSoportado",dependenciaAragon:{tipo:"ARAGON_68_1_ESTATAL_SIN_PRODUCTOR",baseEstatalElegidaEuros:"0.01"}})
  })
  it(api+": no omite reinversión aunque el aislado genere0",()=>{
   const s=solicitud([datos.reinversionCero]);const r=api==="tecnica"?Effect.runSync(Effect.result(liquidarIrpfAnual(tecnica(s),{modo:"canonico"}))):Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(efectiva(s))))
   expect(r._tag).toBe("Failure");if(r._tag==="Failure")expect(r.failure).toMatchObject({_tag:"ResultadoNoSoportado",dependenciaAragon:{tipo:"ARAGON_38_2_SIN_PRODUCTOR"}})
  })
  it(api+": identidad del pago se concilia con la anual",()=>{
   const i=inversion();i.hechos.inversiones[0].pago.pagador="otro"
   const s=solicitud([i]);const r=api==="tecnica"?Effect.runSync(Effect.result(liquidarIrpfAnual(tecnica(s),{modo:"canonico"}))):Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(efectiva(s))))
   expect(r._tag).toBe("Failure");if(r._tag==="Failure")expect(r.failure).toMatchObject({_tag:"ResultadoNoSoportado",motivo:expect.stringMatching(/otro contribuyente/)})
  })
  it(api+": elecciónA40 previa no permite duplicar la misma operación",()=>{
   const i=inversion(),a=structuredClone(datos.a40.aragon_inversion_economia_social)
   a.hechos.inversiones[0].entidad=i.hechos.inversiones[1].entidad;a.hechos.inversiones[0].escritura=i.hechos.inversiones[1].escritura
   const s=solicitud([a,i]);const r=api==="tecnica"?Effect.runSync(Effect.result(liquidarIrpfAnual(tecnica(s),{modo:"canonico"}))):Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(efectiva(s))))
   expect(r._tag).toBe("Failure");if(r._tag==="Failure")expect(r.failure).toMatchObject({_tag:"ResultadoNoSoportado",motivo:expect.stringMatching(/MAB\/economía social/)})
  })
  it(api+": conserva dependencia social3/10 en el error público",()=>{
   const s=solicitud([social()]);const r=api==="tecnica"?Effect.runSync(Effect.result(liquidarIrpfAnual(tecnica(s),{modo:"canonico"}))):Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(efectiva(s))))
   expect(r._tag).toBe("Failure");if(r._tag==="Failure")expect(r.failure).toMatchObject({_tag:"ResultadoNoSoportado",dependenciaAragon:{tipo:"ARAGON_SOCIAL_SIN_PRODUCTORES_ANUALES",formula:{numerador:3,denominador:10},peticion:{contribuyente:"t",casoAnual:"anual:2025:aragon:t"}}})
  })
 }
})
