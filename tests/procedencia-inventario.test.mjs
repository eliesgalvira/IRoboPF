import { describe, it, expect } from "vitest"
import { runInThisContext } from "node:vm"
import { spawnSync } from "node:child_process"
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  copyFileSync,
  symlinkSync,
} from "node:fs"
import { resolve, dirname } from "node:path"
import { gzipSync } from "node:zlib"
import ts from "typescript"
import Decimal from "decimal.js"
import { extractTs, hash } from "../scripts/procedencia/inventario-ast.mjs"
import {
  dimensions,
  flatten,
  sourcePaths,
  validate,
} from "../scripts/procedencia/inventario.mjs"
import {
  compareFiles,
  readArtifact,
} from "../scripts/procedencia/inventario-artefacto.mjs"

describe("inventario sintáctico y efectivo", () => {
  it("la API reconstruye valores nuevos aunque el llamador haya importado una dependencia", () => {
    const scratch = resolve(".cache/procedencia/inventario-pruebas")
    mkdirSync(scratch, { recursive: true })
    const root = mkdtempSync(resolve(scratch, "cache-"))
    try {
      for (const { file } of readArtifact().manifest.generationInputs) {
        const target = resolve(root, file)
        mkdirSync(dirname(target), { recursive: true })
        copyFileSync(resolve(file), target)
      }
      symlinkSync(resolve("node_modules"), resolve(root, "node_modules"), "dir")
      writeFileSync(
        resolve(root, "cache.mjs"),
        `
import { readFileSync, writeFileSync } from "node:fs";
import { generate } from "./scripts/procedencia/inventario.mjs";
import { MINIMOS_ESTATALES_2024 } from "./lib/dominio/normativa/datos/minimos-autonomicos-2024.ts";
if (MINIMOS_ESTATALES_2024.contribuyente.general.toString() !== "5550") throw new Error("Fixture cambiado");
const file = "lib/dominio/normativa/datos/minimos-autonomicos-2025.ts";
const old = readFileSync(file, "utf8");
if (!old.includes('"5550"')) throw new Error("Literal de fixture ausente");
writeFileSync(file, old.replace('"5550"', '"5551"'));
const result = await generate(process.cwd(), process.cwd() + "/generated");
const items = result.pages.flatMap(page => JSON.parse(readFileSync("generated/" + page.file, "utf8")));
const item = items.find(item => item.layer === "effective" && item.symbol === "MINIMOS_ESTATALES_2024" && item.path === '["contribuyente","general"]');
if (item?.value !== "5551") throw new Error("Valor cacheado: " + item?.value);
console.log("5551");
`
      )
      const result = spawnSync("bun", ["cache.mjs"], {
        cwd: root,
        encoding: "utf8",
        timeout: 60000,
        maxBuffer: 1024 * 1024,
      })
      expect(result.status, result.stderr).toBe(0)
      expect(result.stdout.trim()).toBe("5551")
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }, 60000)
  it("rechaza un valor adulterado aunque todos sus hashes hayan sido recalculados", () => {
    const command = ["scripts/procedencia/inventario-artefacto.mjs", "check"]
    const options = { encoding: "utf8", timeout: 60000, maxBuffer: 1024 * 1024 }
    const baseline = spawnSync("bun", command, options)
    expect(baseline.status, baseline.stderr).toBe(0)
    const scratch = resolve(".cache/procedencia/inventario-pruebas")
    mkdirSync(scratch, { recursive: true })
    const temporary = mkdtempSync(resolve(scratch, "alterado-"))
    try {
      const { files, manifest } = readArtifact()
      const page = manifest.pages[0]
      const items = JSON.parse(files.get(page.file))
      items[0].value = "987654321"
      const changed = JSON.stringify(items) + "\n"
      files.set(page.file, changed)
      page.sha256 = hash(changed)
      const summary = structuredClone(manifest)
      delete summary.artifact
      files.set("inventario.json", JSON.stringify(summary) + "\n")
      const raw = gzipSync(Buffer.from(JSON.stringify([...files])))
      manifest.artifact.sha256 = hash(raw)
      manifest.artifact.size = raw.length
      const folder = resolve(temporary, "docs/procedencia")
      mkdirSync(folder, { recursive: true })
      writeFileSync(resolve(folder, manifest.artifact.file), raw)
      writeFileSync(
        resolve(folder, "inventario.json"),
        JSON.stringify(manifest)
      )
      expect(() => readArtifact(temporary)).not.toThrow()
      const result = spawnSync("bun", [...command, temporary], options)
      expect(result.status).toBe(1)
      expect(result.stderr).toContain("Diferencia respecto a fuentes actuales")
    } finally {
      rmSync(temporary, { recursive: true, force: true })
    }
  }, 60000)
  it("no reutiliza una identidad para otro número al insertar un elemento", () => {
    const anterior = extractTs("fixture.ts", "const valores = [10, 20]")
    const posterior = extractTs("fixture.ts", "const valores = [5, 10, 20]")
    const diez = anterior.items.find((item) => item.expression === "10")
    const cinco = posterior.items.find((item) => item.expression === "5")
    expect(diez.id).not.toBe(cinco.id)
  })
  it("no oculta BigInt, ciclos ni objetos que imitan Decimal o primitivas", () => {
    expect(flatten(3n)).toEqual([{ path: [], value: "3" }])
    const falsoDecimal = { constructor: { name: "Decimal" }, amount: 123 }
    expect(flatten(falsoDecimal)).toContainEqual({
      path: ["amount"],
      value: "123",
    })
    const falsoNumero = { [Symbol.toStringTag]: "Number", amount: 123 }
    expect(() => flatten(falsoNumero)).toThrow("símbolo")
    const ciclo = {}
    ciclo.self = ciclo
    expect(() => flatten(ciclo)).toThrow("Ciclo")
    const proto = Object.assign(Object.create(null), { amount: 123 })
    expect(() => flatten(Object.create(proto))).toThrow("Objeto no soportado")
    expect(() => flatten(NaN)).toThrow("NaN")
    expect(() => flatten(new Decimal(NaN))).toThrow("NaN")
  })
  it("selecciona fuentes con independencia del nombre del checkout", () => {
    const scratch = resolve(".cache/procedencia/inventario-pruebas")
    mkdirSync(scratch, { recursive: true })
    const root = mkdtempSync(resolve(scratch, "procedencia-"))
    try {
      mkdirSync(resolve(root, "lib/procedencia"), { recursive: true })
      writeFileSync(resolve(root, "lib/valor.ts"), "export const x = 42")
      writeFileSync(
        resolve(root, "lib/procedencia/artefacto.ts"),
        "export const x = 1"
      )
      expect(sourcePaths(root)).toEqual([resolve(root, "lib/valor.ts")])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
  it("clasifica operadores por estructura y no por fragmentos del nombre", () => {
    const source = extractTs(
      "fixture.ts",
      "Math.floor(2.5); Math.ceil(2.5); surround(2); a == b; new Decimal('2')"
    )
    const kind = (expression) =>
      source.items.find((item) => item.expression === expression)?.kind
    expect(kind("Math.floor(2.5)")).toBe("Rounding")
    expect(kind("Math.ceil(2.5)")).toBe("Rounding")
    expect(kind("surround(2)")).toBe("Formula")
    expect(kind("a == b")).toBe("Condition")
    expect(kind("new Decimal('2')")).toBe("Formula")
  })
  it("rechaza una aceptación de evidencia introducida en un elemento pendiente", () => {
    const items = extractTs("fixture.ts", "const x = 42").items
    items[0].evidence = "accepted"
    expect(() => validate(items, ["fixture.ts"])).toThrow("Aceptación")
  })
  it("rechaza datos, índices, auxiliares y conjuntos distintos de una reconstrucción", () => {
    const fresh = new Map([
      ["inventario-pagina-0000.json", '[{"value":"42"}]'],
      ["inventario-bindings.json", "[]"],
    ])
    const changed = new Map(fresh)
    changed.set("inventario-pagina-0000.json", '[{"value":"987654321"}]')
    expect(() => compareFiles(fresh, changed)).toThrow("fuentes actuales")
    const removed = new Map(fresh)
    removed.delete("inventario-bindings.json")
    expect(() => compareFiles(fresh, removed)).toThrow("Conjunto")
    const added = new Map(fresh).set("inventario-pagina-0001.json", "[]")
    expect(() => compareFiles(fresh, added)).toThrow("Conjunto")
  })
  it("incluye decimales string, números, arrays, funciones, condiciones y redondeos", () => {
    const source = extractTs(
      "fixture.ts",
      'export const tabla = [["9.5", -12000], [Infinity, 0.12]]; export function calcular(x: number) { if (x <= 100) return Math.round(x * 0.1); return x; }'
    )
    expect(source.counts.numeric).toBe(4)
    expect(source.counts.decimalStrings).toBe(1)
    expect(source.items.map((i) => i.kind)).toEqual(
      expect.arrayContaining([
        "Parameter",
        "Formula",
        "Step",
        "Condition",
        "Rounding",
      ])
    )
    expect(source.items.some((i) => i.expression === '"9.5"')).toBe(true)
  })
  it("versiona las ocurrencias al cambiar el archivo sin afirmar identidad fiscal permanente", () => {
    const a = extractTs("fixture.ts", "export const tarifa = [9.5, 12];")
    const b = extractTs(
      "fixture.ts",
      "// comentario\nconst ajeno=42;\nexport const tarifa = [9.5, 12];"
    )
    expect(
      b.items.filter((i) => i.symbol === "tarifa").map((i) => i.id)
    ).not.toEqual(a.items.map((i) => i.id))
    expect(b.sha256).not.toBe(a.sha256)
  })
  it("expande herencia, spread, binding y decimal sin perder aliases compartidos", () => {
    const fixture = `const base = { tramo: [new Decimal('1234.56'), new Decimal('9.5').div(100)] }; const alias = base; const anterior = { madrid: alias, aragon: base }; const actual = {...anterior, madrid: {...alias, minimo: new Decimal('5550')}}; result.tabla = {2024: anterior, 2025: actual};`
    const execute = runInThisContext(
      `(Decimal) => { const result = {}; ${ts.transpile(fixture)}; return result.tabla }`,
      { timeout: 1000 }
    )
    const leaves = flatten(execute(Decimal))
    expect(
      leaves.find((l) => l.path.join("/") === "2025/madrid/tramo/1")?.value
    ).toBe("0.095")
    expect(
      leaves.find((l) => l.path.join("/") === "2024/aragon/tramo/0")?.value
    ).toBe("1234.56")
    expect(leaves).toHaveLength(9)
  })
  it("no convierte nombre anual en soporte 2026 ni pierde límite abierto", () => {
    expect(
      dimensions("ESCALAS_AUTONOMICAS_IRPF_2025", [
        "madrid",
        "tramos",
        "0",
        "1",
      ])
    ).toEqual({
      years: [2025],
      territories: ["madrid"],
      unit: "proporción por uno",
    })
    expect(flatten(new Decimal(Infinity))[0].value).toBe("Infinity")
  })
  it("analiza Python sin ejecutar pandas ni generar Excel", () => {
    const result = spawnSync(
      "python3",
      ["scripts/procedencia/inventario-python.py", "Calculo_Salario_IRPF.py"],
      { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }
    )
    expect(result.status).toBe(0)
    const data = JSON.parse(result.stdout)
    expect(
      data.items.some(
        (i) => i.kind === "Step" && i.symbol === "calcular_cuotas_por_tramo"
      )
    ).toBe(true)
    expect(data.items.some((i) => i.kind === "Condition")).toBe(true)
    expect(data.items.some((i) => i.kind === "Rounding")).toBe(true)
  })
  it("rechaza duplicados, omisiones de archivos y relaciones rotas", () => {
    const items = extractTs("fixture.ts", "const x = 42").items
    expect(() => validate([...items, ...items], ["fixture.ts"])).toThrow(
      "duplicado"
    )
    expect(() => validate(items, ["ausente.ts"])).toThrow("cobertura")
    const broken = structuredClone(items)
    broken[0].relations.itemIds.push("inexistente")
    expect(() => validate(broken, ["fixture.ts"])).toThrow("Relación rota")
  })
  it("verifica hashes de páginas, cobertura representativa y selección territorial real", () => {
    const { files, manifest } = readArtifact()
    const ids = new Set()
    const selected = new Map()
    let total = 0
    for (const page of manifest.pages) {
      const raw = files.get(page.file)
      expect(hash(raw)).toBe(page.sha256)
      const items = JSON.parse(raw)
      expect(items).toHaveLength(page.count)
      for (const item of items) {
        expect(ids.has(item.id)).toBe(false)
        ids.add(item.id)
        if (item.layer === "selected")
          selected.set(JSON.parse(item.path).join("/"), item.value)
      }
      total += items.length
    }
    expect(total).toBe(
      manifest.counts.syntactic +
        manifest.counts.effective +
        manifest.counts.selected
    )
    expect(
      selected.get("2025/madrid/sin entradas opcionales/escalaAutonomica/0/0")
    ).toBe("13362.22")
    expect(
      selected.get("2025/madrid/sin entradas opcionales/escalaAutonomica/0/1")
    ).toBe("0.085")
    expect(
      selected.get(
        "2026/simulada-estatal/sin entradas opcionales/minimosAutonomicos/contribuyente/general"
      )
    ).toBe("5550")
    const galicia = (base) =>
      [...selected.entries()]
        .filter(([path]) =>
          path.startsWith(`2014/galicia/base=${base}/escalaAutonomica/`)
        )
        .map(([path, value]) => [path.split("/").slice(3).join("/"), value])
        .sort()
    expect(galicia("17707.19")).toEqual(galicia("17707.20"))
    expect(galicia("17707.20")).not.toEqual(galicia("17707.21"))
    expect(
      manifest.syntaxCoverage.some(
        (s) => s.file === "lib/export/auditoria-excel.ts" && s.items > 0
      )
    ).toBe(true)
    const coverage = JSON.parse(files.get("inventario-cobertura.json"))
    expect(
      coverage.filter((c) => c.scenario === "sin entradas opcionales")
    ).toHaveLength(15 * 18)
    expect(
      coverage.filter((c) => c.year === 2014 && c.territory === "galicia")
    ).toHaveLength(4)
    expect(
      coverage
        .filter(
          (c) => c.year === 2026 && c.result === "ParametrosComunidadAutonoma"
        )
        .map((c) => c.territory)
    ).toEqual(["simulada-estatal"])
    expect(
      coverage.find((c) => c.year === 2025 && c.territory === "madrid").result
    ).toBe("ParametrosComunidadAutonoma")
  })
  it("resuelve el alias importado real de mínimos 2024 a su definición 2025", () => {
    const graph = JSON.parse(
      readArtifact().files.get("inventario-bindings.json")
    )
    const binding = graph.find((b) => b.symbol === "MINIMOS_ESTATALES_2024")
    expect(
      binding.dependencies.some(
        (d) =>
          d.symbol === "MINIMOS_ESTATALES_2025" &&
          d.file.endsWith("/minimos-autonomicos-2025.ts")
      )
    ).toBe(true)
  })
})
