import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"
import { medirCasos } from "../tools/procedencia/simuladores/medir-casos.mjs"

const folder = new URL("../docs/procedencia/simuladores/medicion-2025/", import.meta.url)
const load = name => JSON.parse(readFileSync(new URL(name, folder)))

describe("línea base pública Open 2025", () => {
  it("reproduce salarios, familias, diez conjuntas, siete viviendas DT18 y dos alquileres conservando los 80 objetivos", () => {
    const manifest = load("casos.json"), observations = load("observaciones.json")
    const result = medirCasos(observations, { manifiesto: manifest, base: fileURLToPath(folder) })
    expect(result.medicion).toMatchObject({ iguales: 76, comparables: 76, N: 80, duplicados: 0 })
    const measured = result.resultados.filter(r => r.resultadoMotorEUR !== undefined)
    expect(measured).toHaveLength(76)
    expect(measured.filter(r => r.vinculacion.estado === "entrada-ses-y-resultado-pdf-vinculados")).toHaveLength(54)
    expect(measured.filter(r => r.vinculacion.estado === "transporte-dt18-ses-pdf-vinculado")).toHaveLength(7)
    expect(measured.filter(r => r.vinculacion.estado === "transporte-conjunta-ses-pdf-vinculado")).toHaveLength(10)
    expect(measured.filter(r => r.vinculacion.estado === "transporte-inquilino-ses-pdf-vinculado")).toHaveLength(1)
    expect(measured.filter(r => r.vinculacion.estado === "transporte-valencia-ses-pdf-vinculado")).toHaveLength(1)
    expect(measured.filter(r => r.vinculacion.estado === "proyeccion-inquilino-ses-pdf-vinculada")).toHaveLength(2)
    expect(measured.filter(r => r.vinculacion.estado === "proyeccion-rioja-ses-pdf-vinculada")).toHaveLength(1)
    expect(result.discrepanciasPorPrioridad).toEqual([])
    // Las cuatro entradas de arrendadores siguen pendientes; no equivalen a cero.
    expect(result.resultados.filter(r => r.resultadoMotorEUR === undefined)).toHaveLength(4)
  }, 120_000)
})
