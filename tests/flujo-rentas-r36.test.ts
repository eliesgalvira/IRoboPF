import { expect, it } from "vitest"
import { runRentasSuite } from "../scripts/procedencia/flujo-rentas-r36-ensayos.mjs"

it("evalúa rentas por propiedad y conserva las fronteras candidatas", () => {
  const result = runRentasSuite()
  expect(result.cases.filter((row) => row.status === "fail")).toEqual([])
  expect(result.fragment.wiringAllowed).toBe(false)
})
