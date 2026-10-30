import { expect, test } from "vitest"
import { runRentasCollections } from "../scripts/procedencia/causal-rentas-r59-colecciones.mjs"
test("ganancias múltiples: identidad, orden, callbacks, bases, pérdidas y exenciones", () => {
  expect(runRentasCollections()).toHaveLength(4)
}, 120000)
