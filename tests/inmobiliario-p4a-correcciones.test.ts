import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import type { CasoInmobiliarioP4a } from "../lib/dominio/irpf/inmobiliario-2025/contrato"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoP4a as casoBaseP4a, solicitudP4a } from "./inmobiliario-p4a.fixtures"

/** Copias mutables locales de los hechos que cada adverso modifica. */
function casoP4a() {
  const caso = casoBaseP4a()
  return { ...caso, inmuebles: caso.inmuebles.map(v => ({ ...v,
    gastos: v.gastos.map(g => ({ ...g })),
    exigibilidades: v.exigibilidades.map(r => ({ ...r })),
  })) }
}

function primero<A>(items: readonly A[]): A {
  const item = items[0]
  if (item === undefined) throw new Error("Fixture incompleta")
  return item
}
const apis = [
  (caso: CasoInmobiliarioP4a) => liquidarIrpfAnual(caso, { modo: "canonico" }),
  (caso: CasoInmobiliarioP4a) => liquidarIrpfAnualExplicito(caso),
]
function regional(balears = true) {
  const caso = casoP4a(), solicitud = solicitudP4a(balears), inmueble = primero(caso.inmuebles)
  caso.comunidadAutonoma = balears ? "illes-balears" : "canarias"
  inmueble.ubicacion = caso.comunidadAutonoma
  primero(inmueble.exigibilidades).importe = "36000"
  if (balears) inmueble.gastos = inmueble.gastos.map(g => ({ ...g, clase: "mejora", puestaEnServicio: "2025-06-01" }))
  caso.deduccionesTerritoriales2025 = { solicitudes: [solicitud] }
  return { caso, solicitud, inmueble }
}

describe("P4a: correcciones de la primera revisión", () => {
  for (const [indice, api] of apis.entries()) {
    it.effect(`R1 rechaza habitual propia aunque coincidan identidad y pago; API ${indice}`, () => Effect.gen(function* () {
      const { caso, solicitud } = regional()
      caso.deduccionesTerritoriales2025 = { solicitudes: [{ ...solicitud, hechos: { ...solicitud.hechos,
        viviendas: solicitud.hechos.viviendas.map(v => ({ ...v, uso: "habitual_propia" as const })),
      } }] }
      const error = yield* Effect.flip(api(caso))
      expect(error._tag).toBe("ResultadoNoSoportado")
    }))
    it.effect(`R1 preserva rechazo del reproductor fantasma; API ${indice}`, () => Effect.gen(function* () {
      const { caso, solicitud } = regional()
      caso.deduccionesTerritoriales2025 = { solicitudes: [{ ...solicitud, hechos: { ...solicitud.hechos,
        viviendas: solicitud.hechos.viviendas.map(v => ({ ...v, uso: "habitual_propia" as const, id: "FANTASMA", catastro: "OTRA-RC",
          alquiler: { ...v.alquiler, arrendatario: "s-1" },
          gastos: v.gastos.map(g => ({ ...g, id: "P-FANTASMA", factura: "F-FANTASMA", importe: "10000" })),
        })),
      } }] }
      const error = yield* Effect.flip(api(caso))
      expect(error._tag).toBe("ResultadoNoSoportado")
    }))
    it.effect(`R2 servicio mayo, factura junio y pago julio; API ${indice}`, () => Effect.gen(function* () {
      const { caso, solicitud, inmueble } = regional()
      const gasto = primero(inmueble.gastos)
      gasto.puestaEnServicio = "2025-05-01"
      gasto.fechaOperacion = "2025-05-01"
      gasto.fechaPago = "2025-07-01"
      primero(primero(solicitud.hechos.viviendas).gastos).fecha = "2025-07-01"
      const r = yield* api(caso), amortizacion = primero(r.inmuebles).amortizacion
      // 2400 + 1000 * 3% * 245 / 365; mismo oráculo racional de R2.
      expect(amortizacion.n * 365n).toBe(883350n * amortizacion.d)
      const total = r.composicion.deduccionesTerritoriales2025?.total
      expect(total).toBeDefined()
      if (total === undefined) throw new Error("Sin deducción")
      expect(BigInt(total.numeradorEuros)).toBe(500n * BigInt(total.divisor))
    }))
    it.effect(`R2 el consumidor concilia pago, no fecha de factura; API ${indice}`, () => Effect.gen(function* () {
      const { caso, inmueble } = regional()
      primero(inmueble.gastos).fechaPago = "2025-07-01"
      const error = yield* Effect.flip(api(caso))
      expect(error._tag).toBe("ResultadoNoSoportado")
    }))
    it.effect(`R3 factura con reparación600 y servicios400; API ${indice}`, () => Effect.gen(function* () {
      const caso = casoP4a(), inmueble = primero(caso.inmuebles), gasto = primero(inmueble.gastos)
      inmueble.gastos = [{ ...gasto, importe: "600" }, { ...gasto, id: "P2", lineaFactura: "2", importe: "400", clase: "servicios" }]
      const r = yield* api(caso)
      expect(r.netoReducido.n).toBe(4300n * r.netoReducido.d)
    }))
    it.effect(`R3 ambas partidas de factura también llegan al consumidor; API ${indice}`, () => Effect.gen(function* () {
      const { caso, solicitud, inmueble } = regional(false), gasto = primero(inmueble.gastos)
      inmueble.gastos = [{ ...gasto, importe: "600" }, { ...gasto, id: "P2", lineaFactura: "2", importe: "400" }]
      const vivienda = primero(solicitud.hechos.viviendas), pago = primero(vivienda.gastos)
      vivienda.gastos = [{ ...pago, importe: "600" }, { ...pago, id: "P2", importe: "400" }]
      const r = yield* api(caso), total = r.composicion.deduccionesTerritoriales2025?.total
      if (total === undefined) throw new Error("Sin deducción")
      expect(BigInt(total.numeradorEuros)).toBe(100n * BigInt(total.divisor))
    }))
    it.effect(`R3 factura recapitulativa para dos inmuebles; API ${indice}`, () => Effect.gen(function* () {
      const caso = casoP4a(), inmueble = primero(caso.inmuebles), gasto = primero(inmueble.gastos)
      inmueble.gastos = [{ ...gasto, importe: "600" }]
      caso.inmuebles.push({ ...inmueble, id: "V2", catastro: "RC2",
        contrato: { ...inmueble.contrato, id: "C2", documento: "CONTRATO2" },
        exigibilidades: inmueble.exigibilidades.map(r => ({ ...r, id: "R2", documento: "EXIGIBLE2" })),
        gastos: [{ ...gasto, id: "P2", lineaFactura: "2", importe: "400", clase: "servicios" }],
      })
      const r = yield* api(caso)
      expect(r.netoReducido.n).toBe(9100n * r.netoReducido.d)
    }))
    it.effect(`R3 rechaza repetir línea con un ID de operación nuevo; API ${indice}`, () => Effect.gen(function* () {
      const caso = casoP4a(), inmueble = primero(caso.inmuebles), gasto = primero(inmueble.gastos)
      inmueble.gastos = [{ ...gasto, importe: "500" }, { ...gasto, id: "P2", importe: "500" }]
      const error = yield* Effect.flip(api(caso))
      expect(error._tag).toBe("RechazoP4a")
    }))
    for (const ubicacion of ["canarias", "resto-espana"] as const) {
      it.effect(`R4 residencia balear no prueba ubicación ${ubicacion}; API ${indice}`, () => Effect.gen(function* () {
        const { caso, inmueble } = regional()
        inmueble.ubicacion = ubicacion
        const error = yield* Effect.flip(api(caso))
        expect(error._tag).toBe("ResultadoNoSoportado")
      }))
    }
    it.effect(`R4 inmueble balear: positivo500 y consumo único; API ${indice}`, () => Effect.gen(function* () {
      const { caso } = regional()
      const r = yield* api(caso), total = r.composicion.deduccionesTerritoriales2025?.total
      if (total === undefined) throw new Error("Sin deducción")
      expect(BigInt(total.numeradorEuros)).toBe(500n * BigInt(total.divisor))
      expect(r.composicion.cuotaLiquida.eq(r.composicion.cuotaEstatalDespuesMinimo.plus(r.composicion.cuotaAutonomicaGeneralDespuesMinimo).minus(r.composicion.deduccionesAutonomicasAplicadas))).toBe(true)
    }))
    it.effect(`R4 sin consumidor, residencia balear admite inmueble exterior; API ${indice}`, () => Effect.gen(function* () {
      const caso = casoP4a()
      caso.comunidadAutonoma = "illes-balears"
      primero(caso.inmuebles).ubicacion = "resto-espana"
      const r = yield* api(caso)
      expect(r.netoReducido.n).toBe(4300n * r.netoReducido.d)
    }))
    it.effect(`facturas incoherentes o superiores al documento se rechazan; API ${indice}`, () => Effect.gen(function* () {
      for (const cambio of [{ totalFactura: "900" }, { fechaFactura: "2025-05-30" }]) {
        const caso = casoP4a(), inmueble = primero(caso.inmuebles), gasto = primero(inmueble.gastos)
        inmueble.gastos = [{ ...gasto, importe: "600" }, { ...gasto, id: "P2", lineaFactura: "2", importe: "400", ...cambio }]
        const error = yield* Effect.flip(api(caso))
        expect(error._tag).toBe("RechazoP4a")
      }
      const caso = casoP4a()
      primero(primero(caso.inmuebles).gastos).importe = "1000.01"
      const error = yield* Effect.flip(api(caso))
      expect(error._tag).toBe("RechazoP4a")
    }))
    it.effect(`fecha de servicio fuera2025 nunca crea amortización; API ${indice}`, () => Effect.gen(function* () {
      for (const fecha of ["2024-12-31", "2026-01-01", "2025-02-30"]) {
        const { caso, inmueble } = regional()
        primero(inmueble.gastos).puestaEnServicio = fecha
        const error = yield* Effect.flip(api(caso))
        expect(error._tag).toBe("RechazoP4a")
      }
    }))
    it.effect(`identidad de factura incluye el prestador; API ${indice}`, () => Effect.gen(function* () {
      const caso = casoP4a(), inmueble = primero(caso.inmuebles), gasto = primero(inmueble.gastos)
      inmueble.gastos.push({ ...gasto, id: "P2", prestadorNif: "B87654321" })
      const r = yield* api(caso)
      expect(r.netoReducido.n).toBe(3800n * r.netoReducido.d)
    }))
  }
})
