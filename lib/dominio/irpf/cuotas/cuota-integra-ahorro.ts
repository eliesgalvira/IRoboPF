import type Decimal from "decimal.js"

import {
  calcularCuotaPorEscala,
  calcularDesgloseCuotaPorEscala,
  type TramoCuotaCalculado,
} from "./escalas-gravamen"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { obtenerTramosIrpfAhorro } from "../../normativa/datos/irpf-estatal-2012-2026"

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
