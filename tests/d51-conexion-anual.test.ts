import { DeduccionTrabajo } from "../lib/dominio/irpf/trabajo-anual/contrato"
import { describe, expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Schema, Result } from "effect"
import { aplicarDeduccionesTerritoriales2025, SolicitudDeduccionesTerritoriales2025, type MagnitudesTerritorialesAnuales as M } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { SolicitudD51, codigosD51 } from "../lib/dominio/irpf/deducciones/d51-anual-esquemas"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito, type CasoFiscalAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { DerechosMinimosAnuales, TitularDescendiente } from "../lib/dominio/irpf/minimos/derechos-contrato"
import solicitudes51 from "./fixtures/d51-solicitudes-sin-fiscal.json"

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
function igual(r:{numeradorEuros:string;divisor:string}|undefined,n:bigint,d=1n){if(r===undefined)throw new Error("Importe exacto ausente");expect(BigInt(r.numeradorEuros)*d).toBe(n*BigInt(r.divisor))}

for(const entrada of solicitudes51)it("frontera51: "+entrada.codigo,()=>{
 const r=Schema.decodeUnknownResult(SolicitudD51)(entrada,{onExcessProperty:"error"});expect(Result.isSuccess(r)).toBe(true)
 expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudD51)({...entrada,hechos:{...entrada.hechos,baseGeneral:"0"}},{onExcessProperty:"error"}))).toBe(true)
})
it("51 códigos únicos y sin magnitudes fiscales en la frontera",()=>{expect(new Set(codigosD51).size).toBe(51);expect(solicitudes51.length).toBe(51)})
it("cuota producida larga y sin centésimos intermedios",()=>{
 const r=aplicarDeduccionesTerritoriales2025(donIdi,m(undefined,"20.079"))
 igual(r.total,20079n,10000n);igual(r.disponible,180711n,10000n)
})
it("techo9a–f se gasta una sola vez por bases registradas, en orden",()=>{
 const a={lote:"D51",codigo:"cyl_recuperacion_patrimonio_historico_cultural_natural",hechos:{pagos:[pago("800","pat")],rama:"cultural",acto:"autorizacion",categoria:"protegido",exhaustividad:"completa"}}
 const b={lote:"D51",codigo:"cyl_donaciones_idi",hechos:{pagos:[pago("800","idi")],proyecto:"cyl",destinatario:"universidad_publica",exhaustividad:"completa"}}
 for(const solicitudes of [[a,b],[b,a]]){const r=aplicarDeduccionesTerritoriales2025(solicitud({solicitudes}),m("castilla-y-leon","1000","10000"));igual(r.total,150n);igual(r.aplicaciones[0].generado,120n);igual(r.aplicaciones[1].generado,30n)}
})
const intereses={lote:"D51",codigo:"clm_intereses_primera_vivienda_menores_40",hechos:{nacimiento:"1990-01-01",tipoPrestamo:"variable",pagosIntereses:[pago("500","int")],maximaPropiedadAnterior:"0",concurrencia12ter:"no",exhaustividad:"completa"}}
const perro={lote:"D51",codigo:"clm_controles_veterinarios_perros_asistencia",hechos:{pagos:[pago("400","vet")],inicioTenencia:"2024-01-01",finTenencia:"2026-01-01",subvenciones:"0",clase:"guia",vinculacion:"clm",exhaustividad:"completa"}}
it("cuota única respeta orden y agotamiento, sin elegir mayor importe",()=>{
 const mm=m(undefined,"160");const marco={...mm,caso:{...mm.caso,situacionFamiliar:{...mm.caso.situacionFamiliar,edad:35}}}
 const a=aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[intereses,perro]}),marco)
 igual(a.total,160n);igual(a.aplicaciones[0].aplicado,150n);igual(a.aplicaciones[1].aplicado,10n);igual(a.aplicaciones[1].pendiente,90n)
 const b=aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[perro,intereses]}),marco)
 igual(b.total,160n);igual(b.aplicaciones[0].aplicado,100n);igual(b.aplicaciones[1].aplicado,60n)
})
it("pago duplicado entre códigos y operación duplicada dentro no se suma",()=>{
 const doble=solicitud({solicitudes:[perro,{...intereses,hechos:{...intereses.hechos,pagosIntereses:[pago("500","vet")]}}]})
 const mm=m();const marco={...mm,caso:{...mm.caso,situacionFamiliar:{...mm.caso.situacionFamiliar,edad:35}}}
 expect(()=>aplicarDeduccionesTerritoriales2025(doble,marco)).toThrow(/duplicad/i)
 const op={id:"bien",fecha:"2025-05-01",modalidad:"bien",valor:"1000",creditoFiscal:"no"}
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[{lote:"D51",codigo:"clm_donaciones_bienes_culturales_mecenazgo",hechos:{operaciones:[op,op],exhaustividad:"completa"}}]}),mm)).toThrow(/duplicad/i)
})
it("edad o discapacidad propias no pueden venir contradichas de los hechos",()=>{
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[intereses]}),m())).toThrow(/edad/i)
 const alq={lote:"D51",codigo:"clm_arrendamiento_personas_discapacidad",hechos:{inicio:"2025-01-01",fin:"2025-12-31",titularesConDerecho:["s-1"],pagos:[pago("5000")],eleccion:"esta",grado:65,exhaustividad:"completa"}}
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[alq]}),m())).toThrow(/discapacidad/i)
})
it("H2/H3 no se transforman en cero por ausencia de productor histórico",()=>{
 const reh={lote:"D51",codigo:"extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler",hechos:{pagos:[pago("9040")],costeRehabilitacion:"500000",porcentajePropiedad:"50",ayudaReconocida:"1",diasRequisitos:365,parentesco:0,actividadEconomica:"no",ubicacion:"municipio_menor3000",vivienda:"v",exhaustividad:"completa"}}
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[reh]}),m("extremadura"))).toThrow(/H2.*ayuda/i)
 const rural={lote:"D51",codigo:"extremadura_vivienda_zonas_rurales",hechos:{fechaOperacion:"2022-03-22",poblacion:1000,porcentajePropiedad:"50",coste:"200000",ayudasJunta:"1",pagos:[pago("9040")],eleccion:"rural",vivienda:"v",exhaustividad:"completa"}}
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[rural]}),m("extremadura"))).toThrow(/H3.*ayudas/i)
})
it("base histórica y deducción estatal no se reciben del llamador",()=>{
 const cuenta={lote:"D51",codigo:"clm_ahorro_inversion_primera_vivienda",hechos:{nacimiento:"1989-01-01",cuenta:"c",fechaApertura:"2025-01-01",saldoInicio:"0",saldoFin:"1000",cuentasAbiertas:1,exhaustividad:"completa"}}
 const mm=m();const marco={...mm,caso:{...mm.caso,situacionFamiliar:{...mm.caso.situacionFamiliar,edad:36}}}
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[cuenta]}),marco)).toThrow(/deducidoAnterior/)
 expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudD51)({...cuenta,hechos:{...cuenta.hechos,deducidoAnterior:{ejercicio:2025,declarantes:["s-1"],concepto:"deducciones_cuenta_anteriores:c",valor:"0"}}},{onExcessProperty:"error"}))).toBe(true)
})
it("renta larga hasta80 transportada en un productor anual, no redondeada a umbral",()=>{
 const base="6500.0000000000000000000000000000000000000000000000000000000000000000000000001"
 const mm=m("castilla-la-mancha","1000",base)
 const r=aplicarDeduccionesTerritoriales2025(donIdi,mm)
 igual(r.total,100n)
})

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
function familia(api:"clasica"|"efectiva"):DerechosMinimosAnuales{
 const propia=api==="clasica"?Effect.runSync(liquidarIrpfAnual(clasico(vacia),{modo:"canonico"})).rendimientoNetoTrabajoCentimos:2800000
 return {ejercicio:2025,territorio,regimen:"comun",modalidad:"individual",devengo:"2025-12-31",contribuyenteId:"s-1",edadContribuyenteDevengo:40,discapacidadContribuyente:{_tag:"SinDiscapacidad"},ascendientes:"ninguno",fallecimientosEnElEjercicio:"ninguno",descendientesCompletos:true,conciliacionRentasContribuyente:{perfil:"caso-anual-parcial",otrasRentasOGastosNoRepresentados:"ninguno"},descendientes:[{sujetoId:"s-2",fechaNacimiento:"2023-01-01",edadDevengo:2,vivoAlDevengo:true,rentasNoExentasCentimos:0,declaracion:{modalidad:"no-presenta"},discapacidad:{_tag:"SinDiscapacidad"},titularesCompletos:true,titulares:["s-1","s-3","s-4"].map((titularId):TitularDescendiente=>({titularId,grado:2,vinculo:{clase:"consanguinidad"},relacion:"convivencia",custodia:"no-procede",alimentosJudiciales:false,aplicaEspecialidadAlimentos:false,residenteIrpf:true,rentasNoExentasCentimos:titularId==="s-1"?propia:1000000}))}]}
}
for(const api of ["clasica","efectiva"] as const){
 it(api+": conecta D51, usa la cuota interna y no la presentación",()=>{
  const resultado=api==="clasica"?Effect.runSync(liquidarIrpfAnual(clasico(donIdi),{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito(efectivo(donIdi)))
  const ded=resultado.deduccionesTerritoriales2025;if(ded===undefined)throw new Error("No llegó D51 a la API")
  // Si se genera el10% de la cuota y no hay otras deducciones: disponible=9×aplicado.
  expect(BigInt(ded.total.numeradorEuros)*9n*BigInt(ded.disponible.divisor)).toBe(BigInt(ded.disponible.numeradorEuros)*BigInt(ded.total.divisor))
  expect(ded.estado).toBe("condicionado")
 })
 it(api+": precisión80 con mínimos por tercios, sin transportar presentación en céntimos",()=>{
  const derechos=familia(api)
  const resultado=api==="clasica"?Effect.runSync(liquidarIrpfAnual(clasico(donIdi,derechos),{modo:"canonico"})):Effect.runSync(liquidarIrpfAnualExplicito(efectivo(donIdi,derechos)))
  const ded=resultado.deduccionesTerritoriales2025;if(ded===undefined)throw new Error("Sin transporte exacto")
  expect(ded.total.numeradorEuros.length).toBeGreaterThan(20)
  expect(BigInt(ded.total.numeradorEuros)*9n*BigInt(ded.disponible.divisor)).toBe(BigInt(ded.disponible.numeradorEuros)*BigInt(ded.total.divisor))
 })
 it(api+": fiscal externo en solicitud se rechaza sin importe",()=>{
  // SAFETY: entrada deliberadamente inválida; las dos API decodifican antes de acceder a los hechos.
  const corrupta={...donIdi,cuotaAutonomica:"0"} as S
  const error=api==="clasica"?Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(corrupta),{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(efectivo(corrupta))))
  expect(error._tag).toBe("ResultadoNoSoportado");expect("importe" in error).toBe(false)
 })
 it(api+": productor histórico ausente se rechaza con causa, no cero fiscal",()=>{
  const cuenta=solicitud({solicitudes:[{lote:"D51",codigo:"clm_ahorro_inversion_primera_vivienda",hechos:{nacimiento:"1985-01-01",cuenta:"c",fechaApertura:"2025-01-01",saldoInicio:"0",saldoFin:"1000",cuentasAbiertas:1,exhaustividad:"completa"}}]})
  const error=api==="clasica"?Effect.runSync(Effect.flip(liquidarIrpfAnual(clasico(cuenta),{modo:"canonico"}))):Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(efectivo(cuenta))))
  expect(error._tag).toBe("ResultadoNoSoportado");expect(error.motivo).toMatch(/deducidoAnterior/);expect("importe" in error).toBe(false)
 })
}

describe("selecciones, reservas y personas: rechazo previo sin cuota ficticia",()=>{
 it("12/12ter se detecta en la selección aunque los hechos declaren no concurrir",()=>{
  const rural={lote:"D51",codigo:"clm_adquisicion_rehabilitacion_vivienda_zonas_rurales",hechos:{fechaOperacion:"2021-01-01",categoria:"intensa",poblacionFiscal:1000,pagos:[pago("1000","vivienda")],coste:"100000",ayudaJccm:"0",porcentajePropiedad:"100",concurrencia12:"no",vivienda:"v",exhaustividad:"completa"}}
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[intereses,rural]}),m())).toThrow(/12\/12ter/)
 })
 it("alquiler numerosa y familia numerosa requieren elegir; tampoco dos alquileres",()=>{
  const familia={lote:"D51",codigo:"clm_familia_numerosa",hechos:{categoria:"general",inicioTitulo:"2024-01-01",finTitulo:"2026-01-01",discapacitados65:[],titulares:["s-1"],eleccion:"familia",exhaustividad:"completa"}}
  const alquiler={lote:"D51",codigo:"clm_arrendamiento_familias_numerosas",hechos:{inicio:"2025-01-01",fin:"2025-12-31",titularesConDerecho:["s-1"],pagos:[pago()],eleccion:"esta",tituloInicio:"2024-01-01",tituloFin:"2026-01-01",exhaustividad:"completa"}}
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[familia,alquiler]}),m())).toThrow(/elección incompatible/i)
  const discapacidad={lote:"D51",codigo:"clm_arrendamiento_personas_discapacidad",hechos:{inicio:"2025-01-01",fin:"2025-12-31",titularesConDerecho:["s-1"],pagos:[pago("1000","otro")],eleccion:"esta",grado:65,exhaustividad:"completa"}}
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[alquiler,discapacidad]}),m())).toThrow(/elección.*alquiler/i)
 })
 it("EX viudedad y trabajo del mismo contribuyente no se eligen automáticamente",()=>{
  const viudo={lote:"D51",codigo:"extremadura_contribuyentes_viudos",hechos:{regimen:{poblacion:10000,familia:"ordinaria",hijosExclusivos:[],estadoCivil:"sin_vinculo",alimentos:"0"},estadoCivil:"viudo",condenaFirme:"no",eleccion:"viudedad",descendientes:[],exhaustividad:"completa"}}
  const trabajo={lote:"EXT",codigo:"extremadura_trabajo_dependiente",hechos:{exhaustividad:"todos_los_declarantes",personas:[{id:"s-1",integroTrabajo:"0",restoRentas:"0",eleccion:"trabajo"}]}}
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[viudo,trabajo]}),m("extremadura"))).toThrow(/elección incompatible/i)
 })
 it("censo intermedio25 y padrón2021 no son un permiso universal",()=>{
  const hecho={categoria:"intermedia_agricola",poblacionAnual:2100,poblacion2021:1999,municipioIntermedio:"02015",perdida2016_2021:"1",zonaSanitariaPadron:"zona",zonaSanitariaAtencion:"zona",escolares:[],exhaustividad:"completa"}
  const s=(h:Schema.Json)=>solicitud({solicitudes:[{lote:"D51",codigo:"clm_residencia_zonas_rurales",hechos:h}]})
  igual(aplicarDeduccionesTerritoriales2025(s(hecho),m()).total,150n)
  expect(()=>aplicarDeduccionesTerritoriales2025(s({...hecho,municipioIntermedio:"99999"}),m())).toThrow(/25 municipios/)
  igual(aplicarDeduccionesTerritoriales2025(s({...hecho,zonaSanitariaAtencion:"otra"}),m()).total,0n)
 })
 it("no atribuye cuota de trabajo si hay rentas mixtas o base inicial2024",()=>{
  const hecho={fechaTraslado:"2025-01-01",categoria:"intensa",causa:"trabajo",exhaustividad:"completa"}
  const s=(h:Schema.Json)=>solicitud({solicitudes:[{lote:"D51",codigo:"clm_traslado_vivienda_habitual",hechos:h}]})
  igual(aplicarDeduccionesTerritoriales2025(s(hecho),m()).total,500n)
  expect(()=>aplicarDeduccionesTerritoriales2025(s({...hecho,fechaTraslado:"2024-01-01"}),m())).toThrow(/inicial2024/)
  const mm=m();expect(()=>aplicarDeduccionesTerritoriales2025(s(hecho),{...mm,rentasTrabajoAnuales:{integroTrabajo:new D(10000),restoRentas:new D(1)}})).toThrow(/rentas mixtas/)
 })
 it("reserva naturaleza de CyL no desaparece al producir la base anual",()=>{
  const h={pagos:[pago()],rama:"natural",acto:"autorizacion",categoria:"protegido",exhaustividad:"completa"}
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[{lote:"D51",codigo:"cyl_recuperacion_patrimonio_historico_cultural_natural",hechos:h}]}),m("castilla-y-leon"))).toThrow(/autorización O informe/)
 })
})

it("productor BL transporta un límite calculado largo sin parser de hechos de8decimales",()=>{
 const escala=10n**70n
 const base="6500."+"0".repeat(69)+"1"
 const s=solicitud({solicitudes:[{lote:"D51",codigo:"clm_donaciones_cooperacion_lucha_pobreza_discapacidad",hechos:{pagos:[pago()],tipoEntidad:"fundacion",fin:"pobreza",exhaustividad:"completa"}}]})
 // Oráculo independiente:15% de una base limitada al10% de BL.
 igual(aplicarDeduccionesTerritoriales2025(s,m(undefined,"1000",base)).total,(6500n*escala+1n)*15n,1000n*escala)
})

it("CyL: una rama excluida por renta no consume la base9a–f de I+D exceptuada",()=>{
 const patr={lote:"D51",codigo:"cyl_donaciones_fundaciones_patrimonio",hechos:{pagos:[pago("1000","pat")],destino:"fundacion",exhaustividad:"completa"}}
 const idi={lote:"D51",codigo:"cyl_donaciones_idi",hechos:{pagos:[pago("4000","idi")],proyecto:"cyl",destinatario:"universidad_publica",exhaustividad:"completa"}}
 const r=aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[patr,idi]}),m("castilla-y-leon","10000","30000"))
 igual(r.aplicaciones[0].generado,0n);igual(r.aplicaciones[1].generado,450n);igual(r.total,450n)
})

it("fecha o ordinal de nacimiento no puede inventar un hecho2025 sin censo compatible",()=>{
 const d: DerechosMinimosAnuales={...familia("efectiva"),territorio:"castilla-y-leon",descendientes:familia("efectiva").descendientes.map(p=>({...p,titulares:p.titulares.slice(0,1).map(t=>({...t,grado:1}))}))}
 const mm=m("castilla-y-leon");const marco:M={...mm,caso:{...mm.caso,derechosMinimos:d},sujetosConMinimo:["s-2"],atribucionesMinimo:[{sujetoId:"s-2",titulares:["s-1"]}]}
 const h={id:"s-2",fecha:"2025-06-01",orden:1,grado:0,poblacion:6000,titularesMinimo:["s-1"],ayudaAnalogica:"no"}
 expect(()=>aplicarDeduccionesTerritoriales2025(solicitud({solicitudes:[{lote:"D51",codigo:"cyl_nacimiento_adopcion_hijos",hechos:{hijos:[h],exhaustividad:"completa"}}]}),marco)).toThrow(/nacimiento contradictor/i)
})

it("rebase: BL usa el productor compartido y rechaza su ausencia sin inferir BIG",()=>{
 const sol=solicitud({solicitudes:[{lote:"D51",codigo:"clm_donaciones_cooperacion_lucha_pobreza_discapacidad",hechos:{pagos:[pago()],tipoEntidad:"fundacion",fin:"pobreza",exhaustividad:"completa"}}]})
 const mm=m()
 expect(()=>aplicarDeduccionesTerritoriales2025(sol,{...mm,basesLiquidables:undefined})).toThrow(/basesLiquidables/)
 const conBL=aplicarDeduccionesTerritoriales2025(sol,{...mm,basesLiquidables:{general:new D(100),ahorro:new D(0)}})
 igual(conBL.total,15n,10n)
})
it("rebase: productores compartidos tampoco se aceptan en hechos del llamador",()=>{
 const entrada={lote:"D51",codigo:"clm_donaciones_idi_innovacion_empresarial",hechos:{pagos:[pago()],destinatario:"jccm",exhaustividad:"completa",basesLiquidables:{general:"0",ahorro:"0"}}}
 expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudD51)(entrada,{onExcessProperty:"error"}))).toBe(true)
})

it("DA61 conserva magnitudes calculadas de80decimales y rechaza81",()=>{
 const cuota="1000."+"0".repeat(79)+"1"
 const c={regla:"da61",ambito:"comun-individual",ejercicio:2025,brutoServicios:"30000",otrasRentasNoExentas:"0",netoReducidoServicios:"28000",baseLiquidableGeneral:"28000",cuotaIntegraGeneral:cuota,cuotaLiquidaTotal:cuota,cuotaTrasArt80:cuota,etapa:"despues-art80-sin-deduccion-trabajo",calificacion:"laboral-estatutaria-acreditada"}
 expect(Result.isSuccess(Schema.decodeUnknownResult(DeduccionTrabajo)(c))).toBe(true)
 expect(Result.isFailure(Schema.decodeUnknownResult(DeduccionTrabajo)({...c,cuotaTrasArt80:cuota+"1"}))).toBe(true)
})

it("ELA regional rechaza concedida/cobrada externas sin expediente integrado",()=>{
 const entrada={lote:"D51",codigo:"extremadura_ayudas_subvenciones_ela",hechos:{concedida:"2000",cobrada:"2000",exhaustividad:"completa"}}
 expect(Result.isFailure(Schema.decodeUnknownResult(SolicitudD51)(entrada,{onExcessProperty:"error"}))).toBe(true)
})
