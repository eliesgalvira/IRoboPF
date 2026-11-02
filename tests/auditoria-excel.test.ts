import { expect, it } from "@effect/vitest"
import { Effect } from "effect"
import { auditarRangoSalarial } from "../lib/dominio/analisis-salarial/progresividad-frio"
import {
  construirLibroAuditoriaCompatible,
  construirLibroAuditoriaCompatibleConProgreso,
} from "../lib/export/auditoria-excel"

const auditoria = () =>
  auditarRangoSalarial({
    salarioBrutoAnualMinimoCentimos: 3000000,
    salarioBrutoAnualMaximoCentimos: 3000000,
    pasoCentimos: 100,
    anioComparado: 2025,
    anioReferencia: 2025,
  })
it.effect("exporta los resultados recibidos sin otra liquidación", () =>
  Effect.gen(function* () {
    const resultado = yield* auditoria()
    const libro = construirLibroAuditoriaCompatible(resultado)
    expect(libro.worksheets.map((h) => h.name)).toEqual([
      "CONTROL_GENERAL",
      "COMPARATIVA_INFLACION",
    ])
    const fila = libro.getWorksheet("COMPARATIVA_INFLACION")?.getRow(2)
    expect(fila?.getCell(2).value).toBe(
      resultado.puntos[0].comparacion.referencia.irpfFinalCentimos / 100
    )
  })
)
it.effect("las hojas detalladas requieren filas explícitas ya calculadas", () =>
  Effect.gen(function* () {
    const resultado = yield* auditoria()
    const libro = construirLibroAuditoriaCompatible(resultado, {
      tablasDetalle: { 2025: { cabeceras: ["Importe"], filas: [[123.45]] } },
    })
    expect(libro.getWorksheet("DAT_2025")?.getCell("A2").value).toBe(123.45)
    expect(libro.getWorksheet("DAT_2012")).toBeUndefined()
  })
)
it.effect(
  "la exportación con progreso conserva las mismas filas canónicas",
  () =>
    Effect.gen(function* () {
      const resultado = yield* auditoria()
      const directo = construirLibroAuditoriaCompatible(resultado)
      const progresivo = yield* construirLibroAuditoriaCompatibleConProgreso(
        resultado,
        { filasPorBloque: 1 }
      )
      expect(
        progresivo.getWorksheet("COMPARATIVA_INFLACION")?.getRow(2).values
      ).toEqual(directo.getWorksheet("COMPARATIVA_INFLACION")?.getRow(2).values)
    })
)
