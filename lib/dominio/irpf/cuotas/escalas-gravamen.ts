import Decimal from "decimal.js"

import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { obtenerTramosIrpfLegacy } from "../../normativa/datos/irpf-estatal-2012-2026"

export interface TramoCuotaGeneralCalculado {
  readonly limiteInferior: Decimal
  readonly limiteSuperior: Decimal
  readonly baseAplicada: Decimal
  readonly tipo: Decimal
  readonly cuota: Decimal
}

export const calcularCuotaPorEscalaGeneral = ({
  anio,
  base,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
}): Decimal =>
  calcularDesgloseCuotaPorEscalaGeneral({ anio, base }).reduce(
    (total, tramo) => total.plus(tramo.cuota),
    base.mul(0)
  )

export const calcularDesgloseCuotaPorEscalaGeneral = ({
  anio,
  base,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
}): ReadonlyArray<TramoCuotaGeneralCalculado> => {
  if (base.lte(0)) {
    return []
  }

  return obtenerTramosIrpfLegacy(anio).reduce(
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
