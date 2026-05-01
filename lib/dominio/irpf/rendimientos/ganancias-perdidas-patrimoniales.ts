import Decimal from "decimal.js"
import { Array as EffectArray, Match } from "effect"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
  type centimosAEuros,
} from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { clasificarGananciaPatrimonialHasta2014 } from "../../normativa/datos/irpf-estatal-2012-2026"
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
  readonly baseIntegracion: "base-general" | "base-ahorro"
}

export interface GananciasPatrimonialesCalculadas {
  readonly gananciaTotal: Decimal
  readonly gananciaExenta: Decimal
  readonly gananciaSujetaAhorro: Decimal
  readonly gananciaSujetaGeneral: Decimal
}

export const calcularGananciasPatrimonialesPorTransmision = ({
  anio,
  edadContribuyente,
  ganancias,
  convertirCentimos,
}: {
  readonly anio: AnioFiscal
  readonly edadContribuyente: number
  readonly ganancias: ReadonlyArray<GananciaPatrimonialTransmision>
  readonly convertirCentimos: typeof centimosAEuros
}): GananciasPatrimonialesCalculadas =>
  EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      })
    ),
    {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
    },
    (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.gananciaExenta),
      gananciaSujetaAhorro: total.gananciaSujetaAhorro.plus(
        ganancia.baseIntegracion === "base-ahorro"
          ? ganancia.gananciaSujeta
          : IMPORTE_CERO
      ),
      gananciaSujetaGeneral: total.gananciaSujetaGeneral.plus(
        ganancia.baseIntegracion === "base-general"
          ? ganancia.gananciaSujeta
          : IMPORTE_CERO
      ),
    })
  )

const calcularGananciaPatrimonialPorTransmision = ({
  anio,
  edadContribuyente,
  ganancia,
  convertirCentimos,
}: {
  readonly anio: AnioFiscal
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
    baseIntegracion: clasificarBaseGanancia({ anio, ganancia }),
  }
}

const clasificarBaseGanancia = ({
  anio,
  ganancia,
}: {
  readonly anio: AnioFiscal
  readonly ganancia: GananciaPatrimonialTransmision
}): "base-general" | "base-ahorro" =>
  Match.value(anio).pipe(
    Match.when(
      (anio) => anio === 2013 || anio === 2014,
      () =>
        clasificarGananciaPatrimonialHasta2014({
          derivaDeTransmision: true,
          fechaAdquisicion: ganancia.fechaAdquisicion,
          fechaTransmision: ganancia.fechaTransmision,
        })
    ),
    Match.orElse(() => "base-ahorro" as const)
  )

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
  return Match.value(edadContribuyente).pipe(
    Match.when(
      (edadContribuyente) => edadContribuyente < 65,
      () => IMPORTE_CERO
    ),
    Match.orElse(() =>
      Match.valueTags(tratamiento, {
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
    )
  )
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
  return Match.value(importeTransmision).pipe(
    Match.when(
      (importeTransmision) => importeTransmision.lte(0),
      () => IMPORTE_CERO
    ),
    Match.orElse((importeTransmision) => {
      const margenReinversion = Decimal.max(
        0,
        LIMITE_REINVERSION_RENTA_VITALICIA_MAYORES_65.minus(
          reinversionesPrevias
        )
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
    })
  )
}
