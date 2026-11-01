import { describe, expect, it } from "vitest"
import {
  calcularDeduccionesAutonomicasAplicadas as helper,
  calcularDeduccionesConsignadas as consignar,
} from "../../../../../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

const ambito = { ejercicio: 2025, territorio: "cantabria" }
const alquiler = "cantabria_arrendamiento_jovenes_mayores_discapacidad"
const nacimiento = "cantabria_nacimiento_adopcion_hijos"
const entrada = (codigo: string, campo: string, valor: number) => ({
  [`${codigo}:cumple`]: true,
  [`${codigo}:${campo}`]: valor,
})

describe("revisión independiente B: límites del contrato", () => {
  it("alquiler: la modalidad cambia el derecho con idénticas entradas representables", () => {
    const datos = entrada(alquiler, "base", 6000)
    const individual = Math.min(6000 * 0.1, 300)
    const conjunta = Math.min(6000 * 0.1, 600)
    expect([individual, conjunta, helper(datos, ambito)]).toEqual([
      300, 600, 300,
    ])
  })
  it.each([2999, 3000, 3001, 5999, 6000, 6001])(
    "frontera alquiler %s: el helper siempre usa máximo individual",
    (base) => {
      expect(helper(entrada(alquiler, "base", base), ambito)).toBeCloseTo(
        Math.min(base * 0.1, 300),
        2
      )
    }
  )
  it("nacimiento: dos progenitores individuales y unidad conjunta no tienen mismo reparto", () => {
    const datos = entrada(nacimiento, "unidades", 1)
    expect(helper(datos, ambito)).toBe(1400)
    expect(1400 / 2).toBe(700)
    // Añadir una clave libre de modalidad no hace que el helper la interprete.
    expect(
      helper({ ...datos, modalidad: "individual", titulares: 2 }, ambito)
    ).toBe(1400)
  })
  it("nacimiento de dos hijos: la carencia de reparto escala con las unidades", () => {
    expect(helper(entrada(nacimiento, "unidades", 2), ambito)).toBe(2800)
    expect((2 * 1400) / 2).toBe(1400)
  })
  it("consignación explícita: conserva 700 sin ejecutar unidades ni base", () => {
    const datos = {
      ...entrada(nacimiento, "unidades", 2),
      [`${nacimiento}:importe`]: 700,
    }
    expect(consignar(datos, ambito)).toBe(700)
    expect(consignar(entrada(nacimiento, "unidades", 2), ambito)).toBe(0)
    expect(
      consignar({ ...datos, [`${nacimiento}:cumple`]: false }, ambito)
    ).toBe(0)
  })
  it("una consignación no acredita el límite legal: el contrato admite un importe superior", () => {
    expect(consignar(entrada(alquiler, "importe", 900), ambito)).toBe(900)
    // Hecho del contrato, no defecto de aritmética: corresponde validar la liquidación externa.
  })
})
