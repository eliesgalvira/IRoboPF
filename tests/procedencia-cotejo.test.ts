// La prueba de determinismo lee la extracción sellada del repositorio.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readdirSync, readFileSync } from "node:fs"

import { describe, expect, it } from "@effect/vitest"
import { Effect, Result, Schema } from "effect"

import { cotejar } from "../lib/procedencia/cotejo"
import {
  CeldaAmbigua,
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
  origen: { _tag: "Directo" },
  testigo: { _tag: "ConTestigo", literal: decimal, apariciones: [] },
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
      conTestigo: 2,
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
        testigo: "ConTestigo",
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
        const { entradas } = cotejarBien(extracciones, proyectarMotor2025())
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
