import { describe, expect, it } from "vitest"
import { calcularDeduccionesAutonomicasAplicadas as calcular } from "../../../../../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

const marco = (territorio: string, contribuyente: string, modalidad: "individual" | "conjunta") => ({
  contexto: { ejercicio: 2025, territorio, contribuyente, modalidad },
  declarantes: modalidad === "conjunta" ? ["a", "b"] : [contribuyente],
  elegibilidadExterna: true,
})
const madrid = (contribuyente: string, modalidad: "individual" | "conjunta", hijos = ["h"]) => ({
  ...marco("madrid", contribuyente, modalidad),
  codigo: "madrid_nacimiento_adopcion_hijos" as const,
  eventos: [{ ejercicio: 2025, hijos, progenitoresConvivientes: ["b"] }],
  historia: [{ ejercicio: 2025, general: 20000, ahorro: 0, basesUnidadFamiliar: [10000, 10000] }],
})
const murcia = (contribuyente: string, modalidad: "individual" | "conjunta", hijos = ["h"], custodia = 5000) => ({
  ...marco("murcia", contribuyente, modalidad),
  codigo: "murcia_gastos_guarderia" as const,
  gastos: hijos.map((hijo) => ({ hijo, titulares: ["b"], custodia, ayudas: 0, alimentacion: 0, vestuarioEscolar: 0 })),
  baseImponible: 20000,
})

describe("F ampliado: hechos actuales, controles y rojos ordinarios", () => {
  it("F-C01: los dos importes históricos están corregidos con hechos", () => {
    const m = madrid("b", "individual", ["h1", "h2"])
    const u = murcia("b", "individual", ["h1", "h2"])
    expect(calcular({}, m.contexto, [m])).toBe(2886.8)
    expect(calcular({}, u.contexto, [u])).toBe(2000)
    const unico = murcia("b", "individual", ["h"], 10000)
    expect(calcular({}, unico.contexto, [unico])).toBe(1000)
  })
  it("F-C02: conjunta referida al progenitor/titular devuelve los importes", () => {
    const m = madrid("b", "conjunta")
    const u = murcia("b", "conjunta")
    expect(calcular({}, m.contexto, [m])).toBe(721.7)
    expect(calcular({}, u.contexto, [u])).toBe(1000)
  })
  it("F-M01: Madrid conjunta incluye al segundo declarante progenitor único", () => {
    const h = madrid("a", "conjunta")
    expect(calcular({}, h.contexto, [h])).toBe(721.7)
  })
  it("F-M02: Murcia conjunta incluye al segundo declarante único titular", () => {
    const h = murcia("a", "conjunta")
    expect(calcular({}, h.contexto, [h])).toBe(1000)
  })
})
