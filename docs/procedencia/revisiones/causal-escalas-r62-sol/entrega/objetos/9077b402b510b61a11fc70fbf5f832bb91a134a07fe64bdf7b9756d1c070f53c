import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { composeRetencionesR32 } from "./flujo-retenciones-r32.mjs"

const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const ts = require("typescript")
export const baseR34 = "d70af62d19291c83d0deb281c09df106ee4a3575"
const ret = "lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts"
const annual = "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts"
const line = "lib/dominio/explicacion/linea-calculo.ts"
const sha = (b) => createHash("sha256").update(b).digest("hex")
const primitiveNames = [
  "Decimal",
  "Match",
  "Effect",
  "Number",
  "Array",
  "Math",
  "Error",
  "undefined",
  "Infinity",
]
function closureFor(fragment, siteId) {
  return fragment.obligations.every((o) => {
    if (o.status === "satisfied") return true
    if (siteId !== "anual.pagos.retenciones") return false
    if (
      o.id === "field:CasoFiscalAnual.retencionesSoportadasCentimos" ||
      o.id === "output:" + siteId
    )
      return false
    if (o.id.startsWith("operation:")) {
      const node = fragment.program.find((n) => "operation:" + n.id === o.id)
      if (
        !node ||
        node.source.file === line ||
        node.source.file === annual ||
        node.source.file.includes("/dinero/")
      )
        return false
    }
    return true
  })
}
const children = (n) => {
  const a = []
  ts.forEachChild(n, (c) => {
    a.push(c)
  })
  return a
}
function walk(n) {
  return [n, ...children(n).flatMap(walk)]
}

/** IR finita: ninguna expresión TypeScript se ejecuta ni queda como terminal textual.
 * Las fuentes y funciones son exactamente las del contrato R32 más crearLineaCalculo.
 * Cambiar gramática o funciones requiere una versión/revisión nueva. */
export function composeRetencionesR34(root = process.cwd()) {
  const previous = composeRetencionesR32(root)
  const sources = [
    ...previous.sources,
    { file: line, sha256: sha(fs.readFileSync(path.join(root, line))) },
  ]
  const asts = new Map()
  for (const s of sources) {
    const b = fs.readFileSync(path.join(root, s.file))
    const pinned = execFileSync(
      "git",
      ["cat-file", "blob", `${baseR34}:${s.file}`],
      { maxBuffer: 8e6 }
    )
    if (!b.equals(pinned)) throw Error("Integridad de fuente: " + s.file)
    asts.set(
      s.file,
      ts.createSourceFile(s.file, b.toString(), ts.ScriptTarget.Latest, true)
    )
  }
  const ref = (n) => ({
    file: n.getSourceFile().fileName,
    start: n.getStart(),
    end: n.end,
    sha256: sources.find((s) => s.file === n.getSourceFile().fileName).sha256,
    offsetEncoding: "utf16",
  })
  const declarations = new Map()
  for (const [file, ast] of asts)
    for (const n of ast.statements) {
      // El anual aporta seis expresiones y tres bindings locales, no sus helpers
      // homónimos ni el compositor compartido. Nunca resolver por homonimia.
      if (file === annual) continue
      for (const d of ts.isVariableStatement(n)
        ? n.declarationList.declarations
        : ts.isFunctionDeclaration(n)
          ? [n]
          : []) {
        if (declarations.has(d.name.getText())) throw Error("Global ambiguo")
        declarations.set(d.name.getText(), { file, node: d })
      }
    }
  const program = [],
    globalBindings = [],
    pending = new Set(),
    compiled = new Map()
  function emit(n, op, args = [], data = {}) {
    const source = ref(n),
      id = `${source.file}:${source.start}:${source.end}:${op}`
    if (!compiled.has(id)) {
      const x = { id, op, args, data, source }
      compiled.set(id, x)
      program.push(x)
    }
    return id
  }
  function pattern(n) {
    if (ts.isIdentifier(n)) return { name: n.text }
    if (ts.isObjectBindingPattern(n))
      return {
        fields: n.elements.map((e) => ({
          key: e.propertyName?.getText() ?? e.name.getText(),
          binding: pattern(e.name),
        })),
      }
    throw Error("Binding no soportado: " + n.getText())
  }
  function lower(n, scope = new Set()) {
    if (!n) throw Error("Nodo ausente")
    if (
      ts.isParenthesizedExpression(n) ||
      ts.isAsExpression(n) ||
      ts.isSatisfiesExpression(n) ||
      ts.isNonNullExpression(n)
    )
      return lower(n.expression, scope)
    if (ts.isIdentifier(n)) {
      const name = n.text
      if (!scope.has(name) && !primitiveNames.includes(name)) pending.add(name)
      return emit(n, scope.has(name) ? "local" : "global", [], { name })
    }
    if (
      ts.isNumericLiteral(n) ||
      ts.isStringLiteral(n) ||
      ts.isNoSubstitutionTemplateLiteral(n)
    )
      return emit(n, "literal", [], {
        value: ts.isNumericLiteral(n) ? Number(n.text) : n.text,
      })
    if (
      [
        ts.SyntaxKind.TrueKeyword,
        ts.SyntaxKind.FalseKeyword,
        ts.SyntaxKind.NullKeyword,
      ].includes(n.kind)
    )
      return emit(n, "literal", [], {
        value:
          n.kind === ts.SyntaxKind.NullKeyword
            ? null
            : n.kind === ts.SyntaxKind.TrueKeyword,
      })
    if (ts.isRegularExpressionLiteral(n)) {
      const i = n.text.lastIndexOf("/")
      return emit(n, "regex", [], {
        pattern: n.text.slice(1, i),
        flags: n.text.slice(i + 1),
      })
    }
    if (
      ts.isArrowFunction(n) ||
      ts.isFunctionExpression(n) ||
      ts.isFunctionDeclaration(n)
    ) {
      const inner = new Set(scope),
        params = n.parameters.map((p) => ({
          binding: pattern(p.name),
          rest: !!p.dotDotDotToken,
          default: p.initializer ? lower(p.initializer, scope) : null,
        }))
      for (const p of n.parameters)
        for (const i of walk(p.name).filter(ts.isIdentifier)) inner.add(i.text)
      return emit(n, "function", [lower(n.body, inner)], { parameters: params })
    }
    if (ts.isBlock(n)) {
      const inner = new Set(scope)
      for (const st of n.statements)
        if (ts.isVariableStatement(st))
          for (const d of st.declarationList.declarations)
            for (const i of walk(d.name).filter(ts.isIdentifier))
              inner.add(i.text)
      return emit(
        n,
        "block",
        n.statements.map((s) => lower(s, inner))
      )
    }
    if (ts.isVariableStatement(n))
      return emit(
        n,
        "declarations",
        n.declarationList.declarations.map((d) =>
          emit(d, "bind", [lower(d.initializer, scope)], {
            binding: pattern(d.name),
          })
        )
      )
    if (ts.isReturnStatement(n))
      return emit(n, "return", n.expression ? [lower(n.expression, scope)] : [])
    if (ts.isThrowStatement(n))
      return emit(n, "throw", [lower(n.expression, scope)])
    if (ts.isExpressionStatement(n) || ts.isYieldExpression(n))
      return emit(n, "pass", [lower(n.expression, scope)])
    if (ts.isIfStatement(n))
      return emit(n, "if", [
        lower(n.expression, scope),
        lower(n.thenStatement, scope),
        ...(n.elseStatement ? [lower(n.elseStatement, scope)] : []),
      ])
    if (ts.isSwitchStatement(n))
      return emit(n, "switch", [
        lower(n.expression, scope),
        ...n.caseBlock.clauses.map((c) =>
          emit(
            c,
            "case",
            [
              ...(c.expression ? [lower(c.expression, scope)] : []),
              ...c.statements.map((s) => lower(s, scope)),
            ],
            { fallback: !c.expression }
          )
        ),
      ])
    if (ts.isConditionalExpression(n))
      return emit(
        n,
        "conditional",
        [n.condition, n.whenTrue, n.whenFalse].map((x) => lower(x, scope))
      )
    if (ts.isBinaryExpression(n))
      return emit(n, "binary", [lower(n.left, scope), lower(n.right, scope)], {
        operator: n.operatorToken.getText(),
      })
    if (ts.isPrefixUnaryExpression(n))
      return emit(n, "unary", [lower(n.operand, scope)], {
        operator: ts.tokenToString(n.operator),
      })
    if (ts.isPropertyAccessExpression(n))
      return emit(n, "get", [lower(n.expression, scope)], {
        key: n.name.text,
        optional: !!n.questionDotToken,
      })
    if (ts.isElementAccessExpression(n))
      return emit(
        n,
        "index",
        [lower(n.expression, scope), lower(n.argumentExpression, scope)],
        { optional: !!n.questionDotToken }
      )
    if (ts.isCallExpression(n) || ts.isNewExpression(n))
      return emit(n, ts.isNewExpression(n) ? "new" : "call", [
        lower(n.expression, scope),
        ...(n.arguments ?? []).map((a) => lower(a, scope)),
      ])
    if (ts.isSpreadElement(n) || ts.isSpreadAssignment(n))
      return emit(n, "spread", [lower(n.expression, scope)])
    if (ts.isArrayLiteralExpression(n))
      return emit(
        n,
        "array",
        n.elements.map((e) => lower(e, scope))
      )
    if (ts.isObjectLiteralExpression(n))
      return emit(
        n,
        "object",
        n.properties.map((p) => {
          if (ts.isSpreadAssignment(p)) return lower(p, scope)
          return emit(
            p,
            "property",
            [
              lower(
                ts.isShorthandPropertyAssignment(p) ? p.name : p.initializer,
                scope
              ),
            ],
            { key: ts.isStringLiteral(p.name) ? p.name.text : p.name.getText() }
          )
        })
      )
    if (ts.isTemplateExpression(n))
      return emit(
        n,
        "template",
        n.templateSpans.map((s) => lower(s.expression, scope)),
        {
          strings: [n.head.text, ...n.templateSpans.map((s) => s.literal.text)],
        }
      )
    throw Error(
      "Gramática finita no cubre " +
        ts.SyntaxKind[n.kind] +
        ": " +
        n.getText().slice(0, 100)
    )
  }
  for (const c of previous.contracts) pending.add(c.id.split(":").at(-1))
  pending.add("crearLineaCalculo")
  // El wrapper Effect.fn se representa por su generador; los yields conservan orden/error.
  while (pending.size) {
    const name = pending.values().next().value
    pending.delete(name)
    if (globalBindings.some((b) => b.name === name)) continue
    const d = declarations.get(name)
    if (!d) throw Error("Identificador global sin frontera: " + name)
    let n = d.node.initializer ?? d.node
    if (name === "calcularRetencionTrabajoAeatImpl")
      n = walk(n).find(ts.isFunctionExpression)
    globalBindings.push({ name, node: lower(n), source: ref(d.node) })
  }
  const fieldBindings = []
  for (const ast of asts.values())
    for (const i of ast.statements.filter(ts.isInterfaceDeclaration)) {
      if (
        ![
          "CasoRetencionTrabajo",
          "DescendienteRetencion",
          "AscendienteRetencion",
          "ContextoRetencionTrabajo",
        ].includes(i.name.text)
      )
        continue
      for (const p of i.members) {
        const property = p.name.getText(),
          id = i.name.text + "." + property
        const reads = program
          .filter(
            (n) =>
              (n.op === "get" || n.op === "property") && n.data.key === property
          )
          .map((n) => n.id)
        const monetaryDefaults = [
          "irregular1Centimos",
          "irregular2Centimos",
          "pensionCompensatoriaConyugeCentimos",
          "anualidadesAlimentosHijosCentimos",
        ]
        const flagDefaults = [
          "movilidadGeografica",
          "movilidadReducidaPerceptor",
          "residenciaCeutaMelilla",
          "rendimientosCeutaMelilla",
          "pagosViviendaHabitual",
        ]
        const defaultValue =
          property === "edad" && i.name.text === "CasoRetencionTrabajo"
            ? 40
            : monetaryDefaults.includes(property)
              ? 0
              : flagDefaults.includes(property)
                ? false
                : null
        const absence = [
          "cotizacionesCentimos",
          "contrato",
          "situacionLaboral",
        ].includes(property)
          ? "reject-before-success"
          : defaultValue !== null
            ? "explicit-default"
            : "no-default"
        fieldBindings.push({
          id,
          property,
          owner: i.name.text,
          optional: !!p.questionToken,
          unit: property.endsWith("Centimos")
            ? "centimos"
            : property === "edad"
              ? "years"
              : "discrete",
          defaultValue,
          absence,
          reads,
          source: ref(p),
        })
      }
    }
  const constantBindings = globalBindings
    .filter((b) => ["CERO", "CIEN"].includes(b.name))
    .map((b) => ({
      ...b,
      unit: b.name === "CERO" ? "EUR" : "percent-divisor",
      uses: program
        .filter((n) => n.op === "global" && n.data.name === b.name)
        .map((n) => n.id),
    }))
  const scaleFunction = previous.contracts.find((c) =>
    c.id.endsWith(":calcularCuotaRetencion")
  )
  const scaleInstances = scaleFunction.calls
    .filter((c) => c.target.endsWith(":calcularCuotaEscala"))
    .map((c, index) => ({
      id: "escala." + index,
      node: program.find(
        (n) =>
          n.op === "call" &&
          n.source.file === c.source.file &&
          n.source.start === c.source.start &&
          n.source.end === c.source.end
      ).id,
      branch: index < 3 ? "0<alimentos<base" : "otherwise",
      argumentIndex: 0,
      resultUnit: "EUR",
      selector:
        "version-defined-and-year<=2020-and-x>=60000:historical45;else:reverse-find-desde<=x-fallback0",
      source: c.source,
    }))
  const scaleCells = []
  for (const n of program.filter(
    (n) =>
      n.op === "property" &&
      ["desde", "cuota", "tipo"].includes(n.data.key) &&
      n.source.file === ret
  )) {
    const sourceNode = walk(asts.get(ret)).find(
      (x) => x.getStart() === n.source.start && x.end === n.source.end
    )
    if (
      !sourceNode ||
      !ts.isObjectLiteralExpression(sourceNode.parent) ||
      !ts.isArrayLiteralExpression(sourceNode.parent.parent)
    )
      continue
    scaleCells.push({
      id: n.id,
      row: sourceNode.parent.parent.elements.indexOf(sourceNode.parent),
      column: n.data.key,
      valueNode: n.args[0],
      unit: n.data.key === "tipo" ? "ratio" : "EUR",
      source: n.source,
    })
  }
  const outputBindings = previous.sites.map((s) => {
    const call = walk(asts.get(annual)).find(
      (n) => n.getStart() === s.source.start && n.end === s.source.end
    )
    const amount = call.arguments[0].properties.find(
      (p) => p.name.getText() === "importe"
    ).initializer
    const expression = lower(
      amount,
      new Set(["retencion", "caso", "pagosACuentaAplicadosCentimos"])
    )
    return {
      siteId: s.siteId,
      expression,
      previousPort: s.port,
      unit: s.unit,
      source: s.source,
      producer:
        s.siteId === "anual.pagos.retenciones"
          ? "caso.retencionesSoportadasCentimos"
          : s.siteId === "anual.pagos.cuenta"
            ? "caso.pagosACuentaCentimos+estimate.importeRetencionAnualCentimos??0"
            : {
                "A.base": "baseRetencionCentimos",
                "A.cuota": "cuotaRetencionCentimos",
                "A.tipo": "tipoRetencionPorcentaje",
                "A.anual": "importeRetencionAnualCentimos",
              }[s.port],
      conversion:
        s.unit === "percent"
          ? "Decimal-string-without-factor100"
          : "centimosAEuros",
      finalFunction: "crearLineaCalculo",
      finalProperty: "origen.decimal",
      finalOperation: "importe.toFixed()",
    }
  })
  const annualBindings = []
  for (const name of [
    "retencionTrabajoAeat",
    "retencionTrabajoAeatCentimos",
    "pagosACuentaAplicadosCentimos",
  ]) {
    const d = walk(asts.get(annual)).filter(
      (n) =>
        ts.isVariableDeclaration(n) &&
        n.name.getText() === name &&
        (name !== "retencionTrabajoAeat" ||
          ts.isConditionalExpression(n.initializer))
    )
    if (d.length !== 1) throw Error("Binding anual ambiguo " + name)
    annualBindings.push({
      name,
      node: lower(
        d[0].initializer,
        new Set([
          "caso",
          "contexto",
          "dependencias",
          "retencionTrabajoAeat",
          "retencionTrabajoAeatCentimos",
        ])
      ),
      source: ref(d[0]),
    })
  }
  for (const property of [
    "retencionesSoportadasCentimos",
    "pagosACuentaCentimos",
  ]) {
    const reads = program.filter(
      (n) =>
        n.op === "get" && n.data.key === property && n.source.file === annual
    )
    fieldBindings.push({
      id: "CasoFiscalAnual." + property,
      property,
      owner: "CasoFiscalAnual",
      optional: false,
      unit: "centimos",
      defaultValue: null,
      absence: "annual-admission-required",
      reads: reads.map((n) => n.id),
      source: reads[0].source,
    })
  }
  const collectionBindings = program
    .filter(
      (n) =>
        n.op === "call" &&
        ["reduce", "filter", "sort", "every", "find", "reverse"].includes(
          compiled.get(n.args[0])?.data.key
        )
    )
    .map((n) => {
      const target = compiled.get(n.args[0]),
        operation = target.data.key,
        callback = n.args[1] ?? null
      return {
        id: n.id,
        operation,
        receiver: target.args[0],
        callback,
        parameters: callback
          ? (compiled.get(callback).data.parameters ?? [])
          : [],
        seed: n.args[2] ?? null,
        cardinality:
          operation === "reduce"
            ? "one-per-element-empty-returns-seed"
            : operation === "filter"
              ? "zero-to-input-length"
              : operation === "sort" || operation === "reverse"
                ? "same-as-input"
                : operation === "every"
                  ? "boolean-empty-true-short-circuit"
                  : "zero-or-one-first-match",
        source: n.source,
      }
    })
  const tableBindings = globalBindings
    .filter(
      (b) =>
        b.name.startsWith("UMBRALES_RETENCION_") ||
        b.name === "VERSIONES_RETENCION"
    )
    .map((b) => ({
      ...b,
      kind:
        b.name === "VERSIONES_RETENCION"
          ? "version-records"
          : b.name.endsWith("POR_ANIO")
            ? "year-period-table-map"
            : "threshold-row-column-cells",
    }))
  const obligations = [
    ...fieldBindings.map((b) => ({
      id: "field:" + b.id,
      status: b.reads.length ? "satisfied" : "pending",
      reason: b.reads.length ? "property-operations" : "no-read",
    })),
    ...program.map((n) => ({
      id: "operation:" + n.id,
      status: "satisfied",
      reason: "finite-operator-with-explicit-operands",
    })),
    ...scaleCells.map((c) => ({
      id: "cell:" + c.id,
      status: "satisfied",
      reason: "row-column-unit-value",
    })),
    ...scaleInstances.map((i) => ({
      id: "instance:" + i.id,
      status: "satisfied",
      reason: "argument-result-selector",
    })),
    ...constantBindings.map((c) => ({
      id: "constant:" + c.name,
      status: "satisfied",
      reason: "declaration-new-decimal-literal-and-uses",
    })),
    ...collectionBindings.map((c) => ({
      id: "collection:" + c.id,
      status: "satisfied",
      reason: "receiver-element-index-callback-seed-cardinality",
    })),
    ...tableBindings.map((c) => ({
      id: "table:" + c.name,
      status: "satisfied",
      reason: "record-properties-explicit",
    })),
    ...outputBindings.map((c) => ({
      id: "output:" + c.siteId,
      status: "satisfied",
      reason: "producer-conversion-final-property",
    })),
  ]
  return {
    version: 1,
    kind: "retenciones-pagos-r34",
    base: baseR34,
    sources,
    program,
    globalBindings,
    annualBindings,
    fieldBindings,
    constantBindings,
    collectionBindings,
    tableBindings,
    scaleCells,
    scaleInstances,
    outputBindings,
    obligations,
    sites: previous.sites.map((s) => ({
      siteId: s.siteId,
      unit: s.unit,
      valueClosed: closureFor({ program, obligations }, s.siteId),
      selectionClosed: closureFor({ program, obligations }, s.siteId),
      siteClosed: false,
    })),
    admissionInterface: {
      contractId: "anual-publico-r32",
      status: "pending-review",
      injectedService: "open",
      annualObligations: previous.admissionInterface.annualObligations,
    },
    previousArtifact: {
      path: "docs/procedencia/implementaciones/flujo-retenciones-r32-sol/fragmento.json.gz",
      sha256: sha(
        fs.readFileSync(
          path.join(
            root,
            "docs/procedencia/implementaciones/flujo-retenciones-r32-sol/fragmento.json.gz"
          )
        )
      ),
    },
    completeRuleAcceptance: false,
    wiringAllowed: false,
  }
}

/** Compara correspondencias, no un digest autodeclarado. Acepta pendientes representables;
 * no permite anunciar cierres cuando falta una obligación, ni duplicar identidades. */
export function verifyRetencionesR34(candidate, root = process.cwd()) {
  const expected = composeRetencionesR34(root)
  for (const collection of [
    "program",
    "globalBindings",
    "annualBindings",
    "fieldBindings",
    "constantBindings",
    "collectionBindings",
    "tableBindings",
    "scaleCells",
    "scaleInstances",
    "outputBindings",
    "obligations",
    "sites",
  ]) {
    const key = [
      "globalBindings",
      "annualBindings",
      "constantBindings",
      "tableBindings",
    ].includes(collection)
      ? "name"
      : collection === "outputBindings" || collection === "sites"
        ? "siteId"
        : "id"
    const rows = candidate[collection]
    if (!Array.isArray(rows)) throw Error("Colección omitida: " + collection)
    const index = new Map(rows.map((r) => [r[key], r]))
    if (
      index.size !== rows.length ||
      index.size !== expected[collection].length
    )
      throw Error("Duplicado/omisión: " + collection)
    for (const row of expected[collection]) {
      const got = index.get(row[key])
      let wanted = row
      if (
        collection === "obligations" &&
        got?.status === "pending" &&
        String(got.reason) === got.reason
      )
        wanted = { ...row, status: "pending", reason: got.reason }
      if (collection === "sites") {
        const closed = closureFor(candidate, row.siteId)
        wanted = { ...row, valueClosed: closed, selectionClosed: closed }
      }
      if (JSON.stringify(got) !== JSON.stringify(wanted))
        throw Error(
          "Correspondencia incompatible: " + collection + ":" + row[key]
        )
    }
  }
  for (const key of [
    "version",
    "kind",
    "base",
    "sources",
    "admissionInterface",
    "previousArtifact",
    "completeRuleAcceptance",
    "wiringAllowed",
  ])
    if (JSON.stringify(candidate[key]) !== JSON.stringify(expected[key]))
      throw Error("Frontera incompatible: " + key)
  if (
    Object.keys(candidate).sort().join() !== Object.keys(expected).sort().join()
  )
    throw Error("Campos extra")
  return true
}
