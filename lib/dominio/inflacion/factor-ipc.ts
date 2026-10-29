import Decimal from "decimal.js"
import {
  IPC_ANUAL_DICIEMBRE,
  ESCENARIO_IPC_2026_LEGACY,
} from "../normativa/datos/ipc-2012-2026"

export interface ProcedenciaIpc {
  readonly estado: "identidad" | "observado" | "incluye-escenario"
  readonly metodo: "producto-tasas-publicadas-diciembre"
  readonly serie: "INE-IPC-general-nacional-diciembre"
  readonly periodoDesde: number
  readonly periodoHasta: number
  readonly fechaCorte: "2026-10-29"
  readonly escenario: typeof ESCENARIO_IPC_2026_LEGACY | null
}

export interface ResultadoFactorIpc {
  readonly factor: Decimal
  readonly procedencia: ProcedenciaIpc
}

export function calcularFactorIpcDiciembre(entrada: {
  readonly anioBase: number
  readonly anioReferencia: number
  readonly escenario?: typeof ESCENARIO_IPC_2026_LEGACY.id
}): ResultadoFactorIpc {
  const { anioBase, anioReferencia } = entrada
  if (
    ![anioBase, anioReferencia].every(
      (a) => Number.isInteger(a) && a >= 2012 && a <= 2026
    )
  )
    throw new RangeError("Años fuera del contrato IPC 2012–2026")
  const desde = Math.min(anioBase, anioReferencia),
    hasta = Math.max(anioBase, anioReferencia)
  let factor = new Decimal(1)
  let usaEscenario = false
  for (let anio = desde + 1; anio <= hasta; anio++) {
    const observado = IPC_ANUAL_DICIEMBRE[anio]
    if (observado !== undefined) {
      factor = factor.mul(observado.plus(1))
      continue
    }
    if (anio !== 2026 || entrada.escenario !== ESCENARIO_IPC_2026_LEGACY.id)
      throw new RangeError(
        `IPC observado ausente para ${anio}; se requiere escenario explícito`
      )
    factor = factor.mul(
      new Decimal(ESCENARIO_IPC_2026_LEGACY.tasaDiciembre).plus(1)
    )
    usaEscenario = true
  }
  return {
    factor: anioBase <= anioReferencia ? factor : new Decimal(1).div(factor),
    procedencia: {
      estado:
        desde === hasta
          ? "identidad"
          : usaEscenario
            ? "incluye-escenario"
            : "observado",
      metodo: "producto-tasas-publicadas-diciembre",
      serie: "INE-IPC-general-nacional-diciembre",
      periodoDesde: desde,
      periodoHasta: hasta,
      fechaCorte: "2026-10-29",
      escenario: usaEscenario ? ESCENARIO_IPC_2026_LEGACY : null,
    },
  }
}

/** Adaptador del escenario fijo ya utilizado por el perfil del simulador. */
export const factorIpcPerfilLegacy = (
  anioBase: number,
  anioReferencia: number
) =>
  calcularFactorIpcDiciembre({
    anioBase,
    anioReferencia,
    escenario: ESCENARIO_IPC_2026_LEGACY.id,
  })
