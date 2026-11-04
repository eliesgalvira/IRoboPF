import { describe, it } from "vitest"
import { casos } from "./composicion-valenciana.casos"
describe("composición individual valenciana 2025, antes de cuota", () => {
  for (const [nombre, comprobar] of Object.entries(casos)) it(nombre, comprobar)
})
