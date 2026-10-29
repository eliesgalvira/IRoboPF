import { spawnSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { relative, resolve } from "node:path"

const diagnostics = []
for (const tool of ["oxlint", "eslint"]) {
  const result = spawnSync(resolve(`node_modules/.bin/${tool}`), ["--format", "json", "."], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })
  if (result.error) throw result.error
  if (result.status !== 0 && result.status !== 1) throw new Error(`${tool}: ${result.stderr}`)
  const output = JSON.parse(result.stdout)
  if (tool === "oxlint") {
    for (const item of output.diagnostics) {
      diagnostics.push({ tool, rule: item.code, file: item.filename, line: item.labels?.[0]?.span.line ?? 0, column: item.labels?.[0]?.span.column ?? 0, severity: item.severity, message: item.message })
    }
  } else {
    for (const file of output) {
      for (const item of file.messages) {
        diagnostics.push({ tool, rule: item.ruleId ?? "parse-error", file: relative(process.cwd(), file.filePath), line: item.line ?? 0, column: item.column ?? 0, severity: item.severity === 2 ? "error" : "warning", message: item.message })
      }
    }
  }
}
diagnostics.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule))
const groups = new Map()
for (const item of diagnostics) {
  const key = `${item.rule}\t${item.file}`
  groups.set(key, (groups.get(key) ?? 0) + 1)
}
const directory = "docs/procedencia/lint"
mkdirSync(directory, { recursive: true })
writeFileSync(`${directory}/diagnosticos.json`, JSON.stringify(diagnostics, null, 2) + "\n")
writeFileSync(`${directory}/por-regla-archivo.tsv`, "regla\tarchivo\tcantidad\n" + [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([key, count]) => `${key}\t${count}\n`).join(""))
console.log(`${diagnostics.length} diagnósticos en ${new Set(diagnostics.map((item) => item.file)).size} archivos; informe en ${directory}`)
process.exitCode = diagnostics.some((item) => item.severity === "error") ? 1 : 0
