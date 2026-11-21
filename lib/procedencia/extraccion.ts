import { Result } from "effect"

import {
  HUECO_IMPORTE,
  type CeldaCuadro,
  type EspecificacionCuadro,
  type EspecificacionEscala,
  type LocalizadorTabla,
  type Partida,
} from "./especificacion"
import {
  CabeceraAmbigua,
  CabeceraNoLocalizada,
  CeldaAmbigua,
  CeldaAusente,
  ContenidoNoDeclarado,
  EstructuraNoAdmitida,
  FilaIrregular,
  FilaNoDeclarada,
  LiteralFueraDeGramatica,
  TablaAmbigua,
  TablaNoLocalizada,
  UnidadNoDeclarada,
  type ExcepcionExtraccion,
  type Ubicacion,
} from "./excepciones"
import {
  modeloDeTabla,
  tablasDelDocumento,
  type Bloque,
  type CeldaHtml,
  type FilaHtml,
  type TablaHtml,
} from "./html"
import { leerLiteral } from "./literales"
import type { Origen } from "./resultado"
import type { Clave, Territorio, Unidad, Valor } from "./vocabulario"

export interface ValorPendienteDeTestigo {
  readonly ubicacion: Ubicacion
  readonly literal: string
  readonly unidad: Unidad
  readonly valor: Valor
  readonly claves: ReadonlyArray<Clave>
  readonly origen: Origen
  // null cuando el valor procede de una remisión y no de un literal propio.
  readonly literalTestigo: string | null
}

export interface ExtraccionHtml {
  readonly tablaLocalizada: {
    readonly linea: number
    readonly columnaFuente: number
    readonly caption: string | null
  }
  readonly valores: ReadonlyArray<ValorPendienteDeTestigo>
  readonly notas: ReadonlyArray<{
    readonly ubicacion: Ubicacion
    readonly literal: string
  }>
  readonly excepciones: ReadonlyArray<ExcepcionExtraccion>
}

export type FalloDeTabla =
  | TablaNoLocalizada
  | TablaAmbigua
  | CabeceraNoLocalizada
  | CabeceraAmbigua
  | EstructuraNoAdmitida

const describirLocalizador = (localizador: LocalizadorTabla): string =>
  localizador._tag === "Caption"
    ? `caption «${localizador.literal}»`
    : "única tabla del documento"

const localizarTabla = (
  tabla: string,
  localizador: LocalizadorTabla,
  html: string
): Result.Result<TablaHtml, FalloDeTabla> => {
  const todas = tablasDelDocumento(html)
  const candidatas =
    localizador._tag === "Caption"
      ? todas.filter((candidata) => candidata.caption === localizador.literal)
      : todas
  const [unica, ...resto] = candidatas
  if (unica === undefined) {
    return Result.fail(
      new TablaNoLocalizada({
        tabla,
        localizador: describirLocalizador(localizador),
        encontradas: 0,
      })
    )
  }
  if (resto.length > 0) {
    return Result.fail(
      new TablaAmbigua({
        tabla,
        localizador: describirLocalizador(localizador),
        encontradas: candidatas.length,
      })
    )
  }
  return Result.mapError(
    modeloDeTabla(unica),
    (problema) => new EstructuraNoAdmitida({ tabla, ...problema })
  )
}

interface Cabecera {
  readonly fila: FilaHtml
  readonly posicionDe: ReadonlyMap<string, number>
}

// La fila de cabecera es la única cuyas celdas son, exactamente, las
// cabeceras declaradas; las demás filas de la tabla son filas de datos.
const localizarCabecera = (
  tabla: string,
  modelo: TablaHtml,
  declaradas: ReadonlyArray<string>
): Result.Result<
  { readonly cabecera: Cabecera; readonly datos: ReadonlyArray<FilaHtml> },
  FalloDeTabla
> => {
  const esperadas = new Set(declaradas)
  const candidatas = modelo.filas.filter(
    (fila) =>
      fila.celdas.length === esperadas.size &&
      new Set(fila.celdas.map((celda) => celda.texto)).size ===
        esperadas.size &&
      fila.celdas.every((celda) => esperadas.has(celda.texto))
  )
  const [unica, ...resto] = candidatas
  if (unica === undefined) {
    return Result.fail(
      new CabeceraNoLocalizada({
        tabla,
        cabecerasDeclaradas: declaradas,
        filasDeLaTabla: modelo.filas.map((fila) =>
          fila.celdas.map((celda) => celda.texto)
        ),
      })
    )
  }
  if (resto.length > 0) {
    return Result.fail(
      new CabeceraAmbigua({
        tabla,
        lineas: candidatas.map((fila) => fila.linea),
      })
    )
  }
  return Result.succeed({
    cabecera: {
      fila: unica,
      posicionDe: new Map(
        unica.celdas.map((celda, indice) => [celda.texto, indice])
      ),
    },
    datos: modelo.filas.filter((fila) => fila !== unica),
  })
}

const ubicacionDe = (
  fila: string,
  columna: string,
  lugar: { readonly linea: number; readonly columnaFuente: number }
): Ubicacion => ({
  fila,
  columna,
  linea: lugar.linea,
  columnaFuente: lugar.columnaFuente,
})

export const extraerEscala = (
  especificacion: EspecificacionEscala,
  html: string
): Result.Result<ExtraccionHtml, FalloDeTabla> => {
  const { tabla, magnitud, territorios } = especificacion
  const declaradas = especificacion.columnas.map((columna) => columna.cabecera)
  return Result.flatMap(
    localizarTabla(tabla, especificacion.documento.localizador, html),
    (modelo) =>
      Result.map(
        localizarCabecera(tabla, modelo, declaradas),
        ({ cabecera, datos }) => {
          const valores: Array<ValorPendienteDeTestigo> = []
          const excepciones: Array<ExcepcionExtraccion> = []
          const clavesDe = (fila: number, columna: string) =>
            territorios.map((territorio) => ({
              territorio,
              magnitud,
              fila: String(fila),
              columna,
            }))
          const columnasConUnidad = especificacion.columnas.filter((columna) => {
            if (columna.cabecera.includes(columna.evidenciaUnidad)) {
              return true
            }
            excepciones.push(
              new UnidadNoDeclarada({
                tabla,
                donde: `cabecera «${columna.cabecera}»`,
                evidencia: columna.evidenciaUnidad,
                claves: datos.flatMap((_, indice) =>
                  clavesDe(indice, columna.columna)
                ),
              })
            )
            return false
          })
          datos.forEach((fila, indice) => {
            if (fila.celdas.length !== declaradas.length) {
              excepciones.push(
                new FilaIrregular({
                  tabla,
                  fila: String(indice),
                  linea: fila.linea,
                  celdas: fila.celdas.length,
                  esperadas: declaradas.length,
                  claves: especificacion.columnas.flatMap((columna) =>
                    clavesDe(indice, columna.columna)
                  ),
                })
              )
              return
            }
            for (const columna of columnasConUnidad) {
              const celda = fila.celdas[
                cabecera.posicionDe.get(columna.cabecera) ?? -1
              ] as CeldaHtml
              const ubicacion = ubicacionDe(
                String(indice),
                columna.cabecera,
                celda
              )
              const claves = clavesDe(indice, columna.columna)
              const [bloque, ...otros] = celda.bloques
              if (bloque === undefined) {
                excepciones.push(
                  new CeldaAusente({
                    tabla,
                    fila: ubicacion.fila,
                    columna: ubicacion.columna,
                    buscado: "un literal en la celda",
                    claves,
                  })
                )
                continue
              }
              if (otros.length > 0) {
                excepciones.push(
                  new CeldaAmbigua({
                    tabla,
                    fila: ubicacion.fila,
                    columna: ubicacion.columna,
                    buscado: "un único literal en la celda",
                    coincidencias: celda.bloques.map((b) =>
                      ubicacionDe(ubicacion.fila, ubicacion.columna, b)
                    ),
                    claves,
                  })
                )
                continue
              }
              const leido = leerLiteral(bloque.texto, columna.gramatica)
              if (Result.isFailure(leido)) {
                excepciones.push(
                  new LiteralFueraDeGramatica({
                    tabla,
                    ubicacion,
                    literal: bloque.texto,
                    motivo: leido.failure,
                    claves,
                  })
                )
                continue
              }
              valores.push({
                ubicacion,
                literal: bloque.texto,
                unidad: columna.unidad,
                valor: leido.success.valor,
                claves,
                origen: { _tag: "Directo" },
                literalTestigo: leido.success.literalTestigo,
              })
            }
          })
          return {
            tablaLocalizada: {
              linea: modelo.linea,
              columnaFuente: modelo.columnaFuente,
              caption: modelo.caption,
            },
            valores,
            notas: [],
            excepciones,
          }
        }
      )
  )
}

type Declaracion =
  | { readonly _tag: "Partida"; readonly partida: Partida }
  | { readonly _tag: "Remision"; readonly literal: string; readonly fila: string }
  | { readonly _tag: "Nota"; readonly literal: string }

const textoDeclarado = (declaracion: Declaracion): string =>
  declaracion._tag === "Partida"
    ? declaracion.partida.plantilla
    : declaracion.literal

const encaja = (declaracion: Declaracion, bloque: Bloque): boolean => {
  if (declaracion._tag !== "Partida") {
    return bloque.texto === declaracion.literal
  }
  const [prefijo = "", sufijo = ""] =
    declaracion.partida.plantilla.split(HUECO_IMPORTE)
  return (
    bloque.texto.length > prefijo.length + sufijo.length &&
    bloque.texto.startsWith(prefijo) &&
    bloque.texto.endsWith(sufijo)
  )
}

const hueco = (partida: Partida, texto: string): string => {
  const [prefijo = "", sufijo = ""] = partida.plantilla.split(HUECO_IMPORTE)
  return texto.slice(prefijo.length, texto.length - sufijo.length)
}

const declaracionesDe = (celda: CeldaCuadro): ReadonlyArray<Declaracion> => [
  ...celda.partidas.map(
    (partida): Declaracion => ({ _tag: "Partida", partida })
  ),
  ...celda.remisiones.map(
    (remision): Declaracion => ({ _tag: "Remision", ...remision })
  ),
  ...celda.notas.map((literal): Declaracion => ({ _tag: "Nota", literal })),
]

interface RemisionPendiente {
  readonly territorio: Territorio
  readonly filaDestino: string
  readonly filaOrigen: string
  readonly columna: string
  readonly literal: string
  readonly ubicacion: Ubicacion
}

export const extraerCuadro = (
  especificacion: EspecificacionCuadro,
  html: string
): Result.Result<ExtraccionHtml, FalloDeTabla> => {
  const { tabla, magnitud } = especificacion
  const declaradas = [especificacion.cabeceraDeFilas, ...especificacion.columnas]
  const clavesDePartida = (
    territorio: Territorio,
    partida: Partida
  ): ReadonlyArray<Clave> =>
    partida.claves.map((clave) => ({
      territorio,
      magnitud,
      fila: clave.fila,
      columna: clave.columna,
    }))
  return Result.flatMap(
    localizarTabla(tabla, especificacion.documento.localizador, html),
    (modelo) =>
      Result.map(
        localizarCabecera(tabla, modelo, declaradas),
        ({ cabecera, datos }) => {
          const valores: Array<ValorPendienteDeTestigo> = []
          const notas: Array<{ ubicacion: Ubicacion; literal: string }> = []
          const excepciones: Array<ExcepcionExtraccion> = []
          const remisiones: Array<RemisionPendiente> = []
          const columnaDeFilas =
            cabecera.posicionDe.get(especificacion.cabeceraDeFilas) ?? -1
          const celdasDeFila = (literal: string) =>
            especificacion.celdas.filter((celda) => celda.fila === literal)
          const clavesDeFila = (literal: string, territorio: Territorio) =>
            celdasDeFila(literal).flatMap((celda) =>
              celda.partidas.flatMap((partida) =>
                clavesDePartida(territorio, partida)
              )
            )

          const filasPorLiteral = new Map<string, Array<FilaHtml>>()
          for (const fila of datos) {
            if (fila.celdas.length !== declaradas.length) {
              excepciones.push(
                new FilaIrregular({
                  tabla,
                  fila: fila.celdas[columnaDeFilas]?.texto ?? "",
                  linea: fila.linea,
                  celdas: fila.celdas.length,
                  esperadas: declaradas.length,
                  claves: [],
                })
              )
              continue
            }
            const literal = (fila.celdas[columnaDeFilas] as CeldaHtml).texto
            if (!especificacion.filas.some((f) => f.cabecera === literal)) {
              excepciones.push(
                new FilaNoDeclarada({ tabla, literal, linea: fila.linea })
              )
              continue
            }
            filasPorLiteral.set(literal, [
              ...(filasPorLiteral.get(literal) ?? []),
              fila,
            ])
          }

          for (const filaDeclarada of especificacion.filas) {
            const { cabecera: literalFila, territorio } = filaDeclarada
            const encontradas = filasPorLiteral.get(literalFila) ?? []
            const [fila, ...otras] = encontradas
            if (fila === undefined || otras.length > 0) {
              excepciones.push(
                fila === undefined
                  ? new CeldaAusente({
                      tabla,
                      fila: literalFila,
                      columna: especificacion.cabeceraDeFilas,
                      buscado: `fila «${literalFila}»`,
                      claves: clavesDeFila(literalFila, territorio),
                    })
                  : new CeldaAmbigua({
                      tabla,
                      fila: literalFila,
                      columna: especificacion.cabeceraDeFilas,
                      buscado: `fila «${literalFila}»`,
                      coincidencias: encontradas.map((f) =>
                        ubicacionDe(literalFila, especificacion.cabeceraDeFilas, f)
                      ),
                      claves: clavesDeFila(literalFila, territorio),
                    })
              )
              continue
            }
            for (const columna of especificacion.columnas) {
              const celda = fila.celdas[
                cabecera.posicionDe.get(columna) ?? -1
              ] as CeldaHtml
              const declarada = especificacion.celdas.find(
                (c) => c.fila === literalFila && c.columna === columna
              )
              const ubicacionBloque = (bloque: Bloque) =>
                ubicacionDe(literalFila, columna, bloque)
              if (declarada === undefined) {
                for (const bloque of celda.bloques) {
                  excepciones.push(
                    new ContenidoNoDeclarado({
                      tabla,
                      ubicacion: ubicacionBloque(bloque),
                      literal: bloque.texto,
                    })
                  )
                }
                continue
              }
              const declaraciones = declaracionesDe(declarada)
              const encajes = celda.bloques.map((bloque) =>
                declaraciones.filter((declaracion) =>
                  encaja(declaracion, bloque)
                )
              )
              const conflictivas = new Set<Declaracion>()
              celda.bloques.forEach((bloque, indice) => {
                const candidatas = encajes[indice] ?? []
                if (candidatas.length === 0) {
                  excepciones.push(
                    new ContenidoNoDeclarado({
                      tabla,
                      ubicacion: ubicacionBloque(bloque),
                      literal: bloque.texto,
                    })
                  )
                }
                if (candidatas.length > 1) {
                  candidatas.forEach((c) => conflictivas.add(c))
                  excepciones.push(
                    new CeldaAmbigua({
                      tabla,
                      fila: literalFila,
                      columna,
                      buscado: candidatas.map(textoDeclarado).join(" | "),
                      coincidencias: [ubicacionBloque(bloque)],
                      claves: candidatas.flatMap((c) =>
                        c._tag === "Partida"
                          ? clavesDePartida(territorio, c.partida)
                          : []
                      ),
                    })
                  )
                }
              })
              for (const declaracion of declaraciones) {
                if (conflictivas.has(declaracion)) {
                  continue
                }
                const claves =
                  declaracion._tag === "Partida"
                    ? clavesDePartida(territorio, declaracion.partida)
                    : []
                const bloques = celda.bloques.filter((_, indice) =>
                  (encajes[indice] ?? []).includes(declaracion)
                )
                const [bloque, ...otros] = bloques
                if (bloque === undefined) {
                  excepciones.push(
                    new CeldaAusente({
                      tabla,
                      fila: literalFila,
                      columna,
                      buscado: textoDeclarado(declaracion),
                      claves,
                    })
                  )
                  continue
                }
                if (otros.length > 0) {
                  excepciones.push(
                    new CeldaAmbigua({
                      tabla,
                      fila: literalFila,
                      columna,
                      buscado: textoDeclarado(declaracion),
                      coincidencias: bloques.map(ubicacionBloque),
                      claves,
                    })
                  )
                  continue
                }
                const ubicacion = ubicacionBloque(bloque)
                if (declaracion._tag === "Nota") {
                  notas.push({ ubicacion, literal: bloque.texto })
                  continue
                }
                if (declaracion._tag === "Remision") {
                  remisiones.push({
                    territorio,
                    filaDestino: literalFila,
                    filaOrigen: declaracion.fila,
                    columna,
                    literal: bloque.texto,
                    ubicacion,
                  })
                  continue
                }
                const { partida } = declaracion
                const [prefijo = "", sufijo = ""] =
                  partida.plantilla.split(HUECO_IMPORTE)
                if (!`${prefijo}${sufijo}`.includes(partida.evidenciaUnidad)) {
                  excepciones.push(
                    new UnidadNoDeclarada({
                      tabla,
                      donde: `plantilla «${partida.plantilla}»`,
                      evidencia: partida.evidenciaUnidad,
                      claves,
                    })
                  )
                  continue
                }
                const literalHueco = hueco(partida, bloque.texto)
                const leido = leerLiteral(literalHueco, partida.gramatica)
                if (Result.isFailure(leido)) {
                  excepciones.push(
                    new LiteralFueraDeGramatica({
                      tabla,
                      ubicacion,
                      literal: literalHueco,
                      motivo: leido.failure,
                      claves,
                    })
                  )
                  continue
                }
                valores.push({
                  ubicacion,
                  literal: bloque.texto,
                  unidad: partida.unidad,
                  valor: leido.success.valor,
                  claves,
                  origen: { _tag: "Directo" },
                  literalTestigo: leido.success.literalTestigo,
                })
              }
            }
          }

          for (const remision of remisiones) {
            const origenes = valores.filter(
              (valor) =>
                valor.origen._tag === "Directo" &&
                valor.ubicacion.fila === remision.filaOrigen &&
                valor.ubicacion.columna === remision.columna
            )
            if (origenes.length === 0) {
              excepciones.push(
                new CeldaAusente({
                  tabla,
                  fila: remision.filaDestino,
                  columna: remision.columna,
                  buscado: `valores de la celda remitida «${remision.filaOrigen}»`,
                  claves: [],
                })
              )
              continue
            }
            for (const origen of origenes) {
              valores.push({
                ...origen,
                claves: origen.claves.map((clave) => ({
                  ...clave,
                  territorio: remision.territorio,
                })),
                origen: {
                  _tag: "Remision",
                  literal: remision.literal,
                  ubicacionRemision: remision.ubicacion,
                },
                literalTestigo: null,
              })
            }
          }

          return {
            tablaLocalizada: {
              linea: modelo.linea,
              columnaFuente: modelo.columnaFuente,
              caption: modelo.caption,
            },
            valores,
            notas,
            excepciones,
          }
        }
      )
  )
}
