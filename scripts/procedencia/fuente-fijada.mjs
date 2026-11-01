import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
const pins = JSON.parse(readFileSync(new URL("./fuentes-actuales.json", import.meta.url), "utf8"))
// Contrato explícito por contenido; independiente de Git y del root de mutaciones.
export function verificarFuente(file, bytes) {
  const digest = createHash("sha256").update(bytes).digest("hex")
  if (pins[file] !== digest) throw Error("Contrato de fuente cambiado: " + file)
}
