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
  aritmetica = Decimal,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
  readonly aritmetica?: Decimal.Constructor
}): Decimal =>
  calcularCuotaPorEscala({
    base,
    aritmetica,
    tramos: obtenerTramosIrpfAhorro(anio),
  })

export const calcularDesgloseCuotaPorEscalaAhorro = ({
  anio,
  base,
  aritmetica = Decimal,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
  readonly aritmetica?: Decimal.Constructor
}): ReadonlyArray<TramoCuotaAhorroCalculado> =>
  calcularDesgloseCuotaPorEscala({
    base,
    aritmetica,
    tramos: obtenerTramosIrpfAhorro(anio),
  })

export type ComponenteAhorro = "estatal" | "autonomico"

/** Reparto común: el recargo 2012–2014 es solo estatal; 2015 no son mitades. */
export const calcularCuotaComponenteAhorro = ({
  anio,
  base,
  aritmetica = Decimal,
  componente,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
  readonly aritmetica?: Decimal.Constructor
  readonly componente: ComponenteAhorro
}): Decimal =>
  calcularCuotaPorEscala({
    base,
    aritmetica,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  })

/** Cuantías suministradas: esta operación no acredita el derecho al mínimo. */
export const calcularAhorroConMinimos = ({
  anio,
  base,
  aritmetica = Decimal,
  baseGeneral,
  minimoEstatal,
  minimoAutonomico,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
  readonly aritmetica?: Decimal.Constructor
  readonly baseGeneral: Decimal
  readonly minimoEstatal: Decimal
  readonly minimoAutonomico: Decimal
}) => {
  const A = aritmetica
  const baseSeleccionada = new A(base)
  const general = new A(baseGeneral)
  const componente = (nombre: ComponenteAhorro, minimo: Decimal) => {
    const remanente = A.min(
      A.max(0, new A(minimo).minus(A.max(0, general))),
      A.max(0, baseSeleccionada)
    )
    const bruta = calcularCuotaComponenteAhorro({
      anio,
      base,
      aritmetica,
      componente: nombre,
    })
    const despuesMinimo =
      anio <= 2014
        ? calcularCuotaComponenteAhorro({
            anio,
            base: A.max(0, baseSeleccionada.minus(remanente)),
            aritmetica,
            componente: nombre,
          })
        : A.max(
            0,
            bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                aritmetica,
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
