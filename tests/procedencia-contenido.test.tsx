import { describe, expect, it } from "@effect/vitest"
import { renderToStaticMarkup } from "react-dom/server"
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  cpSync,
  tmpdir,
  resolve,
} from "../lib/procedencia/io.mjs"
import { Effect, Schema } from "effect"
import { Entidad, Resultado, type Ambito } from "../lib/procedencia/modelo"
import { baseFicha } from "../scripts/procedencia/contenido-generar.mjs"
import {
  verificar,
  verificarContenido,
} from "../scripts/procedencia/contenido-verificar.mjs"
import { GET as obtenerObjeto } from "../app/procedencia/[snapshot]/objetos/[hash]/route"
import { GET as obtenerFicha } from "../app/procedencia/[snapshot]/[id]/[revision]/route"
import {
  bytesEntidad,
  hash,
  verificarGrafo,
  seleccionar,
} from "../lib/procedencia/verificador"
import {
  resolver,
  leerSnapshot,
  buscar,
  directorioContenido,
} from "../lib/procedencia/almacen"
import { Ficha } from "../lib/procedencia/ficha"
import {
  adaptarLegado,
  enlaceRastro,
  verificarRastro,
} from "../lib/procedencia/rastro"
import { verificarRevision } from "../lib/procedencia/revision"

function ficha(id = "prueba.parametro"): Entidad {
  return Schema.decodeUnknownSync(Entidad)({
    ...baseFicha(id, "Parámetro sintético", "concepto"),
    tipo: "Parameter",
    expresion: "12 × mensual",
    valorObservado: "120",
    unidadCandidata: "EUR",
    ejerciciosCandidatos: [2020],
    territoriosCandidatos: ["madrid"],
    claseInventario: "Parameter",
  })
}
const empaquetar = (e: Entidad) => ({
  revision: hash(bytesEntidad(e)),
  entidad: e,
})
const conocido = (desde: string, hasta: string): Ambito => ({
  estado: "conocido",
  desde,
  hasta,
  territorio: "madrid",
  regimen: "comun",
  baseTemporal: "devengo",
  predicadoVersion: "selector.1",
})
const contexto = {
  fecha: "2020-07-01",
  territorio: "madrid",
  regimen: "comun",
  baseTemporal: "devengo",
  predicadoVersion: "selector.1",
}
const ids: string[] = JSON.parse(
  readFileSync(resolve(directorioContenido, "snapshots.json"), "utf8")
)
const snapshotId =
  "31be43e7347ee116fd6349e946914602a706dbdce56b955a5aa8290fa9f7325e"
if (!ids.includes(snapshotId))
  throw new Error("Snapshot histórico de prueba ausente")

const documentalId =
  "efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6"
const documental = leerSnapshot(documentalId)
if (documental?.version !== 2)
  throw new Error("Falta snapshot documental histórico")

describe("rutas reales y cobertura documental", () => {
  it.effect("GET de objetos sirve PDF/PNG y rechaza auxiliares privados", () =>
    Effect.gen(function* () {
      for (const p of documental.publicos) {
        const response = yield* Effect.promise(() =>
          obtenerObjeto(new Request("https://local.invalid"), {
            params: Promise.resolve({ snapshot: documentalId, hash: p.hash }),
          })
        )
        expect(response.status).toBe(200)
        expect(response.headers.get("Content-Type")).toBe(p.mime)
        expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
        const bytes = yield* Effect.promise(() => response.arrayBuffer())
        expect(hash(Buffer.from(bytes))).toBe(p.hash)
      }
      const privada = yield* Effect.promise(() =>
        obtenerObjeto(new Request("https://local.invalid"), {
          params: Promise.resolve({
            snapshot: documentalId,
            hash: documental.generador,
          }),
        })
      )
      expect(privada.status).toBe(404)
    })
  )
  it.effect("GET de ficha selecciona estados y enlaces del sujeto exacto", () =>
    Effect.gen(function* () {
      const e = documental.evidencias[0]
      if (e === undefined) throw new Error("Falta evidencia de Madrid")
      const response = yield* Effect.promise(() =>
        obtenerFicha(new Request("https://local.invalid"), {
          params: Promise.resolve({ snapshot: documentalId, ...e.sujeto }),
        })
      )
      const html = yield* Effect.promise(() => response.text())
      expect(response.status).toBe(200)
      expect(html).toContain("Original PDF")
      expect(html).toContain("Captura PNG")
      expect(html).toContain("Aceptación fiscal completa")
      const sinEvidencia = yield* Effect.promise(() =>
        obtenerFicha(new Request("https://local.invalid"), {
          params: Promise.resolve({
            snapshot: documentalId,
            id: "paso.anual.base.ahorro",
            revision:
              "2f22ea1b3027420052191b8972db8bd7248f600134137e7f0a2177ac15d6a61f",
          }),
        })
      )
      expect(sinEvidencia.status).toBe(200)
      const htmlSinEvidencia = yield* Effect.promise(() => sinEvidencia.text())
      expect(htmlSinEvidencia).not.toContain("Original PDF")
    })
  )
  it("rechaza omitir o duplicar estados aunque el snapshot tenga otro hash", () => {
    expect(() =>
      verificarContenido({ ...documental, evidencias: [] }, directorioContenido)
    ).toThrow("Cobertura de evidencia")
    expect(() =>
      verificarContenido(
        {
          ...documental,
          evidencias: [...documental.evidencias, ...documental.evidencias],
        },
        directorioContenido
      )
    ).toThrow("Cobertura de evidencia")
  }, 60_000)
})

describe("contenido versionado", () => {
  it("rechaza dos revisiones del mismo ID dentro del snapshot", () => {
    const original = ficha()
    expect(() =>
      verificarGrafo([
        empaquetar(original),
        empaquetar({ ...original, titulo: "Otra revisión" }),
      ])
    ).toThrow("ID duplicado")
  })
  it("exige la misma receta en cita PDF y facsímil, aunque se rehashee", () => {
    const document = empaquetar(
      Schema.decodeUnknownSync(Entidad)({
        ...baseFicha("documento", "Documento sintético", "concepto"),
        tipo: "Document",
        original: "a".repeat(64),
        mime: "application/pdf",
        url: "https://www.boe.es/ejemplo.pdf",
      })
    )
    const citation = empaquetar(
      Schema.decodeUnknownSync(Entidad)({
        ...baseFicha("cita", "Cita sintética", "concepto"),
        tipo: "Citation",
        aristas: [
          {
            relacion: "documento",
            destino: { id: document.entidad.id, revision: document.revision },
          },
        ],
        selector: {
          tipo: "pdf",
          pagina: 1,
          ancho: 100,
          alto: 100,
          caja: [1, 1, 20, 20],
          coordenadas: "pymupdf-cropbox-sin-rotar",
          extraccion: "text-layer",
          receta: "b".repeat(64),
          texto: "123 euros",
        },
      })
    )
    const facsimile = Schema.decodeUnknownSync(Entidad)({
      ...baseFicha("captura", "Captura sintética", "concepto"),
      tipo: "Facsimile",
      imagen: "c".repeat(64),
      receta: "b".repeat(64),
      transcripcion: "123 euros",
      aristas: [
        {
          relacion: "evidencia",
          destino: { id: citation.entidad.id, revision: citation.revision },
        },
      ],
    })
    const auxiliars = new Set(["a", "b", "c", "d"].map((s) => s.repeat(64)))
    expect(
      verificarGrafo([document, citation, empaquetar(facsimile)], auxiliars)
        .integridad
    ).toBe("comprobada")
    expect(() =>
      verificarGrafo(
        [
          document,
          citation,
          empaquetar(
            Schema.decodeUnknownSync(Entidad)({
              ...facsimile,
              receta: "d".repeat(64),
            })
          ),
        ],
        auxiliars
      )
    ).toThrow("Receta")
  })
  it("serializa de forma determinista y rechaza mutaciones de bytes", () => {
    const e = ficha()
    const p = empaquetar(e)
    expect(bytesEntidad(e)).toBe(bytesEntidad(JSON.parse(bytesEntidad(e))))
    expect(verificarGrafo([p]).aceptacionFiscal).toBe("pendiente")
    expect(() =>
      verificarGrafo([{ ...p, entidad: { ...e, titulo: "Alterado" } }])
    ).toThrow("payload")
  })
  it("rechaza campos privados antes de hashear y rutas de traversal", () => {
    expect(() =>
      bytesEntidad(
        JSON.parse(JSON.stringify({ ...ficha(), localPath: "privado" }))
      )
    ).toThrow()
    for (const archivo of [
      "/home/privado",
      "docs/../secreto",
      "https://example.org",
    ])
      expect(() =>
        bytesEntidad({
          ...ficha(),
          fuentes: [
            { archivo, sha256: "a".repeat(64), localizador: "línea 1" },
          ],
        })
      ).toThrow()
  })
  it("rechaza referencias ausentes y tipos de arista erróneos", () => {
    const destino = empaquetar(ficha("prueba.destino"))
    const e = {
      ...ficha(),
      aristas: [
        {
          relacion: "formula",
          destino: { id: destino.entidad.id, revision: destino.revision },
        },
      ],
    }
    const p = Schema.decodeUnknownSync(Entidad)(e)
    expect(() => verificarGrafo([empaquetar(p)])).toThrow("fuera")
    expect(() => verificarGrafo([empaquetar(p), destino])).toThrow("Tipo")
  })
  it("detecta ciclo antes del cotejo de hashes", () => {
    const a = Schema.decodeUnknownSync(Entidad)({
      ...ficha("paso.a"),
      tipo: "Step",
      aristas: [
        {
          relacion: "dependencia",
          destino: { id: "paso.b", revision: "b".repeat(64) },
        },
      ],
    })
    const b = Schema.decodeUnknownSync(Entidad)({
      ...ficha("paso.b"),
      tipo: "Step",
      aristas: [
        {
          relacion: "dependencia",
          destino: { id: "paso.a", revision: "a".repeat(64) },
        },
      ],
    })
    expect(() =>
      verificarGrafo([
        { revision: "a".repeat(64), entidad: a },
        { revision: "b".repeat(64), entidad: b },
      ])
    ).toThrow("Ciclo")
  })
  it("resuelve fronteras semiabiertas sin fallback territorial ni temporal", () => {
    const a = {
      ...ficha("antes"),
      ambito: conocido("2020-01-01", "2020-07-01"),
    }
    const b = {
      ...ficha("despues"),
      ambito: conocido("2020-07-01", "2021-01-01"),
    }
    expect(seleccionar([a, b], contexto)?.id).toBe("despues")
    expect(seleccionar([a, b], { ...contexto, fecha: "2020-06-30" })?.id).toBe(
      "antes"
    )
    expect(seleccionar([a], contexto)).toBeNull()
    expect(seleccionar([ficha()], contexto)).toBeNull()
    expect(
      seleccionar([a, b], { ...contexto, territorio: "navarra" })
    ).toBeNull()
    expect(() => seleccionar([b, b], contexto)).toThrow("ambiguo")
    expect(() =>
      bytesEntidad({ ...a, ambito: conocido("2020-02-30", "2021-01-01") })
    ).toThrow()
  })
  it("no soportado no admite número y decimal exige cadena", () => {
    const decodificar = Schema.decodeUnknownSync(Resultado)
    expect(
      decodificar({ estado: "no-soportada", motivo: "Fuera de cobertura" })
    ).toEqual({ estado: "no-soportada", motivo: "Fuera de cobertura" })
    expect(() =>
      decodificar(
        { estado: "no-soportada", motivo: "Pendiente", decimal: "0" },
        { onExcessProperty: "error" }
      )
    ).toThrow()
    expect(() =>
      decodificar({ estado: "aplicada", decimal: 0, unidad: "EUR" })
    ).toThrow()
  })
  it("rastro explícito, versión fija, instancia única y legado pendiente", () => {
    const p = empaquetar(ficha())
    const versiones = {
      snapshot: snapshotId,
      algoritmo: "a".repeat(64),
      datos: "b".repeat(64),
      explicacion: "v1",
    }
    const punto = {
      siteId: "calculo.minimo",
      instanceId: "tramo.primero",
      sujeto: { id: p.entidad.id, revision: p.revision },
    }
    const linea = Schema.decodeUnknownSync(
      Schema.Struct({
        punto: Schema.Struct({
          siteId: Schema.String,
          instanceId: Schema.String,
          sujeto: Schema.Struct({ id: Schema.String, revision: Schema.String }),
        }),
        resultado: Resultado,
      })
    )({ punto, resultado: { estado: "no-soportada", motivo: "Pendiente" } })
    expect(enlaceRastro(versiones, punto)).not.toContain("resultado")
    expect(adaptarLegado().estado).toBe("pendiente")
    expect(() =>
      verificarRastro(
        versiones,
        versiones,
        [linea, linea],
        new Map([[punto.siteId, punto.sujeto]])
      )
    ).toThrow("repetida")
    expect(() =>
      verificarRastro(
        versiones,
        { ...versiones, explicacion: "v2" },
        [],
        new Map()
      )
    ).toThrow("Versiones")
  })
  it("dos nombres no autorizan revisión; cambio de payload invalida informe", () => {
    const e = { ...ficha(), ambito: conocido("2020-01-01", "2021-01-01") }
    const r = Schema.decodeUnknownSync(
      Schema.Struct({
        sujeto: Schema.Struct({ id: Schema.String, revision: Schema.String }),
      })
    )({ sujeto: { id: e.id, revision: hash(bytesEntidad(e)) } })
    const revision = {
      ...r,
      informe: "c".repeat(64),
      proposicion: "importe",
      fuentes: [],
      ambito: e.ambito,
      independencia: "pendiente-de-acreditar" as const,
    }
    expect(() => verificarRevision(revision, e, new Map())).toThrow(
      "independiente"
    )
    expect(() =>
      verificarRevision(revision, { ...e, titulo: "Otro" }, new Map())
    ).toThrow("Payload")
  })
  it("resuelve fichas reales y renderiza servidor sin JavaScript ni build", () => {
    const snapshot = leerSnapshot(snapshotId)
    expect(snapshot?.cantidad).toBe(47793)
    const entradas = buscar(snapshotId, "irpf.madrid.limite-escala")
    expect(entradas?.length).toBe(1)
    const entrada = entradas?.[0]
    if (entrada === undefined) throw new Error("Fixture ausente")
    const entidad = resolver(snapshotId, entrada.id, entrada.revision)
    if (entidad === null) throw new Error("Ficha ausente")
    const html = renderToStaticMarkup(
      <Ficha entidad={entidad} snapshot={snapshotId} />
    )
    expect(html).toContain("norma")
    expect(html).toContain("pendiente")
    expect(html).not.toMatch(/localPath|\/home\/|<script/)
    expect(resolver(snapshotId, "../secreto", entrada.revision)).toBeNull()
    expect(resolver("f".repeat(64), entrada.id, entrada.revision)).toBeNull()
  })
  it("distingue objeto prometido ausente de id desconocido", () => {
    const raiz = mkdtempSync(resolve(tmpdir(), "irobopf-contenido-"))
    mkdirSync(resolve(raiz, "objetos"))
    cpSync(
      resolve(directorioContenido, "snapshots.json"),
      resolve(raiz, "snapshots.json")
    )
    cpSync(
      resolve(directorioContenido, "objetos", snapshotId),
      resolve(raiz, "objetos", snapshotId)
    )
    const s = leerSnapshot(snapshotId)
    if (s === null) throw new Error("Fixture ausente")
    const p = s.paquetes[0]
    const raw = readFileSync(resolve(directorioContenido, "objetos", p.indice))
    writeFileSync(resolve(raiz, "objetos", p.indice), raw)
    const indice: Array<{ id: string; revision: string }> = JSON.parse(
      raw.toString("utf8")
    )
    const e = indice[0]
    expect(() => resolver(snapshotId, e.id, e.revision, raiz)).toThrow(
      "prometido"
    )
    expect(resolver(snapshotId, e.id, "f".repeat(64), raiz)).toBeNull()
  })
})

it("verifica un DAG real con ámbitos y rechaza dependencia de otro territorio", () => {
  const parametro = empaquetar({
    ...ficha("entrada"),
    ambito: conocido("2020-01-01", "2021-01-01"),
  })
  const formula = Schema.decodeUnknownSync(Entidad)({
    ...ficha("formula"),
    tipo: "Formula",
    ambito: conocido("2020-01-01", "2021-01-01"),
    aristas: [
      {
        relacion: "entrada",
        destino: { id: parametro.entidad.id, revision: parametro.revision },
      },
    ],
  })
  expect(verificarGrafo([parametro, empaquetar(formula)]).integridad).toBe(
    "comprobada"
  )
  expect(() =>
    verificarGrafo([
      parametro,
      empaquetar({
        ...formula,
        ambito: {
          ...contexto,
          estado: "conocido",
          desde: "2020-01-01",
          hasta: "2021-01-01",
          territorio: "navarra",
        },
      }),
    ])
  ).toThrow()
})

it("diferencia PDF, HTML, texto y CSV y no inventa geometría", () => {
  const documento = Schema.decodeUnknownSync(Entidad)({
    ...baseFicha("documento", "Documento sintético", "concepto"),
    tipo: "Document",
    original: "a".repeat(64),
    mime: "text/csv",
    url: "https://www.ine.es/datos.csv",
  })
  const d = empaquetar(documento)
  const cita = Schema.decodeUnknownSync(Entidad)({
    ...baseFicha("cita", "Celda sintética", "concepto"),
    tipo: "Citation",
    selector: {
      tipo: "csv",
      encoding: "UTF-8",
      separador: ";",
      comilla: '"',
      salto: "LF",
      cabecera: true,
      fila: 2,
      columna: 1,
      texto: "120",
    },
    aristas: [
      {
        relacion: "documento",
        destino: { id: d.entidad.id, revision: d.revision },
      },
    ],
  })
  expect(
    verificarGrafo([d, empaquetar(cita)], new Set(["a".repeat(64)])).integridad
  ).toBe("comprobada")
  expect(() => verificarGrafo([d, empaquetar(cita)])).toThrow("auxiliar")
  const mala = Schema.decodeUnknownSync(Entidad)({
    ...cita,
    selector: {
      tipo: "pdf",
      pagina: 1,
      ancho: 100,
      alto: 100,
      caja: [0, 0, 110, 10],
      coordenadas: "pymupdf-cropbox-sin-rotar",
      extraccion: "text-layer",
      receta: "b".repeat(64),
      texto: "120",
    },
  })
  expect(() => bytesEntidad(mala)).toThrow("Geometría")
})

it("acepta solo el informe externo existente de ese payload y alcance, sin aceptar fiscalidad", () => {
  const fuente = hash("informe público de prueba")
  const e = {
    ...ficha(),
    fuentes: [
      {
        archivo: "docs/prueba.md",
        sha256: fuente,
        localizador: "proposición uno",
      },
    ],
    ambito: conocido("2020-01-01", "2021-01-01"),
  }
  const bytes = Buffer.from(
    "Contrarrevisión sintética del importe, sin vigencia jurídica."
  )
  const informe = hash(bytes)
  const revision = {
    sujeto: { id: e.id, revision: hash(bytesEntidad(e)) },
    informe,
    proposicion: "importe",
    fuentes: [fuente],
    ambito: e.ambito,
    independencia: "pendiente-de-acreditar" as const,
  }
  const alcanceHash = hash(
    JSON.stringify({
      proposicion: revision.proposicion,
      fuentes: revision.fuentes,
      ambito: revision.ambito,
    })
  )
  const registro = {
    hash: informe,
    bytes,
    sujetoRevision: revision.sujeto.revision,
    alcanceHash,
    independenciaAcreditada: true,
  }
  expect(
    verificarRevision(revision, e, new Map([[informe, registro]]))
      .aceptacionFiscal
  ).toBe("pendiente")
  expect(() =>
    verificarRevision(
      revision,
      e,
      new Map([[informe, { ...registro, bytes: Buffer.from("Otro informe") }]])
    )
  ).toThrow()
})

it("la ruta Next entrega HTML completo o 404 sin emitir datos del caso", () =>
  import("../app/procedencia/[snapshot]/[id]/[revision]/route").then(
    ({ GET }) => {
      const entradas = buscar(snapshotId, "irpf.madrid.limite-escala")
      const e = entradas?.[0]
      if (e === undefined) throw new Error("Fixture ausente")
      return GET(new Request("https://example.test/"), {
        params: Promise.resolve({
          snapshot: snapshotId,
          id: e.id,
          revision: e.revision,
        }),
      })
        .then((respuesta) => {
          expect(respuesta.status).toBe(200)
          expect(respuesta.headers.get("Referrer-Policy")).toBe("no-referrer")
          return respuesta.text()
        })
        .then((html) => {
          expect(html).toMatch(/^<!doctype html>/i)
          expect(html).not.toContain("<script")
          return GET(new Request("https://example.test/"), {
            params: Promise.resolve({
              snapshot: snapshotId,
              id: "desconocido",
              revision: "a".repeat(64),
            }),
          })
        })
        .then((respuesta) => expect(respuesta.status).toBe(404))
    }
  ))

it("verifica un snapshot histórico contra su inventario conservado", () => {
  const snapshot = leerSnapshot(snapshotId)
  expect(snapshot?.inventario).not.toBe(
    hash(
      readFileSync(resolve(process.cwd(), "docs/procedencia/inventario.json"))
    )
  )
  expect(verificar(snapshotId).cantidad).toBe(47793)
})
