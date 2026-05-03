import Decimal from "decimal.js"
import { Match, Option } from "effect"

import { centimosAEuros, eurosACentimos } from "../../dinero/importe-monetario"
import { calcularCotizacionesSocialesLegacy } from "../../laboral/cotizaciones-sociales"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { obtenerEspecificacionCompatibilidadHistorica } from "../../normativa/datos/compatibilidad-historica"
import {
  MINIMO_PERSONAL_IRPF_LEGACY,
  obtenerTramosIrpfLegacy,
} from "../../normativa/datos/irpf-estatal-2012-2026"
import { calcularCuotaPorEscala } from "../cuotas/escalas-gravamen"
import { calcularReduccionRendimientosTrabajo } from "../reducciones/reduccion-rendimientos-trabajo"

export interface ConciliacionSimuladorLegacy {
  readonly _tag: "ConciliacionSimuladorLegacy"
  readonly anio: AnioFiscal
  readonly cuotaLiquidadaAnualCentimos: number
  readonly deduccionSmiCentimos: number
  readonly cuotaTrasDeduccionSmi: Decimal
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

const primerTipo = (anio: AnioFiscal): Decimal =>
  Match.value(obtenerTramosIrpfLegacy(anio)[0]).pipe(
    Match.when(Match.undefined, () => CERO),
    Match.orElse((tramo) => tramo[1])
  )

const calcularIrpfFinalSimuladorLegacyHasta2014 = ({
  anio,
  bruto,
  especificacion,
}: {
  readonly anio: AnioFiscal
  readonly bruto: Decimal
  readonly especificacion: ReturnType<
    typeof obtenerEspecificacionCompatibilidadHistorica
  >
}): Decimal => {
  const cotizaciones = calcularCotizacionesSocialesLegacy({
    salarioBrutoAnual: bruto,
    anio,
  })
  const rendimientoPrevioNeto = bruto.minus(cotizaciones.cotizacionTrabajador)
  const reduccionTrabajo = calcularReduccionRendimientosTrabajo({
    anio,
    rendimientoPrevioNeto,
  })
  const baseImponible = max(CERO, rendimientoPrevioNeto.minus(reduccionTrabajo))
  const cuotaIntegra = calcularCuotaPorEscala({
    base: baseImponible,
    tramos: obtenerTramosIrpfLegacy(anio),
  })
  const cuotaMinimoPersonal = MINIMO_PERSONAL_IRPF_LEGACY[anio].mul(
    primerTipo(anio)
  )
  const cuotaTrasDeduccionSmi = max(
    CERO,
    cuotaIntegra
      .minus(cuotaMinimoPersonal)
      .minus(especificacion.deduccionObtencionRendimientosTrabajo(bruto))
  )
  const limiteRetencionNomina = max(
    CERO,
    bruto
      .minus(especificacion.minimoExentoRetencion)
      .mul(especificacion.tipoMaximoRetencionNomina)
  )

  return min(cuotaTrasDeduccionSmi, limiteRetencionNomina)
}

export const calcularConciliacionSimuladorLegacy = ({
  anio,
  rendimientoIntegroTrabajoCentimos,
  cuotaLiquida,
  cuotaLiquidaCentimos,
  cuotaDiferencialCentimos,
  limiteRetencionNominaCentimos,
}: {
  readonly anio: AnioFiscal
  readonly rendimientoIntegroTrabajoCentimos: number
  readonly cuotaLiquida: Decimal
  readonly cuotaLiquidaCentimos: number
  readonly cuotaDiferencialCentimos: number
  readonly limiteRetencionNominaCentimos?: number | undefined
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
        Option.fromNullishOr(limiteRetencionNominaCentimos).pipe(
          Option.match({
            onNone: () =>
              bruto
                .minus(especificacion.minimoExentoRetencion)
                .mul(especificacion.tipoMaximoRetencionNomina),
            onSome: centimosAEuros,
          })
        )
      )
      const irpfFinalSimulador =
        anio <= 2014
          ? calcularIrpfFinalSimuladorLegacyHasta2014({
              anio,
              bruto,
              especificacion,
            })
          : min(cuotaTrasDeduccionSmi, limiteRetencionNomina)
      const irpfFinalSimuladorCentimos = eurosACentimos(irpfFinalSimulador)

      return {
        _tag: "ConciliacionSimuladorLegacy",
        anio,
        cuotaLiquidadaAnualCentimos: cuotaLiquidaCentimos,
        deduccionSmiCentimos: eurosACentimos(deduccionSmi),
        cuotaTrasDeduccionSmi,
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
