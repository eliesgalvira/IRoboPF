import Decimal from "decimal.js"
import { Array as EffectArray, Match } from "effect"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
  type centimosAEuros,
} from "../../dinero/importe-monetario"
import type {
  GananciaPatrimonialTransmision,
  TratamientoGananciaPatrimonialMayores65,
} from "../caso-fiscal-anual"

const LIMITE_REINVERSION_RENTA_VITALICIA_MAYORES_65 =
  crearImporteMonetario(240_000)

export interface GananciaPatrimonialCalculada {
  readonly gananciaTotal: Decimal
  readonly gananciaExenta: Decimal
  readonly gananciaSujeta: Decimal
}

export interface GananciasPatrimonialesCalculadas {
  readonly gananciaTotal: Decimal
  readonly gananciaExenta: Decimal
  readonly gananciaSujetaAhorro: Decimal
}

export const calcularGananciasPatrimonialesPorTransmision = ({
  edadContribuyente,
  ganancias,
  convertirCentimos,
}: {
  readonly edadContribuyente: number
  readonly ganancias: ReadonlyArray<GananciaPatrimonialTransmision>
  readonly convertirCentimos: typeof centimosAEuros
}): GananciasPatrimonialesCalculadas =>
  EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        edadContribuyente,
        ganancia,
        convertirCentimos,
      })
    ),
    {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
    },
    (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.gananciaExenta),
      gananciaSujetaAhorro: total.gananciaSujetaAhorro.plus(
        ganancia.gananciaSujeta
      ),
    })
  )

const calcularGananciaPatrimonialPorTransmision = ({
  edadContribuyente,
  ganancia,
  convertirCentimos,
}: {
  readonly edadContribuyente: number
  readonly ganancia: GananciaPatrimonialTransmision
  readonly convertirCentimos: typeof centimosAEuros
}): GananciaPatrimonialCalculada => {
  const gananciaTotal = convertirCentimos(ganancia.importeGananciaCentimos)
  const gananciaExenta = calcularGananciaExentaMayores65({
    edadContribuyente,
    gananciaTotal,
    tratamiento: ganancia.tratamientoMayores65,
    convertirCentimos,
  })

  return {
    gananciaTotal,
    gananciaExenta,
    gananciaSujeta: Decimal.max(0, gananciaTotal.minus(gananciaExenta)),
  }
}

const calcularGananciaExentaMayores65 = ({
  edadContribuyente,
  gananciaTotal,
  tratamiento,
  convertirCentimos,
}: {
  readonly edadContribuyente: number
  readonly gananciaTotal: Decimal
  readonly tratamiento: TratamientoGananciaPatrimonialMayores65
  readonly convertirCentimos: typeof centimosAEuros
}): Decimal => {
  if (edadContribuyente < 65) {
    return IMPORTE_CERO
  }

  return Match.valueTags(tratamiento, {
    SinExencionMayores65: () => IMPORTE_CERO,
    ViviendaHabitualMayores65: () => gananciaTotal,
    ReinversionRentaVitaliciaMayores65: ({
      importeReinvertidoRentaVitaliciaCentimos,
      importeTransmisionCentimos,
      reinversionesPreviasRentaVitaliciaCentimos,
    }) =>
      calcularExencionPorReinversionEnRentaVitalicia({
        gananciaTotal,
        importeTransmision: convertirCentimos(importeTransmisionCentimos),
        importeReinvertido: convertirCentimos(
          importeReinvertidoRentaVitaliciaCentimos
        ),
        reinversionesPrevias: convertirCentimos(
          reinversionesPreviasRentaVitaliciaCentimos
        ),
      }),
  })
}

const calcularExencionPorReinversionEnRentaVitalicia = ({
  gananciaTotal,
  importeReinvertido,
  importeTransmision,
  reinversionesPrevias,
}: {
  readonly gananciaTotal: Decimal
  readonly importeTransmision: Decimal
  readonly importeReinvertido: Decimal
  readonly reinversionesPrevias: Decimal
}): Decimal => {
  if (importeTransmision.lte(0)) {
    return IMPORTE_CERO
  }

  const margenReinversion = Decimal.max(
    0,
    LIMITE_REINVERSION_RENTA_VITALICIA_MAYORES_65.minus(reinversionesPrevias)
  )
  const reinversionComputable = Decimal.min(
    importeReinvertido,
    margenReinversion
  )
  const proporcionExenta = Decimal.min(
    1,
    reinversionComputable.div(importeTransmision)
  )

  return gananciaTotal.mul(proporcionExenta)
}
