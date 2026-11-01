import { describe, expect, it } from "vitest"
import casos from "./discriminantes.json"
import { VALENCIANA_DEDUCCIONES_AUTONOMICAS_2025 as fichas } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/comunitat-valenciana"

// Prueba roja de omisiones documentales; no comprueba una cuota fiscal.
describe("requisitos documentales independientes del lote G", () => {
 for (const caso of casos.casos) {
  it(caso.codigo, () => {
   const ficha = fichas.find((f) => f.codigo === caso.codigo)
   expect(JSON.stringify({ cuantia: ficha?.cuantia, requisitos: ficha?.requisitos, limites: ficha?.limites, prorrateo: ficha?.prorrateo, compatibilidades: ficha?.compatibilidades, incompatibilidades: ficha?.incompatibilidades })).toContain(caso.textoExigido)
  })
 }
})
