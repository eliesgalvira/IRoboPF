import { describe, expect, it } from "@effect/vitest"
import { Result } from "effect"

import type { ValorPendienteDeTestigo } from "../lib/procedencia/extraccion"
import type { Testigo } from "../lib/procedencia/resultado"
import {
  atestiguar,
  localizarTablaPdf,
  normalizarPdf,
  type Correspondencia,
  type DeclaracionPdf,
  type NodoPdf,
  type PaginaEtiquetada,
} from "../lib/procedencia/testigo-pdf"

// Árboles etiquetados sintéticos, con la forma que da pdf.js: un contenido
// marcado es una hoja de texto; una celda sin contenido en la página no tiene
// hojas.
const contenido = (texto: string): NodoPdf => ({ _tag: "Contenido", texto })
const elemento = (rol: string, ...hijos: ReadonlyArray<NodoPdf>): NodoPdf => ({
  _tag: "Elemento",
  rol,
  hijos,
})
const celda = (rol: "TH" | "TD", ...textos: ReadonlyArray<string>) =>
  elemento(rol, ...textos.map((t) => elemento("P", contenido(t))))
const fila = (rol: "TH" | "TD", ...celdas: ReadonlyArray<string | null>) =>
  elemento(
    "TR",
    ...celdas.map((texto) => (texto === null ? celda(rol) : celda(rol, texto)))
  )
const CABECERA = ["Base", "Tipo"]
const tablaPdf = (
  cabecera: ReadonlyArray<string | null>,
  ...datos: ReadonlyArray<ReadonlyArray<string | null>>
) =>
  elemento(
    "Table",
    elemento("THead", fila("TH", ...cabecera)),
    elemento("TBody", ...datos.map((d) => fila("TD", ...d)))
  )
const pagina = (
  numero: number,
  ...hijos: ReadonlyArray<NodoPdf>
): PaginaEtiquetada => ({
  pagina: numero,
  raiz: elemento("Document", ...hijos),
})
const encabezado = (texto: string) => elemento("H5", contenido(texto))
const prosa = (texto: string) => elemento("P", contenido(texto))

const declaracion = (
  paginas: ReadonlyArray<number>,
  extra: Partial<DeclaracionPdf> = {}
): DeclaracionPdf => ({ paginas, cabecera: CABECERA, ...extra })

const ESCALA = (tramos: number): Correspondencia => ({
  _tag: "Escala",
  tramos,
  columnaPdf: new Map([
    ["Base HTML", "Base"],
    ["Tipo HTML", "Tipo"],
  ]),
})

const pendiente = (
  fila: number,
  columna: "Base HTML" | "Tipo HTML",
  literal: string,
  decimal: string
): ValorPendienteDeTestigo => ({
  ubicacion: { fila: String(fila), columna, linea: 1, columnaFuente: 1 },
  literal,
  unidad: columna === "Tipo HTML" ? "porcentaje" : "EUR",
  valor: { _tag: "Numero", decimal },
  claves: [],
  alcance: { _tag: "CabeceraDeColumna", literal: columna },
  origen: { _tag: "Directo" },
  atestiguable: {
    _tag: "Celda",
    fila,
    columna,
    textoHtml: literal,
    gramatica: {
      decimales: [0, 2],
      centinelas: [{ literal: "En adelante", centinela: "sin-limite" }],
    },
  },
})

const testigos = (
  paginas: ReadonlyArray<PaginaEtiquetada>,
  valores: ReadonlyArray<ValorPendienteDeTestigo>,
  extra: Partial<DeclaracionPdf> = {},
  tramos = 1
): ReadonlyArray<Testigo> =>
  atestiguar(
    localizarTablaPdf(
      declaracion(
        paginas.map((p) => p.pagina),
        extra
      ),
      paginas
    ),
    ESCALA(tramos),
    valores
  ).map((v) => v.testigo)

// El testigo de un valor es la celda del PDF (tabla, fila y columna del
// árbol etiquetado) cuyo texto es el de la celda del HTML, no un token de la
// página.
describe("testigo de celda", () => {
  it("un literal que sólo está en la prosa de la página no atestigua la celda", () => {
    const [testigo] = testigos(
      [
        pagina(
          1132,
          tablaPdf(CABECERA, ["0", "9,50"]),
          prosa("Resto: 2.690 al 15 % = 403,5")
        ),
      ],
      [pendiente(0, "Tipo HTML", "15", "15")]
    )
    expect(testigo).toMatchObject({
      _tag: "SinTestigo",
      motivo: { _tag: "ValorPdfDistinto", literalPdf: "9,50" },
    })
  })

  it("«-9,50 ABC9,50%» no es el texto de ninguna celda con 9,50", () => {
    expect(
      testigos(
        [pagina(1, tablaPdf(CABECERA, ["-9,50 ABC9,50%", "9,50%"]))],
        [
          pendiente(0, "Base HTML", "9,50", "9.5"),
          pendiente(0, "Tipo HTML", "9,50", "9.5"),
        ]
      ).map((t) => t._tag === "SinTestigo" && t.motivo._tag)
    ).toEqual(["LiteralPdfFueraDeGramatica", "LiteralPdfFueraDeGramatica"])
  })

  it("una celda cuyo texto llega en dos fragmentos «En» y «adelante» atestigua «En adelante»", () => {
    const partida = elemento(
      "TD",
      elemento("P", contenido("En"), contenido("adelante"))
    )
    const tabla = elemento(
      "Table",
      elemento("THead", fila("TH", ...CABECERA)),
      elemento("TBody", elemento("TR", partida, celda("TD", "9,50")))
    )
    const [testigo] = testigos(
      [pagina(1, tabla)],
      [
        {
          ...pendiente(0, "Base HTML", "En adelante", "0"),
          valor: { _tag: "Centinela", centinela: "sin-limite" },
        },
      ]
    )
    expect(testigo?._tag).toBe("MismoLiteral")
  })

  it("el testigo identifica la tabla, la fila y la columna de la celda", () => {
    const [testigo] = testigos(
      [
        pagina(
          7,
          prosa("0"),
          tablaPdf(["Otra", "Tabla"], ["0", "0"]),
          tablaPdf(CABECERA, ["0", "9,50"])
        ),
      ],
      [pendiente(0, "Tipo HTML", "9,50", "9.5")]
    )
    expect(testigo).toEqual({
      _tag: "MismoLiteral",
      celda: { pagina: 7, tabla: 1, fila: 1, columna: 1, paginas: [7] },
    })
  })

  it("otro literal que la gramática lee al mismo valor es un estado aparte", () => {
    expect(
      testigos(
        [pagina(1, tablaPdf(CABECERA, ["6.000", "9,50"]))],
        [pendiente(0, "Base HTML", "6.000,00", "6000")]
      )
    ).toEqual([
      {
        _tag: "MismoValorOtroLiteral",
        celda: { pagina: 1, tabla: 0, fila: 1, columna: 0, paginas: [1] },
        literalPdf: "6.000",
      },
    ])
  })

  it("la etiqueta de un elemento de lista no es texto de la celda", () => {
    const lista = elemento(
      "TD",
      elemento(
        "L",
        elemento(
          "LI",
          elemento("Lbl", contenido("•")),
          elemento("LBody", contenido("2.400 euros"))
        )
      )
    )
    const tabla = elemento(
      "Table",
      elemento("THead", fila("TH", ...CABECERA)),
      elemento("TBody", elemento("TR", lista, celda("TD", "9,50")))
    )
    const [t] = testigos(
      [pagina(1, tabla)],
      [
        {
          ...pendiente(0, "Base HTML", "2.400 euros", "0"),
          atestiguable: {
            _tag: "Celda",
            fila: 0,
            columna: "Base HTML",
            textoHtml: "2.400 euros",
            gramatica: null,
          },
        },
      ]
    )
    expect(t?._tag).toBe("MismoLiteral")
  })

  it("normaliza sólo espacios y saltos de línea", () => {
    expect(normalizarPdf("\n Base liquidable\nhasta  (euros) ")).toBe(
      "Base liquidable hasta (euros)"
    )
    expect(normalizarPdf("9,50 %")).toBe("9,50 %")
  })
})

describe("localización de la tabla en el árbol", () => {
  it("dos tablas con la misma cabecera se distinguen por el encabezado que las precede", () => {
    const paginas = [
      pagina(
        1,
        encabezado("Gravamen estatal"),
        tablaPdf(CABECERA, ["0", "9,50"]),
        encabezado("Gravamen autonómico"),
        elemento(
          "L",
          elemento("LI", elemento("LBody", tablaPdf(CABECERA, ["0", "10,50"])))
        )
      ),
    ]
    const tipo = pendiente(0, "Tipo HTML", "10,50", "10.5")
    expect(testigos(paginas, [tipo])).toMatchObject([
      {
        _tag: "SinTestigo",
        motivo: { _tag: "TablaPdfNoLocalizada", encontradas: 2 },
      },
    ])
    expect(
      testigos(paginas, [tipo], { encabezado: "Gravamen autonómico" })
    ).toMatchObject([{ _tag: "MismoLiteral", celda: { tabla: 1 } }])
  })

  it("el encabezado puede estar al final de la página anterior", () => {
    const paginas = [
      pagina(1, encabezado("Aragón")),
      pagina(
        2,
        tablaPdf(CABECERA, ["0", "9,50"]),
        encabezado("Asturias"),
        tablaPdf(CABECERA, ["0", "9,00"])
      ),
    ]
    expect(
      testigos(paginas, [pendiente(0, "Tipo HTML", "9,50", "9.5")], {
        encabezado: "Aragón",
      })
    ).toMatchObject([{ _tag: "MismoLiteral", celda: { pagina: 2, tabla: 0 } }])
  })

  it("sin ninguna tabla con la cabecera declarada no hay testigo", () => {
    expect(
      testigos(
        [pagina(1, tablaPdf(["Base", "Tipo aplicable"], ["0", "9,50"]))],
        [pendiente(0, "Tipo HTML", "9,50", "9.5")]
      )
    ).toMatchObject([
      {
        _tag: "SinTestigo",
        motivo: { _tag: "TablaPdfNoLocalizada", encontradas: 0 },
      },
    ])
  })

  it("una página sin árbol de estructura es un motivo tipado, no una búsqueda en el texto", () => {
    expect(
      testigos(
        [{ pagina: 3, raiz: null }],
        [pendiente(0, "Tipo HTML", "9,50", "9.5")]
      )
    ).toEqual([
      {
        _tag: "SinTestigo",
        motivo: { _tag: "PaginaSinEstructura", pagina: 3 },
      },
    ])
  })

  it("una tabla partida une sus filas por página y la cabecera repetida no cuenta", () => {
    const paginas = [
      pagina(1, tablaPdf(CABECERA, ["0", "9,50"], [null, null]), prosa("pie")),
      pagina(
        2,
        tablaPdf([null, null], [null, null], ["12.450,00", "12,00"]),
        tablaPdf(["Otra", "Tabla"], ["0", "1"])
      ),
    ]
    expect(
      testigos(
        paginas,
        [
          pendiente(0, "Tipo HTML", "9,50", "9.5"),
          pendiente(1, "Base HTML", "12.450,00", "12450"),
        ],
        {},
        2
      )
    ).toEqual([
      {
        _tag: "MismoLiteral",
        celda: { pagina: 1, tabla: 0, fila: 1, columna: 1, paginas: [1] },
      },
      {
        _tag: "MismoLiteral",
        celda: { pagina: 1, tabla: 0, fila: 2, columna: 0, paginas: [2] },
      },
    ])
  })

  it("la continuación ha de ser única y tener el mismo esqueleto", () => {
    const valor = pendiente(0, "Tipo HTML", "9,50", "9.5")
    const primera = pagina(1, tablaPdf(CABECERA, ["0", "9,50"], [null, null]))
    expect(
      testigos([primera, pagina(2, prosa("nada"))], [valor], {}, 2)
    ).toMatchObject([
      {
        _tag: "SinTestigo",
        motivo: { _tag: "ContinuacionNoLocalizada", pagina: 2, encontradas: 0 },
      },
    ])
    expect(
      testigos(
        [
          primera,
          pagina(
            2,
            tablaPdf([null, null], [null, null], [null, null], ["1", "2"])
          ),
        ],
        [valor],
        {},
        2
      )
    ).toMatchObject([
      {
        _tag: "SinTestigo",
        motivo: { _tag: "ContinuacionIrregular", pagina: 2 },
      },
    ])
  })

  it("una tabla con dos filas iguales a la cabecera no elige la primera", () => {
    expect(
      testigos(
        [pagina(1, tablaPdf(CABECERA, CABECERA, ["0", "9,50"]))],
        [pendiente(0, "Tipo HTML", "9,50", "9.5")]
      )
    ).toEqual([
      {
        _tag: "SinTestigo",
        motivo: { _tag: "CabeceraPdfAmbigua", pagina: 1, filas: [0, 1] },
      },
    ])
  })

  it("una tabla anidada en una celda no da texto a la celda", () => {
    const anidada = elemento(
      "TD",
      elemento("Table", elemento("TR", celda("TD", "9,50")))
    )
    const tabla = elemento(
      "Table",
      elemento("THead", fila("TH", ...CABECERA)),
      elemento("TBody", elemento("TR", celda("TD", "0"), anidada))
    )
    expect(
      testigos([pagina(1, tabla)], [pendiente(0, "Tipo HTML", "9,50", "9.5")])
    ).toEqual([
      {
        _tag: "SinTestigo",
        motivo: { _tag: "TablaPdfAnidada", pagina: 1 },
      },
    ])
  })

  it("un número de filas distinto del HTML deja la escala sin testigo", () => {
    expect(
      testigos(
        [pagina(1, tablaPdf(CABECERA, ["0", "9,50"]))],
        [pendiente(0, "Tipo HTML", "9,50", "9.5")],
        {},
        2
      )
    ).toEqual([
      {
        _tag: "SinTestigo",
        motivo: { _tag: "FilasDistintas", html: 2, pdf: 1 },
      },
    ])
  })

})

describe("casilla del cuadro", () => {
  const cuadro: Correspondencia = {
    _tag: "Cuadro",
    cabeceraDeFilasPdf: "Importes",
    columnaPdf: new Map([["Contribuyente HTML", "Contribuyente"]]),
  }
  const tabla = (texto: string) =>
    elemento(
      "Table",
      elemento("TR", celda("TH", "Importes"), celda("TH", "Contribuyente")),
      elemento(
        "TR",
        celda("TH", "Estatal"),
        elemento(
          "TD",
          ...texto.split(" | ").map((t) => elemento("P", contenido(t)))
        )
      )
    )
  const casilla = (textoHtml: string): ValorPendienteDeTestigo => ({
    ...pendiente(0, "Base HTML", "5.550 euros anuales, en general.", "5550"),
    atestiguable: {
      _tag: "Celda",
      fila: "Estatal",
      columna: "Contribuyente HTML",
      textoHtml,
      gramatica: null,
    },
  })
  const testigoDe = (texto: string, textoHtml: string) =>
    atestiguar(
      localizarTablaPdf(
        { paginas: [1], cabecera: ["Importes", "Contribuyente"] },
        [pagina(1, tabla(texto))]
      ),
      cuadro,
      [casilla(textoHtml)]
    )[0]?.testigo

  it("atestigua con el texto entero de la casilla, aunque el PDF parta las frases", () => {
    expect(
      testigoDe(
        "5.550 euros\nanuales, en | general. + 1.150 euros",
        "5.550 euros anuales, en general. + 1.150 euros"
      )
    ).toMatchObject({ _tag: "MismoLiteral", celda: { fila: 1, columna: 1 } })
  })

  it("cualquier diferencia en el texto de la casilla deja sus importes sin testigo", () => {
    expect(
      testigoDe(
        "5.550 euros anuales, en general. + 1.150 euros",
        "5.550 euros anuales, en general. + 1.160 euros"
      )
    ).toMatchObject({
      _tag: "SinTestigo",
      motivo: { _tag: "TextoDistinto" },
    })
  })

  it("un valor remitido se atestigua con el texto de la casilla que remite", () => {
    const remitido = (textoHtml: string): ValorPendienteDeTestigo => ({
      ...casilla(textoHtml),
      atestiguable: {
        _tag: "Remision",
        fila: "Estatal",
        columna: "Contribuyente HTML",
        textoHtml,
        gramatica: null,
      },
    })
    const testigoRemitido = (texto: string, textoHtml: string) =>
      atestiguar(
        localizarTablaPdf(
          { paginas: [1], cabecera: ["Importes", "Contribuyente"] },
          [pagina(1, tabla(texto))]
        ),
        cuadro,
        [remitido(textoHtml)]
      )[0]?.testigo
    expect(
      testigoRemitido(
        "Igual que los mínimos estatales.",
        "Igual que los mínimos estatales."
      )
    ).toEqual({
      _tag: "PorRemision",
      celda: { pagina: 1, tabla: 0, fila: 1, columna: 1, paginas: [1] },
    })
    expect(
      testigoRemitido("6.000 euros", "Igual que los mínimos estatales.")
    ).toMatchObject({ _tag: "SinTestigo", motivo: { _tag: "TextoDistinto" } })
  })

  it("la fila se localiza por su cabecera exacta", () => {
    expect(
      atestiguar(
        localizarTablaPdf(
          { paginas: [1], cabecera: ["Importes", "Contribuyente"] },
          [pagina(1, tabla("x"))]
        ),
        cuadro,
        [
          {
            ...casilla("x"),
            atestiguable: {
              _tag: "Celda",
              fila: "C.A Andalucía",
              columna: "Contribuyente HTML",
              textoHtml: "x",
              gramatica: null,
            },
          },
        ]
      )[0]?.testigo
    ).toMatchObject({
      _tag: "SinTestigo",
      motivo: { _tag: "FilaPdfNoLocalizada", encontradas: 0 },
    })
  })
})

describe("la tabla localizada", () => {
  it("lleva su página, su índice en el árbol y las columnas por literal", () => {
    const tabla = localizarTablaPdf(declaracion([4]), [
      pagina(4, tablaPdf(["Tipo", "Base"], ["9,50", "0"])),
    ])
    expect(Result.isSuccess(tabla) && tabla.success).toMatchObject({
      pagina: 4,
      indice: 0,
      columnas: new Map([
        ["Tipo", 0],
        ["Base", 1],
      ]),
    })
  })
})
