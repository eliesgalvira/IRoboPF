import assert from "node:assert/strict"
import fs from "node:fs"
import { composeCausalRentas } from "./causal-rentas-r59-contratos.mjs"
import {
  executeCausalRentas,
  verifyCausalRentas,
} from "./causal-rentas-r59.mjs"
import { executeFiniteCausal } from "./evidencia-causal-r57.ts"
export function runRentasAdversos() {
  const g = composeCausalRentas(),
    ctx = { modo: "canonico" },
    c = {
      anio: 2025,
      situacionFamiliar: { edad: 66 },
      rendimientos: {
        trabajo: [
          { importeIntegroCentimos: 1000000 },
          { importeIntegroCentimos: 1000000 },
        ],
      },
    }
  const execution = "adversos-relacionales",
    e = executeCausalRentas(g, c, ctx, execution).evidence
  const results = []
  const event = (a, operation) => {
    const v = a.events.find((v) => v.operation === operation)
    assert.ok(v, operation)
    return v
  }
  const edge = (a, role) => {
    const v = a.events.find((v) => v.edges.some((x) => x.role === role))
    assert.ok(v, role)
    return v.edges.find((x) => x.role === role)
  }
  function reject(name, mutate, original = e, caso = c) {
    const changed = structuredClone(original)
    mutate(changed)
    assert.notDeepEqual(changed, original, name)
    assert.deepEqual(
      changed.outputs,
      original.outputs,
      "salidas conservadas " + name
    )
    assert.throws(
      () => verifyCausalRentas(g, changed, caso, ctx, execution),
      undefined,
      name
    )
    results.push({ name, rejected: true, outputsPreserved: true })
  }
  reject("semilla", (a) => (edge(a, "seed").to = a.events[0].id))
  reject("callback", (a) => (edge(a, "callback").to = a.events[0].id))
  reject("selector", (a) => (edge(a, "selector").to = a.events[0].id))
  reject(
    "binding entre fases",
    (a) => (a.annualBindings[1].producer = a.annualBindings[0].producer)
  )
  reject(
    "transporte",
    (a) => (event(a, "transport").edges[0].to = a.events[0].id)
  )
  reject("frame de productor igual", (a) => (a.frames[2].id = a.frames[1].id))
  reject("invocación", (a) => event(a, "invoke").edges.pop())
  reject("captura", (a) => (event(a, "capture").property = "otro-binding"))
  reject("celda anual", (a) => {
    const v = a.events.find(
      (v) => v.operation === "property" && v.property === "2025"
    )
    assert.ok(v)
    v.property = "2024"
  })
  reject(
    "unidad",
    (a) => (event(a, "transport").unit = "centimos-decimal-string")
  )
  reject("índice", (a) => (event(a, "index").value = 8))
  reject("orden de miembros iguales", (a) => {
    const v = a.events.find(
      (v) =>
        v.operation === "collection-selection" &&
        v.edges.filter((x) => x.role.startsWith("identity:element:")).length ===
          2
    )
    assert.ok(v)
    const [x, y] = v.edges.filter((x) => x.role.startsWith("identity:element:"))
    ;[x.to, y.to] = [y.to, x.to]
  })
  reject("identidad de programa", (a) => (a.program = "programa-ajeno"))
  reject("fuente", (a) => (a.sources[0].sha256 = "0".repeat(64)))
  reject("software", (a) => (a.software[0].sha256 = "0".repeat(64)))
  reject("copia pública extra undefined", (a) => (a.extra = undefined))
  for (const [name, contexto, caso] of [
    ["modo", { modo: "compatible-legacy" }, c],
    ["año", ctx, { ...c, anio: 2026 }],
    [
      "entrada",
      ctx,
      {
        ...c,
        rendimientos: {
          trabajo: [
            { importeIntegroCentimos: 500000 },
            { importeIntegroCentimos: 1500000 },
          ],
        },
      },
    ],
  ]) {
    const other = executeCausalRentas(
      g,
      caso,
      contexto,
      execution + "-otra"
    ).evidence
    reject("empalme SS de otro " + name, (a) => {
      const target = a.events.find(
        (v) =>
          v.operation === "function-return" &&
          v.property === "/cotizacionTrabajador" &&
          v.node ===
            g.globalBindings.find(
              (b) => b.name === "ss:calcularDesgloseCotizacionesPerfilUniforme"
            ).node
      )
      const foreign = other.events.find(
        (v) =>
          v.operation === "function-return" &&
          v.property === "/cotizacionTrabajador" &&
          v.node ===
            g.globalBindings.find(
              (b) =>
                b.name ===
                "ss:" +
                  (contexto.modo === "canonico"
                    ? "calcularDesgloseCotizacionesPerfilUniforme"
                    : "calcularDesgloseCotizacionesSocialesLegacy")
            ).node
      )
      assert.ok(target && foreign)
      target.edges = structuredClone(foreign.edges)
      target.frame = foreign.frame
      target.node = foreign.node
    })
  }
  const zero = { ...c, rendimientos: { trabajo: [] } },
    z = executeCausalRentas(g, zero, ctx, execution).evidence
  reject(
    "empresarial/trabajador de igual importe",
    (a) => {
      const worker = a.events.find(
        (v) =>
          v.operation === "function-return" &&
          v.property === "/cotizacionTrabajador" &&
          v.node?.startsWith("ss:")
      )
      const employer = a.events.find(
        (v) =>
          v.operation === "function-return" &&
          v.property === "/cotizacionEmpresarial" &&
          v.node === worker?.node
      )
      assert.ok(worker && employer)
      assert.deepEqual(worker.value, employer.value)
      worker.edges.find((x) => x.role === "value").to = employer.edges.find(
        (x) => x.role === "value"
      ).to
    },
    z,
    zero
  )
  for (const [name, change] of [
    ["omitir operación", (a) => a.program.pop()],
    ["fase operativa omitida", (a) => a.annualBindings.pop()],
    [
      "obligación editorial satisfied",
      (a) => (a.participants.rentas.obligations[0].value = "satisfied"),
    ],
    ["obligación omitida", (a) => a.participants.rentas.obligations.pop()],
    ["callback externo", (a) => (a.callback = () => 0)],
    ["metadata undefined", (a) => (a.extra = undefined)],
  ]) {
    const bad = structuredClone(g)
    change(bad)
    assert.throws(() => executeCausalRentas(bad, c, ctx), undefined, name)
    assert.throws(
      () => verifyCausalRentas(bad, e, c, ctx, execution),
      undefined,
      name
    )
    assert.throws(
      () =>
        executeFiniteCausal(bad, c, ctx, execution, {
          kind: "causal-rentas-r59",
        }),
      undefined,
      name
    )
    results.push({ name, rejectedAtThreeAPIs: true })
  }
  fs.mkdirSync(".cache/causal-rentas-r59-sol", { recursive: true })
  fs.writeFileSync(
    ".cache/causal-rentas-r59-sol/adversos.json",
    JSON.stringify(results, null, 2) + "\n"
  )
  return results
}
