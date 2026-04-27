import { describe, expect, it } from "@effect/vitest"

import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  discapacidad33a64,
  discapacidad65OMas,
  sinDiscapacidad,
} from "../lib/dominio/irpf/caso-fiscal-anual"

describe("liquidarIrpfAnual", () => {
  it("liquida un primer caso individual con rendimientos del trabajo", () => {
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
      baseImponibleGeneralCentimos: 2_705_600,
      baseLiquidableGeneralCentimos: 2_705_600,
      cuotaIntegraGeneralCentimos: 628_230,
      cuotaMinimoPersonalCentimos: 105_450,
      cuotaLiquidaCentimos: 522_780,
      cuotaDiferencialCentimos: 522_780,
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
      cuotaMinimoPersonalCentimos: 676_050,
      cuotaLiquidaCentimos: 0,
      cuotaDiferencialCentimos: 0,
    })
  })

  it("resta deducciones autonomicas declaradas de la cuota liquida", () => {
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
          importeCentimos: 100_00,
          descripcion: "Deduccion autonomica declarada",
        },
      ],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
      deduccionesAutonomicasCentimos: 100_00,
      cuotaLiquidaCentimos: 482_780,
      cuotaDiferencialCentimos: 482_780,
    })
  })

  it("devuelve ResultadoNoSoportado para comunidades reconocidas aun no implementadas", () => {
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoNoSoportado",
      motivo: "Comunidad autonoma madrid aun no implementada",
      fuenteReconocida:
        "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
      cuotaMinimoPersonalCentimos: 153_900,
      cuotaLiquidaCentimos: 444_330,
      cuotaDiferencialCentimos: 444_330,
    })
  })

  it("aplica minimo por ascendientes con discapacidad aunque no superen 65 anos", () => {
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

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toMatchObject({
      _tag: "ResultadoLiquidacionIrpf",
      cuotaMinimoPersonalCentimos: 184_300,
      cuotaLiquidaCentimos: 413_930,
      cuotaDiferencialCentimos: 413_930,
    })
  })
})
