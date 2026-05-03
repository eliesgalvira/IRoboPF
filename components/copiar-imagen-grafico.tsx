"use client"

import * as React from "react"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MARCA_AGUA_GRAFICO = "irobopf.com"
const MIME_PNG = "image/png"
const MIME_SVG = "image/svg+xml;charset=utf-8"
const ESCALA_MAXIMA_EXPORTACION_GRAFICO = 2
export const DIMENSIONES_ESCRITORIO_EXPORTACION_GRAFICO = {
  ancho: 1216,
  alto: 615,
} as const
const TITULO_GRAFICO_EXPORTADO = {
  margenHorizontal: 24,
  margenSuperior: 18,
  margenInferior: 14,
  tamanoFuente: 14,
  altoLinea: 20,
  pesoFuente: "400",
} as const
const LEYENDA_GRAFICO_EXPORTADO = {
  anchoLinea: 18,
  separacionTexto: 10,
} as const
const FAMILIA_MONO_GRAFICO_FALLBACK =
  '"JetBrains Mono", "JetBrains Mono Fallback", monospace'

type EstadoCopiaImagenGrafico = "reposo" | "copiando" | "copiada" | "error"

type TextoSvgExportado = {
  readonly texto: string
  readonly x: number
  readonly y: number
  readonly a: number
  readonly b: number
  readonly c: number
  readonly d: number
  readonly e: number
  readonly f: number
  readonly fill: string
  readonly fontSize: number
  readonly fontStyle: string
  readonly fontWeight: string
  readonly opacity: number
  readonly textAlign: CanvasTextAlign
}

type TituloGraficoExportado = {
  readonly lineas: ReadonlyArray<string>
  readonly alto: number
}

export function BotonCopiarImagenGrafico({
  graficoRef,
  graficoExportacionRef,
  disabled,
  titulo,
}: {
  readonly graficoRef: React.RefObject<HTMLDivElement | null>
  readonly graficoExportacionRef?: React.RefObject<HTMLDivElement | null>
  readonly disabled: boolean
  readonly titulo: string
}) {
  const [estado, fijarEstado] =
    React.useState<EstadoCopiaImagenGrafico>("reposo")
  const temporizadorResetEstado = React.useRef<number | null>(null)
  const copiando = estado === "copiando"

  React.useEffect(
    () => () => {
      if (temporizadorResetEstado.current !== null) {
        window.clearTimeout(temporizadorResetEstado.current)
      }
    },
    []
  )

  const programarResetEstado = React.useCallback(() => {
    if (temporizadorResetEstado.current !== null) {
      window.clearTimeout(temporizadorResetEstado.current)
    }

    temporizadorResetEstado.current = window.setTimeout(() => {
      fijarEstado("reposo")
      temporizadorResetEstado.current = null
    }, 1800)
  }, [])

  const copiarImagen = React.useCallback(async () => {
    const grafico = graficoExportacionRef?.current ?? graficoRef.current
    if (!grafico || copiando) return

    fijarEstado("copiando")
    try {
      await copiarElementoComoImagenAlPortapapeles({
        elemento: grafico,
        titulo,
      })
      fijarEstado("copiada")
    } catch (error) {
      console.error("[IRoboPF][copiar-imagen-grafico]", error)
      fijarEstado("error")
    } finally {
      programarResetEstado()
    }
  }, [
    copiando,
    graficoExportacionRef,
    graficoRef,
    programarResetEstado,
    titulo,
  ])

  const ariaLabel =
    estado === "copiada"
      ? "Imagen de la gráfica copiada"
      : estado === "error"
        ? "No se pudo copiar la imagen de la gráfica"
        : "Copiar imagen de la gráfica"

  return (
    <Button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={disabled || copiando}
      onClick={() => void copiarImagen()}
      className={cn(
        "h-10 w-full border-2 border-[var(--rule)] bg-[var(--rule)] px-3 font-[family-name:var(--mono)] text-sm font-bold tracking-[0.14em] text-[var(--paper)] uppercase shadow-[3px_3px_0_0_var(--rule)] transition-[background-color,color,box-shadow,translate]",
        "hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none sm:w-auto",
        "disabled:translate-y-0 disabled:opacity-45 disabled:shadow-none",
        estado === "copiada" &&
          "bg-[var(--gain)] text-[var(--paper)] hover:bg-[var(--gain)] hover:text-[var(--paper)]",
        estado === "error" &&
          "bg-[var(--danger)] text-[var(--paper)] hover:bg-[var(--danger)] hover:text-[var(--paper)]"
      )}
    >
      <Copy data-icon="inline-start" aria-hidden="true" className="size-4" />
      COPIAR IMAGEN
      <span aria-live="polite" className="sr-only">
        {estado === "copiada"
          ? "Imagen copiada al portapapeles."
          : estado === "error"
            ? "No se pudo copiar la imagen."
            : ""}
      </span>
    </Button>
  )
}

async function copiarElementoComoImagenAlPortapapeles({
  elemento,
  titulo,
}: {
  readonly elemento: HTMLElement
  readonly titulo: string
}) {
  const blob = await convertirElementoEnPng({ elemento, titulo })

  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    await copiarBlobPngConExecCommand(blob)
    return
  }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [MIME_PNG]: blob,
      }),
    ])
    return
  } catch {
    await copiarBlobPngConExecCommand(blob)
  }
}

async function copiarBlobPngConExecCommand(blob: Blob) {
  const dataUrl = await leerBlobComoDataUrl(blob)
  const contenedor = document.createElement("div")
  contenedor.contentEditable = "true"
  contenedor.setAttribute("aria-hidden", "true")
  contenedor.style.position = "fixed"
  contenedor.style.left = "-10000px"
  contenedor.style.top = "0"
  contenedor.style.width = "1px"
  contenedor.style.height = "1px"
  contenedor.style.overflow = "hidden"

  const imagen = document.createElement("img")
  imagen.alt = MARCA_AGUA_GRAFICO
  imagen.src = dataUrl
  contenedor.appendChild(imagen)
  document.body.appendChild(contenedor)

  try {
    await imagen.decode().catch(() => undefined)
    const rango = document.createRange()
    rango.selectNode(imagen)
    const seleccion = window.getSelection()
    seleccion?.removeAllRanges()
    seleccion?.addRange(rango)

    const copiado = document.execCommand("copy")
    seleccion?.removeAllRanges()
    if (!copiado) {
      throw new Error("document.execCommand('copy') devolvio false.")
    }
  } finally {
    contenedor.remove()
  }
}

function leerBlobComoDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => {
      if (typeof lector.result === "string") {
        resolve(lector.result)
        return
      }

      reject(new Error("No se pudo leer el PNG como data URL."))
    }
    lector.onerror = () =>
      reject(lector.error ?? new Error("No se pudo leer el PNG."))
    lector.readAsDataURL(blob)
  })
}

async function convertirElementoEnPng({
  elemento,
  titulo,
}: {
  readonly elemento: HTMLElement
  readonly titulo: string
}): Promise<Blob> {
  await esperarFrame()
  return await convertirElementoRenderizadoEnPng({
    elemento,
    titulo,
  })
}

function esperarFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

async function convertirElementoRenderizadoEnPng({
  elemento,
  titulo,
}: {
  readonly elemento: HTMLElement
  readonly titulo: string
}): Promise<Blob> {
  const { width, height } = elemento.getBoundingClientRect()
  const ancho = Math.ceil(width)
  const alto = Math.ceil(height)
  if (ancho <= 0 || alto <= 0) {
    throw new Error("La grafica no tiene dimensiones exportables.")
  }

  const grafico = obtenerSvgPrincipalGrafico(elemento)
  if (!grafico) {
    throw new Error("No se encontro el SVG de Recharts para exportar.")
  }

  await document.fonts?.ready.catch(() => undefined)
  const familiaFuente = obtenerFamiliaFuenteGrafico(elemento)
  const textos = recolectarTextosSvgGrafico({ elemento, grafico })
  const url = crearUrlSvgDesdeElemento({ elemento, grafico, ancho, alto })

  try {
    const imagen = await cargarImagen(url)

    const escala = Math.min(
      Math.max(window.devicePixelRatio || 1, 1),
      ESCALA_MAXIMA_EXPORTACION_GRAFICO
    )
    const canvas = document.createElement("canvas")
    canvas.width = Math.ceil(ancho * escala)
    canvas.height = Math.ceil(alto * escala)
    const contexto = canvas.getContext("2d")
    if (!contexto) {
      throw new Error("No se pudo preparar el lienzo de exportacion.")
    }

    const tituloGrafico = prepararTituloGraficoExportado({
      contexto,
      titulo,
      ancho,
      familiaFuente,
    })
    const altoTotal = alto + tituloGrafico.alto

    canvas.width = Math.ceil(ancho * escala)
    canvas.height = Math.ceil(altoTotal * escala)
    contexto.scale(escala, escala)
    contexto.fillStyle = leerColorCss(elemento, "--paper", "rgb(255 255 255)")
    contexto.fillRect(0, 0, ancho, altoTotal)
    dibujarTituloGraficoExportado({
      contexto,
      elemento,
      tituloGrafico,
      familiaFuente,
    })
    contexto.save()
    contexto.translate(0, tituloGrafico.alto)
    contexto.drawImage(imagen, 0, 0, ancho, alto)
    dibujarTextosSvgGrafico({ contexto, textos, familiaFuente })
    dibujarLeyendaGrafico({ contexto, elemento, ancho, familiaFuente })
    dibujarMarcaAguaGrafico({
      contexto,
      elemento,
      ancho,
      familiaFuente,
    })
    contexto.restore()

    return await convertirCanvasEnBlob(canvas)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function prepararTituloGraficoExportado({
  contexto,
  titulo,
  ancho,
  familiaFuente,
}: {
  readonly contexto: CanvasRenderingContext2D
  readonly titulo: string
  readonly ancho: number
  readonly familiaFuente: string
}): TituloGraficoExportado {
  const tituloNormalizado = titulo.trim()
  if (!tituloNormalizado) {
    return { lineas: [], alto: 0 }
  }

  contexto.save()
  contexto.font = fuenteTituloGraficoExportado(familiaFuente)
  const anchoMaximo = Math.max(
    1,
    ancho - TITULO_GRAFICO_EXPORTADO.margenHorizontal * 2
  )
  const lineas = partirTextoEnLineasCanvas({
    contexto,
    texto: tituloNormalizado,
    anchoMaximo,
  })
  contexto.restore()

  return {
    lineas,
    alto:
      TITULO_GRAFICO_EXPORTADO.margenSuperior +
      lineas.length * TITULO_GRAFICO_EXPORTADO.altoLinea +
      TITULO_GRAFICO_EXPORTADO.margenInferior,
  }
}

function dibujarTituloGraficoExportado({
  contexto,
  elemento,
  tituloGrafico,
  familiaFuente,
}: {
  readonly contexto: CanvasRenderingContext2D
  readonly elemento: HTMLElement
  readonly tituloGrafico: TituloGraficoExportado
  readonly familiaFuente: string
}) {
  if (tituloGrafico.lineas.length === 0) return

  contexto.save()
  contexto.fillStyle = leerColorCss(elemento, "--ink-soft", "rgb(48 48 48)")
  contexto.font = fuenteTituloGraficoExportado(familiaFuente)
  contexto.textAlign = "left"
  contexto.textBaseline = "top"

  tituloGrafico.lineas.forEach((linea, indice) => {
    contexto.fillText(
      linea,
      TITULO_GRAFICO_EXPORTADO.margenHorizontal,
      TITULO_GRAFICO_EXPORTADO.margenSuperior +
        indice * TITULO_GRAFICO_EXPORTADO.altoLinea
    )
  })
  contexto.restore()
}

function fuenteTituloGraficoExportado(familiaFuente: string) {
  return `${TITULO_GRAFICO_EXPORTADO.pesoFuente} ${TITULO_GRAFICO_EXPORTADO.tamanoFuente}px ${familiaFuente}`
}

function partirTextoEnLineasCanvas({
  contexto,
  texto,
  anchoMaximo,
}: {
  readonly contexto: CanvasRenderingContext2D
  readonly texto: string
  readonly anchoMaximo: number
}) {
  const palabras = texto.split(/\s+/).filter(Boolean)
  const lineas: string[] = []
  let lineaActual = ""

  for (const palabra of palabras) {
    const candidata = lineaActual ? `${lineaActual} ${palabra}` : palabra
    if (!lineaActual || contexto.measureText(candidata).width <= anchoMaximo) {
      lineaActual = candidata
      continue
    }

    lineas.push(lineaActual)
    lineaActual = palabra
  }

  if (lineaActual) {
    lineas.push(lineaActual)
  }

  return lineas
}

function crearUrlSvgDesdeElemento({
  elemento,
  grafico,
  ancho,
  alto,
}: {
  readonly elemento: HTMLElement
  readonly grafico: SVGSVGElement
  readonly ancho: number
  readonly alto: number
}) {
  const rectContenedor = elemento.getBoundingClientRect()
  const rectGrafico = grafico.getBoundingClientRect()
  const anchoGrafico = Math.max(1, Math.ceil(rectGrafico.width))
  const altoGrafico = Math.max(1, Math.ceil(rectGrafico.height))
  const graficoClonado = grafico.cloneNode(true) as SVGSVGElement
  copiarEstilosComputados(grafico, graficoClonado)
  graficoClonado.querySelectorAll("text").forEach((texto) => texto.remove())
  graficoClonado.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  graficoClonado.setAttribute(
    "x",
    numeroSvg(rectGrafico.left - rectContenedor.left)
  )
  graficoClonado.setAttribute(
    "y",
    numeroSvg(rectGrafico.top - rectContenedor.top)
  )
  graficoClonado.setAttribute("width", String(anchoGrafico))
  graficoClonado.setAttribute("height", String(altoGrafico))
  graficoClonado.style.width = `${anchoGrafico}px`
  graficoClonado.style.height = `${altoGrafico}px`
  if (!graficoClonado.getAttribute("viewBox")) {
    graficoClonado.setAttribute("viewBox", `0 0 ${anchoGrafico} ${altoGrafico}`)
  }

  const fondo = escaparAtributoSvg(
    leerColorCss(elemento, "--paper", "rgb(255 255 255)")
  )
  const contenido = new XMLSerializer().serializeToString(graficoClonado)
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}">`,
    `<rect x="0" y="0" width="100%" height="100%" fill="${fondo}" />`,
    contenido,
    "</svg>",
  ].join("")

  return URL.createObjectURL(new Blob([svg], { type: MIME_SVG }))
}

function obtenerSvgPrincipalGrafico(elemento: HTMLElement) {
  const superficies = Array.from(
    elemento.querySelectorAll<SVGSVGElement>("svg.recharts-surface")
  )
  const candidatas = superficies
    .map((superficie) => {
      const rect = superficie.getBoundingClientRect()
      return {
        superficie,
        area: rect.width * rect.height,
      }
    })
    .sort((a, b) => b.area - a.area)

  return candidatas[0]?.superficie ?? null
}

function recolectarTextosSvgGrafico({
  elemento,
  grafico,
}: {
  readonly elemento: HTMLElement
  readonly grafico: SVGSVGElement
}) {
  const rectContenedor = elemento.getBoundingClientRect()

  return Array.from(grafico.querySelectorAll<SVGTextElement>("text")).flatMap(
    (texto) => {
      const contenido = texto.textContent?.trim()
      const matriz = texto.getScreenCTM()
      if (!contenido || !matriz) return []

      const estilos = window.getComputedStyle(texto)
      const opacidad = parseFloat(estilos.opacity)
      const fill = normalizarColorCss(estilos.fill || estilos.color)
      if (!fill || fill === "none") return []

      return [
        {
          texto: contenido,
          x: texto.x.baseVal[0]?.value ?? 0,
          y: texto.y.baseVal[0]?.value ?? 0,
          a: matriz.a,
          b: matriz.b,
          c: matriz.c,
          d: matriz.d,
          e: matriz.e - rectContenedor.left,
          f: matriz.f - rectContenedor.top,
          fill,
          fontSize: parseFloat(estilos.fontSize) || 14,
          fontStyle: estilos.fontStyle || "normal",
          fontWeight: estilos.fontWeight || "400",
          opacity: Number.isFinite(opacidad) ? opacidad : 1,
          textAlign: alinearTextoCanvas(estilos.textAnchor),
        } satisfies TextoSvgExportado,
      ]
    }
  )
}

function dibujarTextosSvgGrafico({
  contexto,
  textos,
  familiaFuente,
}: {
  readonly contexto: CanvasRenderingContext2D
  readonly textos: ReadonlyArray<TextoSvgExportado>
  readonly familiaFuente: string
}) {
  for (const texto of textos) {
    contexto.save()
    contexto.transform(texto.a, texto.b, texto.c, texto.d, texto.e, texto.f)
    contexto.globalAlpha = texto.opacity
    contexto.fillStyle = texto.fill
    contexto.font = `${texto.fontStyle} ${texto.fontWeight} ${texto.fontSize}px ${familiaFuente}`
    contexto.textAlign = texto.textAlign
    contexto.textBaseline = "alphabetic"
    contexto.fillText(texto.texto, texto.x, texto.y)
    contexto.restore()
  }
}

function dibujarLeyendaGrafico({
  contexto,
  elemento,
  ancho,
  familiaFuente,
}: {
  readonly contexto: CanvasRenderingContext2D
  readonly elemento: HTMLElement
  readonly ancho: number
  readonly familiaFuente: string
}) {
  const leyenda = elemento.querySelector<HTMLElement>(
    ".recharts-legend-wrapper"
  )
  if (!leyenda) return

  const rectContenedor = elemento.getBoundingClientRect()
  const items = Array.from(
    leyenda.querySelectorAll<HTMLElement>(".recharts-legend-item")
  ).flatMap((item) => {
    const texto = item.textContent?.trim()
    if (!texto) return []

    const rectItem = item.getBoundingClientRect()
    const textoItem = item.querySelector<HTMLElement>("span")
    const elementoTrazo = item.querySelector<SVGElement>(
      "path, line, rect, circle"
    )
    const estilosTexto = window.getComputedStyle(textoItem ?? item)
    const estilosTrazo = elementoTrazo
      ? window.getComputedStyle(elementoTrazo)
      : estilosTexto
    const colorTexto = normalizarColorCss(estilosTexto.color)
    const colorTrazo = normalizarColorCss(
      colorSvgDesdeEstilo(estilosTrazo.stroke) ||
        colorSvgDesdeEstilo(estilosTrazo.fill) ||
        estilosTexto.color
    )

    return [
      {
        texto,
        colorTexto,
        colorTrazo,
        fontSize: parseFloat(estilosTexto.fontSize) || 14,
        y: rectItem.top - rectContenedor.top + rectItem.height / 2,
      },
    ]
  })

  if (items.length === 0) return

  const fontSize = Math.max(...items.map((item) => item.fontSize))
  const fuente = `700 ${fontSize}px ${familiaFuente}`
  contexto.save()
  contexto.font = fuente
  const anchoItems = items.map((item) => {
    const anchoTexto = contexto.measureText(item.texto).width
    return (
      LEYENDA_GRAFICO_EXPORTADO.anchoLinea +
      LEYENDA_GRAFICO_EXPORTADO.separacionTexto +
      anchoTexto
    )
  })
  const separacionItems = 32
  const anchoTotal =
    anchoItems.reduce((total, anchoItem) => total + anchoItem, 0) +
    separacionItems * Math.max(0, items.length - 1)
  const margenDerecho = 24
  let x = Math.max(0, ancho - margenDerecho - anchoTotal)
  const y =
    items.reduce((total, item) => total + item.y, 0) / Math.max(1, items.length)

  for (const [indice, item] of items.entries()) {
    contexto.strokeStyle = item.colorTrazo
    contexto.lineWidth = 3
    contexto.lineCap = "square"
    contexto.beginPath()
    contexto.moveTo(x, y)
    contexto.lineTo(x + LEYENDA_GRAFICO_EXPORTADO.anchoLinea, y)
    contexto.stroke()
    contexto.fillStyle = item.colorTexto
    contexto.font = fuente
    contexto.textAlign = "left"
    contexto.textBaseline = "middle"
    contexto.fillText(
      item.texto,
      x +
        LEYENDA_GRAFICO_EXPORTADO.anchoLinea +
        LEYENDA_GRAFICO_EXPORTADO.separacionTexto,
      y
    )
    x += anchoItems[indice] + separacionItems
  }
  contexto.restore()
}

function alinearTextoCanvas(textAnchor: string): CanvasTextAlign {
  if (textAnchor === "middle") return "center"
  if (textAnchor === "end") return "right"
  return "left"
}

function colorSvgDesdeEstilo(color: string) {
  if (!color || color === "none") return null
  return color
}

function numeroSvg(numero: number) {
  if (!Number.isFinite(numero)) return "0"
  return numero.toFixed(2).replace(/\.?0+$/, "")
}

function escaparTextoSvg(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function escaparAtributoSvg(valor: string) {
  return escaparTextoSvg(valor).replace(/"/g, "&quot;")
}

function copiarEstilosComputados(origen: Element, destino: Element) {
  if (destino instanceof HTMLElement || destino instanceof SVGElement) {
    const estilos = window.getComputedStyle(origen)
    for (const propiedad of estilos) {
      const valor = resolverVariablesCss(
        estilos.getPropertyValue(propiedad),
        origen
      )
      destino.style.setProperty(
        propiedad,
        esPropiedadColorSvg(propiedad) ? normalizarColorCss(valor) : valor,
        estilos.getPropertyPriority(propiedad)
      )
    }
  }

  for (const atributo of Array.from(destino.attributes)) {
    if (!atributo.value.includes("var(") && atributo.value !== "currentColor") {
      continue
    }

    destino.setAttribute(
      atributo.name,
      resolverValorSvg(atributo.value, origen)
    )
  }

  const hijosOrigen = Array.from(origen.children)
  const hijosDestino = Array.from(destino.children)
  hijosOrigen.forEach((hijoOrigen, indice) => {
    const hijoDestino = hijosDestino[indice]
    if (hijoDestino) copiarEstilosComputados(hijoOrigen, hijoDestino)
  })
}

function resolverValorSvg(valor: string, origen: Element) {
  const resuelto = resolverVariablesCss(valor, origen)
  if (resuelto === "currentColor") {
    return window.getComputedStyle(origen).color
  }

  return normalizarColorCss(resuelto)
}

function resolverVariablesCss(valor: string, origen: Element) {
  let resuelto = valor
  for (
    let intento = 0;
    intento < 4 && resuelto.includes("var(");
    intento += 1
  ) {
    resuelto = resuelto.replace(
      /var\((--[\w-]+)(?:,\s*([^)]+))?\)/g,
      (_, variable: string, fallback: string | undefined) =>
        window.getComputedStyle(origen).getPropertyValue(variable).trim() ||
        fallback?.trim() ||
        ""
    )
  }

  return resuelto
}

function normalizarColorCss(valor: string) {
  if (
    !valor ||
    valor === "none" ||
    valor === "inherit" ||
    valor.startsWith("url(")
  ) {
    return valor
  }

  const prueba = document.createElement("span")
  prueba.style.display = "none"
  prueba.style.color = valor
  document.body.appendChild(prueba)
  const color = window.getComputedStyle(prueba).color
  prueba.remove()
  return color || valor
}

function esPropiedadColorSvg(propiedad: string) {
  return (
    propiedad === "color" ||
    propiedad === "fill" ||
    propiedad === "stroke" ||
    propiedad === "stop-color" ||
    propiedad === "flood-color" ||
    propiedad === "lighting-color"
  )
}

async function cargarImagen(url: string): Promise<HTMLImageElement> {
  const imagen = new Image()
  imagen.decoding = "async"

  const carga = new Promise<HTMLImageElement>((resolve, reject) => {
    imagen.onload = () => resolve(imagen)
    imagen.onerror = () =>
      reject(new Error("No se pudo renderizar la grafica como imagen."))
  })

  imagen.src = url
  return await carga
}

function dibujarMarcaAguaGrafico({
  contexto,
  elemento,
  ancho,
  familiaFuente,
}: {
  readonly contexto: CanvasRenderingContext2D
  readonly elemento: HTMLElement
  readonly ancho: number
  readonly familiaFuente: string
}) {
  const margen = 12
  const rellenoHorizontal = 8
  const rellenoVertical = 5
  const altoCaja = 24
  const tinta = leerColorCss(elemento, "--ink", "rgb(17 17 17)")
  const papel = leerColorCss(elemento, "--paper", "rgb(255 255 255)")

  contexto.save()
  contexto.font = `700 14px ${familiaFuente}`
  contexto.textAlign = "right"
  contexto.textBaseline = "bottom"

  const anchoTexto = contexto.measureText(MARCA_AGUA_GRAFICO).width
  const anchoCaja = Math.ceil(anchoTexto + rellenoHorizontal * 2)
  const x = obtenerXMarcaAguaGrafico({
    elemento,
    ancho,
    margen,
    anchoCaja,
  })
  const y = obtenerYMarcaAguaGrafico({
    elemento,
    margen,
    altoCaja,
  })

  contexto.globalAlpha = 0.92
  contexto.fillStyle = papel
  contexto.fillRect(x - anchoCaja, y - altoCaja, anchoCaja, altoCaja)
  contexto.globalAlpha = 1
  contexto.strokeStyle = tinta
  contexto.lineWidth = 1
  contexto.strokeRect(x - anchoCaja, y - altoCaja, anchoCaja, altoCaja)
  contexto.fillStyle = tinta
  contexto.fillText(
    MARCA_AGUA_GRAFICO,
    x - rellenoHorizontal,
    y - rellenoVertical
  )
  contexto.restore()
}

function obtenerXMarcaAguaGrafico({
  elemento,
  ancho,
  margen,
  anchoCaja,
}: {
  readonly elemento: HTMLElement
  readonly ancho: number
  readonly margen: number
  readonly anchoCaja: number
}) {
  const rectContenedor = elemento.getBoundingClientRect()
  const limitesEjeDerecho = [
    ...Array.from(
      elemento.querySelectorAll<SVGGraphicsElement>(
        ".recharts-yAxis .recharts-cartesian-axis-line"
      )
    ).flatMap((linea) => {
      const rect = linea.getBoundingClientRect()
      const izquierda = rect.left - rectContenedor.left
      if (
        rect.height <= rect.width ||
        rect.height === 0 ||
        izquierda <= ancho * 0.72
      ) {
        return []
      }

      return [izquierda]
    }),
    ...Array.from(
      elemento.querySelectorAll<SVGTextElement>(".recharts-yAxis text")
    ).flatMap((texto) => {
      const izquierda = obtenerIzquierdaTextoSvg({
        texto,
        rectContenedor,
      })
      if (izquierda === null || izquierda <= ancho * 0.72) {
        return []
      }

      return [izquierda]
    }),
  ]

  const xPorDefecto = ancho - margen
  if (limitesEjeDerecho.length === 0) return xPorDefecto

  const limiteIzquierdoEjeDerecho = Math.min(...limitesEjeDerecho)
  return Math.max(
    margen + anchoCaja,
    Math.min(xPorDefecto, limiteIzquierdoEjeDerecho - margen)
  )
}

function obtenerIzquierdaTextoSvg({
  texto,
  rectContenedor,
}: {
  readonly texto: SVGTextElement
  readonly rectContenedor: DOMRect
}) {
  const matriz = texto.getScreenCTM()
  if (!matriz) return null

  const estilos = window.getComputedStyle(texto)
  const xTexto =
    matriz.e - rectContenedor.left + (texto.x.baseVal[0]?.value ?? 0)
  const anchoTexto = obtenerAnchoTextoSvg(texto)

  if (estilos.textAnchor === "end") return xTexto - anchoTexto
  if (estilos.textAnchor === "middle") return xTexto - anchoTexto / 2
  return xTexto
}

function obtenerAnchoTextoSvg(texto: SVGTextElement) {
  try {
    const ancho = texto.getComputedTextLength()
    if (Number.isFinite(ancho) && ancho > 0) return ancho
  } catch {}

  try {
    const caja = texto.getBBox()
    if (Number.isFinite(caja.width) && caja.width > 0) return caja.width
  } catch {}

  return 0
}

function obtenerFamiliaFuenteGrafico(elemento: HTMLElement) {
  const estilos = window.getComputedStyle(elemento)
  const familiaVariable = estilos.getPropertyValue("--mono").trim()
  return familiaVariable || estilos.fontFamily || FAMILIA_MONO_GRAFICO_FALLBACK
}

function obtenerYMarcaAguaGrafico({
  elemento,
  margen,
  altoCaja,
}: {
  readonly elemento: HTMLElement
  readonly margen: number
  readonly altoCaja: number
}) {
  const rectContenedor = elemento.getBoundingClientRect()
  const lineasEje = Array.from(
    elemento.querySelectorAll<SVGGraphicsElement>(
      ".recharts-xAxis .recharts-cartesian-axis-line, .recharts-cartesian-axis-line"
    )
  )
  const lineaHorizontal = lineasEje
    .map((linea) => linea.getBoundingClientRect())
    .filter((rect) => rect.width >= rect.height)
    .sort((a, b) => b.width - a.width)[0]

  if (lineaHorizontal) {
    return Math.max(
      margen + altoCaja,
      lineaHorizontal.top - rectContenedor.top - margen
    )
  }

  const grafico = obtenerSvgPrincipalGrafico(elemento)
  if (grafico) {
    const rectGrafico = grafico.getBoundingClientRect()
    return Math.max(
      margen + altoCaja,
      rectGrafico.bottom - rectContenedor.top - margen - 72
    )
  }

  return margen + altoCaja
}

function leerColorCss(
  elemento: HTMLElement,
  variable: string,
  fallback: string
) {
  const valor = window.getComputedStyle(elemento).getPropertyValue(variable)
  const prueba = document.createElement("span")
  prueba.style.display = "none"
  prueba.style.color = fallback
  prueba.style.color = valor.trim() || fallback
  elemento.appendChild(prueba)
  const color = window.getComputedStyle(prueba).color
  prueba.remove()
  return color || fallback
}

function convertirCanvasEnBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
        return
      }

      reject(new Error("No se pudo generar la imagen PNG."))
    }, MIME_PNG)
  })
}
