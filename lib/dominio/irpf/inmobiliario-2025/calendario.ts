/** Calendario gregoriano puro: no consulta reloj ni Date global. */
export function dia(s: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return NaN
  const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7)), d = Number(s.slice(8, 10))
  const bisiesto = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)
  const meses = [31, bisiesto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const limite = meses[m - 1]
  if (y < 1 || limite === undefined || d < 1 || d > limite) return NaN
  const previo = y - 1
  return 365 * previo + Math.floor(previo / 4) - Math.floor(previo / 100) + Math.floor(previo / 400) + meses.slice(0, m - 1).reduce((a, b) => a + b, 0) + d
}
