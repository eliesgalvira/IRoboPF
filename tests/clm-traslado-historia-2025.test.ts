import { producirNodosFiscalesB2025 } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/productores"
import { expect, it } from "vitest"
import { Effect, Schema, Result } from "effect"
import Decimal from "decimal.js"
import { HistoriaTrasladoCLM, producirBaseInicialTrasladoCLM } from "../lib/dominio/irpf/deducciones/clm-traslado-historia-2025"
import { SolicitudDeduccionesTerritoriales2025, aplicarDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales as M } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import casos from "./fixtures/clm-traslado-historia-fracciones.json"
const D=Decimal.clone({precision:200})
type S=typeof SolicitudDeduccionesTerritoriales2025.Type
type EntradaSolicitud = { solicitudes: readonly ReturnType<typeof entrada>[] }
function solicitud(x:EntradaSolicitud):S {const r=Schema.decodeUnknownResult(SolicitudDeduccionesTerritoriales2025)(x,{onExcessProperty:"error"});if(Result.isFailure(r))throw new Error(String(r.failure));return r.success}
function trabajo(ejercicio:number,integro="23000",ss="0") {return {ejercicio,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"empleo",clase:"empleo-laboral",integro,cotizaciones:{clase:"efectivas",seguridadSocial:ss,derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]}}
function historia(bruto="23000",ss="0",dia="2024-01-01") {return {
 contribuyente:"s-1",referencia:"expediente",ejercicio:2024,modalidad:"individual",primerEjercicioAplicacion:2024,residenteComunTodoEjercicio:true,vivoTodoEjercicio:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",censoRentasCompleto:true,
 trabajo:trabajo(2024,bruto,ss),certificados:[{rendimiento:"empleo",titular:"s-1",pagador:"empresa",referencia:"certificado2024",ejercicio:2024,integro:bruto,seguridadSocial:ss,derechosPasivos:"0",colegiosHuerfanos:"0"}],
 traslado:{persona:"s-1",fecha:dia,viviendaAnterior:"v0",viviendaNueva:"v1",municipio:"02001",categoria:"intensa",soporteClasificacion2024:"clasificacion2024",soporteClasificacion2025:"clasificacion2025",causa:"trabajo",soporteLaboral:"contrato",residenciaDesde:dia,residenciaHasta:"2025-12-31",soporteResidencia:"padron",sinInterrupciones:true,seguimiento:"pendiente-hasta-2027-12-31",gastos:[{id:"mudanza",pagador:"s-1",fecha:dia,importe:"80",soporte:"factura"}],otrosIncentivosMismoGasto:"ninguno"},
}}
function entrada(h=historia()){return {lote:"D51",codigo:"clm_traslado_vivienda_habitual",historiaTrasladoCLM:h,hechos:{fechaTraslado:h.traslado.fecha,categoria:h.traslado.categoria,causa:"trabajo",exhaustividad:"completa"}}}
function seleccion(h=historia()){return solicitud({solicitudes:[entrada(h)]})}
const marco=(cuota="1000"):M=>({caso:{anio:2025,comunidadAutonoma:"castilla-la-mancha",contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},baseGeneral:new D(28000),baseAhorro:new D(0),minimoPersonalFamiliar:new D(5550),cuotaAutonomica:new D(cuota),nodosFiscalesB2025: producirNodosFiscalesB2025("s-1", new D(28000), new D(cuota), new D(cuota), "solo-trabajo"), sujetosConMinimo:[],basesLiquidables:{general:new D(28000),ahorro:new D(0)},rentasTrabajoAnuales:{integroTrabajo:new D(30000),restoRentas:new D(0)}})
function igual(r:{numeradorEuros:string;divisor:string}|undefined,n:string,d="1"){if(r===undefined)throw new Error("Sin racional");expect(BigInt(r.numeradorEuros)*BigInt(d)).toBe(BigInt(n)*BigInt(r.divisor))}
for(const c of casos)it("Fraction independiente: "+c.bruto+" SS="+c.ss,()=>{
 const h=historia(c.bruto,c.ss),r=Schema.decodeUnknownResult(HistoriaTrasladoCLM)(h,{onExcessProperty:"error"});if(Result.isFailure(r))throw new Error(String(r.failure))
 expect(new D(producirBaseInicialTrasladoCLM(r.success,entrada(h).hechos,marco())).times(c.baseDivisor).toFixed()).toBe(c.baseNumerador)
 igual(aplicarDeduccionesTerritoriales2025(seleccion(h),marco()).total,c.generado)
})
for(const dia of ["2024-01-01","2024-02-29","2024-12-31"])it("frontera civil válida "+dia,()=>igual(aplicarDeduccionesTerritoriales2025(seleccion(historia("23000","0",dia)),marco()).total,"500"))
for(const dia of ["2023-12-31","2025-01-01","2024-02-30"])it("fecha/origen fuera "+dia,()=>expect(()=>aplicarDeduccionesTerritoriales2025(seleccion(historia("23000","0",dia)),marco())).toThrow())
it("cuota escasa exacta y consumo único",()=>{
 const r=aplicarDeduccionesTerritoriales2025(seleccion(),marco("20.079"));igual(r.total,"20079","1000");igual(r.disponible,"0")
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[entrada(),entrada()]}),marco())).toThrow(/duplicad/i)
})
it("identidad, certificado, residencia y solicitud contradictorias",()=>{
 for(const mutar of [(h:ReturnType<typeof historia>)=>{h.contribuyente="s-2"},(h:ReturnType<typeof historia>)=>{h.certificados[0].integro="1"},(h:ReturnType<typeof historia>)=>{h.traslado.residenciaDesde="2024-01-02"},(h:ReturnType<typeof historia>)=>{h.trabajo.ejercicio=2025},(h:ReturnType<typeof historia>)=>{h.traslado.gastos[0].pagador="s-2"}]){
  const h=historia();mutar(h);expect(()=>aplicarDeduccionesTerritoriales2025(seleccion(h),marco())).toThrow()
 }
 const e=entrada();e.hechos.fechaTraslado="2024-12-31";expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[e]}),marco())).toThrow(/contradice/)
})
it("base externa, conjunta, inicio2025, permanencia desconocida e incentivo ajeno no se inventan",()=>{
 for(const h of [{...historia(),baseLiquidable:"0"},{...historia(),modalidad:"conjunta"},{...historia(),primerEjercicioAplicacion:2025},{...historia(),traslado:{...historia().traslado,sinInterrupciones:false}},{...historia(),traslado:{...historia().traslado,otrosIncentivosMismoGasto:"si"}}])expect(()=>solicitud({solicitudes:[{...entrada(),historiaTrasladoCLM:h}]})).toThrow()
})

const territorio="castilla-la-mancha" as const
function clasico(s:S):CasoFiscalAnual{return {
 anio:2025,comunidadAutonoma:territorio,contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},
 rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0,deduccionesTerritoriales2025:s,
}}
function efectivo(s:S):CasoFiscalAnualExplicito{return {
 ejercicio:2025,comunidadAutonoma:territorio,contribuyenteId:"s-1",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},
 trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"r",clase:"empleo-laboral",integro:"30000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[],
}}

for(const api of ["clasica","efectiva"] as const){
 const ejecutar=(s:S)=>api==="clasica"?Effect.runSync(liquidarIrpfAnual(clasico(s),{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito(efectivo(s)))
 it(api+": traslado2024 con base2025 superior al umbral, única cuota interna",()=>{
  const r=ejecutar(seleccion()).deduccionesTerritoriales2025;if(r===undefined)throw new Error("Sin deducción")
  igual(r.total,"500");expect(r.aplicaciones).toHaveLength(1)
 })
 it(api+": origen en igualdad queda excluido aunque el cliente pida aplicar",()=>igual(ejecutar(seleccion(historia("24946"))).deduccionesTerritoriales2025?.total,"0"))
 it(api+": cuota cero interna no inventa500 ni consumo adicional",()=>{
  const s=seleccion(),a=clasico(s),b=efectivo(s)
  if(b.perfil!=="solo-trabajo")throw new Error("Fixture salarial requerido")
  const r=api==="clasica"?Effect.runSync(liquidarIrpfAnual({...a,rendimientos:{trabajo:[{importeIntegroCentimos:1000000}]}},{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito({...b,trabajo:{...b.trabajo,rendimientos:b.trabajo.rendimientos.map(x=>({...x,integro:"10000"}))}}))
  igual(r.deduccionesTerritoriales2025?.total,"0")
 })
 it(api+": identidad falsa no emite importe",()=>{
  const h=historia();h.contribuyente="s-2";const s=seleccion(h)
  const r=api==="clasica"?Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(s),{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(efectivo(s))))
  expect(r._tag).toBe("ResultadoNoSoportado");expect("importe" in r).toBe(false)
 })
}

it("gastos efectivos art19 y certificado nominal completo, sin duplicar2000",()=>{
 const h=historia("25000","1000");h.trabajo.rendimientos[0].sindicato={importe:"100",satisfecho:"si"}
 // RN=25000-1000-100-2000=21900, art20=0.
 const r=Schema.decodeUnknownResult(HistoriaTrasladoCLM)(h);if(Result.isFailure(r))throw new Error("Historia inválida")
 expect(producirBaseInicialTrasladoCLM(r.success,entrada(h).hechos,marco())).toBe("21900")
 h.certificados=[];expect(()=>aplicarDeduccionesTerritoriales2025(seleccion(h),marco())).toThrow(/certificados/)
})
it("categoría no elegible produce cero; mezcla económica no admite cuota atribuida",()=>{
 const h=historia();h.traslado.categoria="riesgo";igual(aplicarDeduccionesTerritoriales2025(seleccion(h),marco()).total,"0")
 expect(()=>aplicarDeduccionesTerritoriales2025(seleccion(),{...marco(),rentasTrabajoAnuales:{integroTrabajo:new D(30000),restoRentas:new D(1)}})).toThrow(/mixtas/)
})
