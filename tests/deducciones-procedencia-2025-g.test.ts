import { describe, expect, it } from "vitest"
import paginasManual from "../docs/procedencia/deducciones-2025/lotes/g/paginas-manual.json"
import { VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/comunitat-valenciana"

const paginas: Record<string, number[]> = paginasManual

describe("referencias valencianas en la edición fijada del Manual Renta 2025", () => {
  it("conserva exactamente las cuarenta fichas censadas", () => {
    expect(VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025).toHaveLength(40)
    expect(
      VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025.map((f) => f.codigo).sort()
    ).toEqual(Object.keys(paginas).sort())
  })
  for (const ficha of VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025) {
    it(ficha.codigo, () => {
      expect(ficha.fuenteManual.paginas).toEqual(paginas[ficha.codigo])
    })
  }
})

// El comportamiento de consignación anterior se conserva por hash y en las pruebas
// privadas de la base b95e56d6; no se exige como contrato del motor único.
describe("datos regionales para integrar en el cálculo único", () => {
  for (const ficha of VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025) {
    it(`${ficha.codigo}: requiere hechos y no se presenta como cálculo completo`, () => {
      expect(ficha.estado).toBe("normalizada_pendiente_tests")
      expect(ficha.entradaNecesaria.length).toBeGreaterThan(4)
      expect(ficha.entradaNecesaria.join(" ")).not.toContain(":cumple")
      expect(ficha.entradaNecesaria.join(" ")).not.toContain(":importe")
      expect(ficha.requisitos.length).toBeGreaterThan(1)
    })
  }
})
