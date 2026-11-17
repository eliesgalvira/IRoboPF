import { describe, expect, it } from '@effect/vitest'
import { Effect } from 'effect'
import datos from './fixtures/asturias-arrendador-hechos-2025.json'
import type { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { producirSolicitudAsturiasArrendador2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/asturias-arrendador'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { aplicarDeduccionesTerritoriales2025 } from '../lib/dominio/irpf/deducciones/anual-territorial'
import { marcoPropioB, decimalB } from './b-conexion-completa-fixtures'
import { oraculo, decimalExacto, igual, euros } from './asturias-arrendador-revision339.oracle'

// Oráculos recibidos intactos; las variantes positivas separan la reserva RNR/50%.
type Raw = typeof datos
type EntradaAdversa = Raw | Omit<Raw, 'asturiasArrendador2025'>
const raw = () => structuredClone(datos)
const ejecutar = (x: EntradaAdversa, api: 'explicita' | 'canonica') => {
 // SAFETY: se prueban fronteras públicas sin decodificación ni saneamiento previos.
 const c = x as CasoTrabajoAlquilerOrdinario2025
 return api === 'explicita' ? liquidarIrpfAnualExplicito(c) : liquidarIrpfAnual(c, { modo: 'canonico' })
}
const cambios: readonly [string, (c: Raw) => void][] = [
 ['sin RCI', c => { c.asturiasArrendador2025.rendimiento = 'actividad_economica' }],
 ['sin vivienda habitual', c => { c.inmuebles[0]!.contrato.destino = 'temporada' }],
 ['dos propietarios', c => { c.inmuebles[0]!.titulares.push('otro-sintetico') }],
 ['derecho distinto', c => { c.inmuebles[0]!.derecho = 'usufructo' }],
 ['porcentaje contradictorio', c => { c.asturiasArrendador2025.porcentajePropiedad = '50' }],
 ['adquisición posterior', c => { c.inmuebles[0]!.adquisicion.fecha = '2025-01-01' }],
 ['pago posterior', c => { c.inmuebles[0]!.gastos[0]!.fechaPago = '2026-01-01' }],
 ['pago omitido', c => { c.asturiasArrendador2025.pagos = [] }],
 ['renta sin calendario', c => { c.asturiasArrendador2025.precio.mensualidades = [] }],
 ['dos meses iguales', c => { c.asturiasArrendador2025.precio.mensualidades[1]!.id = 'R1' }],
 ['renta original contradictoria', c => { c.inmuebles[0]!.exigibilidades[1]!.importe = '1001.00' }],
 ['fin mutuamente cambiado', c => { c.inmuebles[0]!.contrato.hasta = c.asturiasArrendador2025.contrato.hasta = '2025-11-30' }],
 ['censo de otro titular', c => { c.asturiasArrendador2025.censo.propietario = 'otro-sintetico' }],
 ['otros incentivos', c => { c.asturiasArrendador2025.censo.otrosIncentivos = 'si' }],
 ['otros inmuebles', c => { c.asturiasArrendador2025.censo.otrosInmuebles = 'si' }],
 ['otros pagadores', c => { c.asturiasArrendador2025.censo.otrosPagadores = 'si' }],
 ['repercusión original', c => { c.inmuebles[0]!.contrato.repercusionObras = '1' }],
 ['obligaciones arrendatario', c => { c.asturiasArrendador2025.precio.obligacionesArrendatario = '1' }],
 ['consulta fallida', c => { c.asturiasArrendador2025.origen = 'error-consulta' }],
 ['índice numérico inyectado', c => { Reflect.set(c.asturiasArrendador2025, 'rentaMensual', '1000') }],
 ['extensión nula', c => { Reflect.set(c, 'asturiasArrendador2025', null) }],
 ['extensión ausente', c => { Reflect.deleteProperty(c, 'asturiasArrendador2025') }],
 ['gasto repetido con otro identificador', c => {
  c.inmuebles[0]!.gastos.push({ ...c.inmuebles[0]!.gastos[0]!, id: 'repetido-sintetico' })
 }],
 ['solicitud externa adicional', c => { Reflect.set(c, 'deduccionesTerritoriales2025', { solicitudes: [] }) }],
]
describe('Revisión independiente Asturias: adversas y oráculos', () => {
 for (const gasto of ['0.01', '199.99', '499.99', '500.01'])
  it.effect('conserva la reserva RNR/50% del positivo original ' + gasto, () => Effect.gen(function* () {
   const c=raw();c.inmuebles[0]!.gastos[0]!.importe=c.inmuebles[0]!.gastos[0]!.totalFactura=gasto
   const fallo=yield* Effect.flip(ejecutar(c,'explicita'))
   expect(fallo._tag).toBe('RechazoP4a')
   expect(fallo.motivo).toContain('frontera RNR/50%')
  }))
 for (const api of ['explicita', 'canonica'] as const) {
  for (const [nombre, cambiar] of cambios) it.effect(api + ' rechaza ' + nombre, () => Effect.gen(function* () {
   const c = raw(); cambiar(c)
   const r = yield* Effect.result(ejecutar(c, api))
   expect(r._tag).toBe('Failure')
  }))
  for (const clave of ['catastro', 'titulo', 'contrato', 'acreditacion', 'localizacion', 'censo', 'rendimiento', 'documento'])
   it.effect(api + ' rechaza omisión ' + clave, () => Effect.gen(function* () {
    const c = raw()
    Reflect.deleteProperty(c.asturiasArrendador2025, clave)
    const r = yield* Effect.result(ejecutar(c, api))
    expect(r._tag).toBe('Failure')
   }))
  for (const gasto of ['0', '0.01', '199.99', '499.99', '500', '500.01', '1000'])
   it.effect(api + ' generación, cuota y consumo único ' + gasto, () => Effect.gen(function* () {
    const c = raw(); c.inmuebles[0]!.gastos[0]!.importe = c.inmuebles[0]!.gastos[0]!.totalFactura = gasto
    // 62.5% de 120040 produce coste 75025 y amortización 2250.75 exactos;
    // con gasto impar el RNR queda en céntimos. El esperado de deducción no cambia.
    if(euros(gasto).n%2n!==0n){
     c.inmuebles[0]!.adquisicion.precio='120040'
     c.inmuebles[0]!.catastro2025.construccion='62500'
     c.inmuebles[0]!.catastro2025.suelo='37500'
    }
    const { asturiasArrendador2025, ...base } = c
    expect(asturiasArrendador2025).toBeDefined()
    const antes = yield* ejecutar({ ...base, otrasDeducciones: 'ninguna' }, api)
    const despues = yield* ejecutar(c, api)
    const esperado = decimalExacto(oraculo(gasto, '10000').aplicado)
    expect(antes.cuotaDiferencial.minus(despues.cuotaDiferencial).eq(esperado)).toBe(true)
    expect(antes.composicion.cuotaPosterior.minus(despues.composicion.cuotaPosterior).eq(esperado)).toBe(true)
    expect(despues.composicion.deduccionesAutonomicasAplicadas.eq(esperado)).toBe(true)
    expect(despues.retenciones.eq(antes.retenciones)).toBe(true)
    expect(despues.baseImponibleGeneral.eq(antes.baseImponibleGeneral)).toBe(true)
    expect(despues.inmuebles).toEqual(antes.inmuebles)
    expect(despues.composicion.deduccionesTerritoriales2025!.aplicaciones).toHaveLength(1)
    expect(despues.aceptacionFiscal).toBe('pendiente')
   }))
 }
 for (const gasto of ['0', '0.01', '499.99', '500', '500.01', '1000'])
  for (const cuota of ['0', '0.01', '40', '499.99', '500', '500.01'])
   it('B común: gasto ' + gasto + ', cuota ' + cuota, () => {
    const c = raw(); c.inmuebles[0]!.gastos[0]!.importe = c.inmuebles[0]!.gastos[0]!.totalFactura = gasto
    // SAFETY: fixture sintético válido; el productor valida su contrato.
    const s = producirSolicitudAsturiasArrendador2025(c as CasoTrabajoAlquilerOrdinario2025)!
    const m = marcoPropioB('asturias', c.edad)
    const marco = { ...m, caso: { ...m.caso, contribuyenteId: c.contribuyenteId }, cuotaAutonomica: decimalB(cuota) }
    const salida = aplicarDeduccionesTerritoriales2025(s, marco), o = oraculo(gasto, cuota)
    expect(igual({ n: BigInt(salida.total.numeradorEuros), d: BigInt(salida.total.divisor) }, o.aplicado)).toBe(true)
    expect(salida.aplicaciones).toHaveLength(1)
    const g = salida.aplicaciones[0]!.generado
    if(g===undefined)throw new Error('Generación ausente del libro común')
    expect(igual({ n: BigInt(g.numeradorEuros), d: BigInt(g.divisor) }, o.generado)).toBe(true)
    expect(() => aplicarDeduccionesTerritoriales2025({ solicitudes: [...s.solicitudes, ...s.solicitudes] }, marco)).toThrow()
   })
 it('oráculo rechaza dinero inválido', () => {
  for (const s of ['-1', 'NaN', '1.001', '']) expect(() => euros(s)).toThrow()
 })
})
