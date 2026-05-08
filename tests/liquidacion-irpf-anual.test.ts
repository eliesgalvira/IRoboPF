// Tests are Effect entry points, so they provide the service layer directly.
// @effect-diagnostics effect/strictEffectProvide:off
import { DateTime, Effect } from "effect"
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

const fechaUtc = (fechaIso: string) =>
  DateTime.toDateUtc(DateTime.makeUnsafe(fechaIso))

describe("liquidarIrpfAnual", () => {
  it.effect("expone la liquidación anual como servicio Effect", () =>
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
    "resta la retención estimada y la incorpora al rastro general",
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
            (paso) => paso.titulo === "Retención estimada de trabajo"
          )
        ).toBe(true)
      })
  )

  it("aplica incremento de mínimo del contribuyente por edad", () => {
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

  it("aplica incremento adicional de mínimo del contribuyente por edad superior a 75", () => {
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

  it("liquida 2023 y 2024 con el ultimo tramo del ahorro al 28 por ciento total", () => {
    const caso2023 = {
      anio: 2023,
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
    const caso2024 = {
      ...caso2023,
      anio: 2024,
    } satisfies CasoFiscalAnual
    const caso2025 = {
      ...caso2023,
      anio: 2025,
    } satisfies CasoFiscalAnual

    const liquidacion2023 = liquidarCasoCanonico(caso2023)
    const liquidacion2024 = liquidarCasoCanonico(caso2024)
    const liquidacion2025 = liquidarCasoCanonico(caso2025)

    expect(liquidacion2023).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_988_000,
    })
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

  it("liquida 2022 con la escala del ahorro al 26 por ciento desde 200000 euros", () => {
    const caso = {
      anio: 2022,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_688_000,
      cuotaLiquidaCentimos: 10_181_950,
      cuotaDiferencialCentimos: 10_181_950,
    })
  })

  it("liquida 2021 con la escala del ahorro al 26 por ciento desde 200000 euros", () => {
    const caso = {
      anio: 2021,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_688_000,
      cuotaLiquidaCentimos: 10_181_950,
      cuotaDiferencialCentimos: 10_181_950,
    })
  })

  it("liquida 2020 con la escala del ahorro al 23 por ciento desde 50000 euros", () => {
    const caso = {
      anio: 2020,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_088_000,
      cuotaLiquidaCentimos: 9_581_950,
      cuotaDiferencialCentimos: 9_581_950,
    })
  })

  it("liquida 2019 con la escala del ahorro al 23 por ciento desde 50000 euros", () => {
    const caso = {
      anio: 2019,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_088_000,
      cuotaLiquidaCentimos: 9_581_950,
      cuotaDiferencialCentimos: 9_581_950,
    })
  })

  it("liquida 2018 con la escala del ahorro al 23 por ciento desde 50000 euros", () => {
    const caso = {
      anio: 2018,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_088_000,
      cuotaLiquidaCentimos: 9_581_950,
      cuotaDiferencialCentimos: 9_581_950,
    })
  })

  it("liquida 2017 con la escala del ahorro al 23 por ciento desde 50000 euros", () => {
    const caso = {
      anio: 2017,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_088_000,
      cuotaLiquidaCentimos: 9_581_950,
      cuotaDiferencialCentimos: 9_581_950,
    })
  })

  it("liquida 2016 con la escala del ahorro al 23 por ciento desde 50000 euros", () => {
    const caso = {
      anio: 2016,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_088_000,
      cuotaLiquidaCentimos: 9_581_950,
      cuotaDiferencialCentimos: 9_581_950,
    })
  })

  it("liquida 2015 con la escala del ahorro al 23,5 por ciento desde 50000 euros", () => {
    const caso = {
      anio: 2015,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 9_288_000,
      cuotaLiquidaCentimos: 9_792_223,
      cuotaDiferencialCentimos: 9_792_223,
    })
  })

  it("liquida 2014 con mínimos pre-reforma y sin gasto fijo general de trabajo", () => {
    const caso = {
      anio: 2014,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      gastosDeduciblesTrabajoCentimos: 0,
      reduccionRendimientosTrabajoCentimos: 265_200,
      baseImponibleGeneralCentimos: 2_544_300,
      cuotaIntegraGeneralCentimos: 670_327,
      cuotaMinimoPersonalCentimos: 127_487,
      cuotaLiquidaCentimos: 542_840,
      cuotaDiferencialCentimos: 542_840,
    })
  })

  it("liquida 2014 con la escala del ahorro pre-reforma al 21, 25 y 27 por ciento", () => {
    const caso = {
      anio: 2014,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraAhorroCentimos: 10_728_000,
      cuotaLiquidaCentimos: 11_270_840,
      cuotaDiferencialCentimos: 11_270_840,
    })
  })

  it("integra en base general las ganancias 2014 con permanencia de un año o menos", () => {
    const caso = {
      anio: 2014,
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
            fechaAdquisicion: "2014-01-01",
            fechaTransmision: "2014-12-31",
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
      baseImponibleGeneralCentimos: 3_544_300,
      baseLiquidableAhorroCentimos: 0,
      cuotaLiquidaCentimos: 867_198,
      cuotaDiferencialCentimos: 867_198,
    })
  })

  it("integra en base del ahorro las ganancias 2014 con permanencia superior a un año", () => {
    const caso = {
      anio: 2014,
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
            fechaAdquisicion: "2014-01-01",
            fechaTransmision: "2015-01-02",
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
      baseImponibleGeneralCentimos: 2_544_300,
      baseLiquidableAhorroCentimos: 1_000_000,
      cuotaIntegraAhorroCentimos: 226_000,
      cuotaLiquidaCentimos: 768_840,
      cuotaDiferencialCentimos: 768_840,
    })
  })

  it("liquida 2013 con mínimos pre-reforma y escala del ahorro 21, 25 y 27 por ciento", () => {
    const caso = {
      anio: 2013,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      gastosDeduciblesTrabajoCentimos: 0,
      reduccionRendimientosTrabajoCentimos: 265_200,
      baseImponibleGeneralCentimos: 2_544_300,
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraGeneralCentimos: 670_327,
      cuotaIntegraAhorroCentimos: 10_728_000,
      cuotaMinimoPersonalCentimos: 127_487,
      cuotaLiquidaCentimos: 11_270_840,
      cuotaDiferencialCentimos: 11_270_840,
    })
  })

  it("integra en base general las ganancias 2013 con permanencia de un año o menos", () => {
    const caso = {
      anio: 2013,
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
            fechaAdquisicion: "2013-01-01",
            fechaTransmision: "2013-12-31",
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
      baseImponibleGeneralCentimos: 3_544_300,
      baseLiquidableAhorroCentimos: 0,
      cuotaLiquidaCentimos: 867_198,
      cuotaDiferencialCentimos: 867_198,
    })
  })

  it("liquida 2012 con mínimos pre-reforma y escala del ahorro 21, 25 y 27 por ciento", () => {
    const caso = {
      anio: 2012,
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

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      gastosDeduciblesTrabajoCentimos: 0,
      reduccionRendimientosTrabajoCentimos: 265_200,
      baseImponibleGeneralCentimos: 2_544_300,
      baseLiquidableAhorroCentimos: 40_000_000,
      cuotaIntegraGeneralCentimos: 670_327,
      cuotaIntegraAhorroCentimos: 10_728_000,
      cuotaMinimoPersonalCentimos: 127_487,
      cuotaLiquidaCentimos: 11_270_840,
      cuotaDiferencialCentimos: 11_270_840,
    })
  })

  it("integra en base del ahorro las ganancias 2012 por transmision aunque la permanencia no supere un año", () => {
    const caso = {
      anio: 2012,
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
            fechaAdquisicion: "2012-01-01",
            fechaTransmision: "2012-12-31",
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
      baseImponibleGeneralCentimos: 2_544_300,
      baseLiquidableAhorroCentimos: 1_000_000,
      cuotaIntegraAhorroCentimos: 226_000,
      cuotaLiquidaCentimos: 768_840,
      cuotaDiferencialCentimos: 768_840,
    })
  })

  it("aplica la exencion estatal del 50 por ciento para inmuebles urbanos adquiridos en 2012", () => {
    const caso = {
      anio: 2012,
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
            fechaAdquisicion: "2012-06-01",
            fechaTransmision: "2025-01-01",
            tratamientoMayores65: { _tag: "SinExencionMayores65" },
            exencionInmuebleUrbanoAdquirido2012: {
              inmuebleUrbano: true,
              tituloOneroso: true,
              fechaAdquisicion: "2012-06-01",
              operacionConPersonaOEntidadVinculada: false,
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
      gananciaPatrimonialTotalCentimos: 1_000_000,
      gananciaPatrimonialExentaCentimos: 500_000,
      baseLiquidableAhorroCentimos: 500_000,
      cuotaIntegraAhorroCentimos: 105_000,
      cuotaLiquidaCentimos: 647_840,
      cuotaDiferencialCentimos: 647_840,
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

  it("aplica reducción por obtención de rendimientos del trabajo", () => {
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

  it("liquida 2023 con la reducción estatal del trabajo del art. 20 vigente ese año", () => {
    const caso = {
      anio: 2023,
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
      baseImponibleGeneralCentimos: 553_450,
      baseLiquidableGeneralCentimos: 553_450,
      reduccionRendimientosTrabajoCentimos: 649_800,
      cuotaLiquidaCentimos: 0,
      cuotaDiferencialCentimos: 0,
    })
  })

  it("liquida 2022 con la reducción estatal del trabajo del art. 20 vigente ese año", () => {
    const caso = {
      anio: 2022,
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
      baseImponibleGeneralCentimos: 788_125,
      baseLiquidableGeneralCentimos: 788_125,
      reduccionRendimientosTrabajoCentimos: 416_625,
      cuotaLiquidaCentimos: 44_294,
      cuotaDiferencialCentimos: 44_294,
    })
  })

  it("liquida 2021 con la reducción estatal del trabajo del art. 20 vigente ese año", () => {
    const caso = {
      anio: 2021,
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
      baseImponibleGeneralCentimos: 788_125,
      baseLiquidableGeneralCentimos: 788_125,
      reduccionRendimientosTrabajoCentimos: 416_625,
      cuotaLiquidaCentimos: 44_294,
      cuotaDiferencialCentimos: 44_294,
    })
  })

  it("liquida 2020 con la reducción estatal del trabajo del art. 20 vigente ese año", () => {
    const caso = {
      anio: 2020,
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
      baseImponibleGeneralCentimos: 788_125,
      baseLiquidableGeneralCentimos: 788_125,
      reduccionRendimientosTrabajoCentimos: 416_625,
      cuotaLiquidaCentimos: 44_294,
      cuotaDiferencialCentimos: 44_294,
    })
  })

  it("liquida 2019 con la reducción estatal del trabajo del art. 20 vigente ese año", () => {
    const caso = {
      anio: 2019,
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
      baseImponibleGeneralCentimos: 788_125,
      baseLiquidableGeneralCentimos: 788_125,
      reduccionRendimientosTrabajoCentimos: 416_625,
      cuotaLiquidaCentimos: 44_294,
      cuotaDiferencialCentimos: 44_294,
    })
  })

  it("liquida 2018 con la reducción transitoria estatal del trabajo del art. 20", () => {
    const caso = {
      anio: 2018,
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
      baseImponibleGeneralCentimos: 973_168,
      baseLiquidableGeneralCentimos: 973_168,
      reduccionRendimientosTrabajoCentimos: 231_582,
      cuotaLiquidaCentimos: 79_452,
      cuotaDiferencialCentimos: 79_452,
    })
  })

  it("liquida 2018 con la reducción anterior si el contribuyente fallecio antes del 5 de julio", () => {
    const caso = {
      anio: 2018,
      fechaFallecimiento: fechaUtc("2018-07-04T00:00:00.000Z"),
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
      baseImponibleGeneralCentimos: 1_158_211,
      baseLiquidableGeneralCentimos: 1_158_211,
      reduccionRendimientosTrabajoCentimos: 46_539,
      cuotaLiquidaCentimos: 114_610,
      cuotaDiferencialCentimos: 114_610,
    })
  })

  it("liquida 2017 con la reducción estatal del trabajo del art. 20 vigente ese año", () => {
    const caso = {
      anio: 2017,
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
      baseImponibleGeneralCentimos: 1_158_211,
      baseLiquidableGeneralCentimos: 1_158_211,
      reduccionRendimientosTrabajoCentimos: 46_539,
      cuotaLiquidaCentimos: 114_610,
      cuotaDiferencialCentimos: 114_610,
    })
  })

  it("liquida 2016 con la reducción estatal del trabajo del art. 20 vigente ese año", () => {
    const caso = {
      anio: 2016,
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
      baseImponibleGeneralCentimos: 1_158_211,
      baseLiquidableGeneralCentimos: 1_158_211,
      reduccionRendimientosTrabajoCentimos: 46_539,
      cuotaLiquidaCentimos: 114_610,
      cuotaDiferencialCentimos: 114_610,
    })
  })

  it("liquida 2015 con la reducción estatal del trabajo del art. 20 vigente ese año", () => {
    const caso = {
      anio: 2015,
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
      baseImponibleGeneralCentimos: 1_158_211,
      baseLiquidableGeneralCentimos: 1_158_211,
      reduccionRendimientosTrabajoCentimos: 46_539,
      cuotaLiquidaCentimos: 117_626,
      cuotaDiferencialCentimos: 117_626,
    })
  })

  it("liquida comunidades reales de 2020 con la escala estatal sin tramo adicional de 300000 euros", () => {
    const caso = {
      anio: 2020,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 400_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 39_489_858,
      cuotaIntegraGeneralCentimos: 16_341_193,
      cuotaMinimoPersonalCentimos: 102_675,
      cuotaLiquidaCentimos: 16_238_518,
    })
  })

  it("liquida comunidades reales de 2019 con la escala estatal sin tramo adicional de 300000 euros", () => {
    const caso = {
      anio: 2019,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 400_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 39_489_858,
      cuotaIntegraGeneralCentimos: 16_341_193,
      cuotaMinimoPersonalCentimos: 102_675,
      cuotaLiquidaCentimos: 16_238_518,
    })
  })

  it("liquida comunidades reales de 2018 con la escala estatal sin tramo adicional de 300000 euros", () => {
    const caso = {
      anio: 2018,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 400_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 39_514_159,
      cuotaIntegraGeneralCentimos: 16_351_763,
      cuotaMinimoPersonalCentimos: 102_675,
      cuotaLiquidaCentimos: 16_249_088,
    })
  })

  it("liquida comunidades reales de 2017 con la escala estatal sin tramo adicional de 300000 euros", () => {
    const caso = {
      anio: 2017,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 400_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 39_514_159,
      cuotaIntegraGeneralCentimos: 16_357_988,
      cuotaMinimoPersonalCentimos: 105_450,
      cuotaLiquidaCentimos: 16_252_538,
    })
  })

  it("liquida comunidades reales de 2016 con la escala estatal sin tramo adicional de 300000 euros", () => {
    const caso = {
      anio: 2016,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 400_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 39_522_480,
      cuotaIntegraGeneralCentimos: 16_361_608,
      cuotaMinimoPersonalCentimos: 105_450,
      cuotaLiquidaCentimos: 16_256_158,
    })
  })

  it("liquida comunidades reales de 2015 con la escala estatal y autonómica del ejercicio", () => {
    const caso = {
      anio: 2015,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 400_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(caso)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 39_525_223,
      cuotaIntegraGeneralCentimos: 16_367_001,
      cuotaMinimoPersonalCentimos: 105_450,
      cuotaLiquidaCentimos: 16_261_551,
    })
  })

  it("selecciona la escala gallega 2015 segun la base liquidable general", () => {
    const casoBaseBaja = {
      anio: 2015,
      comunidadAutonoma: "galicia",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: sinDiscapacidad,
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 20_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual
    const casoBaseAlta = {
      ...casoBaseBaja,
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
      },
    } satisfies CasoFiscalAnual

    expect(liquidarCasoCanonico(casoBaseBaja)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 1_673_000,
      cuotaIntegraGeneralCentimos: 362_030,
      cuotaMinimoPersonalCentimos: 116_550,
      cuotaLiquidaCentimos: 245_480,
    })
    expect(liquidarCasoCanonico(casoBaseAlta)).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 2_609_500,
      cuotaIntegraGeneralCentimos: 629_616,
      cuotaMinimoPersonalCentimos: 119_325,
      cuotaLiquidaCentimos: 510_291,
    })
  })

  it("aplica mínimo por descendientes", () => {
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

  it("aplica mínimo por discapacidad de descendientes", () => {
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

  it("aplica mínimo por discapacidad severa y asistencia de descendientes", () => {
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

  it("resta deducción autonómica agregada no desglosada de la cuota líquida", () => {
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
    "falla con ResultadoNoSoportado para deducciones autonómicas catalogadas no implementadas",
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
            "Deducción autonómica reconocida no implementada: Por gastos educativos",
          fuenteReconocida:
            "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
        })
      })
  )

  it("liquida una comunidad real con su escala autonómica de 2025", () => {
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

    const resultado = liquidarCasoCanonico(caso)

    expect(resultado).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaIntegraGeneralCentimos: 563_325,
      cuotaMinimoPersonalCentimos: 103_357,
      cuotaLiquidaCentimos: 459_969,
      cuotaDiferencialCentimos: 459_969,
    })
    const pasoComunidad = resultado.rastro.pasos.find(
      (paso) => paso.titulo === "Comunidad autónoma"
    )
    expect(pasoComunidad?.descripcion).toContain(
      "escala autonómica general de 2025"
    )

    const pasoMinimo = resultado.rastro.pasos.find(
      (paso) => paso.titulo === "Base general y mínimo personal"
    )
    expect(pasoMinimo?.descripcion).toContain("mínimo autonómico")
  })

  it("limita las deducciones autonómicas a la cuota autonómica disponible", () => {
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

  it("aplica mínimo por ascendientes por edad", () => {
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

  it("aplica mínimo por ascendientes con discapacidad aunque no superen 65 años", () => {
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
