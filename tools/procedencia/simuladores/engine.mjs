// Operador Bun real: el archivo de entrada contiene una lista de entradas completas.
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs"
import { createHash } from "node:crypto"
import { fileURLToPath } from "node:url"
import { resolve, relative, join } from "node:path"
import { execFileSync } from "node:child_process"

const root = fileURLToPath(new URL("../../../", import.meta.url))
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex")
const inventory = () => {
  const files = {}
  const visit = (path, ancestors = []) => {
    const real = realpathSync(path)
    if (ancestors.includes(real)) throw new Error("Ciclo en inventario")
    if (statSync(path).isDirectory()) {
      for (const child of readdirSync(path).sort()) {
        if (child !== ".cache") visit(join(path, child), [...ancestors, real])
      }
    } else files[relative(root, path)] = hash(readFileSync(path))
  }
  // Inventario conservador completo, incluidas dependencias instaladas y operador.
  for (const path of ["lib", "node_modules", "tools/procedencia/simuladores", "package.json", "bun.lock", "tsconfig.json"]) visit(resolve(root, path))
  return files
}
try {
  const inputBytes = readFileSync(process.argv[2])
  const inputs = JSON.parse(inputBytes)
  if (!Array.isArray(inputs) || inputs.length === 0) throw new Error("Lista completa no vacía requerida")
  const before = inventory()
  const { Effect, Schema } = await import("effect")
  const { liquidarIrpfAnualExplicito } = await import("../../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts")
  const { CasoFiscalAnualExplicito } = await import("../../../lib/dominio/irpf/trabajo-anual/conexion-contrato.ts")
  const sourcesSha256 = hash(JSON.stringify(before))
  const base = execFileSync("jj", ["--ignore-working-copy", "log", "-r", "@-", "--no-graph", "-T", "commit_id"], { cwd: root, timeout: 30000, encoding: "utf8" }).trim()
  const runtime = { bun: process.versions.bun, node: process.versions.node, executableSha256: hash(readFileSync(process.execPath)), platform: process.platform, arch: process.arch }
  const results = inputs.map((entrada) => {
    const inputSha256 = hash(JSON.stringify(entrada))
    try {
      const decoded = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada, { onExcessProperty: "error" })
      const result = Effect.runSync(liquidarIrpfAnualExplicito(decoded))
      const scalars = Object.fromEntries(Object.entries(result).filter(([key]) => key !== "rastro" && key !== "componentesCuota"))
      const components = Object.fromEntries(Object.entries(result.componentesCuota).filter(([key]) => key !== "unidad"))
      const monetaryKeys = ["reduccionArt20", "rendimientoNetoReducido", "baseImponibleGeneral", "baseLiquidableGeneral", "deduccionTrabajo", "cuotaPosterior", "cuotaDiferencial", "cuotaDiferencialPresentada"]
      return { state: "calculado", entrada, entradaEfectiva: decoded, passedInputSha256: hash(JSON.stringify(decoded)), inputSha256, monetario: { ...Object.fromEntries(monetaryKeys.map((key) => [key, result[key]])), ...components }, resultado: scalars }
    } catch (error) {
      return { state: "rechazado", entrada, inputSha256, reason: String(error) }
    }
  })
  const after = inventory()
  if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("Fuentes/dependencias cambiaron durante ejecución")
  process.stdout.write(JSON.stringify({ schema: "motor-real-c-v1", motor: { base, estado: "candidato-base-mas-inventario", sourcesSha256, before, after, runtime, politica: "API explicita; sin tolerancia; EUR texto" }, inputFileSha256: hash(inputBytes), results }) + "\n")
  if (results.some((r) => r.state !== "calculado")) process.exitCode = 2
} catch (error) {
  process.stdout.write(JSON.stringify({ state: "incompleto", reason: String(error) }) + "\n")
  process.exitCode = 2
}
