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

// Los contadores heredados no describen un parto múltiple ni gastos por menor.
// Los esperados originales se conservan con los hechos que exige el adaptador.
import { calcularDeduccionesAutonomicasAplicadas } from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

describe("Hechos y límites del agregador compartido", () => {
  it("rechaza el contador o la base global sin los hechos por evento y menor", () => {
    expect(() => calcularDeduccionesAutonomicasAplicadas(
      { madridHijosNacimientoAdopcion: 2 },
      { ejercicio: 2025, territorio: "madrid" }
    )).toThrow("Hechos insuficientes para deducción: madrid_nacimiento_adopcion_hijos")
    expect(() => calcularDeduccionesAutonomicasAplicadas(
      { "murcia_gastos_guarderia:cumple": true, "murcia_gastos_guarderia:base": 10000 },
      { ejercicio: 2025, territorio: "murcia" }
    )).toThrow("Hechos insuficientes para deducción: murcia_gastos_guarderia")
  })
  it(
    "Madrid: dos hijos de un parto múltiple en 2025, un progenitor: 2 × (721,70 + 721,70)",
    () => {
      expect(
        calcularDeduccionesAutonomicasAplicadas(
          { madridHijosNacimientoAdopcion: 2 },
          { ejercicio: 2025, territorio: "madrid" },
          [{
            codigo: "madrid_nacimiento_adopcion_hijos",
            contexto: { ejercicio: 2025, territorio: "madrid", contribuyente: "a", modalidad: "individual" },
            declarantes: ["a"], elegibilidadExterna: true,
            eventos: [{ ejercicio: 2025, hijos: ["h1", "h2"], progenitoresConvivientes: ["a"] }],
            historia: [{ ejercicio: 2025, general: 20000, ahorro: 0, basesUnidadFamiliar: [20000] }],
          }]
        )
      ).toBe(2886.8)
    }
  )
  it(
    "Murcia: dos descendientes, gasto elegible de 5.000 euros por cada uno, un titular",
    () => {
      expect(
        calcularDeduccionesAutonomicasAplicadas(
          {
            "murcia_gastos_guarderia:cumple": true,
            "murcia_gastos_guarderia:base": 10000,
          },
          { ejercicio: 2025, territorio: "murcia" },
          [{
            codigo: "murcia_gastos_guarderia",
            contexto: { ejercicio: 2025, territorio: "murcia", contribuyente: "a", modalidad: "individual" },
            declarantes: ["a"], elegibilidadExterna: true, baseImponible: 20000,
            gastos: ["h1", "h2"].map(hijo => ({
              hijo, custodia: 5000, ayudas: 0, alimentacion: 0, vestuarioEscolar: 0, titulares: ["a"],
            })),
          }]
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
