import { racional, menor, type Racional } from "./anual-territorial-racional"

/** Cuantías publicadas: Madrid art.4 y Murcia art.1.Tres. Sin elegibilidad ni cuota. */
export function cuantiaNacimientoMadridExacta(hijos: number, multiple: boolean, divisor: number): Racional {
  return racional(String(72170n * BigInt(hijos) * (multiple ? 2n : 1n)), String(100n * BigInt(divisor)))
}
/** Base atribuida al pagador; sólo se reparte el tope, no su gasto. */
export function cuantiaGuarderiaMurciaExacta(base: Racional, titularesTope: number): Racional {
  const porcentaje = racional(base.numeradorEuros, String(BigInt(base.divisor) * 5n))
  return menor(porcentaje, racional("1000", String(titularesTope)))
}
