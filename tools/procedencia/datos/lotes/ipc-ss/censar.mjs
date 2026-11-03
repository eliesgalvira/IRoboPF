// Censo independiente del lote: hojas exportadas y ocurrencias AST fuera de datos.
import { readFileSync, writeFileSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"
import Decimal from "decimal.js"
import { Context, Schema } from "effect"
import { extractTs, hash } from "../../../../../scripts/procedencia/inventario-ast.mjs"
const [root, output] = process.argv.slice(2)
const files = ["lib/dominio/normativa/datos/ipc-2012-2026.ts", "lib/dominio/normativa/datos/seguridad-social-2012-2026.ts", "lib/dominio/laboral/cotizaciones-sociales.ts", "lib/dominio/laboral/cotizaciones-perfil-uniforme.ts", "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts"]
const modules = [], leaves = []
// El censo admite sólo árboles de datos. Las funciones se excluyen por su
// declaración AST; cualquier otro valor no representable falla al importar.
const leafSchemas = [
  ["Decimal", Schema.declare(Decimal.isDecimal)], ["string", Schema.String],
  ["number", Schema.Number], ["boolean", Schema.Boolean],
  ["null", Schema.Null], ["undefined", Schema.Undefined],
]
const dataTree = Schema.suspend(() => Schema.Union([
  ...leafSchemas.map(([, schema]) => schema),
  Schema.Array(dataTree), Schema.Record(Schema.String, dataTree),
]))
const decodeData = Schema.decodeUnknownSync(dataTree)
for (const file of files) {
  const source = readFileSync(resolve(root, file), "utf8")
  const ast = extractTs(file, source)
  modules.push({ file, sha256: hash(source), ast })
  if (!file.includes("/datos/") && !file.endsWith("/cotizaciones-sociales.ts")) continue
  const exports = await import(pathToFileURL(resolve(root, file)).href)
  function walk(symbol, value, path = []) {
    const leaf = leafSchemas.find(([, schema]) => Schema.is(schema)(value))
    if (!leaf) {
      for (const [key, child] of Object.entries(value)) walk(symbol, child, [...path, key])
    } else leaves.push({ file, sourceSha256: hash(source), symbol, path, value: String(value), type: leaf[0] })
  }
  for (const [symbol, value] of Object.entries(exports)) {
    if (ast.bindings.some(binding => binding.symbol === symbol && binding.function)) continue
    if (Context.isKey(value)) continue
    walk(symbol, decodeData(value))
  }
}
const cotizaciones = await import(pathToFileURL(resolve(root, "lib/dominio/laboral/cotizaciones-sociales.ts")).href)
const perfil = await import(pathToFileURL(resolve(root, "lib/dominio/laboral/cotizaciones-perfil-uniforme.ts")).href)
const parameters = [], cases = []
for (let year = 2012; year <= 2026; year++) {
  const p = cotizaciones.obtenerParametrosCotizacionLegacy(year)
  parameters.push({ year, mei: { empresarial: p.mei.empresarial.toString(), trabajador: p.mei.trabajador.toString() } })
  for (const salary of ["30000", "45100", "60000", "100000"]) {
    const result = perfil.calcularDesgloseCotizacionesPerfilUniforme({ anio: year, salarioBrutoAnual: new Decimal(salary) })
    cases.push({ year, salary, result: Object.fromEntries(Object.entries(result).map(([k,v]) => [k,Decimal.isDecimal(v) ? v.toString() : v])) })
  }
}
const inflationFile = "lib/dominio/inflacion/factor-ipc.ts"
const inflationSource = readFileSync(resolve(root,inflationFile),"utf8")
modules.push({file:inflationFile,sha256:hash(inflationSource),ast:extractTs(inflationFile,inflationSource)})
writeFileSync(output, JSON.stringify({ version: 2, modules, leaves, parameters, cases }) + "\n")
