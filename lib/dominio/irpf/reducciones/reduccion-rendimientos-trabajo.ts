import Decimal from "decimal.js"

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
}): Decimal => {
  if (anio <= 2014) {
    return reduccionTrabajoHasta2014(rendimientoPrevioNeto)
  }

  if (anio <= 2017) {
    return reduccionTrabajo2015A2017(rendimientoPrevioNeto)
  }

  if (anio === 2018) {
    return reduccionTrabajo2018(rendimientoPrevioNeto)
  }

  if (anio <= 2022) {
    return reduccionTrabajo2019A2022(rendimientoPrevioNeto)
  }

  if (anio === 2023) {
    return reduccionTrabajo2023(rendimientoPrevioNeto)
  }

  return reduccionTrabajoDesde2024(rendimientoPrevioNeto)
}

const reduccionTrabajoHasta2014 = (rendimientoPrevioNeto: Decimal): Decimal => {
  if (rendimientoPrevioNeto.lte(9180)) {
    return crearImporteMonetario(4080)
  }

  if (rendimientoPrevioNeto.lte(13260)) {
    return crearImporteMonetario(4080).minus(
      crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180))
    )
  }

  return crearImporteMonetario(2652)
}

const reduccionTrabajo2015A2017 = (rendimientoPrevioNeto: Decimal): Decimal => {
  if (rendimientoPrevioNeto.lte(11250)) {
    return crearImporteMonetario(3700)
  }

  if (rendimientoPrevioNeto.lte(14450)) {
    return crearImporteMonetario(3700).minus(
      crearImporteMonetario("1.15625").mul(rendimientoPrevioNeto.minus(11250))
    )
  }

  return IMPORTE_CERO
}

const reduccionTrabajo2019A2022 = (rendimientoPrevioNeto: Decimal): Decimal => {
  if (rendimientoPrevioNeto.lte(13115)) {
    return crearImporteMonetario(5565)
  }

  if (rendimientoPrevioNeto.lte(16825)) {
    return maximo(
      IMPORTE_CERO,
      crearImporteMonetario(5565).minus(
        crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
      )
    )
  }

  return IMPORTE_CERO
}

const reduccionTrabajo2018 = (rendimientoPrevioNeto: Decimal): Decimal =>
  reduccionTrabajo2015A2017(rendimientoPrevioNeto)
    .div(2)
    .plus(reduccionTrabajo2019A2022(rendimientoPrevioNeto).div(2))

const reduccionTrabajo2023 = (rendimientoPrevioNeto: Decimal): Decimal => {
  if (rendimientoPrevioNeto.lte("14047.50")) {
    return crearImporteMonetario(6498)
  }

  if (rendimientoPrevioNeto.lte("19747.50")) {
    return maximo(
      IMPORTE_CERO,
      crearImporteMonetario(6498).minus(
        crearImporteMonetario("1.14").mul(
          rendimientoPrevioNeto.minus("14047.50")
        )
      )
    )
  }

  return IMPORTE_CERO
}

const reduccionTrabajoDesde2024 = (rendimientoPrevioNeto: Decimal): Decimal => {
  if (rendimientoPrevioNeto.lte(14852)) {
    return crearImporteMonetario(7302)
  }

  if (rendimientoPrevioNeto.lte("17673.52")) {
    return crearImporteMonetario(7302).minus(
      crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852))
    )
  }

  if (rendimientoPrevioNeto.lte("19747.50")) {
    return crearImporteMonetario("2364.34").minus(
      crearImporteMonetario("1.14").mul(rendimientoPrevioNeto.minus("17673.52"))
    )
  }

  return IMPORTE_CERO
}
