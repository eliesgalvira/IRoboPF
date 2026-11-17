import type { InmuebleP4a } from "./hechos"
const centimos = (s: string) => { const [e = "0", c = ""] = s.split("."); return BigInt(e + c.padEnd(2, "0")) }

/** EUR racionales. RIRPF 14.2.a: prorrata sólo cuando el suelo no se conoce.
 * Sin política de presentación ni porcentaje catastral redondeado.
 * No recibe base ni amortización calculadas fuera del productor.
 */
export function costeConstruccion2025(a: InmuebleP4a["adquisicion"], catastro: InmuebleP4a["catastro2025"]) {
  const precio = centimos(a.precio), gastos = centimos(a.gastosTributos)
  const suelo = a.costeSuelo
  if (suelo?.estado === "desconocido") {
    const construccion = centimos(catastro.construccion), total = construccion + centimos(catastro.suelo)
    if (total <= 0n || construccion <= 0n || precio + gastos <= 0n)
      throw new RangeError("Catastro o coste sin construcción positiva para prorrata")
    return { n: (precio + gastos) * construccion, d: 100n * total }
  }
  const sueloPrecio = centimos(suelo?.precio ?? a.sueloPrecio!), sueloGastos = centimos(suelo?.gastosTributos ?? a.sueloGastosTributos!)
  const coste = precio + gastos - sueloPrecio - sueloGastos
  if (coste <= 0n || sueloPrecio > precio || sueloGastos > gastos)
    throw new RangeError("Valor de suelo y coste de construcción incoherentes")
  return { n: coste, d: 100n }
}

/** Cota suficiente: diciembre2024 <= 3% de todo el coste, no una amortización histórica inventada. */
export function historiaDesconocidaNoVinculante2025(a: InmuebleP4a["adquisicion"], construccion2024: string, coste2025: { readonly n: bigint; readonly d: bigint }) {
  const total = centimos(a.precio) + centimos(a.gastosTributos), catastro = centimos(construccion2024)
  const baseMaxima = total > catastro ? total : catastro
  // 31/366 del máximo anual histórico + 3% del coste2025 <= coste2025.
  return baseMaxima * 3n * 31n * coste2025.d * 100n <= coste2025.n * 97n * 3_660_000n
}
