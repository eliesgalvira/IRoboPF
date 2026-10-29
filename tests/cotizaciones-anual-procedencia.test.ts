import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import { sinDiscapacidad } from "../lib/dominio/irpf/caso-fiscal-anual"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

const caso = (
  anio: CasoFiscalAnual["anio"],
  salarioCentimos: number
): CasoFiscalAnual => ({
  anio,
  comunidadAutonoma: "simulada-estatal",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    discapacidad: sinDiscapacidad,
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: { trabajo: [{ importeIntegroCentimos: salarioCentimos }] },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})

describe("cotizaciones integradas en liquidación anual", () => {
  it("2018: base por período y mismo gasto en el rendimiento", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(caso(2018, 5_000_000), { modo: "canonico" })
    )
    expect(r.cotizacionTrabajadorCentimos).toBe(287508)
    expect(r.cotizacionEmpresarialCentimos).toBe(1421695)
    expect(r.rendimientoNetoTrabajoCentimos).toBe(4512492)
  })
  it("2025: reparto publicado en resultados y explicación", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(caso(2025, 6_480_540), { modo: "canonico" })
    )
    expect(r.solidaridadEmpresarialCentimos).toBe(4536)
    expect(r.solidaridadTrabajadorCentimos).toBe(884)
    const text = JSON.stringify(r.rastro)
    expect(text).not.toContain("5/6 de la cuota")
    expect(text).toContain("mensualidades uniformes")
  })
  it("conserva cotizaciones del modo compatible-legacy", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(caso(2018, 5_000_000), { modo: "compatible-legacy" })
    )
    expect(r.cotizacionTrabajadorCentimos).toBe(285841)
  })
})
