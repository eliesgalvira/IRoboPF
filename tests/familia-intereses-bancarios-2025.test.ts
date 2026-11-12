import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { producirBasesFamiliares2025, producirEconomiaAjena2025, EconomiaPersonaFamiliar2025, type CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { producirInteresesBancarios2025, type InteresesBancariosFamilia2025 } from "../lib/dominio/irpf/bases-familiares-2025/intereses-bancarios"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import oraculos from "./familia-intereses-bancarios-2025.oraculos.json"

const D = Decimal.clone({ precision: 80 })
type Mutable<T> = T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T
function intereses(importe = "1000", sujeto = "s-2"): Mutable<typeof InteresesBancariosFamilia2025.Type> {
  return { referencia: "certificado-anual", sujetoId: sujeto, ejercicio: 2025, censoCuentasCompleto: true,
    cuentas: [{ id: "cuenta-" + sujeto, titularId: sujeto, entidad: "banco-1", soporteTitularidad: "contrato-cuenta",
      titularidad: "privativa-exclusiva", producto: "cuenta", entidadResidenteEspana: true, establecimientoEnEspana: true,
      vinculacion: "no-vinculada", litigio: "ninguno", retribucion: "dineraria", liquidacionesCompletas: true,
      liquidaciones: [{ id: "intereses-anuales-" + sujeto, fechaExigibilidad: "2025-12-31", fechaAbono: "2025-12-31", soporte: "extracto",
        integroEUR: importe, retencionEUR: new D(importe).times("0.19").toFixed(2) }] }] }
}
function economia(importe = "1000", sujeto = "s-2") {
  return { perfil: "solo-intereses-bancarios", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno", interesesBancarios2025: intereses(importe, sujeto) } as const
}
function trabajo(bruto: string) {
  return { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro: bruto,
    cotizaciones: { ...r.cotizaciones, seguridadSocial: "1000" } })) }
}
function casos(territorio: "madrid" | "comunitat-valenciana", importe = "1000") {
  const c: Mutable<CensoBasesFamiliares2025> = { referencia: "familia", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1",
    estadoCivil: "casado-no-separado", conyuge: "s-2", censoCompleto: true, hijosCompletos: true,
    hijos: ["s-3", "s-4"].map(id => ({ id, nacimiento: "2017-01-01", progenitores: ["s-1", "s-2"], conviveCon: ["s-1", "s-2"],
      independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "filiacion" })),
    personas: ["s-1", "s-2", "s-3", "s-4"].map(id => ({ id, soporte: "censo", residenteComunTodo2025: true, vivoTodo2025: true,
      economia: id === "s-1" ? { perfil: "declarante-en-composicion" } : id === "s-2" ? economia(importe) : { perfil: "sin-rentas", censoRentasCompleto: true } })) }
  const ds = ["s-3", "s-4"].map(sujetoId => ({ ...derechos.descendientes[0]!, sujetoId,
    titulares: derechos.descendientes[0]!.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === "s-1" ? 2605600 : new D(importe).times(100).toNumber() })) }))
  const d = { ...derechos, territorio, descendientes: ds }
  const a = { ...analitico, comunidadAutonoma: territorio, contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: c }
  const e = { ...efectivo, comunidadAutonoma: territorio, contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: c, familiaresConDerechoMinimo: "segun-derechos" } as const
  return { c, d, a, e }
}

it.each(oraculos)("Fraction art20 y ahorro %s", row => {
  const e = { ...economia(row.ahorro), perfil: "trabajo-e-intereses-bancarios", trabajo: trabajo(row.bruto) } as const
  for (const madrid of [false, true]) {
    const b = producirEconomiaAjena2025(e, madrid)
    expect(b.general.toFixed()).toBe(row.general)
    expect(b.ahorro.toFixed()).toBe(row.ahorro)
    expect(b.rentaAntesReducciones!.toFixed()).toBe(row.renta)
  }
})
it("el ahorro no pierde retenciones ni recibe los 2000 de gasto laboral", () => {
  const b = producirEconomiaAjena2025(economia("8000"), true)
  expect(b.general.toFixed()).toBe("0")
  expect(b.ahorro.toFixed()).toBe("8000")
  expect(b.rentaAntesReducciones!.toFixed()).toBe("8000")
})
it("varias liquidaciones y cuentas se agregan una vez y sin depender del orden", () => {
  const c = intereses("10.01"), cuenta = c.cuentas[0]!
  c.cuentas.push({ ...cuenta, id: "cuenta-2", liquidaciones: [{ ...cuenta.liquidaciones[0]!, id: "intereses-2", integroEUR: "20.02", retencionEUR: "0" }] })
  cuenta.liquidaciones.push({ ...cuenta.liquidaciones[0]!, id: "intereses-3", integroEUR: "30.03", retencionEUR: "0" })
  expect(producirInteresesBancarios2025(c).toFixed()).toBe("60.06")
  c.cuentas.reverse(); cuenta.liquidaciones.reverse()
  expect(producirInteresesBancarios2025(c).toFixed()).toBe("60.06")
})
it("los contratos de otros consumidores no incorporan ahorro implícitamente", () => {
  expect(Schema.decodeUnknownResult(EconomiaPersonaFamiliar2025)(economia())._tag).toBe("Failure")
})
for (const territorio of ["madrid", "comunitat-valenciana"] as const) {
  it(`${territorio} PRE positivo ambas API y cuota propia intacta`, () => {
    const { a, e } = casos(territorio)
    const ra = Effect.runSync(liquidarIrpfAnual(a, { modo: "canonico" }))
    const re = Effect.runSync(liquidarIrpfAnualExplicito(e))
    const control = casos(territorio)
    control.c.personas[1]!.economia = { perfil: "sin-rentas", censoRentasCompleto: true }
    for (const d of control.d.descendientes) d.titulares[1]!.rentasNoExentasCentimos = 0
    expect(ra.cuotaLiquidaCentimos).toBe(Effect.runSync(liquidarIrpfAnual(control.a, { modo: "canonico" })).cuotaLiquidaCentimos)
    expect(re.cuotaLiquidaLegal).toBe(Effect.runSync(liquidarIrpfAnualExplicito(control.e)).cuotaLiquidaLegal)
    expect(re.baseLiquidableGeneral).toBe("26056")
  })
  for (const causa of ["titular", "persona", "cuenta-duplicada", "liquidacion-duplicada", "exigibilidad", "abono", "fecha-invalida", "abono-anterior", "retencion", "negativo", "cero", "subcentimo", "renta-minimos", "ajeno-declarante", "H2"] as const) {
    it(`${territorio} ambas API rechazan ${causa}`, () => {
      const { c, d, a, e } = casos(territorio)
      const ec = economia(), b = ec.interesesBancarios2025, q = b.cuentas[0]!, l = q.liquidaciones[0]!
      c.personas[1]!.economia = ec
      if (causa === "titular") q.titularId = "s-99"
      if (causa === "persona") { b.sujetoId = "s-99"; q.titularId = "s-99" }
      if (causa === "cuenta-duplicada") b.cuentas.push(structuredClone(q))
      if (causa === "liquidacion-duplicada") q.liquidaciones.push(structuredClone(l))
      if (causa === "exigibilidad") l.fechaExigibilidad = "2024-12-31"
      if (causa === "abono") l.fechaAbono = "2026-01-01"
      if (causa === "fecha-invalida") l.fechaExigibilidad = "2025-02-30"
      if (causa === "abono-anterior") l.fechaAbono = "2025-01-01"
      if (causa === "retencion") l.retencionEUR = "1000.01"
      if (causa === "negativo") l.integroEUR = "-1000"
      if (causa === "cero") { l.integroEUR = "0"; l.retencionEUR = "0" }
      if (causa === "subcentimo") l.integroEUR = "1000.001"
      if (causa === "renta-minimos") d.descendientes[0]!.titulares[1]!.rentasNoExentasCentimos++
      if (causa === "ajeno-declarante") c.personas[0]!.economia = ec
      if (causa === "H2") c.personas[1]!.economia = { ...ec, perfil: "trabajo-e-intereses-bancarios", trabajo: { ...trabajo("10000"),
        discapacidadActiva: { grado: "65-o-mas", ayudaOMovilidadReducida: "no", acreditadaDuranteTodoElTrabajo: "si" } } }
      expect(Effect.runSync(Effect.result(liquidarIrpfAnual(a, { modo: "canonico" })))).toMatchObject({ _tag: "Failure" })
      expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))).toMatchObject({ _tag: "Failure" })
    })
  }
  for (const importe of ["1800", "1800.01", "8000", "8000.01"]) {
    it(`${territorio} concilia renta de descendiente ${importe} antes de reducciones`, () => {
      const { c, d, a, e } = casos(territorio)
      c.personas[2]!.economia = economia(importe, "s-3")
      d.descendientes[0]!.rentasNoExentasCentimos = new D(importe).times(100).toNumber()
      const libro = producirBasesFamiliares2025(c, a, { general: new D(26056), ahorro: new D(0) })
      expect(libro.bases.get("s-3")!.rentaAntesReducciones!.toFixed()).toBe(importe)
      expect(Effect.runSync(Effect.result(liquidarIrpfAnual(a, { modo: "canonico" })))).toMatchObject({ _tag: "Success" })
      expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))).toMatchObject({ _tag: "Success" })
      d.descendientes[0]!.rentasNoExentasCentimos--
      expect(() => producirBasesFamiliares2025(c, a, { general: new D(26056), ahorro: new D(0) })).toThrow("renta económica contradice mínimos")
    })
  }
}

const codigoValencia = "valenciana_dos_o_mas_descendientes"
const solicitudValencia = () => ({ ejercicio: 2025, territorio: "comunitat-valenciana", modalidad: "individual", devengo: "2025-12-31", contribuyente: "s-1", cantidades: [],
  solicitudes: [{ codigo: codigoValencia, eleccion: "aplicar", unidades: [{ id: "u", titulares: ["s-1"], fecha: "2025-12-31", numeros: {}, textos: {} }],
    referencias: [{ unidad: "u", sujetos: ["s-3", "s-4"], bienes: [], eventos: [], cantidades: [] }] }], ordenBase30: [], consignaciones: [], arrastres: [],
  ordenConsumo: [JSON.stringify([codigoValencia, 2025, "s-1"])], criterioOrden: "eleccion_experta" } as const)

for (const centimo of [0, 1]) {
  it(`Valencia ambas API incluyen ahorro en frontera30000 céntimo=${centimo}`, () => {
    const { a, e } = casos("comunitat-valenciana", new D(3944).plus(new D(centimo).div(100)).toFixed())
    const ra = Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesValencianas2025: solicitudValencia() }, { modo: "canonico" }))
    const re = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "valencianas-por-hechos-y-da61", deduccionesValencianas2025: solicitudValencia() }))
    expect(new D(ra.deduccionesValencianas2025!.totalAplicado!).gt(0)).toBe(centimo === 0)
    expect(new D(re.deduccionesValencianas2025!.totalAplicado!).gt(0)).toBe(centimo === 0)
  })
  it(`Madrid ambas API incluyen ahorro en frontera familiar céntimo=${centimo}`, () => {
    const { a, e } = casos("madrid", new D(97664).plus(new D(centimo).div(100)).toFixed())
    const f = { solicitudes: [{ lote: "F-ampliado", codigo: "madrid_condicion_familia_numerosa", hechos: {
      titulo: { categoria: "general", referencia: "titulo", efectos: "2025-01-01", titulares: ["s-1"] } } }] } as const
    const pre = Effect.runSync(liquidarIrpfAnual(a, { modo: "canonico" }))
    const post = Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: f }, { modo: "canonico" }))
    const preE = Effect.runSync(liquidarIrpfAnualExplicito(e))
    const postE = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: f }))
    expect(post.cuotaLiquidaCentimos < pre.cuotaLiquidaCentimos).toBe(centimo === 0)
    expect(new D(postE.cuotaLiquidaLegal).lt(preE.cuotaLiquidaLegal)).toBe(centimo === 0)
  })
}
for (const territorio of ["madrid", "comunitat-valenciana"] as const) {
  it(`${territorio} PRE explícita reconoce intereses del familiar`, () => {
    const { e } = casos(territorio)
    expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))).toMatchObject({ _tag: "Success" })
  })
  for (const importe of ["1800", "1800.01"]) {
    it(`${territorio} declaración individual concilia frontera1800=${importe}`, () => {
      const { c, d, a, e } = casos(territorio)
      c.personas[2]!.economia = economia(importe, "s-3")
      c.personas[2]!.declaracion2025 = { modalidad: "individual", soporte: "presentacion" }
      const descendiente = { ...d.descendientes[0]!, rentasNoExentasCentimos: new D(importe).times(100).toNumber(),
        declaracion: { modalidad: "individual", rentasCentimos: new D(importe).times(100).toNumber() } as const }
      const derechos = { ...d, descendientes: [descendiente, d.descendientes[1]!] }
      expect(Effect.runSync(Effect.result(liquidarIrpfAnual({ ...a, derechosMinimos: derechos }, { modo: "canonico" })))).toMatchObject({ _tag: "Success" })
      expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...e, derechosMinimos: derechos })))).toMatchObject({ _tag: "Success" })
      const contradictorio = { ...derechos, descendientes: [{ ...descendiente, declaracion: { modalidad: "individual", rentasCentimos: descendiente.declaracion.rentasCentimos - 1 } as const }, d.descendientes[1]!] }
      expect(Effect.runSync(Effect.result(liquidarIrpfAnual({ ...a, derechosMinimos: contradictorio }, { modo: "canonico" })))).toMatchObject({ _tag: "Failure" })
      expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...e, derechosMinimos: contradictorio })))).toMatchObject({ _tag: "Failure" })
    })
  }
}
