import { DeduccionTrabajo } from "../../lib/dominio/irpf/trabajo-anual/contrato"
import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Schema, Result } from "effect"
import { aplicarDeduccionesTerritoriales2025, SolicitudDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales as M } from "../../lib/dominio/irpf/deducciones/anual-territorial"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito, type CasoFiscalAnual } from "../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { DerechosMinimosAnuales } from "../../lib/dominio/irpf/minimos/derechos-contrato"


type S=typeof SolicitudDeduccionesTerritoriales2025.Type
const D=Decimal.clone({precision:200})
function solicitud(datos:Schema.Json):S {const r=Schema.decodeUnknownResult(SolicitudDeduccionesTerritoriales2025)(datos,{onExcessProperty:"error"});if(Result.isFailure(r))throw new Error(String(r.failure));return r.success}
const pago=(importe="1000",id="p",pagador="s-1",fecha="2025-06-01")=>({id,importe,pagador,fecha})
const m=(territorio:M["caso"]["comunidadAutonoma"]="castilla-la-mancha",cuota="1000",base="10000"):M=>({
 caso:{anio:2025,comunidadAutonoma:territorio,contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},
 baseGeneral:new D(base),baseAhorro:new D(0),minimoPersonalFamiliar:new D(5550),cuotaAutonomica:new D(cuota),sujetosConMinimo:[],
 basesLiquidables:{general:new D(base),ahorro:new D(0)},componentesMinimoEstatal:{contribuyente:new D(5550),descendientes:new D(0)},
 rentasTrabajoAnuales:{integroTrabajo:new D(30000),restoRentas:new D(0)},
})
const donIdi=solicitud({solicitudes:[{lote:"D51",codigo:"clm_donaciones_idi_innovacion_empresarial",hechos:{pagos:[pago("10000")],destinatario:"jccm",exhaustividad:"completa"}}]})
function igual(r:{numeradorEuros:string;divisor:string},n:bigint,d=1n){expect(BigInt(r.numeradorEuros)*d).toBe(n*BigInt(r.divisor))}

const territorio="castilla-la-mancha" as const
function clasico(s:S,derechos?:DerechosMinimosAnuales):CasoFiscalAnual{return {
 anio:2025,comunidadAutonoma:territorio,contribuyenteId:"s-1",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},derechosMinimos:derechos,
 rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0,deduccionesTerritoriales2025:s,
}}
function efectivo(s:S,derechos?:DerechosMinimosAnuales):CasoFiscalAnualExplicito{return {
 ejercicio:2025,comunidadAutonoma:territorio,contribuyenteId:"s-1",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:derechos===undefined?"ninguno":"segun-derechos",derechosMinimos:derechos,discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},
 trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"r",clase:"empleo-laboral",integro:"30000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[],
}}

const vacia=solicitud({solicitudes:[]})
function derechos(api:"clasica"|"efectiva"):DerechosMinimosAnuales {
 const neto=api==="clasica"?Effect.runSync(liquidarIrpfAnual(clasico(vacia),{modo:"canonico"})).rendimientoNetoTrabajoCentimos:2800000
 return {ejercicio:2025,territorio,regimen:"comun",modalidad:"individual",devengo:"2025-12-31",contribuyenteId:"s-1",edadContribuyenteDevengo:40,discapacidadContribuyente:{_tag:"SinDiscapacidad"},ascendientes:"ninguno",fallecimientosEnElEjercicio:"ninguno",descendientesCompletos:true,conciliacionRentasContribuyente:{perfil:"caso-anual-parcial",otrasRentasOGastosNoRepresentados:"ninguno"},descendientes:[{sujetoId:"s-2",fechaNacimiento:"2015-01-01",edadDevengo:10,vivoAlDevengo:true,rentasNoExentasCentimos:0,declaracion:{modalidad:"no-presenta"},discapacidad:{_tag:"SinDiscapacidad"},titularesCompletos:true,titulares:[{titularId:"s-1",grado:1,vinculo:{clase:"consanguinidad"},relacion:"convivencia",custodia:"no-procede",alimentosJudiciales:false,aplicaEspecialidadAlimentos:false,residenteIrpf:true,rentasNoExentasCentimos:neto}]}]}
}
function guarderia(id="s-2",nacimiento="2015-01-01",titulares=["s-1"]) {return solicitud({solicitudes:[{lote:"D51",codigo:"clm_gastos_guarderia",hechos:{hijos:[{id,nacimiento,titularesMinimo:titulares,mesesCompletos:12,pagos:[pago("1000")],becas:"0",gastoExentoEspecie:"0"}],exhaustividad:"completa"}}]})}
function discapacidad(){return solicitud({solicitudes:[{lote:"D51",codigo:"clm_discapacidad_ascendientes_descendientes",hechos:{personas:[{id:"s-2",vinculo:"descendiente",grado:65,titularesMinimo:["s-1"],eleccion:"discapacidad_familiar"}],exhaustividad:"completa"}}]})}
for(const api of ["clasica","efectiva"] as const){
 const ejecutar=(s:S)=>api==="clasica"?Effect.runSync(liquidarIrpfAnual(clasico(s,derechos(api)),{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito(efectivo(s,derechos(api))))
 it(api+": control hijo real de diez años produce cero guardería",()=>{igual(ejecutar(guarderia()).deduccionesTerritoriales2025!.total,0n)})
 it(api+": rechazo: no rejuvenecer hijo censado para guardería",()=>{expect(()=>ejecutar(guarderia("s-2","2023-01-01"))).toThrow()})
 it(api+": rechazo: no crear hijo inexistente para guardería",()=>{expect(()=>ejecutar(guarderia("fantasma","2023-01-01"))).toThrow()})
 it(api+": rechazo: no inventar discapacidad65 del hijo sin discapacidad",()=>{expect(()=>ejecutar(discapacidad())).toThrow()})
 it(api+": pagos con nueve decimales siguen rechazados",()=>{const s=solicitud({solicitudes:[{lote:"D51",codigo:"clm_donaciones_idi_innovacion_empresarial",hechos:{pagos:[pago("1.000000001")],destinatario:"jccm",exhaustividad:"completa"}}]});expect(()=>ejecutar(s)).toThrow()})
}
it("interno: rechazo: no crear hijo sin censo ni mínimo",()=>{expect(()=>aplicarDeduccionesTerritoriales2025(guarderia("fantasma","2023-01-01"),m())).toThrow()})
it("interno: rechazo: no afirmar mínimo exclusivo con hijo anual compartido",()=>{const d=derechos("efectiva");const p=d.descendientes[0];const marco={...m(),caso:{...m().caso,derechosMinimos:{...d,descendientes:[{...p,titulares:[...p.titulares,{...p.titulares[0],titularId:"s-3"}]}]}},sujetosConMinimo:["s-2"],atribucionesMinimo:[{sujetoId:"s-2",titulares:["s-1","s-3"]}]};expect(()=>aplicarDeduccionesTerritoriales2025(guarderia("s-2","2023-01-01"),marco)).toThrow()})
it("interno: BL diminuta limita donación aunque BIG sea alta y sin céntimos",()=>{const sol=solicitud({solicitudes:[{lote:"D51",codigo:"clm_donaciones_cooperacion_lucha_pobreza_discapacidad",hechos:{pagos:[pago("1000")],tipoEntidad:"fundacion",fin:"pobreza",exhaustividad:"completa"}}]});igual(aplicarDeduccionesTerritoriales2025(sol,{...m(),basesLiquidables:{general:new D("0.079"),ahorro:new D(0)}}).total,1185n,1000000n)})
it("interno: fiscal externo anidado y cuota injertada se rechazan",()=>{expect(()=>solicitud({solicitudes:[{lote:"D51",codigo:"clm_gastos_guarderia",hechos:{hijos:[{id:"s-2",nacimiento:"2023-01-01",titularesMinimo:["s-1"],mesesCompletos:12,pagos:[{...pago(),cuotaAutonomica:"10000"}],becas:"0",gastoExentoEspecie:"0"}],exhaustividad:"completa"}}]})).toThrow()})

it("DA61: los cinco campos calculados admiten80 y rechazan81, los hechos conservan2",()=>{
 const q="1."+"0".repeat(79)+"1"
 const c={regla:"da61",ambito:"comun-individual",ejercicio:2025,brutoServicios:"17000",otrasRentasNoExentas:"0",netoReducidoServicios:"15000",baseLiquidableGeneral:"15000",cuotaIntegraGeneral:"1000",cuotaLiquidaTotal:"1000",cuotaTrasArt80:"1000",etapa:"despues-art80-sin-deduccion-trabajo",calificacion:"laboral-estatutaria-acreditada"}
 for(const key of ["netoReducidoServicios","baseLiquidableGeneral","cuotaIntegraGeneral","cuotaLiquidaTotal","cuotaTrasArt80"]){expect(Result.isSuccess(Schema.decodeUnknownResult(DeduccionTrabajo)({...c,[key]:q}))).toBe(true);expect(Result.isFailure(Schema.decodeUnknownResult(DeduccionTrabajo)({...c,[key]:q+"1"}))).toBe(true)}
 for(const key of ["brutoServicios","otrasRentasNoExentas"]){expect(Result.isFailure(Schema.decodeUnknownResult(DeduccionTrabajo)({...c,[key]:"1.001"}))).toBe(true)}
})

import ausentes from "./ausentes.json"
for(const fila of ausentes)it("productor ausente concreto: "+fila.solicitud.codigo,()=>{
 const sol=solicitud({solicitudes:[fila.solicitud]})
 const terr=fila.solicitud.codigo.startsWith("clm_")?"castilla-la-mancha":fila.solicitud.codigo.startsWith("cyl_")?"castilla-y-leon":"extremadura"
 const mm=m(terr)
 const d=derechos("efectiva"),p=d.descendientes[0]
 const marco:M={...mm,caso:{...mm.caso,situacionFamiliar:{...mm.caso.situacionFamiliar,edad:36},derechosMinimos:{...d,descendientes:[{...p,fechaNacimiento:"2022-01-01",edadDevengo:3,discapacidad:{_tag:"Discapacidad65OMas"},titulares:[...p.titulares,{...p.titulares[0],titularId:"s-3"}]}]}},sujetosConMinimo:["s-2"],atribucionesMinimo:[{sujetoId:"s-2",titulares:["s-1"]}]}
 expect(()=>aplicarDeduccionesTerritoriales2025(sol,marco)).toThrow(new RegExp(fila.motivo))
})
import {calcularDeduccionTrabajo as actual} from "../../lib/dominio/irpf/trabajo-anual/calcular"
it("DA61: conserva los importes de los umbrales monetarios 2025",()=>{
 const tabla = [
  ["0", "0", "0", "3000"],
  ["16575.99", "340", "2250", "2660"],
  ["16576", "340", "2250", "2660"],
  ["16576.01", "339.998", "2250", "2660.002"],
  ["18275.99", "0.002", "2250", "2999.998"],
  ["18276", "0", "2250", "3000"],
  ["18276.01", "0", "2250", "3000"],
  ["30000", "0", "2250", "3000"],
 ] as const
 for(const [bruto, legal, limite, posterior] of tabla){
 const c={regla:"da61" as const,ambito:"comun-individual" as const,ejercicio:2025 as const,brutoServicios:bruto,otrasRentasNoExentas:"0",netoReducidoServicios:new D(bruto).gt(15000)?"15000":bruto,baseLiquidableGeneral:"20000",cuotaIntegraGeneral:"3000",cuotaLiquidaTotal:"3000",cuotaTrasArt80:"3000",etapa:"despues-art80-sin-deduccion-trabajo" as const,calificacion:"laboral-estatutaria-acreditada" as const}
 expect(actual(c)).toMatchObject({estado:"calculado",deduccionLegal:legal,limiteAtribuible:limite,importeAplicable:legal,cuotaPosterior:posterior})
 }
})

it("DA61: oráculo monetario independiente en tramo y frontera de otras rentas",()=>{
 const c={regla:"da61" as const,ambito:"comun-individual" as const,ejercicio:2025 as const,brutoServicios:"17000",otrasRentasNoExentas:"6500",netoReducidoServicios:"15000",baseLiquidableGeneral:"20000",cuotaIntegraGeneral:"3000",cuotaLiquidaTotal:"3000",cuotaTrasArt80:"3000",etapa:"despues-art80-sin-deduccion-trabajo" as const,calificacion:"laboral-estatutaria-acreditada" as const}
 const r=actual(c);expect(r.estado).toBe("calculado");if(r.estado!=="calculado")throw new Error("No calculado")
 expect(r.importeAplicable).toBe("255.2");expect(r.cuotaPosterior).toBe("2744.8");expect(actual({...c,otrasRentasNoExentas:"6500.01"})).toMatchObject({estado:"calculado",deduccionLegal:"0",limiteAtribuible:"2250",importeAplicable:"0",cuotaPosterior:"3000"})
})
it("interno: marco de81 cifras no se redondea hacia frontera",()=>{expect(()=>aplicarDeduccionesTerritoriales2025(donIdi,m(undefined,"1000","1."+"0".repeat(79)+"1"))).toThrow(/80/);igual(aplicarDeduccionesTerritoriales2025(donIdi,m(undefined,"1000","1."+"0".repeat(78)+"1")).total,100n)})
for(const [codigo,clave] of [["extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler","ayudaReconocida"],["extremadura_vivienda_zonas_rurales","ayudasJunta"]] as const)it("reserva H2/H3 con ayuda positiva: "+codigo,()=>{const fila=ausentes.find(f=>f.solicitud.codigo===codigo);if(fila===undefined)throw new Error("Fixture ausente");expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[{...fila.solicitud,hechos:{...fila.solicitud.hechos,[clave]:"0.01"}}]}),m("extremadura"))).toThrow(/H[23].*ayuda/i)})
