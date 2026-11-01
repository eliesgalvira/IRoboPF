import { spawnSync } from "node:child_process"
import { tmpdir } from "node:os"
import { resolve, join } from "node:path"
import { fileURLToPath } from "node:url"

const script = fileURLToPath(new URL("./verificar.py", import.meta.url))
const argumentosUv = [
  "run",
  "--no-project",
  "--python",
  "python3",
  "--no-managed-python",
  "--with",
  "jsonschema==4.26.0",
  "--with",
  "markdown-it-py==4.0.0",
  "python",
  script,
]
const entorno = {
  ...process.env,
  UV_PROJECT_ENVIRONMENT:
    process.env.UV_PROJECT_ENVIRONMENT ??
    join(tmpdir(), "irobopf-contrato-uv-env"),
  UV_CACHE_DIR:
    process.env.UV_CACHE_DIR ?? join(tmpdir(), "irobopf-contrato-uv-cache"),
}
function ejecutar(operacion, entrada) {
  const r = spawnSync("uv", [...argumentosUv, "--operacion", operacion], {
    input: JSON.stringify(entrada),
    encoding: "utf8",
    env: entorno,
    maxBuffer: 8 * 1024 * 1024,
  })
  if (r.status !== 0 && r.stderr) throw new Error(r.stderr)
  if (r.error) throw r.error
  if (r.status !== 0) throw new Error("Verificador sin resultado")
  return JSON.parse(r.stdout)
}
export const validarSchema = (valor, regla) =>
  ejecutar("schema", { valor, regla })
export const comprobarBytes = (documento, cas) =>
  ejecutar("bytes", { documento, cas })
export const verificarPaquetes = (entrada) => ejecutar("paquetes", entrada)

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const r = spawnSync("uv", [...argumentosUv, ...process.argv.slice(2)], {
    stdio: "inherit",
    env: entorno,
  })
  if (r.error) console.error(r.error.message)
  process.exitCode = r.status ?? 1
}
