import Decimal from "decimal.js"

// La configuración de consumidores ajenos no puede redondear la preparación
// monetaria antes de la composición anual. La liquidación a céntimos sigue
// siendo una operación explícita en su frontera; esto no redondea cuotas TGSS.
export const DecimalMonetario = Decimal.clone({
  precision: 80,
  rounding: Decimal.ROUND_HALF_UP,
})
export type DecimalMonetario = Decimal
