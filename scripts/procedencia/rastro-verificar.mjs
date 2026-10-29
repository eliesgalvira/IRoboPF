import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Schema } from "effect"
import { CatalogoRastro } from "../../lib/procedencia/rastro-anual.ts"
import {
  leerSnapshot,
  resolver,
  directorioContenido,
} from "../../lib/procedencia/almacen.ts"
import { hash } from "../../lib/procedencia/verificador.ts"
import { extraerPuntos } from "./rastro-extraer.mjs"
import { verificarSoftwareExplicacion } from "./explicacion-version.mjs"

export function verificarRastroGenerado(
  root = process.cwd(),
  raiz = directorioContenido
) {
  const catalogo = Schema.decodeUnknownSync(
    Schema.fromJsonString(CatalogoRastro)
  )(
    readFileSync(resolve(root, "lib/procedencia/rastro-generado.json"), "utf8"),
    { onExcessProperty: "error" }
  )
  if (catalogo.actual === null)
    throw new Error("Catálogo del rastro sin generar")
  const { versiones, catalogoSha256 } = catalogo.actual
  const snapshot = leerSnapshot(versiones.snapshot, raiz)
  if (snapshot === null) throw new Error("Snapshot del rastro desconocido")
  verificarSoftwareExplicacion(snapshot, root)
  if (
    snapshot.versiones.algoritmo !== versiones.algoritmo ||
    snapshot.versiones.datos !== versiones.datos ||
    snapshot.versiones.explicacion !== versiones.explicacion
  )
    throw new Error("Versiones del rastro distintas del snapshot")
  const actual = readFileSync(resolve(root, "docs/procedencia/inventario.json"))
  if (hash(actual) !== snapshot.inventario)
    throw new Error("Rastro corresponde a otro inventario")
  const manifest = JSON.parse(actual)
  const { puntos, fuentes } = extraerPuntos(root, manifest.generationInputs)
  if (
    hash(JSON.stringify(catalogo.bindings)) !== catalogoSha256 ||
    !snapshot.auxiliares.includes(catalogoSha256)
  )
    throw new Error("Bindings distintos del catálogo conservado")
  const conservado = readFileSync(resolve(raiz, "objetos", catalogoSha256))
  if (hash(conservado) !== catalogoSha256)
    throw new Error("Catálogo conservado corrupto")
  if (puntos.length !== catalogo.bindings.length)
    throw new Error("Cobertura de puntos incompleta")
  for (const [i, p] of puntos.entries()) {
    const b = catalogo.bindings[i]
    if (
      b.siteId !== p.siteId ||
      b.unidad !== p.unidad ||
      b.sujeto.id !== `paso.${p.siteId}`
    )
      throw new Error("Identidad del punto distinta")
    const e = resolver(versiones.snapshot, b.sujeto.id, b.sujeto.revision, raiz)
    if (
      e?.tipo !== "Step" ||
      e.claseInventario !== "PuntoRastro" ||
      e.expresion !== p.expresion ||
      e.unidadCandidata !== p.unidad ||
      JSON.stringify(e.fuentes) !== JSON.stringify([p.fuente])
    )
      throw new Error("Ficha distinta del punto instrumentado")
  }
  for (const f of fuentes) {
    const h = hash(f.bytes)
    if (
      !snapshot.auxiliares.includes(h) ||
      hash(readFileSync(resolve(raiz, "objetos", h))) !== h
    )
      throw new Error("Fuente instrumentada no conservada")
  }
  return {
    puntos: puntos.length,
    snapshot: versiones.snapshot,
    aceptacionFiscal: "pendiente",
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  process.stdout.write(JSON.stringify(verificarRastroGenerado()) + "\n")
