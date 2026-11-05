import { describe, expect, it } from "@effect/vitest"
import { Effect, Result, Schema } from "effect"
import { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { producirInmueblesP4a, type ExactoP4a } from "../lib/dominio/irpf/inmobiliario-2025/productor"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoP4a, solicitudP4a } from "./inmobiliario-p4a.fixtures"

const exacto = (x: ExactoP4a, n: bigint, d = 1n) => expect(x.n * d).toBe(n * x.d)
describe("P4a candidato: oráculos racionales sin usar fórmulas del productor", () => {
  it.effect("12000-1000-2400=8600; reducción50%=4300", () => Effect.gen(function* () {
    const r = yield* producirInmueblesP4a(casoP4a())
    const v = r.inmuebles[0]
    expect(v).toBeDefined()
    if (v === undefined) throw new Error("sin inmueble")
    exacto(v.integro, 12000n); exacto(v.amortizacion, 2400n); exacto(v.neto, 8600n); exacto(v.netoReducido, 4300n)
  }))
  for (const [fecha, esperado] of [["2023-05-25", 3440n], ["2023-05-26", 4300n], ["2023-05-27", 4300n]] as const) {
    it.effect("frontera contractual " + fecha, () => Effect.gen(function* () {
      const c = casoP4a()
      const r = yield* producirInmueblesP4a({ ...c, inmuebles: c.inmuebles.map(v => ({ ...v, contrato: { ...v.contrato, firma: fecha } })) })
      exacto(r.netoReducido, esperado)
    }))
  }
  for (const [clase, neto] of [["intereses", 8600n], ["reparacion", 8600n], ["tributo", 8600n], ["comunidad", 8600n], ["seguro", 8600n], ["servicios", 8600n], ["defensa", 8600n], ["suministro", 8600n], ["principal-prestamo", 9600n], ["sancion", 9600n]] as const) {
    it.effect("tratamiento de " + clase, () => Effect.gen(function* () {
      const c = casoP4a()
      const r = yield* producirInmueblesP4a({ ...c, inmuebles: c.inmuebles.map(v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, clase })) })) })
      exacto(r.neto, neto)
    }))
  }
  for (const [construccion, amortizacion] of [["100000", 3000n], ["3000000", 80000n]] as const) {
    it.effect("base catastral y límite acumulado " + construccion, () => Effect.gen(function* () {
      const c = casoP4a()
      const r = yield* producirInmueblesP4a({ ...c, inmuebles: c.inmuebles.map(v => ({ ...v, catastro2025: { ...v.catastro2025, construccion } })) })
      const v = r.inmuebles[0]
      if (v === undefined) throw new Error("sin inmueble")
      exacto(v.amortizacion, amortizacion)
    }))
  }
  it.effect("excluye suelo de precio y gastos de adquisición", () => Effect.gen(function* () {
    const c = casoP4a()
    const r = yield* producirInmueblesP4a({ ...c, inmuebles: c.inmuebles.map(v => ({ ...v, adquisicion: { ...v.adquisicion, gastosTributos: "5000", sueloGastosTributos: "1000" } })) })
    exacto(r.netoReducido, 4240n)
  }))
  for (const [fecha, numerador] of [["2025-01-01", 886950n], ["2025-12-31", 876030n]] as const) {
    it.effect("días de mejora en frontera " + fecha, () => Effect.gen(function* () {
      const c = casoP4a()
      const r = yield* producirInmueblesP4a({ ...c, inmuebles: c.inmuebles.map(v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, clase: "mejora" as const, fechaOperacion: fecha, fechaFactura: fecha, fechaPago: fecha, puestaEnServicio: fecha })) })) })
      const v = r.inmuebles[0]
      if (v === undefined) throw new Error("sin inmueble")
      exacto(v.amortizacion, numerador, 365n)
    }))
  }
  it.effect("límite intereses/reparación: exceso1000; neto negativo sin reducción", () => Effect.gen(function* () {
    const c = casoP4a()
    const r = yield* producirInmueblesP4a({ ...c, inmuebles: c.inmuebles.map(v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, importe: "13000", totalFactura: "13000" })) })) })
    const v = r.inmuebles[0]
    if (v === undefined) throw new Error("sin inmueble")
    exacto(v.gastosLimitados, 12000n); exacto(v.excesoNoAplicado, 1000n); exacto(v.neto, -2400n); exacto(v.reduccion, 0n)
  }))
  it.effect("mejora de1000 disponible1julio: amortización2400+5520/365", () => Effect.gen(function* () {
    const c = casoP4a()
    const r = yield* producirInmueblesP4a({ ...c, inmuebles: c.inmuebles.map(v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, clase: "mejora" as const, puestaEnServicio: "2025-07-01" })) })) })
    const v = r.inmuebles[0]
    if (v === undefined) throw new Error("sin inmueble")
    exacto(v.amortizacion, 881520n, 365n)
  }))
  it.effect("identidad, días y documentos duplicados tienen rechazo de dominio", () => Effect.gen(function* () {
    const c = casoP4a()
    for (const inmuebles of [
      [...c.inmuebles, ...c.inmuebles],
      c.inmuebles.map(v => ({ ...v, titular: "otro" })),
      c.inmuebles.map(v => ({ ...v, contrato: { ...v.contrato, desde: "2025-01-02" } })),
      c.inmuebles.map(v => ({ ...v, usosDesdeAdquisicion: v.usosDesdeAdquisicion.slice(1) })),
      c.inmuebles.map(v => ({ ...v, usosDesdeAdquisicion: [...v.usosDesdeAdquisicion, ...v.usosDesdeAdquisicion] })),
      c.inmuebles.map(v => ({ ...v, gastos: [...v.gastos, ...v.gastos.map(g => ({ ...g, id: "P2" }))] })),
      c.inmuebles.map(v => ({ ...v, exigibilidades: v.exigibilidades.map(x => ({ ...x, fecha: "2025-02-30" })) })),
    ]) {
      const e = yield* Effect.flip(producirInmueblesP4a({ ...c, inmuebles }))
      expect(e._tag).toBe("RechazoP4a")
      const canonico = yield* Effect.flip(liquidarIrpfAnual({ ...c, inmuebles }, { modo: "canonico" }))
      const explicito = yield* Effect.flip(liquidarIrpfAnualExplicito({ ...c, inmuebles }))
      expect(canonico._tag).toBe("RechazoP4a")
      expect(explicito._tag).toBe("RechazoP4a")
    }
  }))
  it("el esquema rechaza neto/categoría externos y ramas no representadas", () => {
    const c = casoP4a()
    const modificaciones = [
      c.inmuebles.map(v => ({ ...v, neto: "12000" })),
      c.inmuebles.map(v => ({ ...v, categoria: "capital_inmobiliario" })),
      c.inmuebles.map(v => ({ ...v, contrato: { ...v.contrato, zonaTensionada: true } })),
      c.inmuebles.map(v => ({ ...v, personalJornadaCompleta: "uno" })),
      c.inmuebles.map(v => ({ ...v, ayudas: "1000" })),
      c.inmuebles.map(v => ({ ...v, derecho: "usufructo" })),
    ]
    for (const inmuebles of modificaciones) {
      expect(Result.isFailure(Schema.decodeUnknownResult(CasoInmobiliarioP4a)({ ...c, inmuebles }, { onExcessProperty: "error" }))).toBe(true)
    }
    expect(Result.isFailure(Schema.decodeUnknownResult(CasoInmobiliarioP4a)({ ...c, trabajo: {} }, { onExcessProperty: "error" }))).toBe(true)
  })
  for (const balears of [false, true]) {
    it.effect("ambas API, consumidor positivo y cuota única " + String(balears), () => Effect.gen(function* () {
      const c = casoP4a(), solicitud = solicitudP4a(balears)
      const caso = { ...c, comunidadAutonoma: balears ? "illes-balears" as const : "canarias" as const,
        inmuebles: c.inmuebles.map(v => ({ ...v, ubicacion: balears ? "illes-balears" as const : "canarias" as const, exigibilidades: v.exigibilidades.map(x => ({ ...x, importe: "36000" })), gastos: v.gastos.map(g => balears ? { ...g, clase: "mejora" as const, puestaEnServicio: "2025-06-01" } : g) })),
        deduccionesTerritoriales2025: { solicitudes: [solicitud] },
      }
      const a = yield* liquidarIrpfAnual(caso, { modo: "canonico" })
      const b = yield* liquidarIrpfAnualExplicito(caso)
      expect(a.baseImponibleGeneral.toFixed()).toBe(b.baseImponibleGeneral.toFixed())
      expect(a.deduccionDA61.isZero()).toBe(true)
      expect(a.reduccionArt20.isZero()).toBe(true)
      const total = a.composicion.deduccionesTerritoriales2025?.total
      if (total === undefined) throw new Error("sin consumidor")
      expect(BigInt(total.numeradorEuros)).toBe(BigInt(balears ? 500 : 100) * BigInt(total.divisor))
      expect(a.composicion.cuotaLiquida.eq(a.composicion.cuotaEstatalDespuesMinimo.plus(a.composicion.cuotaAutonomicaGeneralDespuesMinimo).minus(a.composicion.deduccionesAutonomicasAplicadas))).toBe(true)
    }))
  }
  for (const balears of [false, true]) {
    it.effect("ambas API rechazan consumidor de otro territorio " + String(balears), () => Effect.gen(function* () {
      const c = { ...casoP4a(), comunidadAutonoma: balears ? "illes-balears" as const : "canarias" as const,
        deduccionesTerritoriales2025: { solicitudes: [solicitudP4a(!balears)] } }
      const a = yield* Effect.flip(liquidarIrpfAnual(c, { modo: "canonico" }))
      const b = yield* Effect.flip(liquidarIrpfAnualExplicito(c))
      expect(a._tag).toBe("RechazoP4a")
      expect(b._tag).toBe("RechazoP4a")
    }))
  }

})
