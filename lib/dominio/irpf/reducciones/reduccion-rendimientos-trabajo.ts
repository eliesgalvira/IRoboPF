import Decimal from "decimal.js"
import { Match } from "effect"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
} from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../../normativa/anio-fiscal"

const maximo = (a: Decimal, b: Decimal): Decimal => (a.greaterThan(b) ? a : b)

export const calcularReduccionRendimientosTrabajo = ({
  anio,
  rendimientoPrevioNeto,
}: {
  readonly anio: AnioFiscal
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
    Match.when(2018, () => reduccionTrabajo2018(rendimientoPrevioNeto)),
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

const reduccionTrabajo2018 = (rendimientoPrevioNeto: Decimal): Decimal =>
  reduccionTrabajo2015A2017(rendimientoPrevioNeto)
    .div(2)
    .plus(reduccionTrabajo2019A2022(rendimientoPrevioNeto).div(2))

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
