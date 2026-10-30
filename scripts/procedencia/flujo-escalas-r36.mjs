import fs from "node:fs"
import path from "node:path"
import { gunzipSync } from "node:zlib"
import { createRequire } from "node:module"
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const ts = require("typescript")
export const baseR36 = "50f9e949544e20d3e4e0bffc79b926d396267319"
const annual = "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts",
  explicit = "lib/dominio/irpf/trabajo-anual/conexion.ts"
const sha = (b) => createHash("sha256").update(b).digest("hex")
const primitiveNames = [
  "Decimal",
  "Match",
  "Option",
  "EffectArray",
  "Effect",
  "Number",
  "String",
  "Array",
  "Math",
  "Error",
  "Set",
  "Map",
  "Date",
  "undefined",
  "Infinity",
  "clock",
  "DateTime"
]
const external = new Map([
  ["sumarRendimientosTrabajo", ["return:EUR"]],
  [
    "calcularRendimientoNetoTrabajo",
    ["rendimientoIntegro:EUR", "rendimientoNeto:EUR", "rendimientoPrevioNeto:EUR", "gastosDeducibles:EUR", "cotizacionTrabajador:EUR"]
  ],
  ["sumarRendimientosCapitalInmobiliario", ["return:EUR"]],
  [
    "calcularRendimientoNetoCapitalInmobiliarioSimplificado",
    ["rendimientoNeto:EUR"]
  ],
  [
    "calcularGananciasPatrimonialesPorTransmision",
    ["gananciaSujetaGeneral:EUR", "gananciaSujetaAhorro:EUR", "gananciaTotal:EUR", "gananciaExenta:EUR"]
  ],
  ["calcularReduccionTrabajoConOtrasRentas", ["return:EUR"]],
  ["calcularDesgloseCotizacionesPerfilUniforme", ["cotizacionTrabajador:EUR", "cotizacionEmpresarial:EUR", "meiEmpresarial:EUR", "meiTrabajador:EUR", "solidaridadEmpresarial:EUR", "solidaridadTrabajador:EUR"]],
  ["calcularDesgloseCotizacionesSocialesLegacy", ["cotizacionTrabajador:EUR", "cotizacionEmpresarial:EUR", "meiEmpresarial:EUR", "meiTrabajador:EUR", "solidaridadEmpresarial:EUR", "solidaridadTrabajador:EUR"]],
  [
    "adaptarTrabajoAnual",
    [
      "estado:discrete",
      "rendimientoAntesArt20:EUR-string",
      "argumentoArt20:EUR-string",
      "gastos.integro:EUR-string",
      "motivo:string"
    ]
  ],
  [
    "adaptarActividadGeneral",
    ["estado:discrete", "aporte.importeEurosExactos:EUR-string", "aporte.retencionesEuros:EUR-string", "aporte.pagosFraccionadosEuros:EUR-string", "motivos[].motivo:string"]
  ],
  [
    "calcularDeduccionTrabajo",
    [
      "estado:discrete",
      "importeAplicable:EUR-string",
      "cuotaPosterior:EUR-string",
      "motivo:string"
    ]
  ],
  ["validarDerechosMinimos", ["return:validated-rights-pending-review"]],
  ["validarRentasAnualesDerechos", ["return:admission-pending-review"]]
])
// Unión de propiedades consumidas: outputs no exige que ambas variantes
// coexistan. Las condiciones fijan el contrato por estado del productor real.
const resultVariants = new Map([
  ["adaptarTrabajoAnual", [
    { when: { property: "estado", equals: "aporte-disponible" }, outputs: ["estado:discrete", "rendimientoAntesArt20:EUR-string", "argumentoArt20:EUR-string", "gastos.integro:EUR-string"] },
    { when: { property: "estado", equals: "no-soportado" }, outputs: ["estado:discrete", "motivo:string"] }
  ]],
  ["adaptarActividadGeneral", [
    { when: { property: "estado", equals: "aporte-disponible" }, outputs: ["estado:discrete", "aporte.importeEurosExactos:EUR-string", "aporte.retencionesEuros:EUR-string", "aporte.pagosFraccionadosEuros:EUR-string"] },
    { when: { property: "estado", equals: "no-soportado" }, outputs: ["estado:discrete", "motivos[].motivo:string"] }
  ]],
  ["calcularDeduccionTrabajo", [
    { when: { property: "estado", equals: "calculado" }, outputs: ["estado:discrete", "importeAplicable:EUR-string", "cuotaPosterior:EUR-string"] },
    { when: { property: "estado", equals: "no-soportado" }, outputs: ["estado:discrete", "motivo:string"] }
  ]]
])

function boundaryFunction(declaration) {
  const fn = declaration.initializer ?? declaration
  if (ts.isFunctionDeclaration(fn) || ts.isFunctionExpression(fn) || ts.isArrowFunction(fn)) return fn
  // Effect.fn("nombre")(function* (...)): no confundir la fábrica o una
  // función anidada del cuerpo con la firma de la frontera.
  if (ts.isCallExpression(fn) && ts.isCallExpression(fn.expression) &&
      fn.expression.expression.getText() === "Effect.fn" && fn.arguments.length === 1 &&
      ts.isFunctionExpression(fn.arguments[0])) return fn.arguments[0]
  throw Error("Firma de frontera no soportada: " + declaration.name.getText())
}
function children(n) {
  const result = []
  ts.forEachChild(n, (c) => {
    result.push(c)
  })
  return result
}
function walk(n) {
  return [n, ...children(n).flatMap(walk)]
}
/** Subconjunto finito del software fijado. No ejecuta fuentes TS. */
export function composeEscalasR36(root = process.cwd()) {
  const modules = new Map(),
    declarations = new Map(),
    sources = []
  function moduleAt(file) {
    if (modules.has(file)) return modules.get(file)
    const bytes = fs.readFileSync(path.join(root, file))
    const pinned = execFileSync(
      "git",
      ["cat-file", "blob", baseR36 + ":" + file],
      { maxBuffer: 20e6 }
    )
    if (!bytes.equals(pinned)) throw Error("Fuente distinta: " + file)
    const ast = ts.createSourceFile(
        file,
        bytes.toString(),
        ts.ScriptTarget.Latest,
        true
      ),
      imports = new Map()
    const mod = { ast, imports }
    modules.set(file, mod)
    sources.push({ file, sha256: sha(bytes) })
    for (const st of ast.statements) {
      if (ts.isImportDeclaration(st)) {
        if (!ts.isStringLiteral(st.moduleSpecifier))
          throw Error("Import no literal")
        const spec = st.moduleSpecifier.text,
          cl = st.importClause
        if (cl?.name)
          imports.set(cl.name.text, spec === "decimal.js" ? "Decimal" : null)
        if (cl?.namedBindings && ts.isNamedImports(cl.namedBindings))
          for (const e of cl.namedBindings.elements) {
            const sym = (e.propertyName ?? e.name).text
            imports.set(
              e.name.text,
              spec === "effect"
                ? sym === "Array"
                  ? "EffectArray"
                  : sym
                : path.posix.normalize(
                    path.posix.join(path.posix.dirname(file), spec + ".ts")
                  ) +
                    "#" +
                    sym
            )
          }
      }
      for (const d of ts.isVariableStatement(st)
        ? st.declarationList.declarations
        : ts.isFunctionDeclaration(st)
          ? [st]
          : [])
        if (d.name) declarations.set(file + "#" + d.name.getText(), d)
    }
    return mod
  }
  function resolveIdentifier(n) {
    if (n.text === "tiempoAuditoriaMs") return "clock"
    const file = n.getSourceFile().fileName,
      mod = moduleAt(file)
    if (mod.imports.has(n.text)) return mod.imports.get(n.text)
    if (declarations.has(file + "#" + n.text)) return file + "#" + n.text
    if (primitiveNames.includes(n.text)) return n.text
    throw Error("Identificador no resuelto " + file + ":" + n.text)
  }
  const ref = (n) => ({
    file: n.getSourceFile().fileName,
    start: n.getStart(),
    end: n.end,
    sha256: sources.find((s) => s.file === n.getSourceFile().fileName).sha256,
    offsetEncoding: "utf16"
  })
  const program = [],
    globalBindings = [],
    pending = new Set(),
    compiled = new Map(),
    roots = new Map(),
    outputBindings = []
  for (const file of [annual, explicit]) {
    const ast = moduleAt(file).ast
    const decl = declarations.get(
      file +
        "#" +
        (file === annual
          ? "liquidarTrabajoIndividualSimple"
          : "liquidarIrpfAnualExplicito")
    )
    const gen = walk(decl.initializer).find(ts.isFunctionExpression)
    const outputs = []
    for (const call of walk(gen).filter(ts.isCallExpression)) {
      if (call.expression.getText() !== "crearLineaCalculo") continue
      const props = call.arguments[0].properties
      const id = props.find((p) => p.name?.getText() === "siteId")?.initializer
        .text
      if (!siteIds.includes(id)) continue
      let output = call
      for (let p = call.parent; p && p !== gen; p = p.parent)
        if (
          ts.isCallExpression(p) &&
          ts.isPropertyAccessExpression(p.expression) &&
          p.expression.name.text === "map"
        ) {
          output = p
          break
        }
      outputs.push(output)
      outputBindings.push({
        siteId: id,
        valueNode:null,lineNode:null,
        source: ref(call),
        amount: ref(
          props.find((p) => p.name.getText() === "importe").initializer
        ),
        unit: "EUR",
        instance: output === call ? "singleton-0" : "callback-index",
        condition:
          file === annual
            ? "annual-admission-required"
            : "explicit-admission-required",
        finalProperty: "origen.decimal"
      })
    }
    roots.set(gen.body, outputs)
    pending.add(file + "#" + decl.name.getText())
  }
  function emit(n, op, args = [], data = {}) {
    const source = ref(n),
      id = `${source.file}:${source.start}:${source.end}:${op}${data.output ? ":output" : ""}`
    if (!compiled.has(id)) {
      const x = { id, op, args, data, source }
      compiled.set(id, x)
      program.push(x)
    }
    return id
  }
  function pattern(n) {
    if (ts.isIdentifier(n)) return { name: n.text }
    if (ts.isArrayBindingPattern(n))
      return {
        elements: n.elements.map((e) => {
          if (!ts.isBindingElement(e))
            throw Error("Elemento omitido no soportado")
          return pattern(e.name)
        })
      }
    if (ts.isObjectBindingPattern(n))
      return {
        fields: n.elements.map((e) => ({
          key: e.propertyName?.getText() ?? e.name.getText(),
          rest: !!e.dotDotDotToken,
          binding: pattern(e.name),
          default: e.initializer
            ? lower(
                e.initializer,
                new Set(
                  n.elements.flatMap((b) =>
                    walk(b.name)
                      .filter(ts.isIdentifier)
                      .map((i) => i.text)
                  )
                )
              )
            : null
        }))
      }
    throw Error("Binding no soportado: " + n.getText())
  }
  function lower(n, scope = new Set()) {
    if (
      ts.isNewExpression(n) &&
      n.expression.getText() === "DerechosMinimosNoSoportados"
    )
      return emit(
        n,
        "failurePayload",
        n.arguments.map((a) => lower(a, scope)),
        { tag: "DerechosMinimosNoSoportados" }
      )
    if (
      ts.isCallExpression(n) &&
      ts.isCallExpression(n.expression) &&
      n.expression.expression.getText() === "Schema.decodeUnknownResult"
    )
      return emit(
        n,
        "boundaryCall",
        n.arguments.map((x) => lower(x, scope)),
        {
          target: "explicit.decode",
          outputs: ["success:validated-explicit-input"],
          review: "pending-independent"
        }
      )
    if (ts.isCallExpression(n) && n.expression.getText() === "Result.isFailure")
      return emit(
        n,
        "isFailure",
        n.arguments.map((x) => lower(x, scope))
      )
    if (
      ts.isCallExpression(n) &&
      ts.isPropertyAccessExpression(n.expression) &&
      n.expression.name.text === "pipe" &&
      n.arguments.every(
        (a) =>
          ts.isCallExpression(a) && a.expression.getText() === "Effect.mapError"
      )
    )
      return emit(n, "mapError", [lower(n.expression.expression, scope)], {
        status: "admission-required"
      })
    if (
      ts.isExpressionStatement(n) &&
      /^(registrarTiempoAgregadoAuditoria|pasos.push)\(/.test(
        n.expression.getText()
      )
    )
      return emit(n, "noop")
    if (
      ts.isCallExpression(n) &&
      n.expression.getText() === "medirAuditoriaSync"
    )
      return emit(n, "invoke", [lower(n.arguments[1], scope)])
    if (
      ts.isPropertyAccessExpression(n) &&
      n.getText() === "dependencias.parametrosNormativos.minimosEstatales2025"
    ) {
      const name =
        "lib/dominio/normativa/datos/minimos-autonomicos-2025.ts#MINIMOS_ESTATALES_2025"
      pending.add(name)
      return emit(n, "global", [], { name })
    }
    if (
      ts.isCallExpression(n) &&
      n.expression.getText() === "dependencias.retencionTrabajoAeat.calcular"
    )
      return emit(
        n,
        "boundaryCall",
        n.arguments.map((x) => lower(x, scope)),
        {
          target: "retencion.calcular",
          outputs: ["importeRetencionAnualCentimos"],
          unit: "centimos"
        }
      )
    if (!n) throw Error("Nodo ausente")
    if (
      ts.isParenthesizedExpression(n) ||
      ts.isAsExpression(n) ||
      ts.isSatisfiesExpression(n) ||
      ts.isNonNullExpression(n)
    )
      return lower(n.expression, scope)
    if (ts.isIdentifier(n)) {
      const name = scope.has(n.text) ? n.text : resolveIdentifier(n)
      if (!scope.has(n.text) && !primitiveNames.includes(name))
        pending.add(name)
      return emit(n, scope.has(n.text) ? "local" : "global", [], { name })
    }
    if (
      ts.isNumericLiteral(n) ||
      ts.isStringLiteral(n) ||
      ts.isNoSubstitutionTemplateLiteral(n)
    )
      return emit(n, "literal", [], {
        value: ts.isNumericLiteral(n) ? Number(n.text) : n.text
      })
    if (
      [
        ts.SyntaxKind.TrueKeyword,
        ts.SyntaxKind.FalseKeyword,
        ts.SyntaxKind.NullKeyword
      ].includes(n.kind)
    )
      return emit(n, "literal", [], {
        value:
          n.kind === ts.SyntaxKind.NullKeyword
            ? null
            : n.kind === ts.SyntaxKind.TrueKeyword
      })
    if (ts.isRegularExpressionLiteral(n)) {
      const i = n.text.lastIndexOf("/")
      return emit(n, "regex", [], {
        pattern: n.text.slice(1, i),
        flags: n.text.slice(i + 1)
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
          default: p.initializer ? lower(p.initializer, inner) : null
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
      let statements = [...n.statements]
      const output = roots.get(n)
      if (output)
        statements = statements.slice(
          0,
          statements.findIndex(
            (st) =>
              ts.isVariableStatement(st) &&
              st.declarationList.declarations.some((d) =>
                ["resultado", "diferencial"].includes(d.name.getText())
              )
          )
        )
      const ids = statements.map((s) => lower(s, inner))
      if (output)
        ids.push(
          emit(
            n,
            "return",
            [
              emit(
                n,
                "array",
                output.map((s) => lower(s, inner)),
                { output: true }
              )
            ],
            { output: true }
          )
        )
      return emit(n, "block", ids)
    }
    if (ts.isVariableStatement(n))
      return emit(
        n,
        "declarations",
        n.declarationList.declarations.map((d) =>
          emit(d, "bind", [lower(d.initializer, scope)], {
            binding: pattern(d.name)
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
        ...(n.elseStatement ? [lower(n.elseStatement, scope)] : [])
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
              ...c.statements.map((s) => lower(s, scope))
            ],
            { fallback: !ts.isCaseClause(c) }
          )
        )
      ])
    if (ts.isConditionalExpression(n))
      return emit(
        n,
        "conditional",
        [n.condition, n.whenTrue, n.whenFalse].map((x) => lower(x, scope))
      )
    if (ts.isForOfStatement(n)) {
      if (!ts.isVariableDeclarationList(n.initializer))
        throw Error("For sin declaración")
      const name = n.initializer.declarations[0].name
      const inner = new Set(scope)
      for (const i of walk(name).filter(ts.isIdentifier)) inner.add(i.text)
      return emit(
        n,
        "forOf",
        [lower(n.expression, scope), lower(n.statement, inner)],
        { binding: pattern(name) }
      )
    }
    if (
      ts.isBinaryExpression(n) &&
      n.operatorToken.kind === ts.SyntaxKind.EqualsToken
    )
      return emit(n, "assign", [lower(n.right, scope)], {
        name: n.left.getText()
      })
    if (ts.isBinaryExpression(n))
      return emit(n, "binary", [lower(n.left, scope), lower(n.right, scope)], {
        operator: n.operatorToken.getText()
      })
    if (ts.isPrefixUnaryExpression(n))
      return emit(n, "unary", [lower(n.operand, scope)], {
        operator: ts.tokenToString(n.operator)
      })
    if (ts.isPropertyAccessExpression(n))
      return emit(n, "get", [lower(n.expression, scope)], {
        key: n.name.text,
        optional: !!n.questionDotToken
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
        ...(n.arguments ?? []).map((a) => lower(a, scope))
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
        n.properties
          .filter(
            (p) => p.name?.getText() !== "deduccionesAutonomicasSoportadas"
          )
          .map((p) => {
            if (ts.isSpreadAssignment(p)) return lower(p, scope)
            return emit(
              p,
              "property",
              [
                lower(
                  ts.isShorthandPropertyAssignment(p)
                    ? p.name
                    : ts.isPropertyAssignment(p)
                      ? p.initializer
                      : (() => {
                          throw Error("Propiedad no soportada")
                        })(),
                  scope
                )
              ],
              {
                key: ts.isStringLiteral(p.name) ? p.name.text : p.name.getText()
              }
            )
          })
      )
    if (ts.isTemplateExpression(n))
      return emit(
        n,
        "template",
        n.templateSpans.map((s) => lower(s.expression, scope)),
        {
          strings: [n.head.text, ...n.templateSpans.map((s) => s.literal.text)]
        }
      )
    throw Error(
      "Gramática finita no cubre " +
        ts.SyntaxKind[n.kind] +
        ": " +
        n.getText().slice(0, 100)
    )
  }

  while (pending.size) {
    const name = pending.values().next().value
    pending.delete(name)
    if (globalBindings.some((b) => b.name === name)) continue
    const [file, symbol] = name.split("#")
    moduleAt(file)
    const d = declarations.get(name)
    if (!d) throw Error("Declaración ausente " + name)
    let n = d.initializer ?? d
    if (external.has(symbol)) {
      globalBindings.push({
        name,
        node: emit(d, "boundary", [], {
          target: name,
          outputs: external.get(symbol),
          review: "pending-independent"
        }),
        source: ref(d)
      })
      continue
    }
    if (
      ([annual, explicit].includes(file) &&
        [
          "liquidarTrabajoIndividualSimple",
          "liquidarIrpfAnualExplicito"
        ].includes(symbol)) ||
      symbol === "calcularDerechosMinimos"
    )
      n = walk(n).find(ts.isFunctionExpression)
    globalBindings.push({ name, node: lower(n), source: ref(d) })
  }

  const historicalRoutesPath =
    "docs/procedencia/editorial/flujo-escalas-r23-sol/rutas-datos.json.gz"
  const routeBytes = fs.readFileSync(path.join(root, historicalRoutesPath))
  const routes = JSON.parse(gunzipSync(routeBytes).toString())
  const dataRoutes = {
    path: historicalRoutesPath,
    sha256: sha(routeBytes),
    records: routes.records,
    authority: "technical-source-paths-only; no-admission-or-nominal-promotion"
  }
  const propertyBindings = program
    .filter((n) => ["get", "index"].includes(n.op))
    .map((n) => ({
      id: n.id,
      receiver: n.args[0],
      property: n.op === "get" ? n.data.key : null,
      index: n.op === "index" ? n.args[1] : null,
      optional: !!n.data.optional,
      unit: n.data.key?.endsWith("Centimos")
        ? "centimos"
        : ["tipo"].includes(n.data.key)
          ? "ratio"
          : ["anio", "ejercicio", "edad", "edadDevengo"].includes(n.data.key)
            ? "years"
            : ["fechaFallecimiento"].includes(n.data.key)
              ? "date"
              : "property-dependent",
      source: n.source
    }))
  const callBindings = program
    .filter((n) => ["call", "boundaryCall", "invoke"].includes(n.op))
    .map((n) => ({
      id: n.id,
      target: n.op === "boundaryCall" ? n.data.target : n.args[0],
      arguments: n.args
        .slice(n.op === "boundaryCall" ? 0 : 1)
        .map((operand, index) => ({ index, operand })),
      instance: "call-path + callback-index; never-value-equality",
      condition: "evaluated-only-in-selected-control-flow",
      source: n.source
    }))
  const boundaryContracts = globalBindings
    .filter((b) => compiled.get(b.node).op === "boundary")
    .map((b) => {
      const node = compiled.get(b.node)
      const declaration = declarations.get(b.name)
      const fn = boundaryFunction(declaration)
      return {
        id: b.name,
        outputs: node.data.outputs,
        resultVariants: resultVariants.get(b.name.split("#")[1]) ?? [],
        parameters: fn.parameters.map((p, index) => ({
          index,
          binding: p.name.getText(),
          type: p.type?.getText() ?? null,
          source: ref(p)
        })),
        calls: program
          .filter((n) => n.op === "global" && n.data.name === b.name)
          .map((n) => n.id),
        review: "pending-independent",
        closure: "requires-property-contract-from-owner"
      }
    })
  for (const binding of outputBindings) {
    const amount = program.find(
      (n) =>
        n.source.file === binding.amount.file &&
        n.source.start === binding.amount.start &&
        n.source.end === binding.amount.end
    )
    const call = program.find(
      (n) =>
        n.op === "call" &&
        n.source.file === binding.source.file &&
        n.source.start === binding.source.start &&
        n.source.end === binding.source.end
    )
    if (!amount || !call) throw Error("Salida sin operador " + binding.siteId)
    binding.valueNode = amount.id
    binding.lineNode = call.id
  }
  const admissionObligations = []
  for (const [file, symbol, route] of [
    [annual, "construirLiquidarIrpfAnual", "annual"],
    [annual, "liquidarTrabajoIndividualSimple", "annual"],
    [explicit, "liquidarIrpfAnualExplicito", "explicit"],
    [
      "lib/dominio/irpf/minimos/derechos.ts",
      "validarDerechosMinimos",
      "rights"
    ],
    [
      "lib/dominio/irpf/minimos/derechos.ts",
      "validarRentasAnualesDerechos",
      "rights"
    ]
  ]) {
    moduleAt(file)
    const d = declarations.get(file + "#" + symbol)
    for (const guard of walk(d).filter(ts.isIfStatement))
      admissionObligations.push({
        id: route + ":" + file + ":" + guard.getStart(),
        route,
        source: ref(guard.expression),
        expression: guard.expression.getText(),
        status: "pending-review",
        contractRequired:
          "finite admission result success/fail/defect; no truth inherited from this value evaluator"
      })
  }
  admissionObligations.push({
    id: "annual:deducciones-codigo",
    route: "annual",
    source: ref(declarations.get(annual + "#detectarCasoNoSoportado")),
    expression:
      "deducciones.length===0: value route; otherwise diagnostic then rejection, never sum by code",
    status: "pending-review",
    contractRequired:
      "R35 dispatcher and catalog diagnostic binding; no evaluator by code"
  })
  return {
    admissionObligations,
    dimensionContracts,
    dataRoutes,
    propertyBindings,
    callBindings,
    boundaryContracts,
    version: 1,
    kind: "escalas-r36",
    base: baseR36,
    sources,
    program,
    globalBindings,
    outputBindings,
    sites: siteIds.map((siteId) => ({
      siteId,
      unit: "EUR",
      valueClosed: false,
      selectionClosed: false,
      siteClosed: false,
      closure: "conditional-on-external-property-contracts-and-admission-review"
    })),
    admissionInterface: {
      annual: "anual-publico-r32 / R35 pending-review",
      explicit: "CasoFiscalAnualExplicito + profile guards pending-review",
      rights:
        "DerechosMinimos2025 + coherence + annual-income-reconciliation pending-review"
    },
    completeRuleAcceptance: false,
    wiringAllowed: false,
    review: "pending-independent"
  }
}
export const siteIds = [
  "anual.base.ahorro",
  "anual.base.general-imponible",
  "anual.base.general-liquidable",
  "anual.cuota.ahorro-componente-postminimo",
  "anual.cuota.ahorro-total",
  "anual.cuota.ahorro-tramo",
  "anual.cuota.diferencial",
  "anual.cuota.general-autonomica-tramo",
  "anual.cuota.general-estatal-tramo",
  "anual.cuota.general-total",
  "anual.cuota.liquida",
  "anual.cuota.minimo-ahorro-total",
  "anual.cuota.minimo-autonomico-tramo",
  "anual.cuota.minimo-estatal-tramo",
  "anual.cuota.minimo-general-total",
  "anual.deducciones.autonomicas",
  "anual.explicito.big",
  "anual.explicito.blg",
  "anual.explicito.cuota.autonomica",
  "anual.explicito.cuota.estatal",
  "anual.explicito.cuota.liquida-legal",
  "anual.explicito.cuota.posterior",
  "anual.minimo.ascendientes",
  "anual.minimo.autonomico",
  "anual.minimo.contribuyente",
  "anual.minimo.descendientes",
  "anual.minimo.discapacidad",
  "anual.minimo.estatal"
]

/** Integridad y referencias de receta. Su pase NO demuestra suficiencia causal. */
export function verifyEscalasR36(candidate, root = process.cwd()) {
  const expected = composeEscalasR36(root)
  if (JSON.stringify(candidate) !== JSON.stringify(expected))
    throw Error("Receta R36 distinta del software fijado")
  const nodes = new Map(candidate.program.map((n) => [n.id, n]))
  if (nodes.size !== candidate.program.length)
    throw Error("Operación duplicada")
  const globals = new Set([
    ...primitiveNames,
    ...candidate.globalBindings.map((b) => b.name)
  ])
  for (const n of candidate.program) {
    for (const a of n.args)
      if (!nodes.has(a)) throw Error("Operando inexistente")
    if (n.op === "global" && !globals.has(n.data.name))
      throw Error("Binding global ausente")
  }
  if (
    new Set(candidate.outputBindings.map((s) => s.siteId)).size !==
    siteIds.length
  )
    throw Error("Sitio omitido/duplicado")
  return true
}

export const dimensionContracts = {
  escala: {
    input: {
      base: "EUR-base",
      tramos: "array<[EUR-base,ratio]>",
      escalasPublicadas:
        "absent | array<array<{baseInferior:EUR-base,cuota:EUR-tax,tipo:ratio,inferiorExclusivo?:boolean}>>"
    },
    output: {
      limiteInferior: "EUR-base",
      limiteSuperior: "EUR-base | Infinity",
      baseAplicada: "EUR-base",
      tipo: "ratio",
      cuotaFija: "optional EUR-tax",
      cuota: "EUR-tax"
    },
    operations: [
      "published:Q+(B-L)*t",
      "integrated:min(max(B-previous,0),upper-previous)*t",
      "reduce:sum(cuota),seed=base*0"
    ]
  },
  ahorro: {
    input: {
      anio: "year",
      base: "EUR-base",
      baseGeneral: "EUR-base",
      minimoEstatal: "EUR-base",
      minimoAutonomico: "EUR-base"
    },
    output: {
      remanente: "EUR-base",
      bruta: "EUR-tax",
      despuesMinimo: "EUR-tax",
      minoracion: "EUR-tax"
    },
    instances: ["estatal:minimoEstatal", "autonomico:minimoAutonomico"],
    operations: [
      "r=min(max(M-max(BG,0),0),max(BA,0))",
      "year<=2014:F(max(BA-r,0));else:max(bruta-F(r),0)",
      "minoracion=bruta-despuesMinimo"
    ]
  },
  minimos: {
    input: {
      edad: "years",
      divisor: "count",
      rentasNoExentasCentimos: "centimos-income",
      fechaNacimiento: "civil-date-string",
      fechaConstitucionVinculo: "civil-date-string",
      fechaInicioIncremento: "civil-date-string"
    },
    output: "EUR-base",
    operations: [
      "component sum",
      "eligible order by birth then subjectId",
      "each subject amount / its selected-holder count",
      "ordinary family helper has separate eligibility and ordering"
    ]
  },
  dinero: {
    centimosAEuros: {
      input: "centimos",
      output: "EUR",
      operation: "Decimal(input)/100"
    },
    eurosACentimos: {
      input: "EUR",
      output: "centimos",
      operation: "half-up(input,2)*100 then toNumber"
    },
    redondearHalfUp: {
      input: ["Decimal", "decimal-place-count"],
      output: "Decimal",
      operation: "toDecimalPlaces(count,ROUND_HALF_UP)"
    },
    calcularCuotaDiferencialCentimos: {
      input: ["centimos-tax", "centimos-withholding", "centimos-payment"],
      output: "centimos-tax",
      operation: "liquid-withholding-payment; signed"
    }
  },
  explicito: {
    input: {
      rendimientoAntesArt20: "EUR-string",
      argumentoArt20: "EUR-string",
      aporteImporteEurosExactos: "EUR-string",
      cuotaPosterior: "EUR-string"
    },
    output: "EUR",
    operations: [
      "BIG=BLG=neto signed",
      "base=max(neto,0) only for scales",
      "work:neto=beforeArt20-min(max(beforeArt20,0),art20(argumentoArt20))",
      "EDS:neto=aporte already reduced",
      "legal=state+regional",
      "posterior=legal unless brutoServicios>0 then external DA61.cuotaPosterior"
    ]
  },
  final: {
    input: "Decimal EUR",
    output: "string EUR",
    operation:
      "crearLineaCalculo.origen.decimal=importe.toFixed(); presentation toFixed(2) does not replace it"
  }
}
