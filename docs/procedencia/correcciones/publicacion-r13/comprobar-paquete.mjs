import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  mkdtempSync,
  copyFileSync,
  statSync,
} from "node:fs"
import { resolve, dirname, relative } from "node:path"
import { spawnSync } from "node:child_process"

const root = process.cwd()
const files = new Set()
function recorrer(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const p = resolve(path, entry.name)
    if (entry.isDirectory()) recorrer(p)
    else if (entry.name.endsWith(".nft.json")) {
      files.add(p)
      files.add(p.slice(0, -9))
      for (const f of JSON.parse(readFileSync(p)).files)
        files.add(resolve(dirname(p), f))
    }
  }
}
recorrer(resolve(root, ".next/server/app/procedencia"))
const tmp = mkdtempSync(resolve(root, ".cache/procedencia/paquete-r13-"))
let bytes = 0
for (const p of files) {
  const name = relative(root, p)
  if (name.startsWith("..") || name.startsWith("/"))
    throw new Error("Dependencia externa no prevista")
  const destino = resolve(tmp, name)
  mkdirSync(dirname(destino), { recursive: true })
  copyFileSync(p, destino)
  bytes += statSync(p).size
}
const salida = resolve(
  root,
  "docs/procedencia/correcciones/publicacion-r13/build-aislado.json"
)
const snapshot = JSON.parse(
  readFileSync(resolve(root, "lib/procedencia/rastro-generado.json"))
).actual.versiones.snapshot
const run = spawnSync(
  process.execPath,
  [
    resolve(
      root,
      "docs/procedencia/correcciones/publicacion-r13/comprobar-build.mjs"
    ),
    snapshot,
  ],
  {
    cwd: tmp,
    encoding: "utf8",
    timeout: 60_000,
    env: { ...process.env, IROBOPF_VALIDACION_SALIDA: salida },
  }
)
writeFileSync(
  resolve(root, "docs/procedencia/correcciones/publicacion-r13/paquete.log"),
  run.stdout + run.stderr
)
if (run.error) throw run.error
if (run.status !== 0) throw new Error("GET aislado fallido: " + run.status)
const result = {
  archivos: files.size,
  bytes,
  snapshot,
  resultado: "GET compilados correctos desde copia exclusiva de trazas",
  servidor: false,
  despliegue: false,
}
writeFileSync(
  resolve(root, "docs/procedencia/correcciones/publicacion-r13/paquete.json"),
  JSON.stringify(result, null, 2) + "\n"
)
process.stdout.write(JSON.stringify(result) + "\n")
