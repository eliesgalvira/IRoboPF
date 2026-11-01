/** Discriminantes documentales locales. Dos rojos pendientes; no invoca el motor. */
import assert from "node:assert/strict"
import { CANARIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/canarias"
import { BALEARS_DEDUCCIONES_AUTONOMICAS_2025 } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/illes-balears"
import modelo from "../../correcciones/c/hechos-y-ruta-unica.json"

const fichas = [
  ...CANARIAS_DEDUCCIONES_AUTONOMICAS_2025,
  ...BALEARS_DEDUCCIONES_AUTONOMICAS_2025,
]
function texto(codigo: string): string {
  const ficha = fichas.find((f) => f.codigo === codigo)
  assert.ok(ficha, codigo)
  return JSON.stringify(ficha)
}
const pendientes: string[] = []
function comprobar(id: string, verificar: () => void): void {
  try {
    verificar()
    console.log(`PASA ${id}`)
  } catch (error) {
    pendientes.push(id)
    console.error(`ROJO ${id}`, error)
  }
}
comprobar("51 códigos únicos", () => {
  assert.equal(fichas.length, 51)
  assert.equal(new Set(fichas.map((f) => f.codigo)).size, 51)
})
for (const [codigo, patron] of [
  ["canarias_donaciones_entidades_sin_animo_lucro", /17,5/],
  ["canarias_inversion_vivienda_habitual", /1 de enero de 2012/],
  ["canarias_adecuacion_inmueble_arrendamiento", /por inmueble/],
  ["canarias_puesta_viviendas_mercado_arrendamiento", /cinco/],
  ["canarias_primas_seguro_impago_arrendamientos", /800 euros/],
  ["balears_conciliacion_menores_6", /redacción de Ley 11\/2023: 50%, máximo 900/],
  ["balears_gastos_mayores_65_discapacidad", /ascendientes comunes/],
  ["balears_gastos_mayores_65_discapacidad", /descendientes comunes/],
  ["balears_mecenazgo_cultural_cientifico_tecnologico", /4%/],
  ["balears_mecenazgo_deportivo", /4%/],
  ["balears_nacimiento", /25 de julio de 2025/],
] as const) {
  comprobar(`${codigo}: ${patron.source}`, () => assert.match(texto(codigo), patron))
}
comprobar("CAMP-01: traslado de 2024 conserva umbral de origen", () => {
  assert.match(texto("canarias_traslado_residencia_otra_isla_trabajo"), /45\.500/)
  assert.match(texto("canarias_traslado_residencia_otra_isla_trabajo"), /60\.500/)
})
comprobar("CAMP-02: el resumen no fecha todo el régimen reforzado en julio", () => {
  const regla = modelo.deducciones.find(
    (d) => d.codigo === "balears_conciliacion_menores_6"
  )
  assert.ok(regla)
  assert.doesNotMatch(regla.parametros.reglaDocumentada, /reforzada50%,900 desde11julio/)
})
assert.deepEqual(pendientes, [], "Diferencias documentales pendientes de corrección por el autor")
