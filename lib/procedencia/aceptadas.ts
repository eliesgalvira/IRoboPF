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
import { Clave, Magnitud, Territorio, textoClave, Valor } from "./vocabulario"

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

// Cada entrada determina un conjunto cerrado de claves o de excepciones y lo
// que se espera de ellas; el motivo es el que consta, y donde falta la cita
// normativa se dice.
export const Aceptada = Schema.Union([
  // Una clave con su estado y los valores de los dos lados, tal cual.
  Schema.TaggedStruct("Clave", {
    clave: Clave,
    estado: EstadoNoCoincidente,
    manual: Schema.Array(Valor),
    motor: Schema.NullOr(Valor),
    motivo: Motivo,
  }),
  // Todas las claves del cotejo de una magnitud (y, si se da, de un
  // territorio): exactamente `claves`, todas en `estado`.
  Schema.TaggedStruct("Ambito", {
    magnitud: Magnitud,
    territorio: Schema.optionalKey(Territorio),
    estado: EstadoNoCoincidente,
    claves: Schema.Int.check(Schema.isGreaterThan(0)),
    motivo: Motivo,
  }),
  // Una excepción de extracción exacta; sus claves han de estar en
  // `estadoDeSusClaves`.
  Schema.TaggedStruct("ExcepcionDeExtraccion", {
    tabla: Schema.String,
    excepcion: ExcepcionExtraccion,
    estadoDeSusClaves: EstadoNoCoincidente,
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
const huellaValores = huella(Schema.Array(Valor))
const huellaMotor = huella(Schema.NullOr(Valor))
const huellaUbicacion = huella(Ubicacion)
const huellaSinTestigo = huella(MotivoSinTestigo)

const describir = (aceptada: Aceptada): string => {
  switch (aceptada._tag) {
    case "Clave":
      return `clave ${textoClave(aceptada.clave)} (${aceptada.estado})`
    case "Ambito":
      return `ámbito ${aceptada.territorio ?? "*"}|${aceptada.magnitud}: ${aceptada.claves} claves ${aceptada.estado}`
    case "ExcepcionDeExtraccion":
      return `excepción ${aceptada.excepcion._tag} de ${aceptada.tabla}`
    case "ComposicionNoResuelta":
      return `composición no resuelta de ${aceptada.excepcion.resultado}`
    case "ValorSinTestigo":
      return `valor sin testigo de ${aceptada.tabla} en ${aceptada.ubicacion.fila} / ${aceptada.ubicacion.columna}`
  }
}

const describirEntrada = (entrada: EntradaCotejo) =>
  `clave ${textoClave(entrada.clave)} (${entrada.estado})`

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
  const cubiertas = new Set<string>()
  const yaNoOcurren: Array<string> = []
  const repetidas: Array<string> = []
  const cubrir = (texto: string) => {
    if (cubiertas.has(texto)) {
      repetidas.push(`clave ${texto} aceptada más de una vez`)
    }
    cubiertas.add(texto)
  }
  const excepcionesAceptadas = new Set<string>()
  const composicionesAceptadas = new Set<string>()
  const sinTestigoAceptados = new Set<string>()
  const clavesEn = (
    claves: ReadonlyArray<Clave>,
    estado: EstadoCotejo,
    aceptada: Aceptada
  ) => {
    for (const clave of claves) {
      const entrada = porClave.get(textoClave(clave))
      if (entrada?.estado !== estado) {
        yaNoOcurren.push(
          `${describir(aceptada)}: la clave ${textoClave(clave)} está ${entrada?.estado ?? "fuera del cotejo"}`
        )
      }
      cubrir(textoClave(clave))
    }
  }

  for (const aceptada of aceptadas) {
    switch (aceptada._tag) {
      case "Clave": {
        const entrada = porClave.get(textoClave(aceptada.clave))
        if (
          entrada === undefined ||
          entrada.estado !== aceptada.estado ||
          huellaValores(entrada.manual.map((m) => m.valor)) !==
            huellaValores(aceptada.manual) ||
          huellaMotor(entrada.motor?.valor ?? null) !==
            huellaMotor(aceptada.motor)
        ) {
          yaNoOcurren.push(
            `${describir(aceptada)}: ahora ${entrada === undefined ? "no está en el cotejo" : `${entrada.estado}, manual ${huellaValores(entrada.manual.map((m) => m.valor))}, motor ${huellaMotor(entrada.motor?.valor ?? null)}`}`
          )
        }
        cubrir(textoClave(aceptada.clave))
        break
      }
      case "Ambito": {
        const delAmbito = cotejo.entradas.filter(
          (entrada) =>
            entrada.clave.magnitud === aceptada.magnitud &&
            (aceptada.territorio === undefined ||
              entrada.clave.territorio === aceptada.territorio)
        )
        const enEstado = delAmbito.filter((e) => e.estado === aceptada.estado)
        if (
          delAmbito.length !== aceptada.claves ||
          enEstado.length !== aceptada.claves
        ) {
          yaNoOcurren.push(
            `${describir(aceptada)}: ahora ${delAmbito.length} claves, ${enEstado.length} en ese estado`
          )
        }
        delAmbito.forEach((entrada) => cubrir(textoClave(entrada.clave)))
        break
      }
      case "ExcepcionDeExtraccion": {
        const buscada = huellaExcepcion(aceptada.excepcion)
        const ocurre = cotejo.excepciones.extraccion.some(
          ({ tabla, excepcion }) =>
            tabla === aceptada.tabla && huellaExcepcion(excepcion) === buscada
        )
        if (!ocurre) {
          yaNoOcurren.push(`${describir(aceptada)}: ya no ocurre así`)
        }
        excepcionesAceptadas.add(`${aceptada.tabla}\u0000${buscada}`)
        if ("claves" in aceptada.excepcion) {
          clavesEn(
            aceptada.excepcion.claves,
            aceptada.estadoDeSusClaves,
            aceptada
          )
        }
        break
      }
      case "ComposicionNoResuelta": {
        const buscada = huellaComposicion(aceptada.excepcion)
        if (
          !cotejo.excepciones.composicion.some(
            (excepcion) => huellaComposicion(excepcion) === buscada
          )
        ) {
          yaNoOcurren.push(`${describir(aceptada)}: ya no ocurre así`)
        }
        composicionesAceptadas.add(buscada)
        clavesEn(aceptada.excepcion.claves, "excepcion-de-extraccion", aceptada)
        break
      }
      case "ValorSinTestigo": {
        const buscado = `${aceptada.tabla}\u0000${huellaUbicacion(aceptada.ubicacion)}\u0000${huellaSinTestigo(aceptada.sinTestigo)}`
        const ocurre = extracciones.some(
          (extraccion) =>
            extraccion.tabla === aceptada.tabla &&
            extraccion.valores.some(
              (valor) =>
                valor.testigo._tag === "SinTestigo" &&
                `${extraccion.tabla}\u0000${huellaUbicacion(valor.ubicacion)}\u0000${huellaSinTestigo(valor.testigo.motivo)}` ===
                  buscado
            )
        )
        if (!ocurre) {
          yaNoOcurren.push(`${describir(aceptada)}: ya no ocurre así`)
        }
        sinTestigoAceptados.add(buscado)
        break
      }
    }
  }

  const sinAceptar = [
    ...cotejo.entradas
      .filter(
        (entrada) =>
          entrada.estado !== "coincidente" &&
          !cubiertas.has(textoClave(entrada.clave))
      )
      .map(describirEntrada),
    ...cotejo.excepciones.extraccion
      .filter(
        ({ tabla, excepcion }) =>
          !excepcionesAceptadas.has(
            `${tabla}\u0000${huellaExcepcion(excepcion)}`
          )
      )
      .map(({ tabla, excepcion }) => `excepción ${excepcion._tag} de ${tabla}`),
    ...cotejo.excepciones.composicion
      .filter(
        (excepcion) => !composicionesAceptadas.has(huellaComposicion(excepcion))
      )
      .map((excepcion) => `composición no resuelta de ${excepcion.resultado}`),
    ...extracciones.flatMap((extraccion) =>
      extraccion.valores.flatMap((valor) =>
        valor.testigo._tag === "SinTestigo" &&
        !sinTestigoAceptados.has(
          `${extraccion.tabla}\u0000${huellaUbicacion(valor.ubicacion)}\u0000${huellaSinTestigo(valor.testigo.motivo)}`
        )
          ? [
              `valor sin testigo de ${extraccion.tabla} en ${valor.ubicacion.fila} / ${valor.ubicacion.columna} (${valor.testigo.motivo._tag})`,
            ]
          : []
      )
    ),
  ]
  const errores = [...yaNoOcurren, ...repetidas]
  return sinAceptar.length === 0 && errores.length === 0
    ? Result.void
    : Result.fail(
        new DiferenciasNoAceptadas({ sinAceptar, yaNoOcurren: errores })
      )
}
