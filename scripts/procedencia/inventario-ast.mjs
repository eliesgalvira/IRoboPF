import ts from "typescript"
import { createHash } from "node:crypto"

export const hash = (text) => createHash("sha256").update(text).digest("hex")
export const idFor = (...parts) =>
  `inv-${hash(JSON.stringify(parts)).slice(0, 32)}`
const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/
const labels = {
  Parameter: "Parámetro",
  Formula: "Fórmula",
  Step: "Paso",
  Condition: "Condición",
  Rounding: "Redondeo",
}
export function baseItem(
  file,
  symbol,
  path,
  kind,
  expression,
  source,
  layer = "syntactic"
) {
  return {
    // Ocurrencia versionada, nunca identidad permanente de un concepto fiscal.
    id: idFor("occurrence-v2", source.sha256, layer, file, symbol, path),
    layer,
    kind,
    name: `${labels[kind]}: ${symbol} / ${path}`,
    domain: file.split("/").slice(1, -1).join("/"),
    symbol,
    path,
    expression,
    value: null,
    unit: "pending",
    years: [],
    territories: [],
    regimes: [],
    applicability: "pending",
    status: "pending",
    evidence: "pending",
    independentReview: "pending",
    relations: { itemIds: [], ruleIds: [], citationIds: [], findingIds: [] },
    source,
  }
}
export function extractTs(file, text) {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
  if (sf.parseDiagnostics.length) throw new Error(`AST inválido: ${file}`)
  const items = [],
    bindings = [],
    strings = [],
    counts = { numeric: 0, decimalStrings: 0, functions: 0, conditions: 0 }
  const digest = hash(text)
  function visit(node, symbol, path) {
    let local = symbol
    if (
      (ts.isVariableDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isMethodDeclaration(node)) &&
      node.name
    )
      local = node.name.getText(sf)
    let kind = null
    if (ts.isNumericLiteral(node) || ts.isBigIntLiteral(node)) {
      kind = "Parameter"
      counts.numeric++
    }
    if (ts.isIdentifier(node) && node.text === "Infinity") kind = "Parameter"
    if (ts.isStringLiteralLike(node)) {
      strings.push({
        value: node.text,
        start: node.getStart(sf),
        symbol: local,
      })
      if (decimal.test(node.text)) {
        kind = "Parameter"
        counts.decimalStrings++
      }
    }
    if (ts.isFunctionLike(node) && node.body) {
      kind = "Step"
      counts.functions++
    }
    if (
      ts.isBinaryExpression(node) ||
      ts.isCallExpression(node) ||
      ts.isNewExpression(node) ||
      ts.isAwaitExpression(node) ||
      ts.isPrefixUnaryExpression(node) ||
      ts.isPostfixUnaryExpression(node)
    )
      kind = "Formula"
    if (
      ts.isIfStatement(node) ||
      ts.isConditionalExpression(node) ||
      ts.isCaseClause(node) ||
      ts.isDefaultClause(node) ||
      ts.isSwitchStatement(node) ||
      ts.isWhileStatement(node) ||
      ts.isDoStatement(node) ||
      ts.isForStatement(node) ||
      (ts.isBinaryExpression(node) &&
        [
          ts.SyntaxKind.LessThanToken,
          ts.SyntaxKind.LessThanEqualsToken,
          ts.SyntaxKind.GreaterThanToken,
          ts.SyntaxKind.GreaterThanEqualsToken,
          ts.SyntaxKind.EqualsEqualsEqualsToken,
          ts.SyntaxKind.ExclamationEqualsEqualsToken,
          ts.SyntaxKind.EqualsEqualsToken,
          ts.SyntaxKind.ExclamationEqualsToken,
          ts.SyntaxKind.AmpersandAmpersandToken,
          ts.SyntaxKind.BarBarToken,
          ts.SyntaxKind.QuestionQuestionToken,
        ].includes(node.operatorToken.kind))
    ) {
      kind = "Condition"
      counts.conditions++
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression
      const name = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : null
      // Candidatos por operación exacta; no acredita política fiscal ni resuelve shadowing.
      if (
        [
          "round",
          "floor",
          "ceil",
          "trunc",
          "toFixed",
          "toDecimalPlaces",
          "toDP",
          "toSignificantDigits",
          "toSD",
          "redondearHalfUp",
          "redondearImporteLiquidado",
          "truncarDecimal",
          "redondear1",
          "truncar",
        ].includes(name)
      )
        kind = "Rounding"
    }
    if (ts.isArrayLiteralExpression(node) || ts.isObjectLiteralExpression(node))
      kind = "Parameter"
    const start = node.getStart(sf),
      position = sf.getLineAndCharacterOfPosition(start)
    const source = {
      file,
      sha256: digest,
      start,
      end: node.end,
      line: position.line + 1,
      column: position.character + 1,
      offsetEncoding: "utf16",
    }
    if (kind) {
      const item = baseItem(
        file,
        local,
        JSON.stringify(path),
        kind,
        node.getText(sf),
        source
      )
      if (ts.isNumericLiteral(node) || ts.isStringLiteralLike(node))
        item.value = node.text
      items.push(item)
    }
    if (ts.isVariableDeclaration(node) && node.initializer)
      bindings.push({
        symbol: local,
        expression: node.initializer.getText(sf),
        source,
        exported:
          node.parent.parent.modifiers?.some(
            (m) => m.kind === ts.SyntaxKind.ExportKeyword
          ) ?? false,
        function:
          ts.isArrowFunction(node.initializer) ||
          ts.isFunctionExpression(node.initializer),
      })
    const siblings = new Map()
    ts.forEachChild(node, (child) => {
      let label = ts.SyntaxKind[child.kind]
      if (ts.isVariableStatement(child))
        label +=
          ":" +
          child.declarationList.declarations
            .map((d) => d.name.getText(sf))
            .join(",")
      if (child.name) label += `:${child.name.getText(sf)}`
      if (ts.isPropertyAssignment(node) && child === node.initializer)
        label = `valor:${node.name.getText(sf)}`
      const index = siblings.get(label) ?? 0
      siblings.set(label, index + 1)
      visit(child, local, [...path, [label, index]])
    })
  }
  visit(sf, "modulo", [])
  return { file, sha256: digest, items, bindings, strings, counts }
}
