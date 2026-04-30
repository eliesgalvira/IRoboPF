import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  LiquidacionIrpfAnual,
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  discapacidad33a64,
  discapacidad65OMas,
  sinDiscapacidad,
} from "../lib/dominio/irpf/caso-fiscal-anual"

const liquidarCasoCanonico = (caso: CasoFiscalAnual) =>
  Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))

describe("liquidarIrpfAnual", () => {
  it.effect("expone la liquidacion anual como servicio Effect", () =>
    Effect.gen(function* () {
      const caso = {
        anio: 2025,
        comunidadAutonoma: "simulada-estatal",
        situacionFamiliar: {
          tipo: "individual",
          edad: 40,
          descendientes: [],
          ascendientes: [],
          discapacidad: sinDiscapacidad,
        },
        rendimientos: {
          trabajo: [{ importeIntegroCentimos: 30_000_00 }],
        },
        reducciones: [],
        deducciones: [],
        retencionesSoportadasCentimos: 0,
        pagosACuentaCentimos: 0,
      } satisfies CasoFiscalAnual
      const liquidacion = yield* LiquidacionIrpfAnual

      const resultado = yield* liquidacion.liquidar(caso, {
        modo: "canonico",
      })

      expect(resultado).toMatchObject({
        _tag: "LiquidacionIrpfAnualCalculada",
        cuotaLiquidaCentimos: 492_780,
      })
    }).pipe(Effect.provide(LiquidacionIrpfAnual.layer))
  )

  it.effect(
    "liquida un primer caso individual con rendimientos del trabajo",
    () =>
      Effect.gen(function* () {
        const caso = {
          anio: 2025,
          comunidadAutonoma: "simulada-estatal",
          situacionFamiliar: {
            tipo: "individual",
            edad: 40,
            descendientes: [],
            ascendientes: [],
            discapacidad: sinDiscapacidad,
          },
          rendimientos: {
            trabajo: [{ importeIntegroCentimos: 30_000_00 }],
          },
          reducciones: [],
          deducciones: [],
          retencionesSoportadasCentimos: 0,
          pagosACuentaCentimos: 0,
        } satisfies CasoFiscalAnual

        const resultado = yield* liquidarIrpfAnual(caso, { modo: "canonico" })

        expect(resultado).toMatchObject({
          _tag: "LiquidacionIrpfAnualCalculada",
          anio: 2025,
          perfil: "renta-individual-general",
          baseImponibleGeneralCentimos: 2_605_600,
          baseLiquidableGeneralCentimos: 2_605_600,
          cuotaIntegraGeneralCentimos: 598_230,
          cuotaMinimoPersonalCentimos: 105_450,
          cuotaLiquidaCentimos: 492_780,
          cuotaDiferencialCentimos: 492_780,
        })
      })
  )

  it("explica la conciliacion entre cuota anual e IRPF final del simulador legacy", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 18_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaLiquidaCentimos: 103_539,
      cuotaDiferencialCentimos: 103_539,
      conciliacionSimuladorLegacy: {
        _tag: "Some",
        value: {
          _tag: "ConciliacionSimuladorLegacy",
          anio: 2025,
          cuotaLiquidadaAnualCentimos: 103_539,
          deduccionSmiCentimos: 5_520,
          cuotaTrasDeduccionSmiCentimos: 98_019,
          rendimientoIntegroTrabajoCentimos: 1_800_000,
          minimoExentoRetencionCentimos: 1_587_600,
          tipoMaximoRetencionNominaPorcentaje: "43",
          limiteRetencionNominaCentimos: 91_332,
          irpfFinalSimuladorCentimos: 91_332,
          diferenciaCuotaDiferencialEIrpfFinalCentimos: 12_207,
        },
      },
    })
  })

  it.effect(
    "resta la retencion estimada y la incorpora al rastro general",
    () =>
      Effect.gen(function* () {
        const caso = {
          anio: 2025,
          comunidadAutonoma: "simulada-estatal",
          situacionFamiliar: {
            tipo: "individual",
            edad: 40,
            descendientes: [],
            ascendientes: [],
            discapacidad: sinDiscapacidad,
          },
          rendimientos: {
            trabajo: [{ importeIntegroCentimos: 30_000_00 }],
          },
          reducciones: [],
          deducciones: [],
          retencionesSoportadasCentimos: 0,
          pagosACuentaCentimos: 0,
          retencionTrabajoAeat: {
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
        } satisfies CasoFiscalAnual

        const resultado = yield* liquidarIrpfAnual(caso, { modo: "canonico" })

        expect(resultado).toMatchObject({
          _tag: "LiquidacionIrpfAnualCalculada",
          cuotaLiquidaCentimos: 492_780,
          retencionesYPagosACuentaCentimos: 492_600,
          cuotaDiferencialCentimos: 180,
        })
        expect(
          resultado.rastro.pasos.some(
            (paso) => paso.titulo === "Retencion estimada de trabajo"
          )
        ).toBe(true)
      })
  )

  it("aplica incremento de minimo del contribuyente por edad", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 66,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaMinimoPersonalCentimos: 127_300,
      cuotaLiquidaCentimos: 470_930,
      cuotaDiferencialCentimos: 470_930,
    })
  })

  it("aplica incremento adicional de minimo del contribuyente por edad superior a 75", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 76,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaMinimoPersonalCentimos: 153_900,
      cuotaLiquidaCentimos: 444_330,
      cuotaDiferencialCentimos: 444_330,
    })
  })

  it("integra capital inmobiliario simplificado en la base general", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
        capitalInmobiliario: [{ importeIntegroCentimos: 1_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseImponibleGeneralCentimos: 2_705_600,
      baseLiquidableGeneralCentimos: 2_705_600,
      cuotaIntegraGeneralCentimos: 628_230,
      cuotaMinimoPersonalCentimos: 105_450,
      cuotaLiquidaCentimos: 522_780,
      cuotaDiferencialCentimos: 522_780,
    })
  })

  it("integra ganancias patrimoniales sujetas en la base del ahorro", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
        gananciasPatrimoniales: [
          {
            importeGananciaCentimos: 10_000_00,
            tratamientoMayores65: { _tag: "SinExencionMayores65" },
          },
        ],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      gananciaPatrimonialTotalCentimos: 1_000_000,
      gananciaPatrimonialExentaCentimos: 0,
      baseLiquidableAhorroCentimos: 1_000_000,
      cuotaIntegraAhorroCentimos: 198_000,
      cuotaLiquidaCentimos: 690_780,
      cuotaDiferencialCentimos: 690_780,
    })
  })

  it("liquida 2024 con el ultimo tramo del ahorro al 28 por ciento total", () => {
    const caso2024 = {
      anio: 2024,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
        gananciasPatrimoniales: [
          {
            importeGananciaCentimos: 400_000_00,
            tratamientoMayores65: { _tag: "SinExencionMayores65" },
          },
        ],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual
    const caso2025 = {
      ...caso2024,
      anio: 2025,
    } satisfies CasoFiscalAnual

    const liquidacion2024 = liquidarCasoCanonico(caso2024)
    const liquidacion2025 = liquidarCasoCanonico(caso2025)

    expect(liquidacion2024).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_988_000,
    })
    expect(liquidacion2025).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 10_188_000,
    })
  })

  it("exime la transmisión de vivienda habitual por contribuyente mayor de 65 años", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 66,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
        gananciasPatrimoniales: [
          {
            importeGananciaCentimos: 80_000_00,
            tratamientoMayores65: { _tag: "ViviendaHabitualMayores65" },
          },
        ],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      gananciaPatrimonialTotalCentimos: 8_000_000,
      gananciaPatrimonialExentaCentimos: 8_000_000,
      baseLiquidableAhorroCentimos: 0,
      cuotaIntegraAhorroCentimos: 0,
      cuotaLiquidaCentimos: 470_930,
      cuotaDiferencialCentimos: 470_930,
    })
  })

  it("exime proporcionalmente la reinversión en renta vitalicia para mayores de 65 años", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 70,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
        gananciasPatrimoniales: [
          {
            importeGananciaCentimos: 50_000_00,
            tratamientoMayores65: {
              _tag: "ReinversionRentaVitaliciaMayores65",
              importeTransmisionCentimos: 200_000_00,
              importeReinvertidoRentaVitaliciaCentimos: 100_000_00,
              reinversionesPreviasRentaVitaliciaCentimos: 0,
            },
          },
        ],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      gananciaPatrimonialTotalCentimos: 5_000_000,
      gananciaPatrimonialExentaCentimos: 2_500_000,
      baseLiquidableAhorroCentimos: 2_500_000,
      cuotaIntegraAhorroCentimos: 513_000,
      cuotaLiquidaCentimos: 983_930,
      cuotaDiferencialCentimos: 983_930,
    })
  })

  it("aplica reduccion por obtencion de rendimientos del trabajo", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 15_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseImponibleGeneralCentimos: 472_600,
      baseLiquidableGeneralCentimos: 472_600,
      reduccionRendimientosTrabajoCentimos: 730_200,
      cuotaLiquidaCentimos: 0,
      cuotaDiferencialCentimos: 0,
    })
  })

  it("aplica minimo por descendientes", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [{ edad: 10, discapacidad: sinDiscapacidad }],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaMinimoPersonalCentimos: 151_050,
      cuotaLiquidaCentimos: 447_180,
      cuotaDiferencialCentimos: 447_180,
    })
  })

  it("aplica minimo por discapacidad de descendientes", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [{ edad: 10, discapacidad: discapacidad33a64() }],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaMinimoPersonalCentimos: 208_050,
      cuotaLiquidaCentimos: 390_180,
      cuotaDiferencialCentimos: 390_180,
    })
  })

  it("aplica minimo por discapacidad severa y asistencia de descendientes", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [
          {
            edad: 10,
            discapacidad: discapacidad33a64({
              necesitaAyudaOMovilidadReducida: true,
            }),
          },
          { edad: 8, discapacidad: discapacidad65OMas },
        ],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaMinimoPersonalCentimos: 598_230,
      cuotaLiquidaCentimos: 0,
      cuotaDiferencialCentimos: 0,
    })
  })

  it("resta deduccion autonomica agregada no desglosada de la cuota liquida", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      deduccionAutonomicaAgregadaCentimos: 100_00,
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      deduccionesAutonomicasCentimos: 100_00,
      cuotaLiquidaCentimos: 482_780,
      cuotaDiferencialCentimos: 482_780,
    })
  })

  it.effect(
    "falla con ResultadoNoSoportado para deducciones autonomicas catalogadas no implementadas",
    () =>
      Effect.gen(function* () {
        const caso = {
          anio: 2025,
          comunidadAutonoma: "simulada-estatal",
          situacionFamiliar: {
            tipo: "individual",
            edad: 40,
            descendientes: [],
            ascendientes: [],
            discapacidad: sinDiscapacidad,
          },
          rendimientos: {
            trabajo: [{ importeIntegroCentimos: 30_000_00 }],
          },
          reducciones: [],
          deducciones: [
            {
              codigo: "madrid_gastos_educativos",
            },
          ],
          retencionesSoportadasCentimos: 0,
          pagosACuentaCentimos: 0,
        } satisfies CasoFiscalAnual

        const error = yield* liquidarIrpfAnual(caso, {
          modo: "canonico",
        }).pipe(Effect.flip)

        expect(error).toMatchObject({
          _tag: "ResultadoNoSoportado",
          motivo:
            "Deduccion autonomica reconocida no implementada: Por gastos educativos",
          fuenteReconocida:
            "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
        })
      })
  )

  it("liquida una comunidad real con su escala autonomica de 2025", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaIntegraGeneralCentimos: 563_325,
      cuotaMinimoPersonalCentimos: 103_357,
      cuotaLiquidaCentimos: 459_969,
      cuotaDiferencialCentimos: 459_969,
      rastro: {
        pasos: expect.arrayContaining([
          expect.objectContaining({
            titulo: "Comunidad autonoma",
            descripcion: expect.stringContaining(
              "escala autonomica general de 2025"
            ),
          }),
          expect.objectContaining({
            titulo: "Base general y minimo personal",
            descripcion: expect.stringContaining("minimo autonomico"),
          }),
        ]),
      },
    })
  })

  it("limita las deducciones autonomicas a la cuota autonomica disponible", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      deduccionAutonomicaAgregadaCentimos: 999_999_00,
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      deduccionesAutonomicasCentimos: 213_579,
      cuotaLiquidaCentimos: 246_390,
      cuotaDiferencialCentimos: 246_390,
    })
  })

  it("aplica minimo por ascendientes por edad", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [{ edad: 78, discapacidad: sinDiscapacidad }],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaMinimoPersonalCentimos: 153_900,
      cuotaLiquidaCentimos: 444_330,
      cuotaDiferencialCentimos: 444_330,
    })
  })

  it("aplica minimo por ascendientes con discapacidad aunque no superen 65 años", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [{ edad: 60, discapacidad: discapacidad33a64() }],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaMinimoPersonalCentimos: 184_300,
      cuotaLiquidaCentimos: 413_930,
      cuotaDiferencialCentimos: 413_930,
    })
  })

  it("ignora ascendientes menores de 65 años sin discapacidad sin bloquear el calculo", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [{ edad: 60, discapacidad: sinDiscapacidad }],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaMinimoPersonalCentimos: 105_450,
      cuotaLiquidaCentimos: 492_780,
      cuotaDiferencialCentimos: 492_780,
    })
  })
})
