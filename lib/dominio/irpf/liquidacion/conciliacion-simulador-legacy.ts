import Decimal from "decimal.js"
import { Match, Option } from "effect"

import { centimosAEuros, eurosACentimos } from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { obtenerEspecificacionCompatibilidadHistorica } from "../../normativa/datos/compatibilidad-historica"

export interface ConciliacionSimuladorLegacy {
  readonly _tag: "ConciliacionSimuladorLegacy"
  readonly anio: AnioFiscal
  readonly cuotaLiquidadaAnualCentimos: number
  readonly deduccionSmiCentimos: number
  readonly cuotaTrasDeduccionSmiCentimos: number
  readonly rendimientoIntegroTrabajoCentimos: number
  readonly minimoExentoRetencionCentimos: number
  readonly tipoMaximoRetencionNominaPorcentaje: string
  readonly limiteRetencionNominaCentimos: number
  readonly irpfFinalSimulador: Decimal
  readonly irpfFinalSimuladorCentimos: number
  readonly diferenciaCuotaDiferencialEIrpfFinalCentimos: number
}

const importe = (valor: Decimal.Value): Decimal => new Decimal(valor)
const CERO = importe(0)

const max = (a: Decimal, b: Decimal): Decimal =>
  Match.value(a.greaterThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  )

const min = (a: Decimal, b: Decimal): Decimal =>
  Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  )

export const calcularConciliacionSimuladorLegacy = ({
  anio,
  rendimientoIntegroTrabajoCentimos,
  cuotaLiquida,
  cuotaLiquidaCentimos,
  cuotaDiferencialCentimos,
}: {
  readonly anio: AnioFiscal
  readonly rendimientoIntegroTrabajoCentimos: number
  readonly cuotaLiquida: Decimal
  readonly cuotaLiquidaCentimos: number
  readonly cuotaDiferencialCentimos: number
}): Option.Option<ConciliacionSimuladorLegacy> => {
  const especificacion = obtenerEspecificacionCompatibilidadHistorica(anio)

  return Option.some(
    (() => {
      const bruto = centimosAEuros(rendimientoIntegroTrabajoCentimos)
      const cuotaLiquidadaAnual = cuotaLiquida
      const deduccionSmi =
        especificacion.deduccionObtencionRendimientosTrabajo(bruto)
      const cuotaTrasDeduccionSmi = max(
        CERO,
        cuotaLiquidadaAnual.minus(deduccionSmi)
      )
      const limiteRetencionNomina = max(
        CERO,
        bruto
          .minus(especificacion.minimoExentoRetencion)
          .mul(especificacion.tipoMaximoRetencionNomina)
      )
      const irpfFinalSimulador = min(
        cuotaTrasDeduccionSmi,
        limiteRetencionNomina
      )
      const irpfFinalSimuladorCentimos = eurosACentimos(irpfFinalSimulador)

      return {
        _tag: "ConciliacionSimuladorLegacy",
        anio,
        cuotaLiquidadaAnualCentimos: cuotaLiquidaCentimos,
        deduccionSmiCentimos: eurosACentimos(deduccionSmi),
        cuotaTrasDeduccionSmiCentimos: eurosACentimos(cuotaTrasDeduccionSmi),
        rendimientoIntegroTrabajoCentimos,
        minimoExentoRetencionCentimos: eurosACentimos(
          especificacion.minimoExentoRetencion
        ),
        tipoMaximoRetencionNominaPorcentaje:
          especificacion.tipoMaximoRetencionNomina.mul(100).toFixed(0),
        limiteRetencionNominaCentimos: eurosACentimos(limiteRetencionNomina),
        irpfFinalSimulador,
        irpfFinalSimuladorCentimos,
        diferenciaCuotaDiferencialEIrpfFinalCentimos:
          cuotaDiferencialCentimos - irpfFinalSimuladorCentimos,
      } satisfies ConciliacionSimuladorLegacy
    })()
  )
}
