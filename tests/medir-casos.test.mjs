import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { medirCasos } from "../tools/procedencia/simuladores/medir-casos.mjs"

const fixtureURL = new URL("./fixtures/c300-variantes.json", import.meta.url)
const bytes = readFileSync(fixtureURL)
const fixtures = JSON.parse(bytes)
const referencia = { archivo: fileURLToPath(fixtureURL),
  sha256: createHash("sha256").update(bytes).digest("hex") }
const caso = (extra = {}) => ({
  id: fixtures[0].id,
  entradaAPI: structuredClone(fixtures[0].entrada),
  resultadoOpenEUR: fixtures[0].fields.RESULTADO,
  integridadReferencias: { referencias: [referencia] },
  ...extra,
})
const medir = (...casos) => medirCasos({ casos })

describe("medidor C2025 por API real", () => {
  it("compara conjunta sin convertir sus referencias en vínculo Open", () => {
    const archivo = new URL("../docs/procedencia/implementaciones/conjunta-ordinaria-2025/entradas-candidatas.json", import.meta.url)
    const contenido = readFileSync(archivo), entrada = JSON.parse(contenido).casos[0].entradaCandidata
    const r = medir(caso({ id: "conjunta-exploratoria", entradaAPI: entrada, resultadoOpenEUR: "-1368.73",
      integridadReferencias: { referencias: [{ archivo: fileURLToPath(archivo), sha256: createHash("sha256").update(contenido).digest("hex") }] } }))
    expect(r.medicion).toMatchObject({ N: 1, comparables: 1, igualesExploratorias: 0, iguales: 0 })
    // El instrumento conserva el céntimo observado; no adapta Open al motor.
    expect(r.resultados[0]).toMatchObject({ estado: "discrepante", resultadoOpenEUR: "-1368.73", discrepanciaEUR: "-0.01" })
  })

  it("proyecta Decimal mixto sin redondear la magnitud y exige vínculo independiente", () => {
    const archivo = new URL("./fixtures/trabajo-alquiler-ordinario-2025.json", import.meta.url)
    const contenido = readFileSync(archivo), entrada = JSON.parse(contenido)[0].entrada
    const r = medir(caso({ id: "mixto-exploratorio", entradaAPI: entrada, resultadoOpenEUR: "1879.90",
      componentesOpenEUR: { cuotaDiferencial: "1879.902" },
      integridadReferencias: { referencias: [{ archivo: fileURLToPath(archivo), sha256: createHash("sha256").update(contenido).digest("hex") }] } }))
    expect(r.medicion).toMatchObject({ N: 1, comparables: 1, igualesExploratorias: 1, iguales: 0 })
    expect(r.resultados[0].componentes.cuotaDiferencial).toMatchObject({ estado: "coincide", motorEUR: "1879.902" })
  })

  it("no cuenta como verificada una referencia que sólo acredita bytes", () => {
    const r = medir(caso())
    expect(r.medicion).toMatchObject({ iguales: 0, igualesExploratorias: 1, N: 1 })
    expect(r.resultados[0].vinculacion).toMatchObject({ estado: "no-verificado", motivo: "sin-evidencia-vinculada" })
  })

  it("conserva todos los slots del manifiesto y rechaza sustituciones", () => {
    const a = caso(), b = caso({ id: "pendiente", entradaAPI: null, resultadoOpenEUR: null })
    const manifiesto = { N: 2, casos: [a, b] }
    expect(medirCasos([a], { manifiesto }).medicion).toMatchObject({ N: 2, comparables: 1, manifiestoCompleto: true })
    expect(() => medirCasos([caso({ id: "ajeno" })], { manifiesto })).toThrow("caso-fuera-del-manifiesto")
    expect(() => medirCasos([caso({ entradaAPI: null })], { manifiesto })).toThrow("entrada-distinta-del-manifiesto")
    expect(() => medirCasos([caso({ pesoExterno: "999" })], { manifiesto })).toThrow("peso-distinto-del-manifiesto")
    expect(() => medirCasos({ N: 80, casos: [a] })).toThrow("denominador-declarado-distinto")
  })

  it("coincide en resultado, conserva ausencia y componentes no proyectados", () => {
    const r = medir(caso({ componentesOpenEUR: {
      gravamenEstatal: fixtures[0].fields.CEXGE1,
      reduccionArt20: null,
      componenteAmpliado: "1.00",
    } }))
    expect(r.medicion).toMatchObject({ igualesExploratorias: 1, N: 1, fraccionExploratoria: "1/1" })
    expect(r.resultados[0].integridadReferencias.estado).toBe("bytes-verificados")
    expect(r.resultados[0].componentes).toMatchObject({
      gravamenEstatal: { estado: "coincide" },
      reduccionArt20: { estado: "open-ausente", openEUR: null },
      componenteAmpliado: { estado: "motor-no-proyectado", motorEUR: null },
    })
    expect(r.ponderacionExterna.discrepanciaPonderadaEUR).toBeNull()
  })

  it("no confunde igualdad del resultado con igualdad de componentes", () => {
    const r = medir(caso({ componentesOpenEUR: { gravamenEstatal: "0.00" } }))
    expect(r.resultados[0].estado).toBe("igual-al-centimo")
    expect(r.resultados[0].componentes.gravamenEstatal.estado).toBe("difiere")
  })

  it("admite comparación decimal de componentes sin redondearlos", () => {
    const entradaAPI = structuredClone(fixtures[0].entrada)
    entradaAPI.trabajo.rendimientos.forEach((r) => { r.clase = "pension" })
    const r = medir(caso({ entradaAPI, componentesOpenEUR: { gravamenEstatal: "2149.758000" } }))
    expect(r.resultados[0].componentes.gravamenEstatal.estado).toBe("coincide")
  })

  it("mantiene rechazados y contratos ampliados dentro del denominador", () => {
    const entradaAPI = { ...fixtures[0].entrada, perfil: "contrato-ampliado-pendiente" }
    const r = medir(caso(), caso({ id: "ampliado", entradaAPI }),
      caso({ id: "sin-referencias", integridadReferencias: null }))
    expect(r.medicion).toMatchObject({ igualesExploratorias: 1, N: 3, comparables: 1 })
    expect(r.resultados.map((c) => c.estado)).toEqual(["igual-al-centimo", "no-admitido", "rechazado"])
  })

  it("rechaza entradas de otro ejercicio y propiedades API sobrantes", () => {
    const r = medir(caso({ entradaAPI: { ...fixtures[0].entrada, ejercicio: 2024 } }),
      caso({ id: "exceso", entradaAPI: { ...fixtures[0].entrada, desconocido: true } }))
    expect(r.medicion).toMatchObject({ igualesExploratorias: 0, N: 2, comparables: 0 })
    expect(r.resultados.every((r) => r.estado === "no-admitido")).toBe(true)
  })

  it("conserva rechazos semánticos de la API", () => {
    const familiar = fixtures.find((f) => f.originalEntrada !== undefined)
    expect(familiar).toBeDefined()
    const r = medir(caso({ entradaAPI: familiar.originalEntrada }))
    expect(r.medicion).toMatchObject({ igualesExploratorias: 0, N: 1, comparables: 0 })
    expect(r.resultados[0]).toMatchObject({ estado: "rechazado", motivo: "API-rechaza-liquidacion" })
    expect(r.resultados[0].resultadoOpenEUR).toBe(fixtures[0].fields.RESULTADO)
    expect(r.resultados[0].resultadoMotorEUR).toBeUndefined()
  })

  it("deduplica por id sin depender del orden de claves y rechaza conflictos", () => {
    const a = caso()
    const invertido = Object.fromEntries(Object.entries(a).reverse())
    expect(medir(a, invertido).medicion).toMatchObject({ igualesExploratorias: 1, N: 1, duplicados: 1 })
    const r = medir(a, caso({ resultadoOpenEUR: "0" }))
    expect(r.medicion).toMatchObject({ igualesExploratorias: 0, N: 1 })
    expect(r.resultados[0].motivo).toBe("identidad-con-contenidos-conflictivos")
  })

  it("no pierde registros malformados sin identidad", () => {
    const r = medir(null, {}, caso())
    expect(r.medicion).toMatchObject({ igualesExploratorias: 1, N: 3 })
  })

  it("no convierte el identificador de una unidad conjunta en cobertura adicional", () => {
    const document = JSON.parse(readFileSync(new URL(
      "../docs/procedencia/implementaciones/conjunta-ordinaria-2025/entradas-candidatas.json", import.meta.url)))
    const original = document.casos.find(c => c.id === "open2025-aragon-01").entradaCandidata
    const copied = JSON.parse(JSON.stringify(original, (key, value) =>
      key === "unidadId" ? "otra-etiqueta-del-mismo-hogar" : value))
    const before = JSON.stringify(original)
    const r = medir(caso({ id: "hogar-a", entradaAPI: original, resultadoOpenEUR: null }),
      caso({ id: "hogar-b", entradaAPI: copied, resultadoOpenEUR: null }))
    expect(r.resultados[1].duplicadoEntradaDe).toBe("hogar-a")
    expect(r.medicion).toMatchObject({ N: 2, iguales: 0 })
    expect(JSON.stringify(original)).toBe(before)
    copied.economia.trabajo.rendimientos[0].integro = "47000.00"
    const changed = medir(caso({ id: "hogar-a", entradaAPI: original, resultadoOpenEUR: null }),
      caso({ id: "hogar-b", entradaAPI: copied, resultadoOpenEUR: null }))
    expect(changed.resultados[1].duplicadoEntradaDe).toBeUndefined()
  })

  it("conserva las contradicciones entre unidades al deduplicar", () => {
    const original = { perfil: "conjunta-trabajo-ordinario-2025", unidadId: "a", hijos: [{ unidadId: "a" }] }
    const contradictory = { ...original, hijos: [{ unidadId: "b" }] }
    const r = medir(caso({ id: "coherente", entradaAPI: original, resultadoOpenEUR: null }),
      caso({ id: "contradictorio", entradaAPI: contradictory, resultadoOpenEUR: null }))
    expect(r.resultados[1].duplicadoEntradaDe).toBeUndefined()
    expect(r.medicion.iguales).toBe(0)
  })

  it("excluye la misma entrada también del numerador exploratorio", () => {
    const r = medir(caso({ id: "original" }), caso({ id: "otra-etiqueta" }))
    expect(r.resultados[1].duplicadoEntradaDe).toBe("original")
    expect(r.medicion).toMatchObject({ N: 2, iguales: 0, igualesExploratorias: 1 })
  })

  it("no duplica un arrendador por renombrar la liquidación", () => {
    const original = { perfil: "trabajo-alquiler-ordinario-2025", liquidacionId: "a", inmuebles: [{ id: "V", ingresos: "12000.00" }] }
    const duplicate = { ...original, liquidacionId: "b" }
    const different = { ...duplicate, inmuebles: [{ id: "V", ingresos: "14000.00" }] }
    const r = medir(...[original, duplicate, different].map((entradaAPI, i) =>
      caso({ id: `alquiler-${i}`, entradaAPI, resultadoOpenEUR: null })))
    expect(r.resultados[1].duplicadoEntradaDe).toBe("alquiler-0")
    expect(r.resultados[2].duplicadoEntradaDe).toBeUndefined()
    expect(r.medicion).toMatchObject({ N: 3, iguales: 0 })
  })

  it("compara céntimos exactos y pondera sólo con pesos aportados", () => {
    // El resultado oficial de este fixture es 176.07; la API debe dar ese resultado.
    expect(fixtures[0].fields.RESULTADO).toBe("176.07")
    const otraEntrada = structuredClone(fixtures[0].entrada)
    expect(otraEntrada.retenciones[0].importe).toBe("3100.03")
    otraEntrada.retenciones[0].importe = "3101.03"
    const r = medir(caso({ id: "a", resultadoOpenEUR: "176.06", pesoExterno: "0.1" }),
      caso({ id: "b", entradaAPI: otraEntrada, resultadoOpenEUR: "175.08", pesoExterno: "0.2" }))
    expect(r.medicion).toMatchObject({ igualesExploratorias: 0, N: 2, comparables: 2 })
    expect(r.resultados.map((c) => c.discrepanciaEUR)).toEqual(["0.01", "-0.01"])
    expect(r.ponderacionExterna).toMatchObject({ estado: "completa",
      discrepanciaPonderadaEUR: "-0.001", discrepanciaAbsolutaPonderadaEUR: "0.003" })
    expect(r.discrepanciasPorPrioridad.map(c => [c.id, c.impactoAbsolutoPonderadoEUR])).toEqual([
      ["b", "0.002"], ["a", "0.001"],
    ])
    expect(r.discrepanciasPorPrioridad.every(c => c.evidenciaVinculada === false)).toBe(true)
    const parcial = medir(caso({ pesoExterno: "1" }), caso({ id: "sin-peso" }))
    expect(parcial.ponderacionExterna).toMatchObject({ estado: "incompleta",
      casosSinPesoOResultado: 1, discrepanciaPonderadaEUR: null })
  })

  it.each([null, undefined, 176.07, "176.071", "1e2", "176,07"])(
    "no sustituye un resultado ausente o ambiguo (%s) por cero", (resultadoOpenEUR) => {
      const r = medir(caso({ resultadoOpenEUR }))
      expect(r.medicion).toMatchObject({ igualesExploratorias: 0, N: 1, comparables: 0 })
      expect(r.resultados[0].discrepanciaEUR).toBeUndefined()
    }
  )

  it("normaliza sólo ceros decimales y maneja importes grandes sin Number", () => {
    expect(medir(caso({ resultadoOpenEUR: "176.0700" })).medicion.igualesExploratorias).toBe(1)
    const r = medir(caso({ resultadoOpenEUR: "999999999999999999999999.99" }))
    expect(r.resultados[0].discrepanciaEUR).toBe("-999999999999999999999823.92")
  })

  it("comprueba bytes, errores de lectura y referencias duplicadas sin filtrar rutas", () => {
    for (const [referencias, estado] of [
      [[{ ...referencia, sha256: "0".repeat(64) }], "hash-discrepante"],
      [[{ ...referencia, archivo: referencia.archivo + ".inexistente" }], "no-legible"],
      [[referencia, referencia], "duplicada"],
    ]) {
      const r = medir(caso({ integridadReferencias: { referencias } }))
      expect(r.resultados[0].integridadReferencias.estado).toBe(estado)
      expect(r.medicion).toMatchObject({ igualesExploratorias: 0, N: 1 })
      expect(JSON.stringify(r)).not.toContain(referencia.archivo)
    }
  })

  it.each(["-1", 1, null, "NaN"])("rechaza peso externo inválido (%s)", (pesoExterno) => {
    expect(medir(caso({ pesoExterno })).medicion.comparables).toBe(0)
  })

  it("exige lista no vacía", () => {
    expect(() => medirCasos([])).toThrow("lista-de-casos-no-vacia-requerida")
  })
})
