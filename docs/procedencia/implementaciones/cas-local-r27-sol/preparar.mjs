// Solo fuentes ya entregadas por el padre; no recorre entregas activas.
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  symlinkSync,
} from "node:fs"
import { resolve, dirname } from "node:path"
import { createHash } from "node:crypto"
const root = process.cwd()
const target = resolve(".cache/cas-local-r27-sol/ensayo")
const source =
  process.env.IRPF_CAS_FUENTE ??
  "/home/elies/Repos/IRoboPF/.cache/orquestador-recepcion/r27/multiplicidad/despues-url"
const receipt = JSON.parse(
  readFileSync(
    "docs/procedencia/correcciones/multiplicidad-r27/despues-url/preparacion.json"
  )
)
const copy = (from, to) => {
  mkdirSync(dirname(to), { recursive: true })
  copyFileSync(from, to)
}
for (const p of receipt.files) copy(resolve(source, p), resolve(target, p))
for (const p of [
  "docs/procedencia/enlaces/registro.json",
  "docs/procedencia/enlaces/revisores.json",
])
  copy(resolve(source, p), resolve(target, p))
const cas = []
for (const entry of receipt.cas) {
  const p = "docs/procedencia/corpus/fixtures/sha256/" + entry.sha256
  copy(resolve(source, p), resolve(target, p))
  const bytes = readFileSync(resolve(target, p))
  const hash = (a) => createHash(a).update(bytes).digest("hex")
  if (
    hash("sha256") !== entry.sha256 ||
    hash("sha512") !== entry.sha512 ||
    bytes.length !== entry.size
  )
    throw Error("Original no idéntico")
  cas.push({
    sha256: entry.sha256,
    sha512: entry.sha512,
    bytes: entry.size,
    clase: bytes.subarray(0, 5).equals(Buffer.from("%PDF-"))
      ? "original-pdf"
      : "facsimil-png",
    mime: bytes.subarray(0, 5).equals(Buffer.from("%PDF-"))
      ? "application/pdf"
      : "image/png",
    ruta: p,
  })
}
// El software actual define una versión candidata nueva; jamás reemplaza snapshots históricos.
for (const p of [
  ...receipt.files.filter((p) =>
    /^(scripts\/procedencia|lib\/procedencia|schemas\/procedencia|app\/procedencia)\//.test(
      p
    )
  ),
])
  copy(resolve(root, p), resolve(target, p))
symlinkSync(resolve(root, "node_modules"), resolve(target, "node_modules"))
mkdirSync(resolve(".cache/cas-local-r27-sol/externo"), { recursive: true })
writeFileSync(
  resolve(".cache/cas-local-r27-sol/originales.json"),
  JSON.stringify(cas, null, 2) + "\n"
)
console.log(
  JSON.stringify({
    target,
    pairs: JSON.parse(
      readFileSync(resolve(target, "docs/procedencia/enlaces/registro.json"))
    ).entries.length,
    originales: cas.length,
  })
)
