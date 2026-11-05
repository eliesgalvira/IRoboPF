/** Aritmética exacta sólo de transporte y consumo; no contiene fórmulas fiscales. */
export type Racional = {
  readonly numeradorEuros: string
  readonly divisor: string
}
type R = { n: bigint; d: bigint }
function decimal(s: string): R {
  if (!/^-?\d+(\.\d+)?$/.test(s))
    throw new RangeError("Decimal exacto inválido")
  const [a, b = ""] = s.split(".")
  return { n: BigInt(a + b), d: 10n ** BigInt(b.length) }
}
function leer(r: Racional): R {
  const n = decimal(r.numeradorEuros),
    d = decimal(r.divisor)
  if (d.n <= 0n) throw new RangeError("Divisor no positivo")
  return { n: n.n * d.d, d: n.d * d.n }
}
function salida(r: R): Racional {
  let a = r.n < 0n ? -r.n : r.n,
    b = r.d
  while (b !== 0n) {
    const t = a % b
    a = b
    b = t
  }
  const g = a === 0n ? 1n : a
  return { numeradorEuros: String(r.n / g), divisor: String(r.d / g) }
}
export const racional = (n: string, d = "1"): Racional =>
  salida(leer({ numeradorEuros: n, divisor: d }))
export function sumar(a: Racional, b: Racional): Racional {
  const x = leer(a),
    y = leer(b)
  return salida({ n: x.n * y.d + y.n * x.d, d: x.d * y.d })
}
export function restar(a: Racional, b: Racional): Racional {
  return sumar(a, { ...b, numeradorEuros: "-" + b.numeradorEuros })
}
export function menor(a: Racional, b: Racional): Racional {
  const x = leer(a),
    y = leer(b)
  return x.n * y.d <= y.n * x.d ? a : b
}
export function consumirCuota(cuota: Racional, importes: readonly Racional[]) {
  let disponible = cuota,
    total = racional("0")
  const aplicaciones = importes.map((importe) => {
    const aplicado = menor(disponible, importe)
    disponible = restar(disponible, aplicado)
    total = sumar(total, aplicado)
    return {
      generado: importe,
      aplicado,
      pendiente: restar(importe, aplicado),
    }
  })
  return { total, disponible, aplicaciones }
}
