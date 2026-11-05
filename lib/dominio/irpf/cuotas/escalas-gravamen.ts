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
  representacion = "decimal",
}: {
  readonly base: Decimal
  readonly tramos: TramosIrpf
  readonly escalasPublicadas?: ReadonlyArray<EscalaPublicada> | undefined
  readonly representacion?: "decimal" | "binary64-corto" | undefined
  readonly aritmetica?: Decimal.Constructor
}): Decimal =>
  EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({
      base,
      tramos,
      escalasPublicadas,
      aritmetica,
      representacion,
    }),
    new aritmetica(0),
    (total, tramo) => representacion === "binary64-corto"
      ? new aritmetica(String(total.toNumber() + tramo.cuota.toNumber()))
      : total.plus(tramo.cuota)
  )

export const calcularDesgloseCuotaPorEscala = ({
  base: baseEntrada,
  tramos,
  escalasPublicadas,
  aritmetica: A = Decimal,
  representacion = "decimal",
}: {
  readonly base: Decimal
  readonly tramos: TramosIrpf
  readonly escalasPublicadas?: ReadonlyArray<EscalaPublicada> | undefined
  readonly representacion?: "decimal" | "binary64-corto" | undefined
  readonly aritmetica?: Decimal.Constructor
}): ReadonlyArray<TramoCuotaCalculado> => {
  const base = new A(baseEntrada)
  // Cada operación conserva su recorrido binary64; String transporta el decimal
  // corto, sin toFixed(2), Math.round ni redondeo de la fracción binaria exacta.
  const restar = (a: Decimal, b: Decimal.Value) => representacion === "binary64-corto"
    ? new A(String(a.toNumber() - new A(b).toNumber())) : a.minus(b)
  const multiplicar = (a: Decimal, b: Decimal.Value) => representacion === "binary64-corto"
    ? new A(String(a.toNumber() * new A(b).toNumber())) : a.mul(b)
  const sumar = (a: Decimal, b: Decimal) => representacion === "binary64-corto"
    ? new A(String(a.toNumber() + b.toNumber())) : a.plus(b)
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
                baseAplicada: restar(base, fila.baseInferior),
                tipo: new A(fila.tipo),
                cuotaFija: new A(fila.cuota),
                cuota: sumar(new A(fila.cuota), multiplicar(restar(base, fila.baseInferior), fila.tipo)),
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
                const baseRestante = A.max(0, restar(base, estado.limiteAnterior))
                const anchoTramo = restar(new A(limite), estado.limiteAnterior)
                const importeEnTramo = A.min(baseRestante, anchoTramo)
                const tramo = {
                  limiteInferior: estado.limiteAnterior,
                  limiteSuperior: new A(limite),
                  baseAplicada: importeEnTramo,
                  tipo: new A(tipo),
                  cuota: multiplicar(importeEnTramo, tipo),
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
