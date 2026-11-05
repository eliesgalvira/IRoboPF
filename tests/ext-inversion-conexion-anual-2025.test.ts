import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { it, expect } from "vitest"
import datos from "./fixtures/ext-inversion-2025.json"
import oraculos from "./fixtures/ext-inversion-oraculos-2025.json"
import { aplicarDeduccionesTerritoriales2025, SolicitudDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { HechosInversionExt2025 } from "../lib/dominio/irpf/deducciones/extremadura-inversion-contrato-2025"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"

const caso=()=>structuredClone(datos)
const solicitud=(s:readonly Schema.Json[])=>Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes:s},{onExcessProperty:"error"})
function marco(qe="60000",qa="60000"):MagnitudesTerritorialesAnuales {
 return {caso:{anio:2025,comunidadAutonoma:"extremadura",contribuyenteId:"t",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},baseGeneral:new Decimal(1000000),baseAhorro:new Decimal(0),minimoPersonalFamiliar:new Decimal(5550),cuotaAutonomica:new Decimal(qa),cuotaEstatal681:new Decimal(qe),sujetosConMinimo:[]}
}
function particion(p:number,s:number,e:number){
 const c=caso(),h=c.hechos,i=h.inversion
 i.pago.importeCentimos=p;i.eleccion={estatalCentimos:s,extremaduraCentimos:e}
 // Una sola clase; capital SL suficiente incluso en oráculos con desembolso de un céntimo.
 const capital=Math.max(100,p*10),t=i.historialParticipacionTercero[0]
 t.capitalPropio={numerador:p,denominador:capital};t.votoPropio={numerador:p,denominador:capital}
 t.familiares[0].capitalDirectoIndirecto={numerador:p,denominador:capital};t.familiares[0].votoDirectoIndirecto={numerador:p,denominador:capital}
 h.escrituraPublica.capitalSocialCentimos=capital;h.escrituraPublica.inversores[0].importeCentimos=p
 h.escrituraPublica.inversores[1].importeCentimos=p;h.escrituraPublica.inversores[2].importeCentimos=capital-2*p
 return c
}
for(const o of oraculos)it("EXT oráculo Fraction externo "+[o.p,o.s,o.e,o.cuotaEstatal,o.cuotaExt].join(":"),()=>{
 const r=aplicarDeduccionesTerritoriales2025(solicitud([particion(o.p,o.s,o.e)]),marco(o.cuotaEstatal,o.cuotaExt))
 expect(r.estatal681?.consumo.aplicaciones[0]).toEqual(o.estatal)
 expect(r.aplicaciones[0]).toEqual(o.regional)
 expect(r.estatal681?.generacion.inversiones).toEqual(["ext-i1"])
 expect(r.evaluaciones[0].resultado).toMatchObject({aceptacionFiscal:"pendiente"})
})
it("cuota escasa no devuelve base estatal a EXT y el consumo es único",()=>{
 const r=aplicarDeduccionesTerritoriales2025(solicitud([caso()]),marco("1234.56","987.65"))
 expect(r.estatal681?.generacion.baseEuros).toBe("10000")
 expect(r.aplicaciones[0].generado).toEqual({numeradorEuros:"4000",divisor:"1"})
 expect(r.estatal681?.consumo.total).toEqual({numeradorEuros:"30864",divisor:"25"})
 expect(r.total).toEqual({numeradorEuros:"19753",divisor:"20"})
})
for(const ano of [2026,2027,2030])it("certificado ejercicio2025 emitido en"+ano+" conserva arreglo común",()=>{
 const s=caso();s.hechos.inversion.certificadoEntidad.fechaEmision=ano+"-01-15"
 expect(aplicarDeduccionesTerritoriales2025(solicitud([s]),marco()).estatal681?.generacion.baseEuros).toBe("10000")
})
it("80decimales en ambas cuotas sin contaminar Decimal global",()=>{
 const prev=Decimal.precision;Decimal.set({precision:6})
 try{const qe="0."+"0".repeat(79)+"3",qa="0."+"0".repeat(79)+"7"
 const r=aplicarDeduccionesTerritoriales2025(solicitud([caso()]),marco(qe,qa))
 expect(r.estatal681?.consumo.total).toEqual({numeradorEuros:"3",divisor:"1"+"0".repeat(80)})
 expect(r.total).toEqual({numeradorEuros:"7",divisor:"1"+"0".repeat(80)});expect(Decimal.precision).toBe(6)
 }finally{Decimal.set({precision:prev})}
})
const adversos:readonly [string,(s:ReturnType<typeof caso>)=>void][]=[
 ["S+E",s=>{s.hechos.inversion.eleccion.estatalCentimos++}],
 ["máximo estatal",s=>{s.hechos.inversion.eleccion.estatalCentimos=10000001}],
 ["perfil E",s=>{s.hechos.inversion.eleccion.extremaduraCentimos=2000001}],
 ["pagador",s=>{s.hechos.inversion.pago.pagador="ajeno"}],
 ["efectivo",s=>{s.hechos.inversion.pago.medio="efectivo"}],
 ["ampliación",s=>{s.hechos.inversion.operacion="ampliacion"}],
 ["domicilio",s=>{s.hechos.inversion.domicilioFiscal="aragon"}],
 ["fecha civil",s=>{s.hechos.inversion.certificadoEntidad.fechaEmision="2025-02-29"}],
 ["certificado anterior",s=>{s.hechos.inversion.certificadoEntidad.fechaEmision="2024-12-31"}],
 ["ejecutivo",s=>{s.hechos.inversion.vinculacion[0].rol="ejecutivo"}],
 ["escritura ajena",s=>{s.hechos.escrituraPublica.entidad="ajena"}],
 ["importe notarial",s=>{s.hechos.escrituraPublica.inversores[0].importeCentimos++}],
 ["inscripción futura",s=>{s.hechos.inscripcion.fecha="2026-01-01"}],
 ["inscripción forma",s=>{s.hechos.inscripcion.forma="SA"}],
 ["jornada parcial",s=>{s.hechos.empleo.jornadaMinutosSemanales--}],
 ["altaSS tardía",s=>{s.hechos.empleo.fechaAltaSS="2025-02-01"}],
 ["empleador ajeno",s=>{s.hechos.empleo.empleador="ajeno"}],
 ["empleo futuro fingido",s=>{s.hechos.empleo.finObservado="2027-01-01"}],
 ["medios no conciliados",s=>{s.hechos.inversion.historialEntidad[0].mediosPersonales.referencia="ajena"}],
 ["contabilidad sin cubrir",s=>{s.hechos.actividad.contabilidad[0].hasta="2025-12-30"}],
 ["balance no suma",s=>{s.hechos.actividad.contabilidad[0].totalActivoCentimos++}],
 ["afectación incierta",s=>{s.hechos.actividad.contabilidad[0].activos[0].clase="otro-no-afecto-conservador"}],
 ["actividad sin facturas",s=>{s.hechos.actividad.facturasClientes=[]}],
 ["censo3 incompleto",s=>{s.hechos.inversion.historialParticipacionTercero=[]}],
 ["participación distinta de escritura",s=>{s.hechos.inversion.historialParticipacionTercero[0].capitalPropio.numerador++}],
 ["voto propio contradictorio",s=>{s.hechos.inversion.historialParticipacionTercero[0].votoPropio.numerador++}],
 ["familia repetida",s=>{const t=s.hechos.inversion.historialParticipacionTercero[0];t.familiares.push(t.familiares[0])}],
 ["patrimonio ajeno",s=>{s.hechos.estatal681.contribuyente="ajeno"}],
 ["patrimonio insuficiente",s=>{s.hechos.estatal681.cuentasFin[0].saldoCentimos--}],
 ["censo estatal ajeno",s=>{s.hechos.estatal681.censo="ajeno"}],
 ["inversión estatal ajena",s=>{s.hechos.estatal681.titularidades[0].inversion="ajena"}],
 ["certificado estatal ajeno",s=>{s.hechos.estatal681.titularidades[0].certificado="ajeno"}],
]
for(const [nombre,mutar] of adversos)it("rechazo concreto sin cero: "+nombre,()=>{
 const s=caso();mutar(s);expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),marco())).toThrow()
})
it("tercer grado justo40% frente40%+un céntimo de capital; segundo grado no lo absorbe",()=>{
 expect(aplicarDeduccionesTerritoriales2025(solicitud([caso()]),marco()).total).toEqual({numeradorEuros:"4000",divisor:"1"})
 const s=caso(),h=s.hechos,t=h.inversion.historialParticipacionTercero[0]
 h.escrituraPublica.inversores[1].importeCentimos++;h.escrituraPublica.inversores[2].importeCentimos--
 t.familiares[0].capitalDirectoIndirecto={numerador:1000001,denominador:10000000}
 t.familiares[0].votoDirectoIndirecto={numerador:1000001,denominador:10000000}
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),marco())).toThrow(/40%/)
})
it("80% voto aunque capital30% no pasa ni como redondeo",()=>{
 const s=caso();s.hechos.inversion.historialParticipacionTercero[0].votoPropio={numerador:4,denominador:5}
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),marco())).toThrow()
})
for(const campo of ["baseEstatalMismaInversion","importeExactoEuros","cuotaAutonomica","plantillaMedia","historialParticipacion"])it("frontera cerrada sin magnitud externa "+campo,()=>{
 const h=caso().hechos
 expect(()=>Schema.decodeUnknownSync(HechosInversionExt2025)({...h,[campo]:"0"},{onExcessProperty:"error"})).toThrow()
})
it("documentos incompletos y autenticidad inventada no sustituyen hechos",()=>{
 const h=caso().hechos
 expect(()=>Schema.decodeUnknownSync(HechosInversionExt2025)({...h,documentos:"autenticados"},{onExcessProperty:"error"})).toThrow()
 expect(()=>Schema.decodeUnknownSync(HechosInversionExt2025)({...h,empleo:{referencia:"cumple"}},{onExcessProperty:"error"})).toThrow()
})
it("código/productor repetido y combinación no representada rechazan",()=>{
 const s=caso();expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s,s]),marco())).toThrow(/exclusivo/)
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s,{lote:"D51",codigo:"extremadura_inversion_acciones_participaciones_mercantiles",hechos:{pagos:[],participacionFamiliarMaxima:"0",domicilioSocial:"extremadura",domicilioFiscal:"extremadura",direccionEjecutiva:"no",fechaEscritura:"2025-01-01",exhaustividad:"completa"}}]),marco())).toThrow(/exclusivo/)
})

function tecnica(ss:ReturnType<typeof solicitud>):CasoFiscalAnual{return {anio:2025,comunidadAutonoma:"extremadura",contribuyenteId:"t",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:100000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:10000,pagosACuentaCentimos:20000,deduccionesTerritoriales2025:ss}}
function explicita(ss:ReturnType<typeof solicitud>):CasoFiscalAnualExplicito{return {ejercicio:2025,comunidadAutonoma:"extremadura",contribuyenteId:"t",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:ss,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"empleo",clase:"empleo-laboral",integro:"1000000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[{ejercicio:2025,operacionId:"retencion",procedencia:"certificado",importe:"100",efectiva:true}]}}
for(const api of ["tecnica","explicita"] as const){
 const ejecutar=(s:ReturnType<typeof solicitud>)=>api==="tecnica"?Effect.runSync(liquidarIrpfAnual(tecnica(s),{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito(explicita(s)))
 it(api+": ambos libros y resta única en composición",()=>{
  const base=ejecutar(solicitud([])),r=ejecutar(solicitud([caso()]))
  expect(r.deduccionesTerritoriales2025?.estatal681?.generacion.baseEuros).toBe("10000")
  expect(r.deduccionesTerritoriales2025?.estatal681?.consumo.total).toEqual({numeradorEuros:"5000",divisor:"1"})
  expect(r.deduccionesTerritoriales2025?.total).toEqual({numeradorEuros:"4000",divisor:"1"})
  if("cuotaLiquidaCentimos" in base && "cuotaLiquidaCentimos" in r){
   expect(base.cuotaLiquidaCentimos-r.cuotaLiquidaCentimos).toBe(900000)
   expect(base.cuotaDiferencialCentimos-r.cuotaDiferencialCentimos).toBe(900000)
   expect(r.retencionesYPagosACuentaCentimos).toBe(base.retencionesYPagosACuentaCentimos)
  }else if("cuotaLiquidaLegal" in base && "cuotaLiquidaLegal" in r){
   expect(new Decimal(base.cuotaLiquidaLegal).minus(r.cuotaLiquidaLegal).toFixed()).toBe("9000")
   expect(new Decimal(base.cuotaDiferencial).minus(r.cuotaDiferencial).toFixed()).toBe("9000")
  }else throw new Error("Ambas ejecuciones deben devolver el mismo contrato de API")
 })
 for(const [nombre,mutar] of adversos)it(api+": rechazo sin resultado monetario "+nombre,()=>{
  const s=caso();mutar(s)
  const ss=solicitud([s])
  const fallo=api==="tecnica"?Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnual(tecnica(ss),{modo:"canonico"})))):Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(explicita(ss)))))
  expect(fallo).toBe(true)
 })
}

it("estatal0 exige hechos, sin asumir cero por ausencia",()=>{
 const h=particion(100,0,100).hechos
 expect(()=>Schema.decodeUnknownSync(HechosInversionExt2025)({...h,estatal681:undefined},{onExcessProperty:"error"})).toThrow()
})
it("sin cuota estatal interna no publica el resultado autonómico aislado",()=>{
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([caso()]),{...marco(),cuotaEstatal681:undefined})).toThrow(/cuota estatal/)
})
it("consejero no ejecutivo puede cumplir sin heredar prohibición laboral aragonesa",()=>{
 const s=caso();s.hechos.inversion.vinculacion[0].rol="consejero-no-ejecutivo"
 expect(aplicarDeduccionesTerritoriales2025(solicitud([s]),marco()).total).toEqual({numeradorEuros:"4000",divisor:"1"})
})
it("el tercero no se convierte en pariente estatal de segundo grado",()=>{
 const s=caso();s.hechos.inversion.historialParticipacionTercero[0].familiares[0].grado=4
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([s]),marco())).toThrow(/tercer grado/)
})
it("magnitudes anuales81 dígitos se rechazan sin recortar al pasar por D51",()=>{
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([caso()]),{...marco(),baseGeneral:new Decimal("1."+"1".repeat(80))})).toThrow(/80/)
})
