// Auxiliar de pruebas: conserva los bytes hipotéticos fuera del repositorio.
import { createHash } from "node:crypto"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

export function crearCasTemporal() {
  const root = mkdtempSync(join(tmpdir(), "contrato-cas-"))
  const bytes = Buffer.from(
    "Fixture mínimo de integridad; no es fuente fiscal."
  )
  const documento = {
    id: "fixture",
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    sha512: createHash("sha512").update(bytes).digest("hex"),
  }
  mkdirSync(join(root, "sha256"))
  writeFileSync(join(root, documento.sha256), bytes)
  writeFileSync(join(root, "sha256", documento.sha256), bytes)
  return {
    root,
    documento,
    corromper: () =>
      writeFileSync(join(root, documento.sha256), Buffer.alloc(bytes.length)),
  }
}
