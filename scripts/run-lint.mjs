import { spawnSync } from "node:child_process"

// Ejecutar ambos incluso cuando el primero detecta deuda; conservar el fallo.
let failed = false
for (const script of ["lint:oxlint", "lint:eslint"]) {
  const result = spawnSync("bun", ["run", script], { stdio: "inherit" })
  if (result.error) console.error(result.error)
  if (result.status !== 0) failed = true
}
process.exitCode = failed ? 1 : 0
