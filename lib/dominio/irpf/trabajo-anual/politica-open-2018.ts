import type Decimal from "decimal.js"

/** Cota técnica, no umbral fiscal. Sólo magnitudes de entrada a céntimos.
 * A 1e6 el ulp binary64 es <= 2^-33 EUR; resta/producto art20 quedan
 * muy por debajo de 0.0001 EUR, salvo empates que preservamos deliberadamente.
 * La igualdad con el decimal corto evita perder cifras durante el transporte.
 * No cuantiza ni convierte las magnitudes fuera de esta política. */
export const admiteOperandoOpen2018 = (v: Decimal): boolean =>
  v.isFinite() && v.gte(0) && v.lte("1000000") &&
  v.decimalPlaces() <= 2 && v.eq(String(v.toNumber()))

/** Los testigos sólo cubren gastos a–e enteros (1.000 EUR). La política
 * de transporte permite enteros, exactos en binary64 bajo la cota; no infiere
 * cómo se transportan gastos con fracción de euro no representada. */
export const admiteArgumentoOpen2018 = (integro: Decimal, gastosAE: Decimal): boolean =>
  [integro, gastosAE].every(admiteOperandoOpen2018) && gastosAE.isInteger()
