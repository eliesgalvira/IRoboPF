import Decimal from "decimal.js"

import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { obtenerTramosIrpfLegacy } from "../../normativa/datos/irpf-estatal-2012-2026"

export const calcularCuotaPorEscalaGeneral = ({
  anio,
  base,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
}): Decimal => {
  if (base.lte(0)) {
    return base.mul(0)
  }

  return obtenerTramosIrpfLegacy(anio).reduce(
    (estado, [limite, tipo]) => {
      const baseRestante = Decimal.max(0, base.minus(estado.limiteAnterior))
      const anchoTramo = limite.minus(estado.limiteAnterior)
      const importeEnTramo = Decimal.min(baseRestante, anchoTramo)

      return {
        limiteAnterior: limite,
        cuota: estado.cuota.plus(importeEnTramo.mul(tipo)),
      }
    },
    {
      limiteAnterior: base.mul(0),
      cuota: base.mul(0),
    }
  ).cuota
}
