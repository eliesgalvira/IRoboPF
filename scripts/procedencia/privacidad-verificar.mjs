import { readFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { fileURLToPath } from "node:url"
import { resolve } from "node:path"
import { parseArgs } from "node:util"

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex")

// A documentary redaction is a different object. This explicit check does not
// participate in CAS reads, fiscal acceptance or attestation verification.
export function verificarCopiaAnonimizada(bytes, original, ledger) {
  if (!/^[a-f0-9]{64}$/.test(original)) throw new Error("Hash original inválido")
  if (ledger.schemaVersion !== 1 || !Array.isArray(ledger.objects))
    throw new Error("Mapa de anonimización inválido")
  const actual = sha256(bytes)
  if (actual === original)
    return { estado: "bytes-originales", original, actual, mismosBytes: true }
  const matches = ledger.objects.filter(
    (row) => row.originalSha256 === original && row.publicSha256 === actual
  )
  if (matches.length !== 1 || matches[0].publicBytes !== bytes.length)
    throw new Error("La copia no corresponde al mapa de anonimización")
  return {
    estado: "copia-anonimizada",
    original,
    actual,
    mismosBytes: false,
    renuevaAceptacion: false,
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      original: { type: "string" },
      archivo: { type: "string" },
      mapa: { type: "string" },
    },
  })
  if (!values.original || !values.archivo)
    throw new Error("Uso: --original SHA256 --archivo RUTA [--mapa RUTA]")
  const ledger = JSON.parse(
    readFileSync(
      values.mapa ??
        new URL("../../docs/procedencia/privacidad/objetos.json", import.meta.url),
      "utf8"
    )
  )
  process.stdout.write(
    JSON.stringify(
      verificarCopiaAnonimizada(readFileSync(values.archivo), values.original, ledger),
      null,
      2
    ) + "\n"
  )
}
