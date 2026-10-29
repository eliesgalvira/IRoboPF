import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { prepararEntrada } from "../../../../scripts/procedencia/evidencia-contenido.mjs"
import { publicar } from "../../../../scripts/procedencia/contenido-publicar.mjs"
import { leerSnapshot } from "../../../../lib/procedencia/almacen.ts"

const root = process.cwd()
const entrega = resolve(root, "docs/procedencia/correcciones/contratos-r21")
const datos = resolve(
  root,
  "docs/procedencia/implementaciones/contenidos/datos"
)
const aliasPath = resolve(root, "lib/procedencia/rastro-generado.json")
const alias = JSON.parse(readFileSync(aliasPath, "utf8"))
const guardada = resolve(entrega, "entrada-publicacion.json")
const entrada = process.argv.includes("--repetir")
  ? JSON.parse(readFileSync(guardada, "utf8"))
  : prepararEntrada(root, alias.actual.versiones.snapshot)
if (!process.argv.includes("--repetir"))
  writeFileSync(guardada, JSON.stringify(entrada, null, 2) + "\n")
const resultado = await publicar(root, entrada, datos, datos)
const snapshot = leerSnapshot(resultado.snapshot, datos)
if (snapshot?.version !== 2) throw new Error("Publicación v2 ausente")
if (snapshot.catalogo !== alias.actual.catalogoSha256)
  throw new Error("El catálogo publicado no coincide con el rastro")
alias.actual.versiones = { snapshot: resultado.snapshot, ...snapshot.versiones }
writeFileSync(aliasPath, JSON.stringify(alias) + "\n")
writeFileSync(
  resolve(entrega, "publicacion.json"),
  JSON.stringify(resultado, null, 2) + "\n"
)
process.stdout.write(JSON.stringify(resultado) + "\n")
