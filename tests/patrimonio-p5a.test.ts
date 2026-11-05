import {describe,it,expect} from "vitest"
import {Effect,Schema} from "effect"
import Decimal from "decimal.js"
import {aplicarDeduccionesTerritoriales2025,type MagnitudesTerritorialesAnuales,type SolicitudDeduccionesTerritoriales2025} from "../lib/dominio/irpf/deducciones/anual-territorial"
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type {CodigoViviendaRioja} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/vivienda-rioja"
import type {CasoFiscalAnual} from "../lib/dominio/irpf/caso-fiscal-anual"
import {SolicitudE38Anual2025} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
import {producirPatrimonioP5a} from "../lib/dominio/irpf/patrimonio-p5a/productor"
import {racional} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
function canonico(comunidad:CasoFiscalAnual["comunidadAutonoma"]="la-rioja"):CasoFiscalAnual{return{anio:2025,comunidadAutonoma:comunidad,contribuyenteId:"A",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:2000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}}
function efectivo(s:SolicitudDeduccionesTerritoriales2025){return{ejercicio:2025,comunidadAutonoma:"la-rioja",contribuyenteId:"A",edad:35,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"R",clase:"empleo-laboral",integro:"20000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]} as const}
function magnitudes(territorio:MagnitudesTerritorialesAnuales["caso"]["comunidadAutonoma"]="la-rioja"):MagnitudesTerritorialesAnuales{return{caso:canonico(territorio),basesImponiblesE38:{general:new Decimal("14000"),ahorro:new Decimal("0")},baseGeneral:new Decimal("14000"),baseAhorro:new Decimal("0"),minimoPersonalFamiliar:new Decimal("5550"),cuotaAutonomica:new Decimal("1000"),sujetosConMinimo:[],atribucionesMinimo:[]}}

const doc=(referencia:string,fecha="2025-12-31")=>({referencia,fecha,emisor:"Entidad documental"})
const corte=(importe:string,fecha="2025-12-31")=>({importe,documento:doc("saldo"+fecha,fecha)})
const codigos=["rioja_vivienda_habitual_pequenos_municipios","rioja_inversion_vivienda_jovenes_menores_36"] as const
type HechosP5a=Extract<SolicitudE38Anual2025["hechos"],{readonly codigo:CodigoViviendaRioja}>
type SolicitudP5a=Omit<SolicitudE38Anual2025,"hechos"|"patrimonioP5a"> & {
 readonly hechos:HechosP5a
 readonly patrimonioP5a:NonNullable<SolicitudE38Anual2025["patrimonioP5a"]>
}
function fixture(codigo:typeof codigos[number]=codigos[0],financiada=codigo===codigos[1]):SolicitudP5a{
 const movimientos=[
 {id:"I",clase:"ingreso",sentido:"entrada",importe:"20000",fecha:"2025-01-02"},
 {id:"D",clase:"disposicion",sentido:"entrada",importe:"9000",fecha:"2025-02-01"},
 {id:"P",clase:"precio",sentido:"salida",importe:"10000",fecha:"2025-02-01"},
 {id:"A",clase:"amortizacion",sentido:"salida",importe:"100",fecha:"2025-12-01"},
 {id:"F",clase:"intereses",sentido:"salida",importe:"50",fecha:"2025-12-01"},
 {id:"C",clase:"consumo",sentido:"salida",importe:"18850",fecha:"2025-12-15"},
 ].map(m=>({...m,cuenta:"CTA",documento:doc(m.id,m.fecha)}))
 const pagos=movimientos.filter(m=>["precio","amortizacion","intereses"].includes(m.clase)).map(m=>({id:m.id,pagador:"A",receptor:m.clase==="precio"?"VEN":"BAN",fecha:m.fecha,importe:m.importe,factura:m.id,concepto:m.clase==="precio"?"adquisicion":m.clase,medio:"transferencia",subvencion:"0",especieExenta:"0"}))
 const solicitud=Schema.decodeUnknownSync(SolicitudE38Anual2025)({lote:"E38",nacimientoContribuyente:"1990-01-01",exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:pagos.map(p=>({id:p.id,titular:p.pagador,fecha:p.fecha,importe:p.importe,documento:p.factura})),
 patrimonioP5a:{ejercicio:2025,persona:"A",exhaustividad:"todos_activos_deudas_derechos_y_movimientos",censo:[{id:"CTA",tipo:"cuenta_euros",inicio:"presente"},{id:"V",tipo:"vivienda",inicio:"ausente"},{id:"L",tipo:"prestamo",inicio:"ausente"}].map(c=>({...c,cierre:"presente",titular:"A",participacion:[1,1],documento:doc("censo")})),cuentas:[{id:"CTA",inicio:corte("2000","2025-01-01"),cierre:corte("2000")}],movimientos,
 adquisicion:{inmueble:"V",fecha:"2025-02-01",vendedor:"VEN",precio:"10000",escritura:doc("ES","2025-02-01"),valorCierre:corte("11000")},prestamo:{id:"L",fecha:"2025-02-01",acreedor:"BAN",inmueble:"V",contrato:doc("L","2025-02-01"),principalCierre:corte("8900")},historia:{desde:"1990-01-01",hasta:"2025-12-31",documento:doc("historia"),derechos:[{inmueble:"V",titular:"A",adquisicion:"2025-02-01",transmision:null,titulo:doc("ES","2025-02-01")}],anticipos:[],ejercicios:Array.from({length:35},(_,i)=>({anio:1990+i,documento:doc("fiscal"+i),eventos:[]}))}},
 hechos:{codigo,viviendas:[{inmueble:{id:"V",territorio:"la-rioja",titulares:[{titular:"A",numerador:1,denominador:1}],uso:"habitual",residencia:{desde:"2025-02-01",hasta:"2028-02-01"},adquisicion:"2025-02-01",precioAdquisicion:"10000",valorMercadoInicio:"0",valorSuelo:"0",catastralSuelo:"0",catastralConstruccion:"0"},municipio:"Ábalos",municipioHabitual:"Ábalos",operacion:"adquisicion",fechaInicioInversion:"2025-02-01",finConstruccion:"2025-02-01",primeraOcupacion:"2025-02-01",excepcionOcupacion:null,excepcionPermanencia:null,ampliacionPlazoConstruccion:null,obra:null,pagos,coberturaIntereses:"0",deduccionPre2013:null,ejercicioDeduccionAnterior:null,excepcion6812:null,primerPagoObra:"2025-02-01",informeDiscapacidad:null}]}} ,{onExcessProperty:"error"})
 if(solicitud.patrimonioP5a===undefined || (solicitud.hechos.codigo!==codigos[0] && solicitud.hechos.codigo!==codigos[1]))throw new Error("Fixture ajena a P5a")
 const perfil={...solicitud,hechos:solicitud.hechos,patrimonioP5a:solicitud.patrimonioP5a}
 if(!financiada){
  const p=perfil.patrimonioP5a,v=perfil.hechos.viviendas[0]
  if(v===undefined)throw new Error("Vivienda ausente")
  Object.assign(p,{prestamo:null,censo:p.censo.filter(x=>x.id!=="L"),movimientos:p.movimientos.filter(x=>!["D","A","F"].includes(x.id))})
  Object.assign(p.movimientos.find(x=>x.id==="C")!,{importe:"10000"})
  Object.assign(v,{pagos:v.pagos.filter(x=>x.id==="P")})
  Object.assign(perfil,{inversionesViviendaEjercicio:perfil.inversionesViviendaEjercicio.filter(x=>x.id==="P")})
 }
 return perfil
}
function ambas(s:SolicitudDeduccionesTerritoriales2025,edad=35){const caso=canonico();return [Effect.map(liquidarIrpfAnual({...caso,situacionFamiliar:{...caso.situacionFamiliar,edad},deduccionesTerritoriales2025:s},{modo:"canonico"}),x=>x.deduccionesTerritoriales2025),Effect.map(liquidarIrpfAnualExplicito({...efectivo(s),edad}),x=>x.deduccionesTerritoriales2025)]}
function mutable(codigo:typeof codigos[number]){return structuredClone(fixture(codigo))}
for(const codigo of codigos)describe(codigo,()=>{
 const esperado=codigo===codigos[0]?racional("452"):racional("172.5") // 32.2: precio directo10000, límite452; 32.11: (10000-9000+100+50)*15/100
 it("ambas API generan positivo desde hechos y consumen una cuota",()=>{for(const e of ambas({solicitudes:[fixture(codigo)]})){const r=Effect.runSync(e);expect(r?.evaluaciones[0].exacto).toEqual(esperado);expect(r?.total).toEqual(esperado);expect(r?.aplicaciones).toHaveLength(1)}})
 it("patrimonio: umbral exacto, deuda y exclusión de valoración",()=>{const s=fixture(codigo);if(s.patrimonioP5a===undefined||(s.hechos.codigo!==codigos[0]&&s.hechos.codigo!==codigos[1]))throw new Error("fixture");const p=producirPatrimonioP5a(s.patrimonioP5a,"A","1990-01-01",s.hechos.viviendas[0]!);expect(p.traza.incrementoComparable).toEqual({numeradorCentimos:codigo===codigos[0]?"1000000":"110000",denominador:"1"});expect(p.traza.inversionSinFinanciacion).toEqual({numeradorCentimos:codigo===codigos[0]?"1000000":"110000",denominador:"1"})})
 it("un céntimo de consumo adicional pierde la comparación en ambas API",()=>{const s=mutable(codigo);const p=s.patrimonioP5a!;Object.assign(p.cuentas[0]!.cierre,{importe:"1999.99"});Object.assign(p.movimientos.find(m=>m.id==="C")!,{importe:codigo===codigos[0]?"10000.01":"18850.01"});for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(e)?.total).toEqual(racional("0"))})
 it("ISD monetario no puede suplir ahorro",()=>{const s=mutable(codigo),p=s.patrimonioP5a!;Object.assign(p.movimientos.find(m=>m.id==="I")!,{clase:"donacion"});for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(e)?.total).toEqual(racional("0"))})
 it("apreciación y depreciación dejan el incremento constante",()=>{for(const importe of ["9000","1000000"]){const s=mutable(codigo);Object.assign(s.patrimonioP5a!.adquisicion.valorCierre,{importe});for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(e)?.total).toEqual(esperado)}})
 for(const fallo of ["sin_censo","ajeno","deuda","saldo","duplicado","historia","anterior","categoria","inversion_ajena","fecha"])it("ambas API rechazan perfil "+fallo,()=>{
  const s=mutable(codigo),p=s.patrimonioP5a!;
  if(fallo==="sin_censo")Object.assign(s,{patrimonioP5a:undefined});
  if(fallo==="ajeno")Object.assign(p,{persona:"Q"});
  if(fallo==="deuda"){if(p.prestamo!==null)Object.assign(p.prestamo.principalCierre,{importe:"8901"});else Object.assign(p,{censo:[...p.censo,{...p.censo[0],id:"L",tipo:"prestamo"}]});}
  if(fallo==="saldo")Object.assign(p.cuentas[0]!.cierre,{importe:"2001"});
  if(fallo==="duplicado")Object.assign(p,{movimientos:[...p.movimientos,p.movimientos[0]]});
  if(fallo==="historia")Object.assign(p.historia,{ejercicios:[]});
  if(fallo==="anterior")Object.assign(p.historia,{anticipos:[{inmueble:"V",fecha:"2024-01-01",importe:"1",documento:doc("anticipo")}]});
  if(fallo==="categoria")Object.assign(p.censo[0]!,{tipo:"otro"});
  if(fallo==="inversion_ajena")Object.assign(p.adquisicion,{inmueble:"Q"});
  if(fallo==="fecha")Object.assign(p.adquisicion,{fecha:"2025-02-30"});
  for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
 })
 for(const campo of ["patrimonioInicialAjustado","patrimonioFinalAjustado","cumple","inversionAnteriorDeducida","gananciaExentaReinversion","inversionNuevaAcumuladaAntes2025"])it("inyección fiscal "+campo,()=>{const s=mutable(codigo);Object.assign(s.patrimonioP5a!,{[campo]:"0"});for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")})
 it("80 cifras de cuota en libro único sin redondear",()=>{const q="0."+"0".repeat(78)+"1";expect(aplicarDeduccionesTerritoriales2025({solicitudes:[fixture(codigo)]},{...magnitudes(),cuotaAutonomica:new Decimal(q)}).total).toEqual(racional("1",String(10n**79n)))})
})
it("jóvenes usa BLG anual y umbral80 cifras",()=>{const s={solicitudes:[fixture(codigos[1])]};expect(aplicarDeduccionesTerritoriales2025(s,{...magnitudes(),baseGeneral:new Decimal("18030")}).total).toEqual(racional("172.5"));expect(aplicarDeduccionesTerritoriales2025(s,{...magnitudes(),baseGeneral:new Decimal("18030."+"0".repeat(74)+"1")}).total).toEqual(racional("0"))})
it("nuevas combinaciones y doble reserva no representadas",()=>{for(const e of ambas({solicitudes:[fixture(codigos[0]),fixture(codigos[1])]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")})

it("menor36, localidad y uso se deciden desde hechos conciliados",()=>{
 const edad36={...fixture(codigos[1]),nacimientoContribuyente:"1989-01-01"};
 // El censo debe cambiar también; un nacimiento aislado contradictorio se rechaza.
 for(const e of ambas({solicitudes:[edad36]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
 const s=mutable(codigos[0]);if(!("viviendas"in s.hechos))throw new Error("fixture");Object.assign(s.hechos.viviendas[0]!,{municipio:"Logroño"});for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(e)?.total).toEqual(racional("0"))
})
for(const campo of ["inversionAnteriorDeducida","gananciaExentaReinversion","inversionNuevaAcumuladaAntes2025"])it("cierra historia fiscal dentro de vivienda: "+campo,()=>{const s=mutable(codigos[1]);if(!("viviendas"in s.hechos))throw new Error("fixture");Object.assign(s.hechos.viviendas[0]!,{[campo]:"0"});for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")})

for(const codigo of codigos)it("sin préstamo: precio propio y límites regionales en ambas API "+codigo,()=>{
 const s=mutable(codigo),p=s.patrimonioP5a!;Object.assign(p,{prestamo:null,censo:p.censo.filter(x=>x.id!=="L"),movimientos:p.movimientos.filter(x=>!["D","A","F"].includes(x.id))});Object.assign(p.movimientos.find(x=>x.id==="C")!,{importe:"10000"});
 if(!("viviendas"in s.hechos))throw new Error("fixture");const v=s.hechos.viviendas[0]!;Object.assign(v,{pagos:v.pagos.filter(x=>x.id==="P")});Object.assign(s,{inversionesViviendaEjercicio:s.inversionesViviendaEjercicio.filter(x=>x.id==="P")});
 const esperado=codigo===codigos[0]?racional("452"):racional("1350");
 for(const e of ambas({solicitudes:[s]}))expect(Effect.runSync(e)?.evaluaciones[0].exacto).toEqual(esperado)
 expect(aplicarDeduccionesTerritoriales2025({solicitudes:[s]},{...magnitudes(),cuotaAutonomica:new Decimal("10000")}).total).toEqual(esperado)
})

// Censo vital íntegro: la edad cambia junto con ambas entradas anuales y su historia.
function conNacimiento(codigo:typeof codigos[number],nacimiento:string){
 const s=mutable(codigo),h=s.patrimonioP5a!.historia,anio=Number(nacimiento.slice(0,4));
 Object.assign(s,{nacimientoContribuyente:nacimiento});
 Object.assign(h,{desde:nacimiento,ejercicios:Array.from({length:2025-anio},(_,i)=>({anio:anio+i,documento:doc("fiscal-edad-"+(anio+i)),eventos:[]}))});
 return s
}
for(const codigo of codigos)for(const [nacimiento,edad] of [["1990-01-01",35],["1989-12-31",36],["1988-12-31",37]] as const)
it(codigo+": frontera edad "+edad+" con censo vital íntegro en ambas API",()=>{
 const s=conNacimiento(codigo,nacimiento);
 const esperado=codigo===codigos[0]?racional("452"):edad<36?racional("172.5"):racional("0");
 for(const e of ambas({solicitudes:[s]},edad))expect(Effect.runSync(e)?.total).toEqual(esperado)
})
// Frontera del consumidor sobre base liquidable del ahorro producida por el motor.
// Las pruebas end-to-end de renta del ahorro requieren representación de ese productor.
for(const codigo of codigos)for(const ahorro of ["1799.99","1800","1800.01","1800."+"0".repeat(74)+"1"])
it(codigo+": frontera ahorro "+ahorro,()=>{
 const esperado=codigo===codigos[0]?racional("452"):new Decimal(ahorro).lte("1800")?racional("172.5"):racional("0");
 const m=magnitudes();expect(aplicarDeduccionesTerritoriales2025({solicitudes:[fixture(codigo)]},{...m,baseAhorro:new Decimal(ahorro),basesLiquidables:{general:m.baseGeneral,ahorro:new Decimal(ahorro)},basesImponiblesE38:{general:m.baseGeneral,ahorro:new Decimal(ahorro)}}).total).toEqual(esperado)
})
for(const codigo of codigos)it(codigo+": cuota residual única no reutilizada",()=>{
 expect(aplicarDeduccionesTerritoriales2025({solicitudes:[fixture(codigo)]},{...magnitudes(),cuotaAutonomicaResidual:new Decimal("1.01")}).total).toEqual(racional("1.01"))
})
// Libros centinela: se rechazan antes de evaluar o interpretar un productor concurrente.
for(const campo of ["libroIngresosIdentificados2025","libroMaternidad81","donativosEstatales"] as const)
it("P5a mantiene cierre de nueva combinación "+campo,()=>{
// SAFETY: el libro vacío es un centinela inválido deliberado; esta prueba exige rechazarlo antes de interpretarlo.
 const m={...magnitudes(),[campo]:{}} as MagnitudesTerritorialesAnuales;
 expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[fixture()]},m)).toThrow(/P5a combinación/)
})

// Los dos rojos financiados originales y su corrección se conservan en el respaldo.
// 32.2 se acota ahora al precio directo; 32.11 conserva entrada e importe originales.
for (const codigo of codigos) it("dividir una transferencia de precio no cambia la deducción " + codigo, () => {
  const s = mutable(codigo), p = s.patrimonioP5a
  if (p === undefined || !("viviendas" in s.hechos)) throw new Error("Fixture P5a incompleta")
  const v = s.hechos.viviendas[0]
  if (v === undefined) throw new Error("Sin vivienda")
  Object.assign(p, { movimientos: p.movimientos.flatMap(m => m.clase === "precio" ? [
    { ...m, importe: "5000" },
    { ...m, id: "P2", importe: "5000", documento: { ...m.documento, referencia: "P2" } },
  ] : [m]) })
  Object.assign(v, { pagos: v.pagos.flatMap(pago => pago.id === "P" ? [
    { ...pago, importe: "5000" }, { ...pago, id: "P2", factura: "P2", importe: "5000" },
  ] : [pago]) })
  Object.assign(s, { inversionesViviendaEjercicio: v.pagos.map(pago => ({
    id: pago.id, titular: pago.pagador, fecha: pago.fecha, importe: pago.importe, documento: pago.factura,
  })) })
  // Precio10000; sólo 32.11 lleva préstamo9000, amortización100 e intereses50.
  const esperado = codigo === codigos[0] ? racional("452") : racional("172.5")
  for (const calculo of ambas({ solicitudes: [s] })) expect(Effect.runSync(calculo)?.total).toEqual(esperado)
})

for (const codigo of codigos) for (const partes of [
  ["3333.33", "3333.33", "3333.34"], ["0.01", "9999.99"], ["10000"],
] as const) it("precio dividido y pagos íntegros " + codigo + " " + partes.join("+"), () => {
  const s=mutable(codigo), p=s.patrimonioP5a
  if (p === undefined || !("viviendas" in s.hechos)) throw new Error("Fixture P5a")
  const v=s.hechos.viviendas[0]
  if(v===undefined)throw new Error("Sin vivienda")
  Object.assign(p,{movimientos:p.movimientos.flatMap(m=>m.clase==="precio"?partes.map((importe,i)=>({
    ...m,id:"P"+i,importe,documento:{...m.documento,referencia:"P"+i},
  })):[m])})
  Object.assign(v,{pagos:v.pagos.flatMap(pago=>pago.id==="P"?partes.map((importe,i)=>({
    ...pago,id:"P"+i,factura:"P"+i,importe,
  })):[pago]).reverse()})
  Object.assign(s,{inversionesViviendaEjercicio:v.pagos.map(pago=>({
    id:pago.id,titular:pago.pagador,fecha:pago.fecha,importe:pago.importe,documento:pago.factura,
  }))})
  const original=JSON.stringify(v.pagos)
  const producido=producirPatrimonioP5a(p,"A","1990-01-01",v)
  expect(producido.pagos).toEqual(v.pagos)
  expect(JSON.stringify(v.pagos)).toBe(original)
  expect(producido.financiacionAdquisicion).toEqual({inmueble:"V",dispuesto:{n:codigo===codigos[0]?0n:900000n,d:1n}})
  const esperado=codigo===codigos[0]?racional("452"):racional("172.5")
  for(const calculo of ambas({solicitudes:[s]}))expect(Effect.runSync(calculo)?.total).toEqual(esperado)
})
for(const codigo of codigos)it("financiación interna no aceptada como dato externo " + codigo,()=>{
  const s=mutable(codigo)
  Object.assign(s,{financiacionAdquisicion:{inmueble:"V",dispuesto:"0"}})
  for(const calculo of ambas({solicitudes:[s]}))expect(Effect.runSync(Effect.flip(calculo))._tag).toBe("ResultadoNoSoportado")
})

// 32.2 financiada no equivale a derecho cero: el perfil queda sin resultado.
it("32.2 financiada se rechaza con reserva concreta en ambas API y adaptador",()=>{
 const s=fixture(codigos[0],true)
 expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[s]},magnitudes())).toThrow(/32.2: financiación no representada/)
 for(const calculo of ambas({solicitudes:[s]}))expect(Effect.runSync(Effect.flip(calculo))._tag).toBe("ResultadoNoSoportado")
})
for(const codigo of codigos)it("ocupación anterior que continúa al adquirir conserva el derecho " + codigo,()=>{
 const s=mutable(codigo),v=s.hechos.viviendas[0]!
 Object.assign(v,{primeraOcupacion:"2020-02-01"})
 Object.assign(v.inmueble,{residencia:{desde:"2020-02-01",hasta:"2028-02-01"}})
 for(const calculo of ambas({solicitudes:[s]}))expect(Effect.runSync(calculo)?.total).toEqual(racional(codigo===codigos[0]?"452":"172.5"))
})
for(const codigo of codigos)it("excepción documental no revive una residencia abandonada " + codigo,()=>{
 const s=mutable(codigo),v=s.hechos.viviendas[0]!
 Object.assign(v,{primeraOcupacion:"2020-02-01",excepcionPermanencia:doc("excepcion")})
 Object.assign(v.inmueble,{residencia:{desde:"2020-02-01",hasta:"2024-02-01"}})
 for(const calculo of ambas({solicitudes:[s]}))expect(Effect.runSync(calculo)?.total).toEqual(racional("0"))
})
