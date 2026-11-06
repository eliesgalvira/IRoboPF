import { Effect, Result } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { producirRentaExentaFamiliar2025 } from "../lib/dominio/irpf/deducciones/ext-familiar-productor-2025"
import type { HechosFamiliarExentoExt2025 } from "../lib/dominio/irpf/deducciones/ext-familiar-contrato-2025"
import { entradasExtExigibilidad as originales } from "./ext-exigibilidad.fixtures"

const solicitud = originales.canonica.deduccionesTerritoriales2025.solicitudes[0]
const hechos = solicitud.hechos
const apis = [
  { nombre: "canónica", ejecutar: (h: HechosFamiliarExentoExt2025) => Effect.runSync(Effect.result(liquidarIrpfAnual({ ...originales.canonica,
    deduccionesTerritoriales2025: { solicitudes: [{ ...solicitud, hechos: h }] },
  }, { modo: "canonico" }))) },
  { nombre: "explícita", ejecutar: (h: HechosFamiliarExentoExt2025) => Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...originales.explicita,
    deduccionesTerritoriales2025: { solicitudes: [{ ...solicitud, hechos: h }] },
  }))) },
]
function conExigibilidad(exigibleEl: string): HechosFamiliarExentoExt2025 {
  return { ...hechos, familiar: { ...hechos.familiar, economia: { ...hechos.familiar.economia,
    prestaciones: hechos.familiar.economia.prestaciones.map(p => ({ ...p,
      efectosDesde: "2025-06-01", efectosHasta: "2025-07-01",
      cobros: p.cobros.map(c => ({ ...c, exigibleEl })),
    })),
  } } }
}

it("original completo: rechazo por API canónica", () => {
  const r = Effect.runSync(Effect.result(liquidarIrpfAnual(originales.canonica, { modo: "canonico" })))
  expect(r._tag).toBe("Failure")
  if (Result.isFailure(r)) expect(r.failure.motivo).toMatch(/exigibilidad.*efectos/)
})
it("original completo: rechazo por API explícita", () => {
  const r = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(originales.explicita)))
  expect(r._tag).toBe("Failure")
  if (Result.isFailure(r)) expect(r.failure.motivo).toMatch(/exigibilidad.*efectos/)
})
for (const fecha of ["2025-01-01", "2025-05-31", "2025-07-02", "2025-12-31"]) {
  for (const api of apis) it(`${api.nombre}: exigibilidad ${fecha} fuera de efectos`, () => {
    const r = api.ejecutar(conExigibilidad(fecha))
    expect(r._tag).toBe("Failure")
    if (r._tag === "Failure") {
      expect(r.failure._tag).toBe("ResultadoNoSoportado")
      expect(r.failure.motivo).toMatch(/exigibilidad.*efectos/)
    }
  })
  it(`productor: exigibilidad ${fecha} fuera de efectos`, () => {
    expect(() => producirRentaExentaFamiliar2025(conExigibilidad(fecha).familiar.economia)).toThrow(/exigibilidad.*efectos/)
  })
}
for (const fecha of ["2025-06-01", "2025-06-15", "2025-07-01"]) {
  for (const api of apis) it(`${api.nombre}: control válido ${fecha}, conserva 150 euros`, () => {
    const r = api.ejecutar(conExigibilidad(fecha))
    expect(r._tag).toBe("Success")
    if (r._tag === "Success") {
      const generado = r.success.deduccionesTerritoriales2025?.aplicaciones[0]?.generado
      expect(generado).toBeDefined()
      if (generado !== undefined) expect(BigInt(generado.numeradorEuros)).toBe(150n * BigInt(generado.divisor))
      const aplicado = r.success.deduccionesTerritoriales2025?.total
      expect(aplicado).toBeDefined()
      if (aplicado !== undefined) expect(BigInt(aplicado.numeradorEuros)).toBe(150n * BigInt(aplicado.divisor))
    }
  })
  it(`productor: control válido ${fecha}, conserva renta íntegra exenta`, () => {
    expect(producirRentaExentaFamiliar2025(conExigibilidad(fecha).familiar.economia)).toEqual({
      rentasIncluidasExentas: "16800", noExentasCentimos: 0,
    })
  })
}
