import Decimal from "decimal.js"

import {
  calcularCuotaPorEscala,
  calcularDesgloseCuotaPorEscala,
  type TramoCuotaCalculado,
} from "./escalas-gravamen"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { obtenerTramosIrpfAhorro } from "../../normativa/datos/irpf-estatal-2012-2026"

import { obtenerEscalasAhorroPublicadas } from "./escalas-publicadas"

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

export type ComponenteAhorro = "estatal" | "autonomico"

/** Reparto común: el recargo 2012–2014 es solo estatal; 2015 no son mitades. */
export const calcularCuotaComponenteAhorro = ({
  anio,
  base,
  componente,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
  readonly componente: ComponenteAhorro
}): Decimal =>
  calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  })

/** Cuantías suministradas: esta operación no acredita el derecho al mínimo. */
export const calcularAhorroConMinimos = ({
  anio,
  base,
  baseGeneral,
  minimoEstatal,
  minimoAutonomico,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
  readonly baseGeneral: Decimal
  readonly minimoEstatal: Decimal
  readonly minimoAutonomico: Decimal
}) => {
  const componente = (nombre: ComponenteAhorro, minimo: Decimal) => {
    const remanente = Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    )
    const bruta = calcularCuotaComponenteAhorro({
      anio,
      base,
      componente: nombre,
    })
    const despuesMinimo =
      anio <= 2014
        ? calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          })
        : Decimal.max(
            0,
            bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
              })
            )
          )
    return {
      bruta,
      remanente,
      despuesMinimo,
      minoracion: bruta.minus(despuesMinimo),
    }
  }
  return {
    estatal: componente("estatal", minimoEstatal),
    autonomico: componente("autonomico", minimoAutonomico),
  }
}
