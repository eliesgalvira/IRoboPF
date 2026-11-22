// La prueba de determinismo lee la extracción sellada del repositorio.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readdirSync, readFileSync } from "node:fs"

import { describe, expect, it } from "@effect/vitest"
import { Effect, Schema } from "effect"

import { cotejar } from "../lib/procedencia/cotejo"
import { TablaNoLocalizada } from "../lib/procedencia/excepciones"
import { proyectarMotor2025 } from "../lib/procedencia/motor-2025"
import { RUTAS, textoCotejo } from "../lib/procedencia/programa"
import {
  ExtraccionTablaDesdeJson,
  type ExtraccionTabla,
  type ValorMotor,
} from "../lib/procedencia/resultado"
import { Clave } from "../lib/procedencia/vocabulario"

const clave = (fila: Clave["fila"], columna: string): Clave => ({
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

describe("cotejo por clave", () => {
  it("clasifica la unión de claves y cuenta lo derivado aparte", () => {
    const resultado = cotejar(
      [
        extraccion([
          manual(clave(0, "a"), "1235"),
          manual(clave(0, "b"), "1235.01"),
          manual(clave(0, "c"), "1751.36"),
          manual(clave(0, "d"), "7"),
        ]),
      ],
      [
        motor(clave(0, "a"), "1235"),
        motor(clave(0, "b"), "1235", "almacenado"),
        motor(clave(0, "c"), "1751.364"),
        motor(clave(0, "e"), "9"),
        motor({ ...clave(0, "a"), territorio: "aragon" }, "1"),
      ]
    )
    expect(
      resultado.entradas.map((e) => [
        e.clave.territorio,
        e.clave.columna,
        e.estado,
      ])
    ).toEqual([
      ["andalucia", "a", "coincidente"],
      ["andalucia", "b", "distinta"],
      ["andalucia", "c", "distinta"],
      ["andalucia", "d", "sin-homologo-en-motor"],
      ["andalucia", "e", "ausente-en-manual"],
      ["aragon", "a", "fuera-de-alcance"],
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
    const resultado = cotejar(
      [extraccion([10, 2, 1].map((fila) => manual(clave(fila, "a"), "1")))],
      [10, 2, 1].map((fila) => motor(clave(fila, "a"), "1"))
    )
    expect(resultado.entradas.map((e) => e.clave.fila)).toEqual([1, 2, 10])
  })

  it("un valor sin clave de motor no entra en el cotejo y se cuenta aparte", () => {
    const resultado = cotejar(
      [
        extraccion([
          manual(clave(0, "a"), "1"),
          manual(clave(0, "a"), "2400", { claves: [] }),
        ]),
      ],
      [motor(clave(0, "a"), "1")]
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
    const resultado = cotejar(
      [extraccion([manual(clave(0, "a"), "1"), manual(clave(0, "a"), "1")])],
      [motor(clave(0, "a"), "1")]
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
    const resultado = cotejar([fallida], [motor(clave(0, "a"), "1")])
    expect(
      resultado.entradas.map((e) => [e.estado, e.excepcionesDeExtraccion])
    ).toEqual([["excepcion-de-extraccion", ["TablaNoLocalizada"]]])
    expect(resultado.excepciones.cotejo).toEqual([])
  })
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
        const { entradas } = cotejar(extracciones, proyectarMotor2025())
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
