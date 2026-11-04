import Decimal from "decimal.js"
export const calcularCuotaDiferencialCentimos = ({
  cuotaLiquidaCentimos,
  pagosACuentaCentimos,
  retencionesSoportadasCentimos,
}: {
  readonly cuotaLiquidaCentimos: number
  readonly pagosACuentaCentimos: number
  readonly retencionesSoportadasCentimos: number
}) =>
  liquidarPagosAnuales(
    new Decimal(cuotaLiquidaCentimos),
    new Decimal(retencionesSoportadasCentimos),
    new Decimal(pagosACuentaCentimos)
  ).toNumber()

/** Misma unidad y etapa monetaria en los tres operandos. */
export const liquidarPagosAnuales = (
  cuota: Decimal,
  retenciones: Decimal,
  pagos: Decimal
): Decimal => cuota.minus(retenciones).minus(pagos)
