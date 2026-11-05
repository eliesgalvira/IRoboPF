import { describe, expect, it } from "vitest"
import casos from "./lote-a-ampliacion-revision.casos.json"
import {
  evaluarAmpliacionLoteA2025,
  type SolicitudAmpliacionLoteA2025,
} from "../lib/dominio/irpf/deducciones/lote-a-ampliacion-2025"

describe("Ampliación A: oráculos independientes y correcciones AAR", () => {
  for (const c of casos)
    it(c.id, () => {
      // SAFETY: frontera JS adversa; el evaluador decodifica el Schema estricto antes de calcular.
      const resultado = evaluarAmpliacionLoteA2025(
        c.entrada as SolicitudAmpliacionLoteA2025
      )
      expect(resultado).toMatchObject(c.esperado)
    })
})
