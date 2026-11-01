import { describe, expect, it } from "vitest"
import { MADRID_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/madrid"
import { MURCIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/murcia"
import paginas from "../docs/procedencia/deducciones-2025/lotes/f/paginas-verificadas.json"

const fichas = [
  ...MADRID_DEDUCCIONES_AUTONOMICAS_2025,
  ...MURCIA_DEDUCCIONES_AUTONOMICAS_2025,
]
describe("Referencias individuales del lote F a la edición AEAT fijada por hash", () => {
  it("cubre exactamente los 51 códigos sin duplicados", () => {
    expect(new Set(fichas.map((f) => f.codigo)).size).toBe(51)
    expect(fichas.map((f) => f.codigo).sort()).toEqual(
      Object.keys(paginas).sort()
    )
  })
  for (const [codigo, esperado] of Object.entries(paginas)) {
    it(codigo, () => {
      expect(
        fichas.find((f) => f.codigo === codigo)?.fuenteManual.paginas
      ).toEqual(esperado)
    })
  }
})

// Casos sintéticos: estos defectos pertenecen al agregador compartido.
// Se conservan como pruebas rojas esperadas hasta que se coordine su corrección.
import { calcularDeduccionesAutonomicasAplicadas } from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

describe("Limitaciones financieras del agregador compartido", () => {
  it.fails(
    "Madrid: dos hijos de un parto múltiple en 2025, un progenitor: 2 × (721,70 + 721,70)",
    () => {
      expect(
        calcularDeduccionesAutonomicasAplicadas(
          { madridHijosNacimientoAdopcion: 2 },
          { ejercicio: 2025, territorio: "madrid" }
        )
      ).toBe(2886.8)
    }
  )
  it.fails(
    "Murcia: dos descendientes, gasto elegible de 5.000 euros por cada uno, un titular",
    () => {
      expect(
        calcularDeduccionesAutonomicasAplicadas(
          {
            "murcia_gastos_guarderia:cumple": true,
            "murcia_gastos_guarderia:base": 10000,
          },
          { ejercicio: 2025, territorio: "murcia" }
        )
      ).toBe(2000)
    }
  )
  for (const ficha of fichas.filter((f) =>
    f.entradaNecesaria.some((campo) => campo === `${f.codigo}:importe`)
  )) {
    it(`${ficha.codigo}: la ruta es consignación, sin liquidación de hechos`, () => {
      expect(
        calcularDeduccionesAutonomicasAplicadas(
          {
            [`${ficha.codigo}:cumple`]: true,
            [`${ficha.codigo}:importe`]: 123.45,
          },
          { ejercicio: 2025, territorio: ficha.comunidad }
        )
      ).toBe(123.45)
    })
  }
})
