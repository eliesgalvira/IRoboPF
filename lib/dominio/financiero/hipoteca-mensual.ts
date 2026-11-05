/** Cuotas mensuales contractuales en céntimos. Sin reglas fiscales ni coma flotante.
 * Perfil: TIN no negativo, año comercial 12 meses, redondeo comercial por recibo.
 */
export type TipoMensual = { readonly n: bigint; readonly d: bigint }
export function tipoMensual(porcentaje: string): TipoMensual {
  if (!/^\d{1,2}(\.\d{1,6})?$/.test(porcentaje)) throw new RangeError("TIN fuera de perfil")
  const [a, b = ""] = porcentaje.split(".")
  return { n: BigInt(a + b), d: 1200n * 10n ** BigInt(b.length) }
}
function redondear(n: bigint, d: bigint): bigint {
  return (2n * n + d) / (2n * d)
}
export function interesMensual(saldo: bigint, tipo: TipoMensual): bigint {
  return redondear(saldo * tipo.n, tipo.d)
}
export function cuotaFrancesa(saldo: bigint, tipo: TipoMensual, meses: number): bigint {
  if (!Number.isInteger(meses) || meses < 1 || meses > 600 || saldo <= 0n) throw new RangeError("Plazo/capital fuera de perfil")
  if (tipo.n === 0n) return redondear(saldo, BigInt(meses))
  const p = (tipo.d + tipo.n) ** BigInt(meses)
  return redondear(saldo * tipo.n * p, tipo.d * (p - tipo.d ** BigInt(meses)))
}
