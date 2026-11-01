import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { tmpdir } from "node:os"
import { gzipSync } from "node:zlib"
import { hash, bytesEntidad } from "../../lib/procedencia/verificador.ts"
import { baseFicha } from "./contenido-generar.mjs"
import { extraerPuntosTexto } from "./rastro-extraer.mjs"
import { FUENTES_EXPLICACION } from "./explicacion-version.mjs"

// Bytes sintéticos y fuentes públicas actuales; ningún acceso al CAS o Git.
export function crearFixtureCI() {
  const root = mkdtempSync(resolve(tmpdir(), "procedencia-ci-"))
  const raiz = resolve(root, "contenido")
  const escribir = (file, bytes) => {
    const target = resolve(root, file)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, bytes)
  }
  const guardar = (bytes) => {
    const h = hash(bytes)
    escribir("contenido/objetos/" + h, bytes)
    return h
  }
  const archivo = "lib/dominio/sintetico.ts"
  const texto = 'crearLineaCalculo({siteId:"prueba.importe",instancia:0,importe:123,unidad:"EUR",etiqueta:"Sintético",formula:"123"})'
  escribir(archivo, texto)
  const [punto] = extraerPuntosTexto(texto, archivo)
  const entidad = {
    ...baseFicha("paso.prueba.importe", "Paso sintético", "concepto"),
    tipo: "Step", claseInventario: "PuntoRastro",
    ejerciciosCandidatos: [], territoriosCandidatos: [], valorObservado: "123", expresion: punto.expresion, unidadCandidata: punto.unidad,
    fuentes: [punto.fuente],
  }
  const revision = hash(bytesEntidad(entidad))
  const entradas = [{ entidad, revision }]
  const bindings = [{ siteId: punto.siteId, sujeto: { id: entidad.id, revision }, unidad: punto.unidad }]
  const catalogoSha256 = guardar(JSON.stringify(bindings))
  const generationInputs = [{ file: archivo, sha256: hash(texto) }]
  const summary = { generationInputs }
  const datos = gzipSync(Buffer.from(JSON.stringify([["inventario.json", JSON.stringify(summary) + "\n"]])))
  const manifest = { ...summary, artifact: { file: "inventario-datos.json.gz", format: "gzip-json-files-v1", size: datos.length, sha256: hash(datos) } }
  const inventario = guardar(JSON.stringify(manifest))
  escribir("docs/procedencia/inventario.json", JSON.stringify(manifest))
  const software = [...FUENTES_EXPLICACION, "scripts/procedencia/contenido-generar.mjs"]
  const hashes = software.map(file => {
    const bytes = readFileSync(new URL("../../" + file, import.meta.url))
    escribir(file, bytes)
    return guardar(bytes)
  })
  const generador = hashes.at(-1)
  const versiones = { algoritmo: hash(JSON.stringify(generationInputs)), datos: guardar(datos), explicacion: hash(JSON.stringify({ generador, fuentesSoftware: hashes.slice(0, -1) })) }
  const bytes = gzipSync(Buffer.from(JSON.stringify(entradas)))
  const snapshot = {
    version: 2, inventario, contrato: guardar("contrato sintético"), generador,
    politica: "candidata", versiones, cantidad: 1,
    auxiliares: [...new Set([inventario, versiones.datos, ...hashes, catalogoSha256, guardar(texto)])],
    paquetes: [{ prefijo: hash(entidad.id).slice(0, 2), hash: guardar(bytes), indice: guardar(JSON.stringify([{ id: entidad.id, revision }])), bytes: bytes.length, cantidad: 1 }],
  }
  snapshot.catalogo = catalogoSha256
  snapshot.evidencias = []
  snapshot.publicos = []
  snapshot.busqueda = guardar(gzipSync(Buffer.from(JSON.stringify([{ id: entidad.id, revision, titulo: entidad.titulo, ejercicios: [], territorios: [] }]))))
  snapshot.auxiliares.push(snapshot.contrato, snapshot.busqueda)
  snapshot.dependencias = snapshot.auxiliares.map(h => ({ hash: h, bytes: readFileSync(resolve(raiz, "objetos", h)).length }))
  const id = guardar(JSON.stringify(snapshot))
  escribir("contenido/snapshots.json", JSON.stringify([id]))
  escribir("lib/procedencia/rastro-generado.json", JSON.stringify({ version: 1, actual: { versiones: { snapshot: id, ...versiones }, catalogoSha256 }, bindings }))
  return { root, raiz, id, snapshot, entidad, revision }
}
