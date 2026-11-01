import { test } from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { verificarCopiaAnonimizada } from "../scripts/procedencia/privacidad-verificar.mjs"

const hash = (value) => createHash("sha256").update(value).digest("hex")
test("distingue el original de su copia y rechaza una alteración no registrada", () => {
  const original = Buffer.from("original de prueba")
  const publico = Buffer.from("copia de prueba")
  const ledger = {
    schemaVersion: 1,
    objects: [{ originalSha256: hash(original), publicSha256: hash(publico), publicBytes: publico.length }],
  }
  assert.equal(verificarCopiaAnonimizada(original, hash(original), ledger).mismosBytes, true)
  const result = verificarCopiaAnonimizada(publico, hash(original), ledger)
  assert.equal(result.mismosBytes, false)
  assert.equal(result.renuevaAceptacion, false)
  assert.throws(() => verificarCopiaAnonimizada(Buffer.from("otra copia"), hash(original), ledger))
  assert.throws(() => verificarCopiaAnonimizada(publico, hash("otro original"), ledger))
  assert.throws(() => verificarCopiaAnonimizada(publico, hash(original), { ...ledger, objects: [...ledger.objects, ...ledger.objects] }))
})
