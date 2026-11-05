import Decimal from "decimal.js"
import {Effect,Result,Schema} from "effect"
import {it,expect} from "vitest"
import fixture from "./fixtures/aragon-conexion-anual-20261105.json"
import oraculos from "./fixtures/inversion-681-oraculos-2025.json"
import {aplicarDeduccionesTerritoriales2025,SolicitudDeduccionesTerritoriales2025,type MagnitudesTerritorialesAnuales} from "../lib/dominio/irpf/deducciones/anual-territorial"
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type {CasoFiscalAnual} from "../lib/dominio/irpf/caso-fiscal-anual"
import type {CasoFiscalAnualExplicito} from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"

function positivo(){
 const s=structuredClone(fixture.inversion)
 for(const i of s.hechos.inversiones)i.certificadoEntidad.fechaEmision="2025-12-31"
 s.hechos.inversiones[0].asignacion={estatalCentimos:5000000,aragonCentimos:0,sinDeduccionCentimos:0}
 s.hechos.inversiones[1].asignacion={estatalCentimos:5000000,aragonCentimos:1000000,sinDeduccionCentimos:0}
 return {...s,hechos:{...s.hechos,estatal681:{exhaustividad:"cuentas-y-censo-sin-otros-bienes-ni-deudas",censo:"patrimonio-completo",contribuyente:"t",
  fechaInicio:"2025-01-01",fechaFin:"2025-12-31",origenFondos:"renta2025-sin-cuentas-ahorro-empresa",referenciaOrigenFondos:"extractos-renta2025",
  cuentasInicio:[{id:"cuenta",titular:"t",saldoCentimos:100000,referencia:"extracto-inicio"}],cuentasFin:[{id:"cuenta",titular:"t",saldoCentimos:100000,referencia:"extracto-fin"}],
  titularidades:s.hechos.inversiones.map(i=>({inversion:i.id,contribuyente:"t",entidad:i.entidad,escritura:i.escritura,fechaAdquisicion:i.fechaSuscripcion,certificado:i.certificadoEntidad.referencia,referencia:"certificado-individual-"+i.id}))}}}
}
const solicitud=(ss:readonly Schema.Json[])=>Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes:ss},{onExcessProperty:"error"})
function m(cuota="60000"):MagnitudesTerritorialesAnuales{return {caso:{anio:2025,comunidadAutonoma:"aragon",contribuyenteId:"t",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},baseGeneral:new Decimal(100000),baseAhorro:new Decimal(0),minimoPersonalFamiliar:new Decimal(5550),cuotaAutonomica:new Decimal(60000),cuotaEstatal681:new Decimal(cuota),sujetosConMinimo:[]}}
function tecnica(s:ReturnType<typeof solicitud>,bruto=100000000):CasoFiscalAnual{return {anio:2025,comunidadAutonoma:"aragon",contribuyenteId:"t",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:bruto}]},reducciones:[],deducciones:[],deduccionesTerritoriales2025:s,retencionesSoportadasCentimos:10000,pagosACuentaCentimos:20000}}
function explicita(s:ReturnType<typeof solicitud>,bruto="1000000"):CasoFiscalAnualExplicito{return {ejercicio:2025,comunidadAutonoma:"aragon",contribuyenteId:"t",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"empleo",clase:"empleo-laboral",integro:bruto,cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[{ejercicio:2025,operacionId:"retencion",procedencia:"certificado",importe:"100",efectiva:true}]}}
for(const o of oraculos)it("Fraction independiente "+JSON.stringify(o),()=>{
 const s=positivo(),[a,b]=s.hechos.inversiones
 a.pago.importeCentimos=0;a.asignacion={estatalCentimos:0,aragonCentimos:0,sinDeduccionCentimos:0}
 b.pago.importeCentimos=o.total;b.asignacion={estatalCentimos:o.base,aragonCentimos:o.regional,sinDeduccionCentimos:o.total-o.base-o.regional}
 const r=aplicarDeduccionesTerritoriales2025(solicitud([s]),m(o.cuota))
 expect(r.estatal681?.consumo.aplicaciones[0]).toEqual({generado:o.generado,aplicado:o.aplicado,pendiente:o.pendiente})
 expect(r.aplicaciones[0].generado).toEqual(o.regionalGenerado)
})
it("precision80 y Decimal global6 sin contaminación",()=>{
 const prev=Decimal.precision;Decimal.set({precision:6})
 try{const r=aplicarDeduccionesTerritoriales2025(solicitud([positivo()]),m("0."+"0".repeat(79)+"3"));expect(r.estatal681?.consumo.total).toEqual({numeradorEuros:"3",divisor:"1"+"0".repeat(80)});expect(r.total).toEqual({numeradorEuros:"2000",divisor:"1"});expect(Decimal.precision).toBe(6)}finally{Decimal.set({precision:prev})}
})
const mutaciones:readonly [string,(s:ReturnType<typeof positivo>)=>void][]=[
 ["pagador",s=>{s.hechos.inversiones[0].pago.pagador="ajeno"}],
 ["titular",s=>{s.hechos.estatal681.titularidades[0].contribuyente="ajeno"}],
 ["entidad",s=>{s.hechos.estatal681.titularidades[0].entidad="ajena"}],
 ["escritura",s=>{s.hechos.estatal681.titularidades[0].escritura="ajena"}],
 ["adquisicion",s=>{s.hechos.estatal681.titularidades[0].fechaAdquisicion="2025-02-01"}],
 ["certificado con fecha civil imposible",s=>{s.hechos.inversiones[0].certificadoEntidad.fechaEmision="2025-02-29"}],
 ["pago duplicado",s=>{s.hechos.inversiones[1].pago.id=s.hechos.inversiones[0].pago.id}],
 ["documento duplicado",s=>{s.hechos.inversiones[1].pago.justificante=s.hechos.inversiones[0].pago.justificante}],
 ["futuro",s=>{s.hechos.inversiones[0].constitucion="2026-01-01"}],
 ["fondos",s=>{s.hechos.inversiones[0].fondosPropiosInicioCentimos=40000001}],
 ["mercado",s=>{s.hechos.inversiones[0].historialEntidad[0].mercado="multilateral"}],
 ["historial",s=>{s.hechos.inversiones[0].historialEntidad[0].hasta="2025-11-30"}],
 ["patrimonio insuficiente",s=>{s.hechos.estatal681.cuentasFin[0].saldoCentimos=99999}],
 ["censo incompleto",s=>{s.hechos.estatal681.titularidades.pop()}],
 ["base excesiva",s=>{s.hechos.inversiones[1].asignacion.estatalCentimos+=1;s.hechos.inversiones[1].asignacion.aragonCentimos-=1}],
 ["asignacion",s=>{s.hechos.inversiones[0].asignacion.estatalCentimos+=1}],
]
for(const [nombre,mutar] of mutaciones){
 it("libro rechaza "+nombre,()=>{const s=positivo();mutar(s);expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),m())).toThrow()})
 for(const api of ["tecnica","explicita"]){it(api+" rechaza "+nombre,()=>{const s=positivo();mutar(s);const ss=solicitud([s]);const fallo=api==="tecnica"?Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnual(tecnica(ss),{modo:"canonico"})))):Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(explicita(ss)))));expect(fallo).toBe(true)})}
}
for(const api of ["tecnica","explicita"]){
 it(api+" positivo estatal50000 regional2000 consumo único y pagos",()=>{
  const ss=solicitud([positivo()]),vacio=solicitud([])
  if(api==="tecnica"){
   const b=Effect.runSync(liquidarIrpfAnual(tecnica(vacio),{modo:"canonico"})),r=Effect.runSync(liquidarIrpfAnual(tecnica(ss),{modo:"canonico"}))
   expect(b.cuotaLiquidaCentimos-r.cuotaLiquidaCentimos).toBe(5200000);expect(b.cuotaDiferencialCentimos-r.cuotaDiferencialCentimos).toBe(5200000);expect(r.retencionesYPagosACuentaCentimos).toBe(30000)
  }else{
   const b=Effect.runSync(liquidarIrpfAnualExplicito(explicita(vacio))),r=Effect.runSync(liquidarIrpfAnualExplicito(explicita(ss)))
   expect(new Decimal(b.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal).toFixed()).toBe("52000");expect(new Decimal(b.cuotaDiferencial).minus(r.cuotaDiferencial).toFixed()).toBe("52000")
  }
 })
 it(api+" cuota estatal insuficiente no altera regional",()=>{
  const ss=solicitud([positivo()])
  const r=api==="tecnica"?Effect.runSync(liquidarIrpfAnual(tecnica(ss,4000000),{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito(explicita(ss,"40000")))
  const libro=r.deduccionesTerritoriales2025
  expect(libro?.total).toEqual({numeradorEuros:"2000",divisor:"1"})
  const a=libro?.estatal681?.consumo.aplicaciones[0];expect(a).toBeDefined()
  expect(new Decimal(a!.pendiente.numeradorEuros).gt(0)).toBe(true)
 })
}
it("estatal0 conserva oráculo2000 sin exigir patrimonio nuevo",()=>{const r=aplicarDeduccionesTerritoriales2025(solicitud([fixture.inversion]),m());expect(r.estatal681).toBeUndefined();expect(r.total).toEqual({numeradorEuros:"2000",divisor:"1"})})
for(const codigo of ["aragon_inversion_acciones_mab","aragon_inversion_economia_social"] as const)it("misma operación excluye "+codigo,()=>{
 const s=positivo(),a=structuredClone(fixture.a40[codigo]);a.hechos.inversiones[0].entidad=s.hechos.inversiones[0].entidad;a.hechos.inversiones[0].escritura=s.hechos.inversiones[0].escritura
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([a,s]),m())).toThrow()
})
for(const s of [fixture.reinversionCero,fixture.social])it("mantiene rechazo38.2/social3/10 "+s.codigo,()=>expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),m())).toThrow())
it("otro territorio no se habilita",()=>{const mm=m();expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([positivo()]),{...mm,caso:{...mm.caso,comunidadAutonoma:"madrid"}})).toThrow()})
it("no admite magnitud fiscal libre",()=>{const s=positivo();expect(()=>solicitud([{...s,hechos:{...s.hechos,baseEstatalEuros:"100000"}}])).toThrow()})

for(const api of ["tecnica","explicita"])it(api+" conserva positivo con Decimal global6",()=>{
 const anterior=Decimal.precision;Decimal.set({precision:6})
 try{
  const ss=solicitud([positivo()])
  const r=api==="tecnica"?Effect.runSync(liquidarIrpfAnual(tecnica(ss),{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito(explicita(ss)))
  expect(r.deduccionesTerritoriales2025?.estatal681?.consumo.total).toEqual({numeradorEuros:"50000",divisor:"1"})
  expect(r.deduccionesTerritoriales2025?.total).toEqual({numeradorEuros:"2000",divisor:"1"})
  expect(Decimal.precision).toBe(6)
 }finally{Decimal.set({precision:anterior})}
})
