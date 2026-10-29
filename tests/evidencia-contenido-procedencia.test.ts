import { beforeAll, afterAll, describe, expect, it } from "vitest"
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  mkdtempSync,
  cpSync,
  resolve,
} from "../lib/procedencia/io.mjs"
import {
  comprobarEntrada,
  generarEvidencia,
  prepararEntrada,
  rutaPublicaBlob,
  rmSync,
  dirname,
} from "../scripts/procedencia/evidencia-contenido.mjs"
import {
  bytesEntidad,
  hash,
  verificarGrafo,
} from "../lib/procedencia/verificador"

const root = process.cwd()
const catalogoActual = JSON.parse(
  readFileSync(resolve(root, "lib/procedencia/rastro-generado.json"), "utf8")
)
// Pines del test: no constituyen aprobación editorial de publicación.
const entrada = prepararEntrada(root, catalogoActual.actual.versiones.snapshot)
const scratch = mkdtempSync(resolve(root, ".cache/evidencia-test-"))
let resultado: Awaited<ReturnType<typeof generarEvidencia>>
beforeAll(
  () =>
    generarEvidencia(root, entrada).then((generado) => {
      resultado = generado
      for (const dependency of entrada.dependencias) {
        const path = resolve(scratch, dependency.path)
        mkdirSync(dirname(path), { recursive: true })
        cpSync(resolve(root, dependency.path), path)
      }
    }),
  300_000
)
afterAll(() => rmSync(scratch, { recursive: true, force: true }))

describe("Evidencia desde fuentes actuales", () => {
  it("reconstruye Madrid y cierra el grafo con originales reales", () => {
    expect(resultado.informe.entradas).toHaveLength(5)
    expect(
      verificarGrafo(
        resultado.informe.entradas,
        new Set(resultado.objetos.keys())
      ).aceptacionFiscal
    ).toBe("pendiente")
    expect(resultado.informe.estados[0]).toMatchObject({
      exactitudNumerica: "verified",
      revisionBinding: "pending",
      autenticidad: "trust-indeterminate",
      aceptacionFiscalCompleta: false,
    })
    expect(resultado.informe.entradas.map((e) => e.entidad.tipo)).toEqual([
      "Document",
      "Citation",
      "Facsimile",
      "Rule",
      "Parameter",
    ])
    for (const [digest, bytes] of resultado.objetos)
      expect(hash(bytes)).toBe(digest)
  })
  it.each([
    [
      "documento",
      "docs/procedencia/corpus/madrid-2018-norma.manifest.json",
      "sha256",
    ],
    ["claim", "docs/procedencia/enlaces/madrid-2020-limite.json", "claim"],
    ["unidad", "docs/procedencia/enlaces/madrid-2020-limite.json", "unit"],
    [
      "crop",
      "docs/procedencia/corpus/madrid-2020-limite.citation.json",
      "bbox",
    ],
    [
      "metadatos privados",
      "docs/procedencia/corpus/madrid-2018-norma.manifest.json",
      "Authorization",
    ],
    [
      "campo extra",
      "docs/procedencia/enlaces/madrid-2020-limite.json",
      "extra",
    ],
  ])("rechaza mutación de %s antes de ejecutar", (_nombre, path, campo) => {
    const absolute = resolve(scratch, path)
    const original = readFileSync(absolute)
    const value = JSON.parse(original.toString())
    if (campo === "claim" || campo === "unit") value.scope[campo] = "alterado"
    else value[campo] = "alterado"
    writeFileSync(absolute, JSON.stringify(value))
    expect(() => comprobarEntrada(scratch, entrada)).toThrow(
      "Dependencia alterada: " + path
    )
    writeFileSync(absolute, original)
  })
  it("rechaza otro snapshot y resultados autoafirmados", () => {
    expect(() =>
      comprobarEntrada(root, { ...entrada, snapshot: "a".repeat(64) })
    ).toThrow()
    expect(() =>
      comprobarEntrada(root, {
        ...entrada,
        evidence: { integrity: "verified" },
      })
    ).toThrow("Campos extra")
  })
  it.each([
    "8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660",
    "95c51f213a841bdc1658a260620f891f77c22311d12aa7b9d2e06c5289ba1868",
  ])("rechaza bytes alterados del original/crop %s", (sha256) => {
    const path = "docs/procedencia/corpus/fixtures/sha256/" + sha256
    const absolute = resolve(scratch, path)
    const original = readFileSync(absolute)
    writeFileSync(absolute, Buffer.concat([original, Buffer.from("alterado")]))
    expect(() => comprobarEntrada(scratch, entrada)).toThrow(
      "Dependencia alterada: " + path
    )
    writeFileSync(absolute, original)
  })
  it("rechaza IDs duplicados y cierre sin PNG", () => {
    const entries = resultado.informe.entradas
    expect(() =>
      verificarGrafo(
        [...entries, ...entries],
        new Set(resultado.objetos.keys())
      )
    ).toThrow("duplicada")
    expect(() => verificarGrafo(entries)).toThrow("Blob auxiliar ausente")
  })
  it("rechaza campos extra y privados en entidades", () => {
    const entity = resultado.informe.entradas[0].entidad
    expect(() => bytesEntidad({ ...entity, extra: true })).toThrow()
    expect(() =>
      bytesEntidad({ ...entity, titulo: "Authorization: privado" })
    ).toThrow("privado")
  })
  it("direcciona PNG sin parámetros de contribuyente", () => {
    expect(rutaPublicaBlob("a".repeat(64))).toBe(
      "/procedencia/objetos/" + "a".repeat(64)
    )
    expect(() => rutaPublicaBlob("?renta=10000")).toThrow()
  })
})
