import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"
import Decimal from "decimal.js"

import { sinDiscapacidad } from "../lib/dominio/irpf/caso-fiscal-anual"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { calcularReduccionTrabajoConOtrasRentas } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"

const caso = (
  anio: CasoFiscalAnual["anio"],
  ganancias: ReadonlyArray<number>,
  alquiler = 0,
  exenta = false
): CasoFiscalAnual => ({
  anio,
  comunidadAutonoma: "simulada-estatal",
  situacionFamiliar: {
    tipo: "individual",
    edad: exenta ? 70 : 40,
    discapacidad: sinDiscapacidad,
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: {
    trabajo: [{ importeIntegroCentimos: 900_000 }],
    capitalInmobiliario: [{ importeIntegroCentimos: alquiler }],
    gananciasPatrimoniales: ganancias.map((importeGananciaCentimos) => ({
      importeGananciaCentimos,
      tratamientoMayores65: exenta
        ? { _tag: "ViviendaHabitualMayores65" }
        : { _tag: "SinExencionMayores65" },
    })),
  },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})

describe("TDE-09/10: otras rentas netas no exentas", () => {
  it.each<CasoFiscalAnual["anio"]>([
    2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
    2024, 2025, 2026,
  ])("aplica el límite estricto por encima de 6500 en %s", (anio) => {
    const calcular = (otrasRentasNoExentas: string) =>
      calcularReduccionTrabajoConOtrasRentas({
        anio,
        rendimientoPrevioNeto: new Decimal(9000),
        otrasRentasNoExentas: new Decimal(otrasRentasNoExentas),
      })
    const sinOtrasRentas = calcular("0")
    expect(calcular("6500").eq(sinOtrasRentas)).toBe(true)
    expect(calcular("-7000").eq(sinOtrasRentas)).toBe(true)
    expect(calcular("6500.01").toString()).toBe(anio <= 2014 ? "2652" : "0")
  })

  it.each<CasoFiscalAnual["anio"]>([2012, 2013, 2014, 2015, 2024, 2025, 2026])(
    "integra otras rentas en el servicio anual de %s",
    (anio) => {
      const r = Effect.runSync(
        liquidarIrpfAnual(caso(anio, [700_000]), { modo: "canonico" })
      )
      expect(r.reduccionRendimientosTrabajoCentimos).toBe(
        anio <= 2014 ? 265_200 : 0
      )
    }
  )
  it("suma algebraicamente la pérdida antes de limitar la base del ahorro", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(caso(2025, [-200_000], 800_000), { modo: "canonico" })
    )
    expect(r.reduccionRendimientosTrabajoCentimos).toBe(730_200)
  })
  it("excluye la ganancia exenta del umbral", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(caso(2025, [900_000], 0, true), { modo: "canonico" })
    )
    expect(r.reduccionRendimientosTrabajoCentimos).toBe(730_200)
  })
  it("el límite también incluye el capital inmobiliario simplificado", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(caso(2025, [], 650_001), { modo: "canonico" })
    )
    expect(r.reduccionRendimientosTrabajoCentimos).toBe(0)
  })
})
