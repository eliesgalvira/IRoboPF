import { describe, expect, it } from "vitest"
import { calcularDeduccionesAutonomicasAplicadas as calcular } from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

const marco = (
  territorio: string,
  contribuyente: string,
  modalidad: "individual" | "conjunta"
) => ({
  contexto: { ejercicio: 2025, territorio, contribuyente, modalidad },
  declarantes: modalidad === "conjunta" ? ["a", "b"] : [contribuyente],
  elegibilidadExterna: true,
})
const madrid = (
  contribuyente: string,
  modalidad: "individual" | "conjunta",
  hijos = ["h"]
) => ({
  ...marco("madrid", contribuyente, modalidad),
  codigo: "madrid_nacimiento_adopcion_hijos" as const,
  eventos: [{ ejercicio: 2025, hijos, progenitoresConvivientes: ["b"] }],
  historia: [
    {
      ejercicio: 2025,
      general: 20000,
      ahorro: 0,
      basesUnidadFamiliar: [10000, 10000],
    },
  ],
})
const murcia = (
  contribuyente: string,
  modalidad: "individual" | "conjunta",
  hijos = ["h"],
  custodia = 5000
) => ({
  ...marco("murcia", contribuyente, modalidad),
  codigo: "murcia_gastos_guarderia" as const,
  gastos: hijos.map((hijo) => ({
    hijo,
    titulares: ["b"],
    custodia,
    ayudas: 0,
    alimentacion: 0,
    vestuarioEscolar: 0,
  })),
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

import {
  evaluarNacimientoMadrid,
  calcularGuarderiaMurciaParcial,
  evaluarDeduccion,
} from "../lib/dominio/irpf/deducciones/contratos-2025"
import { evaluarHechosAuxiliar2025 } from "../lib/dominio/irpf/deducciones/hechos-auxiliar-2025"

describe("Identidad exhaustiva en todas las entradas de Madrid y Murcia", () => {
  for (const referencia of ["a", "b"]) {
    for (const declarantes of [
      ["a", "b"],
      ["b", "a"],
    ]) {
      it(`conjunta ${referencia}, orden ${declarantes.join(",")}`, () => {
        const m = { ...madrid(referencia, "conjunta"), declarantes }
        const u = { ...murcia(referencia, "conjunta"), declarantes }
        const cm = { ...m.contexto, declarantes }
        const cu = { ...u.contexto, declarantes }
        expect(
          evaluarNacimientoMadrid(cm, m.eventos[0], m.historia)
        ).toMatchObject({ importe: 721.7 })
        expect(
          calcularGuarderiaMurciaParcial(cu, u.gastos, u.baseImponible)
        ).toMatchObject({ importe: 1000 })
        expect(
          evaluarDeduccion({
            tipo: "madrid_nacimiento",
            contexto: cm,
            evento: m.eventos[0],
            historia: m.historia,
          })
        ).toMatchObject({ importe: 721.7 })
        expect(
          evaluarDeduccion({
            tipo: "murcia_guarderia",
            contexto: cu,
            gastos: u.gastos,
            baseImponible: u.baseImponible,
          })
        ).toMatchObject({ importe: 1000 })
        expect(evaluarHechosAuxiliar2025(m)).toMatchObject({ importe: 721.7 })
        expect(evaluarHechosAuxiliar2025(u)).toMatchObject({ importe: 1000 })
        expect(calcular({}, cm, [m])).toBe(721.7)
        expect(calcular({}, cu, [u])).toBe(1000)
        const variosM = {
          ...m,
          eventos: [{ ...m.eventos[0], progenitoresConvivientes: ["a", "b"] }],
        }
        const variosU = {
          ...u,
          gastos: u.gastos.map((g) => ({ ...g, titulares: ["a", "b"] })),
        }
        expect(calcular({}, cm, [variosM])).toBe(721.7)
        expect(calcular({}, cu, [variosU])).toBe(1000)
      })
    }
  }
  it("rechaza conjunta sin identidades y titulares ajenos, incluso mezclados", () => {
    const m = madrid("a", "conjunta")
    const u = murcia("a", "conjunta")
    expect(
      evaluarNacimientoMadrid(m.contexto, m.eventos[0], m.historia).estado
    ).toBe("no_soportado")
    expect(
      calcularGuarderiaMurciaParcial(u.contexto, u.gastos, u.baseImponible)
        .estado
    ).toBe("no_soportado")
    for (const declarantes of [[], ["a", "a"], ["a", ""], ["b"]]) {
      expect(
        evaluarNacimientoMadrid(
          { ...m.contexto, declarantes },
          m.eventos[0],
          m.historia
        ).estado
      ).toBe("no_soportado")
      expect(
        calcularGuarderiaMurciaParcial(
          { ...u.contexto, declarantes },
          u.gastos,
          u.baseImponible
        ).estado
      ).toBe("no_soportado")
    }
    for (const titulares of [["x"], ["a", "x"]]) {
      const evento = { ...m.eventos[0], progenitoresConvivientes: titulares }
      const gastos = u.gastos.map((g) => ({ ...g, titulares }))
      expect(
        evaluarNacimientoMadrid(
          { ...m.contexto, declarantes: ["a", "b"] },
          evento,
          m.historia
        ).estado
      ).toBe("no_soportado")
      expect(
        calcularGuarderiaMurciaParcial(
          { ...u.contexto, declarantes: ["a", "b"] },
          gastos,
          u.baseImponible
        ).estado
      ).toBe("no_soportado")
      expect(() =>
        calcular({}, m.contexto, [{ ...m, eventos: [evento] }])
      ).toThrow()
      expect(() => calcular({}, u.contexto, [{ ...u, gastos }])).toThrow()
    }
    expect(() =>
      calcular({}, m.contexto, [{ ...m, declarantes: ["a"] }])
    ).toThrow()
    expect(() =>
      calcular({}, u.contexto, [{ ...u, declarantes: ["a"] }])
    ).toThrow()
    expect(() =>
      calcular({}, { ...m.contexto, declarantes: ["a", "x"] }, [m])
    ).toThrow()
    expect(() =>
      calcular({}, { ...u.contexto, contribuyente: "x" }, [u])
    ).toThrow()
  })
  it("individual conserva prorrateo y el límite murciano se aplica por hijo antes del reparto", () => {
    const m = madrid("b", "individual")
    const u = murcia("b", "individual", ["h1", "h2"], 10000)
    expect(
      calcular({}, m.contexto, [
        {
          ...m,
          eventos: [{ ...m.eventos[0], progenitoresConvivientes: ["a", "b"] }],
        },
      ])
    ).toBe(360.85)
    expect(
      calcular({}, u.contexto, [
        {
          ...u,
          gastos: u.gastos.map((g) => ({ ...g, titulares: ["a", "b"] })),
        },
      ])
    ).toBe(1000)
    const conjunta = murcia("a", "conjunta", ["h1", "h2"], 10000)
    expect(calcular({}, conjunta.contexto, [conjunta])).toBe(2000)
  })
})
