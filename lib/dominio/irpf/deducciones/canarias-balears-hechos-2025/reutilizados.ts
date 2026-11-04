/** Referencias operativas: el padre conecta estos contratos existentes sin copiar
 * las fórmulas ni sustituir sus reservas de elegibilidad externa por admisión. */
export const EVALUADORES_REUTILIZADOS = {
  canarias_nacimiento_adopcion_hijos: "evaluarHechosAuxiliar2025",
  canarias_familia_numerosa: "evaluarHechosAuxiliar2025",
  canarias_discapacidad_mayores_65: "evaluarHechosAuxiliar2025",
  canarias_contribuyentes_desempleados: "evaluarHechosAuxiliar2025",
  balears_gastos_mayores_65_discapacidad: "evaluarHechosAuxiliar2025",
} as const
