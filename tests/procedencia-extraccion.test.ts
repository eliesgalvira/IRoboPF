import { describe, expect, it } from "@effect/vitest"
import { Result, Schema } from "effect"

import {
  EspecificacionCuadro,
  EspecificacionEscala,
} from "../lib/procedencia/especificacion"
import {
  extraerCuadro,
  extraerEscala,
  type ExtraccionHtml,
} from "../lib/procedencia/extraccion"
import { asignarTestigos } from "../lib/procedencia/testigo-pdf"

const SHA_HTML = "a".repeat(64)
const SHA_PDF = "b".repeat(64)

const columnaBase = {
  cabecera: "Base liquidable hasta (euros)",
  columna: "base-liquidable",
  unidad: "EUR",
  evidenciaUnidad: "(euros)",
  gramatica: { decimales: [2], centinelas: [] },
}
const columnaTipo = {
  cabecera: "Tipo aplicable (%)",
  columna: "tipo-aplicable",
  unidad: "porcentaje",
  evidenciaUnidad: "(%)",
  gramatica: { decimales: [2], sufijo: "%", centinelas: [] },
}

const escala = (cambios: Record<string, unknown> = {}) =>
  Schema.decodeUnknownSync(EspecificacionEscala)({
    tipo: "escala",
    tabla: "prueba",
    magnitud: "escala-general-autonomica",
    territorios: ["ceuta", "melilla"],
    documento: {
      sha256: SHA_HTML,
      localizador: { _tag: "UnicaTablaDelDocumento" },
    },
    columnas: [columnaBase, columnaTipo],
    testigo: { sha256: SHA_PDF, paginas: [1] },
    ...cambios,
  })

const tabla = (filas: string, caption = "", cabecera?: string) =>
  `<table>${caption === "" ? "" : `<caption>${caption}</caption>`}<thead>${
    cabecera ??
    "<tr><th>Base liquidable hasta (euros)</th><th>Tipo aplicable (%)</th></tr>"
  }</thead><tbody>${filas}</tbody></table>`

const html = (...tablas: ReadonlyArray<string>) =>
  `<!doctype html><html><body>${tablas.join("")}</body></html>`

const fila = (...celdas: ReadonlyArray<string>) =>
  `<tr>${celdas.map((celda) => `<td>${celda}</td>`).join("")}</tr>`

const exito = (resultado: Result.Result<ExtraccionHtml, { _tag: string }>) => {
  if (Result.isFailure(resultado)) {
    throw new Error(`fallo de tabla inesperado: ${resultado.failure._tag}`)
  }
  return resultado.success
}

const fallo = (resultado: Result.Result<ExtraccionHtml, { _tag: string }>) =>
  Result.isFailure(resultado) ? resultado.failure._tag : "sin fallo"

const etiquetas = (extraccion: ExtraccionHtml) =>
  extraccion.excepciones.map((excepcion) => excepcion._tag)

describe("localizador de tabla", () => {
  const dos = html(
    tabla(fila("0,00", "9,50%"), "Escala A"),
    tabla(fila("0,00", "9,50%"), "Escala B")
  )

  it("«única tabla» falla si hay cero o más de una", () => {
    expect(fallo(extraerEscala(escala(), html()))).toBe("TablaNoLocalizada")
    expect(fallo(extraerEscala(escala(), dos))).toBe("TablaAmbigua")
  })

  it("el caption localiza por literal exacto normalizado", () => {
    const porCaption = (literal: string) =>
      escala({
        documento: {
          sha256: SHA_HTML,
          localizador: { _tag: "Caption", literal },
        },
      })
    expect(
      exito(extraerEscala(porCaption("Escala B"), dos)).valores
    ).toHaveLength(2)
    expect(fallo(extraerEscala(porCaption("Escala"), dos))).toBe(
      "TablaNoLocalizada"
    )
    const repetido = html(
      tabla(fila("0,00", "9,50%"), "Escala&nbsp;A"),
      tabla(fila("0,00", "9,50%"), "Escala A ")
    )
    expect(fallo(extraerEscala(porCaption("Escala A"), repetido))).toBe(
      "TablaAmbigua"
    )
  })

  it("la cabecera debe ser exactamente la declarada", () => {
    const otra = html(
      tabla(
        fila("0,00", "9,50%"),
        "",
        "<tr><th>Base liquidable (euros)</th><th>Tipo aplicable (%)</th></tr>"
      )
    )
    expect(fallo(extraerEscala(escala(), otra))).toBe("CabeceraNoLocalizada")
    const sobrante = html(
      tabla(
        fila("0,00", "9,50%"),
        "",
        "<tr><th>Base liquidable hasta (euros)</th><th>Tipo aplicable (%)</th><th>Nota</th></tr>"
      )
    )
    expect(fallo(extraerEscala(escala(), sobrante))).toBe(
      "CabeceraNoLocalizada"
    )
  })

  it("las celdas combinadas no se admiten", () => {
    const combinada = html(tabla('<tr><td colspan="2">0,00</td></tr>'))
    expect(fallo(extraerEscala(escala(), combinada))).toBe(
      "EstructuraNoAdmitida"
    )
  })
})

describe("extracción de una escala", () => {
  it("una tabla vale para todos sus territorios declarados", () => {
    const extraccion = exito(
      extraerEscala(escala(), html(tabla(fila("12.450,00", "12,00%"))))
    )
    expect(extraccion.excepciones).toEqual([])
    expect(
      extraccion.valores.map((v) => v.claves.map((c) => c.territorio))
    ).toEqual([
      ["ceuta", "melilla"],
      ["ceuta", "melilla"],
    ])
    expect(extraccion.valores[1]?.valor).toEqual({
      _tag: "Numero",
      decimal: "12",
    })
  })

  it("una fila anterior a la cabecera no es de datos ni desplaza los tramos", () => {
    const extraccion = exito(
      extraerEscala(
        escala(),
        html(
          tabla(
            fila("0,00", "9,50%"),
            "",
            `${fila("2025", "Ceuta")}<tr><th>Base liquidable hasta (euros)</th><th>Tipo aplicable (%)</th></tr>`
          )
        )
      )
    )
    expect(extraccion.excepciones).toMatchObject([
      { _tag: "FilaNoDeclarada", literal: "2025 | Ceuta" },
    ])
    expect(extraccion.valores.map((v) => v.claves[0]?.fila)).toEqual([0, 0])
  })

  it("cada defecto de celda es un error con tipo y nunca se rellena", () => {
    const extraccion = exito(
      extraerEscala(
        escala(),
        html(
          tabla(
            [
              fila("", "9,50%"),
              fila("<p>1,00</p><p>2,00</p>", "12,00"),
              fila("20.200,00"),
            ].join("")
          )
        )
      )
    )
    expect(etiquetas(extraccion)).toEqual([
      "CeldaAusente",
      "CeldaAmbigua",
      "LiteralFueraDeGramatica",
      "FilaIrregular",
    ])
    expect(extraccion.valores.map((v) => v.literal)).toEqual(["9,50%"])
  })

  it("una especificación sin la evidencia de unidad en la cabecera no se decodifica", () => {
    expect(() =>
      escala({
        columnas: [
          { ...columnaBase, evidenciaUnidad: "euros anuales" },
          columnaTipo,
        ],
      })
    ).toThrow()
  })

  it("una especificación con una página del testigo repetida no se decodifica", () => {
    expect(() =>
      escala({ testigo: { sha256: SHA_PDF, paginas: [1, 1] } })
    ).toThrow()
  })
})

const cuadro = (
  celdas: ReadonlyArray<unknown>,
  filas?: ReadonlyArray<unknown>
) =>
  Schema.decodeUnknownSync(EspecificacionCuadro)({
    tipo: "cuadro",
    tabla: "prueba-cuadro",
    magnitud: "minimos-personales-familiares",
    territorios: ["estatal", "aragon", "madrid"],
    documento: {
      sha256: SHA_HTML,
      localizador: { _tag: "UnicaTablaDelDocumento" },
    },
    cabeceraDeFilas: "Importes",
    columnas: ["Mínimo por contribuyente"],
    filas: filas ?? [
      { cabecera: "Estatal", territorio: "estatal" },
      { cabecera: "C.A. de Aragón", territorio: "aragon" },
    ],
    celdas,
    testigo: { sha256: SHA_PDF, paginas: [1] },
  })

const general = {
  plantilla: "{importe} euros anuales, en general.",
  unidad: "EUR",
  evidenciaUnidad: "euros",
  gramatica: { decimales: [0], centinelas: [] },
  claves: [{ fila: "contribuyente", columna: "general" }],
}
const mayor65 = {
  plantilla: "+ {importe} euros anuales, mayor de 65 años.",
  unidad: "EUR",
  evidenciaUnidad: "euros",
  gramatica: { decimales: [0], centinelas: [] },
  claves: [{ fila: "contribuyente", columna: "adicionalMayor65" }],
}

const cuadroHtml = (...filas: ReadonlyArray<string>) =>
  html(
    `<table><tbody><tr><th><span><strong>Importes</strong></span></th><th>Mínimo por&nbsp;contribuyente</th></tr>${filas.join("")}</tbody></table>`
  )
const filaCuadro = (cabecera: string, celda: string) =>
  `<tr><th><span>${cabecera}</span></th><td>${celda}</td></tr>`

describe("extracción de un cuadro de partidas", () => {
  const estatal = filaCuadro(
    "Estatal",
    "<p>5.550&nbsp;euros anuales, en general.</p><p>+ 1.150 euros anuales,&nbsp;mayor de 65 años.</p><p>(*) Nota estatal.</p>"
  )

  it("lee partidas, notas y remisiones resueltas contra la celda remitida", () => {
    const extraccion = exito(
      extraerCuadro(
        cuadro([
          {
            fila: "Estatal",
            columna: "Mínimo por contribuyente",
            partidas: [general, mayor65],
            remisiones: [],
            notas: ["(*) Nota estatal."],
          },
          {
            fila: "C.A. de Aragón",
            columna: "Mínimo por contribuyente",
            partidas: [],
            remisiones: [
              { literal: "igual que los mínimos estatales.", fila: "Estatal" },
            ],
            notas: [],
          },
        ]),
        cuadroHtml(
          estatal,
          filaCuadro(
            "C.A. de Aragón",
            "<p>igual que los mínimos estatales.</p>"
          )
        )
      )
    )
    expect(extraccion.excepciones).toEqual([])
    expect(extraccion.notas.map((n) => n.literal)).toEqual([
      "(*) Nota estatal.",
    ])
    expect(
      extraccion.valores.map((v) => [
        v.claves[0]?.territorio,
        v.claves[0]?.columna,
        v.valor,
        v.origen._tag,
      ])
    ).toEqual([
      ["estatal", "general", { _tag: "Numero", decimal: "5550" }, "Directo"],
      [
        "estatal",
        "adicionalMayor65",
        { _tag: "Numero", decimal: "1150" },
        "Directo",
      ],
      ["aragon", "general", { _tag: "Numero", decimal: "5550" }, "Remision"],
      [
        "aragon",
        "adicionalMayor65",
        { _tag: "Numero", decimal: "1150" },
        "Remision",
      ],
    ])
  })

  it("una partida sin clave de motor se extrae con su literal de testigo", () => {
    const fallecimiento = {
      ...general,
      plantilla: "(*) En caso de fallecimiento {importe} euros.",
      claves: [],
    }
    const extraccion = exito(
      extraerCuadro(
        cuadro([
          {
            fila: "Estatal",
            columna: "Mínimo por contribuyente",
            partidas: [general, fallecimiento],
            remisiones: [],
            notas: [],
          },
          {
            fila: "C.A. de Aragón",
            columna: "Mínimo por contribuyente",
            partidas: [],
            remisiones: [
              { literal: "igual que los mínimos estatales.", fila: "Estatal" },
            ],
            notas: [],
          },
        ]),
        cuadroHtml(
          filaCuadro(
            "Estatal",
            "<p>5.550 euros anuales, en general.</p><p>(*) En caso de fallecimiento 2.400 euros.</p>"
          ),
          filaCuadro(
            "C.A. de Aragón",
            "<p>igual que los mínimos estatales.</p>"
          )
        )
      )
    )
    expect(extraccion.excepciones).toEqual([])
    expect(
      extraccion.valores.map((v) => [
        v.valor,
        v.claves.length,
        v.origen._tag,
        v.literalTestigo,
      ])
    ).toEqual([
      [{ _tag: "Numero", decimal: "5550" }, 1, "Directo", "5.550"],
      [{ _tag: "Numero", decimal: "2400" }, 0, "Directo", "2.400"],
      [{ _tag: "Numero", decimal: "5550" }, 1, "Remision", null],
      [{ _tag: "Numero", decimal: "2400" }, 0, "Remision", null],
    ])
  })

  it("una plantilla ha de tener exactamente un hueco y la evidencia de unidad fuera de él", () => {
    const celda = (plantilla: string) => [
      {
        fila: "Estatal",
        columna: "Mínimo por contribuyente",
        partidas: [{ ...general, plantilla }],
        remisiones: [],
        notas: [],
      },
    ]
    expect(() => cuadro(celda("{importe} y {importe} euros"))).toThrow()
    expect(() => cuadro(celda("5.550 euros anuales"))).toThrow()
    expect(() => cuadro(celda("{importe} anuales"))).toThrow()
    // La evidencia «euros» no puede formarse uniendo los dos lados del hueco.
    expect(() => cuadro(celda("eu{importe}ros anuales"))).toThrow()
  })

  it("fila no declarada, partida ambigua, contenido no declarado y partida o fila ausente son errores", () => {
    const solapada = {
      ...general,
      plantilla: "{importe}euros anuales, en general.",
      claves: [{ fila: "contribuyente", columna: "adicionalMayor75" }],
    }
    const mayor75 = {
      ...mayor65,
      plantilla: "+ {importe} euros anuales, mayor de 75 años.",
    }
    const extraccion = exito(
      extraerCuadro(
        cuadro([
          {
            fila: "Estatal",
            columna: "Mínimo por contribuyente",
            partidas: [general, solapada, mayor75],
            remisiones: [],
            notas: [],
          },
        ]),
        cuadroHtml(estatal, filaCuadro("C.A. de Murcia", "<p>igual.</p>"))
      )
    )
    expect(etiquetas(extraccion)).toEqual([
      "FilaNoDeclarada",
      "CeldaAmbigua",
      "ContenidoNoDeclarado",
      "ContenidoNoDeclarado",
      "CeldaAusente",
      "CeldaAusente",
    ])
    expect(extraccion.valores).toEqual([])
  })

  it("una partida que encaja en dos elementos es ambigua", () => {
    const extraccion = exito(
      extraerCuadro(
        cuadro(
          [
            {
              fila: "Estatal",
              columna: "Mínimo por contribuyente",
              partidas: [general],
              remisiones: [],
              notas: [],
            },
          ],
          [{ cabecera: "Estatal", territorio: "estatal" }]
        ),
        cuadroHtml(
          filaCuadro(
            "Estatal",
            "<ul><li>5.550 euros anuales, en general.</li><li>6.105 euros anuales, en general.</li></ul>"
          )
        )
      )
    )
    expect(etiquetas(extraccion)).toEqual(["CeldaAmbigua"])
    expect(extraccion.valores).toEqual([])
  })
})

describe("testigo en el PDF", () => {
  const extraccion = exito(
    extraerEscala(
      escala(),
      html(tabla([fila("0,00", "9,50%"), fila("0,00", "12,00%")].join("")))
    )
  )
  const pagina = (...textos: ReadonlyArray<string>) => [
    {
      pagina: 1,
      elementos: textos.map((texto, indice) => ({ texto, x: indice, y: 0 })),
    },
  ]

  it("n celdas con el mismo literal piden n apariciones; si faltan, ninguna tiene testigo", () => {
    const testigos = (paginas: ReturnType<typeof pagina>) =>
      (
        asignarTestigos([
          {
            tabla: "prueba",
            sha256: SHA_PDF,
            paginas,
            valores: extraccion.valores,
          },
        ]).get("prueba") ?? []
      ).map((v) => v.testigo._tag)
    expect(testigos(pagina("0,00", "0,00", "9,50%", "12,00%"))).toEqual([
      "ConTestigo",
      "ConTestigo",
      "ConTestigo",
      "ConTestigo",
    ])
    expect(testigos(pagina("0,00", "19,50%", "12,00%"))).toEqual([
      "SinTestigo",
      "SinTestigo",
      "SinTestigo",
      "ConTestigo",
    ])
  })
})
