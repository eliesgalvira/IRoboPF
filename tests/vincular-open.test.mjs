import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { createHash } from "node:crypto"
import { resolve } from "node:path"
import { inflateSync } from "node:zlib"
import { describe, it, expect } from "vitest"
import { vincularOpen, resultadoPdf0670, sesDeclaracionReadback, decodificarPersistencia } from "../tools/procedencia/simuladores/vincular-open.mjs"
import { medirCasos } from "../tools/procedencia/simuladores/medir-casos.mjs"

const oficial = JSON.parse(readFileSync(new URL("../docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json", import.meta.url))).find(c => c.id === "componentes")
const ref = tipo => ({ archivo: fileURLToPath(new URL(`../docs/procedencia/auditorias/redondeo-anual-rentaweb-open/componentes.${tipo}`, import.meta.url)), sha256: oficial.sha256[tipo] })
const caso = () => ({ id: "componentes", entradaAPI: structuredClone(oficial.entrada), resultadoOpenEUR: oficial.casillas["0670"], evidenciaOpen: { ses: ref("ses"), pdf: ref("pdf") }, integridadReferencias: { referencias: [ref("ses"), ref("pdf")] } })

describe("vinculo de entrada y resultado Open", () => {
  const original = inflateSync(readFileSync(ref("ses").archivo)).toString("latin1")
  it("verifica el contenido completo de la transcripción reversible y rechaza alteraciones", () => {
    const text = original + "\n# áéñ\n"
    const reference = { formato: "ses-latin1-transcrito-utf8",
      contenidoLatin1Sha256: createHash("sha256").update(Buffer.from(text, "latin1")).digest("hex") }
    expect(decodificarPersistencia(Buffer.from(text, "utf8"), reference)).toBe(text)
    expect(() => decodificarPersistencia(Buffer.from(text + "x"), reference)).toThrow("ses-transcripcion-contenido-distinto")
    expect(() => decodificarPersistencia(Buffer.from(text + "€"), reference)).toThrow("ses-transcripcion-no-latin1")
    expect(() => decodificarPersistencia(Buffer.from([255]), reference)).toThrow()
    expect(() => decodificarPersistencia(Buffer.from(text), { ...reference, formato: "otro" })).toThrow("ses-formato-no-soportado")
  })
  it.each([
    s => s.replace("INDV~1~true", "INDV~1~false"),
    s => s.replace("TITULAR~1~DECLARANTE", "TITULAR~1~CONYUGE"),
    s => s.replace("INDV~1~true", "INDV~1~true\n INDV~1~true"),
    s => s.replace("TITULAR~1~DECLARANTE", "TITULAR~2~DECLARANTE"),
    s => s.replace("CAC_D~1~12", "CAC_D~1~01"),
    s => s.replace("ZCCAD~1~12", "ZCCAD~1~01"),
  ])("rechaza identidad, modalidad o códigos contradictorios", mutate => {
    const changed = mutate(original)
    expect(changed).not.toBe(original)
    expect(() => sesDeclaracionReadback(changed, "madrid")).toThrow()
  })
  it("la etiqueta de otra comunidad no autoriza códigos de Madrid", () => {
    const changed = original.replace("CAD_D~1~MADRID", "CAD_D~1~ANDALUCIA")
    expect(() => sesDeclaracionReadback(changed, "andalucia")).toThrow()
    expect(sesDeclaracionReadback(original, "madrid")).toMatchObject({ modalidad: "individual", titular: "DECLARANTE", codigoTerritorial: "12" })
  })
  it("vincula la entrada real al SES y extrae 0670 del PDF original", () => {
    expect(vincularOpen(caso(), process.cwd())).toMatchObject({ estado: "entrada-ses-y-resultado-pdf-vinculados", resultadoEUR: "2575.26" })
  })
  it("una misma entrada con dos nombres sólo suma una coincidencia verificada", () => {
    const a = caso(), b = { ...caso(), id: "otro-nombre" }
    const r = medirCasos([a, b])
    expect(r.medicion).toMatchObject({ iguales: 1, igualesExploratorias: 2, N: 2 })
    expect(r.resultados[1].duplicadoEntradaDe).toBe("componentes")
    a.resultadoOpenEUR = "2575.25"; a.pesoExterno = "1"
    const duplicado = { ...structuredClone(a), id: "duplicado" }
    const p = medirCasos([a, duplicado]).ponderacionExterna
    expect(p).toMatchObject({ estado: "incompleta", casosConPesoYResultado: 1,
      sumaPesosComparables: "1", discrepanciaAbsolutaPonderadaEUR: null })
  })
  it("no reutiliza una captura de empleo para una pensión", () => {
    const c = caso(); c.entradaAPI.trabajo.rendimientos[0].clase = "pension"
    expect(vincularOpen(c, process.cwd()).estado).toBe("no-verificado")
  })
  it("rechaza entrada o resultado sustituidos sin cambiar los hashes oficiales", () => {
    const ingreso = caso(); ingreso.entradaAPI.trabajo.rendimientos[0].integro = "30000"
    const resultado = caso(); resultado.resultadoOpenEUR = "0"
    for (const c of [ingreso, resultado]) expect(vincularOpen(c, process.cwd()).estado).toBe("no-verificado")
  })
  it("rechaza artefactos no referenciados y bytes distintos", () => {
    const c = caso(); c.integridadReferencias.referencias = []
    expect(vincularOpen(c, process.cwd()).estado).toBe("no-verificado")
    const cambiado = caso(); cambiado.evidenciaOpen.ses.sha256 = "0".repeat(64)
    expect(vincularOpen(cambiado, process.cwd()).estado).toBe("no-verificado")
  })
  it("no inventa cero en ausencia de casilla y rechaza resultados duplicados", () => {
    expect(resultadoPdf0670("Resultado 0,00 0670\n")).toBe("0.00")
    expect(resultadoPdf0670("Resultado -1.234,56 0670\n")).toBe("-1234.56")
    expect(() => resultadoPdf0670("0,00 0610\n")).toThrow("pdf-0670-no-unico")
    expect(() => resultadoPdf0670("1,00 0670\n1,00 0670\n")).toThrow("pdf-0670-no-unico")
  })
})

// Integración optativa con originales privados: no copia capturas al repositorio.
describe.skipIf(!process.env.C_FAMILY_CAPTURE_DIR)("captura familiar privada", () => {
  const base = process.env.C_FAMILY_CAPTURE_DIR
  const family = () => {
    const entradaAPI = JSON.parse(readFileSync(resolve(base, 'entrada.json')))
    const ref = archivo => ({ archivo, sha256: createHash('sha256').update(readFileSync(resolve(base, archivo))).digest('hex') })
    const evidenciaOpen = { ses: ref('captura.ses'), pdf: ref('captura.pdf'), readbacks: ref('readbacks.json') }
    return { id: 'open2025-madrid-03', entradaAPI, resultadoOpenEUR: '174.55', evidenciaOpen,
      integridadReferencias: { referencias: Object.values(evidenciaOpen).map(r => ({ ...r })) } }
  }
  it('verifica SES/PDF/readbacks pero conserva faltantes y cero coincidencias verificadas', () => {
    const c = family(), r = vincularOpen(c, base)
    expect(r).toMatchObject({ estado: 'no-verificado', motivo: 'familia-predicados-pendientes', resultadoEUR: '174.55' })
    expect(r.familia.faltantes).toContain('declaracion-hijo-control-identificado')
    expect(medirCasos([c], { base }).medicion.iguales).toBe(0)
  })
  it('no acepta readbacks no referenciados o con hash alterado', () => {
    const a = family(); a.integridadReferencias.referencias.pop()
    const b = family(); b.evidenciaOpen.readbacks.sha256 = '0'.repeat(64)
    const c = family(); c.evidenciaOpen.readbacks.sha256 = '0'.repeat(64)
    c.integridadReferencias.referencias[2].sha256 = '0'.repeat(64)
    expect(vincularOpen(a, base).motivo).toBe('evidencia-no-referenciada')
    expect(vincularOpen(b, base).motivo).toBe('evidencia-no-referenciada')
    expect(vincularOpen(c, base).motivo).toBe('evidencia-hash-distinto')
  })
})
