import Decimal from "decimal.js"
import { Option } from "effect"

import { centimosAEuros, eurosACentimos } from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../../normativa/anio-fiscal"

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
  readonly irpfFinalSimuladorCentimos: number
  readonly diferenciaCuotaDiferencialEIrpfFinalCentimos: number
}

type PoliticaDeduccionSmi = (bruto: Decimal) => Decimal

interface EspecificacionConciliacionSimuladorLegacy {
  readonly minimoExentoRetencion: Decimal
  readonly tipoMaximoRetencionNomina: Decimal
  readonly deduccionSmi: PoliticaDeduccionSmi
}

const importe = (valor: Decimal.Value): Decimal => new Decimal(valor)
const CERO = importe(0)

const max = (a: Decimal, b: Decimal): Decimal => (a.greaterThan(b) ? a : b)
const min = (a: Decimal, b: Decimal): Decimal => (a.lessThan(b) ? a : b)

const deduccionSmi2025: PoliticaDeduccionSmi = (bruto) => {
  if (bruto.lte(16576)) {
    return importe(340)
  }

  if (bruto.lte(18276)) {
    return max(
      CERO,
      importe(340).minus(importe("0.20").mul(bruto.minus(16576)))
    )
  }

  return CERO
}

const ESPECIFICACIONES_CONCILIACION_SIMULADOR_LEGACY: Partial<
  Record<AnioFiscal, EspecificacionConciliacionSimuladorLegacy>
> = {
  2025: {
    minimoExentoRetencion: importe(15876),
    tipoMaximoRetencionNomina: importe("0.43"),
    deduccionSmi: deduccionSmi2025,
  },
}

export const calcularConciliacionSimuladorLegacy = ({
  anio,
  rendimientoIntegroTrabajoCentimos,
  cuotaLiquidaCentimos,
  cuotaDiferencialCentimos,
}: {
  readonly anio: AnioFiscal
  readonly rendimientoIntegroTrabajoCentimos: number
  readonly cuotaLiquidaCentimos: number
  readonly cuotaDiferencialCentimos: number
}): Option.Option<ConciliacionSimuladorLegacy> => {
  const especificacion = ESPECIFICACIONES_CONCILIACION_SIMULADOR_LEGACY[anio]
  if (especificacion === undefined) {
    return Option.none()
  }

  const bruto = centimosAEuros(rendimientoIntegroTrabajoCentimos)
  const cuotaLiquidadaAnual = centimosAEuros(cuotaLiquidaCentimos)
  const deduccionSmi = especificacion.deduccionSmi(bruto)
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
  const irpfFinalSimulador = min(cuotaTrasDeduccionSmi, limiteRetencionNomina)
  const irpfFinalSimuladorCentimos = eurosACentimos(irpfFinalSimulador)

  return Option.some({
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
    irpfFinalSimuladorCentimos,
    diferenciaCuotaDiferencialEIrpfFinalCentimos:
      cuotaDiferencialCentimos - irpfFinalSimuladorCentimos,
  })
}
