import Decimal from "decimal.js"
import { Match, Option } from "effect"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
} from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../../normativa/anio-fiscal"

const maximo = (a: Decimal, b: Decimal): Decimal =>
  Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  )

export const calcularReduccionRendimientosTrabajo = ({
  anio,
  fechaFallecimiento,
  rendimientoPrevioNeto,
}: {
  readonly anio: AnioFiscal
  readonly fechaFallecimiento?: Date | undefined
  readonly rendimientoPrevioNeto: Decimal
}): Decimal =>
  Match.value(anio).pipe(
    Match.when(
      (anio) => anio <= 2014,
      () => reduccionTrabajoHasta2014(rendimientoPrevioNeto)
    ),
    Match.when(
      (anio) => anio <= 2017,
      () => reduccionTrabajo2015A2017(rendimientoPrevioNeto)
    ),
    Match.when(2018, () =>
      reduccionTrabajo2018({ fechaFallecimiento, rendimientoPrevioNeto })
    ),
    Match.when(
      (anio) => anio <= 2022,
      () => reduccionTrabajo2019A2022(rendimientoPrevioNeto)
    ),
    Match.when(2023, () => reduccionTrabajo2023(rendimientoPrevioNeto)),
    Match.orElse(() => reduccionTrabajoDesde2024(rendimientoPrevioNeto))
  )

const reduccionTrabajoHasta2014 = (rendimientoPrevioNeto: Decimal): Decimal =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180),
      () => crearImporteMonetario(4080)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260),
      () =>
        crearImporteMonetario(4080).minus(
          crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180))
        )
    ),
    Match.orElse(() => crearImporteMonetario(2652))
  )

const reduccionTrabajo2015A2017 = (rendimientoPrevioNeto: Decimal): Decimal =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(3700)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450),
      () =>
        crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        )
    ),
    Match.orElse(() => IMPORTE_CERO)
  )

const reduccionTrabajo2019A2022 = (rendimientoPrevioNeto: Decimal): Decimal =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(5565)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825),
      () =>
        maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          )
        )
    ),
    Match.orElse(() => IMPORTE_CERO)
  )

const FECHA_CORTE_REDUCCION_TRABAJO_2018 = "2018-07-05"

const fechaCivilIsoUtc = (fecha: Date): string =>
  [
    fecha.getUTCFullYear(),
    String(fecha.getUTCMonth() + 1).padStart(2, "0"),
    String(fecha.getUTCDate()).padStart(2, "0"),
  ].join("-")

const fallecidoAntesDeFechaCivil = ({
  fechaCorte,
  fechaFallecimiento,
}: {
  readonly fechaCorte: string
  readonly fechaFallecimiento?: Date | undefined
}): boolean =>
  Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    })
  )

const reduccionTrabajo2018 = ({
  fechaFallecimiento,
  rendimientoPrevioNeto,
}: {
  readonly fechaFallecimiento?: Date | undefined
  readonly rendimientoPrevioNeto: Decimal
}): Decimal => {
  const reduccionAnterior = reduccionTrabajo2015A2017(rendimientoPrevioNeto)
  const reduccionNueva = reduccionTrabajo2019A2022(rendimientoPrevioNeto)

  return Match.value(
    fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    })
  ).pipe(
    Match.when(true, () => reduccionAnterior),
    Match.orElse(() =>
      reduccionAnterior.plus(
        maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2)
      )
    )
  )
}

const reduccionTrabajo2023 = (rendimientoPrevioNeto: Decimal): Decimal =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"),
      () => crearImporteMonetario(6498)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"),
      () =>
        maximo(
          IMPORTE_CERO,
          crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            )
          )
        )
    ),
    Match.orElse(() => IMPORTE_CERO)
  )

const reduccionTrabajoDesde2024 = (rendimientoPrevioNeto: Decimal): Decimal =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852),
      () => crearImporteMonetario(7302)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"),
      () =>
        crearImporteMonetario(7302).minus(
          crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852))
        )
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"),
      () =>
        crearImporteMonetario("2364.34").minus(
          crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          )
        )
    ),
    Match.orElse(() => IMPORTE_CERO)
  )
