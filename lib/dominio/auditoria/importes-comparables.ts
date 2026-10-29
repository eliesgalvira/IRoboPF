import type { DesgloseLiquidado } from "../compatibilidad-legacy/progresividad-frio"

/**
 * Selección de la comparación gráfica; no determina obligación de declarar.
 * Neto y coste concilian los componentes ya expresados en céntimos de la
 * comparación. El resultado original y su precisión histórica no se alteran.
 */
export const seleccionarImportesComparables = (desglose: DesgloseLiquidado) => {
  const irpfCentimos =
    desglose.irpfConObligacionDeclararCentimos ?? desglose.irpfFinalCentimos
  const netoCentimos =
    desglose.salarioBrutoAnualCentimos -
    desglose.cotizacionTrabajadorCentimos -
    irpfCentimos
  const costeLaboralCentimos =
    desglose.salarioBrutoAnualCentimos + desglose.cotizacionEmpresarialCentimos
  return {
    irpfCentimos,
    netoCentimos,
    costeLaboralCentimos,
    origenIrpf:
      desglose.irpfConObligacionDeclararCentimos === undefined
        ? "resultado-final"
        : "cuota-comparable",
    ajusteNetoCentimos: netoCentimos - desglose.salarioNetoAnualCentimos,
    ajusteCosteCentimos: costeLaboralCentimos - desglose.costeLaboralCentimos,
  }
}
