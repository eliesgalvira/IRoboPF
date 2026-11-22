// La puerta se prueba sobre lo sellado del repositorio y el motor.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readdirSync, readFileSync } from "node:fs"

import { describe, expect, it } from "@effect/vitest"
import { Result, Schema } from "effect"

import {
  comprobarAceptadas,
  ExcepcionesAceptadasDesdeJson,
  type Aceptada,
} from "../lib/procedencia/aceptadas"
import { cotejar } from "../lib/procedencia/cotejo"
import { ComposicionesDesdeJson } from "../lib/procedencia/especificacion"
import { proyectarMotor2025 } from "../lib/procedencia/motor-2025"
import { RUTAS } from "../lib/procedencia/programa"
import {
  ExtraccionTablaDesdeJson,
  type ExtraccionTabla,
  type ValorMotor,
} from "../lib/procedencia/resultado"
import { textoClave } from "../lib/procedencia/vocabulario"

const sellado = (): ReadonlyArray<ExtraccionTabla> =>
  readdirSync(RUTAS.extraccion)
    .filter((archivo) => archivo.endsWith(".json"))
    .sort()
    .map((archivo) =>
      Schema.decodeUnknownSync(ExtraccionTablaDesdeJson)(
        readFileSync(`${RUTAS.extraccion}/${archivo}`, "utf8")
      )
    )
const { composiciones } = Schema.decodeUnknownSync(ComposicionesDesdeJson)(
  readFileSync(RUTAS.composiciones, "utf8")
)
const { aceptadas } = Schema.decodeUnknownSync(ExcepcionesAceptadasDesdeJson)(
  readFileSync(RUTAS.aceptadas, "utf8")
)
const motor = Result.getOrThrow(proyectarMotor2025())

const puerta = (
  extracciones: ReadonlyArray<ExtraccionTabla> = sellado(),
  valoresMotor: ReadonlyArray<ValorMotor> = motor,
  lista: ReadonlyArray<Aceptada> = aceptadas
) =>
  comprobarAceptadas(
    Result.getOrThrow(cotejar(extracciones, valoresMotor, composiciones)),
    extracciones,
    lista
  )

const conValor = (texto: string, decimal: string) =>
  motor.map((valor) =>
    textoClave(valor.clave) === texto
      ? { ...valor, valor: { _tag: "Numero", decimal } as const }
      : valor
  )

const fallo = (resultado: ReturnType<typeof puerta>) =>
  Result.isFailure(resultado) ? resultado.failure : undefined

describe("puerta de las excepciones aceptadas", () => {
  it("lo sellado, el motor y la lista de aceptadas pasan", () => {
    expect(fallo(puerta())).toBeUndefined()
  })

  it("un tipo del motor cambiado crea una diferencia que nadie ha aceptado", () => {
    const clave = "asturias|escala-general-autonomica|7|tipo-aplicable"
    expect(fallo(puerta(sellado(), conValor(clave, "27")))).toMatchObject({
      _tag: "DiferenciasNoAceptadas",
      sinAceptar: [`clave ${clave} (distinta)`],
      yaNoOcurren: [],
    })
  })

  it("una diferencia aceptada con otros valores ya no está aceptada", () => {
    const clave = "aragon|escala-general-autonomica|1|cuota-integra"
    const resultado = fallo(puerta(sellado(), conValor(clave, "1241.89")))
    expect(resultado?.sinAceptar).toEqual([])
    expect(resultado?.yaNoOcurren).toEqual([
      expect.stringContaining(`clave ${clave} (distinta): ahora coincidente`),
    ])
  })

  it("una clave que no está en la lista no está aceptada", () => {
    const clave = "aragon|minimos-personales-familiares|contribuyente|general"
    const lista = aceptadas.flatMap((aceptada): ReadonlyArray<Aceptada> => {
      if (aceptada._tag !== "Claves") {
        return [aceptada]
      }
      const [primera, ...resto] = aceptada.claves.filter(
        (c) => textoClave(c.clave) !== clave
      )
      return primera === undefined
        ? []
        : [{ ...aceptada, claves: [primera, ...resto] }]
    })
    expect(fallo(puerta(sellado(), motor, lista))).toMatchObject({
      sinAceptar: [`clave ${clave} (ausente-en-manual)`],
      yaNoOcurren: [],
    })
  })

  it("un valor del motor cambiado en una clave ausente del manual ya no está aceptado", () => {
    const clave = "aragon|minimos-personales-familiares|contribuyente|general"
    expect(fallo(puerta(sellado(), conValor(clave, "6000")))).toMatchObject({
      sinAceptar: [],
      yaNoOcurren: [
        expect.stringContaining(`clave ${clave} (ausente-en-manual): ahora`),
      ],
    })
  })

  it("un valor del motor cambiado en la clave de una excepción de extracción ya no está aceptado", () => {
    const clave =
      "comunitat-valenciana|escala-general-autonomica|10|tipo-aplicable"
    expect(fallo(puerta(sellado(), conValor(clave, "30")))).toMatchObject({
      sinAceptar: [],
      yaNoOcurren: [
        expect.stringContaining(`clave ${clave} (excepcion-de-extraccion)`),
      ],
    })
  })

  it("una excepción de extracción sólo pasa si está aceptada tal cual", () => {
    const sinValencia = aceptadas.filter(
      (aceptada) => aceptada._tag !== "ExcepcionDeExtraccion"
    )
    expect(fallo(puerta(sellado(), motor, sinValencia))?.sinAceptar).toEqual([
      "excepción LiteralFueraDeGramatica de escala-general-autonomica-comunitat-valenciana",
    ])
  })

  it("un valor sin testigo en el PDF no pasa sin aceptarlo", () => {
    const extracciones = sellado().map((extraccion) =>
      extraccion.tabla === "escala-general-autonomica-madrid"
        ? {
            ...extraccion,
            valores: extraccion.valores.map((valor, indice) =>
              indice === 0
                ? {
                    ...valor,
                    testigo: {
                      _tag: "SinTestigo",
                      motivo: { _tag: "TablaPdfNoLocalizada", encontradas: 0 },
                    } as const,
                  }
                : valor
            ),
          }
        : extraccion
    )
    expect(fallo(puerta(extracciones))?.sinAceptar).toEqual([
      "valor sin testigo de escala-general-autonomica-madrid en 0 / Base liquidable hasta (euros) (TablaPdfNoLocalizada)",
    ])
  })

  it("una misma clave no se acepta dos veces", () => {
    const [primera] = aceptadas.filter(
      (a) => a._tag === "Claves" && a.claves.length === 1
    )
    expect(
      fallo(
        puerta(sellado(), motor, [
          ...aceptadas,
          ...(primera === undefined ? [] : [primera]),
        ])
      )?.yaNoOcurren
    ).toEqual([expect.stringContaining("aceptada más de una vez")])
  })

  it("una clave coincidente no se puede declarar aceptada", () => {
    expect(() =>
      Schema.decodeUnknownSync(ExcepcionesAceptadasDesdeJson)(
        JSON.stringify({
          aceptadas: [
            {
              _tag: "Claves",
              estado: "coincidente",
              claves: [
                {
                  clave: {
                    territorio: "andalucia",
                    magnitud: "escala-general-autonomica",
                    fila: 0,
                    columna: "base-liquidable",
                  },
                  manual: [],
                  motor: null,
                },
              ],
              motivo: "prueba",
            },
          ],
        })
      )
    ).toThrow("una clave coincidente no se acepta")
  })
})
