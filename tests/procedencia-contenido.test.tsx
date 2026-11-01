import { describe, expect, it } from "@effect/vitest"


import { Schema } from "effect"
import { Entidad, Resultado, type Ambito } from "../lib/procedencia/modelo"
import { baseFicha } from "../scripts/procedencia/contenido-generar.mjs"



import {
  bytesEntidad,
  hash,
  verificarGrafo,
  seleccionar,
} from "../lib/procedencia/verificador"


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
const snapshotId = "a".repeat(64)

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
