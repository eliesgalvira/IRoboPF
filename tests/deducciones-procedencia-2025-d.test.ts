import { describe, expect, it } from "vitest"
import { DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025"
import secciones from "../docs/procedencia/deducciones-2025/lotes/d/secciones-manual.json"

const fichas = DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.filter(
  (ficha) => ficha.codigo in secciones.secciones
)

describe("localización documental del lote D en la edición conservada", () => {
  it("cubre exactamente las 63 deducciones", () => {
    expect(fichas).toHaveLength(63)
    expect(new Set(fichas.map((ficha) => ficha.codigo)).size).toBe(63)
  })
  for (const ficha of fichas) {
    it(`${ficha.codigo}: remite a las páginas de su sección`, () => {
      const seccion = Object.entries(secciones.secciones).find(
        ([codigo]) => codigo === ficha.codigo
      )?.[1]
      expect(ficha.fuenteManual.paginas).toEqual(seccion?.paginas)
    })
  }
  it("las fichas de consignación describen el alcance real", () => {
    for (const ficha of fichas) {
      if (ficha.entradaNecesaria.includes(`${ficha.codigo}:importe`)) {
        expect(JSON.stringify(ficha)).not.toContain(
          "aplicar fórmula, límites, prorrateos e incompatibilidades operativas"
        )
      }
    }
  })
})
