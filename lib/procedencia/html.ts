import { Result } from "effect"
import { parse, type DefaultTreeAdapterTypes } from "parse5"

import { normalizar } from "./literales"

type Nodo = DefaultTreeAdapterTypes.ChildNode
type Elemento = DefaultTreeAdapterTypes.Element
type Padre = DefaultTreeAdapterTypes.ParentNode

export interface Posicion {
  readonly linea: number
  readonly columnaFuente: number
}

export interface ProblemaEstructura extends Posicion {
  readonly motivo: string
}

export interface Bloque extends Posicion {
  readonly texto: string
}

export interface CeldaHtml extends Posicion {
  readonly elemento: "th" | "td"
  readonly texto: string
  readonly bloques: ReadonlyArray<Bloque>
}

export interface FilaHtml extends Posicion {
  readonly celdas: ReadonlyArray<CeldaHtml>
}

export interface TablaHtml extends Posicion {
  readonly caption: string | null
  readonly filas: ReadonlyArray<FilaHtml>
}

export interface TablaDelDocumento extends Posicion {
  readonly caption: string | null
  readonly elemento: Elemento
}

// Elementos que sólo dan formato: su texto se une al texto que los rodea.
const EN_LINEA = new Set([
  "a",
  "abbr",
  "b",
  "em",
  "i",
  "span",
  "strong",
  "sub",
  "sup",
  "u",
])
const BLOQUES = new Set(["p", "li"])
const LISTAS = new Set(["ul", "ol"])

const esElemento = (nodo: Nodo): nodo is Elemento => "tagName" in nodo

const posicion = (nodo: Nodo | Elemento): Posicion => ({
  linea: nodo.sourceCodeLocation?.startLine ?? 0,
  columnaFuente: nodo.sourceCodeLocation?.startCol ?? 0,
})

const problema = (nodo: Nodo, motivo: string): ProblemaEstructura => ({
  ...posicion(nodo),
  motivo,
})

const esTextoVacio = (nodo: Nodo): boolean =>
  nodo.nodeName === "#comment" ||
  (nodo.nodeName === "#text" &&
    "value" in nodo &&
    normalizar(nodo.value) === "")

const elementosDescendientes = (
  padre: Padre,
  etiqueta: string
): ReadonlyArray<Elemento> =>
  padre.childNodes.flatMap((nodo) =>
    esElemento(nodo)
      ? [
          ...(nodo.tagName === etiqueta ? [nodo] : []),
          ...elementosDescendientes(nodo, etiqueta),
        ]
      : []
  )

export const tablasDelDocumento = (
  html: string
): ReadonlyArray<TablaDelDocumento> =>
  elementosDescendientes(
    parse(html, { sourceCodeLocationInfo: true }),
    "table"
  ).map((elemento) => {
    const caption = elemento.childNodes.find(
      (nodo): nodo is Elemento => esElemento(nodo) && nodo.tagName === "caption"
    )
    return {
      ...posicion(elemento),
      caption: caption === undefined ? null : normalizar(textoCrudo(caption)),
      elemento,
    }
  })

const textoCrudo = (padre: Padre): string =>
  padre.childNodes
    .map((nodo) =>
      nodo.nodeName === "#text" && "value" in nodo
        ? nodo.value
        : esElemento(nodo)
          ? textoCrudo(nodo)
          : ""
    )
    .join("")

const textoEnLinea = (
  elemento: Elemento
): Result.Result<string, ProblemaEstructura> => {
  const partes: Array<string> = []
  for (const nodo of elemento.childNodes) {
    if (nodo.nodeName === "#text" && "value" in nodo) {
      partes.push(nodo.value)
    } else if (esElemento(nodo)) {
      if (!EN_LINEA.has(nodo.tagName)) {
        return Result.fail(
          problema(
            nodo,
            `elemento <${nodo.tagName}> no admitido dentro de texto`
          )
        )
      }
      const interior = textoEnLinea(nodo)
      if (Result.isFailure(interior)) {
        return Result.fail(interior.failure)
      }
      partes.push(interior.success)
    }
  }
  return Result.succeed(partes.join(""))
}

const bloquesDe = (
  padre: Padre
): Result.Result<ReadonlyArray<Bloque>, ProblemaEstructura> => {
  const bloques: Array<Bloque> = []
  let corrida: { texto: string; inicio: Posicion } | null = null
  const cerrarCorrida = () => {
    if (corrida !== null && normalizar(corrida.texto) !== "") {
      bloques.push({ ...corrida.inicio, texto: normalizar(corrida.texto) })
    }
    corrida = null
  }
  const anadirACorrida = (texto: string, nodo: Nodo) => {
    corrida =
      corrida === null
        ? { texto, inicio: posicion(nodo) }
        : { texto: corrida.texto + texto, inicio: corrida.inicio }
  }
  for (const nodo of padre.childNodes) {
    if (nodo.nodeName === "#comment") {
      continue
    }
    if (nodo.nodeName === "#text" && "value" in nodo) {
      anadirACorrida(nodo.value, nodo)
      continue
    }
    if (!esElemento(nodo)) {
      return Result.fail(problema(nodo, `nodo ${nodo.nodeName} no admitido`))
    }
    if (EN_LINEA.has(nodo.tagName)) {
      const texto = textoEnLinea(nodo)
      if (Result.isFailure(texto)) {
        return Result.fail(texto.failure)
      }
      anadirACorrida(texto.success, nodo)
      continue
    }
    if (BLOQUES.has(nodo.tagName)) {
      cerrarCorrida()
      const texto = textoEnLinea(nodo)
      if (Result.isFailure(texto)) {
        return Result.fail(texto.failure)
      }
      if (normalizar(texto.success) !== "") {
        bloques.push({ ...posicion(nodo), texto: normalizar(texto.success) })
      }
      continue
    }
    if (LISTAS.has(nodo.tagName)) {
      cerrarCorrida()
      for (const hijo of nodo.childNodes) {
        if (esTextoVacio(hijo)) {
          continue
        }
        if (!esElemento(hijo) || hijo.tagName !== "li") {
          return Result.fail(
            problema(hijo, `una lista sólo admite <li>, no ${hijo.nodeName}`)
          )
        }
        const texto = textoEnLinea(hijo)
        if (Result.isFailure(texto)) {
          return Result.fail(texto.failure)
        }
        if (normalizar(texto.success) !== "") {
          bloques.push({ ...posicion(hijo), texto: normalizar(texto.success) })
        }
      }
      continue
    }
    return Result.fail(
      problema(nodo, `elemento <${nodo.tagName}> no admitido en una celda`)
    )
  }
  cerrarCorrida()
  return Result.succeed(bloques)
}

const celdaDe = (
  elemento: Elemento
): Result.Result<CeldaHtml, ProblemaEstructura> => {
  const combinada = elemento.attrs.find(
    (atributo) =>
      (atributo.name === "colspan" || atributo.name === "rowspan") &&
      atributo.value.trim() !== "1"
  )
  if (combinada !== undefined) {
    return Result.fail(
      problema(
        elemento,
        `celda combinada (${combinada.name}="${combinada.value}") no admitida`
      )
    )
  }
  return Result.map(bloquesDe(elemento), (bloques) => ({
    ...posicion(elemento),
    elemento: elemento.tagName === "th" ? "th" : "td",
    texto: bloques.map((bloque) => bloque.texto).join(" "),
    bloques,
  }))
}

const filaDe = (tr: Elemento): Result.Result<FilaHtml, ProblemaEstructura> => {
  const celdas: Array<CeldaHtml> = []
  for (const nodo of tr.childNodes) {
    if (esTextoVacio(nodo)) {
      continue
    }
    if (!esElemento(nodo) || (nodo.tagName !== "th" && nodo.tagName !== "td")) {
      return Result.fail(
        problema(nodo, `una fila sólo admite <th> y <td>, no ${nodo.nodeName}`)
      )
    }
    const celda = celdaDe(nodo)
    if (Result.isFailure(celda)) {
      return Result.fail(celda.failure)
    }
    celdas.push(celda.success)
  }
  return Result.succeed({ ...posicion(tr), celdas })
}

const SECCIONES = new Set(["thead", "tbody", "tfoot"])

export const modeloDeTabla = (
  tabla: TablaDelDocumento
): Result.Result<TablaHtml, ProblemaEstructura> => {
  const anidada = elementosDescendientes(tabla.elemento, "table")[0]
  if (anidada !== undefined) {
    return Result.fail(problema(anidada, "tabla anidada no admitida"))
  }
  const filas: Array<FilaHtml> = []
  const leerFilas = (
    padre: Elemento
  ): Result.Result<void, ProblemaEstructura> => {
    for (const nodo of padre.childNodes) {
      if (esTextoVacio(nodo)) {
        continue
      }
      if (esElemento(nodo) && nodo.tagName === "tr") {
        const fila = filaDe(nodo)
        if (Result.isFailure(fila)) {
          return Result.fail(fila.failure)
        }
        filas.push(fila.success)
        continue
      }
      if (
        padre === tabla.elemento &&
        esElemento(nodo) &&
        (nodo.tagName === "caption" ||
          nodo.tagName === "colgroup" ||
          SECCIONES.has(nodo.tagName))
      ) {
        if (SECCIONES.has(nodo.tagName)) {
          const seccion = leerFilas(nodo)
          if (Result.isFailure(seccion)) {
            return Result.fail(seccion.failure)
          }
        }
        continue
      }
      return Result.fail(
        problema(
          nodo,
          `nodo ${nodo.nodeName} no admitido en <${padre.tagName}>`
        )
      )
    }
    return Result.succeed(undefined)
  }
  return Result.map(leerFilas(tabla.elemento), () => ({
    linea: tabla.linea,
    columnaFuente: tabla.columnaFuente,
    caption: tabla.caption,
    filas,
  }))
}
