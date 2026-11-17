import oraculos from "./familia-cuantizacion-open2025.oraculos.json"
import Decimal from "decimal.js"
import { DateTime, Effect, Result, Schema } from "effect"
import { describe, expect, it } from "vitest"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { CasoFiscalAnualExplicitoBase } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { seleccionarCuantizacionFamilia2025 } from "../lib/dominio/irpf/cuotas/politica-familia-open-2025"
import { calcularDerechosMinimos, validarDerechosMinimos } from "../lib/dominio/irpf/minimos/derechos"
import { calcularReduccionTrabajoConOtrasRentas } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

const D = Decimal.clone({ precision: 80 })
const FAMILIA = "open-familia-cuatro-gravamenes-2025"
const { vectores } = Schema.decodeUnknownSync(Schema.Struct({
  vectores: Schema.Array(Schema.Struct({ id: Schema.String, entrada: Schema.Unknown })),
}))(oraculos)
function caso(id = "open2025-andalucia-11") {
  const v = vectores.find(v => v.id === id)
  if (v === undefined) throw Error("Falta vector original")
  const c = Schema.decodeUnknownSync(CasoFiscalAnualExplicitoBase)(v.entrada)
  if (c.perfil !== "solo-trabajo" || c.ejercicio !== 2025) throw Error("Control laboral requerido")
  return c
}
type Caso = ReturnType<typeof caso>
type Derechos = NonNullable<Caso["derechosMinimos"]>
function composicion(c: Caso = caso()): EntradaComposicionAnual {
  const bruto = c.trabajo.rendimientos.reduce((a,r) => a.plus(r.integro), new D(0))
  const cot = c.trabajo.rendimientos.reduce((a,r) => a.plus(r.cotizaciones.seguridadSocial)
    .plus(r.cotizaciones.derechosPasivos).plus(r.cotizaciones.colegiosHuerfanos), new D(0))
  const neto = bruto.minus(cot).minus(2000)
  return {
    hechosFamiliaOpen2025: c, precision: 80,
    politica: c.comunidadAutonoma === "madrid" ? "open-empleo-madrid-2025" : "decimal-hasta-salida",
    origenBaseGeneralB: "solo-trabajo", cotizaciones: { naturaleza: "efectivas", trabajador: cot },
    ambito: { contribuyenteId: c.contribuyenteId, anio: c.ejercicio, comunidadAutonoma: c.comunidadAutonoma,
      derechosMinimos: c.derechosMinimos, situacionFamiliar: { tipo: "individual", edad: c.edad,
        discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
    baseGeneral: neto, baseAhorro: new D(0), rentasAntesReducciones: neto,
    rentasTrabajoAnuales: { integroTrabajo: bruto, restoRentas: new D(0) }, serviciosLaborales: { bruto },
    minimosEstatales: MINIMOS_ESTATALES_2025, deduccionesAutonomicasCentimos: 0,
  }
}
const atribuciones = () => [{ sujetoId: "s-3", titulares: ["s-1", "s-2"] }]
function seleccionar(e = composicion(), me = new D(6750), ma = new D(7045), a = atribuciones()) {
  return seleccionarCuantizacionFamilia2025(e, me, ma, a)
}
function conDerechos(c: Caso, h: Derechos): Caso { return { ...c, derechosMinimos: h } }
function cambiarTitulares(c: Caso, f: (t: Derechos["descendientes"][number]["titulares"]) => Derechos["descendientes"][number]["titulares"]): Caso {
  const h = c.derechosMinimos!, d = h.descendientes[0]!
  return conDerechos(c, { ...h, descendientes: [{ ...d, titulares: f(d.titulares) }] })
}
const calcular = (c: Caso) => Effect.runSync(liquidarIrpfAnualExplicito(c))
type RechazoEsperado = { readonly _tag: string; readonly motivo: string }
function rechazo<E, A>(efecto: Effect.Effect<A, E>, esperado: RechazoEsperado) {
  const r = Effect.runSync(Effect.result(efecto))
  if (Result.isSuccess(r)) throw Error("Se esperaba un rechazo concreto")
  expect(r.failure).toMatchObject(esperado)
}
const pasoCuotas = (r: Awaited<ReturnType<typeof calcular>>) => {
  const pasos = r.rastro.pasos.filter(p => p.titulo === "Bases, cuotas y pagos anuales")
  expect(pasos).toHaveLength(1)
  return pasos[0]!
}

describe("Selector familiar aislado: cada exclusi\u00F3n tiene control positivo", () => {
  const guardas: [string, (e: EntradaComposicionAnual) => EntradaComposicionAnual][] = [
    ["sin hechos", e => ({ ...e, hechosFamiliaOpen2025: undefined })],
    ["a\u00F1o de \u00E1mbito", e => ({ ...e, ambito: { ...e.ambito, anio: 2024 } })],
    ["cotizaci\u00F3n estimada", e => ({ ...e, cotizaciones: { ...e.cotizaciones, naturaleza: "estimadas-perfil-uniforme" } })],
    ["ahorro positivo", e => ({ ...e, baseAhorro: new D("0.01") })],
    ["otra deducci\u00F3n", e => ({ ...e, deduccionesAutonomicasCentimos: 1 })],
    ["edad distinta en \u00E1mbito", e => ({ ...e, ambito: { ...e.ambito, situacionFamiliar: { ...e.ambito.situacionFamiliar, edad: 41 } } })],
    ["discapacidad de \u00E1mbito", e => ({ ...e, ambito: { ...e.ambito, situacionFamiliar: { ...e.ambito.situacionFamiliar, discapacidad: { _tag: "Discapacidad65OMas" } } } })],
    ["fallecimiento", e => ({ ...e, ambito: { ...e.ambito, fechaFallecimiento: DateTime.toDateUtc(DateTime.makeUnsafe("2025-06-01T00:00:00Z")) } })],
    ["rentas anteriores distintas", e => ({ ...e, rentasAntesReducciones: e.baseGeneral.plus("0.01") })],
    ["resto de rentas", e => ({ ...e, rentasTrabajoAnuales: { ...e.rentasTrabajoAnuales!, restoRentas: new D("0.01") } })],
    ["bruto del libro", e => ({ ...e, rentasTrabajoAnuales: { ...e.rentasTrabajoAnuales!, integroTrabajo: e.rentasTrabajoAnuales!.integroTrabajo.plus("0.01") } })],
    ["bruto de servicios", e => ({ ...e, serviciosLaborales: { bruto: e.serviciosLaborales!.bruto.plus("0.01") } })],
    ["cotizaci\u00F3n del libro", e => ({ ...e, cotizaciones: { ...e.cotizaciones, trabajador: e.cotizaciones.trabajador.plus("0.01") } })],
    ["servicios con otras rentas", e => ({ ...e, serviciosLaborales: { ...e.serviciosLaborales!, otrasRentas: new D(0) } })],
    ["servicios con neto externo", e => ({ ...e, serviciosLaborales: { ...e.serviciosLaborales!, netoReducido: e.baseGeneral } })],
    ["pol\u00EDtica territorial con familia", e => ({ ...e, politica: "open-cuotas-empleo-territorios-2025" })],
    ["pol\u00EDtica salarial Madrid fuera de Madrid", e => ({ ...e, politica: "open-empleo-madrid-2025" })],
  ]
  it.each(guardas)("guarda %s", (_, cambiar) => {
    const e = composicion()
    expect(seleccionar(e)).toBe(FAMILIA)
    expect(seleccionar(cambiar(e))).toBeUndefined()
  })
  it.each(["estatal", "auton\u00F3mico"])("base inferior s\u00F3lo al m\u00EDnimo %s: cambia el m\u00EDnimo aislado", cual => {
    const e = composicion(), alto = e.baseGeneral.plus("0.01")
    expect(seleccionar(e)).toBe(FAMILIA)
    expect(seleccionar(e, cual === "estatal" ? alto : new D(6750), cual === "auton\u00F3mico" ? alto : new D(7045))).toBeUndefined()
    // Igualdad admitida: no altera base, bruto, rentas, cotizaciones ni art20.
    expect(seleccionar(e, e.baseGeneral, e.baseGeneral)).toBe(FAMILIA)
  })
  it.each(["NaN", "Infinity", "-0.01"])("m\u00EDnimo inv\u00E1lido %s, sin tocar renta o base", minimo => {
    const e = composicion()
    expect(seleccionar(e)).toBe(FAMILIA)
    expect(seleccionar(e, new D(minimo))).toBeUndefined()
    expect(seleccionar(e, new D(6750), new D(minimo))).toBeUndefined()
  })
  it("igualdad base/rentas no sustituye reconciliar bruto-cotizaciones-2000", () => {
    const e = composicion(), base = e.baseGeneral.minus("0.01")
    expect(seleccionar(e)).toBe(FAMILIA)
    expect(seleccionar({ ...e, baseGeneral: base, rentasAntesReducciones: base })).toBeUndefined()
  })
  it("derechos iguales por valor pero de distinta referencia no habilitan hechos", () => {
    const e = composicion()
    expect(seleccionar(e)).toBe(FAMILIA)
    const h = { ...e.ambito.derechosMinimos! }
    const c = e.hechosFamiliaOpen2025!
    if (c.perfil !== "solo-trabajo" || c.ejercicio !== 2025) throw Error("Control 2025 requerido")
    expect(h).toEqual(e.ambito.derechosMinimos)
    expect(seleccionar({ ...e, hechosFamiliaOpen2025: { ...c, derechosMinimos: h } })).toBeUndefined()
  })
  it("identidad expl\u00EDcita contra derechos y contra \u00E1mbito, aisladamente", () => {
    const c = { ...caso(), contribuyenteId: "s-1" }, e = composicion(c)
    expect(seleccionar(e)).toBe(FAMILIA)
    // Hechos y \u00E1mbito concuerdan entre s\u00ED; discrepan s\u00F3lo con derechos.
    expect(seleccionar({ ...e, ambito: { ...e.ambito, contribuyenteId: "s-99" },
      hechosFamiliaOpen2025: { ...c, contribuyenteId: "s-99" } })).toBeUndefined()
    // Hechos y derechos concuerdan; discrepa s\u00F3lo el \u00E1mbito.
    expect(seleccionar({ ...e, ambito: { ...e.ambito, contribuyenteId: "s-99" } })).toBeUndefined()
  })
  const atribucionesExcluidas = [
    ["sin atribuci\u00F3n", []],
    ["dos atribuciones", [...atribuciones(), { sujetoId: "s-4", titulares: ["s-1"] }]],
    ["otro sujeto", [{ sujetoId: "s-4", titulares: ["s-1", "s-2"] }]],
    ["titular censado ausente", [{ sujetoId: "s-3", titulares: ["s-1"] }]],
    ["titular ajeno con igual longitud", [{ sujetoId: "s-3", titulares: ["s-1", "s-99"] }]],
    ["titular adicional", [{ sujetoId: "s-3", titulares: ["s-1", "s-2", "s-99"] }]],
  ] satisfies [string, ReturnType<typeof atribuciones>][]
  it.each(atribucionesExcluidas)("atribuci\u00F3n: %s", (_, a) => {
    const e = composicion()
    expect(seleccionar(e)).toBe(FAMILIA)
    expect(seleccionar(e, new D(6750), new D(7045), a)).toBeUndefined()
  })
})

describe("Derechos y econom\u00EDa: \u00E9xitos exigidos o canal y motivo concretos", () => {
  it("control p\u00FAblico produce componentes literales y rastro familiar", () => {
    const r = calcular(caso()), p = pasoCuotas(r)
    expect(r.componentesCuota).toMatchObject({ gravamenEstatal: "2990.25", gravamenAutonomico: "2949.5",
      gravamenMinimoEstatal: "641.25", gravamenMinimoAutonomico: "669.28", cuotaEstatal: "2349", cuotaAutonomica: "2280.22" })
    expect(r.cuotaDiferencialPresentada).toBe("429.22")
    expect(p.descripcion).toContain("cuatro grav\u00E1menes completos")
    expect(p.descripcion).toContain("antes de restar m\u00EDnimos y sumar cuotas")
    expect(p.descripcion).not.toContain("Precisi\u00F3n decimal hasta salida")
    expect(p.fuentes).toContainEqual({ titulo: "Alcance y evidencia de la cuantizaci\u00F3n familiar ordinaria",
      referencia: "docs/procedencia/simuladores/medicion-2025/FAMILIA-CUANTIZACION.md" })
    for (const [site, raw] of [["cuota.estatal", "2349"], ["cuota.autonomica", "2280.22"], ["diferencial", "429.22"]]) {
      const lineas = p.lineasCalculo?.filter(l => l.origen?.siteId === "anual.explicito." + site)
      expect(lineas).toHaveLength(1)
      expect(lineas?.[0]?.origen?.decimal).toBe(raw)
    }
  })
  it("cotitular censado sin derecho: \u00E9xito de m\u00EDnimos, atribuci\u00F3n incompleta, pol\u00EDtica ausente", () => {
    const c = cambiarTitulares(caso(), ts => ts.map((t,i) => i === 1 ? { ...t, residenteIrpf: false } : t))
    const libro = Effect.runSync(calcularDerechosMinimos(c.derechosMinimos!, MINIMOS_ESTATALES_2025, D))
    expect(libro.atribuciones.map(a => ({ sujetoId: a.sujetoId, titulares: a.titulares }))).toEqual([{ sujetoId: "s-3", titulares: ["s-1"] }])
    const e = composicion(c), s = Effect.runSync(componerLiquidacionAnual(e))
    expect(s.politicaCuantizacionFamilia).toBeUndefined()
    expect(seleccionar(e, s.minimoPersonalYFamiliar, s.minimoPersonalYFamiliarAutonomico, libro.atribuciones)).toBeUndefined()
    expect(seleccionar()).toBe(FAMILIA)
  })
  it("renta del cotitular no se confunde con renta propia conciliada", () => {
    const c = cambiarTitulares(caso(), ts => ts.map((t,i) => i === 1 ? { ...t, rentasNoExentasCentimos: 2605001 } : t))
    const s = Effect.runSync(componerLiquidacionAnual(composicion(c)))
    expect(s.politicaCuantizacionFamilia).toBe(FAMILIA)
    expect((calcular(c)).cuotaDiferencialPresentada).toBe("429.22")
  })
  it("tercer titular \u00FAnico: m\u00EDnimos v\u00E1lidos y atribuci\u00F3n completa, fuera del censo familiar", () => {
    const c = cambiarTitulares(caso(), ts => [...ts, { ...ts[1]!, titularId: "s-99" }])
    const libro = Effect.runSync(calcularDerechosMinimos(c.derechosMinimos!, MINIMOS_ESTATALES_2025, D))
    expect(libro.atribuciones[0]?.titulares).toEqual(["s-1", "s-2", "s-99"])
    const s = Effect.runSync(componerLiquidacionAnual(composicion(c)))
    expect(s.politicaCuantizacionFamilia).toBeUndefined()
    expect(seleccionar()).toBe(FAMILIA)
  })
  it("renta propia discrepante: rechazo de conciliaci\u00F3n y no otro error", () => {
    expect((calcular(caso())).cuotaDiferencialPresentada).toBe("429.22")
    const c = cambiarTitulares(caso(), ts => ts.map((t,i) => i === 0 ? { ...t, rentasNoExentasCentimos: t.rentasNoExentasCentimos + 1 } : t))
    rechazo(liquidarIrpfAnualExplicito(c), { _tag: "ResultadoNoSoportado",
      motivo: "La renta propia declarada no concilia con el neto del perfil anual antes de reducciones y compensaciones" })
  })
  it("censo incompleto se rechaza en derechos antes de seleccionar", () => {
    const h = caso().derechosMinimos!, d = h.descendientes[0]!
    Effect.runSync(validarDerechosMinimos(h))
    // Entrada malformada intencionada para comprobar la frontera de validaci\u00F3n.
    const incompleto = { ...h, descendientes: [{ ...d, titularesCompletos: false }] }
    // SAFETY: rompe s\u00F3lo el literal de completitud para ejercitar el decodificador
    // interno; el error tipado y su motivo exacto se exigen inmediatamente.
    rechazo(validarDerechosMinimos(incompleto as Derechos), { _tag: "DerechosMinimosNoSoportados",
      motivo: "Hechos incompletos o fuera del alcance com\u00FAn 2012\u20132026 individual sin fallecimientos ni ascendientes" })
  })
  it("ascendiente: control anual positivo, reserva general y econom\u00EDa propia discrepante", () => {
    const c = caso("open2025-canarias-02"), h = c.derechosMinimos!
    expect((Effect.runSync(componerLiquidacionAnual(composicion(c)))).politicaCuantizacionFamilia).toBe(FAMILIA)
    rechazo(validarDerechosMinimos(h, "general"), { _tag: "DerechosMinimosNoSoportados",
      motivo: "Ascendientes limitados al productor ordinario2025 Madrid/CLM/Valencia" })
    if (h.ascendientes === "ninguno") throw Error("Falta ascendiente de control")
    const a = h.ascendientes[0]!, t = a.titulares[0]!
    if (t.economia.perfil !== "solo-trabajo") throw Error("Falta econom\u00EDa laboral")
    const economia = { ...t.economia, trabajo: { ...t.economia.trabajo, rendimientos: t.economia.trabajo.rendimientos.map((r,i) => i === 0 ? { ...r, integro: "45000.01" } : r) } }
    const cambiado = conDerechos(c, { ...h, ascendientes: [{ ...a, titulares: [{ ...t, economia }] }] })
    rechazo(componerLiquidacionAnual(composicion(cambiado)), { _tag: "ResultadoNoSoportado",
      motivo: "Econom\u00EDa propia del censo de ascendientes no concilia con el neto anual antes de reducciones" })
  })
  it("pol\u00EDtica territorial y familiar tienen controles positivos separados y no se mezclan", () => {
    const c = caso("open2025-catalunya-03"), e = composicion(c)
    expect((Effect.runSync(componerLiquidacionAnual(e))).politicaCuantizacionFamilia).toBe(FAMILIA)
    const territorial: EntradaComposicionAnual = { ...e, hechosFamiliaOpen2025: undefined,
      ambito: { ...e.ambito, derechosMinimos: undefined }, politica: "open-cuotas-empleo-territorios-2025" }
    expect((Effect.runSync(componerLiquidacionAnual(territorial))).politicaCuantizacionFamilia).toBeUndefined()
    rechazo(componerLiquidacionAnual({ ...e, politica: "open-cuotas-empleo-territorios-2025" }), {
      _tag: "ResultadoNoSoportado",
      motivo: "Pol\u00EDtica de cuotas territoriales Open limitada a empleo efectivo de los seis territorios observados en 2025, sin derechos familiares",
    })
  })
  it.each(["hechosFamiliaOpen2025", "politica"])("API expl\u00EDcita rechaza la opci\u00F3n interna sobrante %s", nombre => {
    const c = caso()
    expect((calcular(c)).cuotaDiferencialPresentada).toBe("429.22")
    const forzada = { ...c, [nombre]: nombre === "politica" ? FAMILIA : c }
    rechazo(liquidarIrpfAnualExplicito(forzada), { _tag: "ResultadoNoSoportado",
      motivo: "Entrada incompleta o fuera del alcance anual efectivo declarado" })
  })
})

function conEconomia(bruto: string): Caso {
  const c = caso(), netoCentimos = new D(bruto).minus(2000).mul(100).toNumber()
  const propio = cambiarTitulares(c, ts => ts.map(t => t.titularId === "s-1" ? { ...t, rentasNoExentasCentimos: netoCentimos } : t))
  return { ...propio, retenciones: [], trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, integro: bruto,
    cotizaciones: { ...r.cotizaciones, seguridadSocial: "0", derechosPasivos: "0", colegiosHuerfanos: "0" } })) } }
}
describe("Fronteras art20 y DA61 con econom\u00EDa reconstruida", () => {
  // Son f\u00F3rmulas racionales literales, no expectativas calculadas con producto.
  // Con cotizaciones no negativas, bruto<18276 implica tambi\u00E9n art20 positivo:
  // esa exclusi\u00F3n conjunta no se presenta como prueba aislada de DA61.
  it.each([
    ["18275.99", "1677.5242", "0.002", false],
    ["18276.00", "1677.5128", "0", false],
    ["18276.01", "1677.5014", "0", false],
    ["19747.49", "0.0142", "0", false],
    ["19747.50", "0", "0", true],
    ["19747.51", "0", "0", true],
  ] as const)("bruto %s; art20=%s, DA61=%s", (bruto, art20, da61, seleccionada) => {
    expect(seleccionar(composicion(conEconomia("19747.50")))).toBe(FAMILIA)
    const c = conEconomia(bruto), e = composicion(c)
    expect(e.baseGeneral.toFixed(2)).toBe(new D(bruto).minus(2000).toFixed(2))
    expect(e.rentasAntesReducciones.eq(e.baseGeneral)).toBe(true)
    expect(calcularReduccionTrabajoConOtrasRentas({ anio: 2025, rendimientoPrevioNeto: new D(bruto), otrasRentasNoExentas: new D(0) }).toString()).toBe(art20)
    expect(seleccionar(e)).toBe(seleccionada ? FAMILIA : undefined)
    const r = calcular(c)
    expect(r.reduccionArt20).toBe(art20)
    expect(r.deduccionTrabajo).toBe(da61)
    expect(pasoCuotas(r).descripcion.includes("Familia ordinaria 2025")).toBe(seleccionada)
  })
})
