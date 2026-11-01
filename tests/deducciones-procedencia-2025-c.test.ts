import assert from "node:assert/strict"
import { test } from "vitest"
import { CANARIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/canarias"
import { BALEARS_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/illes-balears"
import paginacion from "../docs/procedencia/deducciones-2025/lotes/c/paginacion.json"

const fichas = [
  ...CANARIAS_DEDUCCIONES_AUTONOMICAS_2025,
  ...BALEARS_DEDUCCIONES_AUTONOMICAS_2025,
]

test("lote C: 51 códigos únicos preservados", () => {
  assert.equal(fichas.length, 51)
  assert.equal(new Set(fichas.map((ficha) => ficha.codigo)).size, 51)
  assert.deepEqual(
    fichas.map((ficha) => ficha.codigo).sort(),
    Object.keys(paginacion.deducciones).sort()
  )
})

for (const ficha of fichas) {
  test(`${ficha.codigo}: páginas de la sección en la edición fijada`, () => {
    const esperada = Object.entries(paginacion.deducciones).find(
      ([codigo]) => codigo === ficha.codigo
    )?.[1]
    assert.ok(esperada)
    assert.deepEqual(ficha.fuenteManual.paginas, esperada.paginas)
  })
}

test("enfermedad: el incremento canario de 100 euros es solo individual", () => {
  const ficha = CANARIAS_DEDUCCIONES_AUTONOMICAS_2025.find(
    (ficha) => ficha.codigo === "canarias_gasto_enfermedad"
  )
  assert.ok(ficha)
  assert.ok(
    ficha.limites.some((limite) =>
      limite.includes("Incremento 100 euros solo en tributación individual")
    )
  )
})

for (const ficha of fichas) {
  test(`${ficha.codigo}: el resumen no atribuye automatización a un importe manual`, () => {
    if (ficha.cuantia.tipo === "mixta") {
      assert.doesNotMatch(
        ficha.cuantia.descripcion,
        /control de interfaz para aplicar fórmula/
      )
    }
    assert.ok(
      !ficha.limites.some((limite) =>
        limite.includes("El cálculo se verifica mediante el control")
      )
    )
  })
}
