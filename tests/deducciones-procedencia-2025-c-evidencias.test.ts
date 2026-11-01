import assert from "node:assert/strict"
import { test } from "vitest"
import modelo from "../docs/procedencia/deducciones-2025/correcciones/c/hechos-y-ruta-unica.json"
import cotejo from "../docs/procedencia/deducciones-2025/correcciones/c/cotejo-42-citas.json"
import { CANARIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/canarias"
import { BALEARS_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/illes-balears"

const fichas = [
  ...CANARIAS_DEDUCCIONES_AUTONOMICAS_2025,
  ...BALEARS_DEDUCCIONES_AUTONOMICAS_2025,
]
for (const ficha of fichas) {
  test(`${ficha.codigo}: condiciones individuales sin promesa genérica`, () => {
    assert.doesNotMatch(
      ficha.requisitos.join(" "),
      /Cumplir los requisitos indicados en la ficha normativa normalizada/
    )
    assert.ok(ficha.requisitos.length > 0)
    assert.ok([...ficha.requisitos, ...ficha.limites].join(" ").length > 250)
  })
}
const discriminantes: ReadonlyArray<readonly [string, RegExp]> = [
  ["canarias_donaciones_finalidad_ecologica", /150/],
  ["canarias_donaciones_patrimonio_historico", /Registro Canario/],
  [
    "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia",
    /50\.000/,
  ],
  ["canarias_donaciones_entidades_sin_animo_lucro", /17,5/],
  ["canarias_inversion_vivienda_habitual", /1 de enero de 2012/],
  ["canarias_nacimiento_adopcion_hijos", /sobrevivan los anteriores/],
  ["canarias_familia_numerosa", /partes iguales/],
  ["canarias_familiares_dependientes_discapacidad", /mínimo por discapacidad/],
  ["canarias_puesta_viviendas_mercado_arrendamiento", /seis meses/],
  ["balears_gastos_mayores_65_discapacidad", /ascendientes comunes/],
  ["balears_gastos_mayores_65_discapacidad", /descendientes comunes/],
  ["balears_conciliacion_menores_6", /11 de julio de 2025/],
  ["balears_arrendamiento_vivienda_habitual", /25 de julio de 2025/],
  ["balears_libros_texto", /25 de julio de 2025/],
  ["balears_nacimiento", /25 de julio de 2025/],
  [
    "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento",
    /25 de julio de 2025/,
  ],
  ["balears_mecenazgo_cultural_cientifico_tecnologico", /1\.200/],
  ["balears_mecenazgo_deportivo", /tres ejercicios/],
  ["balears_inversion_entidades_nuevas_reciente_creacion", /cuatro años/],
]
for (const [codigo, patron] of discriminantes) {
  test(`${codigo}: ${patron.source}`, () => {
    const ficha = fichas.find((ficha) => ficha.codigo === codigo)
    assert.ok(ficha)
    assert.match(
      [
        ...ficha.requisitos,
        ...ficha.limites,
        ...ficha.prorrateo,
        ...ficha.incompatibilidades,
      ].join(" "),
      patron
    )
  })
}

test("conciliación: el régimen reforzado previo no se reduce al general", () => {
  const ficha = fichas.find(
    (ficha) => ficha.codigo === "balears_conciliacion_menores_6"
  )
  assert.ok(ficha)
  assert.match(
    ficha.requisitos.join(" "),
    /redacción de Ley 11\/2023: 50%, máximo 900 euros/
  )
  assert.match(
    ficha.requisitos.join(" "),
    /desde el 11 de julio de 2025.*autónomos con 183 días/
  )
})

for (const codigo of [
  "canarias_estudios_educacion_superior",
  "canarias_inversion_entidades_nuevas_reciente_creacion",
  "balears_arrendador_vivienda_permanente_otros_gastos",
  "balears_inversion_entidades_nuevas_reciente_creacion",
]) {
  test(`${codigo}: un plazo o crédito mínimo no crea un mínimo familiar`, () => {
    const ficha = fichas.find((ficha) => ficha.codigo === codigo)
    assert.ok(ficha)
    assert.doesNotMatch(
      ficha.requisitos.join(" "),
      /Remisión a los artículos 58 a 61/
    )
  })
}

test("ruta única: hechos y parámetros con evidencia para los 51 códigos", () => {
  assert.deepEqual(
    modelo.deducciones.map((d) => d.codigo).sort(),
    fichas.map((f) => f.codigo).sort()
  )
  for (const deduccion of modelo.deducciones) {
    assert.ok(deduccion.hechosNecesarios.length >= 2)
    assert.ok(deduccion.parametros.citas.length > 0)
    assert.ok(deduccion.remisiones.every((r) => r.citas.length > 0))
  }
})

test("42 recortes: las cabeceras y dos atribuciones no se promueven a evidencia fiscal", () => {
  assert.equal(cotejo.citas.length, 42)
  assert.deepEqual(
    cotejo.citas
      .filter((c) => c.estado === "excluida")
      .map((c) => c.idRevision)
      .sort(),
    ["rc-comun-30", "rc-comun-36"]
  )
  assert.equal(
    cotejo.citas.find(
      (c) => c.idRevision === "rc-canarias_discapacidad_mayores_65"
    )?.articuloComprobado,
    "10.2"
  )
  assert.equal(
    cotejo.citas.find(
      (c) =>
        c.idRevision ===
        "rc-balears_declarantes_discapacidad_o_descendientes_discapacidad"
    )?.articuloComprobado,
    "2.1 original de 2014"
  )
})
