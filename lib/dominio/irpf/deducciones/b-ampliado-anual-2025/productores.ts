import type Decimal from "decimal.js"
import { racional, type Racional } from "../anual-territorial-racional"

export type NodosFiscalesB2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly liquidacion: string
  readonly tiposMediosGenerales?: {
    readonly estatal: string
    readonly autonomico: string
    readonly baseLiquidableGeneral: string
    readonly cuotaGeneralEstatalArt63_1: string
    readonly cuotaGeneralAutonomicaArt74_1: string
    readonly regla: "porcentaje_dos_decimales_sin_redondeo"
  }
  readonly cuotaTrabajoActividad?: {
    readonly importe: string
    readonly origen: "solo-trabajo" | "solo-actividad"
    readonly nodo: "cuotaAutonomicaGeneralDespuesMinimo"
  }
}

function cocienteTipo(cuota: Racional, base: Racional): string {
  const n = BigInt(cuota.numeradorEuros) * BigInt(base.divisor) * 10000n
  const d = BigInt(cuota.divisor) * BigInt(base.numeradorEuros)
  if (n < 0n || d <= 0n) throw new RangeError("Nodos generales no positivos para tipo medio")
  // AEAT2025, gravamen general estatal/autonómico: dos decimales SIN redondeo.
  // La división entera se limita a esta representación fiscal, nunca a una base.
  const centesimasPorcentaje = n / d
  return String(centesimasPorcentaje / 100n) + "." + String(centesimasPorcentaje % 100n).padStart(2, "0")
}

/** Sólo lo llama composición con nodos fiscales calculados; no forma parte de Schema de cliente. */
export function producirNodosFiscalesB2025(
  contribuyente: string,
  baseLiquidableGeneral: Decimal,
  cuotaGeneralEstatal: Decimal,
  cuotaGeneralAutonomica: Decimal,
  origenBaseGeneral?: "solo-trabajo" | "solo-actividad"
): NodosFiscalesB2025 {
  const base = racional(baseLiquidableGeneral.toFixed())
  const estatal = racional(cuotaGeneralEstatal.toFixed())
  const autonomica = racional(cuotaGeneralAutonomica.toFixed())
  const comun = { ejercicio: 2025 as const, contribuyente, liquidacion: "motor-anual:2025:" + contribuyente }
  const conTipos = BigInt(base.numeradorEuros) > 0n ? {
    ...comun,
    tiposMediosGenerales: {
      estatal: cocienteTipo(estatal, base),
      autonomico: cocienteTipo(autonomica, base),
      baseLiquidableGeneral: baseLiquidableGeneral.toFixed(),
      cuotaGeneralEstatalArt63_1: cuotaGeneralEstatal.toFixed(),
      cuotaGeneralAutonomicaArt74_1: cuotaGeneralAutonomica.toFixed(),
      regla: "porcentaje_dos_decimales_sin_redondeo" as const,
    },
  } : comun
  return origenBaseGeneral === undefined ? conTipos : {
    ...conTipos,
    cuotaTrabajoActividad: {
      importe: cuotaGeneralAutonomica.toFixed(),
      origen: origenBaseGeneral,
      nodo: "cuotaAutonomicaGeneralDespuesMinimo",
    },
  }
}
