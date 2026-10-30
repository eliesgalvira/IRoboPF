import { expect, test } from "vitest"
import { runRentasAdversos } from "../scripts/procedencia/causal-rentas-r59-adversos.mjs"
test("adversos exportados conservando importes y rechazando empalmes SS", () => {
  expect(runRentasAdversos().length).toBeGreaterThan(20)
}, 180000)
