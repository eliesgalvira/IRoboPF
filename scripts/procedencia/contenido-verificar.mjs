import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Schema } from "effect"
import { readArtifactBytes } from "./inventario-artefacto.mjs"
import { Referencia } from "../../lib/procedencia/modelo.ts"
import {
  leerSnapshot,
  leerPaquete,
  directorioContenido,
} from "../../lib/procedencia/almacen.ts"
import { hash, verificarGrafo } from "../../lib/procedencia/verificador.ts"

export function verificar(snapshotId, raiz = directorioContenido) {
  const snapshot = leerSnapshot(snapshotId, raiz)
  if (!snapshot) throw new Error("Snapshot desconocido")
  const entradas = []
  const prefijos = new Set()
  for (const paquete of snapshot.paquetes) {
    if (prefijos.has(paquete.prefijo)) throw new Error("Paquete duplicado")
    prefijos.add(paquete.prefijo)
    const grupo = leerPaquete(snapshot, paquete.prefijo, raiz)
    const raw = readFileSync(resolve(raiz, "objetos", paquete.indice))
    if (hash(raw) !== paquete.indice) throw new Error("Índice corrupto")
    const indice = Schema.decodeUnknownSync(
      Schema.fromJsonString(Schema.Array(Referencia))
    )(raw.toString("utf8"), { onExcessProperty: "error" })
    if (
      JSON.stringify(indice) !==
      JSON.stringify(
        grupo.map((e) => ({ id: e.entidad.id, revision: e.revision }))
      )
    )
      throw new Error("Índice distinto del paquete")
    entradas.push(...grupo)
  }
  for (const h of [
    snapshot.inventario,
    snapshot.contrato,
    snapshot.generador,
    ...snapshot.auxiliares,
  ]) {
    if (hash(readFileSync(resolve(raiz, "objetos", h))) !== h)
      throw new Error("Auxiliar corrupto")
  }
  if (entradas.length !== snapshot.cantidad)
    throw new Error("Conteo incorrecto")
  // Cada snapshot se coteja con su propio artefacto, nunca con el actual.
  const datosBytes = readFileSync(
    resolve(raiz, "objetos", snapshot.versiones.datos)
  )
  if (hash(datosBytes) !== snapshot.versiones.datos)
    throw new Error("Inventario histórico corrupto")
  const { files, manifest } = readArtifactBytes(
    readFileSync(resolve(raiz, "objetos", snapshot.inventario)),
    datosBytes
  )
  if (
    hash(JSON.stringify(manifest.generationInputs)) !==
    snapshot.versiones.algoritmo
  )
    throw new Error("Versión del algoritmo distinta del inventario fijado")
  const porId = new Map(
    entradas
      .filter((e) => e.entidad.identidad === "ocurrencia")
      .map((e) => [e.entidad.id, e.entidad])
  )
  let cotejadas = 0
  for (const [nombre, contenido] of files) {
    if (!/^inventario-pagina-\d+\.json$/.test(nombre)) continue
    for (const item of JSON.parse(contenido)) {
      const entidad = porId.get(item.id)
      if (
        !entidad ||
        entidad.expresion !== item.expression ||
        entidad.valorObservado !== item.value ||
        entidad.fuentes[0]?.sha256 !== item.source.sha256 ||
        entidad.unidadCandidata !== item.unit ||
        JSON.stringify(entidad.ejerciciosCandidatos) !==
          JSON.stringify(item.years) ||
        JSON.stringify(entidad.territoriosCandidatos) !==
          JSON.stringify(item.territories)
      )
        throw new Error("Ficha distinta del inventario fijado")
      cotejadas++
    }
  }
  if (cotejadas !== porId.size)
    throw new Error("Cobertura de ocurrencias incompleta")
  return {
    ...verificarGrafo(entradas, new Set(snapshot.auxiliares)),
    cantidad: entradas.length,
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const ids = JSON.parse(
    readFileSync(resolve(directorioContenido, "snapshots.json"), "utf8")
  )
  for (const id of ids)
    process.stdout.write(
      JSON.stringify({ snapshot: id, ...verificar(id) }) + "\n"
    )
}
