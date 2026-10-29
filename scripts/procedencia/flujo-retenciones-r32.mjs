import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { createRequire } from "node:module"
import { createHash } from "node:crypto"
import { gzipSync } from "node:zlib"
import { pathToFileURL } from "node:url"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const ts = require("typescript")
export const baseR32 = "846f25e183ba07414065d4e6bdf9e98311b98a17"
const annual = "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts"
const retention = "lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts"
const catalog = "lib/dominio/irpf/retenciones/versiones/catalogo.ts"
const tables =
  "lib/dominio/normativa/datos/irpf-retenciones-trabajo-2012-2026.ts"
const money = "lib/dominio/dinero/importe-monetario.ts"
const rounding = "lib/dominio/dinero/redondeo.ts"
const files = [annual, retention, catalog, tables, money, rounding]
const sha = (b) => createHash("sha256").update(b).digest("hex")
function nodes(root, predicate) {
  const result = []
  function visit(n) {
    if (predicate(n)) result.push(n)
    ts.forEachChild(n, visit)
  }
  visit(root)
  return result
}
/** Contrato de fuentes externo al artefacto: los blobs de la base fijada son el ancla.
 * root permite mutaciones en scratch, nunca actualiza los pins automáticamente. */
export function composeRetencionesR32(root = process.cwd()) {
  const sources = [],
    asts = new Map()
  for (const file of files) {
    const bytes = fs.readFileSync(path.join(root, file))
    const pinned = execFileSync(
      "git",
      ["cat-file", "blob", baseR32 + ":" + file],
      { maxBuffer: 8 * 1024 * 1024 }
    )
    if (!bytes.equals(pinned))
      throw Error("Contrato de fuente R32 cambiado: " + file)
    sources.push({ file, sha256: sha(bytes) })
    asts.set(
      file,
      ts.createSourceFile(file, bytes.toString(), ts.ScriptTarget.Latest, true)
    )
  }
  const ref = (n) => ({
    file: n.getSourceFile().fileName,
    sha256: sources.find((s) => s.file === n.getSourceFile().fileName).sha256,
    start: n.getStart(),
    end: n.end,
    syntax: ts.SyntaxKind[n.kind],
    offsetEncoding: "utf16",
  })
  function decl(name, file = retention) {
    let found = nodes(
      asts.get(file),
      (n) =>
        (ts.isVariableDeclaration(n) ||
          ts.isFunctionDeclaration(n) ||
          ts.isClassDeclaration(n)) &&
        n.name?.getText() === name
    )
    if (file === annual && name === "retencionTrabajoAeat")
      found = found.filter(
        (n) => n.initializer && ts.isConditionalExpression(n.initializer)
      )
    if (found.length !== 1)
      throw Error("Declaración ambigua " + file + ":" + name)
    return found[0]
  }
  const anchor = (name, file = retention) => ref(decl(name, file))
  const ports = [],
    edges = []
  function port(
    id,
    unit,
    formula,
    name,
    values = [],
    selectors = [],
    file = retention
  ) {
    const source = anchor(name, file)
    ports.push({
      id,
      property: name,
      instance:
        file === annual
          ? "annual-public"
          : file === catalog
            ? "retention-version"
            : "retention-concrete",
      unit,
      formula,
      source,
      terminal: values.length + selectors.length === 0,
    })
    for (const from of values)
      edges.push({
        from,
        to: id,
        role: "value",
        condition: "rama del cuerpo fijado; véanse contratos",
        source,
      })
    for (const from of selectors)
      edges.push({
        from,
        to: id,
        role: "selection",
        condition: "predicados ordenados del cuerpo fijado",
        source,
      })
  }
  // Terminales son propiedades del argumento público, no parámetros de helpers.
  port(
    "A.subcaso",
    "CasoRetencionTrabajo?",
    "caso.retencionTrabajoAeat; ausencia no invoca el servicio",
    "retencionTrabajoAeat",
    [],
    [],
    annual
  )
  port(
    "A.contexto",
    "ModoCalculo",
    "contexto.modo del API anual, pasado sin reconstrucción",
    "construirLiquidarIrpfAnual",
    [],
    [],
    annual
  )
  port(
    "A.declarados",
    "centimos",
    "caso.pagosACuentaCentimos; separado de soportadas",
    "pagosACuentaAplicadosCentimos",
    [],
    [],
    annual
  )
  port(
    "A.rawSoportadas",
    "centimos",
    "caso.retencionesSoportadasCentimos",
    "liquidarTrabajoIndividualSimple",
    [],
    [],
    annual
  )
  port(
    "P.centimos",
    "conversion",
    "Decimal(c)/100; HALF_UP(EUR,2)*100.toNumber al volver",
    "centimosAEuros",
    [],
    [],
    money
  )
  port(
    "P.redondeo",
    "conversion",
    "toDecimalPlaces(n,ROUND_HALF_UP); truncado ROUND_DOWN",
    "redondearHalfUp",
    [],
    [],
    rounding
  )
  port(
    "R.modo",
    "ModoCalculo",
    "contexto.modo === compatible-legacy; rama antes de catálogo",
    "calcularRetencionTrabajoAeatImpl",
    [],
    ["A.contexto"]
  )
  port(
    "R.version",
    "VersionRetencion?",
    "legacy:undefined; canónico: filtro año, calendario civil, intervalo inclusivo; fecha y cierre excluyentes; sin selector solo ventana anual única",
    "seleccionarVersionRetencion",
    ["A.subcaso"],
    ["R.modo"],
    catalog
  )
  port(
    "R.descendientes",
    "familia[]",
    "canónico: filter(edad<25||discapacidad!=sin); legacy: array original. Cardinalidad resultante para todos los conteos",
    "calcularRetencionTrabajoAeatImpl",
    ["A.subcaso"],
    ["R.modo"]
  )
  port(
    "R.R",
    "EUR",
    "centimosAEuros(caso.retribucionAnualCentimos)",
    "retribucion",
    ["A.subcaso", "P.centimos"]
  )
  port(
    "R.C",
    "EUR",
    "centimosAEuros(caso.cotizacionesCentimos); no SS anual",
    "cotizaciones",
    ["A.subcaso", "P.centimos"]
  )
  for (const [id, name] of [
    ["I1", "irregular1"],
    ["I2", "irregular2"],
    ["alimentos", "anualidades"],
    ["compensatoria", "pensionCompensatoria"],
  ])
    port(
      "R." + id,
      "EUR",
      "importeOpcional(campo de subcaso): centimosAEuros(c??0)",
      name,
      ["A.subcaso", "P.centimos"]
    )
  port(
    "R.gastos",
    "EUR",
    "min(2000+movilidad2000+discapacidad activa3500/7750,R-C), cero si R-C<0",
    "calcularOtrosGastos",
    ["R.R", "R.C"],
    ["A.subcaso"]
  )
  port("R.neto", "EUR", "max(0,R-I1-I2-C)", "rendimientoNetoTrabajo", [
    "R.R",
    "R.I1",
    "R.I2",
    "R.C",
  ])
  port(
    "R.reduccion",
    "EUR",
    "antigua=max(0,3700-max(0,N-11250)*1.15625); nueva=max(0,5565-max(0,N-13115)*1.5); media2018=(antigua+nueva)/2; 2023:6498/14047.5/1.14; actual tramos14852,17673.52,19747.5; HALF_UP2",
    "calcularReduccionTrabajo",
    ["R.neto", "P.redondeo"],
    ["R.version"]
  )
  port(
    "R.netoReducido",
    "EUR",
    "max(0,neto-gastos-reduccion)",
    "rendimientoNetoReducido",
    ["R.neto", "R.gastos", "R.reduccion"]
  )
  port(
    "R.laboral",
    "EUR-componentes",
    "pensionista600; desempleado1200; hijos600 si length>2; condiciones distintas",
    "reduccionPorSituacionLaboral",
    [],
    ["A.subcaso", "R.descendientes"]
  )
  port(
    "R.reducciones",
    "EUR",
    "laboral.pensionista+laboral.hijos+laboral.desempleado+compensatoria",
    "reducciones",
    ["R.laboral", "R.compensatoria"]
  )
  port("R.base", "EUR", "max(0,netoReducido-reducciones)", "baseRetencion", [
    "R.netoReducido",
    "R.reducciones",
  ])
  port(
    "R.minDesc",
    "EUR",
    "sort edad descendente; reduce cero: cuantia(indice)*multiplicador(entero1/medio.5); otro reduce2800 si menor3 o adopcion; HALF_UP2 de cada suma",
    "calcularMinimoDescendientes",
    ["P.redondeo"],
    ["R.descendientes"]
  )
  port(
    "R.minAsc",
    "EUR",
    "reduce desde0:1150/convivencia si edad>=65 o discapacidad; otro1400/convivencia si edad>=75; HALF_UP2 por grupo",
    "calcularMinimoAscendientes",
    ["A.subcaso", "P.redondeo"]
  )
  port(
    "R.minDis",
    "EUR",
    "9000/3000/0 discapacidad; asistencia3000 con desde65 o de33a65+movilidad. Hijos multiplicador; ascendientes /convivencia; redondeos por grupo, no elemento",
    "calcularMinimoDiscapacidad",
    ["A.subcaso", "P.redondeo"],
    ["R.descendientes"]
  )
  port(
    "R.minimo",
    "EUR",
    "5550+(edad??40>=75?2550:>=65?1150:0)+minDesc+minAsc+minDis",
    "calcularMinimoPersonalFamiliar",
    ["R.minDesc", "R.minAsc", "R.minDis"],
    ["A.subcaso"]
  )
  port(
    "R.tabla",
    "EUR-tabla",
    "legacy fecha undefined:último período. Fecha=version.desde;2018>=jul5 pensionista/desempleado:tabla especial; otro find desde<=fecha<=hasta o hasta ausente",
    "tablaUmbralesRetencionTrabajo",
    [],
    ["R.version", "A.subcaso"],
    tables
  )
  port(
    "R.umbral",
    "EUR",
    "tabla[situacionFamiliar][length<=0?sinDescendientes:length==1?unDescendiente:dosOMasDescendientes]; null lanza, no0",
    "umbralRetencionTrabajoRequeridoEuros",
    ["R.tabla"],
    ["R.descendientes", "A.subcaso"],
    tables
  )
  port(
    "R.maxUmbral",
    "EUR",
    "Math.max de las9 celdas de tabla, filter null; no mezcla versiones",
    "maximoUmbralRetencionTrabajoEuros",
    ["R.tabla"],
    [],
    tables
  )
  port(
    "R.umbralAjustado",
    "EUR",
    "umbral+laboral.pensionista+laboral.desempleado; no600hijos",
    "umbralConReducciones",
    ["R.umbral", "R.laboral"]
  )
  port(
    "R.maxAjustado",
    "EUR",
    "maxUmbral+laboral.pensionista+laboral.desempleado",
    "umbralMaximoConReducciones",
    ["R.maxUmbral", "R.laboral"]
  )
  port(
    "R.exento",
    "boolean",
    "R<=maxAjustado && R<=umbralAjustado",
    "exento",
    [],
    ["R.R", "R.maxAjustado", "R.umbralAjustado"]
  )
  port(
    "R.escala",
    "EUR-function",
    "E(x):version definida año<=2020 y x>=60000:17901.5+(x-60000)*.45; otro reverse/find desde<=x sobre seis tramos; fallback tramo0. cuota+(x-desde)*tipo; resto no consumido",
    "calcularCuotaEscala",
    [],
    ["R.version"]
  )
  port(
    "R.cuotaInicial",
    "EUR",
    "exento?0:max(0,E(base-A)+E(A)-E(minimo+1980)) si0<A<base; otro max(0,E(base)-E(minimo))",
    "cuotaRetencionInicial",
    ["R.base", "R.alimentos", "R.minimo", "R.escala"],
    ["R.exento"]
  )
  port(
    "R.limite43",
    "EUR",
    "exento o R>techo?cuotaInicial:max(0,(R-umbralAjustado)*.43); techo22000 si version<2023 o reduccion2019, otro35200",
    "calcularLimite43",
    ["R.cuotaInicial", "R.R", "R.umbralAjustado"],
    ["R.exento", "R.version"]
  )
  port("R.cuota", "EUR", "min(cuotaInicial,limite43)", "cuotaRetencion", [
    "R.cuotaInicial",
    "R.limite43",
  ])
  port(
    "R.ceuta",
    "boolean",
    "residenciaCeutaMelilla===true && rendimientosCeutaMelilla===true",
    "ceutaMelilla",
    [],
    ["A.subcaso"]
  )
  port(
    "R.vivienda",
    "EUR",
    "flag true && R<33007.2 ? truncar(R*.02,2):0",
    "calcularMinoracionVivienda",
    ["R.R", "P.redondeo"],
    ["A.subcaso"]
  )
  port(
    "R.diferencia",
    "EUR",
    "max(0,cuota*(ceuta?version2017/enero2018?.5:.4:1)-vivienda)",
    "calcularDiferenciaPositiva",
    ["R.cuota", "R.vivienda"],
    ["R.ceuta", "R.version"]
  )
  port(
    "R.tipoInicial",
    "percent",
    "R<=0?0:ROUND_DOWN(diferencia/R*100,2)",
    "calcularTipoInicial",
    ["R.diferencia", "R.R", "P.redondeo"]
  )
  port(
    "R.tipo",
    "percent",
    "mínimo por contrato especial/inferior:15/2 noCeuta;8/1 Ceuta version<2019;6/.8 Ceuta otro; conserva mayor calculado",
    "aplicarMinimoContrato",
    ["R.tipoInicial"],
    ["R.ceuta", "R.version", "A.subcaso"]
  )
  port(
    "R.importe",
    "EUR",
    "HALF_UP(R*tipo/100,2); CIEN literal100",
    "importeRetencion",
    ["R.R", "R.tipo", "P.redondeo"]
  )
  port(
    "R.resultado",
    "RetencionTrabajoCalculada",
    "retorno éxito: base/cuota/importe→aCentimos; tipo→toFixed(2); anio del subcaso y version.id o compatible-legacy",
    "calcularRetencionTrabajo",
    ["R.base", "R.cuota", "R.tipo", "R.importe", "P.centimos"],
    ["R.version"]
  )
  for (const [suffix, field, from] of [
    ["base", "baseRetencionCentimos", "R.base"],
    ["cuota", "cuotaRetencionCentimos", "R.cuota"],
    ["tipo", "tipoRetencionPorcentaje", "R.tipo"],
    ["anual", "importeRetencionAnualCentimos", "R.importe"],
  ]) {
    const property = nodes(
      decl("calcularRetencionTrabajo"),
      (n) => ts.isPropertyAssignment(n) && n.name.getText() === field
    )
    if (property.length !== 1) throw Error("Retorno ambiguo " + field)
    const id = "R.return." + suffix,
      source = ref(property[0])
    ports.push({
      id,
      property: field,
      instance: "retention-concrete-success",
      unit: suffix === "tipo" ? "percent-string" : "centimos",
      formula: property[0].initializer.getText(),
      source,
      terminal: false,
    })
    edges.push({
      from,
      to: id,
      role: "value",
      condition: "retorno de éxito del servicio concreto",
      source,
    })
    if (suffix !== "tipo")
      edges.push({
        from: "P.centimos",
        to: id,
        role: "value",
        condition: "eurosACentimos HALF_UP2 y multiplicación100",
        source,
      })
  }
  port(
    "A.estimate",
    "centimos",
    "ausente:0; éxito:resultado.importeRetencionAnualCentimos; fail:sin salida",
    "retencionTrabajoAeatCentimos",
    ["R.return.anual"],
    ["A.subcaso"],
    annual
  )
  port(
    "A.cuenta",
    "EUR",
    "centimosAEuros(caso.pagosACuentaCentimos+estimate)",
    "pagosACuentaAplicadosCentimos",
    ["A.declarados", "A.estimate", "P.centimos"],
    [],
    annual
  )
  port(
    "A.soportadas",
    "EUR",
    "centimosAEuros(caso.retencionesSoportadasCentimos)",
    "liquidarTrabajoIndividualSimple",
    ["A.rawSoportadas", "P.centimos"],
    [],
    annual
  )
  for (const suffix of ["base", "cuota", "tipo", "anual"])
    port(
      "A." + suffix,
      suffix === "tipo" ? "percent" : "EUR",
      suffix === "tipo"
        ? "Decimal(tipo.toFixed(2)), sin factor100"
        : "centimosAEuros(aCentimos(valorEUR)); HALF_UP2 antes de retorno",
      "pasoRetencionTrabajoAeat",
      ["R.return." + suffix, ...(suffix === "tipo" ? [] : ["P.centimos"])],
      ["A.subcaso"],
      annual
    )

  const catalogArray = decl("VERSIONES_RETENCION", catalog).initializer
  if (!ts.isArrayLiteralExpression(catalogArray))
    throw Error("Catálogo no literal")
  for (const entry of catalogArray.elements) {
    const fields = new Map(
      entry.properties.map((p) => [p.name.getText(), p.initializer])
    )
    const id = "V." + fields.get("id").text
    const source = ref(entry)
    ports.push({
      id,
      property: "version",
      instance: fields.get("id").text,
      unit: "version-record",
      formula: JSON.stringify(
        Object.fromEntries(
          [...fields].map(([k, v]) => [k, v.text ?? v.getText()])
        )
      ),
      source,
      terminal: true,
    })
    edges.push({
      from: id,
      to: "R.version",
      role: "value",
      condition:
        "solo canónico; filtro anio y selección fecha/cierre/sinSelector ejecutados por seleccionarVersionRetencion; nunca legacy",
      source,
    })
  }
  // Celdas monetarias finitas: cada campo conserva su clave; no agrega por homonimia.
  for (const d of nodes(
    asts.get(tables),
    (n) =>
      ts.isVariableDeclaration(n) &&
      n.name.getText().startsWith("UMBRALES_RETENCION_") &&
      n.name.getText() !== "UMBRALES_RETENCION_NOMINA_POR_ANIO"
  )) {
    let object = d.initializer
    while (ts.isAsExpression(object) || ts.isSatisfiesExpression(object))
      object = object.expression
    if (!ts.isObjectLiteralExpression(object)) throw Error("Tabla no literal")
    for (const row of object.properties)
      for (const cell of row.initializer.properties) {
        const id =
          "T." +
          d.name.getText() +
          "." +
          row.name.getText() +
          "." +
          cell.name.getText()
        const source = ref(cell.initializer)
        ports.push({
          id,
          property: row.name.getText() + "." + cell.name.getText(),
          instance: d.name.getText(),
          unit: "EUR-or-null",
          formula: cell.initializer.getText(),
          source,
          terminal: true,
        })
        edges.push({
          from: id,
          to: "R.umbral",
          role: "value",
          condition:
            "tabla seleccionada === " +
            d.name.getText() +
            " && situacionFamiliar === " +
            row.name.getText() +
            " && columna(length) === " +
            cell.name.getText(),
          source,
        })
        if (cell.initializer.kind !== ts.SyntaxKind.NullKeyword)
          edges.push({
            from: id,
            to: "R.maxUmbral",
            role: "value",
            condition:
              "tabla seleccionada === " +
              d.name.getText() +
              "; max de todas sus celdas no nulas",
            source,
          })
      }
  }
  // Contratos finitos de funciones alcanzadas: parámetros y argumentos no son terminales.
  const selected = new Map([
    [
      retention,
      [
        "importeOpcional",
        "multiplicadorDescendiente",
        "incrementoMovilidadGeografica",
        "incrementoGastosDiscapacidadTrabajador",
        "calcularOtrosGastos",
        "calcularReduccionActual",
        "reduccionLineal",
        "calcularReduccionTrabajo",
        "cuantiaMinimoDescendiente",
        "esDescendienteMenorTres",
        "calcularMinimoDescendientes",
        "calcularMinimoAscendientes",
        "minimoDiscapacidad",
        "minimoAsistencia",
        "calcularMinimoDiscapacidad",
        "calcularMinimoPersonalFamiliar",
        "calcularCuotaEscala",
        "calcularCuotaRetencion",
        "reduccionPorSituacionLaboral",
        "cuotaRetencionInicial",
        "calcularLimite43",
        "calcularMinoracionVivienda",
        "calcularDiferenciaPositiva",
        "calcularTipoInicial",
        "aplicarMinimoContrato",
        "calcularRetencionTrabajo",
        "calcularRetencionTrabajoAeatImpl",
        "esCasoCalculable",
        "resultadoNoSoportadoRetencion",
        "aCentimos",
        "truncar",
        "max",
        "min",
        "euros",
        "porcentaje",
        "formulaCuotaRetencion",
      ],
    ],
    [catalog, ["seleccionarVersionRetencion"]],
    [
      tables,
      [
        "tablaVigenteAlCierreDelAnio",
        "tablaUmbralesRetencionTrabajo",
        "umbralPorDescendientes",
        "umbralRetencionTrabajoEuros",
        "umbralRetencionTrabajoRequeridoEuros",
        "maximoUmbralRetencionTrabajoEuros",
        "esFechaCivilDelAnio",
      ],
    ],
    [
      money,
      [
        "centimosAEuros",
        "crearImporteMonetario",
        "eurosACentimos",
        "redondearImporteLiquidado",
        "truncarImporteMonetario",
      ],
    ],
    [rounding, ["redondearHalfUp", "truncarDecimal"]],
  ])
  const functionOf = (d) => {
    const n = d.initializer ?? d
    if (ts.isFunctionLike(n)) return n
    const found = nodes(n, ts.isFunctionExpression)
    if (found.length === 1) return found[0]
    throw Error("Forma de función fuera del contrato " + d.name.getText())
  }
  const functions = new Map()
  for (const [file, names] of selected)
    for (const name of names)
      functions.set(file + ":" + name, functionOf(decl(name, file)))
  const methods = new Set([
    "pipe",
    "value",
    "when",
    "orElse",
    "number",
    "string",
    "plus",
    "minus",
    "mul",
    "div",
    "lt",
    "lte",
    "gt",
    "gte",
    "toFixed",
    "toNumber",
    "toDecimalPlaces",
    "max",
    "min",
    "isSafeInteger",
    "isArray",
    "every",
    "filter",
    "find",
    "sort",
    "reduce",
    "reverse",
    "slice",
    "startsWith",
    "test",
    "annotateCurrentSpan",
    "fail",
    "fn",
  ])
  const contracts = []
  for (const [id, fn] of functions) {
    const file = fn.getSourceFile().fileName
    const calls = nodes(fn.body, ts.isCallExpression).map((call) => {
      const name = call.expression.getText()
      let target = null
      if (ts.isIdentifier(call.expression)) {
        const candidates =
          name === "redondear1"
            ? [money + ":redondearImporteLiquidado"]
            : [...functions.keys()].filter((key) => key.endsWith(":" + name))
        if (name === "Number") {
          target = null
        } else {
          if (candidates.length !== 1)
            throw Error("Llamada no resuelta " + id + " " + name)
          target = candidates[0]
        }
      } else if (ts.isPropertyAccessExpression(call.expression)) {
        if (!methods.has(call.expression.name.text))
          throw Error("Operación sin contrato " + name)
      } else if (!name.startsWith("Effect.fn("))
        throw Error("Llamada indirecta fuera del contrato " + name)
      const formal = target ? functions.get(target) : null
      return {
        source: ref(call),
        target: target ?? "primitive:" + name,
        arguments: call.arguments.map((arg, index) => ({
          index,
          argument: ref(arg),
          formal: formal?.parameters[index]
            ? ref(formal.parameters[index])
            : null,
          properties: ts.isObjectLiteralExpression(arg)
            ? arg.properties.map((p) => ({
                property: p.name?.getText() ?? "spread",
                source: ref(p),
                formalProperty:
                  formal?.parameters[index] &&
                  ts.isObjectBindingPattern(formal.parameters[index].name)
                    ? formal.parameters[index].name.elements
                        .filter((e) => e.name.getText() === p.name?.getText())
                        .map(ref)
                    : [],
              }))
            : [],
        })),
        returnedBy: target ? ref(formal.body) : null,
        callbackBindings: call.arguments
          .filter((a) => ts.isArrowFunction(a) || ts.isFunctionExpression(a))
          .map((a) => ({
            source: ref(a),
            parameters: a.parameters.map(ref),
            body: ref(a.body),
          })),
      }
    })
    const collections = nodes(
      fn.body,
      (n) =>
        ts.isCallExpression(n) &&
        ts.isPropertyAccessExpression(n.expression) &&
        ["reduce", "filter", "find", "sort", "every", "reverse"].includes(
          n.expression.name.text
        )
    ).map((n) => ({
      source: ref(n),
      receiver: ref(n.expression.expression),
      operation: n.expression.name.text,
      callback: n.arguments[0] ? ref(n.arguments[0]) : null,
      seed: n.arguments[1] ? ref(n.arguments[1]) : null,
      semantics:
        n.expression.name.text === "reduce"
          ? "fold izquierda; acumulador inicia semilla explícita; callback(total,elemento,indice) por cada elemento; array vacío devuelve semilla"
          : n.expression.name.text === "find"
            ? "primer elemento que cumple en orden actual; undefined si ninguno"
            : n.expression.name.text === "sort"
              ? "copia previa; comparador b.edad-a.edad; índice posterior al filtro canónico"
              : "operación nativa de array; conserva orden salvo reverse/sort; cada callback enlazado al elemento",
    }))
    contracts.push({
      id,
      source: ref(decl(id.split(":").at(-1), file)),
      parameters: fn.parameters.map(ref),
      returns: ts.isBlock(fn.body)
        ? nodes(fn.body, ts.isReturnStatement).map(ref)
        : [ref(fn.body)],
      calls,
      branches: nodes(
        fn.body,
        (n) =>
          ts.isIfStatement(n) ||
          ts.isConditionalExpression(n) ||
          ts.isCaseClause(n)
      ).map(ref),
      collections,
      resolved: true,
    })
  }
  const siteSpecs = [
    ["anual.retencion.base", "A.base"],
    ["anual.retencion.cuota", "A.cuota"],
    ["anual.retencion.tipo", "A.tipo"],
    ["anual.retencion.anual", "A.anual"],
    ["anual.pagos.retenciones", "A.soportadas"],
    ["anual.pagos.cuenta", "A.cuenta"],
  ]
  const sites = siteSpecs.map(([siteId, port]) => {
    const matches = nodes(
      asts.get(annual),
      (n) =>
        ts.isCallExpression(n) &&
        n.expression.getText() === "crearLineaCalculo" &&
        n.arguments[0]?.properties?.some(
          (p) =>
            p.name?.getText() === "siteId" && p.initializer?.text === siteId
        )
    )
    if (matches.length !== 1) throw Error("Sitio duplicado/ausente " + siteId)
    return {
      siteId,
      port,
      source: ref(matches[0]),
      unit: siteId.endsWith(".tipo") ? "percent" : "EUR",
      valueClosed: true,
      selectionClosed: true,
      siteClosed: false,
      admissionRequirement: "anual-publico-r32",
      closureScope:
        "public-concrete-layer; successful-supported-inputs; legacy-distinct",
    }
  })
  const impl = functions.get(retention + ":calcularRetencionTrabajoAeatImpl")
  const errors = nodes(
    impl.body,
    (n) => ts.isCallExpression(n) && n.expression.getText() === "Effect.fail"
  ).map((n, index) => {
    let p = n.parent
    while (p && !ts.isIfStatement(p)) p = p.parent
    return {
      index,
      tag: "ResultadoNoSoportado",
      channel: "typed-error",
      source: ref(n),
      predicate: p ? ref(p.expression) : null,
      propagation: "yield* anual; no cero ni Success",
    }
  })
  const nativeThrows = nodes(asts.get(tables), ts.isThrowStatement).map(ref)
  const serviceCall = nodes(
    asts.get(annual),
    (n) =>
      ts.isCallExpression(n) &&
      n.expression.getText() === "dependencias.retencionTrabajoAeat.calcular"
  )
  if (serviceCall.length !== 1) throw Error("Instancia de servicio ambigua")
  const serviceBindings = serviceCall[0].arguments.map((argument, index) => ({
    index,
    argument: ref(argument),
    formal: ref(impl.parameters[index]),
  }))
  const instances = [
    {
      id: "annual-public",
      source: anchor("LiquidacionIrpfAnual", annual),
      binding: "Layer.provideMerge(RetencionTrabajoAeat.layer)",
      call: ref(serviceCall[0]),
      bindings: serviceBindings,
      argument0: "caso.retencionTrabajoAeat",
      argument1: "contexto",
      injected: false,
    },
    {
      id: "retention-concrete",
      source: anchor("RetencionTrabajoAeat"),
      binding:
        "Layer.succeed(RetencionTrabajoAeat,{calcular:calcularRetencionTrabajoAeatImpl})",
      implementation: anchor("calcularRetencionTrabajoAeatImpl"),
      returns: anchor("calcularRetencionTrabajo"),
      injected: false,
    },
    {
      id: "annual-injected",
      source: anchor("construirLiquidarIrpfAnual", annual),
      binding: "dependencias.retencionTrabajoAeat.calcular",
      injected: true,
      closed: false,
    },
  ]
  const unresolved = [
    {
      id: "admission",
      scope: "all-six-sites",
      requirement:
        "Componer contrato anual-publico-r32 antes de siteClosed o wiring.",
    },
    {
      id: "injected-service",
      scope: "annual-injected only",
      requirement:
        "No hereda los cierres de la capa pública concreta; exige contrato independiente de la implementación proporcionada.",
    },
  ]
  for (const e of edges)
    if (
      !ports.some((p) => p.id === e.from) ||
      !ports.some((p) => p.id === e.to)
    )
      throw Error("Arista sin puerto")
  const byId = new Map(ports.map((p) => [p.id, p]))
  const visiting = new Set(),
    done = new Set()
  function close(id) {
    if (done.has(id)) return
    if (visiting.has(id)) throw Error("Ciclo " + id)
    visiting.add(id)
    const p = byId.get(id)
    if (!p) throw Error("Puerto desconocido " + id)
    const dependencies = edges.filter((e) => e.to === id)
    if (!p.terminal && !dependencies.length)
      throw Error("Puerto no terminal abierto " + id)
    for (const e of dependencies) close(e.from)
    visiting.delete(id)
    done.add(id)
  }
  for (const site of sites) close(site.port)
  return {
    version: 1,
    kind: "retenciones-pagos-r32",
    base: baseR32,
    sources,
    ports,
    edges,
    sites,
    unresolved,
    contracts,
    instances,
    admissionInterface: {
      contractId: "anual-publico-r32",
      errors,
      nativeThrows,
      annualObligations: [
        "Coherencia de ejercicio anual/subcaso antes de invocar",
        "Validaciones anuales y derechos previos ajenos al cálculo local",
        "Ausencia: no emitir cuatro sitios de retención y sumar cero estimado; error: no salida anual",
        "Inyección abierta requiere implementación y guardas propias; no inferir capa por interfaz",
      ],
    },
    completeRuleAcceptance: false,
    wiringAllowed: false,
  }
}
export function verifyRetencionesR32(candidate, root = process.cwd()) {
  const expected = composeRetencionesR32(root)
  if (JSON.stringify(candidate) !== JSON.stringify(expected))
    throw Error(
      "Fragmento R32 alterado: regeneración exacta contra fuentes fijadas"
    )
  return true
}
export function generateRetencionesR32() {
  const graph = composeRetencionesR32()
  const out =
    "docs/procedencia/implementaciones/flujo-retenciones-r32-sol/fragmento.json.gz"
  fs.writeFileSync(
    out,
    gzipSync(JSON.stringify(graph, null, 2) + "\n", { level: 9 })
  )
  return graph
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const g = generateRetencionesR32()
  console.log(
    JSON.stringify({
      sites: g.sites.length,
      ports: g.ports.length,
      edges: g.edges.length,
      contracts: g.contracts.length,
      completeRuleAcceptance: false,
      wiringAllowed: false,
    })
  )
}
