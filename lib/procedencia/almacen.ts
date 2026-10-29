import { readFileSync, existsSync, resolve } from "./io.mjs"
import { gunzipSync } from "node:zlib"
import { Schema } from "effect"
import { Hash, Id, Paquete, Snapshot, Referencia } from "./modelo"
import { hash, bytesEntidad } from "./verificador"

export const directorioContenido = resolve(
  process.cwd(),
  "docs/procedencia/implementaciones/contenidos/datos"
)
const Indice = Schema.Array(Referencia)
function objeto(raiz: string, revision: string) {
  Schema.decodeUnknownSync(Hash)(revision)
  const ruta = resolve(raiz, "objetos", revision)
  if (!existsSync(ruta)) throw new Error("Objeto prometido ausente")
  const bytes = readFileSync(ruta)
  if (bytes.length > 10_000_000 || hash(bytes) !== revision)
    throw new Error("Objeto corrupto")
  return bytes
}
export function leerSnapshot(revision: string, raiz = directorioContenido) {
  if (!Schema.is(Hash)(revision)) return null
  // Lista local explícita, nunca se crea ni se descarga una ruta recibida del cliente.
  const admitidos = Schema.decodeUnknownSync(
    Schema.fromJsonString(Schema.Array(Hash))
  )(readFileSync(resolve(raiz, "snapshots.json"), "utf8"))
  if (!admitidos.includes(revision)) return null
  return Schema.decodeUnknownSync(Schema.fromJsonString(Snapshot))(
    objeto(raiz, revision).toString("utf8"),
    { onExcessProperty: "error" }
  )
}
export function leerPaquete(
  snapshot: Snapshot,
  prefijo: string,
  raiz = directorioContenido
) {
  const paquete = snapshot.paquetes.find((p) => p.prefijo === prefijo)
  if (paquete === undefined) return []
  const bytes = objeto(raiz, paquete.hash)
  if (bytes.length !== paquete.bytes) throw new Error("Tamaño incorrecto")
  const entradas = Schema.decodeUnknownSync(Schema.fromJsonString(Paquete))(
    gunzipSync(bytes, { maxOutputLength: 9_000_000 }).toString("utf8"),
    { onExcessProperty: "error" }
  )
  if (entradas.length !== paquete.cantidad)
    throw new Error("Paquete incompleto")
  for (const e of entradas)
    if (
      hash(e.entidad.id).slice(0, 2) !== prefijo ||
      hash(bytesEntidad(e.entidad)) !== e.revision
    )
      throw new Error("Identidad incorrecta")
  return entradas
}
export function resolver(
  snapshotId: string,
  id: string,
  revision: string,
  raiz = directorioContenido
) {
  if (!Schema.is(Id)(id) || !Schema.is(Hash)(revision)) return null
  const snapshot = leerSnapshot(snapshotId, raiz)
  if (snapshot === null) return null
  const prefijo = hash(id).slice(0, 2)
  const paquete = snapshot.paquetes.find((p) => p.prefijo === prefijo)
  if (paquete === undefined) return null
  const indice = Schema.decodeUnknownSync(Schema.fromJsonString(Indice))(
    objeto(raiz, paquete.indice).toString("utf8"),
    { onExcessProperty: "error" }
  )
  if (!indice.some((e) => e.id === id && e.revision === revision)) return null
  const entrada = leerPaquete(snapshot, prefijo, raiz).find(
    (e) => e.entidad.id === id && e.revision === revision
  )
  if (entrada === undefined) throw new Error("Entidad prometida ausente")
  return entrada.entidad
}
export function buscar(
  snapshotId: string,
  consulta: string,
  territorio = "",
  ejercicio = "",
  raiz = directorioContenido
) {
  const snapshot = leerSnapshot(snapshotId, raiz)
  if (snapshot === null) return null
  const encontrados: Array<{ id: string; revision: string; titulo: string }> =
    []
  const q = consulta.slice(0, 120).toLocaleLowerCase("es")
  for (const paquete of snapshot.paquetes) {
    for (const { revision, entidad: e } of leerPaquete(
      snapshot,
      paquete.prefijo,
      raiz
    )) {
      const dimensiones = "ejerciciosCandidatos" in e
      if (
        territorio.length > 0 &&
        (!dimensiones || !e.territoriosCandidatos.includes(territorio))
      )
        continue
      if (
        ejercicio.length > 0 &&
        (!dimensiones || !e.ejerciciosCandidatos.includes(Number(ejercicio)))
      )
        continue
      if (e.id.includes(q) || e.titulo.toLocaleLowerCase("es").includes(q))
        encontrados.push({ id: e.id, revision, titulo: e.titulo })
      if (encontrados.length === 30) return encontrados
    }
  }
  return encontrados
}
