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

/** Perfil histórico de compatibilidad: declara expresamente ausencia de otras rentas. */
export const calcularReduccionRendimientosTrabajo = (entrada: {
  readonly anio: AnioFiscal
  readonly fechaFallecimiento?: Date | undefined
  readonly rendimientoPrevioNeto: Decimal
}): Decimal =>
  calcularReduccionTrabajoConOtrasRentas({
    ...entrada,
    otrasRentasNoExentas: IMPORTE_CERO,
  })

export const calcularReduccionTrabajoConOtrasRentas = ({
  anio,
  fechaFallecimiento,
  rendimientoPrevioNeto,
  otrasRentasNoExentas,
  compatibilidadOpen2025,
  compatibilidadOpen2018,
}: {
  readonly anio: AnioFiscal
  readonly fechaFallecimiento?: Date | undefined
  readonly rendimientoPrevioNeto: Decimal
  /** Suma algebraica de rentas distintas del trabajo, antes de reducciones y compensaciones. */
  readonly otrasRentasNoExentas: Decimal
  /** Compatibilidad observada, exclusivamente empleo Madrid 2025; no regla legal.
   * Sólo operandos de 0 a 1.000.000 EUR; fuera se conserva la ruta decimal. */
  /** Política interna, habilitada sólo por la conexión explícita acotada. */
  readonly compatibilidadOpen2018?: { readonly integro: Decimal; readonly gastosAE: Decimal } | undefined
  readonly compatibilidadOpen2025?:
    | {
        readonly integro: Decimal
        readonly gastosAE: Decimal
      }
    | undefined
}): Decimal =>
  Match.value(anio).pipe(
    Match.when(
      () => otrasRentasNoExentas.gt(6500),
      () => (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO)
    ),
    Match.when(
      (anio) => anio <= 2014,
      () => reduccionTrabajoHasta2014(rendimientoPrevioNeto)
    ),
    Match.when(
      (anio) => anio <= 2017,
      () => reduccionTrabajo2015A2017(rendimientoPrevioNeto)
    ),
    Match.when(2018, () =>
      reduccionTrabajo2018({ fechaFallecimiento, rendimientoPrevioNeto, compatibilidadOpen2018 })
    ),
    Match.when(
      (anio) => anio <= 2022,
      () => reduccionTrabajo2019A2022(rendimientoPrevioNeto)
    ),
    Match.when(2023, () => reduccionTrabajo2023(rendimientoPrevioNeto)),
    Match.orElse(() => {
      // Cota técnica, no límite fiscal. Evita cancelar acumulados enormes en
      // binary64. Dentro de esta cota el error de resta es muy inferior a
      // 0,0001 EUR (el paso de la fórmula con entradas a céntimos); los empates
      // observados conservan su recorrido. Fuera no se infiere compatibilidad.
      const open =
        anio === 2025 &&
        compatibilidadOpen2025 !== undefined &&
        [compatibilidadOpen2025.integro, compatibilidadOpen2025.gastosAE].every(
          (v) => v.isFinite() && v.gte(0) && v.lte("1000000")
        )
          ? compatibilidadOpen2025
          : undefined
      const previo =
        open === undefined
          ? rendimientoPrevioNeto
          : crearImporteMonetario(
              open.integro.toNumber() - open.gastosAE.toNumber()
            )
      const reduccion = reduccionTrabajoDesde2024(previo, open !== undefined)
      return open === undefined
        ? reduccion
        : crearImporteMonetario(Math.round(reduccion.toNumber() * 100) / 100)
    })
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

const reduccionTrabajo2015A2017 = (rendimientoPrevioNeto: Decimal, open = false): Decimal =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(3700)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450),
      () =>
        reduccionTramoArt20("3700", "1.15625", rendimientoPrevioNeto, "11250", open)
    ),
    Match.orElse(() => IMPORTE_CERO)
  )

const reduccionTrabajo2019A2022 = (rendimientoPrevioNeto: Decimal, open = false): Decimal =>
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
          reduccionTramoArt20("5565", "1.5", rendimientoPrevioNeto, "13115", open)
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
  compatibilidadOpen2018,
}: {
  readonly fechaFallecimiento?: Date | undefined
  readonly rendimientoPrevioNeto: Decimal
  readonly compatibilidadOpen2018?: { readonly integro: Decimal; readonly gastosAE: Decimal } | undefined
}): Decimal => {
  const open = fechaFallecimiento === undefined && compatibilidadOpen2018 !== undefined
  // La conexión valida céntimos, transporte decimal corto y cota antes de activar.
  const previo = open
    ? restarArt20(compatibilidadOpen2018.integro, compatibilidadOpen2018.gastosAE, true)
    : rendimientoPrevioNeto
  const q = (v: Decimal) => open ? v.toDecimalPlaces(2, Decimal.ROUND_HALF_UP) : v
  const reduccionAnterior = q(reduccionTrabajo2015A2017(previo, open))
  const reduccionNueva = q(reduccionTrabajo2019A2022(previo, open))

  return Match.value(
    fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    })
  ).pipe(
    Match.when(true, () => reduccionAnterior),
    Match.orElse(() =>
      q(reduccionAnterior.plus(
        maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2)
      ))
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

// Una sola fórmula por tramo: la política cambia las operaciones, no los coeficientes.
const restarArt20 = (a: Decimal, b: Decimal, open: boolean): Decimal =>
  open ? crearImporteMonetario(a.toNumber() - b.toNumber()) : a.minus(b)
const multiplicarArt20 = (a: Decimal, b: Decimal, open: boolean): Decimal =>
  open ? crearImporteMonetario(a.toNumber() * b.toNumber()) : a.mul(b)
const reduccionTramoArt20 = (
  base: string,
  coeficiente: string,
  previo: Decimal,
  umbral: string,
  open: boolean
): Decimal =>
  restarArt20(
    crearImporteMonetario(base),
    multiplicarArt20(
      crearImporteMonetario(coeficiente),
      restarArt20(previo, crearImporteMonetario(umbral), open),
      open
    ),
    open
  )
const reduccionTrabajoDesde2024 = (
  rendimientoPrevioNeto: Decimal,
  open = false
): Decimal =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852),
      () => crearImporteMonetario(7302)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"),
      () =>
        reduccionTramoArt20(
          "7302",
          "1.75",
          rendimientoPrevioNeto,
          "14852",
          open
        )
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50"),
      () =>
        reduccionTramoArt20(
          "2364.34",
          "1.14",
          rendimientoPrevioNeto,
          "17673.52",
          open
        )
    ),
    Match.orElse(() => IMPORTE_CERO)
  )
