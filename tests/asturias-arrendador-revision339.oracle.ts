// Oráculo racional independiente: sólo BigInt, sin importaciones fiscales.
export type Q = { n: bigint; d: bigint }
export function euros(s: string): Q {
 if (!/^\d+(?:\.\d{1,2})?$/.test(s)) throw new RangeError('Dinero no negativo con hasta dos decimales')
 const [a, b = ''] = s.split('.')
 return { n: BigInt(a! + b.padEnd(2, '0')), d: 100n }
}
export const minimo = (a: Q, b: Q): Q => a.n * b.d <= b.n * a.d ? a : b
export const igual = (a: Q, b: Q) => a.n * b.d === b.n * a.d
export function oraculo(gasto: string, cuota: string) {
 const generado = minimo(euros(gasto), euros('500'))
 return { generado, aplicado: minimo(generado, euros(cuota)) }
}
export function decimalExacto(q: Q): string {
 if (q.n * 100n % q.d !== 0n) throw new RangeError('No es dinero exacto')
 const c = q.n * 100n / q.d
 return String(c / 100n) + '.' + String(c % 100n).padStart(2, '0')
}
