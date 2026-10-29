import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Ficha } from "../lib/procedencia/ficha"
import { beforeAll, describe, expect, it } from "vitest"
import { Schema } from "effect"
import {
  renameSync,
  resolve,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "../lib/procedencia/io.mjs"
import { prepararEntrada } from "../scripts/procedencia/evidencia-contenido.mjs"
import { publicar } from "../scripts/procedencia/contenido-publicar.mjs"
import {
  verificar,
  verificarContenido,
} from "../scripts/procedencia/contenido-verificar.mjs"
import {
  enlacesDocumentales,
  resolver,
  buscar,
  leerSnapshot,
  blobPublico,
  directorioContenido,
  objeto,
} from "../lib/procedencia/almacen"
import { responderObjeto } from "../lib/procedencia/http"
import { Snapshot } from "../lib/procedencia/modelo"
import { hash } from "../lib/procedencia/verificador"

const root = process.cwd()
const scratch = mkdtempSync(resolve(root, ".cache/publicacion-evidencia-"))
const actual = JSON.parse(
  readFileSync(resolve(root, "lib/procedencia/rastro-generado.json"), "utf8")
).actual.versiones
// La publicación parte del v1 técnico del inventario actual, incluso después
// de que el alias actual seleccione su derivado documental v2.
const registrados = Schema.decodeUnknownSync(
  Schema.fromJsonString(Schema.Array(Schema.String))
)(readFileSync(resolve(directorioContenido, "snapshots.json"), "utf8"))
const origen = registrados.find((id) => {
  const snapshot = leerSnapshot(id, directorioContenido)
  return (
    snapshot?.version === 1 &&
    snapshot.versiones.algoritmo === actual.algoritmo &&
    snapshot.versiones.datos === actual.datos &&
    snapshot.versiones.explicacion === actual.explicacion
  )
})
if (origen === undefined) throw new Error("Falta snapshot técnico v1 actual")
let id = ""
beforeAll(() => {
  const entrada = prepararEntrada(root, origen)
  return publicar(root, entrada, scratch).then((resultado) => {
    id = resultado.snapshot
    writeFileSync(resolve(scratch, "resultado.json"), JSON.stringify(resultado))
    return publicar(root, entrada, scratch).then((repetido) => {
      expect(repetido.snapshot).toBe(id)
    })
  })
}, 300_000)

describe("Publicación de evidencia v2", { timeout: 30_000 }, () => {
  it("conserva v1 y verifica cierre físico, sujeto e índice v2", () => {
    expect(leerSnapshot(origen, directorioContenido)?.version).toBe(1)
    expect(verificar(id, scratch).aceptacionFiscal).toBe("pendiente")
    const s = leerSnapshot(id, scratch)
    if (s?.version !== 2) throw new Error("Falta v2")
    expect(s.evidencias).toHaveLength(1)
    expect(s.evidencias[0]?.aceptacionFiscalCompleta).toBe(false)
    expect(s.dependencias.length).toBeGreaterThan(100)
    expect(Schema.decodeUnknownSync(Snapshot)(s)).toEqual(s)
    expect(() =>
      Schema.decodeUnknownSync(Snapshot)(
        { ...s, extra: true },
        { onExcessProperty: "error" }
      )
    ).toThrow()
  })
  it("sirve solo PDF/PNG declarados y rechaza auxiliares y rutas desconocidas", () => {
    const s = leerSnapshot(id, scratch)
    if (s?.version !== 2) throw new Error("Falta v2")
    for (const p of s.publicos) {
      const blob = blobPublico(id, p.hash, scratch)
      const respuesta = responderObjeto(id, p.hash, scratch)
      expect(respuesta.status).toBe(200)
      expect(respuesta.headers.get("X-Content-Type-Options")).toBe("nosniff")
      expect(respuesta.headers.get("Cache-Control")).toContain("immutable")
      expect(blob?.mime).toBe(p.mime)
      expect(blob?.bytes.length).toBe(p.bytes)
    }
    expect(blobPublico(id, s.generador, scratch)).toBeNull()
    expect(responderObjeto(id, s.generador, scratch).status).toBe(404)
    expect(blobPublico(id, "../privado", scratch)).toBeNull()
    expect(
      blobPublico("a".repeat(64), s.publicos[0]?.hash ?? "", scratch)
    ).toBeNull()
  })
  it("mide consultas y detecta mutaciones persistentes sin confiar en mtime", () => {
    const inicio = performance.now()
    const frio = buscar(id, "Madrid", "", "", scratch)
    const medio = performance.now()
    expect(buscar(id, "Madrid", "", "", scratch)).toEqual(frio)
    writeFileSync(
      resolve(scratch, "metricas.json"),
      JSON.stringify({
        scratch,
        consultaFriaMs: medio - inicio,
        consultaCalienteMs: performance.now() - medio,
        rss: process.memoryUsage().rss,
      })
    )
    const s = leerSnapshot(id, scratch)
    if (s?.version !== 2) throw new Error("Falta v2")
    const ruta = resolve(scratch, "objetos", s.busqueda)
    const bytes = readFileSync(ruta)
    writeFileSync(ruta, Buffer.from("corrupto"))
    expect(() => buscar(id, "Madrid", "", "", scratch)).toThrow("corrupto")
    writeFileSync(ruta, bytes)
  })
  it("renderiza SSR los estados exactos y enlaces a documentos", () => {
    const s = leerSnapshot(id, scratch)
    if (s?.version !== 2 || s.evidencias[0] === undefined)
      throw new Error("Falta evidencia")
    const e = s.evidencias[0]
    const entidad = resolver(id, e.sujeto.id, e.sujeto.revision, scratch)
    if (entidad === null) throw new Error("Falta sujeto")
    const html = renderToStaticMarkup(
      createElement(Ficha, {
        entidad,
        snapshot: id,
        evidencia: e,
        enlaces: enlacesDocumentales(id, entidad, scratch),
      })
    )
    expect(html).toContain("Original PDF")
    expect(html).toContain("Captura PNG")
    expect(html).toContain("Cita literal")
    expect(html).toContain("trust-indeterminate")
    expect(html).toContain("Aceptación fiscal completa")
    expect(html).toContain("false")
    expect(html).toContain(`/procedencia/${id}/evidencia.`)
  })
  it("rechaza dependencia ausente y blob público corrupto", () => {
    const s = leerSnapshot(id, scratch)
    if (
      s?.version !== 2 ||
      s.publicos[0] === undefined ||
      s.evidencias[0] === undefined
    )
      throw new Error("Falta evidencia")
    const ruta = resolve(scratch, "objetos", s.evidencias[0].manifiesto)
    renameSync(ruta, ruta + ".retenido")
    try {
      expect(() => verificar(id, scratch)).toThrow()
    } finally {
      renameSync(ruta + ".retenido", ruta)
    }
    const p = s.publicos[0]
    const rutaBlob = resolve(scratch, "objetos", p.hash)
    const bytes = readFileSync(rutaBlob)
    writeFileSync(rutaBlob, Buffer.from("corrupto"))
    try {
      expect(responderObjeto(id, p.hash, scratch).status).toBe(503)
    } finally {
      writeFileSync(rutaBlob, bytes)
    }
  })
  it("rechaza recibo ajeno y auxiliar corrupto", () => {
    const s = leerSnapshot(id, scratch)
    if (s?.version !== 2 || s.evidencias[0] === undefined)
      throw new Error("Falta evidencia")
    const e = s.evidencias[0]
    expect(() =>
      verificarContenido(
        {
          ...s,
          evidencias: [
            { ...e, sujeto: { ...e.sujeto, revision: "a".repeat(64) } },
          ],
        },
        scratch
      )
    ).toThrow("Recibo ajeno")
    const ruta = resolve(scratch, "objetos", e.manifiesto)
    const bytes = objeto(scratch, e.manifiesto)
    writeFileSync(ruta, Buffer.concat([bytes, Buffer.from(" ")]))
    expect(() => verificar(id, scratch)).toThrow()
    writeFileSync(ruta, bytes)
    expect(hash(bytes)).toBe(e.manifiesto)
  })
})
