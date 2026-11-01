import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { resolve } from "node:path"

// Los informes mantienen los SHA originales como evidencia. Solo la consulta
// operativa se traduce a la historia filtrada, sin alterar el hash del informe.
export function resolverCommit(revision) {
  if (!/^[a-f0-9]{7,40}$/.test(revision)) throw new Error("Commit inválido")
  const mapa = readFileSync(
    new URL(
      "../../docs/procedencia/almacen-externo/mapa-commits.tsv",
      import.meta.url
    ),
    "utf8"
  )
  const candidatos = mapa
    .trim()
    .split("\n")
    .slice(1)
    .map((linea) => linea.split("\t"))
    .filter(([viejo]) => viejo.startsWith(revision))
  if (candidatos.length > 1) throw new Error("Prefijo de commit ambiguo")
  return candidatos.length === 1 ? candidatos[0][1] : revision
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (process.argv.length !== 3)
    throw new Error("Uso: bun scripts/procedencia/commit-historico.mjs SHA")
  process.stdout.write(resolverCommit(process.argv[2]) + "\n")
}
