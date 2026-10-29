import { Effect, Result } from "effect"
import { expect, it } from "@effect/vitest"
import {
  calcularRetencionTrabajoAeat,
  type CasoRetencionTrabajo,
} from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { calcularSalarioLegacy } from "../lib/dominio/compatibilidad-legacy/calculo-salario-legacy"
import { auditarProgresividadFrio } from "../lib/dominio/auditoria/auditoria-progresividad-frio"

const retencion: CasoRetencionTrabajo = {
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
const anual: CasoFiscalAnual = {
  anio: 2025,
  comunidadAutonoma: "simulada-estatal",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    descendientes: [],
    ascendientes: [],
    discapacidad: { _tag: "SinDiscapacidad" },
  },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 1800000 }] },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
}

it.effect(
  "RTI-01 rechaza retenciones de otro ejercicio antes de descontarlas",
  () =>
    Effect.gen(function* () {
      for (const modo of ["canonico", "compatible-legacy"] as const) {
        const r = yield* Effect.result(
          liquidarIrpfAnual(
            { ...anual, retencionTrabajoAeat: retencion },
            { modo }
          )
        )
        expect(Result.isFailure(r)).toBe(true)
        if (Result.isFailure(r)) expect(r.failure.motivo).toContain("ejercicio")
      }
      const r = yield* liquidarIrpfAnual(
        { ...anual, retencionesSoportadasCentimos: 10000 },
        { modo: "canonico" }
      )
      expect(r.cuotaDiferencialCentimos).toBe(r.cuotaLiquidaCentimos - 10000)
    })
)

it.effect(
  "RTI-03 rechaza edades negativas, fraccionarias y no finitas en cada persona",
  () =>
    Effect.gen(function* () {
      for (const edad of [-1, 0.5, NaN, Infinity]) {
        const casos: ReadonlyArray<CasoRetencionTrabajo> = [
          { ...retencion, edad },
          {
            ...retencion,
            descendientes: [
              {
                edad,
                computoPorEntero: true,
                discapacidad: "sin-discapacidad",
                movilidadReducida: false,
                adopcionOAcogimientoMenosTresAnios: false,
              },
            ],
          },
          {
            ...retencion,
            ascendientes: [
              {
                edad,
                convivencia: 1,
                discapacidad: "sin-discapacidad",
                movilidadReducida: false,
              },
            ],
          },
        ]
        for (const caso of casos)
          expect(
            Result.isFailure(
              yield* Effect.result(
                calcularRetencionTrabajoAeat(caso, { modo: "canonico" })
              )
            )
          ).toBe(true)
      }
      const r = yield* calcularRetencionTrabajoAeat(
        {
          ...retencion,
          descendientes: [
            {
              edad: 0,
              computoPorEntero: true,
              discapacidad: "sin-discapacidad",
              movilidadReducida: false,
              adopcionOAcogimientoMenosTresAnios: false,
            },
          ],
        },
        { modo: "canonico" }
      )
      expect(r.minimoPersonalFamiliarCentimos).toBe(1075000)
    })
)

it.effect(
  "RTI-02 permite elegir cierre y devuelve rechazo tipado si falta selección",
  () =>
    Effect.gen(function* () {
      const entrada = {
        anio: 2025,
        modo: "canonico",
        salarioBrutoAnualCentimos: 1800000,
        perfilAuditoria: "soltero_sin_hijos",
      } as const
      const r = yield* calcularSalarioLegacy({
        ...entrada,
        seleccionRetencion: { perfilTemporal: "cierre" },
      })
      expect(Number.isFinite(r.irpfFinalCentimos)).toBe(true)
      const rechazo = yield* Effect.result(calcularSalarioLegacy(entrada))
      expect(Result.isFailure(rechazo)).toBe(true)
    })
)

it.effect(
  "AUD-MODO transmite el modo real a ambas ramas de la comparación",
  () =>
    Effect.gen(function* () {
      const entrada = {
        perfil: "legacy-progresividad-frio",
        anioComparado: 2018,
        anioReferencia: 2018,
        salarioBrutoAnualMinimoCentimos: 6000000,
        salarioBrutoAnualMaximoCentimos: 6000000,
        pasoCentimos: 100,
      } as const
      const r = yield* auditarProgresividadFrio(entrada, { modo: "canonico" })
      const directo = yield* calcularSalarioLegacy({
        anio: 2018,
        salarioBrutoAnualCentimos: 6000000,
        modo: "canonico",
      })
      expect(
        r.auditoria.puntos[0]?.comparacion.referencia
          .cotizacionTrabajadorCentimos
      ).toBe(directo.cotizacionTrabajadorCentimos)
      expect(
        r.auditoria.puntos[0]?.comparacion.comparado.ajustado
          .cotizacionTrabajadorCentimos
      ).toBe(directo.cotizacionTrabajadorCentimos)
    })
)
