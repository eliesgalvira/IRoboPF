import { createHash } from "node:crypto"
import { Schema, DateTime } from "effect"
import { Entidad, Paquete, type Ambito } from "./modelo"

export function hash(bytes: string | Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex")
}
const decodificarEntidad = Schema.decodeUnknownSync(Entidad)
export function bytesEntidad(entidad: Entidad) {
  // El codec reconstruye las propiedades en orden de contrato antes de hashear.
  const limpia = decodificarEntidad(entidad, { onExcessProperty: "error" })
  verificarPublico(limpia)
  return JSON.stringify(limpia)
}
export function verificarPublico(entidad: Entidad) {
  for (const fuente of entidad.fuentes) {
    if (
      !/^(lib|docs|scripts)\/[a-zA-Z0-9_./-]+$|^Calculo_Salario_IRPF\.py$/.test(
        fuente.archivo
      ) ||
      fuente.archivo.split("/").includes("..")
    )
      throw new Error("Ruta pública inválida")
  }
  const texto = JSON.stringify(entidad)
  if (
    /localPath|set-cookie|authorization|\/home\/|\/tmp\/|cookie\s*:/i.test(
      texto
    )
  )
    throw new Error("Payload privado rechazado")
  if (entidad.tipo === "Document") {
    const url = new URL(entidad.url)
    if (
      url.protocol !== "https:" ||
      url.username.length > 0 ||
      url.password.length > 0 ||
      url.search.length > 0 ||
      url.hash.length > 0
    )
      throw new Error("URL pública inválida")
  }
  validarAmbito(entidad.ambito)
  if (entidad.tipo === "Citation") {
    const s = entidad.selector
    if (s.tipo === "pdf") {
      const [x0, y0, x1, y1] = s.caja
      if (
        ![...s.caja, s.ancho, s.alto].every(Number.isFinite) ||
        x0 < 0 ||
        y0 < 0 ||
        x1 <= x0 ||
        y1 <= y0 ||
        x1 > s.ancho ||
        y1 > s.alto
      )
        throw new Error("Geometría inválida")
    }
    if (s.tipo === "texto" && (s.inicioByte < 0 || s.finByte <= s.inicioByte))
      throw new Error("Offsets inválidos")
    if (s.tipo === "csv" && (s.fila < 1 || s.columna < 1))
      throw new Error("Celda inválida")
  }
}
function fecha(texto: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(texto) &&
    Number.isFinite(Date.parse(texto)) &&
    DateTime.formatIsoDateUtc(DateTime.makeUnsafe(texto)) === texto
  )
}
export function validarAmbito(ambito: Ambito) {
  if (
    ambito.estado === "conocido" &&
    (!fecha(ambito.desde) ||
      !fecha(ambito.hasta) ||
      ambito.desde >= ambito.hasta)
  )
    throw new Error("Intervalo inválido")
}
export function seleccionar(
  entidades: ReadonlyArray<Entidad>,
  contexto: {
    fecha: string
    territorio: string
    regimen: string
    baseTemporal: string
    predicadoVersion: string
  }
) {
  if (!fecha(contexto.fecha)) throw new Error("Fecha inválida")
  const elegibles = entidades.filter((e) => {
    const a = e.ambito
    return (
      a.estado === "conocido" &&
      a.desde <= contexto.fecha &&
      contexto.fecha < a.hasta &&
      a.territorio === contexto.territorio &&
      a.regimen === contexto.regimen &&
      a.baseTemporal === contexto.baseTemporal &&
      a.predicadoVersion === contexto.predicadoVersion
    )
  })
  if (elegibles.length > 1) throw new Error("Ámbito ambiguo")
  return elegibles[0] ?? null
}
const destinos = new Map<string, ReadonlyArray<Entidad["tipo"]>>([
  ["formula", ["Formula"]],
  ["entrada", ["Parameter"]],
  ["derivacion", ["Derivation"]],
  ["norma", ["Rule"]],
  ["evidencia", ["Citation"]],
  ["documento", ["Document"]],
  ["captura", ["Facsimile"]],
  ["dependencia", ["Step"]],
])
const origenes = new Map<string, ReadonlyArray<Entidad["tipo"]>>([
  ["formula", ["Parameter", "Step", "Derivation"]],
  ["entrada", ["Formula", "Step", "Derivation"]],
  ["derivacion", ["Parameter", "Step"]],
  ["norma", ["Parameter", "Formula", "Step", "Derivation", "Rule"]],
  [
    "evidencia",
    ["Parameter", "Formula", "Step", "Derivation", "Rule", "Facsimile"],
  ],
  ["documento", ["Citation"]],
  ["captura", ["Parameter", "Step", "Rule"]],
  ["dependencia", ["Step"]],
])
export function verificarGrafo(
  entradas: typeof Paquete.Type,
  auxiliares: ReadonlySet<string> = new Set()
) {
  const indice = new Map<string, Entidad>()
  const ids = new Set<string>()
  for (const { revision, entidad } of entradas) {
    if (ids.has(entidad.id))
      throw new Error("Entidad duplicada: ID duplicado en snapshot")
    ids.add(entidad.id)
    const clave = `${entidad.id}/${revision}`
    if (indice.has(clave)) throw new Error("Entidad duplicada")
    indice.set(clave, entidad)
  }
  // Recorrido iterativo: no desborda la pila con cadenas largas hostiles.
  const grados = new Map<string, number>()
  const inversas = new Map<string, string[]>()
  for (const [clave, entidad] of indice) {
    validarAmbito(entidad.ambito)
    grados.set(clave, entidad.aristas.length)
    for (const arista of entidad.aristas) {
      const destino = `${arista.destino.id}/${arista.destino.revision}`
      const objetivo = indice.get(destino)
      if (objetivo === undefined)
        throw new Error("Referencia fuera del snapshot")
      if (
        destinos.get(arista.relacion)?.includes(objetivo.tipo) !== true ||
        origenes.get(arista.relacion)?.includes(entidad.tipo) !== true
      )
        throw new Error("Tipo de arista inválido")
      const a = entidad.ambito
      const b = objetivo.ambito
      if (
        ["entrada", "formula", "derivacion", "dependencia", "norma"].includes(
          arista.relacion
        ) &&
        a.estado === "conocido" &&
        (b.estado !== "conocido" ||
          a.territorio !== b.territorio ||
          a.regimen !== b.regimen ||
          a.baseTemporal !== b.baseTemporal ||
          a.predicadoVersion !== b.predicadoVersion ||
          a.desde < b.desde ||
          a.hasta > b.hasta)
      )
        throw new Error("Ámbitos incompatibles")
      const lista = inversas.get(destino) ?? []
      lista.push(clave)
      inversas.set(destino, lista)
    }
    if (
      entidad.tipo === "Citation" &&
      entidad.aristas.filter((a) => a.relacion === "documento").length !== 1
    )
      throw new Error("Cita sin documento único")
    if (
      entidad.tipo === "Facsimile" &&
      entidad.aristas.filter((a) => a.relacion === "evidencia").length !== 1
    )
      throw new Error("Facsímil sin cita única")
    if (entidad.tipo === "Citation") {
      const ref = entidad.aristas.find((a) => a.relacion === "documento")
      const documento =
        ref === undefined
          ? undefined
          : indice.get(`${ref.destino.id}/${ref.destino.revision}`)
      const mimes = new Map([
        ["pdf", "application/pdf"],
        ["html", "text/html"],
        ["texto", "text/plain"],
        ["csv", "text/csv"],
      ])
      if (
        documento?.tipo !== "Document" ||
        documento.mime !== mimes.get(entidad.selector.tipo)
      )
        throw new Error("Selector incompatible con documento")
    }
    if (entidad.tipo === "Facsimile") {
      const ref = entidad.aristas.find((a) => a.relacion === "evidencia")
      const cita =
        ref === undefined
          ? undefined
          : indice.get(`${ref.destino.id}/${ref.destino.revision}`)
      if (
        cita?.tipo === "Citation" &&
        cita.selector.tipo === "pdf" &&
        cita.selector.receta !== entidad.receta
      )
        throw new Error("Receta de facsímil distinta de la cita")
    }
    const blobs =
      entidad.tipo === "Document"
        ? [entidad.original]
        : entidad.tipo === "Facsimile"
          ? [entidad.imagen, entidad.receta]
          : entidad.tipo === "Citation" && entidad.selector.tipo === "pdf"
            ? [entidad.selector.receta]
            : []
    if (blobs.some((b) => !auxiliares.has(b)))
      throw new Error("Blob auxiliar ausente")
  }
  const cola = [...grados].filter(([, n]) => n === 0).map(([k]) => k)
  for (let i = 0; i < cola.length; i++)
    for (const padre of inversas.get(cola[i]) ?? []) {
      const n = grados.get(padre)
      if (n === undefined) throw new Error("Grafo inconsistente")
      grados.set(padre, n - 1)
      if (n === 1) cola.push(padre)
    }
  if (cola.length !== indice.size) throw new Error("Ciclo documental")
  for (const { revision, entidad } of entradas)
    if (hash(bytesEntidad(entidad)) !== revision)
      throw new Error("Revisión distinta de payload")
  return { integridad: "comprobada", aceptacionFiscal: "pendiente" }
}
