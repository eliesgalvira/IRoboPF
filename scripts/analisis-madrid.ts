// Frontera síncrona CLI; no forma parte de un programa Effect.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs"
import { analizarMadrid, type EntradaAnalisisMadrid } from "../lib/dominio/irpf/analisis-madrid/analizar"

// Entrada JSON por stdin; salida estable, sin reloj ni red.
try {
  // SAFETY: analizarMadrid valida claves, alcance y operandos antes de evaluar.
  const entrada = JSON.parse(readFileSync(0, "utf8")) as EntradaAnalisisMadrid
  const resultado = Array.isArray(entrada) ? entrada.map(analizarMadrid) : analizarMadrid(entrada)
  process.stdout.write(JSON.stringify(resultado, null, 2) + "\n")
  if (Array.isArray(resultado) ? resultado.some(r => r.estado === "no-disponible") : resultado.estado === "no-disponible") process.exitCode = 1
} catch {
  process.stdout.write(JSON.stringify({ estado: "no-disponible", motivo: "Entrada JSON inválida o ilegible" }) + "\n")
  process.exitCode = 1
}
