import { describe, expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"
import { efectivo, analitico, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { producirEconomiaAjena2025, producirBasesFamiliares2025, sumaBasesPersonas2025, type CensoBasesFamiliares2025, type EconomiaPersonaFamiliar2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { calcularGastosTrabajoMixtoCalendario2025, calcularGastosTrabajoCalendario2025 } from "../lib/dominio/irpf/trabajo-anual/calendario-2025"
import { aplicarDosDescendientesAnual2025 } from "../lib/dominio/irpf/bases-familiares-2025/valencia"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

// Primera revisión B03. Fixtures nuevas; no importa tests ni oráculos del candidato.
// NO EJECUTADO en GRANT0. El padre ejecuta este archivo con su supervisor.
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
const codigo = "valenciana_dos_o_mas_descendientes"
function solicitud() { return {
 ejercicio: 2025, territorio: "comunitat-valenciana", modalidad: "individual", devengo: "2025-12-31", contribuyente: "s-1", cantidades: [],
 solicitudes: [{ codigo, eleccion: "aplicar", unidades: [{ id: "rev-u", titulares: ["s-1"], fecha: "2025-12-31", numeros: {}, textos: {} }], referencias: [{ unidad: "rev-u", sujetos: ["s-3", "s-4"], bienes: [], eventos: [], cantidades: [] }] }],
 ordenBase30: [], consignaciones: [], arrastres: [], ordenConsumo: [JSON.stringify([codigo, 2025, "s-1"])], criterioOrden: "eleccion_experta",
} as const }
const ats = ["s-3", "s-4"].map(sujetoId => ({ sujetoId, titulares: ["s-1", "s-2"] }))

describe("B03 revisión independiente: oráculos legales de 2025", () => {
 it("cotizaciones exclusivas del empleo; general e incremento únicos", () => {
  const e = economia(), g = gastos(e)
  expect(g).toMatchObject({ generalesAplicados: "2000", gastosAE: "2300", discapacidadAplicada: "3500", netoPrevioArt20: "24700", netoArt19: "19200" })
  for (const madrid of [false, true]) expect(producirEconomiaAjena2025(e, madrid).general.toFixed()).toBe("19200")
 })
 it.each([
  ["14851.99", "2049.99"], ["14852", "2050"], ["14852.01", "2050.0275"],
  ["17673.51", "9809.1525"], ["17673.52", "9809.18"], ["17673.53", "9809.2014"],
  ["19747.49", "14247.4758"], ["19747.50", "14247.5"], ["19747.51", "14247.51"],
 ])("art20 conjunto y sin redondeo Open; previo %s", (total, base) => {
  // Pensión 400; gasto activo 3500 completo. Valores derivados del texto art20,
  // con neto19 = previo - 5500; no consulta ni ejecuta el algoritmo del autor.
  const e = economia(new D(total).minus(400).toFixed(), "400", "0")
  for (const madrid of [false, true]) expect(producirEconomiaAjena2025(e, madrid).general.toFixed()).toBe(base)
 })
 it("la pensión no financia el incremento cuando empleo < general", () => {
  const e = economia("900", "20000", "0")
  expect(gastos(e)).toMatchObject({ generalesAplicados: "2000", discapacidadAplicada: "0", netoArt19: "18900" })
 })
 it("mezcla sin discapacidad también tiene un solo general y un solo art20", () => {
  const e = economia("14000", "2000", "0", false)
  // Previo16000; art19=14000; art20=5293; no pensión como otras rentas.
  expect(producirEconomiaAjena2025(e, true).general.toFixed()).toBe("8707")
 })
 it("73 días: cotizaciones se imputan al tramo; incremento anual no prorrateado", () => {
  const e = economia("19000", "3000", "1000")
  const c = e.calendarioTrabajo2025!, t = c.tramos[0]!, cert = c.certificados[0]!
  const parcial: Economia = { ...e, trabajo: { ...e.trabajo, discapacidadActiva: { grado: "33-a-64", ayudaOMovilidadReducida: "no", acreditadaDuranteTodoElTrabajo: "no" } }, calendarioTrabajo2025: { ...c,
   certificados: [{ ...cert, efectosDesde: "2025-10-20" }],
   tramos: [{ ...t, id: "antes", hasta: "2025-10-19", integro: "17800", seguridadSocial: "900" }, { ...t, id: "despues", desde: "2025-10-20", integro: "1200", seguridadSocial: "100" }],
  } }
  // Asociado1100 - general2000*73/365=700. Previo21000; art19=18300.
  expect(gastos(parcial)).toMatchObject({ discapacidadAplicada: "700", netoArt19: "18300" })
  expect(producirEconomiaAjena2025(parcial, true).general.toFixed()).toBe("18300")
 })
 it("la API antigua mantiene su exclusión técnica de mezcla", () => {
  const e = economia()
  expect(() => calcularGastosTrabajoCalendario2025(e.trabajo, e.calendarioTrabajo2025!)).toThrow(/empleo/)
 })
})
for (const territorio of ["madrid", "comunitat-valenciana"] as const) {
 it(`libro ${territorio}: propia intacta y consumo por persona única`, () => {
  const { c, caso } = anual(territorio)
  const propia = { general: new D(10800), ahorro: new D(0) }
  const libro = producirBasesFamiliares2025(c, caso, propia)
  expect(libro.bases.get("s-1")!.general.toFixed()).toBe("10800")
  expect(libro.bases.get("s-2")!.general.toFixed()).toBe("19200")
  expect(sumaBasesPersonas2025(libro, ["s-1", "s-2", "s-3", "s-4"]).toFixed()).toBe("30000")
  expect(() => sumaBasesPersonas2025(libro, ["s-2", "s-2"])).toThrow(/duplicado/)
  expect(propia.general.toFixed()).toBe("10800")
 })
 it(`ambas API ${territorio}: ingresos/base/cuota propios independientes del familiar`, () => {
  const con = anual(territorio), control = anual(territorio, economia("23000", "5000", "2300"), 2020000)
  const a = Effect.runSync(liquidarIrpfAnual(con.a, { modo: "canonico" }))
  const a0 = Effect.runSync(liquidarIrpfAnual(control.a, { modo: "canonico" }))
  const e = Effect.runSync(liquidarIrpfAnualExplicito(con.e))
  const e0 = Effect.runSync(liquidarIrpfAnualExplicito(control.e))
  expect(a.cuotaLiquidaCentimos).toBe(a0.cuotaLiquidaCentimos)
  expect(e.cuotaLiquidaLegal).toBe(e0.cuotaLiquidaLegal)
  expect(e.baseLiquidableGeneral).toBe("26056")
 })
 it.each(["H2", "sujeto", "anual", "renta", "pension-gasto", "clasificacion", "campo-ajeno"])(`ambas API ${territorio}: rechaza %s`, causa => {
  const ec = economia(), c = ec.calendarioTrabajo2025!
  const alterada = causa === "H2" ? { ...ec, calendarioTrabajo2025: undefined }
   : causa === "sujeto" ? { ...ec, mezclaEmpleoPension2025: { ...ec.mezclaEmpleoPension2025!, sujetoId: "s-99" } }
   : causa === "anual" ? { ...ec, calendarioTrabajo2025: { ...c, tramos: c.tramos.map(t => ({ ...t, integro: "22000.01" })) } }
   : causa === "campo-ajeno" ? { ...ec, baseExterna: "19200" }
   : causa === "pension-gasto" ? { ...ec, trabajo: { ...ec.trabajo, rendimientos: ec.trabajo.rendimientos.map(r => r.clase === "pension" ? { ...r, cotizaciones: { ...r.cotizaciones, seguridadSocial: "1" } } : r) } }
   : causa === "clasificacion" ? { ...ec, mezclaEmpleoPension2025: { ...ec.mezclaEmpleoPension2025!, prestacion: "incapacidad-absoluta-exenta" } }
   : ec
  // SAFETY: entrada deliberadamente adversa; ambas API ejecutan el parser de dominio y la prueba exige su rechazo.
  const x = anual(territorio, alterada as Economia, causa === "renta" ? 1920001 : 1920000)
  expect(() => Effect.runSync(liquidarIrpfAnual(x.a, { modo: "canonico" }))).toThrow()
  expect(() => Effect.runSync(liquidarIrpfAnualExplicito(x.e))).toThrow()
 })
}
it.each([["10799.99", "80"], ["10800", "80"], ["10800.01", "0"]])("Valencia frontera por personas únicas: propia=%s", (general, importe) => {
 const { c, caso } = anual("comunitat-valenciana")
 const libro = producirBasesFamiliares2025(c, caso, { general: new D(general), ahorro: new D(0) })
 const r = aplicarDosDescendientesAnual2025(solicitud(), libro, ats, new D(800))
 expect(r.totalAplicado).toBe(importe)
 expect(r.movimientos).toHaveLength(1)
 expect(new D(r.cuotaRestante!).plus(r.totalAplicado!).toFixed()).toBe("800")
})
it("Valencia rechaza doble orden de consumo", () => {
 const { c, caso } = anual("comunitat-valenciana")
 const libro = producirBasesFamiliares2025(c, caso, { general: new D(10000), ahorro: new D(0) })
 const s = solicitud()
 expect(() => aplicarDosDescendientesAnual2025({ ...s, ordenConsumo: [...s.ordenConsumo, ...s.ordenConsumo] }, libro, ats, new D(800))).toThrow(/consumo/)
})
// El diagnóstico R1 PRE se conserva en la entrega; el contrato corregido
// se verifica en b03-precision-transporte-post.test.ts.
it.each([["100463.99", 9766399, true], ["100464", 9766400, true], ["100464.01", 9766401, false]] as const)("Madrid ambas API: cuatro miembros, umbral 123720 empleo=%s", (empleo, renta, aplica) => {
 // Art20=0. Familiar = empleo+5000-2300-2000-3500 = empleo-2800.
 const x = anual("madrid", economia(empleo), renta)
 const c: CensoBasesFamiliares2025 = { ...x.c, estadoCivil: "casado-no-separado", conyuge: "s-2" }
 const a = { ...x.a, basesFamiliares2025: c }, e = { ...x.e, basesFamiliares2025: c }
 const f = { solicitudes: [{ lote: "F-ampliado", codigo: "madrid_condicion_familia_numerosa", hechos: { titulo: { categoria: "general", referencia: "titulo-r", efectos: "2025-01-01", titulares: ["s-1"] } } }] } as const
 const a0 = Effect.runSync(liquidarIrpfAnual(a, { modo: "canonico" }))
 const a1 = Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: f }, { modo: "canonico" }))
 const e0 = Effect.runSync(liquidarIrpfAnualExplicito(e))
 const e1 = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: f }))
 expect(a1.cuotaLiquidaCentimos < a0.cuotaLiquidaCentimos).toBe(aplica)
 expect(new D(e1.cuotaLiquidaLegal).lt(e0.cuotaLiquidaLegal)).toBe(aplica)
 expect(e1.baseLiquidableGeneral).toBe(e0.baseLiquidableGeneral)
})
it("Valencia ambas API: art20 del familiar no contamina la base propia ni duplica consumo", () => {
 const x = anual("comunitat-valenciana", economia("10000", "1000", "0"), 550000)
 const a = Effect.runSync(liquidarIrpfAnual({ ...x.a, deduccionesValencianas2025: solicitud() }, { modo: "canonico" }))
 const e = Effect.runSync(liquidarIrpfAnualExplicito({ ...x.e, deducciones: "valencianas-por-hechos-y-da61", deduccionesValencianas2025: solicitud() }))
 for (const r of [a.deduccionesValencianas2025!, e.deduccionesValencianas2025!]) {
  expect(new D(r.totalAplicado!).gt(0)).toBe(true)
  expect(r.movimientos).toHaveLength(1)
  expect(r.movimientos[0]!.id).toBe(JSON.stringify([codigo, 2025, "s-1"]))
 }
 expect(e.baseLiquidableGeneral).toBe("26056")
})
