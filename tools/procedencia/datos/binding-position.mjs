// Resolve a literal property path, never a quote found elsewhere in a file.
const ts = (await import(process.env.DATOS_RUNTIME_ROOT ? Bun.resolveSync('typescript', process.env.DATOS_RUNTIME_ROOT) : 'typescript')).default
import { readFileSync } from 'node:fs'
const [file, symbol, pathJSON] = process.argv.slice(2)
const text = readFileSync(file, 'utf8')
const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
if (sf.parseDiagnostics.length) throw Error('AST inválido')
const declarations = []
function visit(n) {
  if (ts.isVariableDeclaration(n) && n.name.getText(sf) === symbol && n.initializer &&
      n.parent.parent.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) declarations.push(n)
  ts.forEachChild(n, visit)
}
visit(sf)
if (declarations.length !== 1) throw Error('Export ausente/duplicado')
function unwrap(n) {
  while (ts.isAsExpression(n) || ts.isSatisfiesExpression(n) || ts.isParenthesizedExpression(n)) n = n.expression
  return n
}
let node = unwrap(declarations[0].initializer)
let path = JSON.parse(pathJSON)
let adapter = null
if (ts.isCallExpression(node) && node.expression.getText(sf) === 'filas') {
  const helpers = []
  function helper(n) {
    if (ts.isVariableDeclaration(n) && n.name.getText(sf) === 'filas') helpers.push(n)
    ts.forEachChild(n, helper)
  }
  helper(sf)
  const expected = `const filas = (
  datos: ReadonlyArray<readonly [string, string, string]>
): EscalaPublicada =>
  datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }))`
  if (helpers.length !== 1 || 'const ' + helpers[0].getText(sf) !== expected ||
      node.arguments.length !== 1 || path.length !== 2 ||
      !['baseInferior','cuota','tipo'].includes(path[1])) throw Error('Adaptador filas distinto')
  adapter = {start:helpers[0].getStart(sf), end:helpers[0].end, quote:helpers[0].getText(sf)}
  node = node.arguments[0]
  path = [path[0], String(['baseInferior','cuota','tipo'].indexOf(path[1]))]
}
for (const key of path) {
  node = unwrap(node)
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.arguments.length === 1) {
    const name = node.expression.text
    const helpers = []
    function find(n) {
      if (ts.isVariableDeclaration(n) && n.name.getText(sf) === name && n.initializer) helpers.push(n)
      ts.forEachChild(n, find)
    }
    find(sf)
    const fn = helpers.length === 1 ? unwrap(helpers[0].initializer) : null
    if (!fn || !ts.isArrowFunction(fn) || fn.parameters.length !== 1 ||
        fn.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword) ||
        fn.parameters[0].dotDotDotToken || fn.parameters[0].initializer ||
        !ts.isIdentifier(fn.parameters[0].name) || !ts.isIdentifier(unwrap(fn.body)) ||
        fn.parameters[0].name.text !== unwrap(fn.body).text || adapter) throw Error('Adaptador no es identidad explícita')
    adapter = {start:helpers[0].getStart(sf), end:helpers[0].end, quote:helpers[0].getText(sf)}
    node = unwrap(node.arguments[0])
  }
  if (ts.isObjectLiteralExpression(node)) {
    // Spread/getter/computed properties require a separate explicit adapter.
    if (node.properties.some(p => !ts.isPropertyAssignment(p) || ts.isComputedPropertyName(p.name))) throw Error('Objeto indirecto')
    const matches = node.properties.filter(p => (p.name.text ?? p.name.getText(sf)) === String(key))
    if (matches.length !== 1) throw Error('Propiedad ausente/duplicada')
    node = matches[0].initializer
  } else if (ts.isArrayLiteralExpression(node) && /^(0|[1-9][0-9]*)$/.test(String(key))) {
    if (node.elements.some(ts.isSpreadElement) || !node.elements[Number(key)]) throw Error('Índice inválido')
    node = node.elements[Number(key)]
  } else throw Error('Camino indirecto sin adaptador')
}
node = unwrap(node)
const position = {start:node.getStart(sf), end:node.end, quote:node.getText(sf), offsetEncoding:'utf16'}
if (adapter) position.adapter = adapter
console.log(JSON.stringify(position))
