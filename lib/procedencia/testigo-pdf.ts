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
      return Array.from({ length: veces }, () => ({
        pagina,
        elemento: indice,
        x: elemento.x,
        y: elemento.y,
      }))
    })
  )
}

// Si n celdas de la tabla comparten literal, las páginas declaradas deben
// contenerlo al menos n veces. Nada vincula una aparición concreta con una
// celda concreta, así que cuando faltan apariciones ninguna de esas celdas
// queda con testigo.
export const asignarTestigos = (
  valores: ReadonlyArray<ValorPendienteDeTestigo>,
  paginas: ReadonlyArray<PaginaDeTexto>
): ReadonlyArray<ValorExtraido> => {
  const celdasPorLiteral = new Map<string, number>()
  for (const valor of valores) {
    if (valor.literalTestigo !== null) {
      celdasPorLiteral.set(
        valor.literalTestigo,
        (celdasPorLiteral.get(valor.literalTestigo) ?? 0) + 1
      )
    }
  }
  const testigoPorLiteral = new Map<string, Testigo>(
    Array.from(celdasPorLiteral, ([literal, celdas]) => {
      const apariciones = aparicionesDe(literal, paginas)
      return [
        literal,
        apariciones.length >= celdas
          ? { _tag: "ConTestigo", literal, apariciones }
          : {
              _tag: "SinTestigo",
              literal,
              motivo: `las páginas declaradas contienen ${apariciones.length} apariciones y la tabla tiene ${celdas} celdas con este literal`,
              apariciones,
            },
      ]
    })
  )
  return valores.map(({ literalTestigo, ...valor }) => ({
    ...valor,
    testigo:
      literalTestigo === null
        ? { _tag: "PorRemision" }
        : (testigoPorLiteral.get(literalTestigo) as Testigo),
  }))
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
