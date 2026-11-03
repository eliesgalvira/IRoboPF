// Prueba local explícita: requiere las dependencias JS documentadas por el lote.
import assert from 'node:assert/strict'
import Decimal from 'decimal.js'
import { calcularFactorIpcDiciembre as factor } from '../../../../../lib/dominio/inflacion/factor-ipc.ts'
import { calcularDesgloseCotizacionesPerfilUniforme as cuotas } from '../../../../../lib/dominio/laboral/cotizaciones-perfil-uniforme.ts'
const rates = ['0.003', '-0.010', '0', '0.016', '0.011', '0.012', '0.008', '-0.005', '0.065', '0.057', '0.031', '0.028', '0.029']
let count = 0
for (let a = 2012; a <= 2025; a++) for (let b = 2012; b <= 2025; b++) {
  let expected = new Decimal(1)
  for (let y = Math.min(a,b)+1; y <= Math.max(a,b); y++) expected = expected.mul(new Decimal(rates[y-2013]).plus(1))
  if (a>b) expected = new Decimal(1).div(expected)
  assert.equal(factor({anioBase:a,anioReferencia:b}).factor.toString(), expected.toString())
  count++
}
assert.equal(factor({anioBase:2012,anioReferencia:2012}).procedencia.estado, 'identidad')
assert.throws(() => factor({anioBase:2025,anioReferencia:2026}))
const scenario = factor({anioBase:2025,anioReferencia:2026,escenario:'legacy-diciembre-2026-3pct'})
assert.equal(scenario.factor.toString(), '1.03')
assert.equal(scenario.procedencia.estado, 'incluye-escenario')
for (const s of ['30000','45014.40','45100','45644.40','60000']) {
  const salary = new Decimal(s)
  const expected = Decimal.min(salary, new Decimal('3751.20').mul(12)).mul(7)
    .plus(Decimal.min(salary,new Decimal('3803.70').mul(12)).mul(5)).div(12)
  assert.equal(cuotas({anio:2018,salarioBrutoAnual:salary}).baseOrdinaria.toString(),expected.toString())
}
console.log(JSON.stringify({paresIpc:count,identidad:1,escenarioExplicito:1,ausenciaObservacion2026:1,bases2018:5,alcance:'aritmética y clasificación; vigencia legal revisada separadamente'}))
