import { describe, expect, it } from "vitest"
import { Effect } from "effect"
import {
  compararAjustadoPorIpc,
  compararPasadoAjustadoPorIpc,
  type DesgloseLiquidado,
} from "../lib/dominio/compatibilidad-legacy/progresividad-frio"
import { seleccionarImportesComparables } from "../lib/dominio/auditoria/importes-comparables"

describe("cuota y neto de la comparación gráfica, CX-07-B", () => {
  it("resta la cuota que la gráfica muestra en el caso documentado", () => {
    const comparacion = Effect.runSync(
      compararAjustadoPorIpc({
        salarioBrutoAnualReferenciaCentimos: 2_270_016,
        anioComparado: 2025,
        anioReferencia: 2026,
      })
    )
    const original = comparacion.comparado.ajustado
    expect(original.irpfFinalCentimos).toBe(272_959)
    expect(original.salarioNetoAnualCentimos).toBe(1_849_960)
    const elegido = seleccionarImportesComparables(original)
    expect(elegido.irpfCentimos).toBe(287_330)
    expect(elegido.netoCentimos).toBe(1_835_589)
    expect(elegido.ajusteNetoCentimos).toBe(-14_371)
    expect(original.salarioNetoAnualCentimos).toBe(1_849_960)
  })

  it("concilia los céntimos visibles, incluso si el total se redondeó antes", () => {
    const original: DesgloseLiquidado = {
      salarioBrutoAnualCentimos: 10_001,
      cotizacionTrabajadorCentimos: 651,
      cotizacionEmpresarialCentimos: 3_061,
      costeLaboralCentimos: 13_061,
      irpfFinalCentimos: 601,
      salarioNetoAnualCentimos: 8_750,
    }
    expect(seleccionarImportesComparables(original)).toEqual({
      irpfCentimos: 601,
      netoCentimos: 8_749,
      costeLaboralCentimos: 13_062,
      origenIrpf: "resultado-final",
      ajusteNetoCentimos: -1,
      ajusteCosteCentimos: 1,
    })
  })

  it("mantiene bruto, cuota, neto y cuña conciliados en ambas direcciones del IPC", () => {
    for (const salario of [
      2_199_999, 2_200_000, 2_200_001, 2_270_016, 6_000_001,
    ]) {
      const entrada = {
        salarioBrutoAnualReferenciaCentimos: salario,
        anioComparado: 2025,
        anioReferencia: 2026,
      } as const
      for (const comparacion of [
        Effect.runSync(compararAjustadoPorIpc(entrada)),
        Effect.runSync(compararPasadoAjustadoPorIpc(entrada)),
      ]) {
        for (const d of [
          comparacion.referencia,
          comparacion.comparado.ajustado,
        ]) {
          const c = seleccionarImportesComparables(d)
          expect(
            c.netoCentimos + c.irpfCentimos + d.cotizacionTrabajadorCentimos
          ).toBe(d.salarioBrutoAnualCentimos)
          expect(c.costeLaboralCentimos - c.netoCentimos).toBe(
            c.irpfCentimos +
              d.cotizacionTrabajadorCentimos +
              d.cotizacionEmpresarialCentimos
          )
        }
      }
    }
  })
})
