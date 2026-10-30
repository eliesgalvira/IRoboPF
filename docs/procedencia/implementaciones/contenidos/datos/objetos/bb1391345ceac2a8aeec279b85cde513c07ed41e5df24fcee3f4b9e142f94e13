import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import { createHash } from "node:crypto"

const root = fileURLToPath(new URL("../../", import.meta.url))
const require = createRequire(process.env.IROBOPF_DEPENDENCIES_PACKAGE ?? resolve(root, "package.json"))
const ts = require("typescript")
const directory = "docs/procedencia/implementaciones/flujo-admision-r32-sol/"
const pins = JSON.parse(readFileSync(resolve(root, directory, "pines.json"), "utf8"))
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex")
export const contractId = "anual-publico-r32"
export const siteIds = [
  ...["base", "exceso", "empresarial-ordinaria", "trabajador-ordinaria", "mei-empresarial", "mei-trabajador", "solidaridad-empresarial", "solidaridad-trabajador", "empresarial-total", "trabajador-total", "coste-laboral"].map((s) => `anual.ss.${s}`),
  ...["base", "cuota", "tipo", "anual"].map((s) => `anual.retencion.${s}`),
  "anual.pagos.retenciones", "anual.pagos.cuenta",
]

/** Contrato finito: un cambio de fuente exige una nueva revisión de pines. */
export function verifySources(read = (path) => readFileSync(resolve(root, path))) {
  for (const pin of pins) {
    const bytes = read(pin.path)
    if (bytes.length !== pin.size || hash(bytes) !== pin.sha256) throw new Error(`Fuente alterada: ${pin.path}`)
  }
  return true
}

function source(path) {
  const text = readFileSync(resolve(root, path), "utf8")
  return ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
}
function reference(sf, node) {
  return { path: sf.fileName, sha256: pins.find((p) => p.path === sf.fileName).sha256,
    start: node.getStart(sf), end: node.end, coordinate: "UTF-16 half-open",
    syntaxKind: ts.SyntaxKind[node.kind], expression: node.getText(sf) }
}
function declarations(sf) {
  const result = []
  function visit(node) {
    if ((ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name && ts.isIdentifier(node.name)) result.push(node)
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return result
}

// La expansión conserva operadores y orden de cortocircuito, no solo nombres de helpers.
function booleanTree(sf, node) {
  if (ts.isParenthesizedExpression(node)) return booleanTree(sf, node.expression)
  if (ts.isBinaryExpression(node) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken].includes(node.operatorToken.kind))
    return { op: node.operatorToken.getText(sf), left: booleanTree(sf, node.left), right: booleanTree(sf, node.right), evaluation: "left-to-right-short-circuit" }
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken)
    return { op: "!", operand: booleanTree(sf, node.operand) }
  return { op: "expression", ref: reference(sf, node) }
}

const annual = pins[0].path
const rights = pins[1].path
const retention = pins[3].path
const versions = pins[4].path
const territory = pins[6].path
const adapter = pins[7].path
const explicit = pins[9].path

// Se examinan cuerpos completos de los predicados que sí deciden admisión.
const selections = new Map([
  [annual, ["construirLiquidarIrpfAnual", "liquidarIrpfAnual", "liquidarIrpfAnualConDerechos", "liquidarTrabajoIndividualSimple", "detectarCasoNoSoportado", "pasoRetencionTrabajoAeat"]],
  [rights, ["fechaValida", "cumpleRentas", "tieneRelacion", "titularesConDerecho", "hayAlimentosPropiosSinMinimo", "validarDerechosMinimos", "validarRentasAnualesDerechos", "calcularDerechosMinimos"]],
  [pins[2].path, null],
  [retention, ["esCasoCalculable", "calcularRetencionTrabajoAeatImpl"]],
  [versions, ["VERSIONES_RETENCION", "seleccionarVersionRetencion"]],
  [pins[5].path, ["esFechaCivilDelAnio"]],
  [territory, ["obtenerParametrosComunidadAutonoma", "resolverParametrosComunidadAutonoma2026"]],
  [adapter, ["construirCalcularSalarioLegacy", "calcularSalarioLegacyConLiquidacionIrpfAnual", "casoFiscalLegacy", "casoRetencionTrabajoPerfil", "descendientesFiscalesPerfil", "descendientesRetencionPerfil"]],
  [pins[8].path, ["detallePerfilAuditoriaNormativa"]],
  [explicit, ["liquidarIrpfAnualExplicito"]],
  [pins[10].path, null],
])

export function buildAdmissionFragment() {
  verifySources()
  const predicates = [], bindings = [], bodies = []
  for (const [path, names] of selections) {
    const sf = source(path)
    for (const node of declarations(sf).filter((n) => names === null || names.includes(n.name.text))) {
      const owner = node.name.text
      const bodyId = `${path}#${owner}`
      // Cuerpos de fórmula anual excluidos: referencias específicas debajo.
      if (owner !== "liquidarTrabajoIndividualSimple" && owner !== "liquidarIrpfAnualExplicito") bodies.push({ id: bodyId, ref: reference(sf, node) })
      function visit(child) {
        if (ts.isIfStatement(child)) predicates.push({ id: `${bodyId}@${child.getStart(sf)}`, owner, condition: booleanTree(sf, child.expression), ref: reference(sf, child), then: reference(sf, child.thenStatement), otherwise: child.elseStatement ? reference(sf, child.elseStatement) : null })
        if (ts.isCallExpression(child)) {
          const callee = child.expression.getText(sf)
          if (/validar|calcularDerechosMinimos|hayAlimentos|retencionTrabajoAeat.calcular|liquidar|obtenerParametrosComunidadAutonomaPuro/.test(callee)) bindings.push({ id: `${bodyId}:call@${child.getStart(sf)}`, owner, callee, ref: reference(sf, child), arguments: child.arguments.map((a, index) => ({ index, ref: reference(sf, a) })) })
        }
        ts.forEachChild(child, visit)
      }
      visit(node)
      if (owner === "esCasoCalculable") {
        const arrow = node.initializer
        predicates.push({ id: "retencion.esCasoCalculable.expanded", owner, condition: booleanTree(sf, arrow.body), ref: reference(sf, arrow.body), then: null, otherwise: null })
      }
    }
  }
  const sfAnnual = source(annual)
  const anchors = new Map()
  function locate(node) {
    if (ts.isCallExpression(node) && node.expression.getText(sfAnnual) === "crearLineaCalculo") {
      const object = node.arguments[0]
      if (ts.isObjectLiteralExpression(object)) {
        const property = object.properties.find((p) => p.name?.getText(sfAnnual) === "siteId")
        if (property && ts.isStringLiteral(property.initializer) && siteIds.includes(property.initializer.text)) anchors.set(property.initializer.text, reference(sfAnnual, node))
      }
    }
    ts.forEachChild(node, locate)
  }
  locate(sfAnnual)
  if (anchors.size !== 17) throw new Error("Sitios anuales distintos de los fijados")
  const parameterBindings = [
    ["caso", "API.caso", "identity"], ["contexto", "API.contexto", "identity; ConDerechos fija canonico"],
    ["familiar", "API.caso.situacionFamiliar", "alias"], ["derechos", "API.caso.derechosMinimos", "validarDerechosMinimos devuelve decoded, no objeto derivado del perfil"],
    ["entrada", "ConDerechos.caso.derechosMinimos o API explicita o EntradaCalculoSalarioLegacy según owner", "scope exacto en bodies/bindings"],
    ["d", "API.caso.derechosMinimos.descendientes[i]", "for-of en orden; 0..99"],
    ["t", "API.caso.derechosMinimos.descendientes[i].titulares[j]", "for-of en orden; 0..99"],
    ["descendiente", "API.caso.retencionTrabajoAeat.descendientes[i]", "every en orden; array público"],
    ["ascendiente", "API.caso.retencionTrabajoAeat.ascendientes[i]", "every en orden; array público"],
    ["rentaNoExenta", "rendimientoTrabajo.rendimientoNeto + otrasRentasNoExentas", "EUR; antes de reducciones/compensaciones"],
    ["rendimientoTrabajo", "caso.rendimientos.trabajo[*].importeIntegroCentimos; caso.anio; contexto.modo", "SS de perfil elegido; conversion centimosAEuros; puerto de valor, no fórmula redemostrada"],
    ["otrasRentasNoExentas", "caso.rendimientos.capitalInmobiliario y gananciasPatrimoniales; caso.anio; caso.situacionFamiliar.edad", "neto alquiler + ganancias sujetas general + ahorro; importeGananciaCentimos y tratamientoMayores65/fechas públicos"],
    ["centimosDelPerfil", "rentaNoExenta", "times(100).toDecimalPlaces(0, ROUND_HALF_UP)"],
    ["posibles/cercanos/siguientes", "d.titulares", "tieneRelacion -> filter grado mínimo/mayor; renta de titular, no del descendiente"],
    ["elegibles", "derechos.descendientes", "titularesConDerecho y contribuyenteId; orden nacimiento ascendente, sujetoId desempata; empate/divisor distinto rechaza"],
    ["version", "caso.retencionTrabajoAeat.anio/fechaPago/perfilTemporal", "tabla finita VERSIONES_RETENCION, find primer intervalo inclusivo"],
    ["dependencias", "LiquidacionIrpfAnual.layer", "cuatro servicios; implementaciones arbitrarias quedan fuera del contrato"],
  ].map(([parameter, publicOrigin, transport]) => ({ parameter, publicOrigin, transport }))
  const ports = [
    ["caso", "CasoFiscalAnual", "public-input"], ["contexto", "ContextoLiquidacionIrpf", "public-input"],
    ["entradaLegacy", "EntradaCalculoSalarioLegacy", "public-input"],
    ["entradaExplicita", "CasoFiscalAnualExplicito", "public-input"],
    ["derechos", "caso.derechosMinimos", "argument"], ["subcaso", "caso.retencionTrabajoAeat", "argument"],
    ["servicio", "LiquidacionIrpfAnual.liquidar", "service-instance"],
    ["retencion", "RetencionTrabajoAeat.calcular", "service-instance"],
    ["success", "LiquidacionIrpfAnualCalculada", "result"], ["fail", "ResultadoNoSoportado", "error-channel"],
  ].map(([id, property, instance]) => ({ id, property, instance, unit: "structural", role: "admission" }))
  const edges = [
    { from: "entradaLegacy", to: "caso", transport: "casoFiscalLegacy: año directo; territorio ?? simulada-estatal; edad 40; perfil ?? soltero_sin_hijos; salario en único trabajo; retenciones/pagos 0; sin derechos; subcaso solo si perfilAuditoria o seleccionRetencion presentes", evidence: bindings.filter((b) => b.owner === "calcularSalarioLegacyConLiquidacionIrpfAnual").map((b) => b.id) },
    { from: "caso", to: "derechos", transport: "identidad sin reconstrucción; ConDerechos valida antes de guarda de ejercicio anual" },
    { from: "caso", to: "subcaso", transport: "identidad completa; no copia renta, SS, familiares ni pagos del anual" },
    { from: "subcaso", to: "retencion", transport: "argumento 0 idéntico; argumento 1 contexto idéntico; solo si !== undefined", evidence: bindings.filter((b) => b.callee === "dependencias.retencionTrabajoAeat.calcular").map((b) => b.id) },
    { from: "contexto", to: "retencion", transport: "modo sin traducción; canonico selecciona versión, compatible-legacy prohíbe fecha/perfil" },
    { from: "servicio", to: "success", transport: "todas las operaciones previas concluyen; sin recuperación de Effect.fail; los sitios se construyen después del subservicio" },
    { from: "retencion", to: "fail", transport: "Effect.fail propagado sin convertirse en éxito; no hay sitios anuales en resultado rechazado" },
    { from: "entradaExplicita", to: "success", transport: "NO EDGE: resultado ExplicitaCalculada, sitios anual.explicito.*, ninguno de estos 17", reachable: false },
  ]
  return { version: 1, kind: "annual-public-admission-fragment", contractId, sources: pins,
    ports, edges, predicates, bodies, bindings, parameterBindings,
    admissionProgram: [
      { id: "pre-ConDerechos", when: "api == liquidarIrpfAnualConDerechos", operation: "schema-and-coherence", input: "caso.derechosMinimos", expand: bodies.filter((b) => b.id.startsWith(rights) || b.id.startsWith(pins[2].path)).map((b) => b.id), onFailure: "Effect.fail(errorDerechosMinimos); stop", next: "ejercicio", context: "canonico" },
      { id: "ejercicio", when: "true", rejectIf: "caso.retencionTrabajoAeat !== undefined && caso.retencionTrabajoAeat.anio !== caso.anio", onFailure: "Effect.fail(ResultadoNoSoportado); stop", next: "derechos" },
      { id: "derechos", when: "caso.derechosMinimos !== undefined", operation: "schema-and-coherence", input: "caso.derechosMinimos", expand: bodies.filter((b) => b.id.startsWith(rights) || b.id.startsWith(pins[2].path)).map((b) => b.id), rejectIf: "hayAlimentosPropiosSinMinimo(validado) || incompatible(contexto,caso,validado)", predicateRefs: predicates.filter((p) => p.owner === "construirLiquidarIrpfAnual").map((p) => p.id), onFailure: "Effect.fail(errorDerechosMinimos); stop", next: "deducciones" },
      { id: "deducciones", when: "caso.deducciones.length !== 0", operation: "lookup first non-nullish entry only", input: "caso.deducciones[0].codigo", service: "dependencias.parametrosNormativos.obtenerDeduccionAutonomicaCatalogada", output: "Option.some(ResultadoNoSoportado) si primer elemento no nullish; Option.none si nullish", onSome: "Effect.fail; stop", next: "netos" },
      { id: "netos", when: "true", operation: "value-boundary", input: "caso.rendimientos; caso.anio; contexto.modo", output: "rendimientoTrabajo.rendimientoNeto + otrasRentasNoExentas", next: "renta" },
      { id: "renta", when: "caso.derechosMinimos !== undefined", operation: "validate-income", expand: bodies.filter((b) => b.id.endsWith("#validarRentasAnualesDerechos")).map((b) => b.id), input: "derechos y netos", onFailure: "Effect.fail(errorDerechosMinimos); stop", next: "territorio" },
      { id: "territorio", when: "true", operation: "pure-selector", input: "anio,comunidadAutonoma,baseLiquidableGeneral,fechaFallecimiento del caso y valor calculado", rejectIf: "resultadoParametrosComunidad._tag == ComunidadAutonomaNoSoportada", onFailure: "Effect.fail(ResultadoNoSoportado); stop", next: "empate" },
      { id: "empate", when: "caso.derechosMinimos !== undefined", operation: "validate-again-and-order", expand: bodies.filter((b) => b.id.endsWith("#calcularDerechosMinimos")).map((b) => b.id), input: "caso.derechosMinimos; minimosEstatales y parametrosComunidad.minimosAutonomicos", rejectIf: "elegibles distintos con misma fechaNacimiento y titulares.length distinto", onFailure: "Effect.fail(errorDerechosMinimos); stop", next: "subservicio" },
      { id: "subservicio", when: "caso.retencionTrabajoAeat !== undefined", operation: "service", input: ["caso.retencionTrabajoAeat", "contexto"], expand: bodies.filter((b) => b.id.startsWith(retention) || b.id.startsWith(versions)).map((b) => b.id), onFailure: "Effect.fail propagado; stop", next: "salida" },
      { id: "salida", when: "previous executed operations succeeded", operation: "construct-result", output: "11 SS y 2 pagos; 4 retencion iff resultado subservicio !== undefined", return: "LiquidacionIrpfAnualCalculada", onDefect: "Cause.die; sin resultado anual" },
    ],
    evaluationOrder: [
      "ConDerechos: decode y coherencia de derechos antes de invocar anual canónico; API ordinaria comienza por ejercicio",
      "retencion.anio == caso.anio si existe; Effect.fail antes de validar derechos",
      "derechos: schema cerrado -> sujetos únicos -> por descendiente nacimiento/edad -> titulares únicos/contribuyente presente -> custodia coherente -> por titular renta/residencia -> residente propio -> exclusiva/convivencia -> sujeto no titular -> especialidad alimentos -> grado/vínculo -> fechas/incremento/constitución/mayoría -> concurrencia de grados",
      "alimentos propios sin mínimo -> compatibilidad modo/año/territorio/fallecimiento/familia/discapacidad",
      "deducciones.length == 0 evita catálogo; si no, solo primer elemento: Option.none o some cambian motivo, ambos fallan",
      "cálculo netos -> validarRentasAnualesDerechos: conciliación presente -> renta finita -> céntimos half-up e igualdad y mismo lado 8000 para cada titular propio",
      "selector territorial puro (no servicio inyectado); 2012..2025 resuelven; 2026 solo simulada-estatal; demás años ResultadoNoSoportado",
      "calcularDerechosMinimos estatal y autonómico: revalidación, selección por derecho, orden nacimiento/id; empate fecha y divisor distinto falla",
      "retención opcional: calculable -> regularización -> legacy temporal (retorno temprano) -> versión -> irregular1 -> manuales -> filtro hijos -> situación1 vacía -> éxito",
      "pagos agregados y resultado -> creación 11 SS + 2 pagos siempre; 4 retención solo si subservicio devuelve valor; enlazarRastroAnualActual",
    ],
    dependencies: {
      rightsEligibility: "cumpleRentas <=800000 y no-presenta o declaración <=180000; edad<25 o discapacidad; residente y relación distinta ninguna o compartida, excluye judicial sin custodia; grado mínimo salvo dos grados y todos próximos <=800000; entonces siguientes. Alimentos propios sin titular propio seleccionado bloquean anual.",
      rightsIncome: "neto trabajo + neto alquiler simplificado + ganancias sujetas general + ahorro, antes de reducciones/compensaciones; no es bruto ni base liquidable. Puertos value externos para esas magnitudes; fórmula ajena no se cierra aquí.",
      retentionRange: "edad opcional entero seguro >=0; retribución y SS obligatorias enteros seguros >=0; 4 importes opcionales undefined o enteros seguros >=0; familiar !=general; laboral y contrato strings (NO enum runtime); hijos/ascendientes arrays; edades enteras seguras >=0; convivencia ascendiente entera segura >0; situación1 exige hijo antes y después filtro canónico edad<25 o discapacidad !=sin-discapacidad. No se validan todos los flags/enums runtime.",
      temporal: "tabla VERSIONES_RETENCION cerrada; fecha y perfil simultáneos rechazan; calendario gregoriano y año exacto; intervalo inclusivo; cierre busca hasta año-12-31; sin selección solo intervalo único año completo. 2012..2016 sin versión, 2026 únicamente 09-10..10-29 y sin cierre. Legacy retorna antes de versión, tope irregular/manuales/filtro canónico.",
      injection: "LiquidacionIrpfAnual.layer proporciona cuatro servicios propios con provideMerge; wrapper público vuelve a proporcionar layer. Inyectar LiquidacionIrpfAnual sustituye el algoritmo entero solo si consumidor accede al servicio; no garantiza estos sitios. CotizacionesSociales y PoliticaMonetaria capturados pero no usados en cuerpo simple; SS y conversión puras. ParametrosNormativos solo mínimos estatales fallback y catálogo primera deducción; selector territorial puro. RetencionTrabajoAeat.calcular capturado y ejecutado condicionalmente. No se atribuye su contrato a implementación arbitraria inyectada.",
      explicit: "Madrid 2025 individual 18..64, contratos cerrados y adaptadores trabajo/EDS efectivamente conectados en ruta separada. Cualquier resultado suyo, éxito o rechazo, tiene intersección vacía con estos siteIds. No es necesario cerrar fórmulas ni admisión de esa ruta para demostrar no alcance, ver AST de todos los siteId de conexion.ts.",
      domain: "CasoFiscalAnual es interfaz TS sin decode general: régimen no es campo anual, reducciones no se leen, rangos importes/edad y elegibilidad SS uniforme no son guardas anuales. Fallos por acceso/Decimal/Match son defectos, no Effect.fail editorial. La presencia se predica del éxito efectivamente devuelto, no de validez jurídica inferida.",
    },
    sites: siteIds.map((siteId) => ({ siteId, contractId, role: "admission", evidence: anchors.get(siteId), predicateRefs: predicates.filter((p) => p.owner !== "liquidarIrpfAnualExplicito").map((p) => p.id), admissionPredicate: siteId.startsWith("anual.retencion.") ? "annual-success && caso.retencionTrabajoAeat !== undefined && subservice-success" : "annual-success", reachableApis: ["liquidarIrpfAnual", "liquidarIrpfAnualConDerechos", "LiquidacionIrpfAnual.layer.liquidar", "CompatibilidadSalarioLegacy.layer.calcular (interno; salida pública proyecta y pierde rastro)", "calcularSalarioLegacy (sitios internos; salida pública sin rastro)"], neverApis: ["liquidarIrpfAnualExplicito", "calcularRetencionTrabajoAeat (aislada)"], admissionClosed: true, valueClosed: false, selectionClosed: false, siteClosed: false })),
    unresolved: [], completeRuleAcceptance: false, wiringAllowed: false,
  }
}

export function verifyAdmissionFragment(fragment) {
  const expected = buildAdmissionFragment()
  if (JSON.stringify(fragment) !== JSON.stringify(expected)) throw new Error("Contrato distinto de la reconstrucción fijada")
  return true
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fragment = buildAdmissionFragment()
  const path = resolve(root, directory, "fragmento.json")
  if (process.argv[2] === "write") writeFileSync(path, JSON.stringify(fragment, null, 2) + "\n")
  else verifyAdmissionFragment(JSON.parse(readFileSync(path, "utf8")))
}

/** Predicado contractual independiente de fórmulas; solo entradas tipadas del subservicio. */
export function evaluateRetentionAdmission(caso, contexto) {
  verifySources()
  const visited = []
  const step = (id, passed) => { visited.push({ id, passed }); return passed }
  const result = (outcome, guard, version = null) => ({ outcome, guard, version, visited })
  const integer = (x) => Number.isSafeInteger(x) && x >= 0
  if (!step("calculable", (caso.edad === undefined || integer(caso.edad)) &&
    Number.isSafeInteger(caso.retribucionAnualCentimos) && caso.retribucionAnualCentimos >= 0 &&
    integer(caso.cotizacionesCentimos) &&
    [caso.irregular1Centimos, caso.irregular2Centimos, caso.pensionCompensatoriaConyugeCentimos, caso.anualidadesAlimentosHijosCentimos].every((v) => v === undefined || integer(v)) &&
    caso.situacionFamiliar !== "general" &&
    String(caso.situacionLaboral) === caso.situacionLaboral &&
    String(caso.contrato) === caso.contrato &&
    Array.isArray(caso.descendientes) && Array.isArray(caso.ascendientes) &&
    caso.descendientes.every((d) => integer(d.edad)) &&
    caso.ascendientes.every((a) => integer(a.edad) && integer(a.convivencia) && a.convivencia > 0) &&
    !(caso.situacionFamiliar === "situacion1" && caso.descendientes.length === 0))) return result("Effect.fail", "calculable")
  if (!step("inicial", caso.procedimiento !== "regularizacion")) return result("Effect.fail", "regularizacion")
  if (contexto.modo === "compatible-legacy") {
    if (!step("legacy-sin-temporal", caso.fechaPago === undefined && caso.perfilTemporal === undefined)) return result("Effect.fail", "legacy-temporal")
    return result("success", null, "compatible-legacy")
  }
  const sf = source(versions)
  const table = declarations(sf).find((n) => n.name.text === "VERSIONES_RETENCION").initializer
  const rows = table.elements.map((item) => Object.fromEntries(item.properties.map((p) => [p.name.getText(sf), ts.isNumericLiteral(p.initializer) ? Number(p.initializer.text) : p.initializer.text])))
  const annualRows = rows.filter((row) => row.anio === caso.anio)
  let version
  if (caso.fechaPago !== undefined) {
    const value = caso.fechaPago
    const year = caso.anio
    const month = Number(value.slice(5, 7)), day = Number(value.slice(8, 10))
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (caso.perfilTemporal === undefined && /^\d{4}-\d{2}-\d{2}$/.test(value) && value.startsWith(`${year}-`) && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1]) version = annualRows.find((row) => value >= row.desde && value <= row.hasta)
  } else if (caso.perfilTemporal === "cierre") version = annualRows.find((row) => row.hasta === `${caso.anio}-12-31`)
  else if (annualRows.length === 1 && annualRows[0].desde === `${caso.anio}-01-01` && annualRows[0].hasta === `${caso.anio}-12-31`) version = annualRows[0]
  if (!step("version", version !== undefined)) return result("Effect.fail", "version")
  const irregular = BigInt(caso.irregular1Centimos ?? 0)
  if (!step("irregular1", irregular <= 9000000n && irregular * 10n <= BigInt(caso.retribucionAnualCentimos) * 3n)) return result("Effect.fail", "irregular1")
  if (!step("contrato", caso.contrato !== "manuales")) return result("Effect.fail", "manuales")
  const children = caso.descendientes.filter((d) => d.edad < 25 || d.discapacidad !== "sin-discapacidad")
  if (!step("familia-filtrada", caso.situacionFamiliar !== "situacion1" || children.length !== 0)) return result("Effect.fail", "familia-filtrada")
  return result("success", null, version.id)
}
