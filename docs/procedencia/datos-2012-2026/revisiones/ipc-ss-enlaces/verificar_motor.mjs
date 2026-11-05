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
// Oráculo racional independiente: topes mensuales en céntimos, siete y cinco
// meses; sólo la representación final usa las 80 cifras del contrato monetario.
// No se reutiliza Decimal para calcular el esperado ni se redondea a céntimos.
function racional80(numerador, divisor) {
  const cifrasEnteras = (numerador / divisor).toString().length
  const decimales = 80 - cifrasEnteras
  const escala = 10n ** BigInt(decimales)
  const redondeado = (2n * numerador * escala + divisor) / (2n * divisor)
  const entero = redondeado / escala
  const fraccion = (redondeado % escala).toString().padStart(decimales, '0').replace(/0+$/, '')
  return entero.toString() + (fraccion ? '.' + fraccion : '')
}
const configuracion = { precision: Decimal.precision, rounding: Decimal.rounding }
try {
  for (const precision of [20, 6, 120]) {
    Decimal.set({ precision, rounding: Decimal.ROUND_DOWN })
    for (const s of ['30000','45014.40','45100','45644.40','60000']) {
      const [entero, fraccion = ''] = s.split('.')
      const centimos = BigInt(entero) * 100n + BigInt(fraccion.padEnd(2, '0'))
      const primerTope = 375120n * 12n
      const segundoTope = 380370n * 12n
      const numerador = (centimos < primerTope ? centimos : primerTope) * 7n
        + (centimos < segundoTope ? centimos : segundoTope) * 5n
      const expected = racional80(numerador, 1200n)
      assert.equal(cuotas({anio:2018,salarioBrutoAnual:new Decimal(s)}).baseOrdinaria.toString(), expected)
    }
  }
} finally {
  Decimal.set(configuracion)
}
console.log(JSON.stringify({paresIpc:count,identidad:1,escenarioExplicito:1,ausenciaObservacion2026:1,bases2018:5,configuracionesDecimal:3,alcance:'aritmética y clasificación; vigencia legal revisada separadamente'}))
