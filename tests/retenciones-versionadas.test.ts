import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"
import {
  calcularRetencionTrabajoAeat,
  type CasoRetencionTrabajo,
} from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"

const base: CasoRetencionTrabajo = {
  anio: 2020,
  edad: 40,
  retribucionAnualCentimos: 1800000,
  cotizacionesCentimos: 114300,
  situacionFamiliar: "situacion3",
  situacionLaboral: "activo",
  contrato: "general",
  descendientes: [],
  ascendientes: [],
  discapacidad: "sin-discapacidad",
}
const calcular = (
  entrada: Partial<CasoRetencionTrabajo> & { fechaPago?: string }
) =>
  Effect.runSync(
    calcularRetencionTrabajoAeat({ ...base, ...entrada }, { modo: "canonico" })
  )
const hijo = (edad: number) => ({
  edad,
  computoPorEntero: false,
  discapacidad: "sin-discapacidad" as const,
  movilidadReducida: false,
  adopcionOAcogimientoMenosTresAnios: false,
})

describe("Retenciones históricas: referencias independientes, SS suministrada", () => {
  it.each([
    [2017, "2017-12-31", 188820],
    [2019, "2019-12-31", 171900],
    [2020, "2020-12-31", 171900],
    [2021, "2021-12-31", 171900],
    [2022, "2022-12-31", 171900],
    [2023, "2023-01-31", 171900],
    [2023, "2023-02-01", 114120],
    [2024, "2024-02-07", 114120],
    [2024, "2024-02-08", 91260],
  ] as const)("%s %s: importe %s", (anio, fechaPago, esperado) => {
    expect(calcular({ anio, fechaPago }).importeRetencionAnualCentimos).toBe(
      esperado
    )
  })
  it.each([2017, 2019, 2020, 2021] as const)("escala alta %s", (anio) => {
    expect(
      calcular({
        anio,
        fechaPago: `${anio}-12-31`,
        retribucionAnualCentimos: 40000000,
        cotizacionesCentimos: 0,
      }).importeRetencionAnualCentimos
    ).toBe(anio < 2021 ? 16892000 : 17088000)
  })
  it.each([
    [2199999, 187660],
    [2200000, 187660],
    [2200001, 263780],
  ] as const)("corte 43: %s", (retribucionAnualCentimos, esperado) => {
    expect(
      calcular({
        fechaPago: "2020-12-31",
        retribucionAnualCentimos,
        cotizacionesCentimos: 0,
        situacionFamiliar: "situacion2",
        descendientes: [hijo(10), hijo(12)],
      }).importeRetencionAnualCentimos
    ).toBe(esperado)
  })
  it("excluye al descendiente de 25 sin discapacidad", () => {
    expect(
      calcular({ descendientes: [hijo(25)] }).minimoPersonalFamiliarCentimos
    ).toBe(555000)
  })
  it.each(["2020-02-30", "2021-01-01", "invalid"])(
    "rechaza fecha %s",
    (fechaPago) => {
      expect(
        Effect.runSyncExit(
          calcularRetencionTrabajoAeat(
            { ...base, ...{ fechaPago } },
            { modo: "canonico" }
          )
        )._tag
      ).toBe("Failure")
    }
  )
  it.each([9000001, 15000000])(
    "rechaza irregular1 %s",
    (irregular1Centimos) => {
      expect(
        Effect.runSyncExit(
          calcularRetencionTrabajoAeat(
            { ...base, retribucionAnualCentimos: 30000000, irregular1Centimos },
            { modo: "canonico" }
          )
        )._tag
      ).toBe("Failure")
    }
  )
  it("legacy conserva la reproducción de base", () => {
    expect(
      Effect.runSync(
        calcularRetencionTrabajoAeat(base, { modo: "compatible-legacy" })
      ).importeRetencionAnualCentimos
    ).toBe(104760)
  })
})

describe("Contrato temporal, límites y controles", () => {
  it.each([2012, 2013, 2014, 2015, 2016] as const)(
    "cierra %s sin original anual",
    (anio) => {
      expect(
        Effect.runSyncExit(
          calcularRetencionTrabajoAeat({ ...base, anio }, { modo: "canonico" })
        )._tag
      ).toBe("Failure")
    }
  )
  it.each([2018, 2021, 2023, 2024, 2025, 2026] as const)(
    "%s exige selección",
    (anio) => {
      expect(
        Effect.runSyncExit(
          calcularRetencionTrabajoAeat({ ...base, anio }, { modo: "canonico" })
        )._tag
      ).toBe("Failure")
    }
  )
  it("perfil de cierre explícito selecciona 2023 febrero", () => {
    expect(
      calcular({ anio: 2023, perfilTemporal: "cierre" })
        .importeRetencionAnualCentimos
    ).toBe(114120)
  })
  it.each(["2026-01-01", "2026-09-09", "2026-10-30"])(
    "no acredita original retirado ni futuro %s",
    (fechaPago) => {
      expect(
        Effect.runSyncExit(
          calcularRetencionTrabajoAeat(
            { ...base, anio: 2026, fechaPago },
            { modo: "canonico" }
          )
        )._tag
      ).toBe("Failure")
    }
  )
  it("selecciona original 2026 desde septiembre", () => {
    expect(
      calcular({ anio: 2026, fechaPago: "2026-09-10" })
        .importeRetencionAnualCentimos
    ).toBe(91260)
  })
  it("regularización no se sustituye por inicial", () => {
    expect(
      Effect.runSyncExit(
        calcularRetencionTrabajoAeat(
          { ...base, procedimiento: "regularizacion" },
          { modo: "canonico" }
        )
      )._tag
    ).toBe("Failure")
  })
  it.each([
    ["2018-07-04", 370000],
    ["2018-07-05", 463250],
  ] as const)("reducción de 2018 %s", (fechaPago, esperado) => {
    expect(
      calcular({
        anio: 2018,
        fechaPago,
        retribucionAnualCentimos: 1125000,
        cotizacionesCentimos: 0,
      }).reduccionRendimientosTrabajoCentimos
    ).toBe(esperado)
  })
  it.each([
    ["especial", "8.00"],
    ["inferior-anio", "1.00"],
  ] as const)("mínimo territorial 2017 %s", (contrato, esperado) => {
    expect(
      calcular({
        anio: 2017,
        contrato,
        retribucionAnualCentimos: 1000000,
        residenciaCeutaMelilla: true,
        rendimientosCeutaMelilla: true,
      }).tipoRetencionPorcentaje
    ).toBe(esperado)
  })
  it("pensión 2018 julio usa 13.000 + 600", () => {
    expect(
      calcular({
        anio: 2018,
        fechaPago: "2018-07-05",
        retribucionAnualCentimos: 1360000,
        cotizacionesCentimos: 0,
        situacionLaboral: "pensionista",
      }).cuotaRetencionCentimos
    ).toBe(0)
  })
  it.each([9000000, 9000001])(
    "frontera irregular de %s",
    (irregular1Centimos) => {
      const salida = Effect.runSyncExit(
        calcularRetencionTrabajoAeat(
          { ...base, retribucionAnualCentimos: 30000000, irregular1Centimos },
          { modo: "canonico" }
        )
      )
      expect(salida._tag).toBe(
        irregular1Centimos === 9000000 ? "Success" : "Failure"
      )
    }
  )
  it.each([3000000, 3000001])(
    "frontera 30 por ciento %s",
    (irregular1Centimos) => {
      const salida = Effect.runSyncExit(
        calcularRetencionTrabajoAeat(
          { ...base, retribucionAnualCentimos: 10000000, irregular1Centimos },
          { modo: "canonico" }
        )
      )
      expect(salida._tag).toBe(
        irregular1Centimos === 3000000 ? "Success" : "Failure"
      )
    }
  )
  it("rastro por versión en ambas etapas", () => {
    const resultado = calcular({ anio: 2023, fechaPago: "2023-01-31" })
    expect(resultado.version).toBe("aeat-2023-01-01")
    for (const paso of resultado.rastro.pasos) {
      expect(JSON.stringify(paso)).toContain(
        "ALGORITMO_RETENCIONES_2023_1_a_31_de_enero.pdf"
      )
      expect(JSON.stringify(paso)).not.toContain("2026")
    }
  })
})

describe("Fronteras de reducción con cotización cero sintética", () => {
  it.each([
    [2017, "2017-12-31", 1125000, 370000],
    [2017, "2017-12-31", 1445000, 0],
    [2019, "2019-12-31", 1311500, 556500],
    [2019, "2019-12-31", 1682499, 2],
    [2019, "2019-12-31", 1682500, 0],
    [2023, "2023-02-01", 1404750, 649800],
    [2023, "2023-02-01", 1974749, 1],
    [2023, "2023-02-01", 1974750, 0],
    [2024, "2024-02-08", 1485200, 730200],
    [2024, "2024-02-08", 1767352, 236434],
    [2024, "2024-02-08", 1974749, 1],
    [2024, "2024-02-08", 1974750, 0],
  ] as const)(
    "%s %s RNT %s",
    (anio, fechaPago, retribucionAnualCentimos, esperado) => {
      expect(
        calcular({
          anio,
          fechaPago,
          retribucionAnualCentimos,
          cotizacionesCentimos: 0,
        }).reduccionRendimientosTrabajoCentimos
      ).toBe(esperado)
    }
  )
  it("fecha junto a cierre es ambigua", () => {
    expect(
      Effect.runSyncExit(
        calcularRetencionTrabajoAeat(
          { ...base, fechaPago: "2020-12-31", perfilTemporal: "cierre" },
          { modo: "canonico" }
        )
      )._tag
    ).toBe("Failure")
  })
})

it("legacy rechaza instrucciones temporales que no puede aplicar", () => {
  expect(
    Effect.runSyncExit(
      calcularRetencionTrabajoAeat(
        { ...base, fechaPago: "2020-12-31" },
        { modo: "compatible-legacy" }
      )
    )._tag
  ).toBe("Failure")
})
