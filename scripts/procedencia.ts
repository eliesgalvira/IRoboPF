import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Config, Console, Effect, Schema } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import { FetchHttpClient } from "effect/unstable/http"

import {
  extraer,
  generarCotejo,
  listarTablas,
  obtener,
} from "../lib/procedencia/programa"
import { Resumen } from "../lib/procedencia/resultado"
import { normalizarPdf } from "../lib/procedencia/testigo-pdf"

const almacen = Flag.directory("almacen").pipe(
  Flag.withDescription(
    "Almacén de originales direccionado por contenido (contiene sha256/<hash>)"
  ),
  Flag.withFallbackConfig(Config.string("PROCEDENCIA_ALMACEN"))
)

const mostrarResumen = (resumen: Resumen) =>
  Schema.encodeEffect(Schema.fromJsonString(Resumen))(resumen).pipe(
    Effect.flatMap(Console.log)
  )

const obtenerDocumento = Command.make(
  "obtener",
  {
    almacen,
    url: Flag.string("url").pipe(Flag.withDescription("URL del documento")),
    tipo: Flag.choice("tipo", ["html", "pdf"]).pipe(
      Flag.withDescription("Tipo del documento")
    ),
  },
  Effect.fn(function* ({ almacen, url, tipo }) {
    const obtenido = yield* obtener(url, tipo, almacen)
    yield* Console.log(
      `${obtenido.sha256} ${obtenido.bytes} bytes${obtenido.nuevo ? " (registrado en el manifiesto)" : " (ya estaba registrado)"}`
    )
  })
).pipe(
  Command.withDescription(
    "Descarga un documento, lo guarda por SHA-256 y lo registra en el manifiesto"
  )
)

const extraerYCotejar = Command.make(
  "extraer",
  { almacen },
  Effect.fn(function* ({ almacen }) {
    yield* extraer(almacen)
    yield* mostrarResumen(yield* generarCotejo())
  })
).pipe(
  Command.withDescription(
    "Extrae todas las tablas de los originales, sella la extracción y la coteja con el motor"
  )
)

const cotejarSellado = Command.make(
  "cotejar",
  {},
  Effect.fn(function* () {
    yield* mostrarResumen(yield* generarCotejo())
  })
).pipe(
  Command.withDescription(
    "Regenera el cotejo desde la extracción sellada y el motor, sin originales"
  )
)

const tablas = Command.make(
  "tablas",
  {
    almacen,
    sha256: Flag.string("sha256").pipe(
      Flag.withDescription("SHA-256 del PDF registrado")
    ),
    desde: Flag.integer("desde").pipe(Flag.withDescription("Primera página")),
    hasta: Flag.integer("hasta").pipe(Flag.withDescription("Última página")),
  },
  Effect.fn(function* ({ almacen, sha256, desde, hasta }) {
    const paginas = Array.from(
      { length: Math.max(0, hasta - desde + 1) },
      (_, i) => desde + i
    )
    for (const trozo of yield* listarTablas(almacen, sha256, paginas)) {
      yield* Console.log(
        `página ${trozo.pagina}, tabla ${trozo.indice}, encabezado ${trozo.encabezado === null ? "ninguno" : `«${trozo.encabezado}»`}`
      )
      for (const [indice, fila] of trozo.filas.entries()) {
        yield* Console.log(
          `  fila ${indice} (${fila.seccion ?? "sin sección"}): ${fila.celdas
            .map((celda) => `«${normalizarPdf(celda.join("\n"))}»`)
            .join(" | ")}`
        )
      }
    }
  })
).pipe(
  Command.withDescription(
    "Ayuda al autor de especificaciones: lista las tablas del árbol etiquetado de unas páginas del PDF, con su encabezado anterior y el texto de sus celdas"
  )
)

Command.make("procedencia").pipe(
  Command.withDescription(
    "Procedencia documental de las tablas fiscales de 2025"
  ),
  Command.withSubcommands([
    obtenerDocumento,
    extraerYCotejar,
    cotejarSellado,
    tablas,
  ]),
  Command.run({ version: "2025.1" }),
  Effect.provide([BunServices.layer, FetchHttpClient.layer]),
  BunRuntime.runMain
)
