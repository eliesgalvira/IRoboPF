import { readFileSync, readdirSync, lstatSync, realpathSync } from "node:fs"
import { resolve } from "node:path"
import { Schema } from "effect"
import { Hash } from "../../lib/procedencia/modelo.ts"
import { verifyLinks } from "./verificar-enlaces.mjs"
import { FUENTES_EXPLICACION } from "./explicacion-version.mjs"
import { readArtifact } from "./inventario-artefacto.mjs"
import { baseFicha } from "./contenido-generar.mjs"
import {
  hash,
  bytesEntidad,
  verificarGrafo,
} from "../../lib/procedencia/verificador.ts"

// Frontera Node para el ciclo de vida del scratch del consumidor/test.
export { rmSync } from "node:fs"
export { dirname } from "node:path"

const registro = "docs/procedencia/enlaces/registro.json"
const inventario = "docs/procedencia/inventario.json"
const almacen = "docs/procedencia/implementaciones/contenidos/datos/objetos/"
const fixtures = "docs/procedencia/corpus/fixtures/sha256/"
const json = (bytes) => JSON.parse(bytes.toString("utf8"))
function leer(root, path) {
  if (
    !/^[a-zA-Z0-9_./\[\]-]+$/.test(path) ||
    path.split("/").includes("..") ||
    path.startsWith("/")
  )
    throw new Error("Ruta no canónica")
  const absolute = resolve(root, path)
  if (!lstatSync(absolute).isFile() || realpathSync(absolute) !== absolute)
    throw new Error("Dependencia no ordinaria")
  return readFileSync(absolute)
}
function cerrado(value, keys) {
  if (!value || Object.keys(value).sort().join() !== [...keys].sort().join())
    throw new Error("Campos extra o ausentes")
}
const digest = Schema.decodeUnknownSync(Hash)

// Preparar es inspección, nunca prueba de ejecución ni aprobación editorial.
// Solo recorre entradas registradas; no descubre entregas parciales.
export function prepararEntrada(root, snapshot) {
  digest(snapshot)
  const paths = new Set([
    registro,
    inventario,
    almacen + snapshot,
    "package.json",
    "bun.lock",
    ...FUENTES_EXPLICACION,
  ])
  const manifest = json(leer(root, inventario))
  paths.add("docs/procedencia/" + manifest.artifact.file)
  for (const input of manifest.generationInputs) paths.add(input.file)
  function directorio(path) {
    for (const entry of readdirSync(resolve(root, path), {
      withFileTypes: true,
    })) {
      const child = path + "/" + entry.name
      if (
        entry.name.startsWith(".") ||
        entry.name === "__pycache__" ||
        entry.name === "rastro-generado.json"
      )
        continue
      if (entry.isDirectory()) directorio(child)
      else if (/\.(mjs|ts|py|json|nix|lock|toml|sh)$/.test(child))
        paths.add(child)
    }
  }
  for (const path of [
    "scripts/procedencia",
    "lib/procedencia",
    "schemas/procedencia",
    "tools/procedencia",
  ])
    directorio(path)
  function referencia(ref, parse = true) {
    digest(ref.sha256)
    const bytes = leer(root, ref.path)
    if (hash(bytes) !== ref.sha256) throw new Error("Referencia alterada")
    paths.add(ref.path)
    return parse ? json(bytes) : bytes
  }
  const entries = json(leer(root, registro)).entries
  for (const entry of entries) {
    const payload = referencia(entry.payload)
    const citation = referencia(payload.citation)
    const document = referencia(payload.document)
    referencia(payload.legalReview.decisions)
    paths.add(payload.source.file)
    paths.add(fixtures + document.sha256)
    paths.add(fixtures + citation.facsimile.sha256)
    if (entry.attestation !== null) {
      const attestation = referencia(entry.attestation)
      referencia(attestation.report, false)
      const reviewersPath = "docs/procedencia/enlaces/revisores.json"
      paths.add(reviewersPath)
      for (const reviewer of json(leer(root, reviewersPath)).reviewers)
        referencia(reviewer.delegationRegistry)
    }
  }
  return {
    version: 1,
    snapshot,
    dependencias: [...paths]
      .sort()
      .map((path) => ({ path, sha256: hash(leer(root, path)) })),
  }
}

export function comprobarEntrada(root, entrada) {
  cerrado(entrada, ["version", "snapshot", "dependencias"])
  if (entrada.version !== 1) throw new Error("Versión no soportada")
  const seen = new Set()
  for (const dependency of entrada.dependencias) {
    cerrado(dependency, ["path", "sha256"])
    digest(dependency.sha256)
    if (seen.has(dependency.path)) throw new Error("Dependencia duplicada")
    seen.add(dependency.path)
    if (hash(leer(root, dependency.path)) !== dependency.sha256)
      throw new Error("Dependencia alterada: " + dependency.path)
  }
  const actual = prepararEntrada(root, entrada.snapshot)
  if (JSON.stringify(actual) !== JSON.stringify(entrada))
    throw new Error("Cierre de dependencias distinto")
  const snapshot = json(leer(root, almacen + entrada.snapshot))
  if (
    hash(leer(root, almacen + entrada.snapshot)) !== entrada.snapshot ||
    snapshot.inventario !== hash(leer(root, inventario))
  )
    throw new Error("Snapshot ajeno al inventario")
}

// No acepta resultados ni un runner inyectado: ejecuta el coordinador real.
export async function generarEvidencia(root, entrada) {
  comprobarEntrada(root, entrada)
  const execution = await verifyLinks(root)
  comprobarEntrada(root, entrada)
  const { files } = readArtifact(root)
  const items = new Map()
  for (const [name, bytes] of files) {
    if (!/^inventario-pagina-[0-9]+\.json$/.test(name)) continue
    for (const item of JSON.parse(bytes)) {
      if (items.has(item.id)) throw new Error("ID de inventario duplicado")
      items.set(item.id, item)
    }
  }
  const objetos = new Map()
  const entradas = []
  const ids = new Set()
  const guardar = (bytes) => {
    const buffer = Buffer.from(bytes)
    const sha256 = hash(buffer)
    objetos.set(sha256, buffer)
    return sha256
  }
  const agregar = (entidad) => {
    if (ids.has(entidad.id)) throw new Error("ID duplicado")
    ids.add(entidad.id)
    const revision = guardar(bytesEntidad(entidad))
    entradas.push({ revision, entidad })
    return { id: entidad.id, revision }
  }
  const estados = []
  for (const entry of json(leer(root, registro)).entries) {
    const payload = json(leer(root, entry.payload.path))
    const citation = json(leer(root, payload.citation.path))
    const document = json(leer(root, payload.document.path))
    const result = execution.evidence.find((e) => e.id === payload.id)
    if (
      !result ||
      result.numericBinding !== "verified" ||
      result.integrity !== "verified" ||
      result.completeRuleAcceptance !== false
    )
      throw new Error("Ejecución incompleta")
    const item = items.get(payload.itemId)
    if (!item || !["Parameter", "Step"].includes(item.kind))
      throw new Error("Tipo no soportado: requiere adaptador explícito")
    const geometry = citation.geometry
    if (
      geometry.rotation !== 0 ||
      geometry.cropBox[0] !== 0 ||
      geometry.cropBox[1] !== 0 ||
      JSON.stringify(geometry.cropBox) !== JSON.stringify(geometry.mediaBox)
    )
      throw new Error(
        "Geometría requiere extensión del modelo; no se transforma silenciosamente"
      )
    const receta = guardar(
      JSON.stringify({
        geometry,
        page: citation.page,
        bbox: citation.bbox,
        parameters: citation.facsimile.parameters,
      })
    )
    const original = guardar(leer(root, fixtures + document.sha256))
    const imagen = guardar(leer(root, fixtures + citation.facsimile.sha256))
    const evidencia = `Original: ${document.canonicalUrl}. SHA-256: ${original}. Página PDF (desde 1): ${citation.page}. Bbox: ${JSON.stringify(citation.bbox)}; ${geometry.coordinateSystem}. Crop PNG SHA-256: ${imagen}. Cita exacta:\n${citation.quote}`
    const base = (id, titulo) => {
      const ficha = baseFicha(id, titulo, "concepto")
      return {
        ...ficha,
        secciones: {
          ...ficha.secciones,
          norma: { estado: "candidata", texto: payload.scope.claim },
          evidencia: { estado: "candidata", texto: evidencia },
          bordes: {
            estado: "candidata",
            texto:
              payload.scope.conditions.join("\n") +
              "\nAceptación fiscal completa: pendiente. Revisión del binding: " +
              result.bindingReview +
              ". Autenticidad histórica: " +
              result.authenticity +
              ".",
          },
        },
      }
    }
    // IDs por binding: no se deduplican dos documentos con ámbitos diferentes.
    const prefix = "evidencia." + entry.payload.sha256
    const doc = agregar({
      ...base(prefix + ".document", "Original documental"),
      tipo: "Document",
      original,
      mime: document.mimeType,
      url: document.canonicalUrl,
    })
    const cita = agregar({
      ...base(prefix + ".citation", "Cita literal"),
      tipo: "Citation",
      aristas: [{ relacion: "documento", destino: doc }],
      selector: {
        tipo: "pdf",
        pagina: citation.page,
        ancho: geometry.cropBox[2],
        alto: geometry.cropBox[3],
        caja: citation.bbox,
        coordenadas: "pymupdf-cropbox-sin-rotar",
        extraccion: citation.extraction,
        receta,
        texto: citation.quote,
      },
    })
    const crop = agregar({
      ...base(prefix + ".facsimile", "Facsímil reproducido del original"),
      tipo: "Facsimile",
      imagen,
      receta,
      transcripcion: citation.quote,
      aristas: [{ relacion: "evidencia", destino: cita }],
    })
    const rule = agregar({
      ...base(prefix + ".rule", "Proposición jurídica candidata"),
      tipo: "Rule",
      proposicion: payload.scope.claim,
      aristas: [
        { relacion: "evidencia", destino: cita },
        { relacion: "captura", destino: crop },
      ],
    })
    const sujeto = agregar({
      ...base(item.id, item.name),
      identidad: "ocurrencia",
      tipo: item.kind,
      expresion: item.expression,
      valorObservado: item.value,
      unidadCandidata: item.unit,
      ejerciciosCandidatos: item.years,
      territoriosCandidatos: item.territories,
      claseInventario: item.kind,
      fuentes: [
        {
          archivo: item.source.file,
          sha256: item.source.sha256,
          localizador: JSON.stringify({
            symbol: item.symbol,
            path: item.path,
            ...item.source,
          }),
        },
      ],
      aristas: [{ relacion: "norma", destino: rule }],
    })
    estados.push({
      sujeto,
      payload: entry.payload,
      snapshotOrigen: entrada.snapshot,
      integridad: result.integrity,
      exactitudNumerica: result.numericBinding,
      autenticidad: result.authenticity,
      interpretacion: {
        decisionLimitada: result.legalDecision,
        alcance: payload.scope,
        estado: "candidata",
      },
      revisionBinding: result.bindingReview,
      aceptacionFiscalCompleta: false,
    })
  }
  verificarGrafo(entradas, new Set(objetos.keys()))
  comprobarEntrada(root, entrada)
  for (const dependency of entrada.dependencias)
    guardar(leer(root, dependency.path))
  const informe = { version: 1, entrada, estados, entradas }
  const revision = guardar(JSON.stringify(informe))
  return { revision, informe, objetos }
}

export function rutaPublicaBlob(sha256) {
  digest(sha256)
  return "/procedencia/objetos/" + sha256
}
