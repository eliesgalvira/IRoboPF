import Decimal from "decimal.js"

import {
  calcularCuotaPorEscala,
  calcularDesgloseCuotaPorEscala,
  type TramoCuotaCalculado,
} from "./escalas-gravamen"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import {
  ESCALAS_IRPF_AHORRO_POR_GRAVAMEN,
  obtenerTramosIrpfAhorro,
} from "../../normativa/datos/irpf-estatal-2012-2026"

export type TramoCuotaAhorroCalculado = TramoCuotaCalculado

export const calcularCuotaPorEscalaAhorro = ({
  anio,
  base,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
}): Decimal =>
  calcularCuotaPorEscala({
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  })

export const calcularDesgloseCuotaPorEscalaAhorro = ({
  anio,
  base,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
}): ReadonlyArray<TramoCuotaAhorroCalculado> =>
  calcularDesgloseCuotaPorEscala({
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  })

/**
 * Arts. 66.1.2.º y 76.2.º LIRPF: la cuota estatal del ahorro se minora con la
 * escala estatal aplicada a la parte de la base del ahorro que corresponde al
 * remanente del mínimo estatal, y la autonómica con la escala autonómica
 * aplicada a la que corresponde al remanente del mínimo autonómico.
 */
export const calcularCuotaMinimoPersonalAhorro = ({
  anio,
  baseLiquidableAhorro,
  remanentes,
}: {
  readonly anio: AnioFiscal
  readonly baseLiquidableAhorro: Decimal
  readonly remanentes: {
    readonly estatal: Decimal
    readonly autonomico: Decimal
  }
}): Decimal => {
  const escalas = ESCALAS_IRPF_AHORRO_POR_GRAVAMEN[anio].valor

  return calcularCuotaPorEscala({
    base: Decimal.min(remanentes.estatal, baseLiquidableAhorro),
    tramos: escalas.estatal,
  }).plus(
    calcularCuotaPorEscala({
      base: Decimal.min(remanentes.autonomico, baseLiquidableAhorro),
      tramos: escalas.autonomica,
    })
  )
}
