import { expect, it } from "vitest"
import { produceComposition } from "../../../../scripts/procedencia/composicion-r43"
import { executeFinite } from "../../../../scripts/procedencia/flujo-retenciones-r34-consumidor.mjs"

it("conserva el payload tipado de un rechazo de retención", () => {
 const fragment = produceComposition().fragments.retenciones
 let failure: object | undefined
 try {
  executeFinite(fragment, "calcularRetencionTrabajoAeatImpl", [{ anio: 1900 }, { modo: "canonico" }], false)
 } catch (error) {
  // El rojo exige el payload real, no que un texto contenga ResultadoNoSoportado.
  failure = error instanceof Error ? error : { payload: error }
 }
 expect(failure).toHaveProperty("payload._tag", "ResultadoNoSoportado")
})
