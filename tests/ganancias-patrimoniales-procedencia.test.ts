import { describe, expect, it } from "@effect/vitest"

import { centimosAEuros } from "../lib/dominio/dinero/importe-monetario"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"
import type { GananciaPatrimonialTransmision } from "../lib/dominio/irpf/caso-fiscal-anual"
import { calcularGananciasPatrimonialesPorTransmision } from "../lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales"

const calcular = (
  anio: AnioFiscal,
  ganancias: ReadonlyArray<GananciaPatrimonialTransmision>,
  edadContribuyente = 70
) =>
  calcularGananciasPatrimonialesPorTransmision({
    anio,
    ganancias,
    edadContribuyente,
    convertirCentimos: centimosAEuros,
  })

const operacion = (
  importeGananciaCentimos: number,
  anio: AnioFiscal = 2014
): GananciaPatrimonialTransmision => ({
  importeGananciaCentimos,
  tratamientoMayores65: { _tag: "SinExencionMayores65" },
  fechaAdquisicion: "2010-01-01",
  fechaTransmision: `${anio}-06-01`,
})

describe("ganancias: correcciones CG-01, CG-02 y CG-03 revisadas independientemente", () => {
  // Art. 49 LIRPF: son pérdidas previamente calificadas como computables.
  it.each<AnioFiscal>([2012, 2013, 2014, 2015, 2025])(
    "conserva el saldo de transmisiones largas en %s",
    (anio) => {
      const saldo = calcular(anio, [
        operacion(1_000_000, anio),
        operacion(-400_000, anio),
      ])
      expect(saldo.gananciaExenta.toString()).toBe("0")
      expect(saldo.gananciaSujetaAhorro.toString()).toBe("6000")
      const perdida = calcular(anio, [operacion(-400_000, anio)])
      expect(perdida.gananciaExenta.toString()).toBe("0")
      expect(perdida.gananciaSujetaAhorro.toString()).toBe("-4000")
    }
  )

  // DA 37 LIRPF, RDL 18/2012 DF 3 y Ley 8/2012 DF 3: ventana de adquisición.
  it.each([
    ["2012-05-11", false, "0"],
    ["2012-05-12", false, "5000"],
    ["2012-12-31", false, "5000"],
    ["2013-01-01", false, "0"],
    ["2012-06-01", true, "0"],
  ] as const)(
    "venta 2025, adquisición %s, vinculada %s",
    (fechaAdquisicion, vinculada, exenta) => {
      const saldo = calcular(2025, [
        {
          ...operacion(1_000_000),
          fechaAdquisicion,
          fechaTransmision: "2025-07-01",
          exencionInmuebleUrbanoAdquirido2012: {
            inmuebleUrbano: true,
            tituloOneroso: true,
            fechaAdquisicion,
            operacionConPersonaOEntidadVinculada: vinculada,
          },
        },
      ])
      expect(saldo.gananciaExenta.toString()).toBe(exenta)
      expect(
        saldo.gananciaSujetaAhorro.plus(saldo.gananciaExenta).toString()
      ).toBe("10000")
    }
  )

  // Ley 26/2014 art. 1.24 y DF 6: efectos desde 01-01-2015.
  it.each<AnioFiscal>([2014, 2015])(
    "fecha la exención de renta vitalicia en %s",
    (anio) => {
      const saldo = calcular(anio, [
        {
          ...operacion(1_000_000),
          fechaTransmision: `${anio}-06-01`,
          tratamientoMayores65: {
            _tag: "ReinversionRentaVitaliciaMayores65",
            importeTransmisionCentimos: 2_000_000,
            importeReinvertidoRentaVitaliciaCentimos: 2_000_000,
            reinversionesPreviasRentaVitaliciaCentimos: 0,
          },
        },
      ])
      expect(saldo.gananciaExenta.toString()).toBe(
        anio === 2014 ? "0" : "10000"
      )
    }
  )

  it("conserva la exención distinta de vivienda habitual en 2014", () => {
    const saldo = calcular(2014, [
      {
        ...operacion(1_000_000),
        tratamientoMayores65: { _tag: "ViviendaHabitualMayores65" },
      },
    ])
    expect(saldo.gananciaExenta.toString()).toBe("10000")
  })

  it("una pérdida no se convierte en exención negativa aunque tenga tratamiento de vivienda", () => {
    const saldo = calcular(2025, [
      {
        ...operacion(-400_000),
        tratamientoMayores65: { _tag: "ViviendaHabitualMayores65" },
      },
    ])
    expect(saldo.gananciaExenta.toString()).toBe("0")
    expect(saldo.gananciaSujetaAhorro.toString()).toBe("-4000")
  })
})
