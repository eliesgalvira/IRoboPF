import { expect, test } from "vitest"
import {
  runRentasCases,
  saveRentasCases,
} from "../scripts/procedencia/causal-rentas-r59-ensayos.mjs"
test("diez salidas generales y frontera SS con racionales, oracle y adversos", () => {
  const result = runRentasCases()
  saveRentasCases(result)
  expect(result.records.length).toBeGreaterThan(30)
  expect(result.adversos).toBeGreaterThan(10)
}, 600000)
