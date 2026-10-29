import {
  verificarAceptacionLimitada,
  estadoAutenticidad,
} from "./ambito-publicado.mjs"
import { verificarSoftwareRecibo } from "./explicacion-version.mjs"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Schema } from "effect"
import { readArtifactBytes } from "./inventario-artefacto.mjs"
import { Referencia, Id } from "../../lib/procedencia/modelo.ts"
import {
  leerSnapshot,
  leerPaquete,
  leerBusqueda,
  objeto,
  directorioContenido,
} from "../../lib/procedencia/almacen.ts"
import {
  hash,
  bytesEntidad,
  verificarGrafo,
} from "../../lib/procedencia/verificador.ts"

export function verificarOcurrencia(entidad, item) {
  if (
    !entidad ||
    entidad.id !== item.id ||
    entidad.identidad !== "ocurrencia" ||
    entidad.titulo !== item.name ||
    entidad.tipo !==
      (["Parameter", "Formula", "Step", "Derivation"].includes(item.kind)
        ? item.kind
        : "Step") ||
    entidad.claseInventario !== item.kind ||
    entidad.fuentes.length !== 1 ||
    entidad.fuentes[0]?.archivo !== item.source.file ||
    entidad.fuentes[0]?.localizador !==
      JSON.stringify({
        symbol: item.symbol,
        path: item.path,
        ...item.source,
      }) ||
    entidad.expresion !== item.expression ||
    entidad.valorObservado !== item.value ||
    entidad.fuentes[0]?.sha256 !== item.source.sha256 ||
    entidad.unidadCandidata !== item.unit ||
    JSON.stringify(entidad.ejerciciosCandidatos) !==
      JSON.stringify(item.years) ||
    JSON.stringify(entidad.territoriosCandidatos) !==
      JSON.stringify(item.territories)
  )
    throw new Error("Ficha distinta del inventario fijado")
}

export function verificar(snapshotId, raiz = directorioContenido) {
  const snapshot = leerSnapshot(snapshotId, raiz)
  if (!snapshot) throw new Error("Snapshot desconocido")
  return verificarContenido(snapshot, raiz)
}

function claveSujeto(sujeto) {
  return JSON.stringify([sujeto.id, sujeto.revision])
}

function claveEnlace(sujeto, payload) {
  return JSON.stringify([sujeto.id, sujeto.revision, payload])
}

function coberturaEvidencias(snapshot, entradas, raiz) {
  const sujetos = entradas.filter(
    ({ entidad }) =>
      entidad.identidad === "ocurrencia" &&
      entidad.aristas.some((a) => a.relacion === "norma")
  )
  const esperados = new Set()
  for (const e of sujetos) {
    const sujeto = { id: e.entidad.id, revision: e.revision }
    for (const arista of e.entidad.aristas.filter(
      (a) => a.relacion === "norma"
    )) {
      const match = /^evidencia\.([a-f0-9]{64})\.rule$/.exec(arista.destino.id)
      if (!match) throw new Error("Cobertura de evidencia sin enlace exacto")
      const clave = claveEnlace(sujeto, match[1])
      if (esperados.has(clave))
        throw new Error("Cobertura de evidencia duplicada")
      esperados.add(clave)
    }
  }
  const declarados = new Set(
    snapshot.evidencias.map((e) => claveEnlace(e.sujeto, e.payload))
  )
  if (
    declarados.size !== snapshot.evidencias.length ||
    declarados.size !== esperados.size ||
    [...esperados].some((s) => !declarados.has(s))
  )
    throw new Error("Cobertura de evidencia incompleta o duplicada")

  const recibos = new Map()
  const documentados = new Set()
  const porReferencia = new Map(
    entradas.map((e) => [
      claveSujeto({ id: e.entidad.id, revision: e.revision }),
      e,
    ])
  )
  for (const h of new Set(snapshot.evidencias.map((e) => e.recibo))) {
    const recibo = JSON.parse(objeto(raiz, h).toString())
    const estados = snapshot.evidencias.filter((e) => e.recibo === h)
    if (
      ![1, 2].includes(recibo.version) ||
      !Array.isArray(recibo.estados) ||
      !Array.isArray(recibo.entradas) ||
      recibo.estados.length !== estados.length ||
      new Set(
        recibo.estados.map((e) => claveEnlace(e.sujeto, e.payload.sha256))
      ).size !== estados.length ||
      (recibo.version === 1 &&
        new Set(recibo.estados.map((e) => claveSujeto(e.sujeto))).size !==
          estados.length) ||
      recibo.estados.some(
        (e) =>
          !estados.some(
            (s) =>
              claveEnlace(s.sujeto, s.payload) ===
              claveEnlace(e.sujeto, e.payload.sha256)
          )
      )
    )
      throw new Error("Cobertura de evidencia distinta del recibo")
    verificarSoftwareRecibo(snapshot, recibo.entrada.dependencias, (h) =>
      objeto(raiz, h)
    )
    for (const e of recibo.entradas) {
      const clave = claveSujeto({ id: e.entidad.id, revision: e.revision })
      const actual = porReferencia.get(clave)
      if (!actual || bytesEntidad(actual.entidad) !== bytesEntidad(e.entidad))
        throw new Error("Grafo distinto del recibo")
      documentados.add(clave)
    }
    recibos.set(h, recibo)
  }
  for (const e of entradas)
    if (
      ["Document", "Citation", "Facsimile"].includes(e.entidad.tipo) &&
      !documentados.has(claveSujeto({ id: e.entidad.id, revision: e.revision }))
    )
      throw new Error(
        "Cobertura de evidencia sin recibo para entidad documental"
      )
  return recibos
}

export function verificarContenido(snapshot, raiz) {
  const entradas = []
  const prefijos = new Set()
  for (const paquete of snapshot.paquetes) {
    if (prefijos.has(paquete.prefijo)) throw new Error("Paquete duplicado")
    prefijos.add(paquete.prefijo)
    const grupo = leerPaquete(snapshot, paquete.prefijo, raiz)
    const raw = readFileSync(resolve(raiz, "objetos", paquete.indice))
    if (hash(raw) !== paquete.indice) throw new Error("Índice corrupto")
    const indice = Schema.decodeUnknownSync(
      Schema.fromJsonString(Schema.Array(Referencia))
    )(raw.toString("utf8"), { onExcessProperty: "error" })
    if (
      JSON.stringify(indice) !==
      JSON.stringify(
        grupo.map((e) => ({ id: e.entidad.id, revision: e.revision }))
      )
    )
      throw new Error("Índice distinto del paquete")
    entradas.push(...grupo)
  }
  for (const h of [
    snapshot.inventario,
    snapshot.contrato,
    snapshot.generador,
    ...snapshot.auxiliares,
  ]) {
    if (hash(readFileSync(resolve(raiz, "objetos", h))) !== h)
      throw new Error("Auxiliar corrupto")
  }
  if (entradas.length !== snapshot.cantidad)
    throw new Error("Conteo incorrecto")
  // Cada snapshot se coteja con su propio artefacto, nunca con el actual.
  const datosBytes = readFileSync(
    resolve(raiz, "objetos", snapshot.versiones.datos)
  )
  if (hash(datosBytes) !== snapshot.versiones.datos)
    throw new Error("Inventario histórico corrupto")
  const { files, manifest } = readArtifactBytes(
    readFileSync(resolve(raiz, "objetos", snapshot.inventario)),
    datosBytes
  )
  if (
    hash(JSON.stringify(manifest.generationInputs)) !==
    snapshot.versiones.algoritmo
  )
    throw new Error("Versión del algoritmo distinta del inventario fijado")
  const porId = new Map(
    entradas
      .filter((e) => e.entidad.identidad === "ocurrencia")
      .map((e) => [e.entidad.id, e.entidad])
  )
  let cotejadas = 0
  for (const [nombre, contenido] of files) {
    if (!/^inventario-pagina-\d+\.json$/.test(nombre)) continue
    for (const item of JSON.parse(contenido)) {
      const entidad = porId.get(item.id)
      verificarOcurrencia(entidad, item)
      cotejadas++
    }
  }
  if (cotejadas !== porId.size)
    throw new Error("Cobertura de ocurrencias incompleta")
  if (snapshot.version === 2) {
    const recibos = coberturaEvidencias(snapshot, entradas, raiz)
    if (!snapshot.auxiliares.includes(snapshot.catalogo))
      throw new Error("Catálogo no preservado")
    const bindings = Schema.decodeUnknownSync(
      Schema.fromJsonString(
        Schema.Array(
          Schema.Struct({
            siteId: Id,
            sujeto: Referencia,
            unidad: Schema.Literals(["EUR", "percent"]),
          })
        )
      )
    )(objeto(raiz, snapshot.catalogo).toString(), { onExcessProperty: "error" })
    const pasos = entradas.filter(
      (e) => e.entidad.claseInventario === "PuntoRastro"
    )
    if (
      new Set(bindings.map((b) => b.siteId)).size !== bindings.length ||
      pasos.length !== bindings.length ||
      bindings.some(
        (b) =>
          !pasos.some(
            (p) =>
              p.entidad.id === `paso.${b.siteId}` &&
              p.entidad.id === b.sujeto.id &&
              p.revision === b.sujeto.revision &&
              p.entidad.unidadCandidata === b.unidad
          )
      )
    )
      throw new Error("Catálogo distinto de puntos del snapshot")
    const esperado = [...entradas]
      .sort((a, b) => a.entidad.id.localeCompare(b.entidad.id))
      .map(({ revision, entidad: e }) => ({
        id: e.id,
        revision,
        titulo: e.titulo,
        ejercicios: e.ejerciciosCandidatos ?? [],
        territorios: e.territoriosCandidatos ?? [],
      }))
    if (
      JSON.stringify(leerBusqueda(snapshot, raiz)) !== JSON.stringify(esperado)
    )
      throw new Error("Índice de búsqueda distinto de entidades")
    const cierre = new Set(snapshot.dependencias.map((d) => d.hash))
    for (const d of snapshot.dependencias)
      if (objeto(raiz, d.hash).length !== d.bytes)
        throw new Error("Tamaño de dependencia incorrecto")
    for (const h of snapshot.auxiliares)
      if (!cierre.has(h)) throw new Error("Dependencia sin tamaño")
    for (const e of snapshot.evidencias) {
      const recibo = recibos.get(e.recibo)
      const estado = recibo.estados.find(
        (s) =>
          claveEnlace(s.sujeto, s.payload.sha256) ===
          claveEnlace(e.sujeto, e.payload)
      )
      if (
        !estado ||
        estado.payload.sha256 !== e.payload ||
        estado.integridad !== e.integridad ||
        estado.exactitudNumerica !== e.exactitudNumerica ||
        estado.revisionBinding !== e.revisionBinding ||
        estado.autenticidad !== e.autenticidad.estado ||
        estado.aceptacionFiscalCompleta !== false
      )
        throw new Error("Recibo ajeno al sujeto")
      if (
        !entradas.some(
          (x) =>
            x.entidad.id === e.sujeto.id && x.revision === e.sujeto.revision
        )
      )
        throw new Error("Sujeto ausente")
      for (const d of recibo.entrada.dependencias)
        if (!cierre.has(d.sha256))
          throw new Error("Dependencia del recibo ausente")
      if (e.revisionBinding === "accepted-limited")
        verificarAceptacionLimitada(
          e.payload,
          e.sujeto.id,
          recibo.entrada.dependencias,
          (h) => objeto(raiz, h)
        )
      const payload = JSON.parse(objeto(raiz, e.payload).toString())
      const manifiesto = JSON.parse(objeto(raiz, e.manifiesto).toString())
      if (
        payload.document.sha256 !== e.manifiesto ||
        JSON.stringify(e.autenticidad) !==
          JSON.stringify(estadoAutenticidad(manifiesto))
      )
        throw new Error("Autenticidad distinta del manifiesto")
    }
    const esperadosPublicos = entradas.flatMap(({ entidad: e }) =>
      e.tipo === "Document"
        ? [e.original]
        : e.tipo === "Facsimile"
          ? [e.imagen]
          : []
    )
    if (
      new Set(snapshot.publicos.map((p) => p.hash)).size !==
        snapshot.publicos.length ||
      esperadosPublicos.some(
        (h) => !snapshot.publicos.some((p) => p.hash === h)
      )
    )
      throw new Error("Lista pública incompleta o duplicada")
    for (const p of snapshot.publicos) {
      const firma =
        p.mime === "application/pdf"
          ? Buffer.from("%PDF-")
          : Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
      if (!objeto(raiz, p.hash).subarray(0, firma.length).equals(firma))
        throw new Error("MIME público incorrecto")
      if (
        !cierre.has(p.hash) ||
        objeto(raiz, p.hash).length !== p.bytes ||
        !entradas.some(
          ({ entidad: e }) =>
            (e.tipo === "Document" &&
              e.original === p.hash &&
              e.mime === p.mime) ||
            (e.tipo === "Facsimile" &&
              e.imagen === p.hash &&
              p.mime === "image/png")
        )
      )
        throw new Error("Blob público ajeno al grafo")
    }
  }
  return {
    ...verificarGrafo(entradas, new Set(snapshot.auxiliares)),
    cantidad: entradas.length,
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const ids = JSON.parse(
    readFileSync(resolve(directorioContenido, "snapshots.json"), "utf8")
  )
  for (const id of ids)
    process.stdout.write(
      JSON.stringify({ snapshot: id, ...verificar(id) }) + "\n"
    )
}
