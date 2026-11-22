import Decimal from "decimal.js"
import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import { calcularCuotaPorEscalaAhorro } from "../lib/dominio/irpf/cuotas/cuota-integra-ahorro"
import { calcularCuotaPorEscala } from "../lib/dominio/irpf/cuotas/escalas-gravamen"
import { ESCALAS_IRPF_AHORRO_POR_GRAVAMEN } from "../lib/dominio/normativa/datos/irpf-estatal-2012-2026"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  sinDiscapacidad,
  type ComunidadAutonoma,
  type FamiliarFiscal,
} from "../lib/dominio/irpf/caso-fiscal-anual"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"

// Cada remanente es el exceso de su mínimo sobre la base liquidable general,
// limitado a la base liquidable del ahorro (art. 56.2 LIRPF).
//
// Desde 2015, arts. 66.1 y 76 LIRPF (Ley 26/2014) y Manual práctico de Renta
// 2025, capítulo 15, «Esquema gráfico»: la cuota estatal del ahorro se minora
// aplicando la escala estatal del ahorro al remanente del mínimo estatal
// (Cuota C) y la cuota autonómica aplicando la escala autonómica del ahorro al
// remanente del mínimo autonómico (Cuota D).
//
// En 2012-2014, arts. 66.1 y 76 LIRPF (Ley 39/2010) y DA 35.ª.1.b: cada escala
// grava la base del ahorro «en la parte que no corresponda, en su caso, con el
// mínimo personal y familiar», es decir, la base menos su remanente. El Manual
// práctico de Renta 2014, p. 449: «el importe de la base liquidable del ahorro,
// una vez minorado, en su caso, con el remanente no aplicado del mínimo
// personal y familiar estatal […] se grava». No hay minoración de cuota.

const liquidar = (caso: CasoFiscalAnual) =>
  Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))

const caso = ({
  anio,
  ahorroCentimos,
  baseGeneralCentimos,
  comunidadAutonoma,
  descendientes = [],
  edad = 40,
}: {
  readonly anio: AnioFiscal
  readonly ahorroCentimos: number
  readonly baseGeneralCentimos: number
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly descendientes?: ReadonlyArray<FamiliarFiscal>
  readonly edad?: number
}): CasoFiscalAnual => ({
  anio,
  comunidadAutonoma,
  situacionFamiliar: {
    tipo: "individual",
    edad,
    descendientes,
    ascendientes: [],
    discapacidad: sinDiscapacidad,
  },
  rendimientos: {
    trabajo: [],
    capitalInmobiliario:
      baseGeneralCentimos === 0
        ? []
        : [{ importeIntegroCentimos: baseGeneralCentimos }],
    gananciasPatrimoniales: [
      {
        importeGananciaCentimos: ahorroCentimos,
        tratamientoMayores65: { _tag: "SinExencionMayores65" },
      },
    ],
  },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})

describe("mínimo personal y familiar aplicado en la base del ahorro", () => {
  it("Andalucía 2025, base general 0: cada escala grava su propio remanente", () => {
    // Mínimo estatal 5.550; autonómico andaluz 5.790. Ahorro 6.000.
    // Cuota A = Cuota B = 6.000 x 9,5 % = 570,00; íntegra del ahorro 1.140,00.
    // Cuota C = 5.550 x 9,5 % = 527,25; Cuota D = 5.790 x 9,5 % = 550,05.
    // Minoración 1.077,30; cuota del ahorro 1.140,00 - 1.077,30 = 62,70.
    expect(
      liquidar(
        caso({
          anio: 2025,
          comunidadAutonoma: "andalucia",
          baseGeneralCentimos: 0,
          ahorroCentimos: 600_000,
        })
      )
    ).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 0,
      baseLiquidableAhorroCentimos: 600_000,
      cuotaIntegraAhorroCentimos: 114_000,
      cuotaMinimoPersonalAhorroCentimos: 107_730,
      cuotaLiquidaCentimos: 6_270,
    })
  })

  it("Canarias 2025, base general menor que los dos mínimos: dos remanentes positivos y distintos", () => {
    // Base general 2.000; mínimo estatal 5.550; autonómico canario 5.606.
    // La base general queda cubierta por ambos mínimos: cuota general 0.
    // Remanente estatal 3.550; autonómico 3.606. Ahorro 10.000.
    // Cuota A = Cuota B = 6.000 x 9,5 % + 4.000 x 10,5 % = 990,00; íntegra 1.980,00.
    // Cuota C = 3.550 x 9,5 % = 337,25; Cuota D = 3.606 x 9,5 % = 342,57.
    // Minoración 679,82; cuota del ahorro 1.980,00 - 679,82 = 1.300,18.
    expect(
      liquidar(
        caso({
          anio: 2025,
          comunidadAutonoma: "canarias",
          baseGeneralCentimos: 200_000,
          ahorroCentimos: 1_000_000,
        })
      )
    ).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 200_000,
      baseLiquidableAhorroCentimos: 1_000_000,
      cuotaIntegraAhorroCentimos: 198_000,
      cuotaMinimoPersonalAhorroCentimos: 67_982,
      cuotaLiquidaCentimos: 130_018,
    })
  })

  it("Andalucía 2025, base general entre los dos mínimos: solo queda remanente autonómico", () => {
    // Base general 5.650, entre el mínimo estatal (5.550) y el andaluz (5.790).
    // Cuota general estatal: 5.650 x 9,5 % - 5.550 x 9,5 % = 9,50.
    // Cuota general autonómica: el mínimo andaluz cubre toda la base: 0.
    // Remanente estatal 0; autonómico 140. Ahorro 6.000.
    // Cuota C = 0; Cuota D = 140 x 9,5 % = 13,30.
    // Cuota del ahorro 1.140,00 - 13,30 = 1.126,70; cuota líquida 9,50 + 1.126,70 = 1.136,20.
    expect(
      liquidar(
        caso({
          anio: 2025,
          comunidadAutonoma: "andalucia",
          baseGeneralCentimos: 565_000,
          ahorroCentimos: 600_000,
        })
      )
    ).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableGeneralCentimos: 565_000,
      cuotaIntegraAhorroCentimos: 114_000,
      cuotaMinimoPersonalAhorroCentimos: 1_330,
      cuotaLiquidaCentimos: 113_620,
    })
  })

  it("Illes Balears 2015: escalas estatal y autonómica del ahorro distintas", () => {
    // DA 31.ª.1 LIRPF en la redacción del RDL 9/2015: escala estatal del ahorro
    // 9,5 / 10,5 / 11,5 (art. 66.1) y autonómica 10 / 11 / 12 (letra e).
    // Contribuyente de 66 años: mínimo estatal 5.550 + 1.150 = 6.700;
    // balear 5.550 + 1.820 = 7.370. Base general 0; ahorro 10.000.
    // Cuota A = 570 + 4.000 x 10,5 % = 990,00; Cuota B = 600 + 4.000 x 11 % = 1.040,00.
    // Cuota C = 570 + 700 x 10,5 % = 643,50; Cuota D = 600 + 1.370 x 11 % = 750,70.
    // Minoración 1.394,20; cuota del ahorro 2.030,00 - 1.394,20 = 635,80.
    expect(
      liquidar(
        caso({
          anio: 2015,
          comunidadAutonoma: "illes-balears",
          edad: 66,
          baseGeneralCentimos: 0,
          ahorroCentimos: 1_000_000,
        })
      )
    ).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaIntegraAhorroCentimos: 203_000,
      cuotaMinimoPersonalAhorroCentimos: 139_420,
      cuotaLiquidaCentimos: 63_580,
    })
  })

  it("Madrid 2013: cada escala grava la base del ahorro neta de su remanente", () => {
    // Escala estatal del ahorro: art. 66.1 (9,5 / 10,5) más DA 35.ª.1.b
    // (2 / 4 / 6), es decir 11,5 hasta 6.000, 14,5 hasta 24.000 y 16,5 después.
    // Escala autonómica: art. 76 (9,5 / 10,5).
    // Tres descendientes de 10 años. Mínimo estatal 5.151 + 1.836 + 2.040 + 3.672
    // = 12.699; madrileño 5.151 + 1.836 + 2.040 + 4.039,20 = 13.066,20.
    // Base general 0; ahorro 30.000.
    // Base neta estatal 30.000 - 12.699 = 17.301:
    //   690 + 11.301 x 14,5 % = 2.328,645.
    // Base neta autonómica 30.000 - 13.066,20 = 16.933,80:
    //   570 + 10.933,80 x 10,5 % = 1.718,049.
    // Cuota del ahorro 4.046,694 -> 4.046,69. Sin minoración de cuota.
    const diezAnios = { edad: 10, discapacidad: sinDiscapacidad }
    expect(
      liquidar(
        caso({
          anio: 2013,
          comunidadAutonoma: "madrid",
          descendientes: [diezAnios, diezAnios, diezAnios],
          baseGeneralCentimos: 0,
          ahorroCentimos: 3_000_000,
        })
      )
    ).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaIntegraAhorroCentimos: 404_669,
      cuotaMinimoPersonalAhorroCentimos: 0,
      cuotaLiquidaCentimos: 404_669,
    })
  })

  it("Castilla y León 2014, mínimos iguales: la base neta cambia de tramo", () => {
    // Mínimo estatal y autonómico 5.151. Base general 0; ahorro 30.001.
    // Base neta 30.001 - 5.151 = 24.850 en cada parte.
    // Estatal: 690 + 18.000 x 14,5 % + 850 x 16,5 % = 3.300 + 140,25 = 3.440,25.
    // Autonómica: 570 + 18.850 x 10,5 % = 2.549,25.
    // Cuota del ahorro 5.989,50. Minorar la cuota daría
    // 7.380,27 - 5.151 x 21 % = 6.298,56.
    expect(
      liquidar(
        caso({
          anio: 2014,
          comunidadAutonoma: "castilla-y-leon",
          baseGeneralCentimos: 0,
          ahorroCentimos: 3_000_100,
        })
      )
    ).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      baseLiquidableAhorroCentimos: 3_000_100,
      cuotaIntegraAhorroCentimos: 598_950,
      cuotaMinimoPersonalAhorroCentimos: 0,
      cuotaLiquidaCentimos: 598_950,
    })
  })

  it("las escalas estatal y autonómica del ahorro suman la escala agregada en cada ejercicio", () => {
    const bases = [
      "0", "3000", "6000", "15000", "24000", "37000", "50000", "120000",
      "200000", "250000", "300000", "450000",
    ].map((base) => new Decimal(base))
    for (const anio of Object.keys(ESCALAS_IRPF_AHORRO_POR_GRAVAMEN).map(
      (clave) => Number(clave) as AnioFiscal
    )) {
      const { estatal, autonomica } = ESCALAS_IRPF_AHORRO_POR_GRAVAMEN[anio].valor
      for (const base of bases) {
        expect(
          calcularCuotaPorEscala({ base, tramos: estatal })
            .plus(calcularCuotaPorEscala({ base, tramos: autonomica }))
            .toFixed(2),
          `${anio} ${base.toFixed(0)}`
        ).toBe(calcularCuotaPorEscalaAhorro({ anio, base }).toFixed(2))
      }
    }
  })

  it("Aragón 2025, mínimos iguales a los estatales: el resultado no cambia", () => {
    // Remanente estatal = autonómico = 5.550. Cuota C = Cuota D = 527,25.
    // Minoración 1.054,50 (igual que 5.550 x 19 %); cuota del ahorro 85,50.
    expect(
      liquidar(
        caso({
          anio: 2025,
          comunidadAutonoma: "aragon",
          baseGeneralCentimos: 0,
          ahorroCentimos: 600_000,
        })
      )
    ).toMatchObject({
      _tag: "LiquidacionIrpfAnualCalculada",
      cuotaIntegraAhorroCentimos: 114_000,
      cuotaMinimoPersonalAhorroCentimos: 105_450,
      cuotaLiquidaCentimos: 8_550,
    })
  })
})
