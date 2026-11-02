// Tests are Effect entry points and inspect removed files.
// @effect-diagnostics effect/nodeBuiltinImport:off
// @effect-diagnostics effect/strictEffectProvide:off
import { expect, it } from "vitest"
import { Effect } from "effect"
import { existsSync, readFileSync } from "node:fs"
import {
  liquidarIrpfAnual,
  LiquidacionIrpfAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { calcularSalario } from "../lib/dominio/analisis-salarial/calculo-salario"

const caso: CasoFiscalAnual = {
  anio: 2025,
  comunidadAutonoma: "madrid",
  situacionFamiliar: {
    tipo: "individual",
    edad: 40,
    discapacidad: { _tag: "SinDiscapacidad" },
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
}
it("rechaza el modo retirado también desde JavaScript", () => {
  // @ts-expect-error frontera JavaScript: el modo ya no pertenece al contrato.
  const calculo = liquidarIrpfAnual(caso, { modo: "compatible-legacy" })
  expect(Effect.runSync(Effect.exit(calculo))._tag).toBe("Failure")
})
it("el servicio no ofrece bypass con dos titulares omitidos", () => {
  const parcial = {
    ...caso,
    situacionFamiliar: {
      ...caso.situacionFamiliar,
      descendientes: [{ edad: 8, discapacidad: { _tag: "SinDiscapacidad" } }],
    },
  }
  const programa = Effect.gen(function* () {
    const motor = yield* LiquidacionIrpfAnual
    // @ts-expect-error frontera JavaScript: lista antigua insuficiente.
    return yield* Effect.exit(motor.liquidar(parcial, { modo: "canonico" }))
  }).pipe(Effect.provide(LiquidacionIrpfAnual.layer))
  expect(Effect.runSync(programa)._tag).toBe("Failure")
})
it("el análisis salarial consume la cuota anual sin reconstrucción ni límite legacy", () => {
  const anual = Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))
  const analisis = Effect.runSync(
    calcularSalario({
      anio: 2025,
      comunidadAutonoma: "madrid",
      salarioBrutoAnualCentimos: 3000000,
    })
  )
  expect(analisis.irpfFinalCentimos).toBe(anual.cuotaLiquidaCentimos)
  expect(analisis.salarioNetoAnualCentimos).toBe(
    3000000 - anual.cotizacionTrabajadorCentimos - anual.cuotaLiquidaCentimos
  )
  expect("conciliacionSimuladorLegacy" in anual).toBe(false)
})
it("retira físicamente los entrypoints insuficientes y las liquidaciones alternativas", () => {
  for (const path of [
    "lib/dominio/irpf/minimos/minimo-descendientes.ts",
    "lib/dominio/irpf/minimos/minimo-ascendientes.ts",
    "lib/dominio/irpf/liquidacion/conciliacion-simulador-legacy.ts",
    "lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts",
    "lib/dominio/compatibilidad-legacy/comparativa-tabular.ts",
    "lib/dominio/compatibilidad-legacy/detalle-tabular.ts",
  ])
    expect(existsSync(path)).toBe(false)
  expect(
    readFileSync("lib/dominio/irpf/caso-fiscal-anual.ts", "utf8")
  ).not.toContain("FamiliarFiscal")
})
