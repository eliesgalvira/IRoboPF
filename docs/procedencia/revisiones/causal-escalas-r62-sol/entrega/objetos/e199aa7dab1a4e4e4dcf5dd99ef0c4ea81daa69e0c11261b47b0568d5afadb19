import Decimal from "decimal.js"
import { Array as EffectArray, Match, Option } from "effect"

import type { AnioFiscal } from "../../normativa/anio-fiscal"
import {
  obtenerTramosIrpfLegacy,
  type TramosIrpf,
} from "../../normativa/datos/irpf-estatal-2012-2026"

import type { EscalaPublicada } from "./escalas-publicadas"

export interface TramoCuotaCalculado {
  readonly cuotaFija?: Decimal
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
  EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  )

export const calcularDesgloseCuotaPorEscalaGeneral = ({
  anio,
  base,
}: {
  readonly anio: AnioFiscal
  readonly base: Decimal
}): ReadonlyArray<TramoCuotaGeneralCalculado> =>
  calcularDesgloseCuotaPorEscala({
    base,
    tramos: obtenerTramosIrpfLegacy(anio),
  })

export const calcularCuotaPorEscala = ({
  base,
  tramos,
  escalasPublicadas,
}: {
  readonly base: Decimal
  readonly tramos: TramosIrpf
  readonly escalasPublicadas?: ReadonlyArray<EscalaPublicada> | undefined
}): Decimal =>
  EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  )

export const calcularDesgloseCuotaPorEscala = ({
  base,
  tramos,
  escalasPublicadas,
}: {
  readonly base: Decimal
  readonly tramos: TramosIrpf
  readonly escalasPublicadas?: ReadonlyArray<EscalaPublicada> | undefined
}): ReadonlyArray<TramoCuotaCalculado> =>
  escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferiorExclusivo === true
                ? base.gt(fila.baseInferior)
                : base.gte(fila.baseInferior))
          ),
          {
            onNone: () => [],
            onSome: (fila) => [
              {
                limiteInferior: fila.baseInferior,
                limiteSuperior: Option.match(
                  EffectArray.findFirst(filas, (otra) =>
                    otra.baseInferior.gt(fila.baseInferior)
                  ),
                  {
                    onNone: () => new Decimal(Infinity),
                    onSome: (otra) => otra.baseInferior,
                  }
                ),
                baseAplicada: base.minus(fila.baseInferior),
                tipo: fila.tipo,
                cuotaFija: fila.cuota,
                cuota: fila.cuota.plus(
                  base.minus(fila.baseInferior).mul(fila.tipo)
                ),
              },
            ],
          }
        )
      )
    : Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              },
              (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
                )
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
                  tramos: Match.value(importeEnTramo).pipe(
                    Match.when(
                      (importeEnTramo) => importeEnTramo.gt(0),
                      () => [...estado.tramos, tramo]
                    ),
                    Match.orElse(() => estado.tramos)
                  ),
                }
              }
            ).tramos
        )
      )
