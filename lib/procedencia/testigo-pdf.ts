import { Effect, Path, Result } from "effect"

import { PdfIlegible } from "./excepciones"
import type { CeldaAtestiguable, ValorPendienteDeTestigo } from "./extraccion"
import { esFilaDeCabecera, leerLiteral } from "./literales"
import type {
  CeldaPdf,
  MotivoSinTestigo,
  PosicionPdf,
  Testigo,
  ValorExtraido,
} from "./resultado"
import { mismoValor, type Valor } from "./vocabulario"

// Árbol etiquetado de una página tal como lo da pdf.js: elementos con su rol y,
// como hojas, el texto de cada contenido marcado de la página. pdf.js da el
// esqueleto entero de las tablas que tocan la página (todas sus filas y
// celdas), pero sólo el contenido que está en ella.
export type NodoPdf =
  | {
      readonly _tag: "Elemento"
      readonly rol: string
      readonly hijos: ReadonlyArray<NodoPdf>
    }
  | { readonly _tag: "Contenido"; readonly texto: string }

export interface PaginaEtiquetada {
  readonly pagina: number
  // null: la página no tiene árbol de estructura.
  readonly raiz: NodoPdf | null
}

// Normalización del PDF, distinta de la del HTML: cada corrida de espacios y
// saltos de línea (los fines de línea de pdf.js y la unión de contenidos
// marcados) pasa a un espacio y se quita el de los extremos. Nada más.
export const normalizarPdf = (texto: string): string =>
  texto.replace(/[ \n]+/g, " ").replace(/^ | $/g, "")

const ES_ENCABEZADO = /^H[1-6]?$/

// Texto de un nodo: sus contenidos marcados en el orden del árbol, unidos por
// salto de línea. La etiqueta de un elemento de lista (Lbl) no es texto de la
// celda: el HTML no la trae, la pinta su hoja de estilo.
const contenidos = (nodo: NodoPdf): ReadonlyArray<string> =>
  nodo._tag === "Contenido"
    ? [nodo.texto]
    : nodo.rol === "Lbl"
      ? []
      : nodo.hijos.flatMap(contenidos)

const elementos = (nodo: NodoPdf, rol: (r: string) => boolean) =>
  nodo._tag === "Elemento"
    ? nodo.hijos.flatMap((hijo) =>
        hijo._tag === "Elemento" && rol(hijo.rol) ? [hijo] : []
      )
    : []

interface FilaDeTrozo {
  readonly seccion: string | null
  // Contenidos de cada celda (TH o TD) en esta página.
  readonly celdas: ReadonlyArray<ReadonlyArray<string>>
}

// Una tabla del árbol de una página: su índice entre las tablas de la página,
// en el orden del árbol, el encabezado (H, H1…H6) que la precede en el orden
// del documento dentro de las páginas leídas, sus filas y si tiene otra tabla
// dentro.
export interface TrozoDeTabla {
  readonly pagina: number
  readonly indice: number
  readonly encabezado: string | null
  readonly filas: ReadonlyArray<FilaDeTrozo>
  readonly anidada: boolean
}

const contieneTabla = (nodo: NodoPdf): boolean =>
  nodo._tag === "Elemento" &&
  nodo.hijos.some(
    (hijo) =>
      hijo._tag === "Elemento" && (hijo.rol === "Table" || contieneTabla(hijo))
  )

const filasDe = (tabla: NodoPdf): ReadonlyArray<FilaDeTrozo> => {
  const fila = (tr: NodoPdf, seccion: string | null): FilaDeTrozo => ({
    seccion,
    celdas: elementos(tr, (r) => r === "TH" || r === "TD").map(contenidos),
  })
  return elementos(tabla, (r) =>
    ["TR", "THead", "TBody", "TFoot"].includes(r)
  ).flatMap((hijo) =>
    hijo.rol === "TR"
      ? [fila(hijo, null)]
      : elementos(hijo, (r) => r === "TR").map((tr) => fila(tr, hijo.rol))
  )
}

// Recorre las páginas en orden como un solo documento: el encabezado anterior
// a una tabla puede estar al final de la página previa.
export const trozosDeTablas = (
  paginas: ReadonlyArray<PaginaEtiquetada>
): ReadonlyArray<TrozoDeTabla> => {
  const trozos: Array<TrozoDeTabla> = []
  let encabezado: string | null = null
  for (const { pagina, raiz } of paginas) {
    if (raiz === null) {
      continue
    }
    let indice = 0
    const recorrer = (nodo: NodoPdf) => {
      if (nodo._tag === "Contenido") {
        return
      }
      if (ES_ENCABEZADO.test(nodo.rol)) {
        encabezado = normalizarPdf(contenidos(nodo).join("\n"))
        return
      }
      if (nodo.rol === "Table") {
        trozos.push({
          pagina,
          indice,
          encabezado,
          filas: filasDe(nodo),
          anidada: contieneTabla(nodo),
        })
        indice++
        return
      }
      nodo.hijos.forEach(recorrer)
    }
    recorrer(raiz)
  }
  return trozos
}

const textoDe = (trozosDeCelda: ReadonlyArray<string>) =>
  normalizarPdf(trozosDeCelda.join("\n"))

export interface DeclaracionPdf {
  readonly paginas: ReadonlyArray<number>
  readonly cabecera: ReadonlyArray<string>
  readonly encabezado?: string | undefined
}

interface CeldaUnida {
  readonly texto: string
  readonly paginas: ReadonlyArray<number>
}

interface TablaPdf {
  readonly pagina: number
  readonly indice: number
  // Posición de cada literal de cabecera declarado en la fila de cabecera.
  readonly columnas: ReadonlyMap<string, number>
  // Filas de datos: las posteriores a la de cabecera que están en TBody o
  // directamente en la tabla (una tabla sin secciones), con su índice de fila
  // en la tabla y el texto de cada celda unido entre páginas.
  readonly datos: ReadonlyArray<{
    readonly fila: number
    readonly celdas: ReadonlyArray<CeldaUnida>
  }>
}

const filasDeCabecera = (
  trozo: TrozoDeTabla,
  cabecera: ReadonlyArray<string>
): ReadonlyArray<number> =>
  trozo.filas.flatMap((fila, indice) =>
    esFilaDeCabecera(fila.celdas.map(textoDe), cabecera) ? [indice] : []
  )

const mismoEsqueleto = (a: TrozoDeTabla, b: TrozoDeTabla) =>
  a.filas.length === b.filas.length &&
  a.filas.every(
    (fila, i) =>
      fila.seccion === b.filas[i]?.seccion &&
      fila.celdas.length === b.filas[i]?.celdas.length
  )

// La tabla es la única de las páginas declaradas con una fila cuyas celdas son
// exactamente la cabecera declarada (y, si se declara, con ese encabezado
// anterior), y esa fila es única en ella. En cada página declarada posterior a
// la suya, su continuación es la única tabla de la página cuya fila de
// cabecera no tiene contenido (en la continuación, la cabecera repetida es un
// artefacto, fuera del árbol), y ha de tener el mismo esqueleto. Ningún trozo
// puede tener otra tabla dentro: su texto se mezclaría con el de la celda. El
// texto de cada celda es la unión, por orden de página, de su contenido en
// cada trozo.
export const localizarTablaPdf = (
  declaracion: DeclaracionPdf,
  paginas: ReadonlyArray<PaginaEtiquetada>
): Result.Result<TablaPdf, MotivoSinTestigo> => {
  const sinArbol = paginas.find((pagina) => pagina.raiz === null)
  if (sinArbol !== undefined) {
    return Result.fail({ _tag: "PaginaSinEstructura", pagina: sinArbol.pagina })
  }
  const trozos = trozosDeTablas(paginas)
  const candidatas = trozos.filter(
    (trozo) =>
      filasDeCabecera(trozo, declaracion.cabecera).length > 0 &&
      (declaracion.encabezado === undefined ||
        trozo.encabezado === declaracion.encabezado)
  )
  const [tabla, ...otras] = candidatas
  if (tabla === undefined || otras.length > 0) {
    return Result.fail({
      _tag: "TablaPdfNoLocalizada",
      encontradas: candidatas.length,
    })
  }
  const filas = filasDeCabecera(tabla, declaracion.cabecera)
  const [cabecera] = filas
  if (cabecera === undefined || filas.length > 1) {
    return Result.fail({
      _tag: "CabeceraPdfAmbigua",
      pagina: tabla.pagina,
      filas,
    })
  }
  const partes: Array<TrozoDeTabla> = [tabla]
  for (const pagina of declaracion.paginas.filter((p) => p > tabla.pagina)) {
    const continuaciones = trozos.filter(
      (trozo) =>
        trozo.pagina === pagina &&
        trozo.filas[cabecera] !== undefined &&
        trozo.filas[cabecera].celdas.every((c) => c.length === 0)
    )
    const [continuacion, ...mas] = continuaciones
    if (continuacion === undefined || mas.length > 0) {
      return Result.fail({
        _tag: "ContinuacionNoLocalizada",
        pagina,
        encontradas: continuaciones.length,
      })
    }
    if (!mismoEsqueleto(tabla, continuacion)) {
      return Result.fail({ _tag: "ContinuacionIrregular", pagina })
    }
    partes.push(continuacion)
  }
  const conTablaDentro = partes.find((parte) => parte.anidada)
  if (conTablaDentro !== undefined) {
    return Result.fail({
      _tag: "TablaPdfAnidada",
      pagina: conTablaDentro.pagina,
    })
  }
  const celdaUnida = (fila: number, columna: number): CeldaUnida => {
    const conContenido = partes.filter(
      (parte) => (parte.filas[fila]?.celdas[columna] ?? []).length > 0
    )
    return {
      texto: textoDe(
        conContenido.flatMap(
          (parte) => parte.filas[fila]?.celdas[columna] ?? []
        )
      ),
      paginas: conContenido.map((parte) => parte.pagina),
    }
  }
  const celdasDeCabecera = tabla.filas[cabecera]?.celdas ?? []
  return Result.succeed({
    pagina: tabla.pagina,
    indice: tabla.indice,
    columnas: new Map(
      celdasDeCabecera.map((celda, indice) => [textoDe(celda), indice])
    ),
    datos: tabla.filas.flatMap((fila, indice) =>
      indice > cabecera && (fila.seccion === "TBody" || fila.seccion === null)
        ? [
            {
              fila: indice,
              celdas: fila.celdas.map((_, columna) =>
                celdaUnida(indice, columna)
              ),
            },
          ]
        : []
    ),
  })
}

// Cómo se corresponden filas y columnas del HTML con las del PDF. En una
// escala, la fila de datos i es el tramo i y el número de filas ha de ser el
// mismo; en un cuadro, la fila es la de cabecera de fila con el mismo literal.
// La columna es la de la cabecera del PDF declarada para la del HTML.
export type Correspondencia =
  | {
      readonly _tag: "Escala"
      readonly tramos: number
      readonly columnaPdf: ReadonlyMap<string, string>
    }
  | {
      readonly _tag: "Cuadro"
      readonly cabeceraDeFilasPdf: string
      readonly columnaPdf: ReadonlyMap<string, string>
    }

const sinTestigo = (motivo: MotivoSinTestigo): Testigo => ({
  _tag: "SinTestigo",
  motivo,
})

// Una celda de escala atestigua su valor con el mismo literal o con otro que
// la gramática de su columna lee al mismo valor; son estados distintos. Una
// casilla del cuadro, sólo con el mismo texto entero: los bloques del PDF no se
// pueden delimitar donde una frase cruza de página, así que el texto completo
// de la casilla es la comprobación exacta más fuerte, y fija cada importe en
// su sitio.
const testigoDeCelda = (
  { _tag, textoHtml, gramatica }: CeldaAtestiguable,
  valor: Valor,
  posicion: PosicionPdf,
  celda: CeldaUnida
): Testigo => {
  const [primera, ...resto] = celda.paginas
  if (primera === undefined) {
    return sinTestigo({ _tag: "CeldaPdfVacia", posicion })
  }
  const referencia: CeldaPdf = { ...posicion, paginas: [primera, ...resto] }
  if (celda.texto === textoHtml) {
    return {
      _tag: _tag === "Remision" ? "PorRemision" : "MismoLiteral",
      celda: referencia,
    }
  }
  if (gramatica === null) {
    return sinTestigo({
      _tag: "TextoDistinto",
      posicion,
      textoPdf: celda.texto,
    })
  }
  const leido = leerLiteral(celda.texto, gramatica)
  if (Result.isFailure(leido)) {
    return sinTestigo({
      _tag: "LiteralPdfFueraDeGramatica",
      posicion,
      literalPdf: celda.texto,
      motivo: leido.failure,
    })
  }
  return mismoValor(leido.success, valor)
    ? {
        _tag: "MismoValorOtroLiteral",
        celda: referencia,
        literalPdf: celda.texto,
      }
    : sinTestigo({
        _tag: "ValorPdfDistinto",
        posicion,
        literalPdf: celda.texto,
        valorPdf: leido.success,
      })
}

export const atestiguar = (
  tabla: Result.Result<TablaPdf, MotivoSinTestigo>,
  correspondencia: Correspondencia,
  pendientes: ReadonlyArray<ValorPendienteDeTestigo>
): ReadonlyArray<ValorExtraido> => {
  const testigoDe = (
    atestiguable: CeldaAtestiguable,
    valor: Valor
  ): Testigo => {
    if (Result.isFailure(tabla)) {
      return sinTestigo(tabla.failure)
    }
    const { pagina, indice, columnas, datos } = tabla.success
    const { fila, columna } = atestiguable
    const cabeceraPdf = correspondencia.columnaPdf.get(columna)
    if (cabeceraPdf === undefined) {
      return sinTestigo({ _tag: "ColumnaSinCorrespondencia", columna })
    }
    const posicionColumna = columnas.get(cabeceraPdf)
    if (posicionColumna === undefined) {
      return sinTestigo({
        _tag: "ColumnaPdfNoLocalizada",
        cabecera: cabeceraPdf,
      })
    }
    let encontradas: TablaPdf["datos"]
    if (correspondencia._tag === "Escala") {
      if (datos.length !== correspondencia.tramos) {
        return sinTestigo({
          _tag: "FilasDistintas",
          html: correspondencia.tramos,
          pdf: datos.length,
        })
      }
      encontradas = datos.slice(Number(fila), Number(fila) + 1)
    } else {
      const columnaDeFilas = columnas.get(correspondencia.cabeceraDeFilasPdf)
      if (columnaDeFilas === undefined) {
        return sinTestigo({
          _tag: "ColumnaPdfNoLocalizada",
          cabecera: correspondencia.cabeceraDeFilasPdf,
        })
      }
      encontradas = datos.filter(
        (d) => d.celdas[columnaDeFilas]?.texto === fila
      )
    }
    const [datosDeFila, ...otras] = encontradas
    if (datosDeFila === undefined || otras.length > 0) {
      return sinTestigo({
        _tag: "FilaPdfNoLocalizada",
        fila: String(fila),
        encontradas: encontradas.length,
      })
    }
    const posicion: PosicionPdf = {
      pagina,
      tabla: indice,
      fila: datosDeFila.fila,
      columna: posicionColumna,
    }
    const celda = datosDeFila.celdas[posicionColumna]
    return celda === undefined
      ? sinTestigo({ _tag: "CeldaPdfInexistente", posicion })
      : testigoDeCelda(atestiguable, valor, posicion, celda)
  }
  return pendientes.map(({ atestiguable, ...valor }) => ({
    ...valor,
    testigo: testigoDe(atestiguable, valor.valor),
  }))
}

interface ElementoPdfJs {
  readonly role?: string
  readonly type?: string
  readonly id?: string
  readonly children?: ReadonlyArray<ElementoPdfJs>
}

interface ElementoDeTextoPdfJs {
  readonly type?: string
  readonly id?: string | null
  readonly str?: string
  readonly hasEOL?: boolean
}

// Convierte el árbol de pdf.js en NodoPdf. Cada contenido marcado de la página
// se identifica por su id y su texto es el de sus elementos de texto, con un
// salto de línea en cada fin de línea. El texto de un contenido marcado sin id
// (un artefacto) no es de nadie.
const arbolDePagina = (
  arbol: ElementoPdfJs | null,
  elementosDeTexto: ReadonlyArray<ElementoDeTextoPdfJs>
): NodoPdf | null => {
  if (arbol === null) {
    return null
  }
  const texto = new Map<string, string>()
  const abiertos: Array<string | null> = []
  for (const elemento of elementosDeTexto) {
    if (
      elemento.type === "beginMarkedContentProps" ||
      elemento.type === "beginMarkedContent"
    ) {
      abiertos.push(elemento.id ?? null)
    } else if (elemento.type === "endMarkedContent") {
      abiertos.pop()
    } else if (elemento.str !== undefined) {
      const id = abiertos.at(-1)
      if (id !== undefined && id !== null) {
        texto.set(
          id,
          `${texto.get(id) ?? ""}${elemento.str}${elemento.hasEOL === true ? "\n" : ""}`
        )
      }
    }
  }
  const convertir = (nodo: ElementoPdfJs): ReadonlyArray<NodoPdf> =>
    nodo.type === "content"
      ? [{ _tag: "Contenido", texto: texto.get(nodo.id ?? "") ?? "" }]
      : nodo.type !== undefined
        ? []
        : [
            {
              _tag: "Elemento",
              rol: nodo.role ?? "",
              hijos: (nodo.children ?? []).flatMap(convertir),
            },
          ]
  return convertir(arbol)[0] ?? null
}

export interface PdfAbierto {
  readonly numeroDePaginas: number
  readonly leerPagina: (
    pagina: number
  ) => Effect.Effect<PaginaEtiquetada, PdfIlegible>
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
    const [arbol, contenido] = yield* Effect.tryPromise({
      try: () =>
        Promise.all([
          hoja.getStructTree(),
          hoja.getTextContent({ includeMarkedContent: true }),
        ]),
      catch: (cause) => new PdfIlegible({ sha256, cause }),
    })
    hoja.cleanup()
    return {
      pagina,
      raiz: arbolDePagina(arbol, contenido.items),
    } satisfies PaginaEtiquetada
  })
  return {
    numeroDePaginas: documento.numPages,
    leerPagina,
  } satisfies PdfAbierto
})
