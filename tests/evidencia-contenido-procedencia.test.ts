import { expect, it } from "vitest"
import { crearFixtureCI } from "../scripts/procedencia/fixture-ci.mjs"
import { verificar, verificarContenido } from "../scripts/procedencia/contenido-verificar.mjs"
it("verifica un cierre sintético con el verificador real y rechaza conteo alterado", () => {
  const f = crearFixtureCI()
  expect(verificar(f.id, f.raiz)).toMatchObject({ cantidad: 1, aceptacionFiscal: "pendiente" })
  expect(() => verificarContenido({ ...f.snapshot, cantidad: 2 }, f.raiz)).toThrow("Conteo")
})

import { verificarRastroGenerado } from "../scripts/procedencia/rastro-verificar.mjs"
import { writeFileSync, readFileSync, resolve } from "../lib/procedencia/io.mjs"
it("rechaza mutaciones del software conservado", () => {
  const f = crearFixtureCI()
  expect(verificarRastroGenerado(f.root, f.raiz).puntos).toBe(1)
  const path = resolve(f.root, "scripts/procedencia/ambito-publicado.mjs")
  writeFileSync(path, readFileSync(path, "utf8") + "\n// mutación sintética\n")
  expect(() => verificarRastroGenerado(f.root, f.raiz)).toThrow("Software")
})

it("rechaza un catálogo distinto aunque conserve un hash válido y la omisión de un punto", () => {
  const f = crearFixtureCI()
  expect(() => verificarContenido({ ...f.snapshot, catalogo: f.snapshot.contrato }, f.raiz)).toThrow()
  expect(() => verificarContenido({ ...f.snapshot, evidencias: [{ sujeto: { id: f.entidad.id, revision: f.revision }, payload: "a".repeat(64), recibo: "b".repeat(64) }] }, f.raiz)).toThrow("Cobertura")
})
