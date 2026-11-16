import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import { medirCasos } from "../tools/procedencia/simuladores/medir-casos.mjs"

const folder = new URL("../docs/procedencia/simuladores/medicion-2025/", import.meta.url)
const load = name => JSON.parse(readFileSync(new URL(name, folder)))

describe("línea base pública Open 2025", () => {
  it("reproduce salarios, familias, ocho conjuntas y siete viviendas DT18 conservando los 80 objetivos", () => {
    const manifest = load("casos.json"), observations = load("observaciones.json")
    const result = medirCasos(observations, { manifiesto: manifest, base: fileURLToPath(folder) })
    expect(result.medicion).toMatchObject({ iguales: 63, comparables: 69, N: 80, duplicados: 0 })
    const measured = result.resultados.filter(r => r.resultadoMotorEUR !== undefined)
    expect(measured).toHaveLength(69)
    expect(measured.filter(r => r.vinculacion.estado === "entrada-ses-y-resultado-pdf-vinculados")).toHaveLength(54)
    expect(measured.filter(r => r.vinculacion.estado === "transporte-dt18-ses-pdf-vinculado")).toHaveLength(7)
    expect(measured.filter(r => r.vinculacion.estado === "transporte-conjunta-ses-pdf-vinculado")).toHaveLength(8)
    expect(result.discrepanciasPorPrioridad).toEqual([
      expect.objectContaining({ id: "open2025-murcia-01", discrepanciaEUR: "-0.01", evidenciaVinculada: true }),
      expect.objectContaining({ id: "open2025-illes-balears-02", discrepanciaEUR: "-0.01", evidenciaVinculada: true }),
      expect.objectContaining({ id: "open2025-andalucia-11", discrepanciaEUR: "0.01", evidenciaVinculada: true }),
      expect.objectContaining({ id: "open2025-canarias-02", discrepanciaEUR: "-0.01", evidenciaVinculada: true }),
      expect.objectContaining({ id: "open2025-aragon-01", discrepanciaEUR: "-0.01", evidenciaVinculada: true }),
      expect.objectContaining({ id: "open2025-aragon-02-v2", discrepanciaEUR: "-0.01", evidenciaVinculada: true }),
    ])
    // El céntimo sigue abierto; verde del instrumento no significa 80/80 fiscal.
    expect(result.resultados.filter(r => r.resultadoMotorEUR === undefined)).toHaveLength(11)
  }, 120_000)
})
