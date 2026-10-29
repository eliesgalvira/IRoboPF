import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { gunzipSync, gzipSync } from 'node:zlib'
import ts from 'typescript'

const root = process.cwd()
const out = resolve(root, 'docs/procedencia/correcciones/flujos-r28')
mkdirSync(out, { recursive: true })
const paths = {
  escalas: 'docs/procedencia/editorial/flujo-escalas-r23-sol/grafo.json.gz',
  rentas: 'docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/grafo.json',
  instancias: 'docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/instancias.json',
  ss: 'docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/grafo.json',
}
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex')
const originales = Object.fromEntries(Object.entries(paths).map(([key, path]) => {
  const raw = readFileSync(resolve(root, path))
  return [key, { path, sha256: sha(raw), value: JSON.parse(path.endsWith('.gz') ? gunzipSync(raw).toString() : raw.toString()) }]
}))
const graphs = Object.fromEntries(Object.entries(originales).map(([key, x]) => [key, structuredClone(x.value)]))

/** @param {ts.Node} node @param {(node: ts.Node) => boolean} predicate @returns {ts.Node[]} */
function find(node, predicate) {
  const result = []
  function visit(n) { if (predicate(n)) result.push(n); ts.forEachChild(n, visit) }
  visit(node)
  return result
}
/** @param {string} file */
function source(file) {
  const raw = readFileSync(resolve(root, file))
  const ast = ts.createSourceFile(file, raw.toString('utf8'), ts.ScriptTarget.Latest, true)
  return { ast, sha256: sha(raw), text: raw.toString('utf8') }
}
/** @param {string} file @param {string} name */
function variables(file, name) {
  const s = source(file)
  return { ...s, matches: find(s.ast, (n) => ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === name) }
}
/** @param {string} file @param {ts.Node} node */
function reference(file, node) {
  const s = source(file)
  return { file, sha256: s.sha256, start: node.getStart(), end: node.end, offsetEncoding: 'utf16', text: s.text.slice(node.getStart(), node.end) }
}
const activityFile = 'lib/dominio/irpf/actividades-economicas/calcular.ts'
const activity = source(activityFile)
function exactArgument(row) {
  assert.equal(row.source.file, activityFile)
  assert.equal(row.source.sha256, activity.sha256)
  const matches = find(activity.ast, (n) => ts.isCallExpression(n) && n.getStart() === row.source.start && n.end === row.source.end)
  assert.equal(matches.length, 1)
  const call = matches[0]
  assert.ok(ts.isCallExpression(call) && call.arguments.length >= 4)
  return reference(activityFile, call.arguments[3])
}
const moneyFile = 'lib/dominio/dinero/importe-monetario.ts'
const startMoney = variables(moneyFile, 'crearImporteMonetario')
const endMoney = variables(moneyFile, 'centimosAEuros')
assert.equal(startMoney.matches.length, 1)
assert.equal(endMoney.matches.length, 1)
const moneyRef = {
  file: moneyFile, sha256: startMoney.sha256, start: startMoney.matches[0].getStart(), end: endMoney.matches[0].end,
  offsetEncoding: 'utf16', text: startMoney.text.slice(startMoney.matches[0].getStart(), endMoney.matches[0].end),
  rangeRole: 'span de declaraciones crearImporteMonetario a centimosAEuros; no literal individual',
}
assert.ok(moneyRef.text.includes('new Decimal(valor)') && moneyRef.text.includes('.div(100)'))
const annualFile = 'lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
const modes = variables(annualFile, 'cotizacionesSociales')
const modeMatches = modes.matches.filter((n) => n.getText().includes('contexto.modo === "canonico"'))
assert.equal(modeMatches.length, 1)
const modeRef = reference(annualFile, modeMatches[0])
const flagEdges = graphs.escalas.edges.filter((e) => /resolverParametrosComunidadAutonoma201[2-5]\.escalaAutonomicaIgualEstatal$/.test(e.id))
assert.equal(flagEdges.length, 4)
for (const e of flagEdges) {
  const v = variables(e.output.file, e.output.symbol)
  assert.equal(v.sha256, e.evidence.source.sha256)
  assert.equal(v.matches.length, 1)
  const props = find(v.matches[0], (n) => ts.isPropertyAssignment(n) && n.name.getText() === 'escalaAutonomicaIgualEstatal')
  assert.equal(props.length, 1)
  const prop = props[0]
  assert.ok(ts.isPropertyAssignment(prop) && prop.initializer.kind === ts.SyntaxKind.FalseKeyword)
}
const branchIds = new Set(graphs.escalas.edges.filter((e) => e.formula.includes('Simulada usa conjunta legacy')).map((e) => e.id))
assert.equal(branchIds.size, 8)
for (const edge of graphs.escalas.edges.filter((e) => branchIds.has(e.id))) {
  const ref = edge.evidence.source
  const current = source(ref.file)
  assert.equal(ref.offsetEncoding, 'utf16')
  assert.equal(current.sha256, ref.sha256)
  assert.equal(current.text.slice(ref.start, ref.end), edge.evidence.expression)
  const declarations = find(current.ast, (n) => ts.isVariableDeclaration(n) && n.getStart() === ref.start && n.end === ref.end)
  assert.equal(declarations.length, 1)
  const declaration = declarations[0]
  assert.ok(ts.isVariableDeclaration(declaration) && declaration.initializer && ts.isConditionalExpression(declaration.initializer))
  assert.equal(declaration.initializer.condition.getText(), 'usaEscalaAutonomicaReal')
}
const familyPair = (e) => e.from === 'R.menor3' && e.to === 'R.minHijos'
const modePair = (e) => e.from === 'entrada:contexto.modo' && e.to === 'A.modo'

function evaluate(candidate) {
  const checks = []
  const check = (id, actual, expected) => checks.push({ id, actual, expected, pass: JSON.stringify(actual) === JSON.stringify(expected) })
  for (const group of ['rentas', 'instancias']) {
    const rows = group === 'rentas' ? candidate.rentas.instances : candidate.instancias
    assert.equal(rows.length, 19)
    for (const [i, row] of rows.entries()) {
      const expected = exactArgument(row)
      check(`${group}.argument4.${i}`, [row.argument4.start, row.argument4.end, row.argument4.text], [expected.start, expected.end, expected.text])
    }
  }
  for (const e of candidate.escalas.edges.filter((e) => flagEdges.some((f) => f.id === e.id))) check(e.id, { inputs: e.inputs, role: e.role }, { inputs: [], role: 'value' })
  for (const e of candidate.escalas.edges.filter((e) => branchIds.has(e.id))) check(e.id, e.formula.includes('Simulada usa conjunta legacy') || !e.condition.includes('!parametrosComunidad.escalaAutonomicaIgualEstatal'), false)
  const money = candidate.rentas.edges.filter((e) => e.from === 'primitive.decimal' && e.to === 'money' && e.propertyPath === 'constructor Decimal y divisor100')
  assert.equal(money.length, 1)
  check('FA25-03', money[0].evidence, moneyRef)
  for (const e of candidate.ss.edges.filter((e) => familyPair(e) || modePair(e))) check(`RSS26-02.${e.from}`, e.relation, 'control-seleccion')
  const modeEdge = candidate.ss.edges.filter(modePair)
  assert.equal(modeEdge.length, 1)
  check('RSS26-source-mode', modeEdge[0].source, modeRef)
  return checks
}
const phase = process.argv[2]
if (phase === 'antes') {
  const checks = evaluate(graphs)
  writeFileSync(resolve(out, 'antes.json'), JSON.stringify({ checks, failures: checks.filter((c) => !c.pass).length }, null, 2) + '\n')
  console.log(JSON.stringify({ checks: checks.length, failures: checks.filter((c) => !c.pass).length }))
  process.exitCode = checks.some((c) => !c.pass) ? 1 : 0
} else if (phase === 'corregir') {
  const changes = []
  function change(group, index, before, after, finding) {
    changes.push({ group, index, finding, before, after, review: 'pending-independent' })
  }
  for (const group of ['rentas', 'instancias']) {
    const rows = group === 'rentas' ? graphs.rentas.instances : graphs.instancias
    for (const [i, row] of rows.entries()) {
      const ref = exactArgument(row)
      if (row.argument4.start === ref.start && row.argument4.end === ref.end) continue
      const before = structuredClone(row.argument4)
      row.argument4 = { ...row.argument4, ...ref }
      change(group + '.argument4', i, before, row.argument4, 'FA25-01')
    }
  }
  for (const [i, e] of graphs.escalas.edges.entries()) {
    if (flagEdges.includes(e)) {
      const before = structuredClone(e)
      e.inputs = []
      e.role = 'value'
      e.formula = 'Literal false de esta propiedad en este ejercicio; no depende de comunidadAutonoma ni de otros campos del objeto devuelto.'
      change('escalas.edges', i, before, structuredClone(e), 'R26-01')
    } else if (branchIds.has(e.id)) {
      const before = structuredClone(e)
      e.condition = 'usaEscalaAutonomicaReal = !parametrosComunidad.escalaAutonomicaIgualEstatal; no se infiere la rama únicamente del nombre del territorio.'
      const base = e.formula.split(';')[0]
      const component = e.output.symbol.includes('Estatal') ? 'estatal' : 'autonómico'
      const fallback = component === 'estatal' ? 'tarifa o desglose general conjunto legacy' : e.output.symbol.startsWith('desglose') ? 'array vacío' : 'cero'
      e.formula = `${base}; componente ${component}. Con usaEscalaAutonomicaReal true usa su tarifa/desglose por componente, publicada si existe o integrada; con false usa ${fallback}. En simulada-estatal 2012–2015 el flag escalaAutonomicaIgualEstatal es false: se evalúan dos componentes.`
      assert.ok(e.evidence.expression.includes('usaEscalaAutonomicaReal'))
      change('escalas.edges', i, before, structuredClone(e), 'R26-02')
    }
  }
  for (const [i, e] of graphs.rentas.edges.entries()) if (e.from === 'primitive.decimal' && e.to === 'money' && e.propertyPath === 'constructor Decimal y divisor100') {
    const before = structuredClone(e)
    e.evidence = moneyRef
    change('rentas.edges', i, before, structuredClone(e), 'FA25-03')
  }
  for (const [i, e] of graphs.ss.edges.entries()) if (familyPair(e) || modePair(e)) {
    const before = structuredClone(e)
    e.relation = 'control-seleccion'
    if (modePair(e)) e.source = modeRef
    change('ss.edges', i, before, structuredClone(e), 'RSS26-02')
  }
  const modeNode = graphs.ss.nodes.find((n) => n.id === 'A.modo')
  assert.ok(modeNode)
  const beforeMode = structuredClone(modeNode)
  modeNode.source = modeRef
  change('ss.nodes', graphs.ss.nodes.indexOf(modeNode), beforeMode, structuredClone(modeNode), 'RSS26-source-mode')
  const checks = evaluate(graphs)
  assert.ok(checks.every((c) => c.pass))
  const artifacts = []
  for (const [name, graph] of Object.entries(graphs)) {
    const raw = Buffer.from(JSON.stringify(graph, null, 2) + '\n')
    const bytes = gzipSync(raw, { level: 9 })
    const file = name + '.candidato.json.gz'
    writeFileSync(resolve(out, file), bytes)
    artifacts.push({ file, sha256: sha(bytes), size: bytes.length, contentSha256: sha(raw), from: { path: originales[name].path, sha256: originales[name].sha256 } })
  }
  const result = { base: '0a0200e6a9c18d6f9bd3860006419c01ab776d9a', sourceCodeBase: '07c07e6376a72f229be735a904ecf36517a1b571', artifacts, changes, checks, completeClosure: false, wiringAllowed: false, completeRuleAcceptance: false,
    pending: ['FA25-02/04/05/06: aporte/etapas, condiciones, llamadores y límite semántico', 'R26-03/04/05: puertos, cierre alcanzable y puerta referencial', 'RSS26-01/03/04: propagación de modo, céntimos a euros y lado/instancia', 'Revisión independiente de estas rectificaciones antes de composición'] }
  writeFileSync(resolve(out, 'rectificaciones.json'), JSON.stringify(result, null, 2) + '\n')
  console.log(JSON.stringify({ checks: checks.length, failures: 0, replacements: changes.length, artifacts: artifacts.length, completeClosure: false }))
} else throw new Error('Fase requerida: antes o corregir')
