import assert from "node:assert/strict"
import fs from "node:fs"
import { gzipSync } from "node:zlib"
import { composeCausalRentas } from "./causal-rentas-r59-contratos.mjs"
import {
  executeCausalRentas,
  verifyCausalRentas,
} from "./causal-rentas-r59.mjs"
export function runRentasCollections() {
  const g = composeCausalRentas(),
    ctx = { modo: "canonico" }
  const gain = (importeGananciaCentimos, treatment, fechaTransmision) => ({
    importeGananciaCentimos,
    tratamientoMayores65: { _tag: treatment },
    fechaAdquisicion: "2012-01-01",
    fechaTransmision,
  })
  const mixed = [
    gain(-100000, "SinExencionMayores65", "2013-01-01"),
    gain(300000, "ViviendaHabitualMayores65", "2013-01-02"),
    gain(200000, "SinExencionMayores65", "2013-01-02"),
  ]
  const repeated = gain(100000, "SinExencionMayores65", "2013-01-02")
  const cases = [
    ["mixta", mixed, "4000", "3000"],
    ["inversa", [...mixed].reverse(), "4000", "3000"],
    ["repetidas", [repeated, { ...repeated }], "2000", "0"],
    ["vacias", [], "0", "0"],
  ]
  const map = g.participants.rentas.collections.filter(
    (c) =>
      c.operation === "map" &&
      c.id.startsWith(
        "lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:"
      )
  )
  assert.equal(map.length, 1)
  const records = []
  fs.mkdirSync(".cache/causal-rentas-r59-sol/colecciones", { recursive: true })
  for (const [name, ganancias, total, exenta] of cases) {
    const caso = {
      anio: 2013,
      situacionFamiliar: { edad: 65 },
      rendimientos: {
        trabajo: [
          { importeIntegroCentimos: 1000000 },
          { importeIntegroCentimos: 1000000 },
        ],
        capitalInmobiliario: [
          { importeIntegroCentimos: 100000 },
          { importeIntegroCentimos: 50000 },
        ],
        gananciasPatrimoniales: ganancias,
      },
    }
    const evidence = executeCausalRentas(g, caso, ctx, name).evidence
    assert.deepEqual(
      evidence.outputs.map((o) => o.decimal),
      [
        "20000",
        "1270",
        "18730",
        "0",
        "18730",
        "2652",
        "1500",
        "1500",
        total,
        exenta,
      ]
    )
    assert.equal(verifyCausalRentas(g, evidence, caso, ctx, name), true)
    const byId = new Map(evidence.events.map((v) => [v.id, v]))
    const otras = evidence.annualBindings.find(
      (binding) => binding.name === "otrasRentasNoExentas"
    )
    const expectedOtras =
      name === "mixta" || name === "inversa"
        ? "2500"
        : name === "repetidas"
          ? "3500"
          : "1500"
    assert.ok(otras)
    assert.deepEqual(byId.get(otras.producer).value, { decimal: expectedOtras })
    const cotizacion = evidence.outputs.find(
      (output) => output.siteId === "anual.trabajo.cotizacion"
    )
    assert.ok(cotizacion)
    const slice = new Set(cotizacion.slice)
    const nodes = new Set(
      evidence.events.filter((event) => slice.has(event.id)).map((event) => event.node)
    )
    const cells = g.participants.ss.cells.filter(
      (cell) =>
        cell.path.includes("TIPOS_SEGURIDAD_SOCIAL_LEGACY") &&
        nodes.has("ss:" + cell.id)
    )
    assert.equal(cells.length, 5)
    assert.ok(cells.every((cell) => cell.path.at(-1) === "trabajador"))
    const selection = evidence.events.find(
      (v) =>
        v.operation === "array-selection" && v.node === "rentas:" + map[0].id
    )
    assert.ok(selection)
    const members = selection.edges.filter((x) =>
      x.role.startsWith("identity:element:")
    )
    assert.equal(members.length, ganancias.length)
    assert.equal(new Set(members.map((m) => m.to)).size, members.length)
    const callback = selection.edges.find((x) => x.role === "callback")
    assert.ok(callback)
    const invocations = evidence.events.filter(
      (v) =>
        v.operation === "invoke" &&
        v.edges.some((x) => x.role === "callee" && x.to === callback.to)
    )
    assert.equal(invocations.length, ganancias.length)
    assert.equal(
      new Set(invocations.map((v) => v.frame)).size,
      ganancias.length
    )
    invocations.forEach((v, i) => {
      assert.equal(
        v.edges.find((x) => x.role === "argument:0").to,
        members[i].to
      )
      assert.equal(
        byId.get(v.edges.find((x) => x.role === "argument:1").to).value,
        i
      )
    })
    const record = {
      caso,
      contexto: ctx,
      evidence,
      expected: { total, exenta },
      members: members.map((x) => x.to),
      frames: invocations.map((v) => v.frame),
    }
    records.push(record)
    fs.writeFileSync(
      ".cache/causal-rentas-r59-sol/colecciones/" + name + ".json.gz",
      gzipSync(JSON.stringify(record))
    )
  }
  assert.deepEqual(
    records[0].evidence.outputs.map((o) => o.decimal),
    records[1].evidence.outputs.map((o) => o.decimal)
  )
  assert.notDeepEqual(records[0].evidence.events, records[1].evidence.events)
  assert.throws(() =>
    verifyCausalRentas(g, records[0].evidence, records[1].caso, ctx, "mixta")
  )
  return records
}
