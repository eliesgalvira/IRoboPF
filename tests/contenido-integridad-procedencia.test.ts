import { expect, it } from "vitest"
import { Schema } from "effect"
import { Entidad } from "../lib/procedencia/modelo"
import { baseFicha } from "../scripts/procedencia/contenido-generar.mjs"
import { verificarOcurrencia } from "../scripts/procedencia/contenido-verificar.mjs"
import {
  bytesEntidad,
  hash,
  verificarGrafo,
} from "../lib/procedencia/verificador"

const item = {
  id: "prueba",
  name: "Nombre",
  kind: "Parameter",
  expression: "1",
  value: "1",
  unit: "EUR",
  years: [2025],
  territories: ["madrid"],
  symbol: "P",
  path: ["p"],
  source: { file: "lib/prueba.ts", sha256: "a".repeat(64), line: 1 },
}
const entidad = {
  ...baseFicha(item.id, item.name, "ocurrencia"),
  tipo: "Parameter",
  expresion: "1",
  valorObservado: "1",
  unidadCandidata: "EUR",
  ejerciciosCandidatos: [2025],
  territoriosCandidatos: ["madrid"],
  claseInventario: "Parameter",
  fuentes: [
    {
      archivo: "lib/prueba.ts",
      sha256: item.source.sha256,
      localizador: JSON.stringify({
        symbol: item.symbol,
        path: item.path,
        ...item.source,
      }),
    },
  ],
}
it("CI-02 comprueba la identidad completa de la proyección técnica", () => {
  expect(() => verificarOcurrencia(entidad, item)).not.toThrow()
  for (const cambio of [
    { tipo: "Step" },
    { titulo: "Otro" },
    { claseInventario: "Rule" },
    { fuentes: [{ ...entidad.fuentes[0], archivo: "docs/inexistente.md" }] },
    { fuentes: [{ ...entidad.fuentes[0], localizador: "Artículo inventado" }] },
  ])
    expect(() => verificarOcurrencia({ ...entidad, ...cambio }, item)).toThrow()
})
it("CI-01 admite Document → Citation → Facsimile, con cierre completo", () => {
  const empaquetar = (dato: Entidad) => {
    const e = Schema.decodeUnknownSync(Entidad)(dato)
    return { entidad: e, revision: hash(bytesEntidad(e)) }
  }
  const original = hash("original"),
    imagen = hash("imagen"),
    receta = hash("receta")
  const doc = empaquetar(
    Schema.decodeUnknownSync(Entidad)({
      ...baseFicha("doc", "Documento", "concepto"),
      tipo: "Document",
      original,
      mime: "text/plain",
      url: "https://www.boe.es/documento.txt",
    })
  )
  const cita = empaquetar(
    Schema.decodeUnknownSync(Entidad)({
      ...baseFicha("cita", "Cita", "concepto"),
      tipo: "Citation",
      selector: {
        tipo: "texto",
        encoding: "UTF-8",
        inicioByte: 0,
        finByte: 1,
        texto: "1",
      },
      aristas: [
        {
          relacion: "documento",
          destino: { id: "doc", revision: doc.revision },
        },
      ],
    })
  )
  const fac = empaquetar(
    Schema.decodeUnknownSync(Entidad)({
      ...baseFicha("fac", "Captura", "concepto"),
      tipo: "Facsimile",
      imagen,
      receta,
      transcripcion: "1",
      aristas: [
        {
          relacion: "evidencia",
          destino: { id: "cita", revision: cita.revision },
        },
      ],
    })
  )
  expect(
    verificarGrafo([doc, cita, fac], new Set([original, imagen, receta]))
      .integridad
  ).toBe("comprobada")
  expect(() =>
    verificarGrafo([doc, fac], new Set([original, imagen, receta]))
  ).toThrow("fuera")
  expect(() =>
    verificarGrafo([doc, cita, fac], new Set([original, receta]))
  ).toThrow("auxiliar")
  expect(() =>
    verificarGrafo([doc, cita, fac], new Set([original, imagen]))
  ).toThrow("auxiliar")
  expect(() =>
    verificarGrafo(
      [doc, cita, empaquetar({ ...fac.entidad, aristas: [] })],
      new Set([original, imagen, receta])
    )
  ).toThrow("única")
})
