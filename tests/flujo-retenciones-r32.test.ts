import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  calcularRetencionTrabajoAeat,
  type CasoRetencionTrabajo,
} from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
import { composeRetencionesR32 } from "../scripts/procedencia/flujo-retenciones-r32.mjs"

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
const calcular = (entrada: Partial<CasoRetencionTrabajo>) =>
  Effect.runSync(
    calcularRetencionTrabajoAeat({ ...base, ...entrada }, { modo: "canonico" })
  )
const rechazar = (entrada: Partial<CasoRetencionTrabajo>) =>
  expect(
    Effect.runSyncExit(
      calcularRetencionTrabajoAeat(
        { ...base, ...entrada },
        { modo: "canonico" }
      )
    )._tag
  ).toBe("Failure")
const anual: CasoFiscalAnual = {
  anio: 2020,
  comunidadAutonoma: "simulada-estatal",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    descendientes: [],
    ascendientes: [],
    discapacidad: { _tag: "SinDiscapacidad" },
  },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 12345,
  pagosACuentaCentimos: 6789,
}

describe("fragmento concreto R32", () => {
  it("el fragmento R32 histórico no acepta fuentes reformadas", () =>
    expect(() => composeRetencionesR32()).toThrow(
      "Contrato de fuente R32 cambiado"
    ))
  it("los puertos históricos requieren regeneración antes de aceptar el nuevo código", () =>
    expect(() => composeRetencionesR32()).toThrow(
      "Contrato de fuente R32 cambiado"
    ))
  it("positivo real diferencia cuota, porcentaje e importe", () => {
    expect(calcular({})).toMatchObject({
      version: "aeat-2020-01-01",
      cuotaRetencionCentimos: 172000,
      tipoRetencionPorcentaje: "9.55",
      importeRetencionAnualCentimos: 171900,
    })
  })
  it.each([2012, 2013, 2014, 2015, 2016] as const)("no habilita %s", (anio) =>
    rechazar({ anio })
  )
  it.each([2018, 2021, 2023, 2024, 2025, 2026] as const)(
    "no inventa selección %s",
    (anio) => rechazar({ anio })
  )
  it.each(["2020-02-30", "2021-01-01"])("fecha rechazada %s", (fechaPago) =>
    rechazar({ fechaPago })
  )
  it("no regulariza ni admite dos selectores", () => {
    rechazar({ procedimiento: "regularizacion" })
    rechazar({ fechaPago: "2020-01-01", perfilTemporal: "cierre" })
  })
  it.each(["2026-09-09", "2026-10-30"])("no extiende ventana %s", (fechaPago) =>
    rechazar({ anio: 2026, fechaPago })
  )
  it("ventana 2026 acreditada por motor", () =>
    expect(calcular({ anio: 2026, fechaPago: "2026-09-10" }).version).toBe(
      "aeat-2026-09-10"
    ))

  it.each([0, -1, 1.5])("rechaza divisor %s", (convivencia) =>
    rechazar({
      ascendientes: [
        {
          edad: 75,
          convivencia,
          discapacidad: "sin-discapacidad",
          movilidadReducida: false,
        },
      ],
    })
  )
  it("no calcula ascendientes a partir de un divisor comunicado", () =>
    rechazar({
      ascendientes: [
        {
          edad: 75,
          convivencia: 3,
          discapacidad: "desde65",
          movilidadReducida: false,
        },
      ],
    }))
  it("rechaza campo monetario requerido eliminado", () => {
    const { cotizacionesCentimos: omitido, ...sinCampo } = base
    expect(omitido).toBe(114300)
    expect(
      Effect.runSyncExit(
        calcularRetencionTrabajoAeat(sinCampo, { modo: "canonico" })
      )._tag
    ).toBe("Failure")
  })
  it("mínimo contractual puede sobrevivir a cuota cero", () =>
    expect(
      calcular({ retribucionAnualCentimos: 1000000, contrato: "inferior-anio" })
    ).toMatchObject({
      cuotaRetencionCentimos: 0,
      tipoRetencionPorcentaje: "2.00",
      importeRetencionAnualCentimos: 20000,
    }))
  it("anual no inyecta su salario en el subcaso; productores separados", () => {
    const r = Effect.runSync(
      liquidarIrpfAnual(
        { ...anual, retencionTrabajoAeat: base },
        { modo: "canonico" }
      )
    )
    const lines = r.rastro.pasos.flatMap((p) => p.lineasCalculo ?? [])
    const val = (id: string) =>
      lines.find((l) => l.origen?.siteId === id)?.origen?.decimal
    expect(val("anual.retencion.anual")).toBe("1719")
    expect(val("anual.retencion.tipo")).toBe("9.55")
    expect(val("anual.pagos.retenciones")).toBe("123.45")
    expect(val("anual.pagos.cuenta")).toBe("1786.89")
    expect(r.retencionesYPagosACuentaCentimos).toBe(191034)
  })
  it("ausencia solo anula estimación; no crea sitios de retención", () => {
    const r = Effect.runSync(liquidarIrpfAnual(anual, { modo: "canonico" }))
    expect(r.retencionesYPagosACuentaCentimos).toBe(19134)
    expect(
      r.rastro.pasos
        .flatMap((p) => p.lineasCalculo ?? [])
        .some((l) => l.origen?.siteId.startsWith("anual.retencion."))
    ).toBe(false)
  })
  it("error del servicio impide la salida anual", () =>
    expect(
      Effect.runSyncExit(
        liquidarIrpfAnual(
          {
            ...anual,
            retencionTrabajoAeat: { ...base, procedimiento: "regularizacion" },
          },
          { modo: "canonico" }
        )
      )._tag
    ).toBe("Failure"))
})

describe("fronteras que cambian valores seleccionados", () => {
  it.each([
    [2017, "2017-12-31", 188820],
    [2018, "2018-07-04", 188820],
    [2019, "2019-12-31", 171900],
    [2020, "2020-12-31", 171900],
    [2021, "2021-12-31", 171900],
    [2022, "2022-12-31", 171900],
    [2023, "2023-01-31", 171900],
    [2023, "2023-02-01", 114120],
    [2024, "2024-02-07", 114120],
    [2024, "2024-02-08", 91260],
    [2025, "2025-11-26", 91260],
    [2025, "2025-11-27", 91260],
    [2026, "2026-09-10", 91260],
  ] as const)("año%s ventana%s importe%s", (anio, fechaPago, importe) =>
    expect(calcular({ anio, fechaPago }).importeRetencionAnualCentimos).toBe(
      importe
    )
  )
  it("clave familiar1 sin descendientes se rechaza antes y después de filtro", () => {
    rechazar({ situacionFamiliar: "situacion1" })
    rechazar({
      situacionFamiliar: "situacion1",
      descendientes: [
        {
          edad: 25,
          computoPorEntero: true,
          discapacidad: "sin-discapacidad",
          movilidadReducida: false,
          adopcionOAcogimientoMenosTresAnios: false,
        },
      ],
    })
  })
  it("no aplica umbrales familiares con hechos parciales a ambos lados de 22000", () => {
    for (const retribucionAnualCentimos of [2199999, 2200000, 2200001])
      rechazar({
        retribucionAnualCentimos,
        situacionFamiliar: "situacion2",
        descendientes: [
          {
            edad: 10,
            computoPorEntero: false,
            discapacidad: "sin-discapacidad",
            movilidadReducida: false,
            adopcionOAcogimientoMenosTresAnios: false,
          },
        ],
      })
  })
  it("un multiplicador manual no sustituye el censo de titulares", () =>
    rechazar({
      descendientes: [
        {
          edad: 2,
          computoPorEntero: true,
          discapacidad: "sin-discapacidad",
          movilidadReducida: false,
          adopcionOAcogimientoMenosTresAnios: false,
        },
      ],
    }))
})

it("rechaza la lista familiar parcial antes de contar", () => {
  const descendientes = [25, 26, 27].map((edad) => ({
    edad,
    computoPorEntero: true,
    discapacidad: "sin-discapacidad" as const,
    movilidadReducida: false,
    adopcionOAcogimientoMenosTresAnios: false,
  }))
  rechazar({ descendientes })
})
