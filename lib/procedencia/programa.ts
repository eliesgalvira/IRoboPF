import {
  DateTime,
  Effect,
  FileSystem,
  Path,
  Result,
  Schema,
  SchemaGetter,
  SchemaTransformation,
} from "effect"
import { HttpClient } from "effect/unstable/http"

import { cotejar } from "./cotejo"
import {
  Especificacion,
  EspecificacionDesdeJson,
  Manifiesto,
  ManifiestoDesdeJson,
  type DocumentoManifiesto,
} from "./especificacion"
import {
  DescargaFallida,
  DocumentoNoDisponible,
  EspecificacionInvalida,
  PaginaInexistente,
  ResultadoIlegible,
} from "./excepciones"
import { extraerCuadro, extraerEscala } from "./extraccion"
import { proyectarMotor2025 } from "./motor-2025"
import {
  ColaExcepciones,
  EntradaCotejo,
  ExtraccionTabla,
  ExtraccionTablaDesdeJson,
  Resumen,
} from "./resultado"
import {
  abrirPdf,
  atestiguar,
  localizarTablaPdf,
  trozosDeTablas,
  type Correspondencia,
  type PaginaEtiquetada,
  type PdfAbierto,
} from "./testigo-pdf"
import { compararTexto } from "./vocabulario"

export const RUTAS = {
  manifiesto: "procedencia/fuentes/manifiesto.json",
  especificaciones: "procedencia/especificaciones/2025",
  extraccion: "procedencia/resultados/2025/extraccion",
  cotejo: "procedencia/resultados/2025/cotejo.json",
  excepciones: "procedencia/resultados/2025/excepciones.json",
  resumen: "procedencia/resultados/2025/resumen.json",
} as const

const jsonLegible = <S extends Schema.Top>(schema: S) =>
  Schema.String.pipe(
    Schema.decodeTo(
      schema,
      new SchemaTransformation.Transformation<unknown, string>(
        SchemaGetter.parseJson(),
        SchemaGetter.stringifyJson({ space: 2 })
      )
    )
  )

export const textoJson = <
  S extends Schema.Top & { readonly EncodingServices: never },
>(
  schema: S,
  valor: S["Type"]
) =>
  Schema.encodeEffect(jsonLegible(schema))(valor).pipe(
    Effect.map((texto) => `${texto}\n`)
  )

// El cotejo es largo: una entrada por línea para que cada cambio del motor o
// del manual sea una línea del diff.
const lineaDeCotejo = Schema.encodeEffect(Schema.fromJsonString(EntradaCotejo))

export const textoCotejo = (entradas: ReadonlyArray<EntradaCotejo>) =>
  Effect.forEach(entradas, (entrada) => lineaDeCotejo(entrada)).pipe(
    Effect.map((lineas) => `[\n${lineas.join(",\n")}\n]\n`)
  )

const escribir = Effect.fn("procedencia.escribir")(function* <E>(
  ruta: string,
  texto: Effect.Effect<string, E>
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const contenido = yield* texto.pipe(
    Effect.mapError(
      (error) =>
        new ResultadoIlegible({ archivo: ruta, detalle: String(error) })
    )
  )
  yield* fs.makeDirectory(path.dirname(ruta), { recursive: true })
  yield* fs.writeFileString(ruta, contenido)
})

const escribirJson = <
  S extends Schema.Top & { readonly EncodingServices: never },
>(
  ruta: string,
  schema: S,
  valor: S["Type"]
) => escribir(ruta, textoJson(schema, valor))

const sha256Hex = (bytes: Uint8Array) =>
  Effect.promise(() => crypto.subtle.digest("SHA-256", bytes.slice())).pipe(
    Effect.map((resumen) =>
      Array.from(new Uint8Array(resumen), (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("")
    )
  )

const leerManifiesto = Effect.fn("procedencia.leerManifiesto")(function* () {
  const fs = yield* FileSystem.FileSystem
  if (!(yield* fs.exists(RUTAS.manifiesto))) {
    return { documentos: [] } satisfies Manifiesto
  }
  return yield* fs.readFileString(RUTAS.manifiesto).pipe(
    Effect.flatMap(Schema.decodeUnknownEffect(ManifiestoDesdeJson)),
    Effect.mapError(
      (error) =>
        new EspecificacionInvalida({
          archivo: RUTAS.manifiesto,
          detalle: error.message,
        })
    )
  )
})

const leerDelAlmacen = Effect.fn("procedencia.documento")(function* (
  almacen: string,
  sha256: string,
  manifiesto: Manifiesto
) {
  yield* Effect.annotateCurrentSpan({ sha256 })
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  if (!manifiesto.documentos.some((documento) => documento.sha256 === sha256)) {
    return yield* new DocumentoNoDisponible({
      sha256,
      motivo: "no está registrado en el manifiesto",
    })
  }
  const bytes = yield* fs
    .readFile(path.join(almacen, "sha256", sha256))
    .pipe(
      Effect.mapError(
        (error) => new DocumentoNoDisponible({ sha256, motivo: error.message })
      )
    )
  const calculado = yield* sha256Hex(bytes)
  if (calculado !== sha256) {
    return yield* new DocumentoNoDisponible({
      sha256,
      motivo: `el contenido del almacén tiene SHA-256 ${calculado}`,
    })
  }
  return bytes
})

const decodificarUtf8 = (sha256: string, bytes: Uint8Array) =>
  Effect.try({
    try: () => new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    catch: () =>
      new DocumentoNoDisponible({ sha256, motivo: "no es UTF-8 válido" }),
  })

export const leerEspecificaciones = Effect.fn(
  "procedencia.leerEspecificaciones"
)(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const archivos = (yield* fs.readDirectory(RUTAS.especificaciones))
    .filter((archivo) => archivo.endsWith(".json"))
    .sort()
  const especificaciones: Array<EspecificacionLeida> = []
  for (const archivo of archivos) {
    const ruta = path.join(RUTAS.especificaciones, archivo)
    const texto = yield* fs.readFileString(ruta).pipe(
      Effect.mapError(
        (error) =>
          new EspecificacionInvalida({
            archivo: ruta,
            detalle: error.message,
          })
      )
    )
    const especificacion = yield* Schema.decodeUnknownEffect(
      EspecificacionDesdeJson
    )(texto, { onExcessProperty: "error" }).pipe(
      Effect.mapError(
        (error) =>
          new EspecificacionInvalida({ archivo: ruta, detalle: error.message })
      )
    )
    if (`${especificacion.tabla}.json` !== archivo) {
      return yield* new EspecificacionInvalida({
        archivo: ruta,
        detalle: `el campo «tabla» (${especificacion.tabla}) no coincide con el nombre del archivo`,
      })
    }
    especificaciones.push({
      especificacion,
      huella: yield* sha256Hex(new TextEncoder().encode(texto)),
    })
  }
  return especificaciones
})

interface EspecificacionLeida {
  readonly especificacion: Especificacion
  readonly huella: string
}

const correspondenciaDe = (especificacion: Especificacion): Correspondencia => {
  const { cabecera } = especificacion.testigo
  return especificacion.tipo === "escala"
    ? {
        _tag: "Escala",
        tramos: 0,
        columnaPdf: new Map(
          especificacion.columnas.map((c, i) => [c.cabecera, cabecera[i] ?? ""])
        ),
      }
    : {
        _tag: "Cuadro",
        cabeceraDeFilasPdf: cabecera[0],
        columnaPdf: new Map(
          especificacion.columnas.map((c, i) => [c, cabecera[i + 1] ?? ""])
        ),
      }
}

const extraerTabla = Effect.fn("procedencia.tabla")(function* (
  { especificacion, huella }: EspecificacionLeida,
  almacen: string,
  manifiesto: Manifiesto,
  pdf: PdfAbierto
) {
  yield* Effect.annotateCurrentSpan({ tabla: especificacion.tabla })
  const { sha256 } = especificacion.documento
  const html = yield* leerDelAlmacen(almacen, sha256, manifiesto).pipe(
    Effect.flatMap((bytes) => decodificarUtf8(sha256, bytes))
  )
  const base = {
    tabla: especificacion.tabla,
    especificacion: huella,
    tipo: especificacion.tipo,
    magnitud: especificacion.magnitud,
    territorios: especificacion.territorios,
    testigoPdf: {
      sha256: especificacion.testigo.sha256,
      paginas: especificacion.testigo.paginas,
    },
  }
  const fallo = (
    excepcion: ExtraccionTabla["excepciones"][number]
  ): ExtraccionTabla => ({
    ...base,
    documento: { sha256, tablaLocalizada: null },
    valores: [],
    notas: [],
    excepciones: [excepcion],
  })
  const paginaFuera = especificacion.testigo.paginas.find(
    (pagina) => pagina > pdf.numeroDePaginas
  )
  if (paginaFuera !== undefined) {
    return fallo(
      new PaginaInexistente({
        tabla: especificacion.tabla,
        pagina: paginaFuera,
        paginasDelDocumento: pdf.numeroDePaginas,
      })
    )
  }
  const extraido =
    especificacion.tipo === "escala"
      ? extraerEscala(especificacion, html)
      : extraerCuadro(especificacion, html)
  if (Result.isFailure(extraido)) {
    return fallo(extraido.failure)
  }
  const paginas = yield* Effect.forEach(
    especificacion.testigo.paginas,
    pdf.leerPagina
  )
  const correspondencia = correspondenciaDe(especificacion)
  return {
    ...base,
    documento: { sha256, tablaLocalizada: extraido.success.tablaLocalizada },
    valores: atestiguar(
      localizarTablaPdf(especificacion.testigo, paginas),
      correspondencia._tag === "Escala"
        ? { ...correspondencia, tramos: extraido.success.filasDeDatos }
        : correspondencia,
      extraido.success.valores
    ),
    notas: extraido.success.notas,
    excepciones: extraido.success.excepciones,
  } satisfies ExtraccionTabla
})

const abrirPdfDelAlmacen = (
  almacen: string,
  sha256: string,
  manifiesto: Manifiesto
) =>
  leerDelAlmacen(almacen, sha256, manifiesto).pipe(
    Effect.flatMap((bytes) => abrirPdf(sha256, bytes))
  )

// Extrae todas las especificaciones y devuelve el texto sellado de cada una,
// por ruta, sin escribirlo. Cada página del PDF se lee una sola vez.
export const extraerTextos = Effect.fn("procedencia.extraerTextos")(function* (
  almacen: string
) {
  const path = yield* Path.Path
  const manifiesto = yield* leerManifiesto()
  const especificaciones = yield* leerEspecificaciones()
  const textos = new Map<string, string>()
  const pdfs = Array.from(
    new Set(especificaciones.map((e) => e.especificacion.testigo.sha256))
  ).sort()
  for (const sha256 of pdfs) {
    yield* Effect.scoped(
      Effect.gen(function* () {
        const abierto = yield* abrirPdfDelAlmacen(almacen, sha256, manifiesto)
        const leidas = new Map<number, PaginaEtiquetada>()
        const pdf: PdfAbierto = {
          numeroDePaginas: abierto.numeroDePaginas,
          leerPagina: (pagina) => {
            const leida = leidas.get(pagina)
            return leida !== undefined
              ? Effect.succeed(leida)
              : abierto
                  .leerPagina(pagina)
                  .pipe(
                    Effect.tap((nueva) =>
                      Effect.sync(() => leidas.set(pagina, nueva))
                    )
                  )
          },
        }
        for (const leida of especificaciones.filter(
          (e) => e.especificacion.testigo.sha256 === sha256
        )) {
          const extraccion = yield* extraerTabla(
            leida,
            almacen,
            manifiesto,
            pdf
          )
          textos.set(
            path.join(RUTAS.extraccion, `${extraccion.tabla}.json`),
            yield* textoJson(ExtraccionTabla, extraccion)
          )
        }
      })
    )
  }
  return textos
})

export const extraer = Effect.fn("procedencia.extraer")(function* (
  almacen: string
) {
  for (const [ruta, texto] of yield* extraerTextos(almacen)) {
    yield* escribir(ruta, Effect.succeed(texto))
  }
})

export const generarCotejo = Effect.fn("procedencia.cotejar")(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const especificaciones = yield* leerEspecificaciones()
  const archivos = (yield* fs.readDirectory(RUTAS.extraccion))
    .filter((archivo) => archivo.endsWith(".json"))
    .sort()
  const esperados = especificaciones.map(
    (e) => `${e.especificacion.tabla}.json`
  )
  if (archivos.join("\n") !== esperados.join("\n")) {
    return yield* new ResultadoIlegible({
      archivo: RUTAS.extraccion,
      detalle: `las extracciones selladas (${archivos.join(", ")}) no corresponden a las especificaciones (${esperados.join(", ")}); vuelve a extraer`,
    })
  }
  const extracciones = yield* Effect.forEach(
    especificaciones,
    Effect.fnUntraced(function* ({ especificacion, huella }) {
      const ruta = path.join(RUTAS.extraccion, `${especificacion.tabla}.json`)
      const extraccion = yield* fs.readFileString(ruta).pipe(
        Effect.flatMap(Schema.decodeUnknownEffect(ExtraccionTablaDesdeJson)),
        Effect.mapError(
          (error) =>
            new ResultadoIlegible({ archivo: ruta, detalle: error.message })
        )
      )
      if (
        extraccion.tabla !== especificacion.tabla ||
        extraccion.especificacion !== huella
      ) {
        return yield* new ResultadoIlegible({
          archivo: ruta,
          detalle:
            "la extracción sellada no procede de la especificación actual; vuelve a extraer",
        })
      }
      return extraccion
    })
  )
  const cotejo = yield* cotejar(extracciones, yield* proyectarMotor2025())
  yield* escribir(RUTAS.cotejo, textoCotejo(cotejo.entradas))
  yield* escribirJson(RUTAS.excepciones, ColaExcepciones, cotejo.excepciones)
  yield* escribirJson(RUTAS.resumen, Resumen, cotejo.resumen)
  return cotejo.resumen
})

export const obtener = Effect.fn("procedencia.obtener")(function* (
  url: string,
  tipo: DocumentoManifiesto["tipo"],
  almacen: string
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const cliente = (yield* HttpClient.HttpClient).pipe(HttpClient.filterStatusOk)
  const bytes = yield* cliente.get(url).pipe(
    Effect.flatMap((respuesta) => respuesta.arrayBuffer),
    Effect.map((buffer) => new Uint8Array(buffer)),
    Effect.mapError((cause) => new DescargaFallida({ url, cause }))
  )
  const sha256 = yield* sha256Hex(bytes)
  const destino = path.join(almacen, "sha256", sha256)
  yield* fs.makeDirectory(path.dirname(destino), { recursive: true })
  if (!(yield* fs.exists(destino))) {
    yield* fs.writeFile(destino, bytes)
  }
  const hoy = DateTime.formatIsoDateUtc(yield* DateTime.now)
  const manifiesto = yield* leerManifiesto()
  const yaRegistrado = manifiesto.documentos.some(
    (documento) => documento.sha256 === sha256 && documento.url === url
  )
  if (!yaRegistrado) {
    yield* escribirJson(RUTAS.manifiesto, Manifiesto, {
      documentos: [
        ...manifiesto.documentos,
        { sha256, url, bytes: bytes.length, tipo, obtenidoEl: hoy },
      ].sort(
        (a, b) =>
          compararTexto(a.sha256, b.sha256) || compararTexto(a.url, b.url)
      ),
    })
  }
  return { sha256, bytes: bytes.length, nuevo: !yaRegistrado }
})

// Ayuda al autor de especificaciones: las tablas del árbol etiquetado de unas
// páginas consecutivas, con su encabezado anterior y el texto de sus filas,
// tal como las ve el testigo.
export const listarTablas = Effect.fn("procedencia.listarTablas")(function* (
  almacen: string,
  sha256: string,
  paginas: ReadonlyArray<number>
) {
  const manifiesto = yield* leerManifiesto()
  return yield* Effect.scoped(
    Effect.gen(function* () {
      const pdf = yield* abrirPdfDelAlmacen(almacen, sha256, manifiesto)
      const leidas = yield* Effect.forEach(paginas, pdf.leerPagina)
      const sinArbol = leidas.find((pagina) => pagina.raiz === null)
      if (sinArbol !== undefined) {
        return yield* new DocumentoNoDisponible({
          sha256,
          motivo: `la página ${sinArbol.pagina} no tiene árbol de estructura`,
        })
      }
      return trozosDeTablas(leidas)
    })
  )
})
