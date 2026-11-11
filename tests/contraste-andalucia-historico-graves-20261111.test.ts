// Contraste GRANT0: ejecutar desde tests/ en la raíz; sin helpers de autor ni ficheros externos.
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito as api } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { liquidarIrpfAnualExplicito as direct } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { CensoBasesFamiliares2025, producirEconomiaAjena2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
const D = Decimal.clone({ precision: 80 })
function rechazo<A,E>(programa: Effect.Effect<A,E>, causa: RegExp) {
  // Effect.result conserva defectos: un fallo de importación o throw no satisface esta prueba.
  const r = Effect.runSync(Effect.result(programa))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) {
    expect(r.failure).toEqual(expect.objectContaining({ _tag: "ResultadoNoSoportado", motivo: expect.stringMatching(causa) }))
  }
}
const codigo = "andalucia_ayuda_domestica"
function datos(importeCentimos = 250000, integro = "30000", mayores = false) {
  return { lote: "A40", codigo, nacimiento: "1985-01-01", hechos: {
    titularTGSS: "s-2", afiliacionAndalucia: "CCC-AND-2025", viviendaHabitual: "vivienda-habitual",
    personaPareja: "s-2", vinculoPareja: "conyuge", registroPareja: "registro-civil",
    nacimientoPareja: mayores ? "1950-12-31" : "1980-01-01",
    hijos: mayores ? [] : [{ persona: "s-3", nacimiento: "2017-01-01", clase: "descendiente",
      titulares: ["s-1", "s-2"], referenciaDerechos: "minimos2025", diasConvivencia: 365,
      discapacidad: 0, asistencia: "sin-incremento" }],
    empleado: "empleada-1", cuotas: [{ id: "pago-cuota", fecha: "2025-06-01", pagador: "s-2",
      importeCentimos, medio: "transferencia", justificante: "TGSS-cuota-empleador", regimen: "personal", conyuges: [] }], eleccionBeneficiario: "s-1",
    parejaOrdinaria: { contribuyente: "s-1", persona: "s-2", administracionRegistro: "civil",
      desde: "2010-01-01", residenteComunTodo2025: true, vivoTodo2025: true,
      declaracion: { persona: "s-2", ejercicio: 2025, modalidad: "individual", soporte: "declaracion2025" },
      economia: { perfil: "solo-trabajo", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno",
        trabajo: { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro,
          cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" } })) } },
      eleccion: { titulares: ["s-1", "s-2"], beneficiario: "s-1", otraPersonaNoAplica: true, soporte: "eleccion-exclusiva2025" },
    },
  } }
}
function solicitud(d: ReturnType<typeof datos>) {
  return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [d] }, { onExcessProperty: "error" })
}
function casos(d: ReturnType<typeof datos>, propio = 30000) {
  const mayores = d.hechos.hijos.length === 0
  // Fraction: propio analítico 30000 - 1944 - 2000; explícito sin SS 30000 - 2000.
  // Renta ajena art19: max(0, íntegro - 2000), antes de art20.
  const ajena = Decimal.max(0, new Decimal(d.hechos.parejaOrdinaria.economia.trabajo.rendimientos[0]!.integro).minus(2000)).times(100).toNumber()
  const minimos = (propia: number) => ({ ...derechos, territorio: "andalucia" as const,
    descendientes: derechos.descendientes.map(h => ({ ...h, titulares: h.titulares.map(t => ({ ...t,
      rentasNoExentasCentimos: t.titularId === "s-1" ? propia : ajena })) })) })
  const a = { ...analitico, contribuyenteId: "s-1", comunidadAutonoma: "andalucia" as const,
    rendimientos: { trabajo: [{ importeIntegroCentimos: propio * 100 }] } }
  const e = { ...efectivo, contribuyenteId: "s-1", comunidadAutonoma: "andalucia" as const,
    familiaresConDerechoMinimo: mayores ? "ninguno" as const : "segun-derechos" as const,
    trabajo: { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro: String(propio),
      cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" } })) } }
  if (!mayores) { a.derechosMinimos = minimos(2605600); e.derechosMinimos = minimos(2800000) }
  return { a, e }
}

type EconomiaDePrueba = ReturnType<typeof datos>["hechos"]["parejaOrdinaria"]["economia"] | Schema.Json
function censo(d: ReturnType<typeof datos>, economia: EconomiaDePrueba = d.hechos.parejaOrdinaria.economia,
  modalidad: "individual" | "no-presenta" | undefined = "individual") {
  return Schema.decodeUnknownSync(CensoBasesFamiliares2025)({
    referencia:"contraste-grave-art19", ejercicio:2025, devengo:"2025-12-31", contribuyente:"s-1",
    estadoCivil:"casado-no-separado", conyuge:"s-2", censoCompleto:true, hijosCompletos:true,
    hijos:[{id:"s-3",nacimiento:"2017-01-01",progenitores:["s-1","s-2"],conviveCon:["s-1","s-2"],independienteConConsentimiento:false,apoyoJudicial:"ninguno",soporte:"registro"}],
    personas:["s-1","s-2","s-3"].map(id=>{const persona = {id,soporte:"identidad",residenteComunTodo2025:true,vivoTodo2025:true,
      residenciaAutonomica2025:{comunidad:"andalucia",desde:"2025-01-01",hasta:"2025-12-31",soporte:"padron"},
      declaracion2025:{modalidad:id==="s-2"?modalidad:id==="s-3"?"no-presenta":"individual",soporte:"declaracion"},
      economia:id==="s-1"?{perfil:"declarante-en-composicion"}:id==="s-2"?economia:{perfil:"sin-rentas",censoRentasCompleto:true}}
      if (id!=="s-2" || modalidad!==undefined) return persona
      const {declaracion2025,...sinDeclaracion}=persona;expect(declaracion2025.modalidad).toBeUndefined();return sinDeclaracion
    }),
  },{onExcessProperty:"error"})
}
function rutas(d: ReturnType<typeof datos>, libro?: CensoBasesFamiliares2025) {
  const {a,e}=casos(d), s=solicitud(d)
  return [
    liquidarIrpfAnual({...a,basesFamiliares2025:libro,deduccionesTerritoriales2025:s},{modo:"canonico"}),
    api({...e,basesFamiliares2025:libro,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s}),
  ] as const
}
function acepta500(d: ReturnType<typeof datos>, libro?: CensoBasesFamiliares2025) {
  // Ejecutar separadamente evita perder el canal de error de una API en la unión de tipos.
  const [a,e]=rutas(d,libro)
  expect(Effect.runSync(a).deduccionesTerritoriales2025?.total).toEqual({numeradorEuros:"500",divisor:"1"})
  expect(Effect.runSync(e).deduccionesTerritoriales2025?.total).toEqual({numeradorEuros:"500",divisor:"1"})
}
function rechazaAmbas(d: ReturnType<typeof datos>, libro: CensoBasesFamiliares2025 | undefined, causa: RegExp) {
  const [a,e]=rutas(d,libro); rechazo(a,causa); rechazo(e,causa)
}
function invertirClaves(value: Schema.Json): Schema.Json {
  if (Array.isArray(value)) return value.map(invertirClaves)
  if (Schema.is(Schema.Record(Schema.String, Schema.Json))(value)) return Object.fromEntries(Object.entries(value).reverse().map(([k,v])=>[k,invertirClaves(v)]))
  return value
}
it("A/control íntegro0.01 con base0 en ambas API, con/sin censo",()=>{
  const d=datos(250000,"0.01")
  const base=producirEconomiaAjena2025(censo(d).personas[1]!.economia,false)
  expect(base.general.isZero()).toBe(true);expect(base.ahorro.isZero()).toBe(true)
  acepta500(d);acepta500(d,censo(d))
})
it("A/objeción economía sin-rentas frente a íntegro0.01, ambas bases0",()=>{
  const d=datos(250000,"0.01")
  rechazaAmbas(d,censo(d,{perfil:"sin-rentas",censoRentasCompleto:true}),/art19: economía.*censo/)
})
for(const [sol,libro] of [["individual","no-presenta"],["no-presenta","individual"]] as const)
  it(`A/objeción modalidad ${sol} frente a ${libro}`,()=>{
    const d=datos(250000,"0.01");d.hechos.parejaOrdinaria.declaracion.modalidad=sol
    rechazaAmbas(d,censo(d,d.hechos.parejaOrdinaria.economia,libro),/art19: declaración.*censo/)
  })
it("A/control igualdad estructural con orden de claves distinto",()=>{
  const d=datos(250000,"0.01"), economia=invertirClaves(Schema.decodeUnknownSync(Schema.Json)(d.hechos.parejaOrdinaria.economia))
  expect(JSON.stringify(economia)).not.toBe(JSON.stringify(d.hechos.parejaOrdinaria.economia))
  acepta500(d,censo(d,economia))
})
for(const modalidad of ["individual","no-presenta"] as const)
  it(`A/control modalidad coherente y ausente: ${modalidad}`,()=>{
    const d=datos(250000,"0.01");d.hechos.parejaOrdinaria.declaracion.modalidad=modalidad
    acepta500(d,censo(d,d.hechos.parejaOrdinaria.economia,modalidad))
    // undefined explícito se aplica después: el argumento opcional de censo tiene default.
    const c=censo(d); const sinDeclaracion={...c,personas:c.personas.map(p=>{
      if(p.id!=="s-2") return p
      const {declaracion2025,...resto}=p; expect(declaracion2025).toBeDefined();return resto
    })}
    acepta500(d,sinDeclaracion)
  })
it("A/control cero coherente y sin-rentas coherente rechazan por vía hijos, no por conciliación",()=>{
  const d=datos(250000,"0")
  rechazaAmbas(d,censo(d),/Vía hijos requiere/)
  const primero=d
  // Mutación intencionada en la frontera runtime, seguida de decode estricto de esquema.
  const sinRentas=Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes:[{
    ...primero,hechos:{...primero.hechos,parejaOrdinaria:{...d.hechos.parejaOrdinaria,economia:{perfil:"sin-rentas",censoRentasCompleto:true}}},
  }]},{onExcessProperty:"error"})
  const {a,e}=casos(d), c=censo(d,{perfil:"sin-rentas",censoRentasCompleto:true})
  rechazo(liquidarIrpfAnual({...a,basesFamiliares2025:c,deduccionesTerritoriales2025:sinRentas},{modo:"canonico"}),/Vía hijos requiere/)
  rechazo(api({...e,basesFamiliares2025:c,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:sinRentas}),/Vía hijos requiere/)
})
it("A/control censo sin cónyuge rechaza de forma tipada antes del importe",()=>{
  const d=datos(250000,"0.01"), c=censo(d)
  rechazaAmbas(d,{...c,personas:c.personas.filter(p=>p.id!=="s-2")},/falta identidad económica del cónyuge/)
})
const raw = (year: number, gross: string, age = year - 1985) => ({
  ejercicio: year, comunidadAutonoma: "madrid", edad: age, modalidad: "individual",
  residenciaTodoElAnio: true, devengo: `${year}-12-31`, otrasRentas: "ninguna",
  familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna",
  saldosAnteriores: "ninguno", deducciones: "ninguna", rentasExtranjeras: "ninguna",
  especialidades: "ninguna", perfil: "solo-trabajo",
  trabajo: { ejercicio: year, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna",
    rendimientos: [{ id: "review-independent", clase: "empleo-laboral", integro: gross,
      cotizaciones: { clase: "efectivas", seguridadSocial: "1000", derechosPasivos: "0", colegiosHuerfanos: "0" },
      sindicato: { importe: "0", satisfecho: "no" },
      colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" },
      defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] },
  conciliacion: { ejercicio: year, estado: "totales-anuales-sin-duplicados", procedencia: ["review:synthetic-explicit-negatives"] },
  retenciones: [{ operacionId: "review-payment", procedencia: "review:synthetic", ejercicio: year, importe: "100", efectiva: true }],
})
type EntradaTestigo = ReturnType<typeof raw>
const decode = (value: EntradaTestigo) => Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(value, { onExcessProperty: "error" })
const input = (year: number, gross: string, age = year - 1985) => decode(raw(year, gross, age))
const composition = (gross="29846.30",base="26846.30"):EntradaComposicionAnual => ({
  ambito:{anio:2020,comunidadAutonoma:"madrid",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},
  cotizaciones:{naturaleza:"efectivas",trabajador:new D(1000)},rentasTrabajoAnuales:{integroTrabajo:new D(gross),restoRentas:new D(0)},
  origenBaseGeneralB:"solo-trabajo",precision:80,politica:"open-etapas-empleo-madrid-2020-2022",hechosOpen2020A2022:input(2020,gross),
  baseGeneral:new D(base),baseAhorro:new D(0),rentasAntesReducciones:new D(gross).minus(3000),minimosEstatales:MINIMOS_ESTATALES_2025,deduccionesAutonomicasCentimos:0,
})

function historico(year: 2020|2021|2022, gross="29846.30", base="26846.30"): EntradaComposicionAnual {
  const c=composition(gross,base)
  return {...c,ambito:{...c.ambito,anio:year,situacionFamiliar:{...c.ambito.situacionFamiliar,edad:year-1985}},hechosOpen2020A2022:input(year,gross)}
}
for(const year of [2020,2021,2022] as const) {
  const casosInvalidos: Array<[string,()=>EntradaComposicionAnual,RegExp]> = [
    ["base ajena",()=>historico(year,"29846.30","20000"),/base o mínimo estatal contradictorios/],
    ["reducción omitida",()=>historico(year,"17000.43","14000.43"),/base o mínimo estatal contradictorios/],
    ["base racional distinta",()=>historico(year,"17000.43","12763.57"),/base o mínimo estatal contradictorios/],
    ["mínimo6000",()=>({...historico(year),minimosEstatales:{...MINIMOS_ESTATALES_2025,contribuyente:{...MINIMOS_ESTATALES_2025.contribuyente,general:new D(6000)}}}),/base o mínimo estatal contradictorios/],
    ["actividad1",()=>({...historico(year),rentaActividadAnualB:new D(1)}),/fuera se rechaza esta política/],
  ]
  for(const [label,make,causa] of casosInvalidos) it(`B/${year}/objeción ${label}`,()=>rechazo(componerLiquidacionAnual(make()),causa))
  it(`B/${year}/control composición válida art20 y sin art20`,()=>{
    expect(Effect.runSync(componerLiquidacionAnual(historico(year))).cuotaIntegraGeneralEstatal.toFixed()).toBe("3109.69")
    expect(Effect.runSync(componerLiquidacionAnual(historico(year,"17000.43","12763.58"))).cuotaIntegraGeneralEstatal.toFixed()).toBe("1220.38")
  })
  it(`B/${year}/testigos originales con precisión global5`,()=>{
    const previa=Decimal.precision
    try {
      Decimal.set({precision:5})
      // Importes originales conservados, no calculados con productor o fórmula de la guarda.
      for(const [gross,base,estatal,reduccion] of [
        ["17000.43","12763.58","1220.38","1236.85"],
        ["29846.30","26846.30","3109.69","0"],
        ["38116.90","35116.90","4350.29","0"],
      ] as const) {
        const i=input(year,gross),r=Effect.runSync(api(i));expect(Effect.runSync(direct(i))).toEqual(r)
        expect(new D(r.baseLiquidableGeneral).eq(base)).toBe(true)
        expect(new D(r.componentesCuota.gravamenEstatal).eq(estatal)).toBe(true)
        expect(new D(r.reduccionArt20).eq(reduccion)).toBe(true)
        expect(Effect.runSync(componerLiquidacionAnual(historico(year,gross,base))).cuotaIntegraGeneralEstatal.eq(estatal)).toBe(true)
      }
      expect(Decimal.precision).toBe(5)
    } finally { Decimal.set({precision:previa}) }
  })
}
