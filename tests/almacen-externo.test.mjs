import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import { createHash } from "node:crypto"
import { directorioObjetos, leerLocalCerrado } from "../lib/procedencia/io.mjs"

test("almacén externo: configuración, identidad, corrupción y symlinks", () => {
  const previo = process.env.IROBOPF_CAS_LOCAL
  const raiz = mkdtempSync(resolve(tmpdir(), "irobopf-cas-externo-"))
  try {
    delete process.env.IROBOPF_CAS_LOCAL
    assert.throws(() => directorioObjetos(), /IROBOPF_CAS_LOCAL/)
    process.env.IROBOPF_CAS_LOCAL = "relativo"
    assert.throws(() => directorioObjetos(), /IROBOPF_CAS_LOCAL/)
    process.env.IROBOPF_CAS_LOCAL = process.cwd()
    assert.throws(() => directorioObjetos(), /fuera de Git/)
    const cas = resolve(raiz, "objetos")
    mkdirSync(cas)
    process.env.IROBOPF_CAS_LOCAL = cas
    assert.equal(directorioObjetos(), cas)
    const bytes = Buffer.from("original verificado")
    const h = createHash("sha256").update(bytes).digest("hex")
    writeFileSync(resolve(cas, h), bytes)
    assert.deepEqual(
      leerLocalCerrado(directorioObjetos(), h, 1000, bytes.length),
      bytes
    )
    writeFileSync(resolve(cas, h), "original alterado")
    assert.throws(() => leerLocalCerrado(cas, h, 1000, undefined), /corrupto/)
    assert.throws(
      () => leerLocalCerrado(cas, "../fuera", 1000, undefined),
      /Hash/
    )
    symlinkSync(cas, resolve(raiz, "alias"))
    process.env.IROBOPF_CAS_LOCAL = resolve(raiz, "alias")
    assert.throws(() => directorioObjetos(), /symlinks/)
  } finally {
    if (previo === undefined) delete process.env.IROBOPF_CAS_LOCAL
    else process.env.IROBOPF_CAS_LOCAL = previo
  }
})
