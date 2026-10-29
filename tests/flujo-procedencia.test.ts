import { composeR30 } from "../scripts/procedencia/flujo-retenciones-ss.mjs"
import {
  describe,
  it,
  expect,
} from "/home/elies/Repos/IRoboPF/node_modules/vitest/dist/index.js"
import * as fs from "../lib/procedencia/io.mjs"
import { resolve } from "../lib/procedencia/io.mjs"
import { DateTime } from "effect"
import type {
  Node,
  VariableDeclaration,
  FunctionDeclaration,
  CallExpression,
} from "typescript"
import { createRequire } from "node:module"
import {
  Composer,
  compose,
  verifyCandidate,
} from "../scripts/procedencia/flujo-componer.mjs"
import { Sources, ts, callArgument } from "../scripts/procedencia/flujo-ast.mjs"
import { closure, validate } from "../scripts/procedencia/flujo-contrato.mjs"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const Decimal = require("decimal.js").Decimal
function loader(mutationFile = "", before = "", after = "") {
  const cache = new Map()
  function load(file: string) {
    file = resolve(file)
    if (cache.has(file)) return cache.get(file)
    let text = fs.readFileSync(file, "utf8")
    if (file === resolve(mutationFile)) {
      if (text.split(before).length !== 2) throw Error("Mutación no única")
      text = text.replace(before, after)
    }
    const exports = {}
    cache.set(file, exports)
    const js = ts.transpileModule(text, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText
    new Function("require", "exports", js)(
      (id: string) =>
        id.startsWith(".")
          ? load(resolve(file.slice(0, file.lastIndexOf("/")), id) + ".ts")
          : require(id),
      exports
    )
    return exports
  }
  return load
}
const load = loader()
function sourceNode<T extends Node>(
  file: string,
  predicate: (node: Node) => node is T
): T {
  const ast = new Sources().load(file).ast
  let result: T | undefined
  function visit(n: Node) {
    if (predicate(n)) result = n
    ts.forEachChild(n, visit)
  }
  visit(ast)
  if (result === undefined) throw Error("AST no encontrado")
  return result
}
const money = "lib/dominio/dinero/importe-monetario.ts"
function small() {
  const c = new Composer(),
    n = sourceNode(
      money,
      (n): n is VariableDeclaration =>
        ts.isVariableDeclaration(n) && n.name.getText() === "centimosAEuros"
    )
  if (n.initializer === undefined || !ts.isArrowFunction(n.initializer))
    throw Error("Conversor sin lambda")
  const p = c.trace(n.initializer.body, "", new Map(), "public", "EUR")
  return {
    version: 1,
    review: "pending-independent",
    completeRuleAcceptance: false,
    wiringAllowed: false,
    ports: c.ports,
    edges: c.edges,
    sites: [{ siteId: "control", output: p.id, closed: false }],
  }
}
describe("puertos y puertas de composición", () => {
  it("rechaza IDs duplicados, referencias, fuentes, unidades y estados", () => {
    const original = small()
    expect(validate(original)).toBe(true)
    const mutations = [
      (g: ReturnType<typeof small>) => g.ports.push(g.ports[0]),
      (g: ReturnType<typeof small>) => (g.edges[0].from = "inexistente"),
      (g: ReturnType<typeof small>) =>
        (g.ports[0].source.sha256 = "0".repeat(64)),
      (g: ReturnType<typeof small>) => (g.edges[0].role = "unknown"),
      (g: ReturnType<typeof small>) => (g.ports[0].unit = "centimos"),
      (g: ReturnType<typeof small>) => (g.review = "accepted"),
      (g: ReturnType<typeof small>) => (g.edges[0].evidence = []),
    ]
    for (const mutate of mutations) {
      const g = structuredClone(original)
      mutate(g)
      expect(() => validate(g)).toThrow()
    }
  })
  it("no admite una función pendiente como terminal ni cierra unresolved", () => {
    const g = small()
    g.ports[0].unresolved = "auxiliar pendiente"
    g.sites[0].closed = true
    expect(() => validate(g)).toThrow()
    expect(closure(g, g.sites[0].output).closed).toBe(false)
  })
  it("discrimina argumentos homónimos de otra llamada por AST", () => {
    const s = new Sources(),
      file = "lib/dominio/irpf/actividades-economicas/calcular.ts"
    const calls: CallExpression[] = []
    function walk(n: Node) {
      if (ts.isCallExpression(n) && n.expression.getText() === "etapa")
        calls.push(n)
      ts.forEachChild(n, walk)
    }
    walk(s.load(file).ast)
    expect(() =>
      callArgument(s, s.ref(calls[0]), 3, s.ref(calls[0].arguments[3]))
    ).not.toThrow()
    expect(() =>
      callArgument(s, s.ref(calls[0]), 3, s.ref(calls[1].arguments[3]))
    ).toThrow()
  })
  it("schema y determinismo conservan el candidato pendiente", () => {
    const g = compose(),
      schema = JSON.parse(
        fs.readFileSync(
          "schemas/procedencia/flujo/composicion.schema.json",
          "utf8"
        )
      ),
      Ajv = require("ajv"),
      validateSchema = new Ajv({ allErrors: true }).compile(schema)
    expect(validateSchema(g), JSON.stringify(validateSchema.errors)).toBe(true)
    expect(JSON.stringify(compose())).toBe(JSON.stringify(g))
  })
  it("recorre los 65 sitios con identidad separada y 19 etapas", () => {
    const g = compose()
    expect(g.sites).toHaveLength(65)
    expect(g.stages).toHaveLength(19)
    expect(new Set(g.sites.map((s) => s.siteId)).size).toBe(65)
    expect(g.stages[1].transport.aporte).toBe(false)
    expect(g.stages[1].transport.annual).toBe("unreachable-activos")
    expect(g.completeRuleAcceptance).toBe(false)
    expect(
      g.sites.find((s) => s.siteId === "anual.explicito.actividad.etapa")
        ?.closed
    ).toBe(false)
  })
  it("rechaza eliminación, control convertido en valor, conversión y cambio de lado/año por reconstrucción", () => {
    const g = compose()
    const variants = [
      (x: ReturnType<typeof compose>) => x.edges.splice(0, 1),
      (x: ReturnType<typeof compose>) => (x.edges[0].role = "selection"),
      (x: ReturnType<typeof compose>) =>
        (x.ports[0].instance += ":trabajador:2018"),
      (x: ReturnType<typeof compose>) => (x.ports[0].unit = "centimos"),
    ]
    for (const mutate of variants) {
      const changed = structuredClone(g)
      mutate(changed)
      expect(() => verifyCandidate(changed)).toThrow()
    }
  }, 30_000)
})
describe("casos independientes sobre TS real sin cambiar el cálculo", () => {
  it("conserva precisión del rastro y separa presentación", () => {
    const m = load("lib/dominio/explicacion/linea-calculo.ts")
    const r = m.crearLineaCalculo({
      siteId: "control",
      instancia: 0,
      importe: new Decimal("1.23456789"),
      unidad: "EUR",
      etiqueta: "control",
      formula: "control",
    })
    expect(r.origen.decimal).toBe("1.23456789")
    expect(r.resultado).toBe("1.23 euros")
  })
  it("centimos/EUR y half-up son conversiones distintas", () => {
    const m = load(money)
    expect(m.centimosAEuros(123).toFixed()).toBe("1.23")
    expect(m.eurosACentimos(new Decimal("1.235"))).toBe(124)
  })
  it("2018 usa antes del 5 julio solo antigua; después y ausente media", () => {
    const r = load(
      "lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts"
    )
    const calc = (fechaFallecimiento: Date | undefined) =>
      r
        .calcularReduccionTrabajoConOtrasRentas({
          anio: 2018,
          fechaFallecimiento,
          rendimientoPrevioNeto: new Decimal(12000),
          otrasRentasNoExentas: new Decimal(0),
        })
        .toFixed()
    expect(
      calc(DateTime.toDateUtc(DateTime.makeUnsafe("2018-07-04T23:59:59Z")))
    ).toBe("2832.8125")
    expect(
      calc(DateTime.toDateUtc(DateTime.makeUnsafe("2018-07-05T00:00:00Z")))
    ).toBe("4198.90625")
    expect(calc(undefined)).toBe("4198.90625")
  })
})

describe("SS: lado, año y modo son discriminantes de valor", () => {
  const file = "lib/dominio/laboral/cotizaciones-perfil-uniforme.ts",
    legacy = "lib/dominio/laboral/cotizaciones-sociales.ts"
  it("una mutación empresarial no altera trabajador", () => {
    const input = { anio: 2025, salarioBrutoAnual: new Decimal(90000) },
      a = load(file).calcularDesgloseCotizacionesPerfilUniforme(input),
      b = loader(
        file,
        '"0.0077"',
        '"0.077"'
      )(file).calcularDesgloseCotizacionesPerfilUniforme(input)
    expect(b.solidaridadEmpresarial.toFixed()).not.toBe(
      a.solidaridadEmpresarial.toFixed()
    )
    expect(b.solidaridadTrabajador.toFixed()).toBe(
      a.solidaridadTrabajador.toFixed()
    )
    expect(b.cotizacionTrabajador.toFixed()).toBe(
      a.cotizacionTrabajador.toFixed()
    )
  })
  it("2018 canónico es 7/5 y no hereda el máximo legacy", () => {
    const data = "lib/dominio/normativa/datos/seguridad-social-2012-2026.ts",
      input = { anio: 2018, salarioBrutoAnual: new Decimal(50000) },
      mutated = loader(
        data,
        '2018: crearImporteMonetario("45014.4")',
        '2018: crearImporteMonetario("40000")'
      )
    expect(
      load(file)
        .calcularDesgloseCotizacionesPerfilUniforme(input)
        .baseOrdinaria.toFixed()
    ).toBe("45276.9")
    expect(
      mutated(file)
        .calcularDesgloseCotizacionesPerfilUniforme(input)
        .baseOrdinaria.toFixed()
    ).toBe("45276.9")
    expect(
      mutated(legacy)
        .calcularDesgloseCotizacionesSocialesLegacy(input)
        .baseOrdinaria.toFixed()
    ).toBe("40000")
  })
  it("MEI conserva lado y año, no la suma conjunta", () => {
    const f = load(file).calcularDesgloseCotizacionesPerfilUniforme,
      a = f({ anio: 2022, salarioBrutoAnual: new Decimal(30000) }),
      b = f({ anio: 2023, salarioBrutoAnual: new Decimal(30000) })
    expect(a.meiEmpresarial.toFixed()).toBe("0")
    expect(a.meiTrabajador.toFixed()).toBe("0")
    expect(b.meiEmpresarial.toFixed()).toBe("150")
    expect(b.meiTrabajador.toFixed()).toBe("30")
  })
})
function fixture(name: string) {
  const n = sourceNode(
    "tests/actividades-economicas-2025.test.ts",
    (n): n is FunctionDeclaration =>
      ts.isFunctionDeclaration(n) && n.name?.text === name
  )
  return new Function(
    ts.transpileModule(n.getText() + "\nreturn " + name, {
      compilerOptions: { target: ts.ScriptTarget.ES2022 },
    }).outputText
  )()
}
describe("actividad aislada y selección de exenciones", () => {
  it("saldo se transporta en etapas y no se suma como aporte", () => {
    const c = fixture("casoBase")()
    c.ingresos = [fixture("ingreso")("10000")]
    c.activos = [fixture("activo")()]
    c.aplicarRentasBajas = false
    const f = load(
      "lib/dominio/irpf/actividades-economicas/calcular.ts"
    ).calcularActividad2025
    const a = f(c)
    c.activos[0].coeficiente = "0.20"
    c.activos[0].coeficienteHistorico = "0.20"
    const b = f(c)
    const stage = (
      r: { etapas: Array<{ id: string; importe: string }> },
      id: string
    ) => r.etapas.find((e: { id: string }) => e.id === id)?.importe
    expect(stage(a, "pc")).toBe("260")
    expect(stage(a, "pc:saldo")).toBe("740")
    expect(stage(b, "pc")).toBe("200")
    expect(stage(b, "pc:saldo")).toBe("800")
    expect(stage(b, "P")).toBe("9800")
  })
  it("cliente único habilita adicional/discapacidad; rechazo no es cero", () => {
    const c = fixture("casoBase")()
    c.ingresos = [fixture("ingreso")("10000", true)]
    c.opcion = "cliente-unico"
    const f = load(
      "lib/dominio/irpf/actividades-economicas/calcular.ts"
    ).calcularActividad2025
    const a = f(c)
    expect(
      a.etapas.find((e: { id: string }) => e.id === "adicional").importe
    ).toBe("6498")
    c.discapacidad.grado = 33
    expect(
      f(c).etapas.find((e: { id: string }) => e.id === "discapacidad").importe
    ).toBe("3500")
    c.clientes[0].vinculado = true
    expect(f(c).estado).toBe("no-soportado")
  })
  it("edad selecciona exención y conserva total; pérdida no produce exención negativa", () => {
    const f = load(
      "lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts"
    ).calcularGananciasPatrimonialesPorTransmision
    const item = {
      importeGananciaCentimos: 100000,
      tratamientoMayores65: { _tag: "ViviendaHabitualMayores65" },
      fechaAdquisicion: "2012-05-12",
      fechaTransmision: "2014-05-12",
    }
    const calc = (
      edadContribuyente: number,
      importeGananciaCentimos = 100000
    ) =>
      f({
        anio: 2014,
        edadContribuyente,
        ganancias: [{ ...item, importeGananciaCentimos }],
        convertirCentimos: (n: number) => new Decimal(n).div(100),
      })
    expect(calc(64).gananciaTotal.toFixed()).toBe("1000")
    expect(calc(65).gananciaTotal.toFixed()).toBe("1000")
    expect(calc(64).gananciaExenta.toFixed()).toBe("0")
    expect(calc(65).gananciaExenta.toFixed()).toBe("1000")
    expect(calc(65, -100000).gananciaExenta.toFixed()).toBe("0")
  })
  it("vitalicia desde2015 conserva margen y ratio propios", () => {
    const f = load(
      "lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts"
    ).calcularGananciasPatrimonialesPorTransmision
    const item = {
      importeGananciaCentimos: 100000,
      tratamientoMayores65: {
        _tag: "ReinversionRentaVitaliciaMayores65",
        importeReinvertidoRentaVitaliciaCentimos: 10000000,
        importeTransmisionCentimos: 20000000,
        reinversionesPreviasRentaVitaliciaCentimos: 23500000,
      },
    }
    const calc = (anio: number) =>
      f({
        anio,
        edadContribuyente: 65,
        ganancias: [item],
        convertirCentimos: (n: number) => new Decimal(n).div(100),
      }).gananciaExenta.toFixed()
    expect(calc(2014)).toBe("0")
    expect(calc(2015)).toBe("25")
  })
})

describe("R30: transporte de propiedades de retención", () => {
  it("resuelve el parámetro de presentación desde su llamada anual única", () => {
    const g = compose()
    for (const id of ["base", "cuota", "tipo", "anual"]) {
      const site = g.sites.find(s => s.siteId === "anual.retencion." + id)
      expect(site).toBeDefined()
      if (site === undefined) throw Error("Sitio ausente")
      const traced = closure(g, site.output)
      expect(traced.unresolved.some((u: {reason: string}) => u.reason.includes("sin binding: retencion"))).toBe(false)
      expect(g.ports.some((p: {id: string; symbol: string}) => traced.ports.includes(p.id) && p.symbol.includes("dependencias.retencionTrabajoAeat.calcular"))).toBe(true)
    }
  })
  it("suma trabajo en céntimos por elemento antes de aplicar topes SS", () => {
    const f = load("lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts").sumarRendimientosTrabajo
    const convert = load(money).centimosAEuros
    expect(f([], convert).toFixed()).toBe("0")
    expect(f([{importeIntegroCentimos: 123}, {importeIntegroCentimos: 456}], convert).toFixed()).toBe("5.79")
  })
})

describe("R30: discriminantes numéricos y rechazos reales", () => {
  const uniform = "lib/dominio/laboral/cotizaciones-perfil-uniforme.ts"
  const legacy = "lib/dominio/laboral/cotizaciones-sociales.ts"
  it("contrasta ambos topes de 2018 sin anualizar el promedio antes de saturar", () => {
    const f = load(uniform).calcularDesgloseCotizacionesPerfilUniforme
    for (const gross of [0, 45014.39, 45014.4, 45014.41, 45644.39, 45644.4, 45644.41, 50000]) {
      const r = f({ anio: 2018, salarioBrutoAnual: new Decimal(gross) })
      const expected = (7 * Math.min(gross, 45014.4) + 5 * Math.min(gross, 45644.4)) / 12
      expect(r.baseOrdinaria.toNumber()).toBeCloseTo(expected, 8)
      expect(r.excesoBase.toNumber()).toBeCloseTo(Math.max(0, gross - expected), 8)
    }
  })
  it("solidaridad de 2025 conserva bandas y reparto distinto entre modos", () => {
    const f = load(uniform).calcularDesgloseCotizacionesPerfilUniforme
    const l = load(legacy).calcularDesgloseCotizacionesSocialesLegacy
    for (const excess of [0, 5891.39, 5891.4, 5891.41, 29457, 29457.01, 40000]) {
      const input = {anio: 2025, salarioBrutoAnual: new Decimal(58914).plus(excess)}
      const r = f(input), old = l(input)
      const bands = [Math.min(excess, 5891.4), Math.min(Math.max(0, excess - 5891.4), 23565.6), Math.max(0, excess - 29457)]
      const expectedEmployer = bands[0] * 0.0077 + bands[1] * 0.0083 + bands[2] * 0.0098
      const expectedWorker = bands[0] * 0.0015 + bands[1] * 0.0017 + bands[2] * 0.0019
      const oldTotal = bands[0] * 0.0092 + bands[1] * 0.0100 + bands[2] * 0.0117
      expect(r.solidaridadEmpresarial.toNumber()).toBeCloseTo(expectedEmployer, 8)
      expect(r.solidaridadTrabajador.toNumber()).toBeCloseTo(expectedWorker, 8)
      expect(old.solidaridadTrabajador.toNumber()).toBeCloseTo(oldTotal / 6, 8)
      expect(old.solidaridadEmpresarial.toNumber()).toBeCloseTo(oldTotal * 5 / 6, 8)
      expect(r.cotizacionTrabajador.toNumber()).toBeCloseTo(58914 * (0.0635 + 0.0013) + expectedWorker, 8)
      expect(r.cotizacionEmpresarial.toNumber()).toBeCloseTo(58914 * (0.314 + 0.0067) + expectedEmployer, 8)
    }
  })
  it("rechaza divisor familiar cero, regularización y temporalidad legacy", () => {
    const Effect = require("effect").Effect
    const f = load("lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts").calcularRetencionTrabajoAeat
    const base = {anio: 2025, retribucionAnualCentimos: 3000000, cotizacionesCentimos: 190500, situacionFamiliar: "situacion3", situacionLaboral: "activo", contrato: "general", descendientes: [], ascendientes: [], discapacidad: "sin-discapacidad"}
    expect(Effect.runSyncExit(f(base, {modo:"compatible-legacy"}))._tag).toBe("Success")
    for (const changed of [
      {...base, ascendientes: [{edad:70, convivencia:0, discapacidad:"sin-discapacidad", movilidadReducida:false}]},
      {...base, procedimiento:"regularizacion"},
      {...base, fechaPago:"2025-01-01"},
    ]) expect(Effect.runSyncExit(f(changed, {modo:"compatible-legacy"}))._tag).toBe("Failure")
  })
  it("selecciona versión a ambos lados del 5 de julio de 2018 y rechaza ventana ausente", () => {
    const f = load("lib/dominio/irpf/retenciones/versiones/catalogo.ts").seleccionarVersionRetencion
    expect(f({anio:2018,fechaPago:"2018-07-04"}).reduccion).toBe("antigua")
    expect(f({anio:2018,fechaPago:"2018-07-05"}).reduccion).toBe("media2018")
    expect(f({anio:2018})).toBeUndefined()
    expect(f({anio:2026,fechaPago:"2026-09-09"})).toBeUndefined()
    expect(f({anio:2026,fechaPago:"2026-09-10"}).id).toBeDefined()
  })
})

it("R30: el acumulador convertido discrimina un mutante de escala monetaria", () => {
  const input = [{importeIntegroCentimos:123}, {importeIntegroCentimos:456}]
  const mutated = loader(money, "crearImporteMonetario(centimos).div(100)", "crearImporteMonetario(centimos).div(10)")
  const f = mutated("lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts").sumarRendimientosTrabajo
  expect(f(input, mutated(money).centimosAEuros).toFixed()).not.toBe("5.79")
})

it("R30: los contratos enlazan el retorno monetario concreto y conservan las divisiones", () => {
  const r = composeR30()
  expect(r.sites).toHaveLength(17)
  expect(r.untouchedSites).toHaveLength(48)
  const output = r.sites.find(s => s.siteId === "anual.retencion.base")
  expect(output?.producer?.producer.text).toBe("aCentimos(baseRetencion)")
  expect(r.contracts.some(c => c.id.endsWith(":esCasoCalculable") && c.declaration.text.includes("ascendiente.convivencia > 0"))).toBe(true)
  expect(r.contracts.some(c => c.id.endsWith(":calcularTipoInicial") && c.divisions.length > 0)).toBe(true)
  const Ajv = require("ajv")
  const schema = JSON.parse(fs.readFileSync("schemas/procedencia/flujo/retenciones-ss.schema.json", "utf8"))
  const check = new Ajv({allErrors:true}).compile(schema)
  expect(check(r),JSON.stringify(check.errors)).toBe(true)
}, 120_000)
