import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { readArtifact } from "../../../../scripts/procedencia/inventario-artefacto.mjs"
import { hash } from "../../../../lib/procedencia/verificador.ts"

const root = process.cwd()
const ruta = resolve(root, "docs/procedencia/enlaces/madrid-2020-limite.json")
const previo = readFileSync(ruta)
const payload = JSON.parse(previo)
const { manifest, files } = readArtifact(root)
const items = [...files]
  .filter(([name]) => /^inventario-pagina-\d+\.json$/.test(name))
  .flatMap(([, bytes]) => JSON.parse(bytes))
const item = items.find((i) => i.id === payload.itemId)
if (
  !item ||
  item.value !== "53407.2" ||
  item.unit !== "EUR (límite de base; periodicidad pendiente)" ||
  item.source.file !== payload.source.file ||
  item.source.sha256 !== payload.source.sha256 ||
  item.symbol !== payload.source.symbol ||
  item.path !== JSON.stringify(payload.source.tablePath)
)
  throw new Error("Identidad o valor de Madrid cambió; requiere otra revisión")
const historial = resolve(
  root,
  "docs/procedencia/enlaces/historial",
  hash(previo) + ".json"
)
if (existsSync(historial)) {
  if (!readFileSync(historial).equals(previo))
    throw new Error("Historial alterado")
} else writeFileSync(historial, previo)
payload.inventory = {
  manifestSha256: hash(
    readFileSync(resolve(root, "docs/procedencia/inventario.json"))
  ),
  artifactSha256: manifest.artifact.sha256,
}
const bytes = Buffer.from(JSON.stringify(payload, null, 2) + "\n")
writeFileSync(ruta, bytes)
const registro = {
  schemaVersion: 1,
  entries: [
    {
      payload: {
        path: "docs/procedencia/enlaces/madrid-2020-limite.json",
        sha256: hash(bytes),
      },
      attestation: null,
    },
  ],
}
writeFileSync(
  resolve(root, "docs/procedencia/enlaces/registro.json"),
  JSON.stringify(registro, null, 2) + "\n"
)
process.stdout.write(
  JSON.stringify({
    previo: hash(previo),
    actual: hash(bytes),
    inventory: payload.inventory,
    attestation: null,
  }) + "\n"
)
