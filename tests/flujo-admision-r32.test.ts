// Instrumento AST/bytes síncrono: los builtins Node son el objeto directo del control.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { expect, it } from "vitest"
import { existsSync } from "node:fs"

it("exige el cierre anual-publico-r32 exportable antes de componer", () => {
  expect(existsSync("scripts/procedencia/flujo-admision-r32.mjs")).toBe(true)
  expect(existsSync("docs/procedencia/implementaciones/flujo-admision-r32-sol/fragmento.json")).toBe(true)
})

import * as admission from "../scripts/procedencia/flujo-admision-r32.mjs"
it("exporta un predicado ejecutable expandido de admisión del subservicio", () => {
  expect(admission).toHaveProperty("evaluateRetentionAdmission")
})
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
const fragment = admission.buildAdmissionFragment()
it("reconstruye el artefacto fijado y conserva los estados separados", () => {
  expect(admission.verifyAdmissionFragment(JSON.parse(readFileSync("docs/procedencia/implementaciones/flujo-admision-r32-sol/fragmento.json", "utf8")))).toBe(true)
  expect(fragment.sites).toHaveLength(17)
  expect(fragment.unresolved).toEqual([])
  for (const site of fragment.sites) expect(site).toMatchObject({ contractId: "anual-publico-r32", admissionClosed: true, siteClosed: false })
})
for (const predicate of fragment.predicates) it(`eliminación de guarda ${predicate.id}`, () => {
  const path = predicate.ref.path
  const original = readFileSync(path, "utf8")
  const mutant = original.slice(0, predicate.ref.start) + "true" + original.slice(predicate.ref.end)
  expect(() => admission.verifySources((candidate: string) => Buffer.from(candidate === path ? mutant : readFileSync(resolve(candidate))))).toThrow("Fuente alterada")
})
for (const field of ["caso.retencionTrabajoAeat", "contexto", "caso.pagosACuentaCentimos", "caso.retencionesSoportadasCentimos"]) it(`transporte erróneo ${field}`, () => {
  const path = "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts"
  const original = readFileSync(path, "utf8")
  expect(original.includes(field)).toBe(true)
  const mutant = original.replaceAll(field, "caso.anio")
  expect(() => admission.verifySources((candidate: string) => Buffer.from(candidate === path ? mutant : readFileSync(candidate)))).toThrow("Fuente alterada")
})
it("no acepta un grafo autodeclarado sin guarda ni con transporte cruzado", () => {
  const missing = structuredClone(fragment)
  missing.predicates.pop()
  expect(() => admission.verifyAdmissionFragment(missing)).toThrow()
  const crossed = structuredClone(fragment)
  crossed.edges[2]!.to = "derechos"
  expect(() => admission.verifyAdmissionFragment(crossed)).toThrow()
})
