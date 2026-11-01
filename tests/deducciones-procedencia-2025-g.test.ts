import { calcularDeduccionesAutonomicasAplicadas } from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"
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

// Caracteriza la consignación externa; estos casos no acreditan elegibilidad fiscal.
describe("alcance real del evaluador valenciano", () => {
  const ambito = { ejercicio: 2025, territorio: "comunitat-valenciana" }
  for (const ficha of VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025) {
    if (ficha.codigo === "valenciana_ascendientes_mayores_discapacidad")
      continue
    it(`${ficha.codigo}: necesita importe calculado fuera`, () => {
      expect(
        calcularDeduccionesAutonomicasAplicadas(
          {
            [`${ficha.codigo}:cumple`]: true,
            [`${ficha.codigo}:importe`]: 123.45,
          },
          ambito
        )
      ).toBe(123.45)
      expect(
        calcularDeduccionesAutonomicasAplicadas(
          {
            [`${ficha.codigo}:cumple`]: true,
            [`${ficha.codigo}:base`]: 1000,
          },
          ambito
        )
      ).toBe(0)
    })
  }
  it("ascendientes: multiplica unidades sin recibir la base liquidable", () => {
    expect(
      calcularDeduccionesAutonomicasAplicadas(
        {
          "valenciana_ascendientes_mayores_discapacidad:cumple": true,
          "valenciana_ascendientes_mayores_discapacidad:unidades": 2,
        },
        ambito
      )
    ).toBe(394)
  })
})
