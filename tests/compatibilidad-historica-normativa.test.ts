import { expect, it } from "vitest"
import evidencia from "./fixtures/compatibilidad-historica-normativa.json"
it("conserva valores documentales de la ruta retirada sin ejecutarla", () => {
  expect(evidencia.base).toBe("9062620236b51cbaacff22f3aa8106700751d6ef")
  expect(evidencia.limiteRetencion).toBe("0.43")
  expect(evidencia.deduccion2024).toBe("0")
  expect(evidencia.deduccion2025).toBe("340")
  expect(evidencia.deduccion2026).toBe("590.89")
})
