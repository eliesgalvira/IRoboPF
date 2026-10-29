import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  renameSync,
} from "node:fs"
import { resolve } from "node:path"
import { gzipSync } from "node:zlib"
import { Schema } from "effect"
import { Snapshot } from "../../lib/procedencia/modelo.ts"
import {
  leerSnapshot,
  leerPaquete,
  objeto,
  directorioContenido,
} from "../../lib/procedencia/almacen.ts"
import { hash } from "../../lib/procedencia/verificador.ts"
import { generarEvidencia, comprobarEntrada } from "./evidencia-contenido.mjs"
import { verificarContenido } from "./contenido-verificar.mjs"
import { extraerPuntos } from "./rastro-extraer.mjs"
import { FUENTES_EXPLICACION } from "./explicacion-version.mjs"

export function filaBusqueda({ revision, entidad }) {
  return {
    id: entidad.id,
    revision,
    titulo: entidad.titulo,
    ejercicios: entidad.ejerciciosCandidatos ?? [],
    territorios: entidad.territoriosCandidatos ?? [],
  }
}
// No recibe informes ni ejecutores: el recibo nace de la ejecución real.
export async function publicar(
  root,
  entrada,
  destino,
  origen = directorioContenido
) {
  const anterior = leerSnapshot(entrada.snapshot, origen)
  if (!anterior) throw new Error("Snapshot origen desconocido")
  verificarContenido(anterior, origen)
  const generado = await generarEvidencia(root, entrada)
  const objetos = new Map(generado.objetos)
  const guardar = (bytes) => {
    const h = hash(bytes)
    objetos.set(h, Buffer.from(bytes))
    return h
  }
  for (const h of anterior.auxiliares) objetos.set(h, objeto(origen, h))
  const reemplazos = new Map(
    generado.informe.entradas.map((e) => [e.entidad.id, e])
  )
  const entradas = []
  for (const p of anterior.paquetes) {
    objetos.set(p.hash, objeto(origen, p.hash))
    objetos.set(p.indice, objeto(origen, p.indice))
    for (const e of leerPaquete(anterior, p.prefijo, origen)) {
      const nuevo = reemplazos.get(e.entidad.id)
      if (nuevo && e.entidad.identidad !== "ocurrencia")
        throw new Error("Colisión editorial")
      entradas.push(nuevo ?? e)
      reemplazos.delete(e.entidad.id)
    }
  }
  for (const e of reemplazos.values()) {
    if (e.entidad.identidad === "ocurrencia")
      throw new Error("Sujeto ausente del snapshot")
    entradas.push(e)
  }
  entradas.sort((a, b) => a.entidad.id.localeCompare(b.entidad.id))
  const grupos = new Map()
  for (const e of entradas) {
    const prefijo = hash(e.entidad.id).slice(0, 2)
    const grupo = grupos.get(prefijo) ?? []
    grupo.push(e)
    grupos.set(prefijo, grupo)
  }
  const paquetes = [...grupos]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([prefijo, grupo]) => {
      const bytes = gzipSync(Buffer.from(JSON.stringify(grupo)), { level: 9 })
      return {
        prefijo,
        hash: guardar(bytes),
        indice: guardar(
          Buffer.from(
            JSON.stringify(
              grupo.map((e) => ({ id: e.entidad.id, revision: e.revision }))
            )
          )
        ),
        bytes: bytes.length,
        cantidad: grupo.length,
      }
    })
  const manifest = JSON.parse(objeto(origen, anterior.inventario).toString())
  const { puntos } = extraerPuntos(root, manifest.generationInputs)
  const porId = new Map(entradas.map((e) => [e.entidad.id, e]))
  const bindings = puntos.map((p) => {
    const e = porId.get(`paso.${p.siteId}`)
    if (!e) throw new Error("Punto de rastro ausente")
    return {
      siteId: p.siteId,
      sujeto: { id: e.entidad.id, revision: e.revision },
      unidad: p.unidad,
    }
  })
  const catalogo = hash(JSON.stringify(bindings))
  if (!anterior.auxiliares.includes(catalogo))
    throw new Error("Catálogo distinto del snapshot fijado")
  const evidencias = generado.informe.estados.map((e) => {
    const payload = JSON.parse(objetos.get(e.payload.sha256).toString())
    const manifiesto = JSON.parse(
      objetos.get(payload.document.sha256).toString()
    )
    if (e.revisionBinding !== "pending")
      throw new Error("Esta publicación no promueve revisiones")
    return {
      sujeto: e.sujeto,
      recibo: generado.revision,
      payload: e.payload.sha256,
      manifiesto: payload.document.sha256,
      integridad: e.integridad,
      exactitudNumerica: e.exactitudNumerica,
      autenticidad: {
        estado: manifiesto.authenticity.status,
        fecha: manifiesto.authenticity.checkedAt,
        limites: manifiesto.authenticity.scope,
      },
      interpretacion: "candidata",
      revisionBinding: "pending",
      aceptacionFiscalCompleta: false,
    }
  })
  const publicos = generado.informe.entradas.flatMap(({ entidad: e }) =>
    e.tipo === "Document"
      ? [
          {
            hash: e.original,
            bytes: objetos.get(e.original).length,
            mime: e.mime,
          },
        ]
      : e.tipo === "Facsimile"
        ? [
            {
              hash: e.imagen,
              bytes: objetos.get(e.imagen).length,
              mime: "image/png",
            },
          ]
        : []
  )
  const generador = guardar(
    readFileSync(resolve(root, "scripts/procedencia/contenido-generar.mjs"))
  )
  const fuentesSoftware = FUENTES_EXPLICACION.map((p) =>
    guardar(readFileSync(resolve(root, p)))
  )
  const busqueda = guardar(
    gzipSync(Buffer.from(JSON.stringify(entradas.map(filaBusqueda))), {
      level: 9,
    })
  )
  const snapshot = Schema.decodeUnknownSync(Snapshot)(
    {
      ...anterior,
      version: 2,
      generador,
      versiones: {
        ...anterior.versiones,
        explicacion: hash(JSON.stringify({ generador, fuentesSoftware })),
      },
      paquetes,
      cantidad: entradas.length,
      busqueda,
      catalogo,
      evidencias,
      publicos,
      auxiliares: [...objetos.keys()].sort(),
      dependencias: [...objetos]
        .map(([hash, b]) => ({ hash, bytes: b.length }))
        .sort((a, b) => a.hash.localeCompare(b.hash)),
    },
    { onExcessProperty: "error" }
  )
  mkdirSync(resolve(destino, "objetos"), { recursive: true })
  for (const [h, bytes] of objetos) {
    if (bytes.length > 10_000_000)
      throw new Error("CAS externo no resoluble: objeto excede 10 MB")
    const ruta = resolve(destino, "objetos", h)
    if (!existsSync(ruta)) writeFileSync(ruta, bytes, { flag: "wx" })
    const real = readFileSync(ruta)
    if (hash(real) !== h || real.length !== bytes.length)
      throw new Error("CAS corrupto")
  }
  verificarContenido(snapshot, destino)
  const bytes = Buffer.from(JSON.stringify(snapshot))
  const id = hash(bytes)
  const ruta = resolve(destino, "objetos", id)
  if (!existsSync(ruta)) writeFileSync(ruta, bytes, { flag: "wx" })
  if (hash(readFileSync(ruta)) !== id) throw new Error("Snapshot corrupto")
  comprobarEntrada(root, entrada)
  const registro = resolve(destino, "snapshots.json")
  const anteriores = existsSync(registro)
    ? JSON.parse(readFileSync(registro, "utf8"))
    : []
  const temporal = resolve(destino, `registro-${id}.tmp`)
  writeFileSync(
    temporal,
    JSON.stringify([...new Set([...anteriores, id])].sort()) + "\n"
  )
  renameSync(temporal, registro)
  return { snapshot: id, evidencias, objetos: objetos.size }
}
