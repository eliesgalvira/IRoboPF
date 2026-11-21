import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Config, Console, Effect, Schema } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import { FetchHttpClient } from "effect/unstable/http"

import { normalizar } from "../lib/procedencia/literales"
import {
  buscarLiteral,
  extraer,
  generarCotejo,
  obtener,
} from "../lib/procedencia/programa"
import { Resumen } from "../lib/procedencia/resultado"

const almacen = Flag.directory("almacen").pipe(
  Flag.withDescription(
    "Almacén de originales direccionado por contenido (contiene sha256/<hash>)"
  ),
  Flag.withFallbackConfig(Config.string("PROCEDENCIA_ALMACEN"))
)

const mostrarResumen = (resumen: Resumen) =>
  Console.log(Schema.encodeSync(Schema.fromJsonString(Resumen))(resumen))

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

const buscar = Command.make(
  "buscar",
  {
    almacen,
    sha256: Flag.string("sha256").pipe(
      Flag.withDescription("SHA-256 del PDF registrado")
    ),
    literal: Flag.string("literal").pipe(
      Flag.withDescription("Literal exacto que se busca")
    ),
  },
  Effect.fn(function* ({ almacen, sha256, literal }) {
    const paginas = yield* buscarLiteral(almacen, sha256, normalizar(literal))
    for (const { pagina, apariciones } of paginas) {
      yield* Console.log(
        `página ${pagina}: ${apariciones.length} ${apariciones
          .map((a) => `(elemento ${a.elemento}, x=${a.x}, y=${a.y})`)
          .join(" ")}`
      )
    }
  })
).pipe(
  Command.withDescription(
    "Ayuda al autor de especificaciones: lista las páginas del PDF donde aparece un literal"
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
    buscar,
  ]),
  Command.run({ version: "2025.1" }),
  Effect.provide([BunServices.layer, FetchHttpClient.layer]),
  BunRuntime.runMain
)
