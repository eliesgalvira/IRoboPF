import { expect, test } from "vitest"
import { runRentasConditions } from "../scripts/procedencia/causal-rentas-r59-condiciones.mjs"
test("condiciones urbanas y límites de reinversión realmente consumidos", () => {
  expect(runRentasConditions()).toHaveLength(7)
}, 120000)
