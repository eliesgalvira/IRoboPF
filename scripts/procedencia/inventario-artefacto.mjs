import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
} from "node:fs"
import { resolve, basename } from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync, gunzipSync } from "node:zlib"
import { Predicate } from "effect"
import { generate } from "./inventario.mjs"
import { hash } from "./inventario-ast.mjs"

const archiveName = "inventario-datos.json.gz"
const maxBytes = 128 * 1024 * 1024

export function readArtifact(root = process.cwd()) {
  const folder = resolve(root, "docs/procedencia")
  const manifest = JSON.parse(
    readFileSync(resolve(folder, "inventario.json"), "utf8")
  )
  if (
    manifest.artifact?.file !== archiveName ||
    manifest.artifact?.format !== "gzip-json-files-v1"
  )
    throw new Error("Formato de artefacto no soportado")
  const raw = readFileSync(resolve(folder, archiveName))
  if (
    raw.length !== manifest.artifact.size ||
    hash(raw) !== manifest.artifact.sha256
  )
    throw new Error("Hash o tamaño del artefacto incorrecto")
  const entries = JSON.parse(
    gunzipSync(raw, { maxOutputLength: maxBytes }).toString("utf8")
  )
  if (!Array.isArray(entries)) throw new Error("Listado de archivos inválido")
  const files = new Map()
  for (const entry of entries) {
    if (!Array.isArray(entry) || entry.length !== 2)
      throw new Error("Entrada de archivo inválida")
    const [name, content] = entry
    if (
      !Predicate.isString(name) ||
      !/^inventario(?:[-a-z0-9]*)\.json$/.test(name) ||
      basename(name) !== name ||
      !Predicate.isString(content)
    )
      throw new Error("Nombre o contenido inválido")
    if (files.has(name)) throw new Error(`Archivo duplicado: ${name}`)
    files.set(name, content)
  }
  const summary = structuredClone(manifest)
  delete summary.artifact
  if (JSON.stringify(summary) + "\n" !== files.get("inventario.json"))
    throw new Error("Manifiesto externo distinto del empaquetado")
  return { files, manifest }
}

export function compareFiles(expected, actual) {
  if (expected.size !== actual.size)
    throw new Error("Conjunto de archivos incompleto o sobrante")
  for (const [name, content] of expected) {
    if (actual.get(name) !== content)
      throw new Error(`Diferencia respecto a fuentes actuales: ${name}`)
  }
}

export function readGenerated(directory) {
  return new Map(
    readdirSync(directory)
      .sort()
      .map((name) => [name, readFileSync(resolve(directory, name), "utf8")])
  )
}

export async function buildArtifact(
  root = process.cwd(),
  mode = "check",
  artifactRoot = root
) {
  if (!["write", "check"].includes(mode)) throw new Error("Usa write o check")
  const scratch = resolve(root, ".cache/procedencia/inventario-integracion")
  mkdirSync(scratch, { recursive: true })
  const temporary = mkdtempSync(resolve(scratch, "generacion-"))
  try {
    const summary = await generate(root, temporary)
    const files = readGenerated(temporary)
    if (mode === "check") {
      compareFiles(files, readArtifact(artifactRoot).files)
    } else {
      const raw = gzipSync(Buffer.from(JSON.stringify([...files])), {
        level: 9,
      })
      const folder = resolve(root, "docs/procedencia")
      const artifact = {
        file: archiveName,
        format: "gzip-json-files-v1",
        sha256: hash(raw),
        size: raw.length,
      }
      // Temporales propios; el manifiesto se publica al final. Una interrupción falla cerrada.
      const blobTemp = resolve(temporary, archiveName)
      const manifestTemp = resolve(temporary, "manifest-publish.json")
      writeFileSync(blobTemp, raw)
      writeFileSync(
        manifestTemp,
        JSON.stringify({ ...summary, artifact }, null, 2) + "\n"
      )
      renameSync(blobTemp, resolve(folder, archiveName))
      renameSync(manifestTemp, resolve(folder, "inventario.json"))
    }
    return summary.counts
  } finally {
    // Solo el directorio exclusivo creado por mkdtemp en nuestra caché.
    rmSync(temporary, { recursive: true, force: true })
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const counts = await buildArtifact(
    process.cwd(),
    process.argv[2] ?? "check",
    process.argv[3] ? resolve(process.argv[3]) : process.cwd()
  )
  process.stdout.write(
    JSON.stringify({ mode: process.argv[2] ?? "check", counts }) + "\n"
  )
}
