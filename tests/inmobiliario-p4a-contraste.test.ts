import { expect, it } from "vitest"
import { Effect } from "effect"
import type { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import type { liquidarInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/anual"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoP4a, solicitudP4a } from "./inmobiliario-p4a.fixtures"

// Traslado tipado de los 50 adversos independientes, con los mismos oráculos.
const apis = [
  (c: CasoInmobiliarioP4a) => liquidarIrpfAnual(c, { modo: "canonico" }),
  (c: CasoInmobiliarioP4a) => liquidarIrpfAnualExplicito(c),
]
function primero<A>(items: readonly A[]): A {
  const item = items[0]
  if (item === undefined) throw new Error("Fixture incompleta")
  return item
}
function regional(balears = true) {
  const base = casoP4a(), solicitud = solicitudP4a(balears)
  const caso = { ...base,
    inmuebles: base.inmuebles.map(v => ({ ...v, contrato: { ...v.contrato },
      exigibilidades: v.exigibilidades.map(x => ({ ...x })), gastos: v.gastos.map(x => ({ ...x })),
    })),
    deduccionesTerritoriales2025: { solicitudes: [solicitud] },
  }
  caso.comunidadAutonoma = balears ? "illes-balears" : "canarias"
  const inmueble = primero(caso.inmuebles)
  inmueble.ubicacion = caso.comunidadAutonoma
  primero(inmueble.exigibilidades).importe = "36000"
  if (balears) {
    const gasto = primero(inmueble.gastos)
    gasto.clase = "mejora"
    gasto.puestaEnServicio = "2025-06-01"
  }
  return { caso, inmueble, solicitud }
}
type Escenario = ReturnType<typeof regional>
function segundo(e: Escenario) {
  const v = structuredClone(e.inmueble)
  v.id = "V2"; v.catastro = "RC2"; v.contrato.id = "C2"; v.contrato.documento = "CONTRATO2"
  primero(v.exigibilidades).id = "R2"; primero(v.exigibilidades).documento = "EX2"
  primero(v.gastos).id = "P2"
  e.caso.inmuebles.push(v)
  return v
}
function deduccion(r: Effect.Success<ReturnType<typeof liquidarInmobiliarioP4a>>) {
  const total = r.composicion.deduccionesTerritoriales2025?.total
  if (total === undefined) throw new Error("Sin deducción")
  return Number(total.numeradorEuros) / Number(total.divisor)
}
const mutaciones: readonly (readonly [string, (e: Escenario) => void, string])[] = [
  ["habitual real", e => {
    // Adverso: sustituye deliberadamente el uso de la fixture regional.
    Object.assign(primero(e.solicitud.hechos.viviendas), { uso: "habitual_propia" })
  }, "historia regional"],
  ["ubicacion canaria", e => { e.inmueble.ubicacion = "canarias" }, "situado en Illes Balears"],
  ["ubicacion peninsular", e => { e.inmueble.ubicacion = "resto-espana" }, "situado en Illes Balears"],
  ["pago no factura", e => { primero(e.inmueble.gastos).fechaPago = "2025-07-01" }, "pago regional no conciliado"],
  ["importe regional documento", e => { primero(e.inmueble.gastos).importe = "600" }, "pago regional no conciliado"],
  ["pago en otra vivienda", e => {
    segundo(e).gastos = []
    const v = structuredClone(primero(e.solicitud.hechos.viviendas))
    v.id = "V2"; v.catastro = "RC2"; primero(v.historiaContratos).id = "C2"
    e.solicitud.hechos.viviendas = [v]
  }, "pago regional no conciliado"],
  ["solicitud repetida", e => { e.caso.deduccionesTerritoriales2025.solicitudes.push(structuredClone(e.solicitud)) }, ""],
  ["pago repetido", e => { const v = primero(e.solicitud.hechos.viviendas); v.gastos.push(structuredClone(primero(v.gastos))) }, ""],
  ["linea otro inmueble", e => { segundo(e) }, "partida ya incluida"],
  ["total otro inmueble", e => { const g = primero(segundo(e).gastos); g.lineaFactura = "2"; g.totalFactura = "2000" }, "Factura incoherente"],
  ["fecha factura otro inmueble", e => { const g = primero(segundo(e).gastos); g.lineaFactura = "2"; g.fechaFactura = "2025-07-01" }, "Factura incoherente"],
  ["suma otro inmueble", e => { primero(segundo(e).gastos).lineaFactura = "2" }, "exceden el importe"],
  ["ID otra linea", e => { const g = primero(segundo(e).gastos); g.lineaFactura = "2"; g.id = "P1" }, "Identidad"],
]
for (const [indice, api] of apis.entries()) {
  for (const [nombre, cambiar, motivo] of mutaciones) {
    it(`contraste P4a ${nombre}; API ${indice}`, () => {
      const e = regional(); cambiar(e)
      const error = Effect.runSync(Effect.flip(api(e.caso)))
      expect(error._tag).not.toBe("RechazoP4aEntrada")
      if (nombre === "solicitud repetida") expect(error._tag).toBe("ResultadoNoSoportado")
      if (motivo.length > 0) expect(JSON.stringify(error)).toContain(motivo)
      if (["habitual real", "ubicacion canaria", "ubicacion peninsular", "pago no factura", "importe regional documento", "pago en otra vivienda"].includes(nombre)) {
        expect(error._tag).toBe("ResultadoNoSoportado")
      }
    })
  }
  for (const campo of ["fechaOperacion", "fechaFactura", "fechaPago"] as const) {
    for (const fecha of ["2024-12-31", "2026-01-01", "2025-02-29"]) {
      it(`contraste P4a fecha ${campo} ${fecha}; API ${indice}`, () => {
        const e = regional(); primero(e.inmueble.gastos)[campo] = fecha
        const error = Effect.runSync(Effect.flip(api(e.caso)))
        expect(error).toMatchObject({ _tag: "RechazoP4a", codigo: "gasto" })
      })
    }
  }
  it(`contraste P4a fechas y líneas exactas; API ${indice}`, () => {
    const e = regional(), g = primero(e.inmueble.gastos)
    g.fechaOperacion = "2025-04-01"; g.puestaEnServicio = "2025-05-01"
    g.fechaFactura = "2025-06-01"; g.fechaPago = "2025-07-01"; g.importe = "600.01"
    e.inmueble.gastos.push({ ...g, id: "P2", lineaFactura: "2", importe: "399.99" })
    const v = primero(e.solicitud.hechos.viviendas), p = primero(v.gastos)
    p.fecha = "2025-07-01"; p.importe = "600.01"
    v.gastos.push({ ...p, id: "P2", importe: "399.99" })
    const r = Effect.runSync(api(e.caso)), a = primero(r.inmuebles).amortizacion
    expect(deduccion(r)).toBe(500)
    expect(a.n * 365n).toBe(883350n * a.d)
    expect(r.composicion.cuotaLiquida.eq(r.composicion.cuotaEstatalDespuesMinimo.plus(r.composicion.cuotaAutonomicaGeneralDespuesMinimo).minus(r.composicion.deduccionesAutonomicasAplicadas))).toBe(true)
  })
  it(`contraste P4a clave de factura sin colisión; API ${indice}`, () => {
    const c = casoP4a(), v = primero(c.inmuebles), g = primero(v.gastos)
    const caso = { ...c, inmuebles: [{ ...v, gastos: [
      { ...g, prestadorNif: "AB", factura: "C" }, { ...g, id: "P2", prestadorNif: "A", factura: "BC" },
    ] }] }
    const r = Effect.runSync(api(caso))
    expect(r.netoReducido.n).toBe(3800n * r.netoReducido.d)
  })
  it(`contraste P4a dos inmuebles, dos líneas, un documento; API ${indice}`, () => {
    const e = regional(false), g = primero(e.inmueble.gastos)
    primero(e.inmueble.exigibilidades).importe = "18000"; g.importe = "600"
    const w = segundo(e); primero(w.gastos).lineaFactura = "2"; primero(w.gastos).importe = "400"
    const a = primero(e.solicitud.hechos.viviendas), b = structuredClone(a)
    primero(a.gastos).importe = "600"; b.id = "V2"; b.catastro = "RC2"
    primero(b.historiaContratos).id = "C2"; primero(b.gastos).id = "P2"; primero(b.gastos).importe = "400"
    e.solicitud.hechos.viviendas.push(b)
    const r = Effect.runSync(api(e.caso))
    expect(deduccion(r)).toBe(100)
    expect(r.netoReducido.n).toBe(15100n * r.netoReducido.d)
  })
}
