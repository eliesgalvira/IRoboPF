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
  unidad: { _tag: "EUR", evidencia: "(euros)" },
  gramatica: { decimales: [2], centinelas: [] },
}
const columnaResto = {
  cabecera: "Resto base liquidable hasta (euros)",
  columna: "resto-base-liquidable",
  unidad: { _tag: "EUR", evidencia: "(euros)" },
  gramatica: {
    decimales: [2],
    centinelas: [{ literal: "En adelante", centinela: "sin-limite" }],
  },
}
const columnaTipo = {
  cabecera: "Tipo aplicable (%)",
  columna: "tipo-aplicable",
  unidad: { _tag: "porcentaje", evidencia: "(%)" },
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
    columnas: [columnaBase, columnaResto, columnaTipo],
    testigo: { sha256: SHA_PDF, paginas: [1] },
    ...cambios,
  })

const CABECERA =
  "<tr><th>Base liquidable hasta (euros)</th><th>Resto base liquidable hasta (euros)</th><th>Tipo aplicable (%)</th></tr>"

const tabla = (filas: string, caption = "", cabecera = CABECERA, pie = "") =>
  `<table>${caption === "" ? "" : `<caption>${caption}</caption>`}<thead>${cabecera}</thead><tbody>${filas}</tbody>${pie}</table>`

const html = (...tablas: ReadonlyArray<string>) =>
  `<!doctype html><html><body>${tablas.join("")}</body></html>`

const fila = (...celdas: ReadonlyArray<string>) =>
  `<tr>${celdas.map((celda) => `<td>${celda}</td>`).join("")}</tr>`

// Escala de un solo tramo, abierto, con el tipo dado.
const unTramo = (tipo: string) => fila("0,00", "En adelante", tipo)

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
    tabla(unTramo("9,50%"), "Escala A"),
    tabla(unTramo("9,50%"), "Escala B")
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
    ).toHaveLength(3)
    expect(fallo(extraerEscala(porCaption("Escala"), dos))).toBe(
      "TablaNoLocalizada"
    )
    const repetido = html(
      tabla(unTramo("9,50%"), "Escala&nbsp;A"),
      tabla(unTramo("9,50%"), "Escala A ")
    )
    expect(fallo(extraerEscala(porCaption("Escala A"), repetido))).toBe(
      "TablaAmbigua"
    )
  })

  it("la cabecera debe ser exactamente la declarada", () => {
    const otra = html(
      tabla(
        unTramo("9,50%"),
        "",
        "<tr><th>Base liquidable (euros)</th><th>Resto base liquidable hasta (euros)</th><th>Tipo aplicable (%)</th></tr>"
      )
    )
    expect(fallo(extraerEscala(escala(), otra))).toBe("CabeceraNoLocalizada")
    const sobrante = html(
      tabla(
        unTramo("9,50%"),
        "",
        CABECERA.replace("</tr>", "<th>Nota</th></tr>")
      )
    )
    expect(fallo(extraerEscala(escala(), sobrante))).toBe(
      "CabeceraNoLocalizada"
    )
  })

  it("un espacio Unicode o un carácter de control en una celda es un error, también en los extremos", () => {
    for (const celda of [
      " 9,50%",
      "9,50% ",
      "9, 50%",
      "​9,50%",
      "9,50%\u0007",
    ]) {
      expect(fallo(extraerEscala(escala(), html(tabla(unTramo(celda)))))).toBe(
        "EstructuraNoAdmitida"
      )
    }
  })

  it("un literal de la especificación con un espacio Unicode no se decodifica", () => {
    expect(() =>
      escala({
        columnas: [
          { ...columnaBase, cabecera: "Base liquidable hasta (euros)" },
          columnaResto,
          columnaTipo,
        ],
      })
    ).toThrow()
  })

  it.each([
    unTramo("<span hidden>1</span>9,50%"),
    unTramo('<span style="display:none">1</span>9,50%'),
    unTramo('<span aria-hidden="true">1</span>9,50%'),
    unTramo('<span class="d-none">1</span>9,50%'),
    unTramo("<b>9,50%</b>"),
    unTramo("<sup>9,50%</sup>"),
    unTramo('<p class="letrita" title="x">9,50%</p>'),
    "<tr><td>0,00</td><td>En adelante</td><td hidden>9,50%</td></tr>",
    '<tr><td>0,00</td><td>En adelante</td><td class="sr-only">9,50%</td></tr>',
    "<tr hidden><td>0,00</td><td>En adelante</td><td>9,50%</td></tr>",
  ])("fuera de la lista cerrada de elementos y atributos: %s", (filaHtml) => {
    expect(fallo(extraerEscala(escala(), html(tabla(filaHtml))))).toBe(
      "EstructuraNoAdmitida"
    )
  })

  it("la lista cerrada cubre los elementos y atributos de las páginas reales", () => {
    const real =
      '<tr><td letrita2="" class="texto_der">0,00</td><td class="&quot;texto_der texto_der revsar">En adelante</td><td class="texto_cen"><p class="letrita sangrado-izq"><span class="letrita"><strong>9,50%</strong></span></p></td></tr>'
    expect(fallo(extraerEscala(escala(), html(tabla(real))))).toBe("sin fallo")
  })

  it("las celdas combinadas no se admiten", () => {
    const combinada = html(
      tabla('<tr><td colspan="2">0,00</td><td>9,50%</td></tr>')
    )
    expect(fallo(extraerEscala(escala(), combinada))).toBe(
      "EstructuraNoAdmitida"
    )
  })
})

describe("extracción de una escala", () => {
  it("una tabla vale para todos sus territorios declarados", () => {
    const extraccion = exito(
      extraerEscala(escala(), html(tabla(unTramo("12,00%"))))
    )
    expect(extraccion.excepciones).toEqual([])
    expect(
      extraccion.valores.map((v) => v.claves.map((c) => c.territorio))
    ).toEqual([
      ["ceuta", "melilla"],
      ["ceuta", "melilla"],
      ["ceuta", "melilla"],
    ])
    expect(extraccion.valores[2]?.valor).toEqual({
      _tag: "Numero",
      decimal: "12",
    })
  })

  it("una fila anterior a la cabecera no es de datos ni desplaza los tramos", () => {
    const extraccion = exito(
      extraerEscala(
        escala(),
        html(
          tabla(unTramo("9,50%"), "", `${fila("2025", "Ceuta", "")}${CABECERA}`)
        )
      )
    )
    expect(extraccion.excepciones).toMatchObject([
      { _tag: "FilaNoDeclarada", literal: "2025 | Ceuta | " },
    ])
    expect(extraccion.valores.map((v) => v.claves[0]?.fila)).toEqual([0, 0, 0])
  })

  it("cada defecto de celda es un error con tipo y nunca se rellena", () => {
    const extraccion = exito(
      extraerEscala(
        escala(),
        html(
          tabla(
            [
              fila("", "12.450,00", "9,50%"),
              fila("<p>1,00</p><p>2,00</p>", "1,00", "12,00"),
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
    expect(extraccion.valores.map((v) => v.literal)).toEqual([
      "12.450,00",
      "9,50%",
      "1,00",
    ])
  })

  it("una especificación sin la evidencia de unidad en la cabecera no se decodifica", () => {
    expect(() =>
      escala({
        columnas: [
          { ...columnaBase, cabecera: "Base liquidable hasta" },
          columnaResto,
          columnaTipo,
        ],
      })
    ).toThrow()
  })

  it.each([
    ["porcentaje", "(euros)"],
    ["EUR", "liquidable"],
    ["EUR", "Base"],
  ])(
    "una columna en %s con evidencia «%s» no se decodifica",
    (unidad, evidenciaUnidad) => {
      expect(() =>
        escala({
          columnas: [
            {
              ...columnaBase,
              unidad: { _tag: unidad, evidencia: evidenciaUnidad },
            },
            columnaResto,
            columnaTipo,
          ],
        })
      ).toThrow()
    }
  )

  it("una escala sin columna de base o de resto no se decodifica", () => {
    expect(() => escala({ columnas: [columnaBase, columnaTipo] })).toThrow()
    expect(() => escala({ columnas: [columnaResto, columnaTipo] })).toThrow()
  })

  it("una especificación con una página del testigo repetida no se decodifica", () => {
    expect(() =>
      escala({ testigo: { sha256: SHA_PDF, paginas: [1, 1] } })
    ).toThrow()
  })

  it("una escala con la magnitud del cuadro de mínimos no se decodifica", () => {
    expect(() =>
      escala({ magnitud: "minimos-personales-familiares" })
    ).toThrow()
  })
})

describe("tramos de una escala", () => {
  const extraer = (filas: ReadonlyArray<ReadonlyArray<string>>, pie = "") =>
    exito(
      extraerEscala(
        escala(),
        html(
          tabla(
            filas.map((celdas) => fila(...celdas)).join(""),
            "",
            CABECERA,
            pie
          )
        )
      )
    )

  it("una tabla coherente no tiene excepciones", () => {
    expect(
      etiquetas(
        extraer([
          ["0,00", "12.450,00", "9,50%"],
          ["12.450,00", "En adelante", "12,00%"],
        ])
      )
    ).toEqual([])
  })

  it("una fila de <tfoot> no es un tramo", () => {
    const extraccion = extraer(
      [
        ["0,00", "12.450,00", "9,50%"],
        ["12.450,00", "En adelante", "12,00%"],
      ],
      `<tfoot>${fila("99,00", "1,00", "1,00%")}</tfoot>`
    )
    expect(etiquetas(extraccion)).toEqual(["FilaNoDeclarada"])
    expect(
      Math.max(...extraccion.valores.map((v) => Number(v.claves[0]?.fila)))
    ).toBe(1)
  })

  it.each([
    [
      "la primera base no es 0",
      [
        ["1,00", "12.449,00", "9,50%"],
        ["12.450,00", "En adelante", "12,00%"],
      ],
    ],
    [
      "una base no es la anterior más su resto",
      [
        ["0,00", "12.450,00", "9,50%"],
        ["12.451,00", "En adelante", "12,00%"],
      ],
    ],
    [
      "las bases no crecen",
      [
        ["0,00", "0,00", "9,50%"],
        ["0,00", "En adelante", "12,00%"],
      ],
    ],
    [
      "un tramo abierto que no es el último",
      [
        ["0,00", "En adelante", "9,50%"],
        ["12.450,00", "En adelante", "12,00%"],
      ],
    ],
    [
      "el último tramo no es abierto",
      [
        ["0,00", "12.450,00", "9,50%"],
        ["12.450,00", "20.000,00", "12,00%"],
      ],
    ],
  ])("%s es una excepción de la tabla", (_, filas) => {
    expect(etiquetas(extraer(filas))).toContain("EscalaIncoherente")
  })
})

const ESTATAL = [{ cabecera: "Estatal", territorio: "estatal" }]

const cuadro = (
  celdas: ReadonlyArray<unknown>,
  filas: ReadonlyArray<unknown> = [
    ...ESTATAL,
    { cabecera: "C.A. de Aragón", territorio: "aragon" },
  ]
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
    filas,
    celdas,
    testigo: { sha256: SHA_PDF, paginas: [1] },
  })

const partida = (
  plantilla: string,
  claves: ReadonlyArray<unknown>,
  cambios: Record<string, unknown> = {}
) => ({
  _tag: "Partida",
  plantilla,
  unidad: { _tag: "EUR", evidencia: "euros" },
  gramatica: { decimales: [0], centinelas: [] },
  claves,
  alcance: { _tag: "CabeceraDeColumna" },
  ...cambios,
})
const general = partida("{importe} euros anuales, en general.", [
  { fila: "contribuyente", columna: "general" },
])
const mayor65 = partida("+ {importe} euros anuales, mayor de 65 años.", [
  { fila: "contribuyente", columna: "adicionalMayor65" },
])
const nota = (literal: string, id?: string) =>
  id === undefined ? { _tag: "Nota", literal } : { _tag: "Nota", id, literal }
const remite = {
  _tag: "Remision",
  literal: "igual que los mínimos estatales.",
  fila: "Estatal",
}
const celda = (fila: string, ...bloques: ReadonlyArray<unknown>) => ({
  fila,
  columna: "Mínimo por contribuyente",
  bloques,
})

const cuadroHtml = (...filas: ReadonlyArray<string>) =>
  html(
    `<table><tbody><tr><th><span><strong>Importes</strong></span></th><th>Mínimo por&nbsp;contribuyente</th></tr>${filas.join("")}</tbody></table>`
  )
const filaCuadro = (cabecera: string, contenido: string) =>
  `<tr><th><span>${cabecera}</span></th><td>${contenido}</td></tr>`
const aragonRemite = filaCuadro(
  "C.A. de Aragón",
  "<p>igual que los mínimos estatales.</p>"
)

describe("extracción de un cuadro de partidas", () => {
  const estatal = filaCuadro(
    "Estatal",
    "<p>5.550&nbsp;euros anuales, en general.</p><p>+ 1.150 euros anuales,&nbsp;mayor de 65 años.</p><p>(*) Nota estatal.</p>"
  )

  it("lee partidas, notas y remisiones resueltas contra la celda remitida", () => {
    const extraccion = exito(
      extraerCuadro(
        cuadro([
          celda("Estatal", general, mayor65, nota("(*) Nota estatal.")),
          celda("C.A. de Aragón", remite),
        ]),
        cuadroHtml(estatal, aragonRemite)
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
        v.alcance,
      ])
    ).toEqual(
      [
        ["estatal", "general", "5550", "Directo"],
        ["estatal", "adicionalMayor65", "1150", "Directo"],
        ["aragon", "general", "5550", "Remision"],
        ["aragon", "adicionalMayor65", "1150", "Remision"],
      ].map(([territorio, columna, decimal, origen]) => [
        territorio,
        columna,
        { _tag: "Numero", decimal },
        origen,
        { _tag: "CabeceraDeColumna", literal: "Mínimo por contribuyente" },
      ])
    )
  })

  it("una partida sin clave de motor se extrae con su literal de testigo", () => {
    const fallecimiento = partida(
      "(*) En caso de fallecimiento {importe} euros.",
      []
    )
    const extraccion = exito(
      extraerCuadro(
        cuadro([
          celda("Estatal", general, fallecimiento),
          celda("C.A. de Aragón", remite),
        ]),
        cuadroHtml(
          filaCuadro(
            "Estatal",
            "<p>5.550 euros anuales, en general.</p><p>(*) En caso de fallecimiento 2.400 euros.</p>"
          ),
          aragonRemite
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

  it("una partida en porcentaje con la evidencia «euros» no se decodifica", () => {
    expect(() =>
      cuadro(
        [
          celda("Estatal", {
            ...general,
            unidad: { _tag: "porcentaje", evidencia: "euros" },
          }),
        ],
        ESTATAL
      )
    ).toThrow()
  })

  it("una partida con una columna que no es de su fila no se decodifica", () => {
    expect(() =>
      cuadro(
        [
          celda("Estatal", {
            ...general,
            claves: [{ fila: "contribuyente", columna: "primero" }],
          }),
        ],
        ESTATAL
      )
    ).toThrow()
  })

  it("una plantilla ha de tener exactamente un hueco y la evidencia de unidad fuera de él", () => {
    const con = (plantilla: string) =>
      cuadro([celda("Estatal", { ...general, plantilla })], ESTATAL)
    expect(() => con("{importe} euros anuales, en general.")).not.toThrow()
    expect(() => con("{importe} y {importe} euros")).toThrow()
    expect(() => con("5.550 euros anuales")).toThrow()
    expect(() => con("{importe} anuales")).toThrow()
    // La evidencia «euros» no puede formarse uniendo los dos lados del hueco.
    expect(() => con("eu{importe}ros anuales")).toThrow()
  })

  it("cada celda de la tabla ha de estar declarada", () => {
    expect(() => cuadro([celda("Estatal", general)])).toThrow()
  })

  it("el alcance de una partida apunta a una nota anterior de la misma celda", () => {
    const desde = (id: string) =>
      partida("{importe} euros anuales, en general.", [], {
        alcance: { _tag: "NotaAnterior", nota: id },
      })
    expect(() =>
      cuadro(
        [celda("Estatal", nota("Para todos:", "todos"), desde("todos"))],
        ESTATAL
      )
    ).not.toThrow()
    expect(() =>
      cuadro(
        [celda("Estatal", desde("todos"), nota("Para todos:", "todos"))],
        ESTATAL
      )
    ).toThrow()
    expect(() => cuadro([celda("Estatal", desde("todos"))], ESTATAL)).toThrow()
    expect(() =>
      cuadro([celda("Estatal", nota("Para todos:"), desde("todos"))], ESTATAL)
    ).toThrow()
  })

  it("fila no declarada, celda que no es la secuencia declarada y fila ausente son errores", () => {
    const mayor75 = partida("+ {importe} euros anuales, mayor de 75 años.", [
      { fila: "contribuyente", columna: "adicionalMayor75" },
    ])
    const extraccion = exito(
      extraerCuadro(
        cuadro([
          celda("Estatal", general, mayor75, nota("(*) Nota estatal.")),
          celda("C.A. de Aragón", remite),
        ]),
        cuadroHtml(estatal, filaCuadro("C.A. de Murcia", "<p>igual.</p>"))
      )
    )
    expect(etiquetas(extraccion)).toEqual([
      "FilaNoDeclarada",
      "CeldaNoCoincide",
      "CeldaAusente",
    ])
    expect(extraccion.excepciones[1]).toMatchObject({
      declarados: [
        "{importe} euros anuales, en general.",
        "+ {importe} euros anuales, mayor de 75 años.",
        "(*) Nota estatal.",
      ],
      encontrados: [
        "5.550 euros anuales, en general.",
        "+ 1.150 euros anuales, mayor de 65 años.",
        "(*) Nota estatal.",
      ],
    })
    expect(extraccion.valores).toEqual([])
  })

  it("una celda con más bloques que los declarados no coincide", () => {
    const extraccion = exito(
      extraerCuadro(
        cuadro([celda("Estatal", general)], ESTATAL),
        cuadroHtml(
          filaCuadro(
            "Estatal",
            "<ul><li>5.550 euros anuales, en general.</li><li>6.105 euros anuales, en general.</li></ul>"
          )
        )
      )
    )
    expect(etiquetas(extraccion)).toEqual(["CeldaNoCoincide"])
    expect(extraccion.valores).toEqual([])
  })
})

describe("secuencia de bloques de una celda del cuadro", () => {
  const soloDescendientes = "Solo para el caso del mínimo por descendientes:"
  const grado33 = partida(
    "{importe} euros anuales, por discapacidad = o > al 33%.",
    [{ fila: "discapacidad-descendientes", columna: "grado33Hasta65" }],
    { alcance: { _tag: "NotaAnterior", nota: "solo-descendientes" } }
  )
  const leer = (contenido: string) =>
    exito(
      extraerCuadro(
        cuadro(
          [
            celda(
              "Estatal",
              nota(soloDescendientes, "solo-descendientes"),
              grado33
            ),
          ],
          ESTATAL
        ),
        cuadroHtml(filaCuadro("Estatal", contenido))
      )
    )

  it("la frase que da el alcance precede al importe y queda como su evidencia", () => {
    const enOrden = leer(
      `<p>${soloDescendientes}</p><p>3.300 euros anuales, por discapacidad = o &gt; al 33%.</p>`
    )
    expect(enOrden.excepciones).toEqual([])
    expect(enOrden.valores.map((v) => v.alcance)).toMatchObject([
      { _tag: "NotaAnterior", literal: soloDescendientes },
    ])
  })

  it("mover la frase del alcance detrás del importe es una excepción y no da valores", () => {
    const movida = leer(
      `<p>3.300 euros anuales, por discapacidad = o &gt; al 33%.</p><p>${soloDescendientes}</p>`
    )
    expect(etiquetas(movida)).toEqual(["CeldaNoCoincide"])
    expect(movida.valores).toEqual([])
  })

  it("cada bloque se compara con la declaración de su posición, sin búsqueda entre plantillas", () => {
    const adicional = partida("+ {importe} euros anuales.", [
      { fila: "contribuyente", columna: "adicionalMayor65" },
    ])
    const sinSigno = partida("{importe} euros anuales.", [
      { fila: "contribuyente", columna: "general" },
    ])
    const extraccion = exito(
      extraerCuadro(
        cuadro([celda("Estatal", adicional, sinSigno)], ESTATAL),
        cuadroHtml(
          filaCuadro(
            "Estatal",
            "<p>+ 1.150 euros anuales.</p><p>5.550 euros anuales.</p>"
          )
        )
      )
    )
    expect(extraccion.excepciones).toEqual([])
    expect(extraccion.valores.map((v) => v.valor)).toEqual([
      { _tag: "Numero", decimal: "1150" },
      { _tag: "Numero", decimal: "5550" },
    ])
  })

  it("dos partidas en otro orden que el declarado son una excepción", () => {
    const extraccion = exito(
      extraerCuadro(
        cuadro([celda("Estatal", general, mayor65)], ESTATAL),
        cuadroHtml(
          filaCuadro(
            "Estatal",
            "<p>+ 1.150 euros anuales, mayor de 65 años.</p><p>5.550 euros anuales, en general.</p>"
          )
        )
      )
    )
    expect(etiquetas(extraccion)).toEqual(["CeldaNoCoincide"])
    expect(extraccion.valores).toEqual([])
  })
})

describe("remisión a los mínimos estatales", () => {
  const estatalDeclarada = celda("Estatal", general, mayor65)

  it("no puede apuntar a una fila que no sea la estatal", () => {
    expect(() =>
      cuadro(
        [
          estatalDeclarada,
          celda("C.A. de Aragón", { ...remite, fila: "C.A. de Madrid" }),
          celda("C.A. de Madrid", general, mayor65),
        ],
        [
          ...ESTATAL,
          { cabecera: "C.A. de Aragón", territorio: "aragon" },
          { cabecera: "C.A. de Madrid", territorio: "madrid" },
        ]
      )
    ).toThrow()
  })

  it.each([
    [
      "falta una partida estatal",
      "<p>+ 1.150 euros anuales, mayor de 65 años.</p>",
    ],
    [
      "una partida estatal está fuera de la gramática",
      "<p>5.550,5 euros anuales, en general.</p><p>+ 1.150 euros anuales, mayor de 65 años.</p>",
    ],
  ])(
    "si %s, la remitente recibe una excepción y no copia nada",
    (_, estatal) => {
      const extraccion = exito(
        extraerCuadro(
          cuadro([estatalDeclarada, celda("C.A. de Aragón", remite)]),
          cuadroHtml(filaCuadro("Estatal", estatal), aragonRemite)
        )
      )
      expect(
        extraccion.valores.filter((v) =>
          v.claves.some((c) => c.territorio === "aragon")
        )
      ).toEqual([])
      expect(
        extraccion.excepciones.some(
          (e) => "fila" in e && e.fila === "C.A. de Aragón"
        )
      ).toBe(true)
    }
  )
})

describe("testigo en el PDF", () => {
  const extraccion = exito(
    extraerEscala(
      escala(),
      html(tabla([unTramo("9,50%"), unTramo("12,00%")].join("")))
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
    expect(
      testigos(
        pagina("0,00", "0,00", "En adelante", "En adelante", "9,50%", "12,00%")
      )
    ).toEqual(Array.from({ length: 6 }, () => "ConTestigo"))
    expect(
      testigos(pagina("0,00", "En adelante", "En adelante", "19,50%", "12,00%"))
    ).toEqual([
      "SinTestigo",
      "ConTestigo",
      "SinTestigo",
      "SinTestigo",
      "ConTestigo",
      "ConTestigo",
    ])
  })
})
