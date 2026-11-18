import Decimal from "decimal.js"
import edicion from "../../../../docs/analisis-madrid/indices-ipc.json"
import { IPC_ANUAL_DICIEMBRE } from "../../normativa/datos/ipc-2012-2026"

const D = Decimal.clone({ precision: 80, rounding: Decimal.ROUND_HALF_UP })
export const METODO_IPC = "ipc-general-nacional-diciembre-cociente-base2021-v1"
export const METODO_IPC_LEGACY = "ipc-diciembre-producto-tasas-1decimal-legacy-v1"
export type MetodoIpcMadrid = typeof METODO_IPC | typeof METODO_IPC_LEGACY
// INE50902 / IPC251852, diciembre, misma edición base2021. Milésimas publicadas.
const indices = edicion.filas.map(f => f.milesimas)
export function ipcMadrid(anio: number, metodo: MetodoIpcMadrid = METODO_IPC) {
  if (!Number.isInteger(anio) || anio < 2018 || anio > 2025) throw new RangeError("IPC fuera de 2018–2025")
  if (metodo !== METODO_IPC && metodo !== METODO_IPC_LEGACY) throw new RangeError("Método IPC desconocido")
  let numerador = BigInt(indices[anio - 2018]!), denominador = BigInt(indices[0]!)
  if (metodo === METODO_IPC_LEGACY) {
    numerador = 1n; denominador = 1n
    for (let y = 2019; y <= anio; y++) {
      numerador *= BigInt(new D(IPC_ANUAL_DICIEMBRE[y]!).plus(1).mul(1000).toFixed(0)); denominador *= 1000n
    }
  }
  const factor = new D(numerador.toString()).div(denominador.toString())
  return { factor,
    // G tiene céntimos: cuantización racional exacta antes de entrar en IRPF Decimal80.
    indexarBruto: (g: Decimal) => {
      const n = BigInt(g.mul(100).toFixed(0)) * numerador
      const c = (2n * n + denominador) / (2n * denominador)
      return new D(c.toString()).div(100)
    },
    procedencia: { metodo, serie: "INE-IPC-general-nacional-diciembre", baseEstadistica: 2021,
      periodoDesde: 2018, periodoHasta: anio, numerador: numerador.toString(), denominador: denominador.toString(),
      unidadOperandos: metodo === METODO_IPC ? "milesimas-indice-publicado" : "producto-racional-tasas-publicadas",
      fuente: "docs/analisis-madrid/fuentes-metodo-ipc-coste.json",
      sha256Edicion: edicion.sha256CSV,
      sha256Api: edicion.sha256API,
      reserva: "Índices publicados redondeados; diciembre2021=103.965, no100; no cesta personal ni media anual" },
  }
}
