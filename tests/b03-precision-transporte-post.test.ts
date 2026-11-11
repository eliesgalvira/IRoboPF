import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"
import { efectivo, analitico, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { producirEconomiaAjena2025, producirBasesFamiliares2025, type CensoBasesFamiliares2025, type EconomiaPersonaFamiliar2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { calcularGastosTrabajoMixtoCalendario2025 } from "../lib/dominio/irpf/trabajo-anual/calendario-2025"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

// Adición POST propuesta; ejecutar separadamente del diagnóstico PRE original.
// Primera revisión B03 abierta. GRANT0: preparado, nunca ejecutado aquí.
const D = Decimal.clone({ precision: 80 })
type Economia = Extract<typeof EconomiaPersonaFamiliar2025.Type, { perfil: "solo-trabajo" }>
function economia(empleo = "22000", pension = "5000", ss = "2300", activo = true): Economia {
 const r = efectivo.trabajo.rendimientos[0]!
 return {
  perfil: "solo-trabajo", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno",
  trabajo: { ...efectivo.trabajo, discapacidadActiva: activo ? { grado: "33-a-64", ayudaOMovilidadReducida: "no", acreditadaDuranteTodoElTrabajo: "si" } : "ninguna",
   rendimientos: [
    { ...r, id: "empleo-r", integro: empleo, cotizaciones: { ...r.cotizaciones, seguridadSocial: ss } },
    { ...r, id: "pension-r", clase: "pension", integro: pension, cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" } },
   ] },
  mezclaEmpleoPension2025: { sujetoId: "s-2", empleoId: "empleo-r", pensionId: "pension-r", pagadorPension: "INSS", soportePension: "certificado-r", prestacion: "jubilacion-publica-ordinaria-no-exenta", imputacion: "periodica-2025-sin-atrasos-ni-art18" },
  calendarioTrabajo2025: {
   sujetoId: "s-2", rendimientoId: "empleo-r", empleador: "empresa-r", soporteRelacionLaboral: "contrato-r", fechaCorteDocumental: "2026-05-01", censoCompleto: true, imputacion: "servicios-ordinarios-2025-sin-atrasos",
   certificados: activo ? [{ id: "cert-r", sujetoId: "s-2", organismo: "organo-competente-ccaa", emision: "2025-01-01", efectosDesde: "2025-01-01", efectosHasta: "2025-12-31", grado: 40, ayudaOMovilidadReducida: false, soporte: "resolucion-r" }] : [],
   tramos: [{ id: "servicios-r", desde: "2025-01-01", hasta: "2025-12-31", actividad: "servicios-efectivos", soporte: "nominas-r", integro: empleo, seguridadSocial: ss, derechosPasivos: "0", colegiosHuerfanos: "0" }],
  },
 }
}
function gastos(e: Economia) { return calcularGastosTrabajoMixtoCalendario2025(e.trabajo, e.calendarioTrabajo2025!) }
function anual(territorio: "madrid" | "comunitat-valenciana", ec = economia(), rentaCentimos = 1920000) {
 const ds = ["s-3", "s-4"].map(sujetoId => ({ ...derechos.descendientes[0]!, sujetoId,
  titulares: derechos.descendientes[0]!.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === "s-1" ? 2605600 : rentaCentimos })) }))
 const d = { ...derechos, territorio, descendientes: ds }
 const c: CensoBasesFamiliares2025 = {
  referencia: "revision-B03", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1", estadoCivil: "sin-vinculo", censoCompleto: true, hijosCompletos: true,
  hijos: ["s-3", "s-4"].map(id => ({ id, nacimiento: "2017-01-01", progenitores: ["s-1", "s-2"], conviveCon: ["s-1", "s-2"], independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "registro-r" })),
  personas: ["s-1", "s-2", "s-3", "s-4"].map(id => ({ id, soporte: "censo-r", residenteComunTodo2025: true, vivoTodo2025: true,
   economia: id === "s-1" ? { perfil: "declarante-en-composicion" } : id === "s-2" ? ec : { perfil: "sin-rentas", censoRentasCompleto: true } })),
 }
 const caso = { anio: 2025, contribuyenteId: "s-1", comunidadAutonoma: territorio, derechosMinimos: d } as const
 return { c, caso, a: { ...analitico, ...caso, basesFamiliares2025: c }, e: { ...efectivo, comunidadAutonoma: territorio, contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: c, familiaresConDerechoMinimo: "segun-derechos" as const } }
}

function parcial(antes: string, dias: 1 | 10 | 73 = 1): Economia {
 const e = economia(new D(antes).plus(1000).toFixed(), "1000", "0")
 const c = e.calendarioTrabajo2025!, t = c.tramos[0]!
 const desde = dias === 1 ? "2025-12-31" : dias === 10 ? "2025-12-22" : "2025-10-20"
 const hasta = dias === 1 ? "2025-12-30" : dias === 10 ? "2025-12-21" : "2025-10-19"
 return { ...e, trabajo: { ...e.trabajo, discapacidadActiva: { grado: "33-a-64", ayudaOMovilidadReducida: "no", acreditadaDuranteTodoElTrabajo: "no" } }, calendarioTrabajo2025: { ...c,
  certificados: [{ ...c.certificados[0]!, efectosDesde: desde }],
  tramos: [{ ...t, id: "antes", hasta, integro: antes }, { ...t, id: "certificado", desde, integro: "1000" }],
 } }
}
const propia = () => ({ general: new D(26056), ahorro: new D(0) })
for (const territorio of ["madrid", "comunitat-valenciana"] as const) {
 it(`POST R1 ${territorio}: acepta transporte1800548, conserva neto/base internos y ambas API`, () => {
  const ec = parcial("19000"), x = anual(territorio, ec, 1800548)
  // Oráculo racional:18000+400/73. Límites literales independientes del motor.
  const esperado = producirEconomiaAjena2025(ec, territorio === "madrid")
  const neto = esperado.rentaAntesReducciones!
  expect(neto.gt("18005.47945") && neto.lt("18005.47946")).toBe(true)
  expect(neto.times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toFixed()).toBe("1800548")
  expect(neto.times(100).isInteger()).toBe(false)
  const libro = producirBasesFamiliares2025(x.c, x.caso, propia())
  expect(libro.bases.get("s-2")!.rentaAntesReducciones!.toFixed()).toBe(neto.toFixed())
  expect(libro.bases.get("s-2")!.general.toFixed()).toBe(neto.toFixed()) // Art20=0
  expect(libro.bases.get("s-2")!.general.eq("18005.48")).toBe(false)
  expect(libro.bases.get("s-1")!.general.toFixed()).toBe("26056")
  const control = anual(territorio) // misma composición e ingresos propios
  const a = Effect.runSync(liquidarIrpfAnual(x.a, { modo: "canonico" }))
  const e = Effect.runSync(liquidarIrpfAnualExplicito(x.e))
  expect(a.cuotaLiquidaCentimos).toBe(Effect.runSync(liquidarIrpfAnual(control.a, { modo: "canonico" })).cuotaLiquidaCentimos)
  expect(e.cuotaLiquidaLegal).toBe(Effect.runSync(liquidarIrpfAnualExplicito(control.e)).cuotaLiquidaLegal)
  expect(e.baseLiquidableGeneral).toBe("26056")
 })
 it(`POST R1 ${territorio}: rechaza vecino1800547 en libro y ambas API`, () => {
  const x = anual(territorio, parcial("19000"), 1800547)
  expect(() => producirBasesFamiliares2025(x.c, x.caso, propia())).toThrow(/renta/i)
  expect(() => Effect.runSync(liquidarIrpfAnual(x.a, { modo: "canonico" }))).toThrow()
  expect(() => Effect.runSync(liquidarIrpfAnualExplicito(x.e))).toThrow()
 })
 it.each([
  ["8994.52", 1, 800000, true], //7999.999452... transporte8000 conserva <=
  ["8945.20", 10, 799999, true], //7999.994520... transporte7999.99
  ["8600", 73, 800000, true], //8000 exactos
  ["8945.21", 10, 800000, false], //8000.004520... proyectar8000 cambia el lado
  ["8945.22", 10, 800001, true], //8000.014520... transporte8000.01
 ] as const)(`POST ${territorio}: titular frontera8000 antes=%s días=%s`, (antes, dias, cents, acepta) => {
  const ec = parcial(antes, dias), x = anual(territorio, ec, cents)
  const neto = new D(gastos(ec).netoArt19)
  expect(neto.times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).eq(cents)).toBe(true)
  expect(neto.lte(8000) === (cents <= 800000)).toBe(acepta)
  const run = () => producirBasesFamiliares2025(x.c, x.caso, propia())
  if (acepta) expect(run().bases.get("s-2")!.rentaAntesReducciones!.toFixed()).toBe(neto.toFixed())
  else expect(run).toThrow(/renta|8000|precisi|represent|umbral/i)
 })
}
// Rama descendiente: si se abre,1800 corresponde a rentas declaradas; en este
// perfil sólo-trabajo sin otras rentas se requiere transporte coherente para
// ambos hechos, conservando las dos clasificaciones aplicables. No art20 aquí.
function descendiente(ec: Economia, cents: number, declara = true) {
 const c = ec.calendarioTrabajo2025!
 const economiaHijo: Economia = { ...ec, mezclaEmpleoPension2025: { ...ec.mezclaEmpleoPension2025!, sujetoId: "s-3" }, calendarioTrabajo2025: { ...c, sujetoId: "s-3", certificados: c.certificados.map(s => ({ ...s, sujetoId: "s-3" })) } }
 const x = anual("madrid", economia(), 1920000)
 const d = { ...x.caso.derechosMinimos, edadContribuyenteDevengo: 70,
  descendientes: x.caso.derechosMinimos.descendientes.map(s => s.sujetoId !== "s-3" ? s : { ...s, fechaNacimiento: "1985-01-01", edadDevengo: 40, rentasNoExentasCentimos: cents,
   discapacidad: { _tag: "Discapacidad33a64" as const, necesitaAyudaOMovilidadReducida: false }, declaracion: declara ? { modalidad: "individual" as const, rentasCentimos: cents } : { modalidad: "no-presenta" as const } }) }
 const censo: CensoBasesFamiliares2025 = { ...x.c, hijos: x.c.hijos.map(h => h.id === "s-3" ? { ...h, nacimiento: "1985-01-01" } : h), personas: x.c.personas.map(p => p.id === "s-3" ? { ...p, economia: economiaHijo, declaracion2025: { modalidad: declara ? "individual" : "no-presenta", soporte: "declaracion-r" } } : p) }
 return () => producirBasesFamiliares2025(censo, { ...x.caso, derechosMinimos: d }, propia())
}
it.each([
 ["2794.52", 1, 180000, true], //1799.999452... <=1800 se conserva
 ["2745.20", 10, 179999, true], //1799.994520...
 ["2400", 73, 180000, true], //1800 exactos
 ["2745.21", 10, 180000, false], //1800.004520... clasificación perdida
 ["2745.22", 10, 180001, true], //1800.014520... >1800 se conserva
] as const)("POST descendiente declara: frontera1800 antes=%s días=%s", (antes, dias, cents, acepta) => {
 const ec = parcial(antes, dias), neto = new D(gastos(ec).netoArt19)
 expect(neto.times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).eq(cents)).toBe(true)
 expect(neto.lte(1800) === (cents <= 180000)).toBe(acepta)
 const run = descendiente(ec, cents)
 if (acepta) expect(run().bases.get("s-3")!.rentaAntesReducciones!.toFixed()).toBe(neto.toFixed())
 else expect(run).toThrow(/renta|1800|precisi|represent|umbral/i)
})
it("POST descendiente sin declaración:1800 no introduce una exclusión genérica", () => {
 const ec = parcial("2745.21", 10), run = descendiente(ec, 180000, false)
 expect(run().bases.get("s-3")!.rentaAntesReducciones!.toFixed()).toBe(gastos(ec).netoArt19)
})

it.each([
 ["8994.52", 1, 800000, true], ["8600", 73, 800000, true],
 ["8945.21", 10, 800000, false], ["8945.22", 10, 800001, true],
] as const)("POST descendiente declara: también conserva8000 antes=%s días=%s", (antes, dias, cents, acepta) => {
 const ec = parcial(antes, dias), neto = new D(gastos(ec).netoArt19)
 expect(neto.times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).eq(cents)).toBe(true)
 expect(neto.lte(8000) === (cents <= 800000)).toBe(acepta)
 const run = descendiente(ec, cents)
 if (acepta) expect(run().bases.get("s-3")!.rentaAntesReducciones!.toFixed()).toBe(neto.toFixed())
 else expect(run).toThrow(/renta|8000|precisi|represent|umbral/i)
})
