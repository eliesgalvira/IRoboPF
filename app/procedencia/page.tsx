import { Schema } from "effect"
import { Hash } from "@/lib/procedencia/modelo"
import { directorioContenido } from "@/lib/procedencia/almacen"
import { readFileSync, resolve } from "@/lib/procedencia/io.mjs"

export const dynamic = "force-dynamic"
export default function Procedencia() {
  const snapshots = Schema.decodeUnknownSync(
    Schema.fromJsonString(Schema.Array(Hash))
  )(readFileSync(resolve(directorioContenido, "snapshots.json"), "utf8"))
  return (
    <main>
      <h1>Contenido documental versionado</h1>
      <p>
        47.789 ocurrencias técnicas pendientes de interpretación. No son 47.789
        reglas jurídicas redactadas ni aceptadas.
      </p>
      <ul>
        {snapshots.slice(0, 20).map((id) => (
          <li key={id}>
            <a href={`/procedencia/${id}`}>{id}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
