// Tests: puntos de entrada que proporcionan las capas del servicio.
// @effect-diagnostics effect/strictEffectProvide:off
import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import Decimal from "decimal.js"
import {
  componerLiquidacionAnual,
  type EntradaComposicionAnual,
} from "../lib/dominio/irpf/liquidacion/composicion-anual"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
  LiquidacionIrpfAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { liquidarPagosAnuales } from "../lib/dominio/irpf/cuotas/cuota-diferencial"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import {
  analitico,
  efectivo,
  conDerechos,
} from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"

const D = Decimal.clone({ precision: 80 })
function entrada(base: string, ahorro = "0"): EntradaComposicionAnual {
  return {
    ambito: analitico,
    cotizaciones: { naturaleza: "efectivas", trabajador: new D(0) },
    precision: 80,
    politica: "decimal-hasta-salida",
    baseGeneral: new D(base),
    baseAhorro: new D(ahorro),
    rentasAntesReducciones: new D(base),
    minimosEstatales: MINIMOS_ESTATALES_2025,
    deduccionesAutonomicasCentimos: 0,
  }
}
// Oráculos aritméticos aislados: cantidades de la tabla vigente, sin helpers de producto.
it.each([
  ["-100", "0"],
  ["0", "0"],
  ["5549.99", "0"],
  ["5550", "0"],
  ["5550.01", "0.00095"],
  ["6000", "46.43475"],
])("mínimo y base negativa %s: cuota exacta %s", (base, cuota) => {
  expect(
    Effect.runSync(
      componerLiquidacionAnual(entrada(base))
    ).cuotaLiquida.toFixed()
  ).toBe(cuota)
})
it.each([
  ["12449.99", "1182.74905"],
  ["12450", "1182.75"],
  ["12450.01", "1182.7512"],
  ["20199.99", "2112.7488"],
  ["20200", "2112.75"],
  ["20200.01", "2112.7515"],
])("frontera estatal %s sin tolerancia", (base, cuota) => {
  expect(
    Effect.runSync(
      componerLiquidacionAnual(entrada(base))
    ).cuotaIntegraGeneralEstatal.toFixed()
  ).toBe(cuota)
})
it("remanentes de mínimos diferentes y límite autonómico de deducciones", () => {
  const e = entrada("0", "6000")
  const r = Effect.runSync(componerLiquidacionAnual(e))
  expect(r.ahorroConMinimos.estatal.remanente.toFixed()).toBe("5550")
  expect(r.ahorroConMinimos.autonomico.remanente.toFixed()).toBe("5956.65")
  expect(r.cuotaLiquida.toFixed()).toBe("46.86825")
  expect(
    Effect.runSync(
      componerLiquidacionAnual({ ...e, deduccionesAutonomicasCentimos: 100000 })
    ).cuotaLiquida.toFixed()
  ).toBe("42.75")
})
it("deducción autonómica no consume cuota estatal general", () => {
  const r = Effect.runSync(
    componerLiquidacionAnual({
      ...entrada("6000"),
      deduccionesAutonomicasCentimos: 100000,
    })
  )
  expect(r.deduccionesAutonomicasAplicadas.toFixed()).toBe("3.68475")
  expect(r.cuotaLiquida.toFixed()).toBe("42.75")
})
it.each([
  ["100", "20", "30", "50"],
  ["100", "120", "30", "-50"],
  ["100", "20", "80", "0"],
])("pagos reales %s/%s/%s conservan signo", (c, r, p, esperado) => {
  expect(liquidarPagosAnuales(new D(c), new D(r), new D(p)).toFixed()).toBe(
    esperado
  )
})
it("E-REV-01: precisión 80 conserva fracción en ambos gravámenes", () => {
  const base = "6000.123456789012345678901234567890123456789"
  const r = Effect.runSync(componerLiquidacionAnual(entrada(base)))
  // Todo el importe cae en el primer tramo; resultados exactos finitos <80 cifras.
  expect.soft(r.cuotaIntegraGeneralEstatal.toFixed()).toBe(
    new D(base).mul("0.095").toFixed()
  )
  expect.soft(r.cuotaIntegraGeneralAutonomica.toFixed()).toBe(
    new D(base).mul("0.085").toFixed()
  )
})
it("las cotizaciones ya consumidas no se restan de nuevo", () => {
  const e = entrada("6000")
  const a = Effect.runSync(componerLiquidacionAnual(e))
  const b = Effect.runSync(
    componerLiquidacionAnual({
      ...e,
      cotizaciones: {
        naturaleza: "estimadas-perfil-uniforme",
        trabajador: new D("9999.99"),
      },
    })
  )
  expect(b.cuotaLiquida.toFixed()).toBe("46.43475")
  expect(a.cuotaLiquida.toFixed()).toBe(b.cuotaLiquida.toFixed())
})
it.each(["territorio", "edad", "discapacidad", "rentas"])(
  "derechos: %s incoherente es Fail recuperable, no Die",
  (variante) => {
    const caso = {
      ...conDerechos,
      comunidadAutonoma:
        variante === "territorio"
          ? ("canarias" as const)
          : conDerechos.comunidadAutonoma,
      situacionFamiliar: {
        ...conDerechos.situacionFamiliar,
        edad: variante === "edad" ? 41 : conDerechos.situacionFamiliar.edad,
        discapacidad:
          variante === "discapacidad"
            ? { _tag: "Discapacidad65OMas" as const }
            : conDerechos.situacionFamiliar.discapacidad,
      },
      rendimientos:
        variante === "rentas"
          ? { trabajo: [{ importeIntegroCentimos: 4000000 }] }
          : conDerechos.rendimientos,
    }
    const r = Effect.runSync(
      Effect.result(liquidarIrpfAnual(caso, { modo: "canonico" }))
    )
    expect(Result.isFailure(r)).toBe(true)
    if (Result.isFailure(r)) expect(r.failure._tag).toBe("ResultadoNoSoportado")
  }
)
it.each(["empleo-laboral", "pension"] as const)(
  "hechos efectivos propios: %s y políticas de salida",
  (clase) => {
    if (efectivo.perfil !== "solo-trabajo") throw Error("fixture")
    const r = Effect.runSync(
      liquidarIrpfAnualExplicito({
        ...efectivo,
        trabajo: {
          ...efectivo.trabajo,
          rendimientos: efectivo.trabajo.rendimientos.map((x) => ({
            ...x,
            clase,
            integro: "30000",
            cotizaciones: { ...x.cotizaciones, seguridadSocial: "2000" },
          })),
        },
        retenciones: [
          {
            operacionId: "revision-1",
            procedencia: "sintetica",
            ejercicio: 2025,
            efectiva: true,
            importe: "5000",
          },
        ],
      })
    )
    expect(r.baseLiquidableGeneral).toBe("26000")
    expect(r.deduccionTrabajo).toBe("0")
    expect(r.cuotaLiquidaLegal).toBe(
      clase === "pension" ? "4584.12211" : "4584.12"
    )
    expect(r.cuotaDiferencial).toBe(
      clase === "pension" ? "-415.87789" : "-415.88"
    )
    expect(r.cuotaDiferencialPresentada).toBe("-415.88")
  }
)
it("servicio y función directa comparten resultado; rastro actual no hereda enlaces", () => {
  const a = Effect.runSync(liquidarIrpfAnual(analitico, { modo: "canonico" }))
  const b = Effect.runSync(
    Effect.gen(function* () {
      const s = yield* LiquidacionIrpfAnual
      return yield* s.liquidar(analitico, { modo: "canonico" })
    }).pipe(Effect.provide(LiquidacionIrpfAnual.layer))
  )
  expect(a.cuotaLiquidaCentimos).toBe(b.cuotaLiquidaCentimos)
  for (const r of [a, Effect.runSync(liquidarIrpfAnualExplicito(efectivo))]) {
    const referencias = r.rastro.pasos
      .flatMap((p) => p.lineasCalculo ?? [])
      .map((l) => l.procedencia)
      .filter(Boolean)
    expect(referencias.length).toBeGreaterThan(0)
    expect(referencias.every((p) => p?.estado === "pendiente")).toBe(true)
  }
})
