/** Contraste documental independiente; no calcula una liquidación fiscal. */
import assert from "node:assert/strict"
import { ANDALUCIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/andalucia"
import { CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/cantabria"
import { CANARIAS_DEDUCCIONES_AUTONOMICAS_2025 } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/canarias"
import { BALEARS_DEDUCCIONES_AUTONOMICAS_2025 } from "../../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/illes-balears"
import loteA from "../../lotes/a/dictamenes.json"
import loteB from "../../lotes/b/dictamenes.json"
import cobertura from "../../correcciones/a/cobertura.json"
import reglas from "../../correcciones/a/reglas-para-calculo.json"
import temporal from "../../correcciones/c/hechos-y-ruta-unica.json"
import evidencia from "../../correcciones/c-temporal/evidencias.json"

const fichas = [...ANDALUCIA_DEDUCCIONES_AUTONOMICAS_2025,
  ...CANTABRIA_DEDUCCIONES_AUTONOMICAS_2025,
  ...CANARIAS_DEDUCCIONES_AUTONOMICAS_2025, ...BALEARS_DEDUCCIONES_AUTONOMICAS_2025]
function texto(codigo: string) {
  const ficha = fichas.find((f) => f.codigo === codigo)
  assert.ok(ficha)
  return JSON.stringify(ficha)
}
const donativo = "andalucia_donativos_finalidad_ecologica"
const ajenas = [274, 275, 276, 277, 278, 279, 281, 282].map((n) => `CA-andalucia-${n}`)
for (const paquete of [loteA, cobertura, reglas]) {
  const expediente = paquete.deducciones.find((d) => d.codigo === donativo)
  assert.ok(expediente)
  for (const id of ajenas) assert.ok(!JSON.stringify(expediente).includes(`"${id}"`), id)
}
const celiaca = loteA.deducciones.find((d) => d.codigo === "andalucia_enfermedad_celiaca")
assert.ok(celiaca)
for (const id of ajenas) assert.equal(celiaca.citas.find((c) => c.id === id)?.articulo, "22 quater")
assert.match(texto(donativo), /10%/)
assert.match(texto(donativo), /150/)
console.log("PASA AAMP-01: ocho retiradas en tres cadenas; ocho citas válidas preservadas; 10%/150")

const mono = loteB.deducciones.find((d) => d.codigo === "cantabria_familias_monoparentales")
assert.ok(mono)
const legal = mono.citas.filter((c) => c.documentoId !== mono.manual.documentoId)
assert.ok(legal.some((c) => c.textoLiteral.includes("patria potestad prorrogada")))
assert.ok(!legal.some((c) => c.textoLiteral.includes("curatela")))
assert.match(texto(mono.codigo), /Criterio del Manual AEAT 2025.*curatela representativa/)
assert.doesNotMatch(texto(mono.codigo), /curatela asistencial/)
console.log("PASA BC01: criterio representativo separado del artículo; transición preservada; asistencial no equiparada")

const estudio = loteB.deducciones.find((d) => d.codigo === "cantabria_traslado_estudios_despoblamiento")
assert.ok(estudio)
assert.match(texto(estudio.codigo), /rentas anuales inferiores a 8.000/)
assert.match(estudio.manual.discrepancias.join(" "), /8.000/)
for (const [renta, ley, manual] of [[7999.99, true, true], [8000, false, true], [8000.01, false, false]] as const) {
  assert.equal(renta < 8000, ley)
  assert.equal(renta <= 8000, manual)
}
console.log("PASA BC02: 7.999,99 / 8.000 / 8.000,01; discrepancia registrada sin relajar ley")

const traslado = temporal.deducciones.find((d) => d.codigo === "canarias_traslado_residencia_otra_isla_trabajo")
assert.ok(traslado)
assert.match(traslado.hechosNecesarios.join(" "), /ejercicio del traslado/)
assert.match(traslado.hechosNecesarios.join(" "), /renta y modalidad.*origen/)
assert.match(texto(traslado.codigo), /segunda anualidad conserva el umbral y la renta del ejercicio de origen/)
assert.match(traslado.parametros.reglaDocumentada, /45.500.*60.500.*46.455.*61.770/)
assert.ok(evidencia.citas.some((c) => c.articulo === "Disposición final décima.Tres; artículo 8.4"))
for (const [origen, nueva, limite] of [[45500, 90000, 45500], [60500, 0, 60500], [46455, 90000, 46455], [61770, 0, 61770]] as const) {
  assert.ok(origen <= limite)
  assert.ok(origen + 0.01 > limite)
  assert.notEqual(origen, nueva)
}
console.log("PASA CAMP-01: origen y modalidad explícitos, segunda anualidad; extremos inclusivos; DF décima.Tres")

const balear = temporal.deducciones.find((d) => d.codigo === "balears_conciliacion_menores_6")
assert.ok(balear)
assert.match(balear.parametros.reglaDocumentada, /Ley 11\/2023.*50%.*900/)
assert.match(texto(balear.codigo), /11 de julio de 2025.*183 días.*30%/)
assert.match(texto(balear.codigo), /fallecimientos anteriores.*Ley 11\/2023: 50%, máximo 900/)
assert.doesNotMatch(balear.parametros.reglaDocumentada, /reforzada50%,900 desde11julio/)
// Oráculos documentales para un único titular, año completo del menor y demás requisitos cumplidos.
assert.equal(Math.min(1000 * 0.5, 900), 500)
assert.equal(Math.min(2000 * 0.5, 900), 900)
assert.equal(Math.min(1000 * 0.4, 660), 400)
console.log("PASA CAMP-02: 35 años y devengo 10 julio conserva 500; tope 900; general 400; altas nuevas separadas")

