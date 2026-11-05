import { it, expect } from 'vitest'
import { fixture, total, ambas, codes, doc, capturas } from './p5a-contraste-fixture.mjs'
import { racional } from '../lib/dominio/irpf/deducciones/anual-territorial-racional'

function verificar(s, esperado) {
  expect(total(s)).toEqual(racional(esperado))
  expect(ambas(s)).toEqual([racional(esperado), racional(esperado)])
}
function financiada() {
  const f = fixture(codes[1])
  f.s.hechos.codigo = codes[0]
  return f
}
function rechazar(s, motivo) {
  expect(() => total(s)).toThrow(motivo)
  for (const error of capturas(s)) {
    expect(error._tag).toBe('ResultadoNoSoportado')
    expect(JSON.stringify(error)).toMatch(motivo)
    expect('importe' in error || 'total' in error).toBe(false)
    expect('deduccionesTerritoriales2025' in error).toBe(false)
  }
}
for (const code of codes) {
  for (const excepcion of ['ninguna', 'ocupacion', 'permanencia', 'ambas']) {
    it(`abandono víspera compra, documentos ${excepcion}: ${code}`, () => {
      const { s, v } = fixture(code)
      v.primeraOcupacion = '2020-03-01'
      v.inmueble.residencia = { desde: '2020-03-01', hasta: '2025-02-28' }
      if (['ocupacion', 'ambas'].includes(excepcion)) v.excepcionOcupacion = doc('plazo')
      if (['permanencia', 'ambas'].includes(excepcion)) v.excepcionPermanencia = doc('traslado')
      verificar(s, '0')
    })
  }
  it(`ocupación previa continua y tres años ya transcurridos: ${code}`, () => {
    const { s, v } = fixture(code)
    v.primeraOcupacion = '2020-03-01'
    v.inmueble.residencia = { desde: '2020-03-01', hasta: '2025-12-31' }
    verificar(s, code === codes[0] ? '452' : '382.5')
  })
  it(`ocupación posterior dentro de doce meses, expectativa: ${code}`, () => {
    const { s, v } = fixture(code)
    v.primeraOcupacion = '2026-03-01'
    v.inmueble.residencia = { desde: '2026-03-01', hasta: '2029-03-01' }
    verificar(s, code === codes[0] ? '452' : '382.5')
  })
  it(`fuera de doce meses sin excepción: ${code}`, () => {
    const { s, v } = fixture(code)
    v.primeraOcupacion = '2026-03-02'
    v.inmueble.residencia = { desde: '2026-03-02', hasta: '2029-03-02' }
    verificar(s, '0')
  })
}
it('32.2 precio directo1200: cuota60, sin ocultación por límite452', () => {
  const { s, p, v } = fixture(codes[0])
  p.adquisicion.precio = v.inmueble.precioAdquisicion = '1200'
  p.movimientos.find(x => x.id === 'P').importe = '1200'
  p.movimientos.find(x => x.id === 'C').importe = '28800'
  v.pagos[0].importe = s.inversionesViviendaEjercicio[0].importe = '1200'
  verificar(s, '60')
})
it('32.2 financiada válida rechazada con motivo concreto', () => {
  rechazar(financiada().s, /32.2: financiación no representada/)
})
for (const variante of ['solo-null', 'sin-censo', 'sin-flujos', 'sin-ambos', 'sin-patrimonio']) {
  it(`32.2 no eludible: ${variante}`, () => {
    const { s, p } = financiada()
    if (variante === 'sin-patrimonio') delete s.patrimonioP5a
    else {
      p.prestamo = null
      if (['sin-censo', 'sin-ambos'].includes(variante)) p.censo = p.censo.filter(x => x.id !== 'L')
      if (['sin-flujos', 'sin-ambos'].includes(variante)) p.movimientos = p.movimientos.filter(x => !['D', 'A', 'F', 'G'].includes(x.id))
    }
    rechazar(s, /P5a/)
  })
}
it('32.2 sin préstamo pero censo de deuda añadido se rechaza', () => {
  const { s, p } = fixture(codes[0])
  p.censo.push({ ...p.censo[0], id: 'DEUDA', tipo: 'prestamo', inicio: 'ausente' })
  rechazar(s, /censo/)
})
