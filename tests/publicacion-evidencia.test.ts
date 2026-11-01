import { expect, it } from "vitest"
import { crearFixtureCI } from "../scripts/procedencia/fixture-ci.mjs"
import { resolver, leerSnapshot } from "../lib/procedencia/almacen"
import { filaBusqueda } from "../scripts/procedencia/contenido-publicar.mjs"
it("resuelve únicamente la revisión publicada del sujeto sintético", () => {
  const f = crearFixtureCI()
  expect(leerSnapshot(f.id, f.raiz)?.cantidad).toBe(1)
  expect(resolver(f.id, f.entidad.id, f.revision, f.raiz)).toEqual(f.entidad)
  expect(resolver(f.id, f.entidad.id, "f".repeat(64), f.raiz)).toBeNull()
  expect(filaBusqueda({ entidad: f.entidad, revision: f.revision })).toMatchObject({ id: "paso.prueba.importe", revision: f.revision })
})
