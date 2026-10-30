import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const ts = require("typescript")
export const baseR36 = "50f9e949544e20d3e4e0bffc79b926d396267319"
const sha = (b) => createHash("sha256").update(b).digest("hex")
const primitiveNames = [
  "Decimal",
  "Effect",
  "Match",
  "Option",
  "EffectArray",
  "DateTime",
  "Schema",
  "Result",
  "Number",
  "String",
  "Object",
  "Array",
  "Math",
  "Set",
  "Map",
  "Date",
  "Error",
  "undefined",
  "Infinity",
]
const children = (n) => {
  const a = []
  ts.forEachChild(n, (c) => {
    a.push(c)
  })
  return a
}
const walk = (n) => [n, ...children(n).flatMap(walk)]
export const annual = "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts"
export const explicit = "lib/dominio/irpf/trabajo-anual/conexion.ts"
export const activity = "lib/dominio/irpf/actividades-economicas/calcular.ts"
export const work = "lib/dominio/irpf/trabajo-anual/calcular.ts"
export const line = "lib/dominio/explicacion/linea-calculo.ts"
export const sitesR36 = [
  "anual.trabajo.integro",
  "anual.trabajo.cotizacion",
  "anual.trabajo.previo-neto",
  "anual.trabajo.gastos",
  "anual.trabajo.neto",
  "anual.trabajo.reduccion",
  "anual.explicito.trabajo.integro",
  "anual.explicito.trabajo.gastos-a-e",
  "anual.explicito.trabajo.gasto-f",
  "anual.explicito.trabajo.art19",
  "anual.explicito.trabajo.art20",
  "anual.explicito.da61",
  "anual.explicito.retenciones",
  "anual.explicito.pagos",
  "anual.explicito.diferencial",
  "anual.inmobiliario.integro",
  "anual.inmobiliario.neto",
  "anual.ganancias.total",
  "anual.ganancias.exenta",
  "anual.explicito.actividad.etapa",
]
const externalNames = [
  "calcularDesgloseCotizacionesPerfilUniforme",
  "calcularDesgloseCotizacionesSocialesLegacy",
  "calcularCotizacionesSocialesLegacy",
  "obtenerParametrosComunidadAutonoma",
  "obtenerEscalaAutonomicaPublicada",
  "MINIMOS_ESTATALES_2025",
  "calcularCuotaPorEscala",
  "enlazarRastroAnualActual",
  "medirAuditoriaSync",
]
export function composeRentasR36(root = process.cwd()) {
  const sources = [],
    asts = new Map(),
    declarations = new Map(),
    imports = new Map()
  function load(file) {
    if (asts.has(file)) return asts.get(file)
    const b = fs.readFileSync(path.join(root, file))
    const pinned = execFileSync(
      "git",
      ["cat-file", "blob", baseR36 + ":" + file],
      { maxBuffer: 8e6 }
    )
    if (!b.equals(pinned)) throw Error("Fuente alterada " + file)
    sources.push({ file, sha256: sha(b) })
    const ast = ts.createSourceFile(
      file,
      b.toString(),
      ts.ScriptTarget.Latest,
      true
    )
    asts.set(file, ast)
    for (const st of ast.statements) {
      if (ts.isImportDeclaration(st)) {
        if (!ts.isStringLiteral(st.moduleSpecifier))
          throw Error("Import no literal")
        const spec = st.moduleSpecifier.text
        const clause = st.importClause
        if (!clause || clause.isTypeOnly) continue
        if (clause.namedBindings && !ts.isNamedImports(clause.namedBindings))
          throw Error("Import namespace fuera de gramática")
        const names =
          clause.namedBindings && ts.isNamedImports(clause.namedBindings)
            ? clause.namedBindings.elements
            : []
        for (const p of names)
          if (!p.isTypeOnly)
            imports.set(file + ":" + p.name.text, {
              spec,
              name: p.propertyName?.text ?? p.name.text,
            })
        if (clause.name)
          imports.set(file + ":" + clause.name.text, { spec, name: "default" })
      }
      for (const d of ts.isVariableStatement(st)
        ? st.declarationList.declarations
        : ts.isFunctionDeclaration(st)
          ? [st]
          : [])
        declarations.set(file + ":" + d.name.getText(), d)
    }
    return ast
  }
  function resolve(file, name) {
    if (externalNames.includes(name)) return "boundary:" + name
    load(file)
    const id = file + ":" + name
    if (declarations.has(id)) return id
    const imp = imports.get(id)
    if (!imp) throw Error("Global no resuelto " + id)
    if (imp.spec === "effect") return name
    if (imp.spec === "decimal.js") return "Decimal"
    if (!imp.spec.startsWith(".")) throw Error("Import opaco " + imp.spec)
    const target =
      path.posix.normalize(
        path.posix.join(path.posix.dirname(file), imp.spec)
      ) + ".ts"
    load(target)
    return resolve(target, imp.name)
  }
  const ref = (n) => ({
    file: n.getSourceFile().fileName,
    start: n.getStart(),
    end: n.end,
    sha256: sources.find((s) => s.file === n.getSourceFile().fileName).sha256,
    offsetEncoding: "utf16",
  })
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
    if (ts.isArrayBindingPattern(n))
      return {
        elements: n.elements.map((e) =>
          ts.isOmittedExpression(e)
            ? null
            : {
                binding: pattern(e.name),
                default: e.initializer ? lower(e.initializer) : null,
              }
        ),
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
      const name =
        scope.has(n.text) || primitiveNames.includes(n.text)
          ? n.text
          : resolve(n.getSourceFile().fileName, n.text)
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
          emit(
            d,
            "bind",
            [
              d.initializer
                ? lower(d.initializer, scope)
                : emit(d, "global", [], { name: "undefined" }),
            ],
            {
              binding: pattern(d.name),
            }
          )
        )
      )
    if (ts.isForOfStatement(n)) {
      if (!ts.isVariableDeclarationList(n.initializer))
        throw Error("Bucle sin declaración")
      const d = n.initializer.declarations[0]
      const inner = new Set(scope)
      for (const i of walk(d.name).filter(ts.isIdentifier)) inner.add(i.text)
      return emit(
        n,
        "forof",
        [lower(n.expression, scope), lower(n.statement, inner)],
        { binding: pattern(d.name) }
      )
    }
    if (
      ts.isBinaryExpression(n) &&
      n.operatorToken.kind === ts.SyntaxKind.EqualsToken
    )
      return emit(n, "assign", [lower(n.right, scope)], {
        name: n.left.getText(),
      })
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
              ...(ts.isCaseClause(c) ? [lower(c.expression, scope)] : []),
              ...c.statements.map((s) => lower(s, scope)),
            ],
            { fallback: ts.isDefaultClause(c) }
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
          if (
            !ts.isShorthandPropertyAssignment(p) &&
            !ts.isPropertyAssignment(p)
          )
            throw Error("Método de objeto fuera de gramática")
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

  const roots = {}
  for (const [file, names] of [
    [activity, ["calcularActividad2025"]],
    [work, ["calcularGastosTrabajo", "calcularDeduccionTrabajo"]],
    [explicit, ["liquidarIrpfAnualExplicito"]],
    [line, ["crearLineaCalculo"]],
  ]) {
    load(file)
    for (const name of names) {
      roots[name] = resolve(file, name)
      pending.add(roots[name])
    }
  }
  load(annual)
  const annualBindings = []
  for (const name of [
    "rendimientoIntegroTrabajo",
    "cotizacionesSociales",
    "rendimientoTrabajo",
    "rendimientoIntegroCapitalInmobiliario",
    "rendimientoCapitalInmobiliario",
    "gananciasPatrimoniales",
    "otrasRentasNoExentas",
    "reduccionRendimientosTrabajo",
  ]) {
    const matches = walk(asts.get(annual)).filter(
      (n) =>
        ts.isVariableDeclaration(n) &&
        n.name.getText() === name &&
        n.initializer &&
        (!["cotizacionesSociales"].includes(name) ||
          n.initializer.getText().startsWith("medirAuditoriaSync"))
    )
    if (matches.length !== 1) throw Error("Binding ambiguo " + name)
    annualBindings.push({
      name,
      node: lower(
        matches[0].initializer,
        new Set(["caso", "contexto", ...annualBindings.map((b) => b.name)])
      ),
      source: ref(matches[0]),
    })
  }
  const outputs = []
  for (const file of [annual, explicit])
    for (const n of walk(asts.get(file)).filter(ts.isCallExpression)) {
      if (n.expression.getText() !== "crearLineaCalculo") continue
      const p = n.arguments[0]
      const field = (k) =>
        p.properties.find((x) => x.name?.getText() === k)?.initializer
      const id = field("siteId")?.text
      if (!sitesR36.includes(id)) continue
      const amount = field("importe")
      outputs.push({
        siteId: id,
        producer: ref(amount),
        expression:
          file === annual
            ? lower(amount, new Set(annualBindings.map((b) => b.name)))
            : null,
        instance: ref(field("instancia")),
        unit: "EUR",
        transport: {
          function: roots.crearLineaCalculo,
          property: "origen.decimal",
          operation: "toFixed",
        },
        scope:
          file === annual
            ? "general-admission-required"
            : "explicit-2025-admission-required",
        valueClosed: false,
        selectionClosed: false,
        siteClosed: false,
        valueNode: null,
        entryPoint: null,
      })
    }
  const stages = walk(asts.get(activity))
    .filter((n) => ts.isCallExpression(n) && n.expression.getText() === "etapa")
    .map((n, index) => ({
      id: "etapa." + index,
      producer: "calcularActividad2025",
      property: "etapas[*].importe",
      call: ref(n),
      argument4: ref(n.arguments[3]),
      rule: ref(n.arguments[0]),
      instance: ref(n.arguments[1]),
      valueNode: null,
      unit: "EUR",
      cardinality:
        index < 2
          ? "activos.length"
          : index < 5
            ? ["ingresos.length", "gastos.length", "reta.length"][index - 2]
            : [12, 13].includes(index)
              ? "opcion=cliente-unico?1:0"
              : "1",
      annualReachable: index >= 2,
      outputSite: "anual.explicito.actividad.etapa",
      transport: [
        "etapa.valor.toFixed",
        "adaptarActividadGeneral.etapas",
        "map(e,instancia)",
        "new D(e.importe)",
        "crearLineaCalculo.origen.decimal",
      ],
    }))
  while (pending.size) {
    const name = pending.values().next().value
    pending.delete(name)
    if (
      globalBindings.some((b) => b.name === name) ||
      primitiveNames.includes(name)
    )
      continue
    if (name.startsWith("boundary:")) {
      globalBindings.push({ name, node: null, external: true })
      continue
    }
    const d = declarations.get(name)
    if (!d) throw Error("Declaración no encontrada " + name)
    let n = d.initializer ?? d
    if (name === roots.liquidarIrpfAnualExplicito)
      n = walk(n).find(ts.isFunctionExpression)
    globalBindings.push({
      name,
      node: lower(n),
      source: ref(d),
      external: false,
    })
  }
  for (const stage of stages)
    stage.valueNode =
      program.find(
        (n) =>
          n.source.file === activity &&
          n.source.start === stage.argument4.start &&
          n.source.end === stage.argument4.end
      )?.id ?? null
  const collections = program
    .filter(
      (n) =>
        n.op === "call" &&
        ["map", "reduce", "filter", "some", "every", "find"].includes(
          compiled.get(n.args[0])?.data.key
        )
    )
    .map((n) => ({
      id: n.id,
      operation: compiled.get(n.args[0]).data.key,
      receiver: compiled.get(n.args[0]).args[0],
      callback: n.args[1] ?? null,
      seed: n.args[2] ?? null,
      unit: "element-dependent",
      index: "callback argument 1 for map/filter; argument 2 for reduce",
      cardinality: "native-array-order-short-circuit",
    }))
  const monetaryFields = new Set([
    "base",
    "integro",
    "importe",
    "seguridadSocial",
    "derechosPasivos",
    "colegiosHuerfanos",
    "coste",
    "puestaMarcha",
    "residual",
    "acumulada",
    "iva",
    "ivaRecuperable",
    "netoAntesReducciones",
    "volumen2024",
    "salarioBrutoAnual",
    "cotizacionTrabajador",
    "rendimientoIntegro",
    "rendimientoNeto",
    "rendimientoPrevioNeto",
    "gastosDeducibles",
    "gananciaTotal",
    "gananciaExenta",
    "gananciaSujetaGeneral",
    "gananciaSujetaAhorro",
    "gastosAE",
    "netoArt19",
    "netoPrevioArt20",
    "generalesAplicados",
    "discapacidadAplicada",
    "importeEurosExactos",
    "retencionesEuros",
    "pagosFraccionadosEuros",
    "importeAplicable",
    "cuotaPosterior",
    "baseLiquidableGeneral",
    "cuotaIntegraGeneral",
    "cuotaLiquidaTotal",
    "cuotaTrasArt80",
    "netoReducidoServicios",
    "brutoServicios",
    "otrasRentasNoExentas",
    "general",
    "baseImponible",
    "rendimientoComputableTrabajoActividad",
    "deduccionLegal",
    "limiteAtribuible",
    "generalesTeoricos",
  ])
  const fieldUnit = (k) =>
    String(k).endsWith("Centimos")
      ? "centimos"
      : monetaryFields.has(k)
        ? "EUR"
        : ["coeficiente", "coeficienteHistorico", "porcentajeExento"].includes(
              k
            )
          ? "ratio"
          : ["ejercicio", "anio", "edad"].includes(k)
            ? "years"
            : String(k).startsWith("fecha")
              ? "civil-date"
              : [
                    "tipoMedioEstatalPorcentaje",
                    "tipoMedioAutonomicoPorcentaje",
                  ].includes(k)
                ? "percent"
                : "selector-or-metadata"
  for (const output of outputs) {
    output.valueNode =
      program.find(
        (n) =>
          n.source.file === output.producer.file &&
          n.source.start === output.producer.start &&
          n.source.end === output.producer.end
      )?.id ?? null
    output.entryPoint = output.scope.startsWith("explicit")
      ? roots.liquidarIrpfAnualExplicito
      : "annualBindings"
  }
  const selectors = program
    .filter((n) =>
      ["conditional", "if", "binary", "switch", "index"].includes(n.op)
    )
    .map((n) => ({
      id: n.id,
      operator: n.op,
      operands: n.args,
      producer: n.source,
      role:
        n.op === "index"
          ? "index"
          : n.op === "binary"
            ? n.data.operator
            : "branch",
      shortCircuit:
        ["if", "conditional"].includes(n.op) ||
        ["&&", "||", "??"].includes(n.data.operator),
    }))
  const terminals = {
    literals: program
      .filter((n) => ["literal", "regex"].includes(n.op))
      .map((n) => ({ node: n.id, value: n.data, source: n.source })),
    primitives: primitiveNames,
    publicInputs: [
      {
        entry: roots.calcularActividad2025,
        argument: 0,
        scope: "isolated-2025",
      },
      {
        entry: roots.calcularGastosTrabajo,
        argument: 0,
        scope: "isolated-work-contract",
      },
      {
        entry: roots.calcularDeduccionTrabajo,
        argument: 0,
        scope: "isolated-deduction-contract",
      },
      {
        entry: roots.liquidarIrpfAnualExplicito,
        argument: 0,
        scope: "Madrid-2025-explicit",
      },
      {
        entry: "annualBindings",
        arguments: ["caso", "contexto"],
        scope: "pre-admitted-general",
      },
    ],
  }
  const fields = program
    .filter((n) => ["get", "index", "property"].includes(n.op))
    .map((n) => ({
      id: n.id,
      property: n.data.key ?? "[evaluated index]",
      owner: n.args[0] ?? null,
      source: n.source,
      unit: fieldUnit(n.data.key),
    }))
  const boundaries = externalNames.map((name) => ({
    name: "boundary:" + name,
    owner:
      name.includes("Cotizacion") || name.includes("cotizacion")
        ? "SS"
        : name === "enlazarRastroAnualActual"
          ? "trace-enrichment"
          : name === "medirAuditoriaSync"
            ? "instrumentation"
            : "escalas-minimos",
    status: "requires-external-contract",
    admissionAvailable: false,
    properties:
      name.includes("Cotizacion") || name.includes("cotizacion")
        ? ["return.cotizacionTrabajador"]
        : name === "obtenerParametrosComunidadAutonoma"
          ? [
              "return.escalaEstatalGeneral",
              "return.escalaAutonomica.tramos",
              "return.minimosAutonomicos.contribuyente.general",
            ]
          : name === "MINIMOS_ESTATALES_2025"
            ? ["contribuyente.general"]
            : ["return"],
    calls: program
      .filter((n) => n.op === "global" && n.data.name === "boundary:" + name)
      .map((n) => n.id),
  }))
  return {
    version: 1,
    kind: "rentas-actividad-r36",
    base: baseR36,
    sources,
    software: [
      "scripts/procedencia/flujo-rentas-r36.mjs",
      "scripts/procedencia/flujo-rentas-r36-consumidor.mjs",
      "scripts/procedencia/flujo-rentas-r36-controles.mjs",
      "scripts/procedencia/flujo-rentas-r36-ensayos.mjs",
    ].map((file) => ({
      file,
      sha256: sha(fs.readFileSync(path.join(root, file))),
    })),
    roots,
    program,
    globalBindings,
    annualBindings,
    outputs,
    stages,
    collections,
    fields,
    selectors,
    terminals,
    boundaries,
    obligations: outputs.map((o) => ({
      id: o.siteId,
      value: "candidate-finite-program",
      selection: "candidate-finite-program",
      admission: "pending-common-contract",
      review: "pending-independent",
    })),
    completeRuleAcceptance: false,
    wiringAllowed: false,
  }
}
export function verifyRentasR36(candidate, root = process.cwd()) {
  const wanted = composeRentasR36(root)
  if (JSON.stringify(candidate) !== JSON.stringify(wanted))
    throw Error("Correspondencia finita alterada")
  return true
}
