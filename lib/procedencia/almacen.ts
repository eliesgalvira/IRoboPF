import { readFileSync, existsSync, resolve } from "./io.mjs"
import { gunzipSync } from "node:zlib"
import { Schema } from "effect"
import {
  Hash,
  Id,
  Paquete,
  Snapshot,
  Referencia,
  IndiceBusqueda,
} from "./modelo"
import { hash, bytesEntidad } from "./verificador"

export const directorioContenido = resolve(
  process.cwd(),
  "docs/procedencia/implementaciones/contenidos/datos"
)
const Indice = Schema.Array(Referencia)
export function objeto(raiz: string, revision: string) {
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
  if (snapshot.version === 2) {
    const filas = leerBusqueda(snapshot, raiz)
    return filas
      .filter(
        (e) =>
          (territorio === "" || e.territorios.includes(territorio)) &&
          (ejercicio === "" || e.ejercicios.includes(Number(ejercicio))) &&
          (e.id.includes(q) || e.titulo.toLocaleLowerCase("es").includes(q))
      )
      .slice(0, 30)
      .map(({ id, revision, titulo }) => ({ id, revision, titulo }))
  }
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

// Un solo índice decodificado. Los bytes se releen y hashean antes de cada uso.
let indiceReciente:
  | { hash: string; filas: typeof IndiceBusqueda.Type }
  | undefined
export function leerBusqueda(snapshot: Snapshot, raiz = directorioContenido) {
  if (snapshot.version !== 2) throw new Error("Índice v2 requerido")
  const bytes = objeto(raiz, snapshot.busqueda)
  if (indiceReciente?.hash === snapshot.busqueda) return indiceReciente.filas
  const filas = Schema.decodeUnknownSync(Schema.fromJsonString(IndiceBusqueda))(
    gunzipSync(bytes, {
      maxOutputLength: 30_000_000,
    }).toString("utf8"),
    { onExcessProperty: "error" }
  )
  indiceReciente = { hash: snapshot.busqueda, filas }
  return filas
}
export function blobPublico(
  snapshotId: string,
  revision: string,
  raiz = directorioContenido
) {
  if (!Schema.is(Hash)(revision)) return null
  const snapshot = leerSnapshot(snapshotId, raiz)
  if (snapshot?.version !== 2) return null
  const ficha = snapshot.publicos.find((p) => p.hash === revision)
  if (ficha === undefined) return null
  const bytes = objeto(raiz, revision)
  if (bytes.length !== ficha.bytes) throw new Error("Tamaño público incorrecto")
  const firma =
    ficha.mime === "application/pdf"
      ? Buffer.from("%PDF-")
      : Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  if (!bytes.subarray(0, firma.length).equals(firma))
    throw new Error("MIME incorrecto")
  return { bytes, mime: ficha.mime }
}

export function enlacesDocumentales(
  snapshotId: string,
  entidad: (typeof Paquete.Type)[number]["entidad"],
  raiz = directorioContenido
) {
  const snapshot = leerSnapshot(snapshotId, raiz)
  if (snapshot?.version !== 2) return []
  const pendientes = [entidad]
  const vistos = new Set<string>()
  const enlaces: Array<{ titulo: string; href: string }> = []
  for (let i = 0; i < pendientes.length; i++) {
    const e = pendientes[i]
    if (e === undefined || vistos.has(e.id)) continue
    vistos.add(e.id)
    if (vistos.size > 32) throw new Error("Recorrido documental excedido")
    const blob =
      e.tipo === "Document"
        ? e.original
        : e.tipo === "Facsimile"
          ? e.imagen
          : null
    if (blob !== null) {
      if (blobPublico(snapshotId, blob, raiz) === null)
        throw new Error("Evidencia no publicable")
      enlaces.push({
        titulo: e.tipo === "Document" ? "Original PDF" : "Captura PNG",
        href: `/procedencia/${snapshotId}/objetos/${blob}`,
      })
    }
    for (const a of e.aristas.filter((a) =>
      ["norma", "evidencia", "documento", "captura"].includes(a.relacion)
    )) {
      const destino = resolver(
        snapshotId,
        a.destino.id,
        a.destino.revision,
        raiz
      )
      if (destino === null) throw new Error("Enlace documental ausente")
      if (destino.tipo === "Citation")
        enlaces.push({
          titulo: "Cita literal",
          href: `/procedencia/${snapshotId}/${a.destino.id}/${a.destino.revision}`,
        })
      pendientes.push(destino)
    }
  }
  return enlaces.filter(
    (e, i) => enlaces.findIndex((x) => x.href === e.href) === i
  )
}
