import {
  DateTime,
  Effect,
  FileSystem,
  Option,
  Path,
  Result,
  Schema,
  SchemaGetter,
  SchemaTransformation,
} from "effect"
import { HttpClient } from "effect/unstable/http"

import { comprobarAceptadas, ExcepcionesAceptadasDesdeJson } from "./aceptadas"
import { cotejar } from "./cotejo"
import {
  ComposicionesDesdeJson,
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
  FuenteCambiada,
  PaginaInexistente,
  ResultadoDesactualizado,
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
  composiciones: "procedencia/composiciones/2025.json",
  aceptadas: "procedencia/excepciones-aceptadas/2025.json",
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

const textoJson = <
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

const leerEspecificaciones = Effect.fn(
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

const correspondenciaDe = (
  especificacion: Especificacion,
  tramos: number
): Correspondencia => {
  const { cabecera } = especificacion.testigo
  return especificacion.tipo === "escala"
    ? {
        _tag: "Escala",
        tramos,
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
  return {
    ...base,
    documento: { sha256, tablaLocalizada: extraido.success.tablaLocalizada },
    valores: atestiguar(
      localizarTablaPdf(especificacion.testigo, paginas),
      correspondenciaDe(especificacion, extraido.success.filasDeDatos),
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

// Extrae las especificaciones y devuelve el texto sellado de cada una, por
// ruta, sin escribirlo. Cada página del PDF se lee una sola vez.
const extraerTextos = Effect.fn("procedencia.extraerTextos")(function* (
  almacen: string,
  especificaciones: ReadonlyArray<EspecificacionLeida>
) {
  const path = yield* Path.Path
  const manifiesto = yield* leerManifiesto()
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
  for (const [ruta, texto] of yield* extraerTextos(
    almacen,
    yield* leerEspecificaciones()
  )) {
    yield* escribir(ruta, Effect.succeed(texto))
  }
})

const decodificarArchivo = <
  S extends Schema.Top & { readonly DecodingServices: never },
>(
  ruta: string,
  schema: S
) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.readFileString(ruta).pipe(
      Effect.flatMap((texto) =>
        Schema.decodeUnknownEffect(schema)(texto, { onExcessProperty: "error" })
      ),
      Effect.mapError(
        (error) =>
          new EspecificacionInvalida({ archivo: ruta, detalle: error.message })
      )
    )
  })

// Lo sellado se decodifica con Schema estricto: un campo de más, un testigo
// sin su celda o un estado que no existe no se leen.
const leerSellado = Effect.fn("procedencia.leerSellado")(function* (
  especificaciones: ReadonlyArray<EspecificacionLeida>
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
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
  return yield* Effect.forEach(
    especificaciones,
    Effect.fnUntraced(function* ({ especificacion, huella }) {
      const ruta = path.join(RUTAS.extraccion, `${especificacion.tabla}.json`)
      const extraccion = yield* fs.readFileString(ruta).pipe(
        Effect.flatMap((texto) =>
          Schema.decodeUnknownEffect(ExtraccionTablaDesdeJson)(texto, {
            onExcessProperty: "error",
          })
        ),
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
})

// El cotejo de lo sellado con el motor, como textos por ruta, y la puerta:
// ninguna diferencia sin aceptar ni aceptación que ya no ocurra.
const cotejoDeLoSellado = Effect.fn("procedencia.cotejoDeLoSellado")(
  function* (especificaciones: ReadonlyArray<EspecificacionLeida>) {
    const extracciones = yield* leerSellado(especificaciones)
    const { composiciones } = yield* decodificarArchivo(
      RUTAS.composiciones,
      ComposicionesDesdeJson
    )
    const { aceptadas } = yield* decodificarArchivo(
      RUTAS.aceptadas,
      ExcepcionesAceptadasDesdeJson
    )
    const cotejo = yield* cotejar(
      extracciones,
      yield* proyectarMotor2025(),
      composiciones
    )
    const textos = new Map<string, string>([
      [RUTAS.cotejo, yield* textoCotejo(cotejo.entradas)],
      [
        RUTAS.excepciones,
        yield* textoJson(ColaExcepciones, cotejo.excepciones),
      ],
      [RUTAS.resumen, yield* textoJson(Resumen, cotejo.resumen)],
    ])
    return {
      textos,
      resumen: cotejo.resumen,
      puerta: comprobarAceptadas(cotejo, extracciones, aceptadas),
    }
  }
)

// Escribe el cotejo y después aplica la puerta: el cotejo queda a la vista
// aunque haya diferencias sin aceptar.
export const generarCotejo = Effect.fn("procedencia.cotejar")(function* () {
  const { textos, resumen, puerta } = yield* cotejoDeLoSellado(
    yield* leerEspecificaciones()
  )
  for (const [ruta, texto] of textos) {
    yield* escribir(ruta, Effect.succeed(texto))
  }
  yield* puerta
  return resumen
})

// Sin escribir nada: lo regenerado (y, con almacén, lo reextraído desde los
// originales) ha de ser idéntico byte a byte a lo sellado, y la puerta pasar.
export const comprobar = Effect.fn("procedencia.comprobar")(function* (
  almacen: Option.Option<string>
) {
  const fs = yield* FileSystem.FileSystem
  // Una sola lectura de las fichas para la reextracción y para lo sellado.
  const especificaciones = yield* leerEspecificaciones()
  const textos = new Map<string, string>()
  if (Option.isSome(almacen)) {
    for (const [ruta, texto] of yield* extraerTextos(
      almacen.value,
      especificaciones
    )) {
      textos.set(ruta, texto)
    }
  }
  const cotejo = yield* cotejoDeLoSellado(especificaciones)
  for (const [ruta, texto] of cotejo.textos) {
    textos.set(ruta, texto)
  }
  const distintos: Array<string> = []
  for (const [ruta, texto] of textos) {
    const sellado = yield* fs
      .readFileString(ruta)
      .pipe(Effect.orElseSucceed(() => null))
    if (sellado !== texto) {
      distintos.push(ruta)
    }
  }
  if (distintos.length > 0) {
    return yield* new ResultadoDesactualizado({ archivos: distintos.sort() })
  }
  yield* cotejo.puerta
  return cotejo.resumen
})

const descargar = Effect.fn("procedencia.descargar")(function* (url: string) {
  const cliente = (yield* HttpClient.HttpClient).pipe(HttpClient.filterStatusOk)
  const bytes = yield* cliente.get(url).pipe(
    Effect.flatMap((respuesta) => respuesta.arrayBuffer),
    Effect.map((buffer) => new Uint8Array(buffer)),
    Effect.mapError((cause) => new DescargaFallida({ url, cause }))
  )
  return { bytes, sha256: yield* sha256Hex(bytes) }
})

const guardar = Effect.fn("procedencia.guardar")(function* (
  almacen: string,
  sha256: string,
  bytes: Uint8Array
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const destino = path.join(almacen, "sha256", sha256)
  yield* fs.makeDirectory(path.dirname(destino), { recursive: true })
  yield* fs.writeFile(destino, bytes)
})

export const obtener = Effect.fn("procedencia.obtener")(function* (
  url: string,
  tipo: DocumentoManifiesto["tipo"],
  almacen: string
) {
  const { bytes, sha256 } = yield* descargar(url)
  yield* guardar(almacen, sha256, bytes)
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

// Descarga cada documento del manifiesto por su URL a un almacén, sin
// registrar nada: el tamaño y el SHA-256 han de ser los registrados. Si una
// fuente no responde es DescargaFallida; si responde con otros bytes,
// FuenteCambiada, con el documento.
export const obtenerFuentes = Effect.fn("procedencia.obtenerFuentes")(
  function* (almacen: string) {
    const { documentos } = yield* leerManifiesto()
    for (const documento of documentos) {
      const { bytes, sha256 } = yield* descargar(documento.url)
      if (sha256 !== documento.sha256 || bytes.length !== documento.bytes) {
        return yield* new FuenteCambiada({
          url: documento.url,
          sha256: documento.sha256,
          bytes: documento.bytes,
          sha256Obtenido: sha256,
          bytesObtenidos: bytes.length,
        })
      }
      yield* guardar(almacen, sha256, bytes)
    }
    return documentos.length
  }
)

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
