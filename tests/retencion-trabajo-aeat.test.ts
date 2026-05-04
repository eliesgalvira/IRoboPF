import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  calcularRetencionTrabajoAeat,
  RetencionTrabajoAeat,
  type CasoRetencionTrabajo,
} from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"

describe("calcularRetencionTrabajoAeat", () => {
  it.effect(
    "calcula el tipo e importe anual de retencion para un asalariado sin regularizacion",
    () =>
      Effect.gen(function* () {
        const resultado = yield* calcularRetencionTrabajoAeat(
          {
            anio: 2025,
            edad: 40,
            retribucionAnualCentimos: 30_000_00,
            cotizacionesCentimos: 1_944_00,
            situacionFamiliar: "situacion3",
            situacionLaboral: "activo",
            contrato: "general",
            discapacidad: "sin-discapacidad",
            movilidadGeografica: false,
            descendientes: [],
            ascendientes: [],
            irregular1Centimos: 0,
            irregular2Centimos: 0,
            pensionCompensatoriaConyugeCentimos: 0,
            anualidadesAlimentosHijosCentimos: 0,
            residenciaCeutaMelilla: false,
            rendimientosCeutaMelilla: false,
            pagosViviendaHabitual: false,
          },
          { modo: "canonico" }
        )

        expect(resultado).toMatchObject({
          _tag: "RetencionTrabajoCalculada",
          baseRetencionCentimos: 2_605_600,
          minimoPersonalFamiliarCentimos: 555_000,
          cuotaRetencionCentimos: 492_780,
          tipoRetencionPorcentaje: "16.42",
          importeRetencionAnualCentimos: 492_600,
        })
      })
  )

  it.effect(
    "aplica movilidad reducida del perceptor con discapacidad en gastos y minimo",
    () =>
      Effect.gen(function* () {
        const resultado = yield* calcularRetencionTrabajoAeat(
          {
            ...casoRetencionCalculable(),
            anio: 2025,
            discapacidad: "de33a65",
            movilidadReducidaPerceptor: true,
          },
          { modo: "canonico" }
        )

        expect(resultado).toMatchObject({
          _tag: "RetencionTrabajoCalculada",
          baseRetencionCentimos: 1_830_600,
          minimoPersonalFamiliarCentimos: 1_155_000,
          cuotaRetencionCentimos: 157_644,
          tipoRetencionPorcentaje: "5.25",
          importeRetencionAnualCentimos: 157_500,
        })
      })
  )

  it.effect("devuelve retencion cero cuando aplica el limite exento", () =>
    Effect.gen(function* () {
      const resultado = yield* calcularRetencionTrabajoAeat(
        {
          anio: 2025,
          edad: 40,
          retribucionAnualCentimos: 15_876_00,
          cotizacionesCentimos: 1_028_77,
          situacionFamiliar: "situacion3",
          situacionLaboral: "activo",
          contrato: "general",
          discapacidad: "sin-discapacidad",
          movilidadGeografica: false,
          descendientes: [],
          ascendientes: [],
          irregular1Centimos: 0,
          irregular2Centimos: 0,
          pensionCompensatoriaConyugeCentimos: 0,
          anualidadesAlimentosHijosCentimos: 0,
          residenciaCeutaMelilla: false,
          rendimientosCeutaMelilla: false,
          pagosViviendaHabitual: false,
        },
        { modo: "canonico" }
      )

      expect(resultado).toMatchObject({
        _tag: "RetencionTrabajoCalculada",
        tipoRetencionPorcentaje: "0.00",
        importeRetencionAnualCentimos: 0,
      })
    })
  )

  it.effect("usa el umbral 2026 de situacion 2 con dos descendientes", () =>
    Effect.gen(function* () {
      const resultado = yield* calcularRetencionTrabajoAeat(
        {
          ...casoRetencionCalculable(),
          situacionFamiliar: "situacion2",
          descendientes: [
            {
              edad: 8,
              computoPorEntero: true,
              discapacidad: "sin-discapacidad",
              movilidadReducida: false,
              adopcionOAcogimientoMenosTresAnios: false,
            },
            {
              edad: 5,
              computoPorEntero: true,
              discapacidad: "sin-discapacidad",
              movilidadReducida: false,
              adopcionOAcogimientoMenosTresAnios: false,
            },
          ],
        },
        { modo: "canonico" }
      )

      expect(resultado.limite43Centimos).toBe(461_734)
    })
  )

  it.effect("usa el umbral 2019 de situacion 2 con dos descendientes", () =>
    Effect.gen(function* () {
      const resultado = yield* calcularRetencionTrabajoAeat(
        {
          ...casoRetencionCalculable(),
          anio: 2019,
          situacionFamiliar: "situacion2",
          descendientes: [
            {
              edad: 8,
              computoPorEntero: true,
              discapacidad: "sin-discapacidad",
              movilidadReducida: false,
              adopcionOAcogimientoMenosTresAnios: false,
            },
            {
              edad: 5,
              computoPorEntero: true,
              discapacidad: "sin-discapacidad",
              movilidadReducida: false,
              adopcionOAcogimientoMenosTresAnios: false,
            },
          ],
        },
        { modo: "canonico" }
      )

      expect(resultado.limite43Centimos).toBe(531_738)
    })
  )

  it.effect("expone el procedimiento de retencion como servicio Effect", () =>
    Effect.gen(function* () {
      const caso = casoRetencionCalculable()
      const retencion = yield* RetencionTrabajoAeat

      const resultado = yield* retencion.calcular(caso, { modo: "canonico" })

      expect(resultado._tag).toBe("RetencionTrabajoCalculada")
      expect(resultado.rastro.titulo).toBe(
        "Procedimiento de retencion de trabajo 2026"
      )
    }).pipe(Effect.provide(RetencionTrabajoAeat.layer))
  )

  it.effect(
    "rechaza casos incompletos sin confundirlos con una liquidacion anual",
    () =>
      Effect.gen(function* () {
        const caso = casoRetencionBasico()

        const error = yield* calcularRetencionTrabajoAeat(caso, {
          modo: "canonico",
        }).pipe(Effect.flip)

        expect(error).toEqual({
          _tag: "ResultadoNoSoportado",
          motivo:
            "Caso de retencion de trabajo no soportado con las entradas actuales",
          fuenteReconocida: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
          rastro: {
            titulo: "Procedimiento de retencion de trabajo 2026",
            pasos: [
              {
                _tag: "PasoExplicacion",
                titulo: "Caso de retencion reconocido",
                descripcion:
                  "El motor ha recibido rendimientos del trabajo para calcular una retencion a cuenta, no una liquidacion anual del IRPF.",
                fuentes: [
                  {
                    titulo: "Algoritmo de retenciones 2026",
                    referencia:
                      "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
                  },
                ],
              },
            ],
          },
        })
      })
  )
})

const casoRetencionBasico = (): CasoRetencionTrabajo => {
  const caso = {
    anio: 2026,
    retribucionAnualCentimos: 30_000_00,
    situacionFamiliar: "general",
    descendientes: 0,
    ascendientes: 0,
    discapacidad: "sin-discapacidad",
  } satisfies CasoRetencionTrabajo

  return caso
}

const casoRetencionCalculable = (): CasoRetencionTrabajo => ({
  anio: 2026,
  edad: 40,
  retribucionAnualCentimos: 30_000_00,
  cotizacionesCentimos: 1_944_00,
  situacionFamiliar: "situacion3",
  situacionLaboral: "activo",
  contrato: "general",
  discapacidad: "sin-discapacidad",
  movilidadGeografica: false,
  descendientes: [],
  ascendientes: [],
  irregular1Centimos: 0,
  irregular2Centimos: 0,
  pensionCompensatoriaConyugeCentimos: 0,
  anualidadesAlimentosHijosCentimos: 0,
  residenciaCeutaMelilla: false,
  rendimientosCeutaMelilla: false,
  pagosViviendaHabitual: false,
})
