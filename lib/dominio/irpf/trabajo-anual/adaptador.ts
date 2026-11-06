import { type CalendarioTrabajo2025, calcularGastosTrabajoCalendario2025 } from "./calendario-2025"
import { calcularGastosTrabajo } from "./calcular"
import type { GastosTrabajo } from "./contrato"

/** Solo aporta art19; el padre debe aplicar art20 una vez y después integrar las bases. */
export function adaptarTrabajoAnual(caso: GastosTrabajo, calendario?: CalendarioTrabajo2025) {
  const gastos = calendario === undefined ? calcularGastosTrabajo(caso) : calcularGastosTrabajoCalendario2025(caso, calendario)
  if (gastos.estado === "no-soportado") return gastos
  return {
    estado: "aporte-disponible" as const,
    ejercicio: caso.ejercicio,
    rendimientoAntesArt20: gastos.netoArt19,
    argumentoArt20: gastos.netoPrevioArt20,
    gastos,
    clases: caso.rendimientos.map((r) => ({
      id: r.id,
      clase: r.clase,
      integro: r.integro,
    })),
    pendientes: [
      "otras rentas fiscales art20",
      "reducción art20",
      "integración de bases",
      "cuotas y art80",
      "deducción anual",
      "pagos a cuenta",
    ],
    aceptacionFiscal: "pendiente" as const,
  }
}
