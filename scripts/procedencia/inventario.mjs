import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs"
import { resolve, relative } from "node:path"
import { pathToFileURL } from "node:url"
import { spawnSync } from "node:child_process"
import { baseItem, extractTs, hash, idFor } from "./inventario-ast.mjs"
import { bindingGraph } from "./inventario-bindings.mjs"
import Decimal from "decimal.js"
import { Predicate } from "effect"

export function scenarios(year, territory) {
  const inputs = [{ name: "sin entradas opcionales", base: null, death: null }]
  if ([2014, 2015].includes(year) && territory === "galicia") {
    for (const base of ["17707.19", "17707.20", "17707.21"])
      inputs.push({ name: `base=${base}`, base, death: null })
  }
  const boundaries = [
    [2015, "illes-balears", "2015-12-31"],
    [2022, "comunitat-valenciana", "2022-10-28"],
    [2023, "extremadura", "2023-09-15"],
    [2023, "illes-balears", "2023-11-26"],
  ]
  for (const [y, t, date] of boundaries)
    if (y === year && t === territory) {
      for (const delta of [-1, 0, 1]) {
        const death = new Date(
          Date.parse(`${date}T00:00:00Z`) + delta * 86400000
        ).toISOString()
        inputs.push({ name: `fallecimiento=${death}`, base: null, death })
      }
    }
  return inputs
}

export function filesUnder(root) {
  return readdirSync(root, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? filesUnder(`${root}/${entry.name}`)
        : [`${root}/${entry.name}`]
    )
    .sort()
}
export function flatten(value, path = [], seen = new Set()) {
  if (Predicate.isNullish(value)) return []
  if (
    Predicate.isString(value) ||
    Predicate.isNumber(value) ||
    Predicate.isBoolean(value) ||
    Predicate.isBigInt(value)
  )
    return [{ path, value: String(value) }]
  if (Decimal.isDecimal(value)) {
    if (!(value instanceof Decimal))
      throw new Error(`Decimal ajeno o imitado: ${JSON.stringify(path)}`)
    return [{ path, value: Decimal.prototype.toString.call(value) }]
  }
  if (!Predicate.isObjectOrArray(value))
    throw new Error(`Tipo no soportado: ${JSON.stringify(path)}`)
  if (seen.has(value)) throw new Error(`Ciclo: ${JSON.stringify(path)}`)
  if (Object.getOwnPropertySymbols(value).length)
    throw new Error(`Propiedad símbolo no soportada: ${JSON.stringify(path)}`)
  const proto = Object.getPrototypeOf(value)
  if (
    !Array.isArray(value) &&
    proto !== null &&
    Object.getPrototypeOf(proto) !== null
  )
    throw new Error(`Objeto no soportado: ${JSON.stringify(path)}`)
  for (const [key, descriptor] of Object.entries(
    Object.getOwnPropertyDescriptors(value)
  )) {
    if (Array.isArray(value) && key === "length") continue
    if (!descriptor.enumerable || !("value" in descriptor))
      throw new Error(
        `Descriptor no soportado: ${JSON.stringify([...path, key])}`
      )
  }
  const next = new Set(seen).add(value)
  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, [...path, key], next)
  )
}
export function dimensions(symbol, path) {
  const years = path.filter((p) => /^20(?:1[2-9]|2[0-6])$/.test(p)).map(Number)
  if (!years.length) {
    const matches = [...symbol.matchAll(/20(?:1[2-9]|2[0-6])/g)].map((m) =>
      Number(m[0])
    )
    if (matches.length === 1) years.push(matches[0])
    if (matches.length === 2)
      for (let year = matches[0]; year <= matches[1]; year++) years.push(year)
  }
  const territories = path.filter((p) =>
    [
      "simulada-estatal",
      "andalucia",
      "aragon",
      "asturias",
      "illes-balears",
      "canarias",
      "cantabria",
      "castilla-la-mancha",
      "castilla-y-leon",
      "catalunya",
      "extremadura",
      "galicia",
      "madrid",
      "murcia",
      "la-rioja",
      "comunitat-valenciana",
      "ceuta",
      "melilla",
    ].includes(p)
  )
  let unit = "pending"
  if (/ESCALAS_AUTONOMICAS|TRAMOS_IRPF/.test(symbol)) {
    if (path.at(-1) === "0")
      unit = "EUR (límite de base; periodicidad pendiente)"
    if (path.at(-1) === "1") unit = "proporción por uno"
  }
  if (
    /MINIMOS_(AUTONOMICOS_IRPF|ESTATALES)/.test(symbol) &&
    !path.includes("fuente")
  )
    unit = "EUR (mínimo anual del código)"
  if (path.at(-1) === "euros" || path.at(-1) === "limiteMaximoEuros")
    unit = "EUR"
  if (path.at(-1) === "porcentaje") unit = "porcentaje por cien"
  return { years: [...new Set(years)], territories, unit }
}
export function validate(items, files) {
  const ids = new Set()
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`ID duplicado: ${item.id}`)
    ids.add(item.id)
    if (
      item.status !== "pending" ||
      item.independentReview !== "pending" ||
      item.evidence !== "pending"
    )
      throw new Error(`Aceptación no autorizada: ${item.id}`)
    if (!/^[a-f0-9]{64}$/.test(item.source.sha256))
      throw new Error(`Hash inválido: ${item.id}`)
  }
  for (const file of files)
    if (!items.some((item) => item.source.file === file))
      throw new Error(`Fuente sin cobertura: ${file}`)
  for (const item of items)
    for (const id of item.relations.itemIds)
      if (!ids.has(id)) throw new Error(`Relación rota: ${id}`)
}
export async function generate(
  root = process.cwd(),
  output = `${root}/.cache/procedencia/inventario`
) {
  if (existsSync(output) && readdirSync(output).length)
    throw new Error(`El destino debe estar vacío: ${output}`)
  mkdirSync(output, { recursive: true })
  const paths = filesUnder(`${root}/lib`).filter(
    (p) => /\.tsx?$/.test(p) && !p.includes("/procedencia/")
  )
  const extracted = paths.map((p) =>
    extractTs(relative(root, p), readFileSync(p, "utf8"))
  )
  const items = extracted.flatMap((source) => source.items)
  const gaps = [],
    modules = [],
    catalog = []
  const executor = extracted.find((s) =>
    s.file.endsWith("/deducciones-autonomicas-aplicadas.ts")
  )
  for (const source of extracted.filter((s) =>
    s.file.includes("/normativa/datos/")
  )) {
    // Solo módulos locales de datos del checkout de confianza; no módulos indicados por entrada externa.
    // No se invocan funciones exportadas ni se ejecutan servicios del motor.
    const exports = await import(pathToFileURL(resolve(root, source.file)).href)
    const directExports = new Set(
      source.bindings.filter((b) => b.exported).map((b) => b.symbol)
    )
    const indirectExports = Object.keys(exports).filter(
      (name) => !directExports.has(name)
    )
    if (indirectExports.length)
      gaps.push({
        file: source.file,
        reason:
          "Exports indirectos o funciones declaradas sin evaluación efectiva",
        symbols: indirectExports,
      })
    let leaves = 0
    for (const binding of source.bindings.filter(
      (b) => b.exported && !b.function
    )) {
      const value = exports[binding.symbol]
      for (const leaf of flatten(value)) {
        if (
          !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$|^Infinity$|^-Infinity$/i.test(
            leaf.value
          )
        )
          continue
        const path = JSON.stringify(leaf.path)
        const item = baseItem(
          source.file,
          binding.symbol,
          path,
          "Parameter",
          `${binding.symbol}${leaf.path.map((p) => `[${JSON.stringify(p)}]`).join("")}`,
          binding.source,
          "effective"
        )
        Object.assign(item, dimensions(binding.symbol, leaf.path), {
          value: leaf.value,
          applicability: "datos evaluados; selección por motor pendiente",
          resolution: "module-evaluation",
        })
        item.id = idFor(item.id, item.value)
        item.relations.itemIds = source.items
          .filter(
            (s) =>
              s.symbol === binding.symbol &&
              s.source.start >= binding.source.start &&
              s.source.end <= binding.source.end
          )
          .slice(0, 1)
          .map((s) => s.id)
        items.push(item)
        leaves++
      }
      if (binding.symbol === "CATALOGO_DEDUCCIONES_AUTONOMICAS_2025") {
        for (const [territory, entry] of Object.entries(value.valor)) {
          for (const deduction of entry.deducciones) {
            const references = executor.strings.filter(
              (s) => s.value === deduction.codigo
            )
            catalog.push({
              code: deduction.codigo,
              name: deduction.nombre,
              territory,
              year: 2025,
              declaredState: deduction.estado,
              execution: references.length
                ? "referencia literal en ejecutor; alcanzabilidad pendiente"
                : "sin referencia literal; comprobar despacho genérico/manual",
              executorSymbols: [...new Set(references.map((s) => s.symbol))],
              review: "pending",
              metadata: deduction,
            })
          }
        }
      }
    }
    modules.push({
      file: source.file,
      sha256: source.sha256,
      effectiveNumericLeaves: leaves,
    })
  }
  const selectorFile = "lib/dominio/irpf/comunidades/comunidad-autonoma.ts"
  const selectorSource = extracted.find((s) => s.file === selectorFile)
  const selector = await import(pathToFileURL(resolve(root, selectorFile)).href)
  const territories = [
    "simulada-estatal",
    "andalucia",
    "aragon",
    "asturias",
    "illes-balears",
    "canarias",
    "cantabria",
    "castilla-la-mancha",
    "castilla-y-leon",
    "catalunya",
    "extremadura",
    "galicia",
    "madrid",
    "murcia",
    "la-rioja",
    "comunitat-valenciana",
    "ceuta",
    "melilla",
  ]
  const coverage = []
  const forales = ["navarra", "pais-vasco", "alava", "bizkaia", "gipuzkoa"].map(
    (territory) => {
      const references = extracted.flatMap((s) =>
        s.strings
          .filter((v) => v.value === territory)
          .map((v) => ({ file: s.file, symbol: v.symbol, start: v.start }))
      )
      return {
        territory,
        status: references.length
          ? "pending"
          : "no-modelado-en-las-tablas-inventariadas",
        references,
        limitation:
          "No se interpreta la ausencia como rechazo controlado en runtime; fuera del contrato tipado del selector.",
      }
    }
  )
  const binding = selectorSource.bindings.find(
    (b) => b.symbol === "obtenerParametrosComunidadAutonoma"
  )
  for (let year = 2012; year <= 2026; year++)
    for (const territory of territories)
      for (const scenario of scenarios(year, territory)) {
        const selected = selector.obtenerParametrosComunidadAutonoma({
          anio: year,
          comunidadAutonoma: territory,
          baseLiquidableGeneral:
            scenario.base === null ? undefined : new Decimal(scenario.base),
          fechaFallecimiento:
            scenario.death === null ? undefined : new Date(scenario.death),
        })
        coverage.push({
          year,
          territory,
          result: selected._tag,
          reason: selected.motivo ?? null,
          scenario: scenario.name,
          deductions:
            selected.deduccionesAutonomicasSoportadas?.map((d) => d.codigo) ??
            [],
          status: "pending",
        })
        if (selected._tag !== "ParametrosComunidadAutonoma") continue
        for (const leaf of flatten({
          escalaEstatalGeneral: selected.escalaEstatalGeneral,
          escalaAutonomica: selected.escalaAutonomica.tramos,
          minimosAutonomicos: selected.minimosAutonomicos,
        })) {
          const path = JSON.stringify([
            String(year),
            territory,
            scenario.name,
            ...leaf.path,
          ])
          const item = baseItem(
            selectorFile,
            binding.symbol,
            path,
            "Parameter",
            path,
            binding.source,
            "selected"
          )
          Object.assign(item, {
            value: leaf.value,
            years: [year],
            territories: [territory],
            regimes: ["comun"],
            unit:
              leaf.path[0] === "minimosAutonomicos" || leaf.path.at(-1) === "0"
                ? "EUR (anual)"
                : "proporción por uno",
            applicability: `Sondeo: ${scenario.name}; otras condiciones pendientes`,
            resolution: "selector-probe",
          })
          item.id = idFor(item.id, item.value)
          items.push(item)
        }
      }
  const pythonPath = "Calculo_Salario_IRPF.py"
  const python = spawnSync(
    "python3",
    [`${root}/scripts/procedencia/inventario-python.py`, pythonPath],
    { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
  )
  if (python.status !== 0) throw new Error(python.stderr || "Falló AST Python")
  const legacy = JSON.parse(python.stdout)
  for (const entry of legacy.items) {
    const item = baseItem(
      pythonPath,
      entry.symbol,
      entry.path,
      entry.kind,
      entry.expression,
      {
        file: pythonPath,
        sha256: legacy.sha256,
        line: entry.line,
        column: entry.column,
        endLine: entry.endLine,
        endColumn: entry.endColumn,
        offsetEncoding: "utf8-column",
      }
    )
    items.push(item)
  }
  for (const source of extracted) {
    const unresolved = source.bindings.filter(
      (b) => b.function || !source.file.includes("/normativa/datos/")
    )
    if (unresolved.length)
      gaps.push({
        file: source.file,
        reason:
          "Funciones y bindings no evaluados: requieren entradas, selección temporal y análisis dimensional",
        symbols: unresolved.map((b) => b.symbol),
      })
  }
  validate(items, [
    ...extracted.filter((s) => s.items.length).map((s) => s.file),
    pythonPath,
  ])
  items.sort((a, b) => a.id.localeCompare(b.id, "en"))
  const write = (name, value) =>
    writeFileSync(`${output}/${name}`, JSON.stringify(value) + "\n")
  write("inventario-bindings.json", bindingGraph(root, paths))
  const pages = [],
    index = []
  for (let start = 0; start < items.length; start += 200) {
    const page = items.slice(start, start + 200),
      name = `inventario-pagina-${String(start / 200).padStart(4, "0")}.json`
    write(name, page)
    pages.push({
      file: name,
      count: page.length,
      sha256: hash(readFileSync(`${output}/${name}`)),
    })
    index.push(
      ...page.map((item) => ({
        id: item.id,
        page: name,
      }))
    )
  }
  const summary = {
    version: 2,
    status: "pending",
    identity:
      "Ocurrencias versionadas por fuente y valor efectivo; no IDs permanentes de conceptos fiscales",
    dimensionStatus:
      "Inferencia técnica por nombre/ruta; no aceptación de unidades ni vigencia",
    generationInputs: [
      ...paths.map((p) => relative(root, p)),
      pythonPath,
      "package.json",
      "bun.lock",
      "docs/procedencia/inventario-schema.json",
      ...filesUnder(`${root}/scripts/procedencia`)
        .filter((p) => /inventario.*\.(mjs|py)$/.test(p))
        .map((p) => relative(root, p)),
    ]
      .sort()
      .map((file) => ({
        file,
        sha256: hash(readFileSync(resolve(root, file))),
      })),
    sourceScope:
      "lib/**/*.ts(x) excepto lib/procedencia; Calculo_Salario_IRPF.py",
    counts: {
      filesTs: extracted.length,
      filesPython: 1,
      syntactic: items.filter((i) => i.layer === "syntactic").length,
      effective: items.filter((i) => i.layer === "effective").length,
      selected: items.filter((i) => i.layer === "selected").length,
      pendingUnits: items.filter((i) => i.unit === "pending").length,
      catalog: catalog.length,
      audited: 0,
    },
    syntaxCoverage: extracted.map((s) => ({
      file: s.file,
      sha256: s.sha256,
      items: s.items.length,
      ...s.counts,
    })),
    modules,
    pages,
    interpretationGaps: [
      "No se acredita vigencia fiscal ni revisión independiente.",
      "Años del nombre y claves son dimensiones del dato; no prueba de selección del motor.",
      "Sin expansión automática a 2026 de escalas o mínimos 2025.",
      "Sin análisis de flujo interprocedimental, intervalos intranuales ni unidades derivadas.",
      "Python: cobertura AST; valores efectivos/herencias pendientes.",
      "No se extraen parámetros de prosa; texto fuera de contenedores/catalogo puede no persistir.",
    ],
    gaps,
  }
  const indexPages = []
  index.sort((a, b) => a.id.localeCompare(b.id, "en"))
  for (let start = 0; start < index.length; start += 500) {
    const name = `inventario-indice-${String(start / 500).padStart(4, "0")}.json`
    const entries = index.slice(start, start + 500)
    write(name, entries)
    indexPages.push({
      file: name,
      count: entries.length,
      sha256: hash(readFileSync(`${output}/${name}`)),
    })
  }
  write("inventario-cobertura.json", coverage)
  write("inventario-forales.json", forales)
  write("inventario.json", summary)
  write("inventario-indice.json", indexPages)
  write("inventario-deducciones.json", catalog)
  return summary
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)
) {
  const result = await generate()
  process.stdout.write(JSON.stringify(result.counts) + "\n")
}
