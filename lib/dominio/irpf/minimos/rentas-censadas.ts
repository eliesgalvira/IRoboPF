import Decimal from "decimal.js"

/** Proyecta sólo el censo; la renta fiscal conserva su precisión interna. */
export function conciliaRentaEnCentimos(
  renta: Decimal,
  centimos: number,
  umbrales: readonly number[] = [8000],
): boolean {
  return renta.isFinite() && Number.isSafeInteger(centimos) &&
    renta.times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).eq(centimos) &&
    umbrales.every(umbral => renta.lte(umbral) === (centimos <= umbral * 100))
}
