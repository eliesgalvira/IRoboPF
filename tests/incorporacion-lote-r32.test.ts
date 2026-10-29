// Instrumento síncrono de archivos y entorno: contrasta bytes y la frontera scratch de Node.
// @effect-diagnostics effect/nodeBuiltinImport:off
// @effect-diagnostics effect/processEnv:off
import { describe, it, expect } from "vitest"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"
import { preparar, aplicar, revertir } from "../scripts/procedencia/incorporacion-lote-r32.mjs"
const root = process.env.IROBOPF_R32_SOURCE ?? process.cwd()
const out = resolve(root, ".cache/incorporacion-lote-r32/tests")
describe("incorporación candidata exacta R32", () => {
  it("conserva Madrid y revierte bytes; rechaza una base inesperada", () => {
    const plan = preparar(root)
    const tree = resolve(out, "registros")
    for (const f of plan.files) {
      mkdirSync(resolve(tree, f.path, ".."), { recursive: true })
      writeFileSync(resolve(tree, f.path), Buffer.from(f.before, "base64"))
    }
    aplicar(tree, plan)
    const registry = JSON.parse(readFileSync(resolve(tree, plan.files[0].path), "utf8"))
    expect(registry.entries).toHaveLength(265)
    expect(registry.entries[0].attestation).toBeNull()
    expect(() => aplicar(tree, plan)).toThrow()
    revertir(tree, plan)
    for (const f of plan.files) expect(readFileSync(resolve(tree, f.path)).toString("base64")).toBe(f.before)
    writeFileSync(resolve(tree, plan.files[1].path), "base inesperada")
    expect(() => aplicar(tree, plan)).toThrow()
    expect(readFileSync(resolve(tree, plan.files[0].path)).toString("base64")).toBe(plan.files[0].before)
  })
  it("rechaza identidad, payload y atestación cruzados aunque se reserialice el plan", () => {
    for (const mutation of ["identity", "payload", "attestation"]) {
      const plan = preparar(root)
      const index = mutation === "identity" ? 1 : 0
      const data = JSON.parse(Buffer.from(plan.files[index].after, "base64").toString())
      if (mutation === "identity") data.reviewers[0].taskId = data.reviewers[1].taskId
      if (mutation === "payload") data.entries[1].payload = data.entries[2].payload
      if (mutation === "attestation") data.entries[1].attestation = data.entries[2].attestation
      plan.files[index].after = Buffer.from(JSON.stringify(data)).toString("base64")
      expect(() => aplicar(resolve(out, "registros"), plan)).toThrow()
    }
  })
})
