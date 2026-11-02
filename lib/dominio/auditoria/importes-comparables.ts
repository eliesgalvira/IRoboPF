import type { DesgloseLiquidado } from "../analisis-salarial/progresividad-frio"

/**
 * Selección de la comparación gráfica; no determina obligación de declarar.
 * Neto y coste concilian los componentes ya expresados en céntimos de la
 * comparación. El resultado original y su precisión histórica no se alteran.
 */
export const seleccionarImportesComparables = (desglose: DesgloseLiquidado) => {
  const irpfCentimos = desglose.irpfFinalCentimos
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
    origenIrpf: "resultado-final",
    ajusteNetoCentimos: netoCentimos - desglose.salarioNetoAnualCentimos,
    ajusteCosteCentimos: costeLaboralCentimos - desglose.costeLaboralCentimos,
  }
}
