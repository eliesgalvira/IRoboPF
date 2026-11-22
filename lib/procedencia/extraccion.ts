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
import type {
  Clave,
  ClaveEscala,
  ColumnaEscala,
  Territorio,
  Unidad,
  Valor,
} from "./vocabulario"

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

interface TablaConCabecera {
  readonly tablaLocalizada: ExtraccionHtml["tablaLocalizada"]
  readonly posicionDe: ReadonlyMap<string, number>
  readonly datos: ReadonlyArray<FilaHtml>
  readonly excepciones: ReadonlyArray<ExcepcionExtraccion>
}

// La fila de cabecera es la única cuyas celdas son, exactamente, las
// cabeceras declaradas; las filas que la siguen son las de datos. Una fila
// anterior no es de datos ni está declarada: si contara, desplazaría el índice
// de los tramos.
const localizar = (
  tabla: string,
  localizador: LocalizadorTabla,
  html: string,
  declaradas: ReadonlyArray<string>
): Result.Result<TablaConCabecera, FalloDeTabla> =>
  Result.flatMap(localizarTabla(tabla, localizador, html), (modelo) =>
    localizarCabecera(tabla, modelo, declaradas)
  )

const localizarCabecera = (
  tabla: string,
  modelo: TablaHtml,
  declaradas: ReadonlyArray<string>
): Result.Result<TablaConCabecera, FalloDeTabla> => {
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
    tablaLocalizada: {
      linea: modelo.linea,
      columnaFuente: modelo.columnaFuente,
      caption: modelo.caption,
    },
    posicionDe: new Map(
      unica.celdas.map((celda, indice) => [celda.texto, indice])
    ),
    datos: modelo.filas.slice(modelo.filas.indexOf(unica) + 1),
    excepciones: modelo.filas.slice(0, modelo.filas.indexOf(unica)).map(
      (fila) =>
        new FilaNoDeclarada({
          tabla,
          literal: fila.celdas.map((celda) => celda.texto).join(" | "),
          linea: fila.linea,
        })
    ),
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
  return Result.map(
    localizar(tabla, especificacion.documento.localizador, html, declaradas),
    ({ tablaLocalizada, posicionDe, datos, excepciones: previas }) => {
      const valores: Array<ValorPendienteDeTestigo> = []
      const excepciones: Array<ExcepcionExtraccion> = [...previas]
      const clavesDe = (
        fila: number,
        columna: ColumnaEscala
      ): ReadonlyArray<ClaveEscala> =>
        territorios.map((territorio) => ({
          territorio,
          magnitud,
          fila,
          columna,
        }))
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
        for (const columna of especificacion.columnas) {
          const celda = fila.celdas[
            posicionDe.get(columna.cabecera) ?? -1
          ] as CeldaHtml
          const ubicacion = ubicacionDe(String(indice), columna.cabecera, celda)
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
      return { tablaLocalizada, valores, notas: [], excepciones }
    }
  )
}

type Declaracion =
  | { readonly _tag: "Partida"; readonly partida: Partida }
  | {
      readonly _tag: "Remision"
      readonly literal: string
      readonly fila: string
    }
  | { readonly _tag: "Nota"; readonly literal: string }

const textoDeclarado = (declaracion: Declaracion): string =>
  declaracion._tag === "Partida"
    ? declaracion.partida.plantilla
    : declaracion.literal

// Texto del hueco si el elemento empieza por lo anterior a él y acaba por lo
// posterior; undefined si la plantilla no encaja.
const hueco = (partida: Partida, texto: string): string | undefined => {
  const [prefijo = "", sufijo = ""] = partida.plantilla.split(HUECO_IMPORTE)
  return texto.length > prefijo.length + sufijo.length &&
    texto.startsWith(prefijo) &&
    texto.endsWith(sufijo)
    ? texto.slice(prefijo.length, texto.length - sufijo.length)
    : undefined
}

const encaja = (declaracion: Declaracion, bloque: Bloque): boolean =>
  declaracion._tag === "Partida"
    ? hueco(declaracion.partida, bloque.texto) !== undefined
    : bloque.texto === declaracion.literal

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

interface SalidaCuadro {
  readonly valores: Array<ValorPendienteDeTestigo>
  readonly notas: Array<{ ubicacion: Ubicacion; literal: string }>
  readonly excepciones: Array<ExcepcionExtraccion>
  readonly remisiones: Array<RemisionPendiente>
}

interface CeldaLocalizada {
  readonly tabla: string
  readonly territorio: Territorio
  readonly fila: string
  readonly columna: string
  readonly clavesDe: (declaracion: Declaracion) => ReadonlyArray<Clave>
}

// Cada elemento de la celda ha de encajar con una sola declaración y cada
// declaración con un solo elemento; una celda sin declarar no admite ninguno.
const leerCelda = (
  { tabla, territorio, fila, columna, clavesDe }: CeldaLocalizada,
  celda: CeldaHtml,
  declarada: CeldaCuadro | undefined,
  salida: SalidaCuadro
): void => {
  const ubicacionBloque = (bloque: Bloque) => ubicacionDe(fila, columna, bloque)
  const declaraciones =
    declarada === undefined ? [] : declaracionesDe(declarada)
  const encajes = celda.bloques.map((bloque) =>
    declaraciones.filter((declaracion) => encaja(declaracion, bloque))
  )
  const conflictivas = new Set<Declaracion>()
  celda.bloques.forEach((bloque, indice) => {
    const candidatas = encajes[indice] ?? []
    if (candidatas.length === 0) {
      salida.excepciones.push(
        new ContenidoNoDeclarado({
          tabla,
          ubicacion: ubicacionBloque(bloque),
          literal: bloque.texto,
        })
      )
    }
    if (candidatas.length > 1) {
      candidatas.forEach((c) => conflictivas.add(c))
      salida.excepciones.push(
        new CeldaAmbigua({
          tabla,
          fila,
          columna,
          buscado: candidatas.map(textoDeclarado).join(" | "),
          coincidencias: [ubicacionBloque(bloque)],
          claves: candidatas.flatMap(clavesDe),
        })
      )
    }
  })
  for (const declaracion of declaraciones) {
    if (conflictivas.has(declaracion)) {
      continue
    }
    const claves = clavesDe(declaracion)
    const bloques = celda.bloques.filter((_, indice) =>
      (encajes[indice] ?? []).includes(declaracion)
    )
    const [bloque, ...otros] = bloques
    if (bloque === undefined) {
      salida.excepciones.push(
        new CeldaAusente({
          tabla,
          fila,
          columna,
          buscado: textoDeclarado(declaracion),
          claves,
        })
      )
      continue
    }
    if (otros.length > 0) {
      salida.excepciones.push(
        new CeldaAmbigua({
          tabla,
          fila,
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
      salida.notas.push({ ubicacion, literal: bloque.texto })
      continue
    }
    if (declaracion._tag === "Remision") {
      salida.remisiones.push({
        territorio,
        filaDestino: fila,
        filaOrigen: declaracion.fila,
        columna,
        literal: bloque.texto,
        ubicacion,
      })
      continue
    }
    const { partida } = declaracion
    const literalHueco = hueco(partida, bloque.texto) ?? ""
    const leido = leerLiteral(literalHueco, partida.gramatica)
    if (Result.isFailure(leido)) {
      salida.excepciones.push(
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
    salida.valores.push({
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

// Una remisión copia los valores directos de la celda remitida con el
// territorio de la fila que remite.
const resolverRemisiones = (tabla: string, salida: SalidaCuadro): void => {
  for (const remision of salida.remisiones) {
    const origenes = salida.valores.filter(
      (valor) =>
        valor.origen._tag === "Directo" &&
        valor.ubicacion.fila === remision.filaOrigen &&
        valor.ubicacion.columna === remision.columna
    )
    if (origenes.length === 0) {
      salida.excepciones.push(
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
      salida.valores.push({
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
}

export const extraerCuadro = (
  especificacion: EspecificacionCuadro,
  html: string
): Result.Result<ExtraccionHtml, FalloDeTabla> => {
  const { tabla, magnitud } = especificacion
  const declaradas = [
    especificacion.cabeceraDeFilas,
    ...especificacion.columnas,
  ]
  const clavesDe =
    (territorio: Territorio) =>
    (declaracion: Declaracion): ReadonlyArray<Clave> =>
      declaracion._tag === "Partida"
        ? declaracion.partida.claves.map((posicion) => ({
            territorio,
            magnitud,
            ...posicion,
          }))
        : []
  const clavesDeFila = (literal: string, territorio: Territorio) =>
    especificacion.celdas
      .filter((celda) => celda.fila === literal)
      .flatMap((celda) => declaracionesDe(celda).flatMap(clavesDe(territorio)))
  return Result.map(
    localizar(tabla, especificacion.documento.localizador, html, declaradas),
    ({ tablaLocalizada, posicionDe, datos, excepciones: previas }) => {
      const salida: SalidaCuadro = {
        valores: [],
        notas: [],
        excepciones: [...previas],
        remisiones: [],
      }
      const columnaDeFilas =
        posicionDe.get(especificacion.cabeceraDeFilas) ?? -1

      const filasPorLiteral = new Map<string, Array<FilaHtml>>()
      for (const fila of datos) {
        if (fila.celdas.length !== declaradas.length) {
          salida.excepciones.push(
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
          salida.excepciones.push(
            new FilaNoDeclarada({ tabla, literal, linea: fila.linea })
          )
          continue
        }
        filasPorLiteral.set(literal, [
          ...(filasPorLiteral.get(literal) ?? []),
          fila,
        ])
      }

      for (const {
        cabecera: literalFila,
        territorio,
      } of especificacion.filas) {
        const encontradas = filasPorLiteral.get(literalFila) ?? []
        const [fila, ...otras] = encontradas
        if (fila === undefined || otras.length > 0) {
          const comun = {
            tabla,
            fila: literalFila,
            columna: especificacion.cabeceraDeFilas,
            buscado: `fila «${literalFila}»`,
            claves: clavesDeFila(literalFila, territorio),
          }
          salida.excepciones.push(
            fila === undefined
              ? new CeldaAusente(comun)
              : new CeldaAmbigua({
                  ...comun,
                  coincidencias: encontradas.map((f) =>
                    ubicacionDe(literalFila, especificacion.cabeceraDeFilas, f)
                  ),
                })
          )
          continue
        }
        for (const columna of especificacion.columnas) {
          leerCelda(
            {
              tabla,
              territorio,
              fila: literalFila,
              columna,
              clavesDe: clavesDe(territorio),
            },
            fila.celdas[posicionDe.get(columna) ?? -1] as CeldaHtml,
            especificacion.celdas.find(
              (c) => c.fila === literalFila && c.columna === columna
            ),
            salida
          )
        }
      }

      resolverRemisiones(tabla, salida)
      const { valores, notas, excepciones } = salida
      return { tablaLocalizada, valores, notas, excepciones }
    }
  )
}
