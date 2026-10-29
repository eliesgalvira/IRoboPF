import assert from 'node:assert/strict'
import { seleccionarVersionRetencion, VERSIONES_RETENCION } from '../../../../lib/dominio/irpf/retenciones/versiones/catalogo.ts'
import { calcularDeduccionesConsignadas, calcularDeduccionesAutonomicasAplicadas } from '../../../../lib/dominio/irpf/deducciones-autonomicas-aplicadas.ts'
const resultados = []
for (const anio of /** @type {const} */ ([2012, 2013, 2014, 2015, 2016, 2026])) {
  const version = seleccionarVersionRetencion({ anio, perfilTemporal: 'cierre' })
  assert.equal(version, undefined)
  resultados.push({ caso: `cierre-${anio}`, resultado: 'sin-version' })
}
for (const version of VERSIONES_RETENCION) {
  for (const fechaPago of [version.desde, version.hasta]) {
    assert.equal(seleccionarVersionRetencion({ anio: version.anio, fechaPago })?.id, version.id)
    resultados.push({ caso: fechaPago, resultado: version.id })
  }
}
const ambito = { ejercicio: 2025, territorio: 'andalucia' }
const entradas = { andaluciaHijosNacimientoAdopcion: 2 }
assert.equal(calcularDeduccionesAutonomicasAplicadas(entradas, ambito), 400)
assert.equal(calcularDeduccionesConsignadas(entradas, ambito), 0)
resultados.push({ caso: 'dos-hijos-sin-hechos-adicionales', parcialAntiguo: 400, consignadoAnual: 0 })
const codigo = 'andalucia_nacimiento_adopcion_acogimiento_menores'
assert.equal(calcularDeduccionesConsignadas({ [`${codigo}:importe`]: 123, [`${codigo}:cumple`]: true }, ambito), 123)
resultados.push({ caso: 'importe-externo-expreso', resultado: 123, legalidad: 'no-acreditada-por-esta-prueba' })
console.log(JSON.stringify({ comprobaciones: 41, resultados }, null, 2))
