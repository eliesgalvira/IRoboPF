import { describe, expect, it } from "vitest"
import {
  calcularDeduccionesAutonomicasAplicadas,
  calcularDeduccionesConsignadas,
} from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"
import { VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025"

const ambito = { ejercicio: 2025, territorio: "comunitat-valenciana" }
const codigo = "valenciana_tratamientos_fertilidad"
const consignacion = { [`${codigo}:cumple`]: true, [`${codigo}:importe`]: 50 }

describe("deducciones pendientes en el auxiliar parcial", () => {
  it("conserva la consignación expresa de 50 euros", () => {
    expect(calcularDeduccionesConsignadas(consignacion, ambito)).toBe(50)
  })

  it("rechaza las activaciones pendientes sin convertirlas en cero", () => {
    for (const ficha of VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025) {
      expect(() =>
        calcularDeduccionesAutonomicasAplicadas(
          { [`${ficha.codigo}:cumple`]: true, [`${ficha.codigo}:importe`]: 50 },
          ambito
        )
      ).toThrow(/Deducción sin cálculo automático soportado/)
    }
  })

  it("conserva el cero de una deducción no activada", () => {
    expect(
      calcularDeduccionesAutonomicasAplicadas(
        { ...consignacion, [`${codigo}:cumple`]: false },
        ambito
      )
    ).toBe(0)
  })

  it("no activa una deducción de otro territorio", () => {
    expect(
      calcularDeduccionesAutonomicasAplicadas(consignacion, {
        ejercicio: 2025,
        territorio: "madrid",
      })
    ).toBe(0)
  })
})
