import Decimal from "decimal.js"
import { Array as EffectArray, Match, Option } from "effect"

import type { TramosIrpf } from "../../normativa/datos/irpf-estatal-2012-2026"

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

export const calcularCuotaPorEscala = ({
  base,
  tramos,
  escalasPublicadas,
  aritmetica = Decimal,
}: {
  readonly base: Decimal
  readonly tramos: TramosIrpf
  readonly escalasPublicadas?: ReadonlyArray<EscalaPublicada> | undefined
  readonly aritmetica?: Decimal.Constructor
}): Decimal =>
  EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({
      base,
      tramos,
      escalasPublicadas,
      aritmetica,
    }),
    new aritmetica(0),
    (total, tramo) => total.plus(tramo.cuota)
  )

export const calcularDesgloseCuotaPorEscala = ({
  base: baseEntrada,
  tramos,
  escalasPublicadas,
  aritmetica: A = Decimal,
}: {
  readonly base: Decimal
  readonly tramos: TramosIrpf
  readonly escalasPublicadas?: ReadonlyArray<EscalaPublicada> | undefined
  readonly aritmetica?: Decimal.Constructor
}): ReadonlyArray<TramoCuotaCalculado> => {
  const base = new A(baseEntrada)
  return escalasPublicadas !== undefined
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
                limiteInferior: new A(fila.baseInferior),
                limiteSuperior: Option.match(
                  EffectArray.findFirst(filas, (otra) =>
                    otra.baseInferior.gt(fila.baseInferior)
                  ),
                  {
                    onNone: () => new A(Infinity),
                    onSome: (otra) => new A(otra.baseInferior),
                  }
                ),
                baseAplicada: base.minus(fila.baseInferior),
                tipo: new A(fila.tipo),
                cuotaFija: new A(fila.cuota),
                cuota: new A(fila.cuota).plus(
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
                const baseRestante = A.max(0, base.minus(estado.limiteAnterior))
                const anchoTramo = new A(limite).minus(estado.limiteAnterior)
                const importeEnTramo = A.min(baseRestante, anchoTramo)
                const tramo = {
                  limiteInferior: estado.limiteAnterior,
                  limiteSuperior: new A(limite),
                  baseAplicada: importeEnTramo,
                  tipo: new A(tipo),
                  cuota: importeEnTramo.mul(tipo),
                }

                return {
                  limiteAnterior: new A(limite),
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
}
