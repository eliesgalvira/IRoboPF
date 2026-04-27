import { describe, expect, it } from "@effect/vitest"

import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

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
        discapacidad: "sin-discapacidad",
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
        discapacidad: "sin-discapacidad",
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
        discapacidad: "sin-discapacidad",
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
        discapacidad: "sin-discapacidad",
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
        descendientes: [{ edad: 10, discapacidad: "sin-discapacidad" }],
        ascendientes: [],
        discapacidad: "sin-discapacidad",
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

  it("devuelve ResultadoNoSoportado para comunidades reconocidas aun no implementadas", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "madrid",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: "sin-discapacidad",
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
        ascendientes: [{ edad: 78, discapacidad: "sin-discapacidad" }],
        discapacidad: "sin-discapacidad",
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

  it("devuelve ResultadoNoSoportado para ascendientes con discapacidad", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [{ edad: 60, discapacidad: "discapacidad" }],
        discapacidad: "sin-discapacidad",
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
      motivo:
        "Minimo por ascendientes fuera del caso soportado aun no implementado",
    })
  })
})
