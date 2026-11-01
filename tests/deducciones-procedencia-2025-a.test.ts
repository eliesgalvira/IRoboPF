import { expect, it } from "vitest"
import { ARAGON_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/aragon"

it.each([
  [
    "aragon_libros_texto_material_escolar",
    "Fórmula: max(0, min(100% de gastos, límite por descendiente aplicable) - becas/ayudas).",
  ],
  [
    "aragon_clases_apoyo_refuerzo",
    "Fórmula: max(0, min(25% de gastos, límite por descendiente aplicable) - ayudas).",
  ],
  [
    "aragon_formacion_autonomia_menores_discapacidad",
    "Fórmula: max(0, min(25% de gastos, límite por descendiente aplicable) - ayudas).",
  ],
])(
  "%s: las ayudas minoran la deducción resultante tras aplicar el límite",
  (codigo, formula) => {
    const ficha = ARAGON_DEDUCCIONES_AUTONOMICAS_2025.find(
      (ficha) => ficha.codigo === codigo
    )
    expect(ficha?.limites).toContain(formula)
  }
)

import { CATALUNYA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/catalunya"

it.each([
  ["cataluna_donativos_lengua_catalana_occitana", /15%/, /10%/],
  ["cataluna_donativos_idi", /30%/, /10%/],
  ["cataluna_donaciones_medio_ambiente_patrimonio_natural", /15%/, /5%/],
  ["cataluna_angel_inversor", /40%/, /12.000/],
  ["cataluna_tramo_autonomico_inversion_vivienda_habitual", /7,5%/, /9%/],
])(
  "%s: declara las magnitudes fiscales del artículo, sin prometer evaluación",
  (codigo, tasa, limite) => {
    const ficha = CATALUNYA_DEDUCCIONES_AUTONOMICAS_2025.find(
      (ficha) => ficha.codigo === codigo
    )
    expect(JSON.stringify(ficha?.cuantia)).toMatch(tasa)
    expect(ficha?.limites.join(" ")).toMatch(limite)
  }
)

import censo from "../docs/procedencia/deducciones-2025/censo.json"
import dictamenes from "../docs/procedencia/deducciones-2025/lotes/a/dictamenes.json"
import { calcularDeduccionesConsignadas } from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

it("cubre los 49 códigos del censo una vez y mantiene revisión candidata", () => {
  const esperados = censo.fichas
    .filter((ficha) => ficha.lote === "a")
    .map((ficha) => ficha.codigo)
    .sort()
  const recibidos = dictamenes.deducciones.map((ficha) => ficha.codigo).sort()
  expect(recibidos).toEqual(esperados)
  expect(new Set(recibidos).size).toBe(49)
  expect(
    dictamenes.deducciones.every(
      (ficha) => ficha.estadoRevision === "candidato"
    )
  ).toBe(true)
})

it.each(censo.fichas.filter((ficha) => ficha.lote === "a"))(
  "$codigo: consignación expresa no demuestra fórmula",
  (ficha) => {
    const importe = 123.45
    const entradas = {
      [`${ficha.codigo}:importe`]: importe,
      [`${ficha.codigo}:cumple`]: true,
    }
    const ambito = { ejercicio: 2025, territorio: ficha.comunidad }
    expect(calcularDeduccionesConsignadas(entradas, ambito)).toBe(importe)
    expect(
      calcularDeduccionesConsignadas(
        { ...entradas, [`${ficha.codigo}:cumple`]: false },
        ambito
      )
    ).toBe(0)
  }
)
