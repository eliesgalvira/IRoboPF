import { describe, expect, it } from "@effect/vitest"

import type { ValorPendienteDeTestigo } from "../lib/procedencia/extraccion"
import {
  aparicionesDe,
  asignarTestigos,
  type PaginaDeTexto,
  type TablaPendienteDeTestigo,
} from "../lib/procedencia/testigo-pdf"

const SHA_PDF = "b".repeat(64)

const pagina = (
  numero: number,
  ...textos: ReadonlyArray<string>
): PaginaDeTexto => ({
  pagina: numero,
  elementos: textos.map((texto, indice) => ({ texto, x: indice, y: numero })),
})

const celda = (literal: string): ValorPendienteDeTestigo => ({
  ubicacion: { fila: "0", columna: "c", linea: 1, columnaFuente: 1 },
  literal,
  unidad: "EUR",
  valor: { _tag: "Numero", decimal: "0" },
  claves: [],
  alcance: { _tag: "CabeceraDeColumna", literal: "c" },
  origen: { _tag: "Directo" },
  literalTestigo: literal,
})

const tabla = (
  nombre: string,
  paginas: ReadonlyArray<PaginaDeTexto>,
  ...literales: ReadonlyArray<string>
): TablaPendienteDeTestigo => ({
  tabla: nombre,
  sha256: SHA_PDF,
  paginas,
  valores: literales.map(celda),
})

const etiquetas = (tablas: ReadonlyArray<TablaPendienteDeTestigo>) => {
  const testigos = asignarTestigos(tablas)
  return Object.fromEntries(
    tablas
      .map(
        (t) =>
          [
            t.tabla,
            (testigos.get(t.tabla) ?? []).map((v) => v.testigo._tag),
          ] as const
      )
      .sort(([a], [b]) => a.localeCompare(b))
  )
}

describe("testigo global en el PDF", () => {
  it("una aparición de una página compartida atestigua una sola celda", () => {
    const compartida = pagina(1, "0", "12,00")
    const resultado = asignarTestigos([
      tabla("madrid", [compartida], "0"),
      tabla("murcia", [compartida], "0"),
    ])
    const [testigo] = (resultado.get("murcia") ?? []).map((v) => v.testigo)
    expect(testigo).toMatchObject({
      _tag: "SinTestigo",
      tablas: ["madrid", "murcia"],
      celdas: 2,
      aparicionesDisponibles: 1,
      cubiertas: 1,
    })
    expect(resultado.get("madrid")?.[0]?.testigo._tag).toBe("SinTestigo")
    expect(
      etiquetas([
        tabla("madrid", [pagina(1, "0", "0")], "0"),
        tabla("murcia", [pagina(1, "0", "0")], "0"),
      ])
    ).toEqual({ madrid: ["ConTestigo"], murcia: ["ConTestigo"] })
  })

  it("con páginas que se solapan en parte decide el emparejamiento, no la cuenta por tabla", () => {
    const p1 = pagina(1, "0", "0")
    // Cada tabla, por separado, tiene apariciones de sobra; juntas piden tres
    // y sólo hay dos.
    const escasas = [
      tabla("a", [p1], "0", "0"),
      tabla("b", [p1, pagina(2)], "0"),
    ]
    expect(etiquetas(escasas)).toEqual({
      a: ["SinTestigo", "SinTestigo"],
      b: ["SinTestigo"],
    })
    // Con una aparición en la página 2, la celda de b ha de ir allí para que
    // a use las dos de la página 1: hace falta un camino aumentante.
    const p2 = pagina(2, "0")
    const suficientes = [tabla("b", [p1, p2], "0"), tabla("a", [p1], "0", "0")]
    expect(etiquetas(suficientes)).toEqual({
      a: ["ConTestigo", "ConTestigo"],
      b: ["ConTestigo"],
    })
    expect(etiquetas([...suficientes].reverse())).toEqual(
      etiquetas(suficientes)
    )
    expect(etiquetas([...escasas].reverse())).toEqual(etiquetas(escasas))
  })

  it("la unión de apariciones no basta si una tabla no alcanza las de otra página", () => {
    const resultado = asignarTestigos([
      tabla("a", [pagina(1, "0")], "0", "0"),
      tabla("b", [pagina(1, "0"), pagina(2, "0", "0", "0")], "0"),
    ])
    expect(resultado.get("a")?.[0]?.testigo).toMatchObject({
      _tag: "SinTestigo",
      celdas: 3,
      aparicionesDisponibles: 4,
      cubiertas: 2,
    })
  })

  it("las tablas que no comparten apariciones del literal no se afectan", () => {
    expect(
      etiquetas([
        tabla("a", [pagina(1, "0")], "0"),
        tabla("c", [pagina(3, "1")], "0"),
      ])
    ).toEqual({ a: ["ConTestigo"], c: ["SinTestigo"] })
  })

  it("dos ocurrencias en un mismo elemento son dos apariciones distintas", () => {
    expect(
      aparicionesDe("0", [pagina(1, "0 y 0")]).map((a) => a.ocurrencia)
    ).toEqual([0, 1])
    expect(
      etiquetas([
        tabla("a", [pagina(1, "0 y 0")], "0"),
        tabla("b", [pagina(1, "0 y 0")], "0"),
      ])
    ).toEqual({ a: ["ConTestigo"], b: ["ConTestigo"] })
  })

  it("las apariciones guardadas son las candidatas de las páginas de la tabla", () => {
    const resultado = asignarTestigos([
      tabla("a", [pagina(1, "0")], "0"),
      tabla("b", [pagina(1, "0"), pagina(2, "0")], "0"),
    ])
    const candidatas = (nombre: string) => {
      const testigo = resultado.get(nombre)?.[0]?.testigo
      return testigo !== undefined && testigo._tag !== "PorRemision"
        ? testigo.apariciones.map((a) => a.pagina)
        : []
    }
    expect(candidatas("a")).toEqual([1])
    expect(candidatas("b")).toEqual([1, 2])
  })
})

// El testigo de un valor ha de ser la celda del PDF (tabla, fila y columna del
// árbol etiquetado) cuyo texto es el de la celda del HTML, no un token de la
// página.
describe("testigo de celda", () => {
  const testigoDe = (paginas: ReadonlyArray<PaginaDeTexto>, literal: string) =>
    asignarTestigos([tabla("ahorro", paginas, literal)]).get("ahorro")?.[0]
      ?.testigo

  it("un literal que sólo está en la prosa de la página no atestigua la celda", () => {
    expect(
      testigoDe([pagina(1132, "Resto: 2.690 al 15 % = 403,5")], "15")?._tag
    ).toBe("SinTestigo")
  })

  it("«-9,50 ABC9,50%» no es el texto de ninguna celda con 9,50", () => {
    expect(
      etiquetas([tabla("ahorro", [pagina(1, "-9,50 ABC9,50%")], "9,50", "9,50")])
    ).toEqual({ ahorro: ["SinTestigo", "SinTestigo"] })
  })

  it("una celda cuyo texto llega en dos fragmentos «En» y «adelante» atestigua «En adelante»", () => {
    expect(
      testigoDe([pagina(1, "En", "adelante")], "En adelante")?._tag
    ).not.toBe("SinTestigo")
  })

  it("el testigo identifica la tabla, la fila y la columna de la celda", () => {
    expect(testigoDe([pagina(1, "0")], "0")).toHaveProperty("celda")
  })
})
