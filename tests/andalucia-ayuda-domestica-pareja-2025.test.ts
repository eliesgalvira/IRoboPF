import { Effect, Result, Schema } from "effect"
import Decimal from "decimal.js"
import { expect, it } from "vitest"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { consumirCuota, racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
function ejecutarOError<A, E>(programa: Effect.Effect<A, E>): A {
  const salida = Effect.runSync(Effect.result(programa))
  if (Result.isFailure(salida)) throw new Error(JSON.stringify(salida.failure))
  return salida.success
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
function deltas(d: ReturnType<typeof datos>, propio = 30000) {
  const { a, e } = casos(d, propio), s = solicitud(d)
  const ab = ejecutarOError(liquidarIrpfAnual(a, { modo: "canonico" }))
  const ap = ejecutarOError(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: s }, { modo: "canonico" }))
  const eb = ejecutarOError(liquidarIrpfAnualExplicito(e))
  const ep = ejecutarOError(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s }))
  expect(ep.baseLiquidableGeneral).toBe(eb.baseLiquidableGeneral)
  return [new Decimal(ab.cuotaLiquidaCentimos - ap.cuotaLiquidaCentimos).div(100).toFixed(), new Decimal(eb.cuotaLiquidaLegal).minus(ep.cuotaLiquidaLegal).toFixed()]
}
it.each([[249999,"499.998"],[250000,"500"],[250001,"500"]] as const)("ambas API límite cuota SS %s", (c, esperado) => {
  // La API analítica presenta céntimos; la explícita conserva fracciones de céntimo.
  const r = deltas(datos(c))
  expect(r).toEqual([new Decimal(esperado).toDecimalPlaces(2).toFixed(), esperado])
})
it.each(["0.01", "1799.99", "1800", "8000", "8000.01", "25000.01", "100000"])("ambas API rendimientos positivos sin umbrales art17/mínimos: %s", importe => {
  expect(deltas(datos(250000, importe))).toEqual(["500", "500"])
})
it("pareja inscrita en registro público análogo y declaración individual ordinaria", () => {
  const d = datos(); d.hechos.vinculoPareja = "pareja-inscrita"; d.hechos.parejaOrdinaria.administracionRegistro = "otra-administracion-publica"
  expect(deltas(d)).toEqual(["500", "500"])
})
it("beneficiario titular TGSS propio o pareja: elección íntegra, no mitad", () => {
  const d = datos(); d.hechos.titularTGSS = "s-1"; d.hechos.cuotas[0]!.pagador = "s-1"
  expect(deltas(d)).toEqual(["500", "500"])
})
it.each([0,16000])("ambas API cuota cero/escasa vía75 sin requisito laboral: %s", bruto => {
  const d = datos(250000,"0",true), r = deltas(d,bruto)
  if (bruto === 0) expect(r).toEqual(["0","0"])
  else {
    // Art20: 7302 - 1.75*(16000-14852) = 5293; base8707; (8707-5790)*9.5% = 277.115.
    expect(r[1]).toBe("277.12")
    expect(new Decimal(r[0]!).gte(0) && new Decimal(r[0]!).lt(500)).toBe(true)
  }
})
it.each([
  ["pareja sin rendimientos", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.economia.trabajo.rendimientos[0]!.integro = "0" }],
  ["identidad contradictoria", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.persona = "s-1" }],
  ["registro incompatible", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.administracionRegistro = "andalucia" }],
  ["vínculo parcial", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.desde = "2025-01-02" }],
  ["fecha imposible", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.desde = "2024-02-30" }],
  ["declaración ajena", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.declaracion.persona = "s-9" }],
  ["conjunta no representada", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.declaracion.modalidad = "conjunta" }],
  ["censo de elección incompleto", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.eleccion.titulares = ["s-1"] }],
  ["beneficiario contradictorio", (d: ReturnType<typeof datos>) => { d.hechos.parejaOrdinaria.eleccion.beneficiario = "s-2" }],
  ["74 años sin hijos", (d: ReturnType<typeof datos>) => { d.hechos.nacimientoPareja = "1951-01-01"; d.hechos.hijos = [] }],
] as const)("ambas API rechazo causal: %s", (_nombre, cambiar) => {
  const d = datos(); cambiar(d)
  const { a, e } = casos(d), s = solicitud(d)
  expect(() => ejecutarOError(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025:s }, {modo:"canonico"}))).toThrow()
  expect(() => ejecutarOError(liquidarIrpfAnualExplicito({ ...e, deducciones:"territoriales-por-hechos-y-da61", deduccionesTerritoriales2025:s }))).toThrow()
})
it.each([ { perfil:"actividad" }, { perfil:"declarante-en-composicion" },
  {perfil:"sin-rentas",censoRentasCompleto:true,baseGeneral:0} ])("ambas API rechazan economía fuera de contrato %j", economia => {
  const d=datos(), {a,e}=casos(d)
  const s={solicitudes:[{...d,hechos:{...d.hechos,parejaOrdinaria:{...d.hechos.parejaOrdinaria,economia}}}]}
  // SAFETY: hechos malformados intencionales para comprobar ambas fronteras públicas.
  expect(()=>ejecutarOError(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:s} as never,{modo:"canonico"}))).toThrow()
  // SAFETY: solicitud adversa sin decodificar para verificar el rechazo de la API.
  expect(()=>ejecutarOError(liquidarIrpfAnualExplicito({...e,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s} as never))).toThrow()
})
it("orden de solicitudes consume una sola cuota; ambas API", () => {
  const d=datos(250000,"30000",true), {a,e}=casos(d,16000)
  const defensa={lote:"A40",codigo:"andalucia_defensa_juridica_laboral",nacimiento:"1985-01-01",hechos:{procedimientos:[{
    id:"proceso",clase:"reclamacion-cantidades",expedienteJudicial:"litigio",pagos:[{
      id:"pago-defensa",fecha:"2025-06-01",pagador:"s-1",importeCentimos:20000,medio:"transferencia",justificante:"factura-defensa",regimen:"personal",conyuges:[]
    }]}]}}
  const correr=(solicitudes: unknown[])=>{
    const s=Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes},{onExcessProperty:"error"})
    return [ejecutarOError(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:s},{modo:"canonico"})).cuotaLiquidaCentimos,
      ejecutarOError(liquidarIrpfAnualExplicito({...e,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s})).cuotaLiquidaLegal]
  }
  expect(correr([d,defensa])).toEqual(correr([defensa,d]))
})
it("consumo racional independiente: 37/3, dos órdenes y cero", () => {
  for (const generadas of [[500,200],[200,500]]) {
    const c=consumirCuota(racional("37","3"),generadas.map(n=>racional(String(n))))
    expect(c.total).toEqual({numeradorEuros:"37",divisor:"3"})
    expect(c.disponible).toEqual({numeradorEuros:"0",divisor:"1"})
  }
  expect(consumirCuota(racional("0"),[racional("500")]).total).toEqual({numeradorEuros:"0",divisor:"1"})
})

it("pensión homogénea es rendimiento del trabajo; no se exige empleo activo art17", () => {
  const d=datos(); Object.assign(d.hechos.parejaOrdinaria.economia.trabajo, {rendimientos:d.hechos.parejaOrdinaria.economia.trabajo.rendimientos.map(r=>({...r,clase:"pension"}))})
  expect(deltas(d)).toEqual(["500","500"])
})
it("no presentación tampoco impide art19", () => {
  const d=datos();d.hechos.parejaOrdinaria.declaracion.modalidad="no-presenta"
  expect(deltas(d)).toEqual(["500","500"])
})

it("pareja sin hechos ordinarios sigue rechazada por ambas API", () => {
  const d=datos(),{a,e}=casos(d)
  const {parejaOrdinaria: omitida,...hechos}=d.hechos
  expect(omitida.persona).toBe("s-2")
  const s=Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes:[{...d,hechos}]},{onExcessProperty:"error"})
  expect(()=>ejecutarOError(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:s},{modo:"canonico"}))).toThrow(/art19|pareja/)
  expect(()=>ejecutarOError(liquidarIrpfAnualExplicito({...e,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s}))).toThrow(/art19|pareja/)
})

for (const api of ["analitica", "explicita"] as const) {
  for (const variante of ["coherente", "sin-rentas", "declaracion"] as const) {
    it(`R2 censo económico y declaración de pareja: ${api} ${variante}`, () => {
      const d=datos(250000,"0.01"), {a,e}=casos(d), p=d.hechos.parejaOrdinaria
      const basesFamiliares2025=Schema.decodeUnknownSync(CensoBasesFamiliares2025)({
        referencia:"censo-art19",ejercicio:2025,devengo:"2025-12-31",contribuyente:"s-1",
        estadoCivil:"casado-no-separado",conyuge:"s-2",censoCompleto:true,hijosCompletos:true,
        hijos:[{id:"s-3",nacimiento:"2017-01-01",progenitores:["s-1","s-2"],conviveCon:["s-1","s-2"],
          independienteConConsentimiento:false,apoyoJudicial:"ninguno",soporte:"registro-hijo"}],
        personas:["s-1","s-2","s-3"].map(id=>({id,soporte:"identidad-"+id,residenteComunTodo2025:true,vivoTodo2025:true,
          residenciaAutonomica2025:{comunidad:"andalucia",desde:"2025-01-01",hasta:"2025-12-31",soporte:"padron-"+id},
          declaracion2025:{modalidad:id==="s-3" || id==="s-2" && variante==="declaracion"?"no-presenta":"individual",soporte:"declaracion-"+id},
          economia:id==="s-1"?{perfil:"declarante-en-composicion"}:id==="s-2" && variante!=="sin-rentas"?p.economia:{perfil:"sin-rentas",censoRentasCompleto:true}})),
      })
      const s=solicitud(d)
      const ejecutar=()=>api==="analitica"
        ? ejecutarOError(liquidarIrpfAnual({...a,basesFamiliares2025,deduccionesTerritoriales2025:s},{modo:"canonico"})).deduccionesTerritoriales2025
        : ejecutarOError(liquidarIrpfAnualExplicito({...e,basesFamiliares2025,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s})).deduccionesTerritoriales2025
      if(variante==="coherente") expect(ejecutar()?.total).toEqual({numeradorEuros:"500",divisor:"1"})
      else expect(ejecutar).toThrow(/economía|declaración|censo/)
    })
  }
}
