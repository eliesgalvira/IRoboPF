// La prueba de determinismo lee la extracción sellada del repositorio.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readdirSync, readFileSync } from "node:fs"

import { describe, expect, it } from "@effect/vitest"
import { Effect, Result, Schema } from "effect"

import { cotejar } from "../lib/procedencia/cotejo"
import { ComposicionesDesdeJson } from "../lib/procedencia/especificacion"
import {
  CeldaAmbigua,
  EscalaIncoherente,
  LiteralFueraDeGramatica,
  TablaNoLocalizada,
} from "../lib/procedencia/excepciones"
import { proyectarMotor2025 } from "../lib/procedencia/motor-2025"
import { RUTAS, textoCotejo } from "../lib/procedencia/programa"
import {
  ExtraccionTablaDesdeJson,
  type ExtraccionTabla,
  type ValorMotor,
} from "../lib/procedencia/resultado"
import {
  Clave,
  type ClaveEscala,
  type ColumnaEscala,
} from "../lib/procedencia/vocabulario"

const clave = (fila: number, columna: ColumnaEscala): ClaveEscala => ({
  territorio: "andalucia",
  magnitud: "escala-general-autonomica",
  fila,
  columna,
})

const ubicacion = { fila: "0", columna: "c", linea: 1, columnaFuente: 1 }

const manual = (
  claveManual: Clave,
  decimal: string,
  extra: Partial<ExtraccionTabla["valores"][number]> = {}
): ExtraccionTabla["valores"][number] => ({
  ubicacion,
  literal: decimal,
  unidad: "EUR",
  valor: { _tag: "Numero", decimal },
  claves: [claveManual],
  alcance: { _tag: "CabeceraDeColumna", literal: "c" },
  origen: { _tag: "Directo" },
  testigo: {
    _tag: "MismoLiteral",
    celda: { pagina: 1, tabla: 0, fila: 1, columna: 0, paginas: [1] },
  },
  ...extra,
})

const motor = (
  claveMotor: Clave,
  decimal: string,
  origen: ValorMotor["origen"] = "derivado"
): ValorMotor => ({
  clave: claveMotor,
  unidad: "EUR",
  valor: { _tag: "Numero", decimal },
  origen,
  regla: "prueba",
})

const extraccion = (valores: ExtraccionTabla["valores"]): ExtraccionTabla => ({
  tabla: "prueba",
  especificacion: "c".repeat(64),
  tipo: "escala",
  magnitud: "escala-general-autonomica",
  territorios: ["andalucia"],
  documento: {
    sha256: "a".repeat(64),
    tablaLocalizada: { linea: 1, columnaFuente: 1, caption: null },
  },
  testigoPdf: { sha256: "b".repeat(64), paginas: [1] },
  valores,
  notas: [],
  excepciones: [],
})

const cotejarBien = (...argumentos: Parameters<typeof cotejar>) =>
  Result.getOrThrow(cotejar(...argumentos))

describe("cotejo por clave", () => {
  it("clasifica la unión de claves y cuenta lo derivado aparte", () => {
    const resultado = cotejarBien(
      [
        extraccion([
          manual(clave(0, "base-liquidable"), "1235"),
          manual(clave(0, "cuota-integra"), "1235.01"),
          manual(clave(0, "resto-base-liquidable"), "1751.36"),
          manual(clave(0, "tipo-aplicable"), "7"),
        ]),
      ],
      [
        motor(clave(0, "base-liquidable"), "1235"),
        motor(clave(0, "cuota-integra"), "1235", "almacenado"),
        motor(clave(0, "resto-base-liquidable"), "1751.364"),
        motor(clave(1, "base-liquidable"), "9"),
        motor({ ...clave(0, "base-liquidable"), territorio: "aragon" }, "1"),
      ]
    )
    expect(
      resultado.entradas.map((e) => [
        e.clave.territorio,
        e.clave.fila,
        e.clave.columna,
        e.estado,
      ])
    ).toEqual([
      ["andalucia", 0, "base-liquidable", "coincidente"],
      ["andalucia", 0, "cuota-integra", "distinta"],
      ["andalucia", 0, "resto-base-liquidable", "distinta"],
      ["andalucia", 0, "tipo-aplicable", "sin-homologo-en-motor"],
      ["andalucia", 1, "base-liquidable", "ausente-en-manual"],
      ["aragon", 0, "base-liquidable", "fuera-de-alcance"],
    ])
    expect(resultado.excepciones.cotejo.map((e) => e._tag)).toEqual([
      "ValorDistinto",
      "ValorDistinto",
      "SinHomologoEnMotor",
      "AusenteEnManual",
    ])
    expect(resultado.excepciones.cotejo[1]).toMatchObject({
      _tag: "ValorDistinto",
      manual: { _tag: "Numero", decimal: "1751.36" },
      motor: { _tag: "Numero", decimal: "1751.364" },
      origenMotor: "derivado",
    })
    const [contadores] = resultado.resumen.porTabla
    expect(contadores?.contadores).toMatchObject({
      claves: 5,
      coincidentes: 1,
      coincidentesDerivadas: 1,
      distintas: 2,
      distintasDerivadas: 1,
      ausentesEnManual: 1,
      sinHomologoEnMotor: 1,
    })
  })

  it("ordena las filas de una escala por su índice", () => {
    const resultado = cotejarBien(
      [
        extraccion(
          [10, 2, 1].map((fila) => manual(clave(fila, "base-liquidable"), "1"))
        ),
      ],
      [10, 2, 1].map((fila) => motor(clave(fila, "base-liquidable"), "1"))
    )
    expect(resultado.entradas.map((e) => e.clave.fila)).toEqual([1, 2, 10])
  })

  it("un valor sin clave de motor no entra en el cotejo y se cuenta aparte", () => {
    const resultado = cotejarBien(
      [
        extraccion([
          manual(clave(0, "base-liquidable"), "1"),
          manual(clave(0, "base-liquidable"), "2400", { claves: [] }),
        ]),
      ],
      [motor(clave(0, "base-liquidable"), "1")]
    )
    expect(resultado.entradas.map((e) => e.estado)).toEqual(["coincidente"])
    expect(resultado.excepciones.cotejo).toEqual([])
    expect(resultado.resumen.porTabla[0]?.contadores).toMatchObject({
      valoresExtraidos: 2,
      testigoMismoLiteral: 2,
      sinClaveDeMotor: 1,
      claves: 1,
      coincidentes: 1,
      sinHomologoEnMotor: 0,
    })
    expect(resultado.resumen.sinClaveDeMotor).toEqual([
      {
        tabla: "prueba",
        ubicacion,
        literal: "2400",
        unidad: "EUR",
        valor: { _tag: "Numero", decimal: "2400" },
        origen: { _tag: "Directo" },
        testigo: "MismoLiteral",
      },
    ])
  })

  it("una clave con dos valores del manual es ambigua", () => {
    const resultado = cotejarBien(
      [
        extraccion([
          manual(clave(0, "base-liquidable"), "1"),
          manual(clave(0, "base-liquidable"), "1"),
        ]),
      ],
      [motor(clave(0, "base-liquidable"), "1")]
    )
    expect(resultado.entradas.map((e) => e.estado)).toEqual(["ambigua"])
    expect(resultado.excepciones.cotejo.map((e) => e._tag)).toEqual([
      "ClaveDuplicada",
    ])
  })

  it("el fallo de una tabla sin localizar alcanza a las claves de su ámbito", () => {
    const fallida: ExtraccionTabla = {
      ...extraccion([]),
      documento: { sha256: "a".repeat(64), tablaLocalizada: null },
      excepciones: [
        new TablaNoLocalizada({
          tabla: "prueba",
          localizador: "única tabla del documento",
          encontradas: 0,
        }),
      ],
    }
    const resultado = cotejarBien(
      [fallida],
      [motor(clave(0, "base-liquidable"), "1")]
    )
    expect(
      resultado.entradas.map((e) => [e.estado, e.excepcionesDeExtraccion])
    ).toEqual([["excepcion-de-extraccion", ["TablaNoLocalizada"]]])
    expect(resultado.excepciones.cotejo).toEqual([])
  })
})

describe("identidad y coincidencia", () => {
  const k = clave(0, "base-liquidable")

  it("una clave repetida en el motor es un error, no gana la última", () => {
    const resultado = cotejar(
      [extraccion([manual(k, "2")])],
      [motor(k, "1"), motor(k, "2")]
    )
    expect(Result.isFailure(resultado) && resultado.failure).toMatchObject({
      _tag: "ClaveRepetidaEnMotor",
      clave: k,
    })
  })

  it.each([
    [
      new LiteralFueraDeGramatica({
        tabla: "prueba",
        ubicacion,
        literal: "1,0.",
        motivo: "prueba",
        claves: [k],
      }),
      "excepcion-de-extraccion",
    ],
    [
      new CeldaAmbigua({
        tabla: "prueba",
        fila: "0",
        columna: "c",
        buscado: "prueba",
        coincidencias: [ubicacion],
        claves: [k],
      }),
      "ambigua",
    ],
  ])(
    "un valor igual al del motor no es coincidente si la clave tiene una excepción de extracción (%o)",
    (excepcion, estado) => {
      const resultado = cotejarBien(
        [{ ...extraccion([manual(k, "1")]), excepciones: [excepcion] }],
        [motor(k, "1")]
      )
      expect(resultado.entradas.map((e) => e.estado)).toEqual([estado])
    }
  )
})

describe("extracción sellada", () => {
  it.effect(
    "regenerar el cotejo desde lo sellado y el motor da los bytes de git",
    () =>
      Effect.gen(function* () {
        const extracciones = yield* Effect.forEach(
          readdirSync(RUTAS.extraccion)
            .filter((archivo) => archivo.endsWith(".json"))
            .sort(),
          (archivo) =>
            Schema.decodeUnknownEffect(ExtraccionTablaDesdeJson)(
              readFileSync(`${RUTAS.extraccion}/${archivo}`, "utf8")
            )
        )
        const { composiciones } = yield* Schema.decodeUnknownEffect(
          ComposicionesDesdeJson
        )(readFileSync(RUTAS.composiciones, "utf8"))
        const { entradas } = cotejarBien(
          extracciones,
          yield* proyectarMotor2025(),
          composiciones
        )
        expect(yield* textoCotejo(entradas)).toBe(
          readFileSync(RUTAS.cotejo, "utf8")
        )
      })
  )
})

describe("claves discriminadas por magnitud", () => {
  const decodificar = Schema.decodeUnknownSync(Clave)
  const escala = {
    territorio: "andalucia",
    magnitud: "escala-general-autonomica",
  }
  const minimos = {
    territorio: "andalucia",
    magnitud: "minimos-personales-familiares",
  }

  it("decodifica una clave de escala y una de mínimos bien formadas", () => {
    expect(() =>
      decodificar({ ...escala, fila: 3, columna: "tipo-aplicable" })
    ).not.toThrow()
    expect(() =>
      decodificar({ ...minimos, fila: "descendientes", columna: "primero" })
    ).not.toThrow()
  })

  it.each([
    { ...escala, fila: 3, columna: "columna-libre" },
    { ...escala, fila: 3, columna: "general" },
    { ...escala, fila: "contribuyente", columna: "base-liquidable" },
    { ...minimos, fila: 0, columna: "general" },
    { ...minimos, fila: "contribuyente", columna: "base-liquidable" },
    { ...minimos, fila: "contribuyente", columna: "primero" },
    { ...minimos, fila: "ascendientes", columna: "adicionalMayor65" },
    { ...minimos, fila: "discapacidad-ascendientes", columna: "general" },
  ])("rechaza la clave mal formada %o", (clave) => {
    expect(() => decodificar(clave)).toThrow()
  })
})

describe("lo sellado no puede representar un testigo vacío", () => {
  const madrid = () =>
    JSON.parse(
      readFileSync(
        `${RUTAS.extraccion}/escala-general-autonomica-madrid.json`,
        "utf8"
      )
    ) as { valores: Array<{ testigo: Record<string, unknown> }> }
  const decodificar = (sellado: unknown) =>
    Schema.decodeUnknownSync(ExtraccionTablaDesdeJson)(
      JSON.stringify(sellado),
      {
        onExcessProperty: "error",
      }
    )

  it("decodifica la extracción sellada tal cual", () => {
    expect(() => decodificar(madrid())).not.toThrow()
  })

  it.each([
    { _tag: "MismoLiteral" },
    {
      _tag: "MismoLiteral",
      celda: { pagina: 1128, tabla: 0, fila: 1, columna: 0, paginas: [] },
    },
    { _tag: "MismoValorOtroLiteral", literalPdf: "0" },
    { _tag: "MismoLiteral", literal: "0", apariciones: [] },
    { _tag: "SinTestigo" },
  ])(
    "un valor con testigo pero sin la referencia a su celda no se decodifica (%o)",
    (testigo) => {
      const sellado = madrid()
      const [primero] = sellado.valores
      if (primero !== undefined) {
        primero.testigo = testigo
      }
      expect(() => decodificar(sellado)).toThrow()
    }
  )
})

describe("escala agregada del ahorro", () => {
  const ahorro = (
    tabla: "escala-ahorro-estatal" | "escala-ahorro-autonomica",
    territorio: "estatal" | "andalucia",
    filas: ReadonlyArray<readonly [string, string, string | null, string]>
  ): ExtraccionTabla => ({
    ...extraccion(
      filas.flatMap(([base, cuota, resto, tipo], fila) =>
        (
          [
            ["base-liquidable", base],
            ["cuota-integra", cuota],
            ["resto-base-liquidable", resto],
            ["tipo-aplicable", tipo],
          ] as const
        ).map(([columna, decimal]) =>
          manual(
            { territorio, magnitud: tabla, fila, columna },
            decimal ?? "0",
            decimal === null
              ? {
                  literal: "En adelante",
                  valor: { _tag: "Centinela", centinela: "sin-limite" },
                }
              : {}
          )
        )
      )
    ),
    tabla,
    magnitud: tabla,
    territorios: [territorio],
  })
  const agregada = (fila: number, columna: ColumnaEscala) =>
    ({
      territorio: "estatal",
      magnitud: "escala-ahorro-agregada",
      fila,
      columna,
    }) as const
  const motorAgregado = [
    motor(agregada(0, "base-liquidable"), "0"),
    motor(agregada(0, "cuota-integra"), "0"),
    motor(agregada(0, "resto-base-liquidable"), "6000"),
    motor(agregada(0, "tipo-aplicable"), "19", "almacenado"),
    motor(agregada(1, "base-liquidable"), "6000", "almacenado"),
    motor(agregada(1, "cuota-integra"), "1140"),
    {
      ...motor(agregada(1, "resto-base-liquidable"), "0"),
      valor: { _tag: "Centinela", centinela: "sin-limite" },
    } satisfies ValorMotor,
    motor(agregada(1, "tipo-aplicable"), "21", "almacenado"),
  ]
  const composicion = {
    resultado: { territorio: "estatal", magnitud: "escala-ahorro-agregada" },
    sumandos: ["escala-ahorro-estatal", "escala-ahorro-autonomica"],
  } as const

  it("se coteja con la suma, tramo a tramo, de las dos mitades publicadas", () => {
    const mitad = [
      ["0", "0", "6000", "9.5"],
      ["6000", "570", null, "10.5"],
    ] as const
    const resultado = Result.getOrThrow(
      cotejar(
        [
          ahorro("escala-ahorro-estatal", "estatal", mitad),
          ahorro("escala-ahorro-autonomica", "andalucia", mitad),
        ],
        motorAgregado,
        [composicion]
      )
    )
    const agregadas = resultado.entradas.filter(
      (e) => e.clave.magnitud === "escala-ahorro-agregada"
    )
    expect(agregadas.map((e) => e.estado)).toEqual(
      Array.from({ length: 8 }, () => "coincidente")
    )
    expect(agregadas[5]?.manual).toMatchObject([
      {
        _tag: "DerivadoDelManual",
        valor: { _tag: "Numero", decimal: "1140" },
        fuentes: [
          { tabla: "escala-ahorro-estatal" },
          { tabla: "escala-ahorro-autonomica" },
        ],
      },
    ])
  })

  it("no suma dos mitades cuyos tramos no encadenan igual", () => {
    const resultado = Result.getOrThrow(
      cotejar(
        [
          ahorro("escala-ahorro-estatal", "estatal", [
            ["0", "0", "6000", "9.5"],
            ["6000", "570", null, "10.5"],
          ]),
          ahorro("escala-ahorro-autonomica", "andalucia", [
            ["0", "0", "7000", "9.5"],
            ["7000", "665", null, "10.5"],
          ]),
        ],
        motorAgregado,
        [composicion]
      )
    )
    const agregadas = resultado.entradas.filter(
      (e) => e.clave.magnitud === "escala-ahorro-agregada"
    )
    expect(agregadas.every((e) => e.manual.length === 0)).toBe(true)
    expect(agregadas.map((e) => e.excepcionesDeExtraccion)).toEqual(
      Array.from({ length: 8 }, () => ["ComposicionNoResuelta"])
    )
  })

  it("no suma una mitad que tiene excepciones de extracción", () => {
    const mitad = [
      ["0", "0", "6000", "9.5"],
      ["6000", "570", null, "10.5"],
    ] as const
    const estatal = ahorro("escala-ahorro-estatal", "estatal", mitad)
    const resultado = Result.getOrThrow(
      cotejar(
        [
          {
            ...estatal,
            excepciones: [
              new EscalaIncoherente({
                tabla: "escala-ahorro-estatal",
                tramo: 1,
                motivo: "prueba",
                claves: [],
              }),
            ],
          },
          ahorro("escala-ahorro-autonomica", "andalucia", mitad),
        ],
        motorAgregado,
        [composicion]
      )
    )
    const agregadas = resultado.entradas.filter(
      (e) => e.clave.magnitud === "escala-ahorro-agregada"
    )
    expect(agregadas.map((e) => e.estado)).toEqual(
      Array.from({ length: 8 }, () => "excepcion-de-extraccion")
    )
  })
})
