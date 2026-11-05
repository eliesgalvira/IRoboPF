import { describe, expect, it } from "vitest"
import { DateTime, Effect, Result } from "effect"
import Decimal from "decimal.js"
import {
  componerLiquidacionAnual,
  type EntradaComposicionAnual,
} from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

const D = Decimal.clone({ precision: 80 })
const entrada: EntradaComposicionAnual = {
  ambito: {
    anio: 2019,
    comunidadAutonoma: "madrid",
    situacionFamiliar: {
      tipo: "individual",
      edad: 40,
      discapacidad: { _tag: "SinDiscapacidad" },
      descendientes: [],
      ascendientes: [],
    },
  },
  cotizaciones: { naturaleza: "efectivas", trabajador: new D(1800) },
  rentasTrabajoAnuales: { integroTrabajo: new D(30000), restoRentas: new D(0) },
  precision: 80,
  politica: "open-cuotas-empleo-madrid-2018-2024",
  baseGeneral: new D("26200"),
  baseAhorro: new D(0),
  rentasAntesReducciones: new D(28200),
  minimosEstatales: MINIMOS_ESTATALES_2025,
  deduccionesAutonomicasCentimos: 0,
}

const invalidas: readonly (readonly [string, EntradaComposicionAnual])[] = [
  ["2017", { ...entrada, ambito: { ...entrada.ambito, anio: 2017 } }],
  ["2025", { ...entrada, ambito: { ...entrada.ambito, anio: 2025 } }],
  ["otro territorio", { ...entrada, ambito: { ...entrada.ambito, comunidadAutonoma: "aragon" } }],
  ["cotizaciones estimadas", { ...entrada, cotizaciones: { ...entrada.cotizaciones, naturaleza: "estimadas-perfil-uniforme" } }],
  ["fallecimiento", { ...entrada, ambito: { ...entrada.ambito, fechaFallecimiento: DateTime.toDateUtc(DateTime.makeUnsafe("2019-12-01T12:00:00Z")) } }],
  ["menor de edad", { ...entrada, ambito: { ...entrada.ambito, situacionFamiliar: { ...entrada.ambito.situacionFamiliar, edad: 17 } } }],
  ["65 años", { ...entrada, ambito: { ...entrada.ambito, situacionFamiliar: { ...entrada.ambito.situacionFamiliar, edad: 65 } } }],
  ["discapacidad propia", { ...entrada, ambito: { ...entrada.ambito, situacionFamiliar: { ...entrada.ambito.situacionFamiliar, discapacidad: { _tag: "Discapacidad65OMas" } } } }],
  ["sin rentas de trabajo", { ...entrada, rentasTrabajoAnuales: undefined }],
  ["íntegro cero", { ...entrada, rentasTrabajoAnuales: { integroTrabajo: new D(0), restoRentas: new D(0) } }],
  ["otras rentas", { ...entrada, rentasTrabajoAnuales: { integroTrabajo: new D(30000), restoRentas: new D(1) } }],
  ["base de ahorro", { ...entrada, baseAhorro: new D(1) }],
  ["deducción externa", { ...entrada, deduccionesAutonomicasCentimos: 1 }],
]

describe("Ámbito interno de la política histórica observada", () => {
  it.each(invalidas)("rechaza %s sin fabricar una liquidación", (_nombre, caso) => {
    const r = Effect.runSync(Effect.result(componerLiquidacionAnual(caso)))
    expect(Result.isFailure(r)).toBe(true)
    if (Result.isFailure(r)) expect(r.failure._tag).toBe("ResultadoNoSoportado")
  })
  it.each([2018, 2019, 2020, 2021, 2022, 2023, 2024] as const)(
    "admite el perfil delimitado en %i sin DA61",
    (anio) => {
      const r = Effect.runSync(componerLiquidacionAnual({ ...entrada, ambito: { ...entrada.ambito, anio } }))
      expect(r.deduccionTrabajo.toFixed()).toBe("0")
      expect(r.cotizaciones.trabajador.toFixed()).toBe("1800")
      expect(r.cuotaIntegraGeneralEstatal.decimalPlaces()).toBeLessThanOrEqual(2)
      expect(r.cuotaIntegraGeneralAutonomica.decimalPlaces()).toBeLessThanOrEqual(2)
    }
  )
})
