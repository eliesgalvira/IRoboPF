import aragon02 from "../docs/procedencia/simuladores/medicion-2025/conjuntas-preparacion/datos/open2025-aragon-02-v2.json"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import entradas from "../docs/procedencia/implementaciones/conjunta-ordinaria-2025/entradas-candidatas.json"
import { CasoConjunta2025 } from "../lib/dominio/irpf/conjunta-2025/contrato"
import { prepararConjunta2025 } from "../lib/dominio/irpf/conjunta-2025/preparar"
import { seleccionarCuantizacionConjunta } from "../lib/dominio/irpf/conjunta-2025/politica-cuantizacion"
import { liquidarConjunta2025 } from "../lib/dominio/irpf/conjunta-2025/anual"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

const A = Decimal.clone({ precision: 80 })
// Sólo expedientes sintéticos existentes; no se reescriben entradas ni oráculos.
const entrada = (id: string) => Schema.decodeUnknownSync(CasoConjunta2025)(
  id === "open2025-aragon-02-v2" ? aragon02.entradaCandidata : entradas.casos.find(c => c.id === id)!.entradaCandidata
)
const composicion = (c: CasoConjunta2025): EntradaComposicionAnual => {
  const p = prepararConjunta2025(c)
  return {
    conjunta2025: c,
    ambito: { anio: 2025, comunidadAutonoma: c.comunidadAutonoma, contribuyenteId: c.declarante.id,
      situacionFamiliar: { tipo: "conjunta", edad: p.edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
    cotizaciones: { naturaleza: "efectivas", trabajador: p.cotizaciones }, precision: 80,
    politica: "decimal-hasta-salida", origenBaseGeneralB: "solo-trabajo",
    baseGeneral: p.base.general, baseAhorro: new A(0), rentasAntesReducciones: p.base.rentaAntesReducciones!,
    rentasTrabajoAnuales: { integroTrabajo: p.bruto, restoRentas: new A(0) },
    minimosEstatales: MINIMOS_ESTATALES_2025, deduccionesAutonomicasCentimos: 0, serviciosLaborales: { bruto: p.bruto },
  }
}

// SES/PDF reconstruidos documentalmente: orden Gs,Ga,Ms,Ma; Ns,Na; resultado.
// Tres discrepantes previos y cinco conservados. No son resultados de esta suite.
it.each([
  ["aragon-01", ["4635.63", "4538.14", "1021.25", "1021.25"], ["3614.38", "3516.89"], "-1368.73"],
  ["aragon-02-v2", ["4981.58", "4874.12", "1021.25", "1021.25"], ["3960.33", "3852.87"], "1233.20"],
  ["castilla-la-mancha-02", ["2480.25", "2480.25", "1021.25", "1021.25"], ["1459.00", "1459.00"], "-1282.00"],
  ["castilla-y-leon-01", ["2480.25", "2393.50", "1021.25", "967.50"], ["1459.00", "1426.00"], "-1315.00"],
  ["comunitat-valenciana-02", ["7230.25", "7270.00", "1021.25", "1064.25"], ["6209.00", "6205.75"], "-1585.25"],
  ["galicia-01", ["7230.25", "7067.96", "1021.25", "1009.08"], ["6209.00", "6058.88"], "-1732.12"],
  ["illes-balears-01", ["2480.25", "2462.63", "1021.25", "984.38"], ["1459.00", "1478.25"], "-1262.75"],
  ["murcia-01", ["4635.63", "4364.98", "1021.25", "1021.25"], ["3614.38", "3343.73"], "-1541.89"],
] as const)("componentes, netas, pagos y rastro %s", (id, gravamenes, netas, resultado) => {
  const c = entrada(`open2025-${id}`)
  const r = Effect.runSync(liquidarConjunta2025(c))
  const comp = Effect.runSync(componerLiquidacionAnual(composicion(c)))
  expect(r.politicaCuantizacion).toBe("conjunta-2025-componentes-half-up")
  expect(Object.values(r.gravamenes).map(v => new A(v).toFixed(2))).toEqual(gravamenes)
  expect(Object.values(r.cuotasNetas).map(v => new A(v).toFixed(2))).toEqual(netas)
  expect(r.cuotaDiferencialPresentada).toBe(resultado)
  expect(new A(r.cuotaDiferencial).eq(resultado)).toBe(true)
  expect(new A(r.cuotaPosterior).minus(r.retenciones).eq(resultado)).toBe(true)
  expect(new A(r.cuotasNetas.estatal).plus(r.cuotasNetas.autonomica).eq(r.cuotaPosterior)).toBe(true)
  // B calculada desde operandos sin cuantizar del desglose: reserva A=B.
  const total = (xs: typeof comp.desgloseCuotaIntegraGeneralEstatal) => xs.reduce((s,x) => s.plus(x.cuota),new A(0))
  const q = (x: Decimal) => x.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
  expect(q(total(comp.desgloseCuotaIntegraGeneralEstatal).minus(total(comp.desgloseCuotaMinimoPersonalEstatal)))
    .plus(q(total(comp.desgloseCuotaIntegraGeneralAutonomica).minus(total(comp.desgloseCuotaMinimoPersonalAutonomica))))
    .eq(r.cuotaPosterior)).toBe(true)
  const texto = r.rastro.pasos[0].descripcion
  expect(texto).toContain("equivalentes")
  expect(texto).not.toContain("Sin evidencia Open conjunta")
  expect(r.rastro.pasos[0].lineasCalculo).toHaveLength(12)
  expect(r.aceptacionFiscal).toBe("pendiente")
})

it("BLG inferior al mínimo mantiene los gravámenes decimales sin cuantizar", () => {
  const c = structuredClone(entrada("open2025-murcia-01"))
  Object.assign(c.economia.trabajo.rendimientos[0].cotizaciones, { seguridadSocial: "30000.01" })
  const r = Effect.runSync(liquidarConjunta2025(c))
  expect(new A(r.baseLiquidableGeneral).lt(r.minimos.estatal)).toBe(true)
  expect(r.politicaCuantizacion).toBe("decimal-hasta-salida")
  expect(new A(r.gravamenes.baseEstatal).decimalPlaces()).toBeGreaterThan(2)
  expect(r.gravamenes.baseEstatal).toBe(r.gravamenes.minimoEstatal)
  expect(r.cuotaPosterior).toBe("0")
  expect(r.rastro.pasos[0].descripcion).toContain("Precisión decimal hasta salida. Fuera de la frontera de cuantización por componentes")
})

it("Balears fuera de equivalencia conserva ruta anterior; pagos no centesimales también", () => {
  const c = structuredClone(entrada("open2025-illes-balears-01"))
  Object.assign(c.economia.trabajo.rendimientos[0].cotizaciones, { seguridadSocial: "1950.01" })
  const r = Effect.runSync(liquidarConjunta2025(c))
  expect(r.politicaCuantizacion).toBe("decimal-hasta-salida")
  const m = structuredClone(entrada("open2025-murcia-01"))
  Object.assign(m.economia.retenciones[0], { importe: "8500.001" })
  expect(() => Effect.runSync(liquidarConjunta2025(m))).toThrow()
})

it.each(["open2025-madrid-02"])("monoparental %s mantiene exactos los operandos anteriores", id => {
  const c = entrada(id)
  const r = Effect.runSync(liquidarConjunta2025(c))
  expect(r.politicaCuantizacion).toBe("decimal-hasta-salida")
  const e = composicion(c)
  const comp = Effect.runSync(componerLiquidacionAnual(e))
  const suma = (xs: typeof comp.desgloseCuotaIntegraGeneralEstatal) => xs.reduce((s,x) => s.plus(x.cuota),new A(0))
  expect(comp.cuotaIntegraGeneralEstatal.eq(suma(comp.desgloseCuotaIntegraGeneralEstatal))).toBe(true)
  expect(comp.cuotaIntegraGeneralAutonomica.eq(suma(comp.desgloseCuotaIntegraGeneralAutonomica))).toBe(true)
})

it("sin contrato no selecciona; ahorro y deducciones siguen fuera del contrato", () => {
  expect(seleccionarCuantizacionConjunta(undefined, new A(36675),new A(10750),new A(10750))).toBeUndefined()
  const e = composicion(entrada("open2025-murcia-01"))
  expect(() => Effect.runSync(componerLiquidacionAnual({...e, baseAhorro: new A(1)}))).toThrow()
  expect(() => Effect.runSync(componerLiquidacionAnual({...e, deduccionesAutonomicasCentimos: 1}))).toThrow()
  const individual: EntradaComposicionAnual = { ...e, conjunta2025: undefined,
    ambito: {...e.ambito, situacionFamiliar: {...e.ambito.situacionFamiliar, tipo: "individual"}} }
  const r = Effect.runSync(componerLiquidacionAnual(individual))
  expect(r.politicaCuantizacionConjunta).toBeUndefined()
  // Discriminante individual: BIG sin reducción matrimonial, gravamen no cuantizado.
  expect(r.cuotaIntegraGeneralEstatal.toFixed()).toBe("5264.625")
})

// Oráculo racional independiente, acotado a la fila publicada 35200..53407.20.
// Coeficientes AEAT 2025 pp.942 y 947-948; no llama a escalas del producto.
const cocienteCentimos = (n: bigint, den: bigint): bigint => n / den + (2n * (n % den) >= den ? 1n : 0n)
const oraculoCyL = (baseCentimos: bigint, pagosCentimos: bigint): string => {
  const exceso = baseCentimos - 3520000n
  const estatal = cocienteCentimos(436275000n + exceso * 185n, 1000n) - 102125n
  const autonomica = cocienteCentimos(415050000n + exceso * 185n, 1000n) - 96750n
  return new A(String(estatal + autonomica - pagosCentimos)).div(100).toFixed(2)
}
it.each(["2924.99", "2925.00", "2925.01"])("monoparental cuantizado: importe adverso SS=%s", ss => {
  const c = structuredClone(entrada("open2025-castilla-y-leon-03"))
  Object.assign(c.economia.trabajo.rendimientos[0].cotizaciones, { seguridadSocial: ss })
  const r = Effect.runSync(liquidarConjunta2025(c))
  const b = 4500000n - BigInt(ss.replace(".", "")) - 200000n - 215000n
  expect(r.baseLiquidableGeneral).toBe(new A(String(b)).div(100).toFixed())
  expect(r.politicaCuantizacion).toBe("conjunta-2025-componentes-half-up")
  expect(r.cuotaDiferencialPresentada).toBe(oraculoCyL(b, 850000n))
  expect(new A(r.cuotasNetas.estatal).plus(r.cuotasNetas.autonomica).eq(r.cuotaPosterior)).toBe(true)
  expect(new A(r.cuotaPosterior).minus(r.retenciones).eq(r.cuotaDiferencial)).toBe(true)
  expect(r.rastro.pasos[0].descripcion).toContain("equivalentes")
  expect(r.aceptacionFiscal).toBe("pendiente")
})
it("CyL03 componentes originales y pagos descontados una vez", () => {
  const c = structuredClone(entrada("open2025-castilla-y-leon-03"))
  const r = Effect.runSync(liquidarConjunta2025(c))
  expect(Object.values(r.gravamenes).map(v=>new A(v).toFixed(2))).toEqual(["4866.88","4654.63","1021.25","967.50"])
  expect(Object.values(r.cuotasNetas).map(v=>new A(v).toFixed(2))).toEqual(["3845.63","3687.13"])
  expect(r.cuotaDiferencialPresentada).toBe("-967.24")
  Object.assign(c, { unidadId: "unidad-sintetica-alternativa" })
  Object.assign(c.declarante, { unidadId: c.unidadId })
  Object.assign(c.hijos[0], { unidadId: c.unidadId })
  Object.assign(c.economia.retenciones[0], { importe: "8500.01" })
  const cambiado = Effect.runSync(liquidarConjunta2025(c))
  expect(cambiado.gravamenes).toEqual(r.gravamenes)
  expect(cambiado.cuotaDiferencialPresentada).toBe(oraculoCyL(3792500n,850001n))
})
it("frontera nominal monoparental: igualdad incluida, inferior excluida", () => {
  const p = prepararConjunta2025(entrada("open2025-castilla-y-leon-03"))
  expect(seleccionarCuantizacionConjunta(p,new A(10750),new A(10750),new A(10750))).toBeDefined()
  expect(seleccionarCuantizacionConjunta(p,new A("10749.99"),new A(10750),new A(10750))).toBeUndefined()
})
it("Madrid monoparental conserva el resultado y la política previa", () => {
  const r = Effect.runSync(liquidarConjunta2025(entrada("open2025-madrid-02")))
  expect(r.cuotaDiferencialPresentada).toBe("-1823.80")
  expect(r.politicaCuantizacion).toBe("decimal-hasta-salida")
})

it.each(["baseGeneral", "rentasAntesReducciones"] as const)("rechaza %s contradictoria antes de cuantizar", campo => {
  const e = composicion(entrada("open2025-castilla-y-leon-03"))
  const r = Effect.runSync(Effect.result(componerLiquidacionAnual({ ...e, [campo]: e[campo].plus(".01") })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) {
    expect(r.failure._tag).toBe("ResultadoNoSoportado")
    expect(r.failure.motivo).toContain("magnitudes contradictorias")
  }
})

it("rechaza cotización contradictoria antes de cuantizar", () => {
  const e = composicion(entrada("open2025-castilla-y-leon-03"))
  const r = Effect.runSync(Effect.result(componerLiquidacionAnual({ ...e,
    cotizaciones: { ...e.cotizaciones, trabajador: e.cotizaciones.trabajador.plus(".01") },
  })))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) {
    expect(r.failure._tag).toBe("ResultadoNoSoportado")
    expect(r.failure.motivo).toContain("magnitudes contradictorias")
  }
})

it.each(["convive", "incluyeHijoOtraConjunta", "derechoMinimo", "dependenciaEconomica", "alimentosJudiciales"])("no convierte %s externo en un hecho acreditado por B/SI", campo => {
  const c = structuredClone(entrada("open2025-castilla-y-leon-03"))
  Object.assign(c.otroProgenitorExterno!, { [campo]: true })
  expect(() => Effect.runSync(liquidarConjunta2025(c))).toThrow()
})
