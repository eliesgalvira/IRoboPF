import {describe,it,expect} from "vitest"
import {Effect,Schema} from "effect"
import Decimal from "decimal.js"
import {aplicarDeduccionesTerritoriales2025,type MagnitudesTerritorialesAnuales,type SolicitudDeduccionesTerritoriales2025} from "../lib/dominio/irpf/deducciones/anual-territorial"
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type {CasoFiscalAnual} from "../lib/dominio/irpf/caso-fiscal-anual"
import type {DerechosMinimosAnuales} from "../lib/dominio/irpf/minimos/derechos-contrato"
import {SolicitudE38Anual2025} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
import {PRODUCTORES_PENDIENTES_E38} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual"
import {racional} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import {casos,cuidado,pago} from "./galicia-rioja-ampliacion-2025.casos"
import {solicitudE38} from "./e38-anual-facturas.casos"
const codigoN1="rioja_vehiculos_electricos_nuevos"
const vehiculo=casos.find(c=>c.hechos.codigo===codigoN1)
if(vehiculo===undefined||vehiculo.hechos.codigo!==codigoN1)throw new Error("fixture corregida de vehículo")
const vehiculoHechos=vehiculo.hechos
const n1=solicitudE38({...vehiculoHechos,vehiculos:vehiculoHechos.vehiculos.map(v=>({...v,categoria:"N1"}))})
const territorial={solicitudes:[n1]} satisfies SolicitudDeduccionesTerritoriales2025
function canonico(comunidad:CasoFiscalAnual["comunidadAutonoma"]="la-rioja"):CasoFiscalAnual{return{anio:2025,comunidadAutonoma:comunidad,contribuyenteId:"A",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}}
function efectivo(s:SolicitudDeduccionesTerritoriales2025){return{ejercicio:2025,comunidadAutonoma:"la-rioja",contribuyenteId:"A",edad:35,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"R",clase:"empleo-laboral",integro:"30000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]} as const}
function magnitudes(territorio:MagnitudesTerritorialesAnuales["caso"]["comunidadAutonoma"]="la-rioja"):MagnitudesTerritorialesAnuales{return{caso:canonico(territorio),basesImponiblesE38:{general:new Decimal("20000"),ahorro:new Decimal("0")},baseGeneral:new Decimal("20000"),baseAhorro:new Decimal("0"),minimoPersonalFamiliar:new Decimal("5550"),cuotaAutonomica:new Decimal("1000"),sujetosConMinimo:[],atribucionesMinimo:[]}}
describe("E38 en las dos APIv4 públicas",()=>{
 it("canónica:N1 resta150 una sola vez,con estado condicionado",()=>{const b=canonico();const sin=Effect.runSync(liquidarIrpfAnual(b,{modo:"canonico"}));const con=Effect.runSync(liquidarIrpfAnual({...b,deduccionesTerritoriales2025:territorial},{modo:"canonico"}));expect(sin.cuotaLiquidaCentimos-con.cuotaLiquidaCentimos).toBe(15000);expect(con.deduccionesTerritoriales2025?.total).toEqual(racional("150"));expect(con.deduccionesTerritoriales2025?.aceptacionFiscal).toBe("pendiente")})
 it("explícita:misma generaciónN1 y cuota compartida",()=>{const r=Effect.runSync(liquidarIrpfAnualExplicito(efectivo(territorial)));expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("150"));expect(r.deduccionesTerritoriales2025?.evaluaciones[0].exacto).toEqual(racional("150"))})
 it("M1 corregido permanece suspendido:0 en ambas API",()=>{const m1={solicitudes:[solicitudE38(vehiculoHechos)]};expect(Effect.runSync(liquidarIrpfAnual({...canonico(),deduccionesTerritoriales2025:m1},{modo:"canonico"})).deduccionesTerritoriales2025?.total).toEqual(racional("0"));expect(Effect.runSync(liquidarIrpfAnualExplicito(efectivo(m1))).deduccionesTerritoriales2025?.total).toEqual(racional("0"))})
 it("ambas API rechazan selección de contribuyente ajeno,sin cuota cero ficticia",()=>{const a=Effect.runSync(Effect.flip(liquidarIrpfAnual({...canonico(),contribuyenteId:"Q",deduccionesTerritoriales2025:territorial},{modo:"canonico"})));const b=Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({...efectivo(territorial),contribuyenteId:"Q"})));expect(a._tag).toBe("ResultadoNoSoportado");expect(b._tag).toBe("ResultadoNoSoportado")})
 it("ambas API rechazan mistura de consignación y hechos",()=>{const c=Effect.runSync(Effect.flip(liquidarIrpfAnual({...canonico(),deduccionAutonomicaAgregadaCentimos:1,deduccionesTerritoriales2025:territorial},{modo:"canonico"})));expect(c._tag).toBe("ResultadoNoSoportado");const entrada={...efectivo(territorial)};Object.assign(entrada,{deduccionAutonomicaAgregadaCentimos:1});expect(Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(entrada)))._tag).toBe("ResultadoNoSoportado")})
})
describe("Magnitudes de motor,exactitud y cuotas",()=>{
 it("cuota20.079 no se redondea a céntimos antes del consumo",()=>{const m=magnitudes();const r=aplicarDeduccionesTerritoriales2025(territorial,{...m,cuotaAutonomica:new Decimal("20.079")});expect(r.total).toEqual(racional("20.079"));expect(r.aplicaciones[0].generado).toEqual(racional("150"));expect(r.aplicaciones[0].pendiente).toEqual(racional("129.921"))})
 it("mecenazgo conserva80 cifras de la cuota producida,antes del tope30%",()=>{const c=casos.find(x=>x.hechos.codigo==="rioja_donaciones_fomento_mecenazgo");if(c===undefined)throw new Error("fixture");const cuota="1."+"1".repeat(79);const m={...magnitudes(),cuotaAutonomica:new Decimal(cuota)};const r=aplicarDeduccionesTerritoriales2025({solicitudes:[solicitudE38(c.hechos)]},m);expect(r.total).toEqual(racional(String(BigInt(cuota.replace(".",""))*3n),String(10n**80n)))})
 it("magnitudes y contexto fiscales externos no son campos de la solicitud",()=>{for(const key of ["magnitudes","magnitudesMotor","contexto","cuotaIntegraAutonomica","baseGeneral"]){const h={...n1.hechos};Object.assign(h,{[key]:"0"});expect(()=>Schema.decodeUnknownSync(SolicitudE38Anual2025)({...n1,hechos:h},{onExcessProperty:"error"})).toThrow()}})
 it("salto de renta debe salir de base anual, no de bandera del solicitante",()=>{const c=casos.find(x=>x.hechos.codigo==="rioja_internet_jovenes_emancipados");if(c===undefined)throw new Error("fixture");const s={solicitudes:[solicitudE38(c.hechos)]};expect(aplicarDeduccionesTerritoriales2025(s,{...magnitudes(),baseGeneral:new Decimal("18030")}).total).toEqual(racional("200"));expect(aplicarDeduccionesTerritoriales2025(s,{...magnitudes(),baseGeneral:new Decimal("18030.000000000000000001")}).total).toEqual(racional("0"))})
 it("código repetido y pago/factura repetido no consumen cuota dos veces",()=>{expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[n1,n1]},magnitudes())).toThrow(/duplicado/);const internet=casos.find(x=>x.hechos.codigo==="rioja_internet_jovenes_emancipados"),luz=casos.find(x=>x.hechos.codigo==="rioja_luz_gas_jovenes_emancipados");if(internet===undefined||luz===undefined)throw new Error("fixture");expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[solicitudE38(internet.hechos),solicitudE38(luz.hechos)]},{...magnitudes(),baseGeneral:new Decimal("15000")})).toThrow(/duplicado/)})
 it("dos códigos con productores pendientes tras conectar las cuatro rutas riojanas se rechazan por nombre,sin importe",()=>{expect(Object.keys(PRODUCTORES_PENDIENTES_E38).sort()).toEqual(["galicia_ayudas_incendios_peifoga_2025", "galicia_libros_texto_material_escolar"]);for(const c of casos.filter(c=>c.hechos.codigo in PRODUCTORES_PENDIENTES_E38))expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[solicitudE38(c.hechos)]},magnitudes(c.contexto.territorio))).toThrow(new RegExp(c.hechos.codigo))})
})

describe("Familia,pagos,periodos y productores de arrastre",()=>{
 function conHijo():MagnitudesTerritorialesAnuales{
  const derechos:DerechosMinimosAnuales={ejercicio:2025,territorio:"galicia",regimen:"comun",modalidad:"individual",devengo:"2025-12-31",contribuyenteId:"s-1",edadContribuyenteDevengo:35,discapacidadContribuyente:{_tag:"SinDiscapacidad"},ascendientes:"ninguno",fallecimientosEnElEjercicio:"ninguno",descendientesCompletos:true,descendientes:[{sujetoId:"s-2",fechaNacimiento:"2025-02-01",edadDevengo:0,vivoAlDevengo:true,rentasNoExentasCentimos:0,declaracion:{modalidad:"no-presenta"},discapacidad:{_tag:"SinDiscapacidad"},titularesCompletos:true,titulares:[{titularId:"s-1",grado:1,vinculo:{clase:"consanguinidad"},relacion:"convivencia",custodia:"exclusiva",alimentosJudiciales:false,aplicaEspecialidadAlimentos:false,residenteIrpf:true,rentasNoExentasCentimos:2000000}]}]}
  const m=magnitudes("galicia");return{...m,caso:{...m.caso,contribuyenteId:"s-1",derechosMinimos:derechos},sujetosConMinimo:["s-2"],atribucionesMinimo:[{sujetoId:"s-2",titulares:["s-1"]}]}
 }
 function nacimiento(){return {censoHijosPorProgenitor:[{progenitor:"s-1",exhaustividad:"completo",hijos:[{id:"s-2",nacimiento:"2025-02-01",fechaVinculo:"2025-02-01",prioridadRegistro:1,soporte:{referencia:"RN",fecha:"2025-02-02",emisor:"ORG"}}]}],lote:"E38",nacimientoContribuyente:"1990-01-01",exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:[],hechos:{codigo:"galicia_nacimiento_adopcion_hijos",eventos:[{id:"N",fecha:"2025-02-01",tipo:"nacimiento",hijos:[{persona:{id:"s-2",nacimiento:"2025-02-01",discapacidad:0},titularesMinimo:["s-1"],convivientes:["s-1"]}],progenitores:["s-1"],soporte:{referencia:"RN",fecha:"2025-02-02",emisor:"ORG"}}],municipioGallego:{habitantes:6000,fusionIncorporacion:null}}} as const}
 it("titular y nacido conciliados con la anual,no con una referencia genérica",()=>{const s=nacimiento();expect(aplicarDeduccionesTerritoriales2025({solicitudes:[s]},conHijo()).total).toEqual(racional("360"));const hijo=s.hechos.eventos[0].hijos[0];const falso={...s,hechos:{...s.hechos,eventos:[{...s.hechos.eventos[0],hijos:[{...hijo,titularesMinimo:["s-1","s-3"]}]}]}};expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[falso]},conHijo())).toThrow(/Titulares/)} )
 it("hijo ajeno,discapacidad y fecha contradictorias se rechazan",()=>{const s=nacimiento();for(const cambio of [{id:"s-9"},{nacimiento:"2025-02-02"},{discapacidad:65}]){const falso={...s,hechos:{...s.hechos,eventos:[{...s.hechos.eventos[0],hijos:[{...s.hechos.eventos[0].hijos[0],persona:{...s.hechos.eventos[0].hijos[0].persona,...cambio}}]}]}};expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[falso]},conHijo())).toThrow()}})
 it("ordinal se deriva de censo físico;no acepta número fiscal,omisión ni fechas imposibles",()=>{
  const s=nacimiento();const hijo=s.hechos.eventos[0].hijos[0]
  const externo={...s,hechos:{...s.hechos,eventos:[{...s.hechos.eventos[0],hijos:[{...hijo,ordenPorProgenitor:[{titular:"s-1",orden:99}]}]}]}}
  expect(()=>Schema.decodeUnknownSync(SolicitudE38Anual2025)(externo,{onExcessProperty:"error"})).toThrow()
  expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[{...s,censoHijosPorProgenitor:[]}]},conHijo())).toThrow(/censo|Censo/)
  for(const cambio of [{id:"s-1"},{nacimiento:"1980-01-01"},{fechaVinculo:"2025-02-02"},{soporte:{referencia:"",fecha:"2025-02-02",emisor:"ORG"}}]){
   const censo=s.censoHijosPorProgenitor[0]
   expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[{...s,censoHijosPorProgenitor:[{...censo,hijos:[{...censo.hijos[0],...cambio}]}]}]},conHijo())).toThrow()
  }
 })
 it("censo previo completo deriva segundo hijo por fecha,sin sumar ordinal externo",()=>{
  const s=nacimiento(),censo=s.censoHijosPorProgenitor[0]
  const hijos=[{id:"s-4",nacimiento:"2010-01-01",fechaVinculo:"2010-01-01",prioridadRegistro:1,soporte:{referencia:"R0",fecha:"2010-01-02",emisor:"ORG"}},...censo.hijos]
  const r=aplicarDeduccionesTerritoriales2025({solicitudes:[{...s,censoHijosPorProgenitor:[{...censo,hijos}]}]},conHijo())
  expect(r.aplicaciones[0].generado).toEqual(racional("1200"));expect(r.total).toEqual(racional("1000"))
 })
 it("base imponible con signo y liquidable no son intercambiables",()=>{
  const m=conHijo(),s={solicitudes:[nacimiento()]}
  const exacta=aplicarDeduccionesTerritoriales2025(s,{...m,basesImponiblesE38:{general:new Decimal("27550"),ahorro:new Decimal(0)},baseGeneral:new Decimal("10000")})
  const superior=aplicarDeduccionesTerritoriales2025(s,{...m,basesImponiblesE38:{general:new Decimal("27550.0000000000000000001"),ahorro:new Decimal(0)},baseGeneral:new Decimal("10000")})
  expect(exacta.aplicaciones[0].generado).toEqual(racional("360"));expect(superior.aplicaciones[0].generado).toEqual(racional("300"))
  const {basesImponiblesE38:sinProductor,...sinBI}=m
  expect(sinProductor).toBeDefined();expect(()=>aplicarDeduccionesTerritoriales2025(s,sinBI)).toThrow(/bases imponibles/)
 })
 it("cuidados: expediente común2000 antes del reparto;máximo400 compartido da200",()=>{
  const m=conHijo(),d=m.caso.derechosMinimos;if(d===undefined)throw new Error("derechos")
  const f=d.descendientes[0],t=f.titulares[0]
  const familiar={...m,caso:{...m.caso,derechosMinimos:{...d,descendientes:[{...f,fechaNacimiento:"2023-02-01",edadDevengo:2,titulares:[{...t,custodia:"compartida" as const},{...t,titularId:"s-3",custodia:"compartida" as const}]}]}},atribucionesMinimo:[{sujetoId:"s-2",titulares:["s-1","s-3"]}]}
  const x={...cuidado,persona:{id:"s-2",nacimiento:"2023-02-01",discapacidad:0},titularesMinimo:["s-1","s-3"],convivientes:["s-1","s-3"],titularesDeduccion:["s-1","s-3"],progenitores:cuidado.progenitores.map((p,i)=>({...p,id:i===0?"s-1":"s-3"})),pagos:[pago("asistencia","1000","P1","s-1"),pago("asistencia","1000","P2","s-3")]}
  const s=solicitudE38({codigo:"galicia_cuidado_hijos_menores",hijos:[x],municipio:"X",trasladoResidencia:"2025-01-01",residencia:{desde:"2025-01-01",hasta:"2025-12-31"}})
  expect(aplicarDeduccionesTerritoriales2025({solicitudes:[s]},familiar).total).toEqual(racional("200"))
  for(const hijos of [[{...x,titularesDeduccion:["s-1"]}],[{...x,pagos:[...x.pagos,{...x.pagos[0],id:"P3",factura:"FP3",pagador:"TERCERO"}]}],[{...x,pagos:[x.pagos[0],x.pagos[0]]}]]){
   const falso={...s,hechos:{codigo:"galicia_cuidado_hijos_menores" as const,hijos,municipio:"X",trasladoResidencia:"2025-01-01",residencia:{desde:"2025-01-01",hasta:"2025-12-31"}}}
   expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[falso]},familiar)).toThrow()
  }
 })
 it("ambas API concilian familia y no convierten un hijo ajeno en cero",()=>{
  const m=conHijo(),d=m.caso.derechosMinimos;if(d===undefined)throw new Error("derechos")
  const b=canonico("galicia"),renta=Effect.runSync(liquidarIrpfAnual(b,{modo:"canonico"})).rendimientoNetoTrabajoCentimos
  const derechos=(r:number):DerechosMinimosAnuales=>({...d,conciliacionRentasContribuyente:{perfil:"caso-anual-parcial",otrasRentasOGastosNoRepresentados:"ninguno"},descendientes:d.descendientes.map(f=>({...f,titulares:f.titulares.map(t=>({...t,rentasNoExentasCentimos:r}))}))})
  const s={solicitudes:[nacimiento()]}
  const c={...b,contribuyenteId:"s-1",derechosMinimos:derechos(renta),deduccionesTerritoriales2025:s}
  const e={...efectivo(s),comunidadAutonoma:"galicia" as const,contribuyenteId:"s-1",familiaresConDerechoMinimo:"segun-derechos" as const,derechosMinimos:derechos(2800000)}
  expect(Effect.runSync(liquidarIrpfAnual(c,{modo:"canonico"})).deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional("360"))
  expect(Effect.runSync(liquidarIrpfAnualExplicito(e)).deduccionesTerritoriales2025?.aplicaciones[0].generado).toEqual(racional("360"))
  const ajeno={solicitudes:[{...nacimiento(),hechos:{...nacimiento().hechos,eventos:[{...nacimiento().hechos.eventos[0],progenitores:["s-9"]}]}}]}
  expect(Effect.runSync(Effect.flip(liquidarIrpfAnual({...c,deduccionesTerritoriales2025:ajeno},{modo:"canonico"})))._tag).toBe("ResultadoNoSoportado")
  expect(Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito({...e,deduccionesTerritoriales2025:ajeno})))._tag).toBe("ResultadoNoSoportado")
 })
 it("un tercero no se habilita renombrando solo el contexto anual",()=>{const c=casos.find(x=>x.hechos.codigo==="rioja_arrendamiento_menores_36");if(c===undefined||c.hechos.codigo!=="rioja_arrendamiento_menores_36")throw new Error("fixture");const s=solicitudE38({...c.hechos,contratos:c.hechos.contratos.map(c=>({...c,pagos:c.pagos.map(p=>({...p,pagador:"EXTERNO"}))}))});expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[s]},{...magnitudes(),baseGeneral:new Decimal("15000")})).toThrow(/atribución|Pagador/)} )
 it("pago al acabar ocupación sigue admitido;posterior carece de periodo representado",()=>{const c=casos.find(x=>x.hechos.codigo==="rioja_arrendamiento_menores_36");if(c===undefined||c.hechos.codigo!=="rioja_arrendamiento_menores_36")throw new Error("fixture");for(const fecha of ["2025-08-01","2025-08-02"]){const s=solicitudE38({...c.hechos,contratos:c.hechos.contratos.map(c=>({...c,ocupacion:{desde:"2025-01-01",hasta:"2025-08-01"},pagos:c.pagos.map(p=>({...p,fecha}))}))});if(fecha==="2025-08-01")expect(aplicarDeduccionesTerritoriales2025({solicitudes:[s]},{...magnitudes(),baseGeneral:new Decimal("15000")}).total).toEqual(racional("100"));else expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[s]},{...magnitudes(),baseGeneral:new Decimal("15000")})).toThrow(/periodo|ocupación/)} })
 it("actividad agraria genera cuota pendiente hasta2028 sin recibir saldo fiscal",()=>{const c=casos.find(x=>x.hechos.codigo==="rioja_fijacion_poblacion_ocupada_medio_rural");if(c===undefined)throw new Error("fixture");const s={solicitudes:[solicitudE38(c.hechos)]};const r=aplicarDeduccionesTerritoriales2025(s,{...magnitudes(),cuotaAutonomica:new Decimal("20.079")});expect(r.total).toEqual(racional("20.079"));expect(r.saldosE38).toContainEqual(expect.objectContaining({codigo:c.hechos.codigo,tipo:"cuota",origen:2025,caduca:2028,importe:racional("979.921")}))})
 it("la generación agraria va última antes del consumo compartido",()=>{const c=casos.find(x=>x.hechos.codigo==="rioja_fijacion_poblacion_ocupada_medio_rural");if(c===undefined)throw new Error("fixture");expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[solicitudE38(c.hechos),n1]},magnitudes())).toThrow(/último/);const r=aplicarDeduccionesTerritoriales2025({solicitudes:[n1,solicitudE38(c.hechos)]},{...magnitudes(),cuotaAutonomica:new Decimal("200")});expect(r.total).toEqual(racional("200"));expect(r.aplicaciones[1].aplicado).toEqual(racional("50"));expect(r.saldosE38?.[0].importe).toEqual(racional("950"))})
 it("renovables/eficiencia se rechazan antes de sumar,sin confiar en elección del llamador",()=>{const a=casos.find(x=>x.hechos.codigo==="galicia_climatizacion_agua_caliente_renovables"),b=casos.find(x=>x.hechos.codigo==="galicia_obras_eficiencia_energetica");if(a===undefined||b===undefined)throw new Error("fixture");expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[solicitudE38(a.hechos),solicitudE38(b.hechos)]},magnitudes("galicia"))).toThrow(/incompatibles/)})
})

describe("E38: adquisiciones y porcentajes económicos",()=>{
 it("no habilita pago de tercero en vehículo por coincidir propietario",()=>{
  if(n1.hechos.codigo!==codigoN1)throw new Error("fixture")
  const h={...n1.hechos,vehiculos:n1.hechos.vehiculos.map(v=>({...v,pagos:v.pagos.map(p=>({...p,pagador:"TERCERO"}))}))}
  expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[{...n1,hechos:h}]},magnitudes())).toThrow(/pagador ajeno/)
 })
 it("porcentaje propio mayor que familiar se rechaza;frontera familiar40 y40+epsilon",()=>{
  const c=casos.find(x=>x.hechos.codigo==="galicia_inversion_entidades_nuevas_reciente_creacion")
  if(c===undefined||c.hechos.codigo!=="galicia_inversion_entidades_nuevas_reciente_creacion")throw new Error("fixture")
  const hechos=c.hechos
  const probar=(propia:number,familiar:number)=>aplicarDeduccionesTerritoriales2025({solicitudes:[solicitudE38({...hechos,operaciones:hechos.operaciones.map(o=>({...o,participacionPropiaPorcentaje:propia,participacionFamiliarPorcentaje:familiar}))})]},magnitudes("galicia"))
  expect(()=>probar(41,40)).toThrow(/propia.familiar/)
  expect(probar(10,40).aplicaciones[0].generado).toEqual(racional("300"))
  expect(probar(10,40.000001).aplicaciones[0].generado).toEqual(racional("0"))
 })
 it("inventario de vivienda ajeno y duplicado rechaza antes de atribuir renta",()=>{
  for(const inversionesViviendaEjercicio of [[{id:"I",titular:"TERCERO",fecha:"2025-01-01",importe:"1",documento:"D"}],[{id:"I",titular:"A",fecha:"2025-01-01",importe:"1",documento:"D"},{id:"I",titular:"A",fecha:"2025-02-01",importe:"1",documento:"D2"}]])expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[{...n1,inversionesViviendaEjercicio}]},magnitudes())).toThrow(/Inventario/)
 })
})

it("tope de inversión personal6000 después de agregar operaciones propias,sin reparto familiar",()=>{
 const c=casos.find(x=>x.hechos.codigo==="galicia_inversion_entidades_nuevas_reciente_creacion")
 if(c===undefined||c.hechos.codigo!=="galicia_inversion_entidades_nuevas_reciente_creacion")throw new Error("fixture")
 const fuente=c.hechos
 const hechos={...fuente,operaciones:["O1","O2"].map((id,i)=>({...fuente.operaciones[0],id,pagos:[pago("inversion","20000","PI"+i,"A","E")]}))}
 const r=aplicarDeduccionesTerritoriales2025({solicitudes:[solicitudE38(hechos)]},{...magnitudes("galicia"),cuotaAutonomica:new Decimal("10000")})
 expect(r.aplicaciones[0].generado).toEqual(racional("6000"));expect(r.total).toEqual(racional("6000"))
})
it("código desconocido se rechaza antes del cálculo,no genera impuesto cero",()=>{
 const hechos={...n1.hechos};Object.assign(hechos,{codigo:"rioja_desconocido"})
 expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[{...n1,hechos}]},magnitudes())).toThrow(/inválidos|externas/)
})
