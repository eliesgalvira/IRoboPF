// @ts-check
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, relative, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import Decimal from "decimal.js"
import { generate, filesUnder, dimensions } from "../../../scripts/procedencia/inventario.mjs"
import { extractTs, hash } from "../../../scripts/procedencia/inventario-ast.mjs"

const [root, output] = process.argv.slice(2)
const summary = await generate(root, output)
const leaves = [], modules = []
function walk(value, path, emit, seen = new Set()) {
  if (value === null || value === undefined || Object(value) !== value || Decimal.isDecimal(value)) {
    emit(path, value)
    return
  }
  if (seen.has(value)) throw new Error("Ciclo de datos")
  const next = new Set(seen).add(value)
  if (Object.entries(value).length === 0) emit(path, value)
  for (const [key, child] of Object.entries(value)) walk(child, [...path, key], emit, next)
}
for (const file of filesUnder(resolve(root, "lib/dominio/normativa/datos")).filter(p => p.endsWith(".ts"))) {
  const name = file.slice(root.length + 1), bytes = readFileSync(file)
  const ast = extractTs(name, bytes.toString()), exports = await import(pathToFileURL(file).href)
  modules.push({file:name, sha256:hash(bytes), exports:Object.keys(exports), bindings:ast.bindings})
  for (const [symbol, value] of Object.entries(exports)) {
    if (ast.bindings.some(b => b.symbol === symbol && b.function)) continue
    walk(value, [], (path, child) => {
      const type = Decimal.isDecimal(child) ? "Decimal" : child === null ? "null" : Object.prototype.toString.call(child).slice(8,-1).toLowerCase()
      const metadata = path.some(p => ["fuente", "fuentes", "pagina", "paginas", "titulo", "referencia", "descripcion", "nombre", "codigo"].includes(p))
      const key = path.at(-1) ?? ""
      const auxiliary = /^(?:pagina|paginas|page|indice|index|anio|year|ejercicio|version)$/i.test(key)
      const classification = ["array", "object", "function"].includes(type) ? "empty-container-or-auxiliary" : auxiliary ? "page-year-index-or-auxiliary" : metadata ? "metadata" : ["string", "undefined", "null"].includes(type) ? "text-or-ambiguous" : "fiscal-candidate"
      leaves.push({file:name, sourceSha256:hash(bytes), symbol, path, type, value:child === undefined ? null : ["array", "object"].includes(type) ? child : String(child), classification, layer:"effective", ...dimensions(symbol,path,name), period:null, ambiguity:"Clasificación técnica; semántica y vigencia pendientes"})
    })
  }
}
writeFileSync(resolve(output,"censo-completo.json"),JSON.stringify({version:1,modules,leaves,inventory:summary.counts,deductions:{census:"docs/procedencia/deducciones-2025/censo.json", evidence:"docs/procedencia/deducciones-2025", policy:"enlazar; no recertificar"}})+"\n")

// Fingerprint the actual resolved dependency trees, beyond declarations in the lock.
const dependencies = {}
for (const name of ["decimal.js", "typescript", "effect"]) {
  let directory = dirname(fileURLToPath(import.meta.resolve(name)))
  while (!existsSync(resolve(directory, "package.json")) || JSON.parse(readFileSync(resolve(directory, "package.json"), "utf8")).name !== name) {
    directory = dirname(directory)
  }
  const files = filesUnder(directory).sort()
  dependencies[name] = files.map(file => ({ file: relative(directory, file), sha256: hash(readFileSync(file)) }))
}
writeFileSync(resolve(output, "dependencias-runtime.json"), JSON.stringify(dependencies) + "\n")
