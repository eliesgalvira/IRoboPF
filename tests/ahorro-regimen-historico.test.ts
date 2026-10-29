import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { sinDiscapacidad } from "../lib/dominio/irpf/caso-fiscal-anual"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"

const caso = (anio: AnioFiscal, deduccion = 0): CasoFiscalAnual => ({
  anio,
  comunidadAutonoma: "madrid",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    descendientes: [],
    ascendientes: [],
    discapacidad: sinDiscapacidad,
  },
  rendimientos: {
    trabajo: [],
    gananciasPatrimoniales: [
      {
        importeGananciaCentimos: 1000000,
        tratamientoMayores65: { _tag: "SinExencionMayores65" },
        fechaAdquisicion: "2010-01-01",
        fechaTransmision: `${anio}-06-01`,
      },
    ],
  },
  reducciones: [],
  deducciones: [],
  deduccionAutonomicaAgregadaCentimos: deduccion,
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})
describe("ahorro anual separado", () => {
  it.each([2012, 2013, 2014] as const)(
    "%i resta remanente antes de tarifa",
    (anio) => {
      expect(
        Effect.runSync(liquidarIrpfAnual(caso(anio), { modo: "canonico" }))
          .cuotaLiquidaCentimos
      ).toBe(101829)
    }
  )
  it("2025 conserva los mínimos suministrados distintos", () => {
    expect(
      Effect.runSync(liquidarIrpfAnual(caso(2025), { modo: "canonico" }))
        .cuotaLiquidaCentimos
    ).toBe(88687)
  })
  it("consignación agregada dispone también de cuota autonómica de ahorro", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(caso(2025, 10000), { modo: "canonico" })
    )
    expect(r.deduccionesAutonomicasCentimos).toBe(10000)
    expect(r.cuotaLiquidaCentimos).toBe(78687)
  })
})

import Decimal from "decimal.js"
import {
  calcularAhorroConMinimos,
  calcularCuotaComponenteAhorro,
} from "../lib/dominio/irpf/cuotas/cuota-integra-ahorro"

const ahorro = (
  anio: AnioFiscal,
  base: number,
  estatal: number,
  autonomico: number,
  general = 0
) =>
  calcularAhorroConMinimos({
    anio,
    base: new Decimal(base),
    baseGeneral: new Decimal(general),
    minimoEstatal: new Decimal(estatal),
    minimoAutonomico: new Decimal(autonomico),
  })
it("mínimos invertidos se aplican a su componente", () => {
  const r = ahorro(2025, 10000, 5956.65, 5550)
  expect(r.estatal.despuesMinimo.toString()).toBe("424.11825")
  expect(r.autonomico.despuesMinimo.toString()).toBe("462.75")
})
it.each([2012, 2015, 2025] as const)(
  "%i base insuficiente y remanentes independientes",
  (anio) => {
    const r = ahorro(anio, 3000, 5550, 2000)
    expect(r.estatal.despuesMinimo.toString()).toBe("0")
    expect(r.autonomico.despuesMinimo.toString()).toBe(
      anio === 2015 ? "100" : "95"
    )
    const s = ahorro(anio, 3000, 5550, 2000, 6000)
    expect(s.estatal.minoracion.toString()).toBe("0")
    expect(s.autonomico.minoracion.toString()).toBe("0")
  }
)
it("2015 no divide el total por dos", () => {
  expect(
    calcularCuotaComponenteAhorro({
      anio: 2015,
      base: new Decimal(50000),
      componente: "estatal",
    }).toString()
  ).toBe("5190")
  expect(
    calcularCuotaComponenteAhorro({
      anio: 2015,
      base: new Decimal(50000),
      componente: "autonomico",
    }).toString()
  ).toBe("5440")
  const r = ahorro(2015, 10000, 5550, 6000)
  expect(r.estatal.despuesMinimo.toString()).toBe("462.75")
  expect(r.autonomico.despuesMinimo.toString()).toBe("440")
  const s = ahorro(2015, 10000, 6000, 5550)
  expect(s.estatal.despuesMinimo.toString()).toBe("420")
  expect(s.autonomico.despuesMinimo.toString()).toBe("485")
})
it("2012 el recargo es exclusivamente estatal", () => {
  const r = ahorro(2012, 10000, 5151, 5151)
  expect(r.estatal.despuesMinimo.toString()).toBe("557.635")
  expect(r.autonomico.despuesMinimo.toString()).toBe("460.655")
  expect(
    r.estatal.despuesMinimo.plus(r.autonomico.despuesMinimo).toString()
  ).toBe("1018.29")
})
it("la consignación no consume la cuota estatal", () => {
  const r = Effect.runSync(
    liquidarIrpfAnual(caso(2025, 1000000), { modo: "canonico" })
  )
  expect(r.deduccionesAutonomicasCentimos).toBe(42412)
  expect(r.cuotaLiquidaCentimos).toBe(46275)
})

it("liquidación general integra cuotas publicadas y mínimos sin alterar ganancias", () => {
  const inicial = caso(2013)
  const r = Effect.runSync(
    liquidarIrpfAnual(
      {
        ...inicial,
        comunidadAutonoma: "andalucia",
        rendimientos: {
          trabajo: [],
          gananciasPatrimoniales: [
            {
              importeGananciaCentimos: 6000000,
              tratamientoMayores65: { _tag: "SinExencionMayores65" },
              fechaAdquisicion: "2013-01-01",
              fechaTransmision: "2013-06-01",
            },
          ],
        },
      },
      { modo: "canonico" }
    )
  )
  expect(r.baseLiquidableGeneralCentimos).toBe(6000000)
  expect(r.cuotaIntegraGeneralCentimos).toBe(2023113)
  expect(r.cuotaMinimoPersonalCentimos).toBe(127487)
  expect(r.cuotaLiquidaCentimos).toBe(1895626)
})

it.each([
  [2012, 50000, "7590", "5190"],
  [2015, 50000, "5190", "5440"],
  [2021, 200001, "22440.13", "22440.13"],
  [2023, 300001, "35940.14", "35940.14"],
  [2025, 300001, "35940.15", "35940.15"],
] as const)("componentes a base alta %i", (anio, base, estatal, autonomico) => {
  const r = ahorro(anio, base, 0, 0)
  expect(r.estatal.bruta.toString()).toBe(estatal)
  expect(r.autonomico.bruta.toString()).toBe(autonomico)
})
