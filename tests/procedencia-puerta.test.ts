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

  it("un ámbito aceptado ha de tener exactamente sus claves en su estado", () => {
    const lista = aceptadas.map((aceptada) =>
      aceptada._tag === "Ambito" && aceptada.territorio === "aragon"
        ? { ...aceptada, claves: 18 }
        : aceptada
    )
    expect(fallo(puerta(sellado(), motor, lista))?.yaNoOcurren).toEqual([
      "ámbito aragon|minimos-personales-familiares: 18 claves ausente-en-manual: ahora 19 claves, 19 en ese estado",
    ])
  })

  it("una excepción de extracción sólo pasa si está aceptada tal cual", () => {
    const sinValencia = aceptadas.filter(
      (aceptada) => aceptada._tag !== "ExcepcionDeExtraccion"
    )
    expect(fallo(puerta(sellado(), motor, sinValencia))?.sinAceptar).toEqual([
      "clave comunitat-valenciana|escala-general-autonomica|10|tipo-aplicable (excepcion-de-extraccion)",
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
    const [primera] = aceptadas.filter((a) => a._tag === "Clave")
    expect(
      fallo(
        puerta(sellado(), motor, [...aceptadas, ...(primera ? [primera] : [])])
      )?.yaNoOcurren
    ).toEqual([expect.stringContaining("aceptada más de una vez")])
  })

  it("una clave coincidente no se puede declarar aceptada", () => {
    expect(() =>
      Schema.decodeUnknownSync(ExcepcionesAceptadasDesdeJson)(
        JSON.stringify({
          aceptadas: [
            {
              _tag: "Clave",
              clave: {
                territorio: "andalucia",
                magnitud: "escala-general-autonomica",
                fila: 0,
                columna: "base-liquidable",
              },
              estado: "coincidente",
              manual: [],
              motor: null,
              motivo: "prueba",
            },
          ],
        })
      )
    ).toThrow()
  })
})
