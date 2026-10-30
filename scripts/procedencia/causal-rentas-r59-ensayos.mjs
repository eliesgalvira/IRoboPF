import { createHash } from "node:crypto"
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import fs from "node:fs"
import path from "node:path"
import { gzipSync } from "node:zlib"
import { composeCausalRentas } from "./causal-rentas-r59-contratos.mjs"
import {
  executeCausalRentas,
  verifyCausalRentas,
} from "./causal-rentas-r59.mjs"
import { consumeGeneralRentas } from "./flujo-rentas-r36-consumidor.mjs"
import { composeRentasR36 } from "./flujo-rentas-r36.mjs"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const ts = require("typescript"),
  D = require("decimal.js")
// Oracle externo: este cargador existe exclusivamente en ensayos, nunca en productor/núcleo.
function load(file, cache = new Map()) {
  file = path.resolve(file)
  if (cache.has(file)) return cache.get(file)
  const out = {}
  cache.set(file, out)
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText
  new Function("require", "exports", js)(
    (n) =>
      n.startsWith(".")
        ? load(path.resolve(path.dirname(file), n) + ".ts", cache)
        : require(n),
    out
  )
  return out
}
export function runRentasCases() {
  const g = composeCausalRentas(),
    records = []
  const work = load("lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts")
  const gain = load(
    "lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts"
  )
  const reduction = load(
    "lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts"
  )
  const canonical = load("lib/dominio/laboral/cotizaciones-perfil-uniforme.ts")
  const legacy = load("lib/dominio/laboral/cotizaciones-sociales.ts")
  const eur = (c) => new D(c).div(100)
  const base = (anio = 2025, amounts = [2000000]) => ({
    anio,
    situacionFamiliar: { edad: 66 },
    rendimientos: {
      trabajo: amounts.map((importeIntegroCentimos) => ({
        importeIntegroCentimos,
      })),
      capitalInmobiliario: [
        { importeIntegroCentimos: 500001 },
        { importeIntegroCentimos: 200001 },
      ],
      gananciasPatrimoniales: [
        {
          importeGananciaCentimos: -100001,
          tratamientoMayores65: { _tag: "SinExencionMayores65" },
        },
      ],
    },
  })
  function check(c, modo, id) {
    const ctx = { modo },
      r = executeCausalRentas(g, c, ctx, id),
      e = r.evidence
    assert.equal(r.lines.length, 10)
    assert.equal(e.annualBindings.length, 8)
    const salary = c.rendimientos.trabajo.reduce(
      (s, x) => s.plus(eur(x.importeIntegroCentimos)),
      new D(0)
    )
    const ss = (
      modo === "canonico"
        ? canonical.calcularDesgloseCotizacionesPerfilUniforme
        : legacy.calcularDesgloseCotizacionesSocialesLegacy
    )({ anio: c.anio, salarioBrutoAnual: salary })
    const w = work.calcularRendimientoNetoTrabajo({
      anio: c.anio,
      rendimientoIntegro: salary,
      cotizacionTrabajador: ss.cotizacionTrabajador,
    })
    const inm = (c.rendimientos.capitalInmobiliario ?? []).reduce(
      (s, x) => s.plus(eur(x.importeIntegroCentimos)),
      new D(0)
    )
    const gains = gain.calcularGananciasPatrimonialesPorTransmision({
      anio: c.anio,
      edadContribuyente: c.situacionFamiliar.edad,
      ganancias: c.rendimientos.gananciasPatrimoniales ?? [],
      convertirCentimos: eur,
    })
    const otras = inm
      .plus(gains.gananciaSujetaGeneral)
      .plus(gains.gananciaSujetaAhorro)
    const red = reduction.calcularReduccionTrabajoConOtrasRentas({
      anio: c.anio,
      fechaFallecimiento: c.fechaFallecimiento,
      rendimientoPrevioNeto: w.rendimientoPrevioNeto,
      otrasRentasNoExentas: otras,
    })
    const expected = [
      salary,
      ss.cotizacionTrabajador,
      w.rendimientoPrevioNeto,
      w.gastosDeducibles,
      w.rendimientoNeto,
      red,
      inm,
      inm,
      gains.gananciaTotal,
      gains.gananciaExenta,
    ].map((x) => x.toFixed())
    assert.deepEqual(
      e.outputs.map((o) => o.decimal),
      expected
    )
    assert.equal(verifyCausalRentas(g, e, c, ctx, id), true)
    assert.equal(
      verifyCausalRentas(g, JSON.parse(JSON.stringify(e)), c, ctx, id),
      true
    )
    const ssFrames = e.frames.filter(
      (f) =>
        f.function?.startsWith("ss:") &&
        f.function.includes(
          modo === "canonico"
            ? "cotizaciones-perfil-uniforme.ts"
            : "cotizaciones-sociales.ts"
        )
    )
    assert.ok(ssFrames.length > 0)
    assert.equal(
      e.outputs.filter((o) => o.siteId.startsWith("anual.ss")).length,
      0
    )
    const transported = e.outputs.map((o) =>
      e.events.find((v) => v.id === o.root)
    )
    assert.ok(transported.every((v) => v.unit === "EUR-decimal-string"))
    const salaryProducer = e.annualBindings.find(
      (b) => b.name === "rendimientoIntegroTrabajo"
    ).producer
    assert.ok(
      e.outputs
        .find((o) => o.siteId === "anual.trabajo.cotizacion")
        .slice.includes(salaryProducer)
    )
    records.push({ id, caso: c, contexto: ctx, expected, evidence: e })
    return { r, c, ctx }
  }
  for (const anio of [
    2012, 2013, 2014, 2015, 2017, 2018, 2022, 2023, 2024, 2025, 2026,
  ])
    for (const modo of ["canonico", "compatible-legacy"])
      check(base(anio), modo, `${anio}-${modo}`)
  for (const anio of [2018, 2025, 2026])
    for (const modo of ["canonico", "compatible-legacy"])
      check(base(anio, [1234567, 8765433]), modo, "alta-" + anio + "-" + modo)
  for (const amounts of [[], [0], [307, 307], [1234567, 7654321], [20000]])
    check(base(2026, amounts), "canonico", "collection-" + amounts.join("-"))
  for (const importe of [650000, 650001]) {
    const c = base()
    c.rendimientos.capitalInmobiliario = [{ importeIntegroCentimos: importe }]
    c.rendimientos.gananciasPatrimoniales = []
    const x = check(c, "canonico", "otras-" + importe)
    assert.equal(
      x.r.evidence.outputs[5].decimal,
      importe === 650001 ? "0" : "1189.5928"
    )
  }
  const vivienda = base()
  vivienda.rendimientos.gananciasPatrimoniales = [
    {
      importeGananciaCentimos: 123456,
      tratamientoMayores65: { _tag: "ViviendaHabitualMayores65" },
    },
  ]
  assert.equal(
    check(vivienda, "canonico", "vivienda").r.evidence.outputs[9].decimal,
    "1234.56"
  )
  for (const fecha of ["2018-07-04", "2018-07-05"]) {
    const c = base(2018, [1400000])
    c.fechaFallecimiento = new Date(fecha + "T00:00:00Z")
    check(c, "canonico", fecha)
  }
  for (const fecha of [
    "2012-05-11",
    "2012-05-12",
    "2012-10-31",
    "2012-11-01",
    "2012-12-31",
    "2013-01-01",
  ]) {
    const c = base()
    c.rendimientos.gananciasPatrimoniales = [
      {
        importeGananciaCentimos: 1000000,
        tratamientoMayores65: { _tag: "SinExencionMayores65" },
        exencionInmuebleUrbanoAdquirido2012: {
          fechaAdquisicion: fecha,
          inmuebleUrbano: true,
          tituloOneroso: true,
          operacionConPersonaOEntidadVinculada: false,
        },
      },
    ]
    const urban = check(c, "canonico", "urbano-" + fecha)
    assert.equal(urban.r.evidence.outputs[8].decimal, "10000")
    assert.equal(
      urban.r.evidence.outputs[9].decimal,
      fecha < "2012-05-12" || fecha > "2012-12-31" ? "0" : "5000"
    )
  }
  for (const anio of [2014, 2015])
    for (const age of [64, 65]) {
      const c = base(anio)
      c.situacionFamiliar.edad = age
      c.rendimientos.gananciasPatrimoniales = [
        {
          importeGananciaCentimos: 100000,
          tratamientoMayores65: {
            _tag: "ReinversionRentaVitaliciaMayores65",
            importeReinvertidoRentaVitaliciaCentimos: 1000000,
            importeTransmisionCentimos: 2000000,
            reinversionesPreviasRentaVitaliciaCentimos: 23500000,
          },
        },
      ]
      const vital = check(c, "canonico", `vitalicia-${anio}-${age}`)
      assert.equal(
        vital.r.evidence.outputs[9].decimal,
        anio >= 2015 && age >= 65 ? "250" : "0"
      )
    }
  for (const fecha of ["2013-01-01", "2013-01-02"]) {
    const c = base(2013)
    c.rendimientos.gananciasPatrimoniales = [
      {
        importeGananciaCentimos: 100001,
        fechaAdquisicion: "2012-01-01",
        fechaTransmision: fecha,
        tratamientoMayores65: { _tag: "SinExencionMayores65" },
      },
    ]
    check(c, "canonico", "base-" + fecha)
  }
  const rational = base(2025, [2000000])
  rational.rendimientos.capitalInmobiliario = []
  rational.rendimientos.gananciasPatrimoniales = []
  const rationalResult = check(rational, "canonico", "racional-trabajo").r
    .evidence.outputs
  assert.deepEqual(
    rationalResult.map((o) => o.decimal),
    ["20000", "1296", "18704", "2000", "16704", "1189.5928", "0", "0", "0", "0"]
  )
  assert.equal(2000000n / 100n, 20000n)
  const { r, c, ctx } = check(base(), "canonico", "adversos")
  const mutations = [
    (e) => e.events.splice(20, 1),
    (e) => (e.frames[1].parent = e.frames[2].id),
    (e) => e.annualBindings.reverse(),
    (e) => (e.outputs[0].root = e.outputs[1].root),
    (e) => e.outputs[0].slice.pop(),
    (e) => (e.events.find((v) => v.operation === "index").value = 99),
    (e) =>
      (e.events.find((v) => v.operation === "capture").edges[0].to =
        e.events[1].id),
    (e) => (e.events.find((v) => v.unit === "centimos").unit = "EUR"),
    (e) =>
      (e.events.find((v) => v.operation === "parameter:0").frame =
        e.frames[0].id),
    (e) =>
      (e.events.find(
        (v) => v.operation === "function-return" && v.node?.startsWith("ss:")
      ).edges[0].to = e.events[0].id),
    (e) => (e.execution = "replay"),
    (e) => (e.extra = true),
  ]
  for (const [i, mutate] of mutations.entries()) {
    const changed = structuredClone(r.evidence)
    mutate(changed)
    assert.notDeepEqual(changed, r.evidence, "mutación efectiva " + i)
    assert.throws(
      () => verifyCausalRentas(g, changed, c, ctx, "adversos"),
      undefined,
      "adverso " + i
    )
  }
  const bad = structuredClone(g)
  bad.obligations = [{ status: "satisfied" }]
  assert.throws(() => executeCausalRentas(bad, c, ctx))
  assert.throws(() =>
    consumeGeneralRentas(
      composeRentasR36(),
      c,
      ctx,
      { anything: () => 0 },
      null,
      { causal: true }
    )
  )
  const integrated = consumeGeneralRentas(
    composeRentasR36(),
    c,
    ctx,
    {},
    null,
    { causal: true, execution: "verde" }
  )
  assert.ok(
    integrated.evidence.frames.some((f) =>
      f.function?.includes(
        "ss:lib/dominio/laboral/cotizaciones-perfil-uniforme.ts"
      )
    )
  )
  return { records, adversos: mutations.length }
}

export function saveRentasCases(result) {
  const pin = createHash("sha256")
    .update(JSON.stringify(result.records[0].evidence.software))
    .digest("hex")
    .slice(0, 16)
  const dest = path.resolve(".cache/causal-rentas-r59-sol/testigos-" + pin)
  fs.mkdirSync(dest, { recursive: true })
  fs.writeFileSync(
    path.resolve(".cache/causal-rentas-r59-sol/testigos-actuales.json"),
    JSON.stringify({ path: dest, pin }) + "\n"
  )
  const summary = []
  for (const record of result.records) {
    const file = record.id + ".json.gz"
    fs.writeFileSync(path.join(dest, file), gzipSync(JSON.stringify(record)))
    summary.push({ id: record.id, file, expected: record.expected })
  }
  fs.writeFileSync(
    path.join(dest, "casos.json"),
    JSON.stringify({ cases: summary, adversos: result.adversos }, null, 2) +
      "\n"
  )
}
