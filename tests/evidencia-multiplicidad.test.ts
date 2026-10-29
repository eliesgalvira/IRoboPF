import { describe, expect, it } from "vitest"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Schema } from "effect"
import { Entidad, type EstadoEvidencia } from "../lib/procedencia/modelo"
import { Ficha } from "../lib/procedencia/ficha"
import { bytesEntidad } from "../lib/procedencia/verificador"
import { baseFicha } from "../scripts/procedencia/contenido-generar.mjs"

const entidad = Schema.decodeUnknownSync(Entidad)({
  ...baseFicha("inv-prueba", "Celda compartida", "ocurrencia"),
  tipo: "Parameter",
  expresion: "1",
  valorObservado: "1",
  unidadCandidata: "EUR",
  ejerciciosCandidatos: [2012, 2013],
  territoriosCandidatos: [],
  claseInventario: "Parameter",
})
const pendiente: typeof EstadoEvidencia.Type = {
  sujeto: { id: entidad.id, revision: "c".repeat(64) },
  recibo: "d".repeat(64),
  payload: "a".repeat(64),
  manifiesto: "e".repeat(64),
  integridad: "verified",
  exactitudNumerica: "verified",
  autenticidad: {
    estado: "trust-indeterminate",
    fecha: "2026-10-29",
    limites: "Sin autenticación histórica",
  },
  interpretacion: "candidata",
  revisionBinding: "pending",
  aceptacionFiscalCompleta: false,
}

describe("Estados documentales por enlace exacto", () => {
  it("muestra ambos enlaces sin extender la aceptación de uno al otro", () => {
    const html = renderToStaticMarkup(
      createElement(Ficha, {
        entidad,
        snapshot: "f".repeat(64),
        evidencias: [
          pendiente,
          {
            ...pendiente,
            payload: "b".repeat(64),
            revisionBinding: "accepted-limited",
            autenticidad: { ...pendiente.autenticidad, estado: "unsigned" },
          },
        ],
      })
    )
    expect(html).toContain("a".repeat(64))
    expect(html).toContain("b".repeat(64))
    expect(html).toContain("pending")
    expect(html).toContain("accepted-limited")
    expect(html).toContain("trust-indeterminate")
    expect(html).toContain("unsigned")
    expect(html.match(/Aceptación fiscal completa/g)).toHaveLength(2)
    expect(html.match(/<dd>false<\/dd>/g)).toHaveLength(2)
  })
  it("sin enlaces conserva estados pendientes", () => {
    const html = renderToStaticMarkup(
      createElement(Ficha, { entidad, snapshot: "f".repeat(64) })
    )
    expect(html).toContain(
      "Interpretación, autenticidad y contrarrevisión: pendientes."
    )
    expect(html).not.toContain("accepted-limited")
  })
})

const borm =
  "https://www.borm.es/services/anuncio/ano/2022/numero/4846/pdf?id=811060"
function documento(url: string) {
  return Schema.decodeUnknownSync(Entidad)({
    ...baseFicha("documento.prueba", "Documento", "concepto"),
    tipo: "Document",
    original: "a".repeat(64),
    mime: "application/pdf",
    url,
  })
}
describe("Identificador público del anuncio BORM", () => {
  it("conserva la URL exacta del original usado por los bindings", () => {
    expect(bytesEntidad(documento(borm))).toContain(borm)
  })
  it.each([
    borm + "&token=privado",
    borm + "&id=2",
    borm + "#oculto",
    borm + "\n",
    borm.replace("www.borm.es", "www.borm.es.invalid"),
    borm.replace("www.borm.es", "usuario:clave@www.borm.es"),
    borm.replace("id=", "%69d="),
    borm.replace("811060", "dato-privado"),
    borm.replace("811060", "0"),
    borm.replace("811060", "1234567890123"),
    borm.replace("https:", "http:"),
    borm.replace("/pdf?", "/otro?"),
  ])("rechaza cambios fuera del contrato %s", (url) => {
    expect(() => bytesEntidad(documento(url))).toThrow("URL pública inválida")
  })
})
