// Regresión documental deliberadamente roja si persiste la diferencia.
// BOE-A-2015-1113, original p73; SHA256 y cajas en canarias-fuente.json.
import Decimal from 'decimal.js'
import { calcularCuotaPorEscala } from '../lib/dominio/irpf/cuotas/escalas-gravamen.ts'
import { ESCALAS_AUTONOMICAS_IRPF_2015 } from '../lib/dominio/normativa/datos/irpf-autonomico-2015.ts'

const base = new Decimal('17707.21')
const observed = calcularCuotaPorEscala({ base, tramos: ESCALAS_AUTONOMICAS_IRPF_2015.canarias.tramos })
console.log(JSON.stringify({ base: base.toString(), sourceFixedFee: '1813.61',
  observed: observed.toString(), rounded: observed.toFixed(2),
  scope: 'cuota de esta escala; no comparación de declaración completa' }))
if (observed.toFixed(2) !== '1813.61') process.exitCode = 1
