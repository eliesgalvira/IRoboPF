import Decimal from "decimal.js"
import { Schema } from "effect"
import { ViviendaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { evaluarPrimerAlquiler2025 } from "../lib/dominio/irpf/inmobiliario-2025/consumidores"
import type { MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import type { CasoInmobiliarioP4a, InmuebleP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { producirInmueblesP4a, type ExactoP4a } from "../lib/dominio/irpf/inmobiliario-2025/productor"
import { mesesCiviles } from "../lib/dominio/irpf/inmobiliario-2025/primer-alquiler"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoP4a, solicitudP4a } from "./inmobiliario-p4a.fixtures"

function caso(balears = false): CasoInmobiliarioP4a {
  const c = casoP4a(), original = c.inmuebles[0], solicitud = solicitudP4a(balears), regional = solicitud.hechos.viviendas[0]
  if (original === undefined || regional === undefined) throw new Error("fixture P4a ausente")
  const v: InmuebleP4a = { ...original,
    ubicacion: balears ? "illes-balears" : "canarias",
    adquisicion: { ...original.adquisicion, fecha: "2025-01-02" },
    catastro2025: { documento: "IBI2025", suelo: "50000", construccion: "50000" },
    usosDesdeAdquisicion: [{ desde: "2025-01-02", hasta: "2025-06-30", uso: "a-disposicion" }, { desde: "2025-07-01", hasta: "2025-12-31", uso: "alquiler-vivienda" }],
    contrato: { ...original.contrato, firma: "2025-06-28", desde: "2025-07-01", hasta: "2028-07-01" },
    exigibilidades: [7, 8, 9, 10, 11, 12].map(m => ({ id: `R${m}`, documento: `REC${m}`, fecha: `2025-${String(m).padStart(2, "0")}-01`, importe: "1300" })),
    gastos: original.gastos.map(g => ({ ...g, importe: "2000", totalFactura: "2000", fechaOperacion: "2025-08-01", fechaFactura: "2025-09-01", fechaPago: "2025-10-01", periodoDevengo: { desde: "2025-08-01", hasta: "2025-08-01" } })),
    primerAlquiler2025: {
      tituloOneroso: "ESC1", construccionTerminada: "2023-01-01", documentoConstruccion: "FINAL-OBRA",
      historiaInmueble: [{ desde: "2023-01-01", hasta: "2025-01-01", propietario: "vendedor", documento: "HIST-VENDEDOR", uso: "sin-alquiler" }, { desde: "2025-01-02", hasta: "2025-06-30", propietario: "s-1", documento: "HIST-COMPRADOR", uso: "sin-alquiler" }],
      historiaPersonal: { persona: "s-1", nacimiento: "1985-01-01", hasta: "2025-12-31", documento: "HIST-PERSONAL", cobertura: "todos-los-inmuebles-y-medidas-desde-nacimiento", alquileresAnteriores: [], aplicacionesAnteriores: [] },
      censoDerechos: { documento: "CENSO-MUNDIAL", cobertura: "mundial-completo-a-devengo", inmuebles: ["V1"] },
      vinculo: { documento: "VINCULOS", conyuge: false, parejaEquiparada: false, consanguinidad: 0, afinidad: 0 },
      catastroImputacion: { municipio: "MUNICIPIO", documento: "PONENCIA", notificacion: "2012-01-01", procedimiento: "colectivo-general", entradaVigor: "2012-01-01" },
      fianza: { ente: "IBAVI", resguardo: "IBAVI1", fecha: "2025-07-01" },
      superficieUtil: "100", documentoSuperficie: "CEDULA", rentaMensual: [{ concepto: "renta", importe: "1200" }, { concepto: "repercutidos", importe: "100" }], programa: "ordinario",
      observacion: { hasta: "2025-12-31", arrendatario: "inquilino", documento: "OBSERVACION", incidencias: "ninguna" },
    },
  }
  const pago = regional.gastos[0]
  if (pago === undefined) throw new Error("pago P4a ausente")
  return { ...c, comunidadAutonoma: balears ? "illes-balears" : "canarias", inmuebles: [v],
    deduccionesTerritoriales2025: { solicitudes: [{ ...solicitud,
      codigo: balears ? "balears_arrendador_vivienda_permanente_otros_gastos" : "canarias_puesta_viviendas_mercado_arrendamiento",
      hechos: { ...solicitud.hechos, viviendas: [{ ...regional, adquisicion: "2025-01-02", uso: "arrendada",
        alquiler: { ...regional.alquiler, desde: "2025-07-01", hasta: "2028-07-01", rentaMensual: "1300", superficieUtil: "100" },
        historiaContratos: [{ id: "C1", desde: "2025-07-01", hasta: "2028-07-01" }],
        gastos: balears ? [{ ...pago, concepto: "reparacion", importe: "2000", fecha: "2025-10-01" }] : [],
      }] },
    }] },
  }
}
const exacto = (q: ExactoP4a, n: bigint, d = 1n) => expect(q.n * d).toBe(n * q.d)
const cambiar = (c: CasoInmobiliarioP4a, f: (v: InmuebleP4a) => InmuebleP4a): CasoInmobiliarioP4a => ({ ...c, inmuebles: c.inmuebles.map(f) })
describe("P4b primer alquiler y compra en fechas reales", () => {
  it("meses civiles y fin de mes", () => {
    expect(mesesCiviles("2025-01-02", 6)).toBe("2025-07-02")
    expect(mesesCiviles("2025-08-31", 6)).toBe("2026-02-28")
    expect(mesesCiviles("2023-08-31", 6)).toBe("2024-02-29")
  })
  it.effect("180 días imputados;184 alquilados; íntegro7800, amortización441600/365, RNR837700/365", () => Effect.gen(function* () {
    const p = yield* producirInmueblesP4a(caso()), v = p.inmuebles[0]
    if (v === undefined) throw new Error("sin inmueble")
    expect(v.diasImputados).toBe(180); expect(v.diasAlquilados).toBe(184)
    exacto(v.imputacion, 198000n, 365n); exacto(v.integro, 7800n)
    exacto(v.amortizacion, 441600n, 365n); exacto(v.netoReducido, 837700n, 365n)
    expect(v.seguimiento.join()).toContain("pendiente")
  }))
  for (const balears of [false, true]) it.effect("ambas API y cuota única " + balears, () => Effect.gen(function* () {
    const a = yield* liquidarIrpfAnual(caso(balears), { modo: "canonico" }), b = yield* liquidarIrpfAnualExplicito(caso(balears))
    expect(a.baseImponibleGeneral.eq(b.baseImponibleGeneral)).toBe(true)
    expect(a.baseImponibleGeneral.mul(365).minus(1035700).abs().lt("1e-70")).toBe(true)
    const t = a.composicion.deduccionesTerritoriales2025?.total
    if (t === undefined) throw new Error("sin deducción")
    // Base baja: la cuota disponible restringe el teórico1000, nunca se inventa cuota600.
    expect(a.composicion.deduccionesAutonomicasAplicadas.lte(1000)).toBe(true)
    expect(a.composicion.deduccionesAutonomicasAplicadas.lte(a.composicion.cuotaAutonomicaDisponible)).toBe(true)
    expect(a.composicion.cuotaLiquida.eq(a.composicion.cuotaEstatalDespuesMinimo.plus(a.composicion.cuotaAutonomicaGeneralDespuesMinimo).minus(a.composicion.deduccionesAutonomicasAplicadas))).toBe(true)
  }))
  const adversos: readonly [string, (v: InmuebleP4a) => InmuebleP4a][] = [
    ["sin historia vendedor", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, historiaInmueble: [] } })],
    ["alquiler2023 vendedor", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, historiaInmueble: v.primerAlquiler2025.historiaInmueble.map(h => ({ ...h, uso: "alquiler" })) } })],
    ["historia personal ajena", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, historiaPersonal: { ...v.primerAlquiler2025.historiaPersonal, persona: "otro" } } })],
    ["aplicación previa otra vivienda", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, historiaPersonal: { ...v.primerAlquiler2025.historiaPersonal, aplicacionesAnteriores: [{ inmueble: "OTRA", ejercicio: 2024, codigo: "regional", documento: "IRPF24" }] } } })],
    ["inquilino cambiado", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, observacion: { ...v.primerAlquiler2025.observacion, arrendatario: "otro" } } })],
    ["uso habitual no elude conciliación", v => ({ ...v, usosDesdeAdquisicion: v.usosDesdeAdquisicion.map(u => ({ ...u, uso: "personal" })) })],
    ["día duplicado", v => ({ ...v, usosDesdeAdquisicion: [...v.usosDesdeAdquisicion, ...v.usosDesdeAdquisicion] })],
    ["29feb2025", v => ({ ...v, contrato: { ...v.contrato, firma: "2025-02-29" } })],
    ["pago2026", v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, fechaPago: "2026-01-01" })) })],
    ["total factura menor línea", v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, totalFactura: "1000" })) })],
    ["ingreso no conciliado", v => ({ ...v, exigibilidades: v.exigibilidades.map(r => ({ ...r, importe: "1200" })) })],
    ["censo ajeno", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, censoDerechos: { ...v.primerAlquiler2025.censoDerechos, inmuebles: ["OTRA"] } } })],
    ["censo duplicado", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, censoDerechos: { ...v.primerAlquiler2025.censoDerechos, inmuebles: [v.id, v.id] } } })],
    ["historia con hueco", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, historiaInmueble: v.primerAlquiler2025.historiaInmueble.map((h, i) => i === 0 ? { ...h, hasta: "2024-12-31" } : h) } })],
    ["historia sin separar adquisición", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, historiaInmueble: [{ desde: "2023-01-01", hasta: "2025-06-30", propietario: v.titular, documento: "H", uso: "sin-alquiler" }] } })],
    ["nacimiento incompatible", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, historiaPersonal: { ...v.primerAlquiler2025.historiaPersonal, nacimiento: "1986-01-01" } } })],
    ["alquiler personal previo", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, historiaPersonal: { ...v.primerAlquiler2025.historiaPersonal, alquileresAnteriores: [{ inmueble: "OTRA", desde: "2024-01-01", hasta: "2024-12-31", documento: "H" }] } } })],
    ["fianza ajena", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, fianza: { ...v.primerAlquiler2025.fianza, resguardo: "OTRO" } } })],
    ["catastro notificado2026", v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, catastroImputacion: { ...v.primerAlquiler2025.catastroImputacion, notificacion: "2026-01-01" } } })],
    ["periodo mixto no deducible íntegro", v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, periodoDevengo: { desde: "2025-01-02", hasta: "2025-12-31" } })) })],
    ["recibo duplicado", v => ({ ...v, exigibilidades: [...v.exigibilidades, ...v.exigibilidades] })],
    ["fracción de céntimo rechazada", v => ({ ...v, exigibilidades: v.exigibilidades.map(r => ({ ...r, importe: "1300.001" })) })],
  ]
  for (const [nombre, f] of adversos) it.effect(nombre, () => Effect.gen(function* () {
    const e = yield* Effect.flip(producirInmueblesP4a(cambiar(caso(), f)))
    expect(e._tag).toBe("RechazoP4a"); expect(e.motivo.length).toBeGreaterThan(10)
  }))
  for (const [nombre, f] of [
    ["ubicación peninsular", (v: InmuebleP4a) => ({ ...v, ubicacion: "resto-espana" as const })],
    ["cónyuge grado4", (v: InmuebleP4a) => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, vinculo: { ...v.primerAlquiler2025.vinculo, conyuge: true, consanguinidad: 4 } } })],
    ["contrato2años", (v: InmuebleP4a) => ({ ...v, contrato: { ...v.contrato, hasta: "2027-07-01" } })],
  ] as const) it.effect(nombre, () => Effect.gen(function* () {
    const rechazo = yield* Effect.flip(liquidarIrpfAnual(cambiar(caso(), f), { modo: "canonico" }))
    expect(rechazo).toBeDefined()
  }))
  it.effect("P4a original conserva4300 y cero imputación", () => Effect.gen(function* () {
    const p = yield* producirInmueblesP4a(casoP4a()); exacto(p.netoReducido, 4300n); exacto(p.imputacion, 0n)
  }))
})

// Prueba del puerto INTERNO: estas bases no son entradas admitidas por las API públicas.
function magnitudes(inmuebles: MagnitudesTerritorialesAnuales["inmueblesP4a"], base = "52800"): MagnitudesTerritorialesAnuales {
  return { inmueblesP4a: inmuebles,
    caso: { anio: 2025, comunidadAutonoma: "illes-balears", contribuyenteId: "s-1", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
    baseGeneral: new Decimal(base), baseAhorro: new Decimal(0), minimoPersonalFamiliar: new Decimal(5550), cuotaAutonomica: new Decimal(10000), sujetosConMinimo: [],
  }
}
describe("P4b deducción teórica y fronteras adversas del puerto interno", () => {
  for (const [gasto, esperado] of [["2000", "1000"], ["3000", "1500"], ["3600", "1500"]] as const) it.effect("base" + gasto + " agregado1500", () => Effect.gen(function* () {
    const c = cambiar(caso(true), v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, importe: gasto, totalFactura: gasto })) }))
    const p = yield* producirInmueblesP4a(c)
    const raw = c.deduccionesTerritoriales2025?.solicitudes[0]
    const solicitud = Schema.decodeUnknownSync(ViviendaC36)(raw)
    const s = { ...solicitud, hechos: { ...solicitud.hechos, viviendas: solicitud.hechos.viviendas.map(v => ({ ...v, gastos: v.gastos.map(g => ({ ...g, importe: gasto })) })) } }
    const r = evaluarPrimerAlquiler2025(s, magnitudes(p.inmuebles))
    if (r.estado !== "calculo_parcial") throw new Error("sin cálculo")
    expect(BigInt(r.importeExacto.numerador)).toBe(BigInt(esperado) * BigInt(r.importeExacto.denominador))
    expect(() => evaluarPrimerAlquiler2025(s, magnitudes(p.inmuebles, "52800.01"))).toThrow("52800")
    const sinFianza = p.inmuebles.map(r => ({ ...r, inmueble: { ...r.inmueble, primerAlquiler2025: r.inmueble.primerAlquiler2025 && { ...r.inmueble.primerAlquiler2025, fianza: { ...r.inmueble.primerAlquiler2025.fianza, ente: "otro" } } } }))
    expect(() => evaluarPrimerAlquiler2025(s, magnitudes(sinFianza))).toThrow("IBAVI")
  }))
  it.effect("renta todos conceptos:1500 admite y1500.01 excluye", () => Effect.gen(function* () {
    const p = yield* producirInmueblesP4a(caso(true)), original = Schema.decodeUnknownSync(ViviendaC36)(caso(true).deduccionesTerritoriales2025?.solicitudes[0])
    for (const renta of ["1500", "1500.01"]) {
      const inmuebles = p.inmuebles.map(r => ({ ...r, inmueble: { ...r.inmueble, primerAlquiler2025: r.inmueble.primerAlquiler2025 && { ...r.inmueble.primerAlquiler2025, rentaMensual: [{ concepto: "todos", importe: renta }] } } }))
      const s = { ...original, hechos: { ...original.hechos, viviendas: original.hechos.viviendas.map(v => ({ ...v, alquiler: v.alquiler && { ...v.alquiler, rentaMensual: renta } })) } }
      if (renta === "1500") expect(evaluarPrimerAlquiler2025(s, magnitudes(inmuebles)).estado).toBe("calculo_parcial")
      else expect(() => evaluarPrimerAlquiler2025(s, magnitudes(inmuebles))).toThrow("15 euros")
    }
  }))
  it.effect("Canarias frontera2julio y exceso3julio", () => Effect.gen(function* () {
    const p = yield* producirInmueblesP4a(caso()), original = Schema.decodeUnknownSync(ViviendaC36)(caso().deduccionesTerritoriales2025?.solicitudes[0])
    for (const dia of ["02", "03"]) {
      const desde = `2025-07-${dia}`, hasta = `2028-07-${dia}`
      const inmuebles = p.inmuebles.map(r => ({ ...r, inmueble: { ...r.inmueble, contrato: { ...r.inmueble.contrato, desde, hasta } } }))
      const s = { ...original, hechos: { ...original.hechos, viviendas: original.hechos.viviendas.map(v => ({ ...v, alquiler: v.alquiler && { ...v.alquiler, desde, hasta }, historiaContratos: [{ id: "C1", desde, hasta }] })) } }
      if (dia === "02") expect(evaluarPrimerAlquiler2025(s, magnitudes(inmuebles)).estado).toBe("calculo_parcial")
      else expect(() => evaluarPrimerAlquiler2025(s, magnitudes(inmuebles))).toThrow("seis meses")
    }
  }))
})

describe("P4b positivos monetarios en API públicas con cuota suficiente", () => {
  for (const balears of [false, true]) it.effect("aplica1000 una sola vez " + balears, () => Effect.gen(function* () {
    const c = cambiar(caso(balears), v => ({ ...v,
      exigibilidades: v.exigibilidades.map(r => ({ ...r, importe: "13000" })),
      primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, superficieUtil: "1000", rentaMensual: [{ concepto: "todos", importe: "13000" }] },
    }))
    const s = Schema.decodeUnknownSync(ViviendaC36)(c.deduccionesTerritoriales2025?.solicitudes[0])
    const entrada = { ...c, deduccionesTerritoriales2025: { solicitudes: [{ ...s, hechos: { ...s.hechos, viviendas: s.hechos.viviendas.map(v => ({ ...v, alquiler: v.alquiler && { ...v.alquiler, rentaMensual: "13000", superficieUtil: "1000" } })) } }] } }
    for (const effect of [liquidarIrpfAnual(entrada, { modo: "canonico" }), liquidarIrpfAnualExplicito(entrada)]) {
      const r = yield* effect
      expect(r.composicion.deduccionesAutonomicasAplicadas.eq(1000)).toBe(true)
      expect(r.composicion.cuotaLiquida.eq(r.composicion.cuotaEstatalDespuesMinimo.plus(r.composicion.cuotaAutonomicaGeneralDespuesMinimo).minus(1000))).toBe(true)
    }
  }))
  it.effect("alquiler16julio:169 días reales y195 a disposición", () => Effect.gen(function* () {
    const c = cambiar(caso(), v => ({ ...v, contrato: { ...v.contrato, desde: "2025-07-16" },
      usosDesdeAdquisicion: [{ desde: "2025-01-02", hasta: "2025-07-15", uso: "a-disposicion" }, { desde: "2025-07-16", hasta: "2025-12-31", uso: "alquiler-vivienda" }],
      exigibilidades: v.exigibilidades.map((r, i) => ({ ...r, fecha: i === 0 ? "2025-07-16" : r.fecha, importe: i === 0 ? "672" : "1302" })),
      primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, rentaMensual: [{ concepto: "todos", importe: "1302" }], historiaInmueble: v.primerAlquiler2025.historiaInmueble.map((h, i) => i === 1 ? { ...h, hasta: "2025-07-15" } : h) },
    }))
    const p = yield* producirInmueblesP4a(c), v = p.inmuebles[0]
    if (v === undefined) throw new Error("sin inmueble")
    expect(v.diasImputados).toBe(195); expect(v.diasAlquilados).toBe(169)
    exacto(v.imputacion, 214500n, 365n); exacto(v.amortizacion, 405600n, 365n); exacto(v.integro, 7182n)
  }))
})

describe("P4b imputación versionada2025", () => {
  for (const [entradaVigor, numerador] of [["2011-12-31", 360000n], ["2012-01-01", 198000n]] as const) it.effect(entradaVigor, () => Effect.gen(function* () {
    const c = cambiar(caso(), v => ({ ...v, primerAlquiler2025: v.primerAlquiler2025 && { ...v.primerAlquiler2025, catastroImputacion: { ...v.primerAlquiler2025.catastroImputacion, entradaVigor } } }))
    const p = yield* producirInmueblesP4a(c); exacto(p.imputacion, numerador, 365n)
  }))
})

describe("P4b conservación de fracciones y consumo único", () => {
  it.effect("precisión global6 no reduce la base racional ni la retención fraccionaria", () => Effect.gen(function* () {
    const original = Decimal.precision
    try {
      Decimal.set({ precision: 6 })
      const c = { ...caso(), retenciones: [{ id: "RET", documento: "RET-DOC", fecha: "2025-12-31", importe: "0.01" }] }
      const a = yield* liquidarIrpfAnual(c, { modo: "canonico" })
      const b = yield* liquidarIrpfAnualExplicito(c)
      const D80 = Decimal.clone({ precision: 80 })
      const esperado = new D80(1035700).div(365)
      expect(a.baseImponibleGeneral.toString()).toBe(esperado.toString())
      expect(b.baseImponibleGeneral.toString()).toBe(esperado.toString())
      expect(a.cuotaDiferencial.toString()).toBe(a.composicion.cuotaPosterior.minus("0.01").toString())
      expect(a.composicion.deduccionesAutonomicasAplicadas.isZero()).toBe(true)
      exacto(a.imputacion, 198000n, 365n)
    } finally { Decimal.set({ precision: original }) }
  }))
  it.effect("solicitud duplicada no consume dos veces la cuota", () => Effect.gen(function* () {
    const c = caso(), s = c.deduccionesTerritoriales2025?.solicitudes[0]
    if (s === undefined) throw new Error("sin solicitud")
    const rechazo = yield* Effect.flip(liquidarIrpfAnual({ ...c, deduccionesTerritoriales2025: { solicitudes: [s, s] } }, { modo: "canonico" }))
    expect(rechazo).toBeDefined()
  }))
})
