import Decimal from "decimal.js"

import type { AnioFiscal } from "../../normativa/anio-fiscal"
import {
  obtenerTramosIrpfLegacy,
  type TramosIrpf,
} from "../../normativa/datos/irpf-estatal-2012-2026"

export interface TramoCuotaCalculado {
  readonly limiteInferior: Decimal
  readonly limiteSuperior: Decimal
  readonly baseAplicada: Decimal
  readonly tipo: Decimal
  readonly cuota: Decimal
}

export type TramoCuotaGeneralCalculado = TramoCuotaCalculado

export const calcularCuotaPorEscalaGeneral = ({
  anio,
  base,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
}): Decimal =>
  calcularDesgloseCuotaPorEscala({
    base,
    tramos: obtenerTramosIrpfLegacy(anio),
  }).reduce((total, tramo) => total.plus(tramo.cuota), base.mul(0))

export const calcularDesgloseCuotaPorEscalaGeneral = ({
  anio,
  base,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
}): ReadonlyArray<TramoCuotaGeneralCalculado> => {
  return calcularDesgloseCuotaPorEscala({
    base,
    tramos: obtenerTramosIrpfLegacy(anio),
  })
}

export const calcularCuotaPorEscala = ({
  base,
  tramos,
}: {
  readonly base: Decimal
  readonly tramos: TramosIrpf
}): Decimal =>
  calcularDesgloseCuotaPorEscala({ base, tramos }).reduce(
    (total, tramo) => total.plus(tramo.cuota),
    base.mul(0)
  )

export const calcularDesgloseCuotaPorEscala = ({
  base,
  tramos,
}: {
  readonly base: Decimal
  readonly tramos: TramosIrpf
}): ReadonlyArray<TramoCuotaCalculado> => {
  if (base.lte(0)) {
    return []
  }

  return tramos.reduce(
    (estado, [limite, tipo]) => {
      const baseRestante = Decimal.max(0, base.minus(estado.limiteAnterior))
      const anchoTramo = limite.minus(estado.limiteAnterior)
      const importeEnTramo = Decimal.min(baseRestante, anchoTramo)
      const tramo = {
        limiteInferior: estado.limiteAnterior,
        limiteSuperior: limite,
        baseAplicada: importeEnTramo,
        tipo,
        cuota: importeEnTramo.mul(tipo),
      }

      return {
        limiteAnterior: limite,
        tramos: importeEnTramo.gt(0)
          ? [...estado.tramos, tramo]
          : estado.tramos,
      }
    },
    {
      limiteAnterior: base.mul(0),
      tramos: [] as ReadonlyArray<TramoCuotaGeneralCalculado>,
    }
  ).tramos
}
