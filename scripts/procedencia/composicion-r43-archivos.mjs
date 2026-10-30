// @ts-check
// Generador documental síncrono: lee bytes locales para integridad, fuera del motor Effect.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
/** Hash de contenido local para el productor documental síncrono; no es una operación del motor fiscal.
 * @param {string} path
 */
export function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex")
}
