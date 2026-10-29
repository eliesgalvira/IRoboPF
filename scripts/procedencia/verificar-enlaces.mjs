import { parseArgs } from "node:util"
import { readFileSync, lstatSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import {
  buildArtifact,
  readArtifact,
  compareFiles,
} from "./inventario-artefacto.mjs"
import { hash } from "./inventario-ast.mjs"
import { sourcePaths, filesUnder } from "./inventario.mjs"

// Único punto de entrada de la comprobación completa: reconstruye en proceso
// nuevo. El auxiliar Python solo comprueba evidencia con el contexto recibido.
export async function verifyLinks(root = process.cwd(), { casRoots } = {}) {
  if (
    casRoots !== undefined &&
    (!Array.isArray(casRoots) || casRoots.some((p) => !p.startsWith("/")))
  )
    throw new Error("Raíces CAS absolutas requeridas")
  const registryPath = resolve(root, "docs/procedencia/enlaces/registro.json")
  const registryBytes = readFileSync(registryPath)
  const registry = JSON.parse(registryBytes)
  if (!Array.isArray(registry.entries) || registry.entries.length === 0)
    throw new Error("Registro de enlaces vacío o inválido")
  const artifact = readArtifact(root)
  const manifestPath = resolve(root, "docs/procedencia/inventario.json")
  const manifestHash = hash(readFileSync(manifestPath))
  const sourceList = sourcePaths(root)
  const inventoryScripts = () =>
    filesUnder(resolve(root, "scripts/procedencia")).filter((p) =>
      /inventario.*\.(mjs|py)$/.test(p)
    )
  const scriptList = inventoryScripts()
  const ensureInputs = () => {
    if (JSON.stringify(sourcePaths(root)) !== JSON.stringify(sourceList))
      throw new Error("Conjunto de fuentes cambió durante la verificación")
    if (JSON.stringify(inventoryScripts()) !== JSON.stringify(scriptList))
      throw new Error("Conjunto de extractores cambió durante la verificación")
    for (const input of artifact.manifest.generationInputs) {
      if (hash(readFileSync(resolve(root, input.file))) !== input.sha256)
        throw new Error(`Fuente cambió durante la verificación: ${input.file}`)
    }
    if (hash(readFileSync(manifestPath)) !== manifestHash)
      throw new Error("Manifiesto cambió durante la verificación")
    if (hash(readFileSync(registryPath)) !== hash(registryBytes))
      throw new Error("Registro cambió durante la verificación")
  }
  await buildArtifact(root, "check")
  compareFiles(artifact.files, readArtifact(root).files)
  ensureInputs()
  const items = []
  for (const [name, raw] of artifact.files) {
    if (/^inventario-pagina-[0-9]+\.json$/.test(name))
      items.push(...JSON.parse(raw))
  }
  if (items.length === 0) throw new Error("Inventario sin elementos")
  // El auxiliar resuelve los payloads y sus IDs; no se confía en IDs enviados
  // desde una cita. Se transmiten los elementos reales del artefacto comprobado.
  const run = spawnSync(
    "bash",
    [
      resolve(root, "tools/procedencia/run.sh"),
      resolve(root, "tools/procedencia/enlaces.py"),
      ...(casRoots ?? []).flatMap((p) => ["--cas-root", p]),
    ],
    {
      cwd: root,
      input: JSON.stringify({
        manifestSha256: manifestHash,
        artifactSha256: artifact.manifest.artifact.sha256,
        registrySha256: hash(registryBytes),
        items,
      }),
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
      timeout: 180_000,
    }
  )
  if (run.error) throw run.error
  if (run.status !== 0)
    throw new Error(run.stderr || "Verificación documental fallida")
  const result = JSON.parse(run.stdout)
  for (const dependency of result.documentaryDependencies) {
    if (
      hash(readFileSync(resolve(root, dependency.path))) !== dependency.sha256
    )
      throw new Error(
        `Documento cambió durante la verificación: ${dependency.path}`
      )
  }
  for (const dependency of result.casDependencies) {
    const parts = dependency.path.split("/").filter(Boolean)
    let path = "/"
    for (const part of parts) {
      path = resolve(path, part)
      if (lstatSync(path).isSymbolicLink())
        throw new Error("Symlink CAS tardío")
    }
    if (hash(readFileSync(path)) !== dependency.sha256)
      throw new Error("Objeto CAS cambió durante la verificación")
  }
  ensureInputs()
  compareFiles(artifact.files, readArtifact(root).files)
  return {
    inventory: "rebuilt-from-current-code",
    documentaryFilesVerified: result.documentaryDependencies.length,
    evidence: result.evidence,
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { values } = parseArgs({
    options: { "cas-root": { type: "string", multiple: true } },
  })
  const result = await verifyLinks(process.cwd(), {
    casRoots: values["cas-root"],
  })
  process.stdout.write(JSON.stringify(result, null, 2) + "\n")
}
