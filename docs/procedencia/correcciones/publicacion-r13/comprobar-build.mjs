import { createRequire } from "node:module"
import { readFileSync, writeFileSync, statSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { createHash } from "node:crypto"

const root = process.cwd()
const require = createRequire(import.meta.url)
const dir = resolve(root, "docs/procedencia/implementaciones/contenidos/datos")
const snapshot =
  process.argv[2] ??
  JSON.parse(
    readFileSync(resolve(root, "lib/procedencia/rastro-generado.json"))
  ).actual.versiones.snapshot
const data = JSON.parse(readFileSync(resolve(dir, "objetos", snapshot)))
if (data.version !== 2 || data.evidencias.length !== 1)
  throw new Error("Falta v2 actual")
const routes = {
  ficha: "app/procedencia/[snapshot]/[id]/[revision]/route.js",
  objetos: "app/procedencia/[snapshot]/objetos/[hash]/route.js",
}
const result = { snapshot, objetos: [], ficha: {}, trazas: [] }
const objeto = require(resolve(root, ".next/server", routes.objetos))
  .routeModule.userland.GET
for (const p of data.publicos) {
  const response = await objeto(new Request("https://local.invalid"), {
    params: Promise.resolve({ snapshot, hash: p.hash }),
  })
  const bytes = Buffer.from(await response.arrayBuffer())
  const sha256 = createHash("sha256").update(bytes).digest("hex")
  if (
    response.status !== 200 ||
    sha256 !== p.hash ||
    response.headers.get("Content-Type") !== p.mime
  )
    throw new Error("Objeto compilado incorrecto")
  result.objetos.push({
    status: response.status,
    sha256,
    bytes: bytes.length,
    mime: p.mime,
  })
}
const ficha = require(resolve(root, ".next/server", routes.ficha)).routeModule
  .userland.GET
const response = await ficha(new Request("https://local.invalid"), {
  params: Promise.resolve({ snapshot, ...data.evidencias[0].sujeto }),
})
const html = await response.text()
if (
  response.status !== 200 ||
  !html.includes("Original PDF") ||
  !html.includes("Captura PNG") ||
  !html.includes("Aceptación fiscal completa") ||
  !html.startsWith("<!DOCTYPE html>")
)
  throw new Error("Ficha compilada incorrecta: " + response.status)
result.ficha = {
  status: response.status,
  bytes: Buffer.byteLength(html),
  enlaces: true,
  estados: true,
  doctype: true,
}
for (const route of Object.values(routes)) {
  const path = resolve(root, ".next/server", route + ".nft.json")
  const files = JSON.parse(readFileSync(path)).files.map((p) =>
    resolve(dirname(path), p)
  )
  const docs = files.filter((p) => p.startsWith(dir + "/"))
  const missing = [
    resolve(dir, "snapshots.json"),
    resolve(dir, "objetos", snapshot),
    ...data.dependencias.map((d) => resolve(dir, "objetos", d.hash)),
  ].filter((p) => !files.includes(p))
  result.trazas.push({
    route,
    archivos: files.length,
    bytes: files.reduce((n, p) => n + statSync(p).size, 0),
    objetosDocumentales: docs.length,
    dependenciasDocumentalesAusentes: missing,
  })
}
writeFileSync(
  process.env.IROBOPF_VALIDACION_SALIDA ??
    resolve(
      root,
      "docs/procedencia/correcciones/publicacion-r13/build-compilado.json"
    ),
  JSON.stringify(result, null, 2) + "\n"
)
process.stdout.write(JSON.stringify(result) + "\n")
if (result.trazas.some((t) => t.dependenciasDocumentalesAusentes.length))
  throw new Error("Empaquetado omite dependencias documentales")
