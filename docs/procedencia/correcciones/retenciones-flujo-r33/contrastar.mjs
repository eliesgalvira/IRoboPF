import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { composeRetencionesR32, verifyRetencionesR32 } from '../../../../scripts/procedencia/flujo-retenciones-r32.mjs'

const received = JSON.parse(gunzipSync(readFileSync('docs/procedencia/implementaciones/flujo-retenciones-r32-sol/fragmento.json.gz')))
const current = composeRetencionesR32()
assert.deepEqual(current, received)
assert.equal(verifyRetencionesR32(received), true)
assert.equal(current.sites.length, 6)
assert.ok(current.sites.every(s => !s.siteClosed && s.admissionRequirement === 'anual-publico-r32'))
assert.equal(current.completeRuleAcceptance, false)
assert.equal(current.wiringAllowed, false)
const result = {
  generatedMatchesReceived: true,
  sourceFiles: current.sources.length,
  ports: current.ports.length,
  edges: current.edges.length,
  contracts: current.contracts.length,
  sites: current.sites,
  unresolved: current.unresolved,
  parentAcceptsValueClosure: false,
  parentAcceptsSelectionClosure: false,
  reason: 'El cierre declarado por el candidato necesita contraste independiente semántico; igualdad con la receta no demuestra exhaustividad de dependencias.',
  reviewQuestions: [
    'Correspondencia entre fórmulas redactadas y cuerpos, ramas, literales y propiedades ejecutados.',
    'Alcance del terminal compuesto A.subcaso y ausencia de obligaciones por campo ocultas.',
    'Instanciación de las tres llamadas a la escala y sus tramos por celda.',
    'Resolved/valueClosed/selectionClosed frente a listados de llamadas, callbacks y condiciones en texto.',
    'Unidades y conversiones explícitas al componer con los otros fragmentos.',
    'Diferencia entre rechazar una fuente por pin externo y verificar la semántica de un mutante.'
  ],
  completeRuleAcceptance: false,
}
writeFileSync('docs/procedencia/correcciones/retenciones-flujo-r33/contraste.json', JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify({ sites: 6, ports: result.ports, edges: result.edges, contracts: result.contracts, reconstructed: true, closureAccepted: false }))
