import Decimal from "decimal.js"
import { Match } from "effect"

import {
  calcularCuotaPorEscala,
  calcularDesgloseCuotaPorEscala,
  type TramoCuotaCalculado,
} from "./escalas-gravamen"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import {
  ESCALAS_IRPF_AHORRO_POR_GRAVAMEN,
  obtenerTramosIrpfAhorro,
  type ReglaMinimoAhorro,
  type TramosIrpf,
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

export interface GravamenAhorro {
  readonly baseGravada: Decimal
  readonly desglose: ReadonlyArray<TramoCuotaAhorroCalculado>
  readonly cuota: Decimal
}

export interface CuotasAhorro {
  readonly reglaMinimo: ReglaMinimoAhorro
  readonly estatal: GravamenAhorro
  readonly autonomico: GravamenAhorro
  /** Suma de las cuotas de ambas escalas sobre la base que grava cada una. */
  readonly cuotaIntegra: Decimal
  /**
   * Minoración de esa cuota por el mínimo personal y familiar. Es cero cuando
   * la regla del ejercicio descuenta el remanente de la base gravada.
   */
  readonly cuotaMinimo: Decimal
}

const gravar = (baseGravada: Decimal, tramos: TramosIrpf): GravamenAhorro => {
  const desglose = calcularDesgloseCuotaPorEscala({ base: baseGravada, tramos })
  return {
    baseGravada,
    desglose,
    cuota: desglose.reduce(
      (total, tramo) => total.plus(tramo.cuota),
      new Decimal(0)
    ),
  }
}

/**
 * Cuotas del ahorro según la regla del mínimo vigente en el ejercicio. Cada
 * remanente es el exceso de su mínimo sobre la base liquidable general y se
 * limita aquí a la base liquidable del ahorro.
 */
export const calcularCuotasAhorro = ({
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
}): CuotasAhorro => {
  const { reglaMinimo, estatal, autonomica } =
    ESCALAS_IRPF_AHORRO_POR_GRAVAMEN[anio].valor
  const remanenteEstatal = Decimal.min(remanentes.estatal, baseLiquidableAhorro)
  const remanenteAutonomico = Decimal.min(
    remanentes.autonomico,
    baseLiquidableAhorro
  )
  const cuotas = (
    gravamenEstatal: GravamenAhorro,
    gravamenAutonomico: GravamenAhorro,
    cuotaMinimo: Decimal
  ): CuotasAhorro => ({
    reglaMinimo,
    estatal: gravamenEstatal,
    autonomico: gravamenAutonomico,
    cuotaIntegra: gravamenEstatal.cuota.plus(gravamenAutonomico.cuota),
    cuotaMinimo,
  })

  return Match.valueTags(reglaMinimo, {
    GravarBaseNetaDeMinimo: () =>
      cuotas(
        gravar(baseLiquidableAhorro.minus(remanenteEstatal), estatal),
        gravar(baseLiquidableAhorro.minus(remanenteAutonomico), autonomica),
        new Decimal(0)
      ),
    MinorarCuotaConLaDelMinimo: () =>
      cuotas(
        gravar(baseLiquidableAhorro, estatal),
        gravar(baseLiquidableAhorro, autonomica),
        calcularCuotaPorEscala({ base: remanenteEstatal, tramos: estatal }).plus(
          calcularCuotaPorEscala({
            base: remanenteAutonomico,
            tramos: autonomica,
          })
        )
      ),
  })
}
