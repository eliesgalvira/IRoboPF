import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
import vm from 'node:vm'
import ts from '/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js'
import Decimal from '/home/elies/Repos/IRoboPF/node_modules/decimal.js/decimal.mjs'

const here = 'docs/procedencia/revisiones/flujos-rectificaciones-r28-sol'
const input = 'docs/procedencia/correcciones/flujos-r28'
const sha = b => createHash('sha256').update(b).digest('hex')
const json = p => JSON.parse(readFileSync(p, 'utf8'))
const receipt = json(`${input}/rectificaciones.json`)
const graphs = Object.fromEntries(receipt.artifacts.map(a => [a.file.split('.')[0], JSON.parse(gunzipSync(readFileSync(`${input}/${a.file}`)).toString())]))
function nodes(n, predicate) {
  const found = []
  function visit(x) { if (predicate(x)) found.push(x); ts.forEachChild(x, visit) }
  visit(n)
  return found
}
function source(file) {
  const bytes = readFileSync(file)
  return { file, sha256: sha(bytes), text: bytes.toString(), ast: ts.createSourceFile(file, bytes.toString(), ts.ScriptTarget.Latest, true) }
}
function ref(s, n) { return { file: s.file, sha256: s.sha256, start: n.getStart(), end: n.end, offsetEncoding: 'utf16', text: n.getText() } }
function validateRef(r) {
  const s = source(r.file)
  assert.equal(s.sha256, r.sha256); assert.equal(r.offsetEncoding, 'utf16')
  assert.equal(s.text.slice(r.start, r.end), r.text)
}
function variable(s, name) {
  return nodes(s.ast, n => ts.isVariableDeclaration(n) && n.name.getText() === name)
}
/** @returns {any} Resultado dinámico del contexto de ensayo; se contrasta con assert. */
function run(expression, bindings) {
  const js = ts.transpileModule(`globalThis.result = (${expression})`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText
  const context = { ...bindings, result: undefined }
  vm.runInNewContext(js, context, { timeout: 1000 })
  return context.result
}
const activity = source('lib/dominio/irpf/actividades-economicas/calcular.ts')
const program = ts.createProgram([activity.file], { noResolve: true, target: ts.ScriptTarget.Latest })
const checked = program.getSourceFile(activity.file)
assert.ok(checked)
const checker = program.getTypeChecker()
const old = json('docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/instancias.json')
assert.deepEqual(graphs.rentas.instances, graphs.instancias)
assert.equal(graphs.instancias.length, 19)
const instances = graphs.instancias.map((row, index) => {
  validateRef(row.source); validateRef(row.argument4)
  const calls = nodes(checked, n => ts.isCallExpression(n) && n.getStart() === row.source.start && n.end === row.source.end)
  assert.equal(calls.length, 1)
  const call = calls[0]; assert.equal(call.expression.getText(), 'etapa')
  assert.deepEqual(ref(activity, call.arguments[3]), Object.fromEntries(Object.entries(row.argument4).filter(([k]) => k !== 'rangeRole')))
  const symbol = checker.getSymbolAtLocation(call.expression)
  assert.ok(symbol?.valueDeclaration && ts.isVariableDeclaration(symbol.valueDeclaration))
  assert.equal(symbol.valueDeclaration.name.getText(), 'etapa')
  const bindings = nodes(call.arguments[3], ts.isIdentifier).map(n => ({ name: n.text, declarations: (checker.getSymbolAtLocation(n)?.declarations ?? []).map(d => ({ start: d.getStart(), end: d.end, text: d.getText() })) }))
  const ancestors = []
  for (let p = call.parent; p; p = p.parent) {
    if (ts.isIfStatement(p)) ancestors.push({ kind: 'if', expression: p.expression.getText() })
    if (ts.isForOfStatement(p)) ancestors.push({ kind: 'for-of', expression: p.expression.getText() })
    if (ts.isFunctionDeclaration(p)) ancestors.push({ kind: 'function', name: p.name?.text })
  }
  return { index, instance: row.instance, argument4: row.argument4, oldArgument4: old[index].argument4, changed: old[index].argument4.start !== row.argument4.start || old[index].argument4.end !== row.argument4.end, producerBindings: bindings, lexicalScope: ancestors, consumer: ref(activity, symbol.valueDeclaration), returnBinding: ts.isVariableDeclaration(call.parent) ? call.parent.name.getText() : 'retorno descartado; etapa registrada' }
})
assert.equal(instances.filter(x => x.changed).length, 6)
const etapa = variable(activity, 'etapa')[0]
const recorded = []
const stage = run(etapa.initializer.getText(), { etapas: recorded, fuentesActividad2025: [] })
// Objeto de valor con identidad observable, sin sustituir el motor ni una fuente fiscal.
const exact = new Decimal('123.45')
assert.equal(stage('R', 'id', 'f', exact), exact)
assert.equal(recorded[0].importe, '123.45')
const annual = source('lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts')
const community = source('lib/dominio/irpf/comunidades/comunidad-autonoma.ts')
const flagCases = []
for (let year = 2012; year <= 2025; year++) {
  const decl = variable(community, `resolverParametrosComunidadAutonoma${year}`)[0]
  assert.ok(decl)
  const props = nodes(decl, n => ts.isPropertyAssignment(n) && n.name.getText() === 'escalaAutonomicaIgualEstatal')
  assert.equal(props.length, 1)
  if (year <= 2015) assert.equal(props[0].initializer.kind, ts.SyntaxKind.FalseKeyword)
  for (const territory of ['simulada-estatal', 'madrid']) {
    const flag = run(props[0].initializer.getText(), { comunidadAutonoma: territory })
    assert.equal(flag, year >= 2016 && territory === 'simulada-estatal')
    flagCases.push({ year, territory, flag, source: ref(community, props[0]) })
  }
}
const branchEdges = graphs.escalas.edges.filter(e => e.condition.includes('usaEscalaAutonomicaReal ='))
assert.equal(branchEdges.length, 8)
const formulaCases = []
for (const e of branchEdges) {
  const decl = variable(annual, e.output.symbol)[0]
  assert.ok(decl && ts.isConditionalExpression(decl.initializer))
  assert.equal(decl.initializer.condition.getText(), 'usaEscalaAutonomicaReal')
  assert.equal(annual.text.slice(e.evidence.source.start, e.evidence.source.end), decl.getText())
  assert.equal(e.evidence.source.sha256, annual.sha256)
  assert.equal(e.evidence.source.offsetEncoding, 'utf16')
  for (const fc of flagCases.filter(c => [2012,2013,2014,2015,2016,2025].includes(c.year))) {
    for (const published of [false, true]) {
      const calls = []
      const estatal = e.output.symbol.includes('Estatal')
      const detail = e.output.symbol.startsWith('desglose')
      const minimum = e.output.symbol.includes('Minimo')
      const base = minimum ? (estatal ? '110' : '220') : '1000'
      const st = ['estatal']; const au = ['autonomica']
      const pubSt = published ? ['publicada-estatal'] : undefined
      const pubAu = published ? ['publicada-autonomica'] : undefined
      const spy = label => argument => { calls.push({ label, base: argument.base.toString(), tramos: argument.tramos, escalasPublicadas: argument.escalasPublicadas }); return label }
      const actual = run(decl.initializer.getText(), {
        usaEscalaAutonomicaReal: run(variable(annual, 'usaEscalaAutonomicaReal')[0].initializer.getText(), { parametrosComunidad: { escalaAutonomicaIgualEstatal: fc.flag } }), caso: { anio: fc.year, comunidadAutonoma: fc.territory },
        baseLiquidableGeneral: new Decimal(1000), minimoPersonalYFamiliar: new Decimal(110), minimoPersonalYFamiliarAutonomico: new Decimal(220), Decimal,
        parametrosComunidad: { escalaAutonomica: { tramos: au } }, tramosIrpfEstatalGeneral: st,
        escalasPublicadasEstatales: pubSt, escalasPublicadasAutonomicas: pubAu,
        calcularCuotaPorEscala: spy('componente-cuota'), calcularCuotaPorEscalaGeneral: spy('legacy-cuota'),
        calcularDesgloseCuotaPorEscala: spy('componente-desglose'), calcularDesgloseCuotaPorEscalaGeneral: spy('legacy-desglose'),
      })
      if (!fc.flag || estatal) {
        assert.equal(calls.length, 1); assert.equal(calls[0].base, base)
        assert.equal(calls[0].label, `${fc.flag ? 'legacy' : 'componente'}-${detail ? 'desglose' : 'cuota'}`)
        if (!fc.flag) { assert.equal(calls[0].tramos, estatal ? st : au); assert.equal(calls[0].escalasPublicadas, estatal ? pubSt : pubAu) }
      } else { assert.equal(calls.length, 0); assert.equal(detail ? actual.length : actual.toString(), detail ? 0 : '0') }
      formulaCases.push({ formula: e.output.symbol, year: fc.year, territory: fc.territory, published, flag: fc.flag, calls, result: String(actual) })
    }
  }
}
const modeNode = graphs.ss.nodes.find(n => n.id === 'A.modo')
validateRef(modeNode.source)
const homonyms = variable(annual, 'cotizacionesSociales')
assert.equal(homonyms.length, 2)
assert.equal(homonyms[1].getStart(), modeNode.source.start)
assert.ok(homonyms[0].getText().includes('yield* CotizacionesSociales'))
const modeCases = ['canonico', 'compatible-legacy'].map(modo => {
  const result = run(homonyms[1].initializer.getText(), { contexto: { modo }, caso: { anio: 2025 }, rendimientoIntegroTrabajo: new Decimal(12345), medirAuditoriaSync: (_label, f) => f(), calcularDesgloseCotizacionesPerfilUniforme: x => ({ selected: 'perfil', ...x }), calcularDesgloseCotizacionesSocialesLegacy: x => ({ selected: 'legacy', ...x }) })
  assert.equal(result.selected, modo === 'canonico' ? 'perfil' : 'legacy')
  assert.equal(result.salarioBrutoAnual.toString(), '12345')
  return { modo, ...result }
})
const money = graphs.rentas.edges.find(e => e.propertyPath === 'constructor Decimal y divisor100')
validateRef(money.evidence)
assert.ok(money.evidence.rangeRole.includes('no literal individual'))
assert.equal(money.evidence.file, 'lib/dominio/dinero/importe-monetario.ts')
const monetary = source(money.evidence.file)
assert.equal(money.evidence.start, variable(monetary, 'crearImporteMonetario')[0].getStart())
assert.equal(money.evidence.end, variable(monetary, 'centimosAEuros')[0].end)
const monetaryFunction = run(variable(monetary, 'crearImporteMonetario')[0].initializer.getText(), { Decimal })
const convert = run(variable(monetary, 'centimosAEuros')[0].initializer.getText(), { crearImporteMonetario: monetaryFunction })
assert.equal(convert(12345).toString(), '123.45')
assert.equal(convert(-1).toString(), '-0.01')
const controls = graphs.ss.edges.filter(e => (e.from === 'R.menor3' && e.to === 'R.minHijos') || (e.from === 'entrada:contexto.modo' && e.to === 'A.modo'))
assert.equal(controls.length, 2); controls.forEach(e => { assert.equal(e.relation, 'control-seleccion'); validateRef(e.source) })
const family = graphs.ss.nodes.find(n => n.id === 'R.minHijos')
validateRef(family.source)
assert.ok(family.source.text.includes('Match.value(esDescendienteMenorTres(descendiente))'))
assert.ok(family.source.text.includes('Match.when(false, () => total)'))
const retention = source('lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts')
const minor = variable(retention, 'esDescendienteMenorTres')[0]
validateRef(graphs.ss.nodes.find(n => n.id === 'R.menor3').source)
const ageArrow = nodes(minor, n => ts.isArrowFunction(n) && n.getText().includes('edad < 3')) .find(n => n.parameters[0]?.name.getText() === 'edad')
assert.ok(ageArrow)
const underThree = run(ageArrow.getText(), {})
assert.equal(underThree(2), true); assert.equal(underThree(3), false)
assert.ok(minor.getText().includes('adopcionOAcogimientoMenosTresAnios: true'))
const negatives = []
function rejects(id, f) { assert.throws(f); negatives.push({ id, rejected: true }) }
rejects('token-homonimo-productor-no-es-consumidor', () => assert.equal(instances.find(x => x.changed).oldArgument4.start, instances.find(x => x.changed).argument4.start))
rejects('modo-servicio-no-es-seleccion', () => assert.equal(homonyms[0].getStart(), modeNode.source.start))
rejects('simulada-2012-no-implica-legacy', () => assert.equal(flagCases.find(c => c.year === 2012 && c.territory === 'simulada-estatal').flag, true))
rejects('2016-simulada-no-implica-dos-componentes', () => assert.equal(flagCases.find(c => c.year === 2016 && c.territory === 'simulada-estatal').flag, false))
rejects('condicion-textual-sin-AST', () => { const mutated = branchEdges[0].condition.replace('!parametrosComunidad.escalaAutonomicaIgualEstatal', 'parametrosComunidad.escalaAutonomicaIgualEstatal'); assert.ok(mutated.includes('!parametrosComunidad.escalaAutonomicaIgualEstatal')) })
rejects('modo-invertido-runtime', () => {
  const expression = homonyms[1].initializer.getText().replace('contexto.modo === "canonico"', 'contexto.modo !== "canonico"')
  const actual = run(expression, { contexto: { modo: 'canonico' }, caso: { anio: 2025 }, rendimientoIntegroTrabajo: new Decimal(1), medirAuditoriaSync: (_label, f) => f(), calcularDesgloseCotizacionesPerfilUniforme: () => 'perfil', calcularDesgloseCotizacionesSocialesLegacy: () => 'legacy' })
  assert.equal(actual, 'perfil')
})
rejects('flag-invertido-runtime', () => {
  const actual = run('parametrosComunidad.escalaAutonomicaIgualEstatal', { parametrosComunidad: { escalaAutonomicaIgualEstatal: false } })
  assert.equal(actual, true)
})
// Identificador homónimo en fuente sintética con Unicode no BMP: mismos bytes de token,
// distinto binding y distinto rango UTF16. No se introduce en el checkout fiscal.
const synthetic = source(activity.file)
synthetic.ast = ts.createSourceFile('adverso.ts', 'const marca="🧪"; const cuota=1; function f(){const cuota=2; etapa("r","i","f",cuota)}', ts.ScriptTarget.Latest, true)
const syntheticCall = nodes(synthetic.ast, ts.isCallExpression)[0]
const tokens = nodes(synthetic.ast, n => ts.isIdentifier(n) && n.text === 'cuota')
assert.equal(tokens.length, 3)
rejects('token-identico-otro-binding-UTF16', () => assert.equal(tokens[0].getStart(), syntheticCall.arguments[3].getStart()))
const previous = json(`${input}/antes.json`)
assert.equal(previous.checks.length, 54); assert.equal(previous.failures, 28)
assert.equal(receipt.checks.length, 54); assert.ok(receipt.checks.every(c => c.pass))
const result = { sources: [activity, annual, community, monetary].map(({file,sha256}) => ({file,sha256})), instances, flagCases, formulaCases, modeCases, controls, negatives, stageIdentityPreserved: true, originalChecks: { total: 54, beforeFailures: 28, afterFailures: 0, decomposition: '38 argumentos (19 duplicados),4 flags,8 descripciones,1 intervalo,2 relaciones,1 fuente de arista modo; nodo modo fuera de evaluate' }, completeClosure: false, wiringAllowed: false, completeRuleAcceptance: false }
writeFileSync(`${here}/casos.json`, JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify({ instances: instances.length, wrongBefore: 6, equalBefore: 13, flagCases: flagCases.length, formulaCases: formulaCases.length, modeCases: modeCases.length, negatives: negatives.length, status: 'contraste acotado correcto' }))
