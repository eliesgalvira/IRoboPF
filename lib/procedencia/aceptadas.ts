import { Result, Schema } from "effect"

import type { Cotejo } from "./cotejo"
import {
  ComposicionNoResuelta,
  DiferenciasNoAceptadas,
  ExcepcionExtraccion,
  Ubicacion,
} from "./excepciones"
import {
  EstadoCotejo,
  MotivoSinTestigo,
  type EntradaCotejo,
  type ExtraccionTabla,
} from "./resultado"
import { Clave, textoClave, Valor } from "./vocabulario"

const Motivo = Schema.NonEmptyString

const EstadoNoCoincidente = EstadoCotejo.pipe(
  Schema.check(
    Schema.makeFilter((estado: string) =>
      estado === "coincidente"
        ? "una clave coincidente no se acepta: no es una diferencia"
        : undefined
    )
  )
)

// Cada entrada nombra exactamente lo que acepta, con lo que se espera de ello.
export const Aceptada = Schema.Union([
  // Claves, cada una con los valores de los dos lados tal cual, todas en
  // `estado`.
  Schema.TaggedStruct("Claves", {
    estado: EstadoNoCoincidente,
    claves: Schema.NonEmptyArray(
      Schema.Struct({
        clave: Clave,
        manual: Schema.Array(Valor),
        motor: Schema.NullOr(Valor),
      })
    ),
    motivo: Motivo,
  }),
  // Una excepción de extracción exacta; sus claves se aceptan aparte.
  Schema.TaggedStruct("ExcepcionDeExtraccion", {
    tabla: Schema.String,
    excepcion: ExcepcionExtraccion,
    motivo: Motivo,
  }),
  Schema.TaggedStruct("ComposicionNoResuelta", {
    excepcion: ComposicionNoResuelta,
    motivo: Motivo,
  }),
  // Un valor extraído sin testigo en el PDF, con su motivo exacto.
  Schema.TaggedStruct("ValorSinTestigo", {
    tabla: Schema.String,
    ubicacion: Ubicacion,
    sinTestigo: MotivoSinTestigo,
    motivo: Motivo,
  }),
])
export type Aceptada = typeof Aceptada.Type

export const ExcepcionesAceptadasDesdeJson = Schema.fromJsonString(
  Schema.Struct({ aceptadas: Schema.Array(Aceptada) })
)

const huella =
  <A, I>(schema: Schema.Codec<A, I>) =>
  (valor: A): string =>
    JSON.stringify(Schema.encodeSync(schema)(valor))
const huellaExcepcion = huella(ExcepcionExtraccion)
const huellaComposicion = huella(ComposicionNoResuelta)
const huellaLados = huella(
  Schema.Struct({ manual: Schema.Array(Valor), motor: Schema.NullOr(Valor) })
)
const huellaUbicacion = huella(Ubicacion)
const huellaSinTestigo = huella(MotivoSinTestigo)

const ladosDe = (entrada: EntradaCotejo) =>
  huellaLados({
    manual: entrada.manual.map((m) => m.valor),
    motor: entrada.motor?.valor ?? null,
  })

const sinTestigoDe = (
  tabla: string,
  ubicacion: Ubicacion,
  motivo: MotivoSinTestigo
) => `${tabla}\u0000${huellaUbicacion(ubicacion)}\u0000${huellaSinTestigo(motivo)}`

// Ninguna diferencia pasa sin estar aceptada, con exactamente ese estado y
// esos valores, y ninguna aceptación sobrevive a lo que aceptaba: si ya no
// ocurre, también es un error.
export const comprobarAceptadas = (
  cotejo: Cotejo,
  extracciones: ReadonlyArray<ExtraccionTabla>,
  aceptadas: ReadonlyArray<Aceptada>
): Result.Result<void, DiferenciasNoAceptadas> => {
  const porClave = new Map(
    cotejo.entradas.map((entrada) => [textoClave(entrada.clave), entrada])
  )
  const claves = new Set<string>()
  const excepciones = new Set<string>()
  const composiciones = new Set<string>()
  const sinTestigo = new Set<string>()
  const yaNoOcurren: Array<string> = []
  const aceptar = (conjunto: Set<string>, id: string, descripcion: string) => {
    if (conjunto.has(id)) {
      yaNoOcurren.push(`${descripcion}: aceptada más de una vez`)
    }
    conjunto.add(id)
  }

  for (const aceptada of aceptadas) {
    switch (aceptada._tag) {
      case "Claves":
        for (const { clave, ...lados } of aceptada.claves) {
          const texto = textoClave(clave)
          const descripcion = `clave ${texto} (${aceptada.estado})`
          const entrada = porClave.get(texto)
          if (
            entrada === undefined ||
            entrada.estado !== aceptada.estado ||
            ladosDe(entrada) !== huellaLados(lados)
          ) {
            yaNoOcurren.push(
              `${descripcion}: ahora ${entrada === undefined ? "no está en el cotejo" : `${entrada.estado}, ${ladosDe(entrada)}`}`
            )
          }
          aceptar(claves, texto, descripcion)
        }
        break
      case "ExcepcionDeExtraccion": {
        const id = `${aceptada.tabla}\u0000${huellaExcepcion(aceptada.excepcion)}`
        const descripcion = `excepción ${aceptada.excepcion._tag} de ${aceptada.tabla}`
        if (
          !cotejo.excepciones.extraccion.some(
            ({ tabla, excepcion }) =>
              `${tabla}\u0000${huellaExcepcion(excepcion)}` === id
          )
        ) {
          yaNoOcurren.push(`${descripcion}: ya no ocurre así`)
        }
        aceptar(excepciones, id, descripcion)
        break
      }
      case "ComposicionNoResuelta": {
        const id = huellaComposicion(aceptada.excepcion)
        const descripcion = `composición no resuelta de ${aceptada.excepcion.resultado}`
        if (
          !cotejo.excepciones.composicion.some(
            (excepcion) => huellaComposicion(excepcion) === id
          )
        ) {
          yaNoOcurren.push(`${descripcion}: ya no ocurre así`)
        }
        aceptar(composiciones, id, descripcion)
        break
      }
      case "ValorSinTestigo": {
        const id = sinTestigoDe(
          aceptada.tabla,
          aceptada.ubicacion,
          aceptada.sinTestigo
        )
        const descripcion = `valor sin testigo de ${aceptada.tabla} en ${aceptada.ubicacion.fila} / ${aceptada.ubicacion.columna}`
        if (
          !extracciones.some((extraccion) =>
            extraccion.valores.some(
              (valor) =>
                valor.testigo._tag === "SinTestigo" &&
                sinTestigoDe(
                  extraccion.tabla,
                  valor.ubicacion,
                  valor.testigo.motivo
                ) === id
            )
          )
        ) {
          yaNoOcurren.push(`${descripcion}: ya no ocurre así`)
        }
        aceptar(sinTestigo, id, descripcion)
        break
      }
    }
  }

  const sinAceptar = [
    ...cotejo.entradas
      .filter(
        (entrada) =>
          entrada.estado !== "coincidente" &&
          !claves.has(textoClave(entrada.clave))
      )
      .map(
        (entrada) => `clave ${textoClave(entrada.clave)} (${entrada.estado})`
      ),
    ...cotejo.excepciones.extraccion
      .filter(
        ({ tabla, excepcion }) =>
          !excepciones.has(`${tabla}\u0000${huellaExcepcion(excepcion)}`)
      )
      .map(({ tabla, excepcion }) => `excepción ${excepcion._tag} de ${tabla}`),
    ...cotejo.excepciones.composicion
      .filter((excepcion) => !composiciones.has(huellaComposicion(excepcion)))
      .map((excepcion) => `composición no resuelta de ${excepcion.resultado}`),
    ...extracciones.flatMap((extraccion) =>
      extraccion.valores.flatMap((valor) =>
        valor.testigo._tag === "SinTestigo" &&
        !sinTestigo.has(
          sinTestigoDe(extraccion.tabla, valor.ubicacion, valor.testigo.motivo)
        )
          ? [
              `valor sin testigo de ${extraccion.tabla} en ${valor.ubicacion.fila} / ${valor.ubicacion.columna} (${valor.testigo.motivo._tag})`,
            ]
          : []
      )
    ),
  ]
  return sinAceptar.length === 0 && yaNoOcurren.length === 0
    ? Result.void
    : Result.fail(new DiferenciasNoAceptadas({ sinAceptar, yaNoOcurren }))
}
