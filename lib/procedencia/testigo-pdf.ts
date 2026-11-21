import { Effect, Path } from "effect"

import { PdfIlegible } from "./excepciones"
import type { ValorPendienteDeTestigo } from "./extraccion"
import { normalizar, tokensNumericos } from "./literales"
import type { Aparicion, Testigo, ValorExtraido } from "./resultado"

export interface ElementoDeTexto {
  readonly texto: string
  readonly x: number
  readonly y: number
}

export interface PaginaDeTexto {
  readonly pagina: number
  readonly elementos: ReadonlyArray<ElementoDeTexto>
}

const esLiteralNumerico = (literal: string): boolean => {
  const tokens = tokensNumericos(literal)
  return tokens.length === 1 && tokens[0] === literal
}

// Un literal numérico aparece cuando es un token numérico completo de un
// elemento de texto; un literal no numérico (un centinela) aparece cuando un
// elemento de texto entero, normalizado, es ese literal.
export const aparicionesDe = (
  literal: string,
  paginas: ReadonlyArray<PaginaDeTexto>
): ReadonlyArray<Aparicion> => {
  const numerico = esLiteralNumerico(literal)
  return paginas.flatMap(({ pagina, elementos }) =>
    elementos.flatMap((elemento, indice) => {
      const texto = normalizar(elemento.texto)
      const veces = numerico
        ? tokensNumericos(texto).filter((token) => token === literal).length
        : texto === literal
          ? 1
          : 0
      return Array.from({ length: veces }, (_, ocurrencia) => ({
        pagina,
        elemento: indice,
        ocurrencia,
        x: elemento.x,
        y: elemento.y,
      }))
    })
  )
}

export interface TablaPendienteDeTestigo {
  readonly tabla: string
  readonly sha256: string
  readonly paginas: ReadonlyArray<PaginaDeTexto>
  readonly valores: ReadonlyArray<ValorPendienteDeTestigo>
}

interface Demanda {
  readonly tabla: string
  readonly celdas: number
  readonly apariciones: ReadonlyArray<Aparicion>
  readonly identidades: ReadonlyArray<string>
}

const identidad = (sha256: string, aparicion: Aparicion) =>
  `${sha256}|${aparicion.pagina}|${aparicion.elemento}|${aparicion.ocurrencia}`

// Tamaño del emparejamiento máximo entre celdas y apariciones (Kuhn: un camino
// aumentante por celda). El tamaño no depende del orden en que se recorren.
const emparejamientoMaximo = (demandas: ReadonlyArray<Demanda>): number => {
  const celdas = demandas.flatMap((demanda) =>
    Array.from({ length: demanda.celdas }, () => demanda.identidades)
  )
  const celdaDe = new Map<string, number>()
  const aumentar = (celda: number, visitadas: Set<string>): boolean =>
    (celdas[celda] ?? []).some((aparicion) => {
      if (visitadas.has(aparicion)) {
        return false
      }
      visitadas.add(aparicion)
      const ocupante = celdaDe.get(aparicion)
      if (ocupante === undefined || aumentar(ocupante, visitadas)) {
        celdaDe.set(aparicion, celda)
        return true
      }
      return false
    })
  return celdas.filter((_, celda) => aumentar(celda, new Set())).length
}

// Grupos de tablas que comparten alguna aparición del literal: fuera de un
// grupo, ninguna celda puede competir por las apariciones de otro.
const gruposConectados = (
  demandas: ReadonlyArray<Demanda>
): ReadonlyArray<ReadonlyArray<Demanda>> => {
  const grupos: Array<{ demandas: Array<Demanda>; identidades: Set<string> }> =
    []
  for (const demanda of demandas) {
    const unidos = grupos.filter((grupo) =>
      demanda.identidades.some((i) => grupo.identidades.has(i))
    )
    const nuevo = {
      demandas: [demanda, ...unidos.flatMap((grupo) => grupo.demandas)],
      identidades: new Set([
        ...demanda.identidades,
        ...unidos.flatMap((grupo) => Array.from(grupo.identidades)),
      ]),
    }
    for (const grupo of unidos) {
      grupos.splice(grupos.indexOf(grupo), 1)
    }
    grupos.push(nuevo)
  }
  return grupos.map((grupo) => grupo.demandas)
}

// Una aparición del PDF (documento, página, elemento, ocurrencia) atestigua
// como mucho una celda en toda la ejecución, y cada celda sólo puede usar
// apariciones de su literal en las páginas que declara su tabla. Si el
// emparejamiento máximo cubre todas las celdas de un grupo, todas tienen
// testigo. Si no, ninguna: nada vincula una aparición concreta con una celda
// concreta, así que no hay forma de elegir cuáles se quedan sin él.
export const asignarTestigos = (
  tablas: ReadonlyArray<TablaPendienteDeTestigo>
): ReadonlyMap<string, ReadonlyArray<ValorExtraido>> => {
  const demandasPorLiteral = new Map<string, Array<Demanda>>()
  for (const { tabla, sha256, paginas, valores } of tablas) {
    const celdasPorLiteral = new Map<string, number>()
    for (const { literalTestigo } of valores) {
      if (literalTestigo !== null) {
        celdasPorLiteral.set(
          literalTestigo,
          (celdasPorLiteral.get(literalTestigo) ?? 0) + 1
        )
      }
    }
    for (const [literal, celdas] of celdasPorLiteral) {
      const apariciones = aparicionesDe(literal, paginas)
      demandasPorLiteral.set(literal, [
        ...(demandasPorLiteral.get(literal) ?? []),
        {
          tabla,
          celdas,
          apariciones,
          identidades: apariciones.map((a) => identidad(sha256, a)),
        },
      ])
    }
  }
  const testigos = new Map<string, Testigo>()
  for (const [literal, demandas] of demandasPorLiteral) {
    for (const grupo of gruposConectados(demandas)) {
      const celdas = grupo.reduce((suma, d) => suma + d.celdas, 0)
      const cubiertas = emparejamientoMaximo(grupo)
      const disponibles = new Set(grupo.flatMap((d) => d.identidades)).size
      const nombres = grupo.map((d) => d.tabla).sort()
      for (const { tabla, apariciones } of grupo) {
        testigos.set(
          `${tabla}\u0000${literal}`,
          cubiertas === celdas
            ? { _tag: "ConTestigo", literal, apariciones }
            : {
                _tag: "SinTestigo",
                literal,
                tablas: nombres,
                celdas,
                aparicionesDisponibles: disponibles,
                cubiertas,
                apariciones,
              }
        )
      }
    }
  }
  return new Map(
    tablas.map(({ tabla, valores }) => [
      tabla,
      valores.map(({ literalTestigo, ...valor }) => ({
        ...valor,
        testigo:
          literalTestigo === null
            ? { _tag: "PorRemision" }
            : (testigos.get(`${tabla}\u0000${literalTestigo}`) as Testigo),
      })),
    ])
  )
}

export interface PdfAbierto {
  readonly numeroDePaginas: number
  readonly leerPagina: (
    pagina: number
  ) => Effect.Effect<PaginaDeTexto, PdfIlegible>
}

export const abrirPdf = Effect.fn("procedencia.abrirPdf")(function* (
  sha256: string,
  bytes: Uint8Array
) {
  const path = yield* Path.Path
  const paquete = yield* path.fromFileUrl(
    new URL(import.meta.resolve("pdfjs-dist/package.json"))
  )
  const raiz = path.dirname(paquete)
  const pdfjs = yield* Effect.tryPromise({
    try: () => import("pdfjs-dist/legacy/build/pdf.mjs"),
    catch: (cause) => new PdfIlegible({ sha256, cause }),
  })
  const carga = yield* Effect.acquireRelease(
    Effect.try({
      try: () =>
        pdfjs.getDocument({
          data: new Uint8Array(bytes),
          useSystemFonts: false,
          disableFontFace: true,
          verbosity: 0,
          standardFontDataUrl: `${path.join(raiz, "standard_fonts")}/`,
          cMapUrl: `${path.join(raiz, "cmaps")}/`,
          cMapPacked: true,
        }),
      catch: (cause) => new PdfIlegible({ sha256, cause }),
    }),
    (carga) => Effect.promise(() => carga.destroy())
  )
  const documento = yield* Effect.tryPromise({
    try: () => carga.promise,
    catch: (cause) => new PdfIlegible({ sha256, cause }),
  })
  const leerPagina = Effect.fn("procedencia.leerPaginaPdf")(function* (
    pagina: number
  ) {
    const hoja = yield* Effect.tryPromise({
      try: () => documento.getPage(pagina),
      catch: (cause) => new PdfIlegible({ sha256, cause }),
    })
    const contenido = yield* Effect.tryPromise({
      try: () => hoja.getTextContent(),
      catch: (cause) => new PdfIlegible({ sha256, cause }),
    })
    hoja.cleanup()
    return {
      pagina,
      elementos: contenido.items.flatMap((elemento) =>
        "str" in elemento
          ? [
              {
                texto: elemento.str,
                x: elemento.transform[4] ?? 0,
                y: elemento.transform[5] ?? 0,
              },
            ]
          : []
      ),
    } satisfies PaginaDeTexto
  })
  return {
    numeroDePaginas: documento.numPages,
    leerPagina,
  } satisfies PdfAbierto
})
