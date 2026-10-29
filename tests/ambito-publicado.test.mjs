import { test } from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { verificarAceptacionLimitada } from "../scripts/procedencia/ambito-publicado.mjs"

function fixture(discriminantes = { status: "accepted" }) {
  const dependencias = []
  const objetos = new Map()
  function save(path, value) {
    const bytes = Buffer.from(JSON.stringify(value))
    const sha256 = createHash("sha256").update(bytes).digest("hex")
    dependencias.push({ path, sha256 })
    objetos.set(sha256, bytes)
    return { path, sha256 }
  }
  const inventory = {
    manifestSha256: "a".repeat(64),
    artifactSha256: "b".repeat(64),
  }
  const conditions = ["synthetic-only"]
  const source = {
    file: "lib/synthetic.ts",
    sha256: "c".repeat(64),
    symbol: "MADRID_2022",
    tablePath: ["0", "cuota"],
  }
  const decisions = save("docs/procedencia/synthetic-decisions.json", [
    {
      id: "synthetic",
      ...discriminantes,
      year: 2022,
      territory: "madrid",
      value: "10",
      unit: "EUR",
      conditions,
      citations: [],
      column: "cuota",
      engineLocations: [
        {
          path: source.file,
          sha256: source.sha256,
          symbol: "MADRID_2022[0].cuota",
        },
      ],
    },
  ])
  const legalReview = { decisions, decisionId: "synthetic" }
  const executableScope = save("docs/procedencia/synthetic-scope.json", {
    schemaVersion: 1,
    itemId: "synthetic",
    inventory,
    source,
    decision: legalReview,
    component: "autonomico",
    taxBase: "general",
    period: "madrid-2022",
    predicate: "nominal-cell",
    externalConditions: ["residence-unverified", "eligibility-unverified"],
    year: 2022,
    territory: "madrid",
    value: "10",
    unit: "EUR",
    editorialConditions: conditions,
    completeRuleAcceptance: false,
  })
  const scope = { conditions, year: 2022, territory: "madrid", unit: "EUR" }
  const payload = save("docs/procedencia/synthetic-payload.json", {
    schemaVersion: 2,
    authorTaskId: "synthetic-author",
    itemId: "synthetic",
    inventory,
    source,
    scope,
    legalReview,
    executableScope,
  })
  const report = save("docs/procedencia/revisiones/synthetic/report.json", {
    synthetic: true,
  })
  const attestation = save("docs/procedencia/synthetic-attestation.json", {
    payloadSha256: payload.sha256,
    inventory,
    scope,
    report,
    reviewTaskId: "synthetic-review",
    decision: "accepted-limited",
  })
  const delegationRegistry = save("docs/procedencia/synthetic-delegates.json", {
    version: 1,
    delegate: { taskId: "synthetic-review" },
  })
  save("docs/procedencia/enlaces/revisores.json", {
    schemaVersion: 2,
    reviewers: [
      {
        taskId: "synthetic-review",
        delegationRegistry,
        reportDirectory: "docs/procedencia/revisiones/synthetic",
        approvals: [{ payloadSha256: payload.sha256, attestation }],
      },
    ],
  })
  save("docs/procedencia/enlaces/registro.json", {
    entries: [{ payload, attestation }],
  })
  return { dependencias, objetos, payload, report }
}

test("decisión requiere un discriminante único, incluso si ambos coinciden", () => {
  for (const discriminantes of [
    {},
    { status: "accepted", decision: "accepted" },
    { status: "accepted", decision: "rejected" },
    { decision: "pending" },
  ]) {
    const f = fixture(discriminantes)
    assert.throws(
      () =>
        verificarAceptacionLimitada(
          f.payload.sha256,
          "synthetic",
          f.dependencias,
          (h) => f.objetos.get(h)
        ),
      /Decisión/
    )
  }
  const f = fixture({ decision: "accepted" })
  assert.equal(
    verificarAceptacionLimitada(
      f.payload.sha256,
      "synthetic",
      f.dependencias,
      (h) => f.objetos.get(h)
    ).completeRuleAcceptance,
    false
  )
})

test("cierre sintético exacto; omisión y movimiento del informe bloquean", () => {
  const f = fixture()
  const run = () =>
    verificarAceptacionLimitada(
      f.payload.sha256,
      "synthetic",
      f.dependencias,
      (h) => f.objetos.get(h)
    )
  assert.equal(run().completeRuleAcceptance, false)
  const index = f.dependencias.findIndex((d) => d.path === f.report.path)
  const removed = f.dependencias.splice(index, 1)[0]
  assert.throws(run, /Informe/)
  f.dependencias.push({ ...removed, path: removed.path + ".moved" })
  assert.throws(run, /Informe/)
})

test("otro sujeto, recibo sin registro y dependencia duplicada bloquean", () => {
  const f = fixture()
  const read = (h) => f.objetos.get(h)
  assert.throws(() =>
    verificarAceptacionLimitada(f.payload.sha256, "other", f.dependencias, read)
  )
  assert.throws(() =>
    verificarAceptacionLimitada(
      "c".repeat(64),
      "synthetic",
      f.dependencias,
      read
    )
  )
  f.dependencias.push(f.dependencias[0])
  assert.throws(
    () =>
      verificarAceptacionLimitada(
        f.payload.sha256,
        "synthetic",
        f.dependencias,
        read
      ),
    /duplicada/
  )
})

test("rehacer la atestación no sustituye la aprobación del orquestador", () => {
  const f = fixture()
  const registryDep = f.dependencias.find(
    (d) => d.path === "docs/procedencia/enlaces/registro.json"
  )
  const registry = JSON.parse(f.objetos.get(registryDep.sha256))
  const attRef = registry.entries[0].attestation
  const att = JSON.parse(f.objetos.get(attRef.sha256))
  const reportDep = f.dependencias.find((d) => d.path === f.report.path)
  const reportBytes = Buffer.from("informe sustituido")
  reportDep.sha256 = createHash("sha256").update(reportBytes).digest("hex")
  f.objetos.set(reportDep.sha256, reportBytes)
  att.report.sha256 = reportDep.sha256
  const attBytes = Buffer.from(JSON.stringify(att))
  const attHash = createHash("sha256").update(attBytes).digest("hex")
  f.objetos.set(attHash, attBytes)
  f.dependencias.find((d) => d.path === attRef.path).sha256 = attHash
  registry.entries[0].attestation.sha256 = attHash
  const registryBytes = Buffer.from(JSON.stringify(registry))
  registryDep.sha256 = createHash("sha256").update(registryBytes).digest("hex")
  f.objetos.set(registryDep.sha256, registryBytes)
  assert.throws(
    () =>
      verificarAceptacionLimitada(
        f.payload.sha256,
        "synthetic",
        f.dependencias,
        (h) => f.objetos.get(h)
      ),
    /aprobación exacta/
  )
})

test("claves de delegación duplicadas con tareas distintas son ambiguas", () => {
  const f = fixture()
  function replace(path, value) {
    const dependency = f.dependencias.find((d) => d.path === path)
    const bytes = Buffer.from(JSON.stringify(value))
    dependency.sha256 = createHash("sha256").update(bytes).digest("hex")
    f.objetos.set(dependency.sha256, bytes)
    return { path, sha256: dependency.sha256 }
  }
  const delegationRegistry = replace(
    "docs/procedencia/synthetic-delegates.json",
    {
      version: 1,
      delegates: [
        { taskId: "synthetic-review", key: "revision-duplicada" },
        { taskId: "synthetic-other", key: "revision-duplicada" },
      ],
    }
  )
  const reviewersPath = "docs/procedencia/enlaces/revisores.json"
  const reviewersDep = f.dependencias.find((d) => d.path === reviewersPath)
  const reviewers = JSON.parse(f.objetos.get(reviewersDep.sha256))
  reviewers.reviewers[0].delegationRegistry = delegationRegistry
  replace(reviewersPath, reviewers)
  assert.throws(
    () =>
      verificarAceptacionLimitada(
        f.payload.sha256,
        "synthetic",
        f.dependencias,
        (h) => f.objetos.get(h)
      ),
    /ambigua/
  )
})
